const tipiConsentiti = ["Candidato", "Recruiter", "Amministratore", "Azienda"] as const;
type TipoUtente = typeof tipiConsentiti[number];
type ContentType = 
  | 'api::candidato.candidato' 
  | 'api::recruiter.recruiter' 
  | 'api::azienda.azienda' 
  | 'api::amministratore.amministratore';

const creaSeNonEsiste = async (
  contentType: ContentType, 
  filtro: any, 
  dati: any
) => {
  const esiste = await strapi.db.query(contentType).findOne({ where: filtro });
  if (!esiste) {
    await strapi.entityService.create(contentType, { data: dati });
    strapi.log.info(`Creato nuovo ${contentType} per user ID ${filtro.ID_Utente || filtro.nome_utente}`);
  }
};

export default {
  // FUNZIONE PER IL CAMBIO PASSWORD
  async changePassword(ctx: any) {
    const user = ctx.state.user;
    const { currentPassword, newPassword } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('Utente non autenticato.');
    }

    if (!currentPassword || !newPassword) {
      return ctx.badRequest('Password corrente e nuova sono obbligatorie.');
    }

    const isValid = await strapi
      .plugin('users-permissions')
      .service('user')
      .validatePassword(currentPassword, user.password);

    if (!isValid) {
      return ctx.badRequest('Password attuale non corretta.');
    }

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { password: newPassword },
    });

    ctx.send({ message: 'Password aggiornata con successo.' });
  },

  // FUNZIONE CAMBIO EMAIL E USERNAME
  async updateProfile(ctx: any) {
    const user = ctx.state.user;
    const { username, email } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('Utente non autenticato.');
    }

    if (!username && !email) {
      return ctx.badRequest('Almeno uno tra username o email è obbligatorio.');
    }

    if (email) {
      const existingEmailUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          email: email.toLowerCase(),
          id: { $ne: user.id },
        },
      });

      if (existingEmailUser) {
        return ctx.badRequest('Email già in uso.');
      }
    }

    if (username) {
      const isValidUsername = /^[a-zA-Z0-9_]+$/.test(username);
      if (!isValidUsername) {
        return ctx.badRequest('Lo username può contenere solo lettere, numeri e underscore.');
      }

      const existingUsernameUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          username: username,
          id: { $ne: user.id },
        },
      });

      if (existingUsernameUser) {
        return ctx.badRequest('Username già in uso.');
      }
    }

    try {
      const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          ...(username && { username }),
          ...(email && { email: email.toLowerCase() }),
        },
      });

      ctx.send({ message: 'Profilo aggiornato con successo.', user: updatedUser });
    } catch (error) {
      console.error(error);
      ctx.internalServerError('Errore durante l\'aggiornamento del profilo.');
    }
  },

  // FUNZIONE ELIMINA ACCOUNT
async deleteAccount(ctx: any) {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized('Utente non autenticato.');

  const tipi = ['candidato', 'recruiter', 'azienda', 'amministratore'];

  try {
    // Elimina manualmente tutte le entità collegate
for (const tipo of tipi) {
  console.log(`Eliminazione dati per tipo: ${tipo}`);
  await strapi.service(`api::${tipo}.${tipo}`).eliminaByUserId(user.id);
}

console.log('Eliminazione utente con ID:', user.id);
await strapi.entityService.delete('plugin::users-permissions.user', user.id);

    ctx.send({ message: 'Utente e dati collegati eliminati con successo.' });
  } catch (error) {
    console.error('Errore durante eliminazione account:', error);
    ctx.internalServerError('Errore durante l\'eliminazione dell\'utente.');
  }
},




// FUNZIONE PER AGGIORNARE IL TIPO UTENTE
  async aggiornaTipoUtente(ctx: any) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Utente non autenticato.');

    const { tipoUtente } = ctx.request.body;

    if (!tipoUtente || !tipiConsentiti.includes(tipoUtente)) {
      return ctx.badRequest('TipoUtente non valido.');
    }

    try {
      // Aggiorna il tipo utente
      const updatedUser = await strapi.entityService.update(
        'plugin::users-permissions.user',
        user.id,
        { data: { TipoUtente: tipoUtente } }
      );

      switch (tipoUtente) {
        case "Candidato":
          await creaSeNonEsiste(
            'api::candidato.candidato',
            { ID_Utente: user.id },
            {
              ID_Utente: user.id,
              Nome_Utente: updatedUser.username,
            }
          );
          break;

        case "Azienda":
          await creaSeNonEsiste(
            'api::azienda.azienda',
            { nome_utente: user.id },
            {
              nome_utente: user.id,
              Nome_Azienda: updatedUser.username,
            }
          );
          break;

        case "Recruiter":
          await creaSeNonEsiste(
            'api::recruiter.recruiter',
            { nome_utente: user.id },
            {
              nome_utente: user.id,
            }
          );
          break;

        case "Amministratore":
          await creaSeNonEsiste(
            'api::amministratore.amministratore',
            { nome_utente: user.id },
            {
              nome_utente: user.id,
            }
          );
          break;
      }

      return ctx.send({
        message: 'TipoUtente aggiornato con successo.',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          TipoUtente: updatedUser.TipoUtente,
        },
      });

    } catch (error) {
      console.error('Errore in aggiornaTipoUtente:', error);
      return ctx.internalServerError('Errore durante l\'aggiornamento del tipo utente.');
    }
  },


};
