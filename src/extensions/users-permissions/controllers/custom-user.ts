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
    // Gestione relazione per Azienda (campo nome_utente è relazione)
    if (contentType === 'api::azienda.azienda' && dati.nome_utente) {
      dati.nome_utente = dati.nome_utente; 
    }

    await strapi.entityService.create(contentType, { data: dati });

    strapi.log.info(
      `Creato nuovo ${contentType} per user ID ${filtro.ID_Utente || filtro.nome_utente}`
    );
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
// Funzione per aggiornare il tipo utente e il ruolo, con check manuale per evitare duplicati
async aggiornaTipoUtente(ctx: any) {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized('Utente non autenticato.');

  // Normalizzo l’input
  const tipoUtente = ctx.request.body.tipoUtente?.trim();
  const tipiConsentiti = ['Candidato', 'Azienda', 'Amministratore', 'Recruiter'];
  if (!tipoUtente || !tipiConsentiti.includes(tipoUtente)) {
    return ctx.badRequest('TipoUtente non valido.');
  }

  try {
    // 1. Trovo il ruolo corrispondente in users-permissions
    const role = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { name: tipoUtente },
    });
    if (!role) {
      return ctx.badRequest('Ruolo non trovato per il tipo utente specificato.');
    }

    // 2. Aggiorno l'utente con TipoUtente e role ID
    const updatedUser = await strapi.entityService.update(
      'plugin::users-permissions.user',
      user.id,
      {
        data: {
          TipoUtente: tipoUtente,
          role: role.id,
        },
      }
    );

    // 3. Creo l'entità specifica solo se non esiste già
    switch (tipoUtente) {
      case "Candidato": {
        // Controllo se esiste già un candidato per questo user
        const existing = await strapi.entityService.findMany(
          'api::candidato.candidato',
          { filters: { ID_Utente: user.id } }
        );
        if (!existing.length) {
          await strapi.entityService.create('api::candidato.candidato', {
            data: {
              ID_Utente: user.id,
              Nome_Utente: updatedUser.username,
            },
          });
        }
        break;
      }

      case "Azienda": {
        const existing = await strapi.entityService.findMany(
          'api::azienda.azienda',
          { filters: { nome_utente: user.id } }
        );
        if (!existing.length) {
          await strapi.entityService.create('api::azienda.azienda', {
            data: {
              nome_utente: user.id,
              Nome_Azienda: updatedUser.username,
            },
          });
        }
        break;
      }

      case "Recruiter": {
        const existing = await strapi.entityService.findMany(
          'api::recruiter.recruiter',
          { filters: { nome_utente: user.id } }
        );
        if (!existing.length) {
          await strapi.entityService.create('api::recruiter.recruiter', {
            data: {
              nome_utente: user.id,
            },
          });
        }
        break;
      }

      case "Amministratore": {
        const existing = await strapi.entityService.findMany(
          'api::amministratore.amministratore',
          { filters: { nome_utente: user.id } }
        );
        if (!existing.length) {
          await strapi.entityService.create('api::amministratore.amministratore', {
            data: {
              nome_utente: user.id,
            },
          });
        }
        break;
      }
    }

    // 4. Risposta di successo
    return ctx.send({
      message: 'TipoUtente e ruolo aggiornati con successo.',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        TipoUtente: updatedUser.TipoUtente,
        role: role.name,
      },
    });

  } catch (error) {
    console.error('Errore in aggiornaTipoUtente:', error);
    return ctx.internalServerError({
      message: 'Errore durante l\'aggiornamento del tipo utente.',
      error: error.message,
      stack: error.stack,
    });
  }
}



,


};
