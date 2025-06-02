const tipiConsentiti = ["Candidato", "Recruiter", "Amministratore", "Azienda"] as const;
const candidatoService = strapi.service('api::candidato.candidato');// ci serve per eliminare candidato quando eliminamo l account

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

  if (!user) {
    return ctx.unauthorized('Utente non autenticato.');
  }

  try {
    // Elimina prima l'istanza candidato collegata, se esiste
    await candidatoService.eliminaCandidatoByUserId(user.id);

    // Poi elimina l'utente
    await strapi.db.query('plugin::users-permissions.user').delete({
      where: { id: user.id },
    });

    ctx.send({ message: 'Utente eliminato con successo.' });
  } catch (error) {
    console.error(error);
    ctx.internalServerError('Errore durante l\'eliminazione dell\'utente.');
  }
},


  // FUNZIONE PER AGGIORNARE IL TIPO UTENTE
async aggiornaTipoUtente(ctx: any) {
  const user = ctx.state.user;

  if (!user) {
    return ctx.unauthorized('Utente non autenticato.');
  }

  const { tipoUtente } = ctx.request.body;

  if (!tipoUtente || !tipiConsentiti.includes(tipoUtente)) {
    return ctx.badRequest('TipoUtente non valido.');
  }

  try {
    // Aggiorna l'utente con il nuovo tipo
    const updatedUser = await strapi.entityService.update(
      'plugin::users-permissions.user',
      user.id,
      { data: { TipoUtente: tipoUtente } }
    );

    // Se tipoUtente è "Candidato", crea l'istanza candidato se non esiste già
    if (tipoUtente === 'Candidato') {
      const candidatoEsistente = await strapi.db.query('api::candidato.candidato').findOne({
        where: { ID_Utente: user.id }
      });

      if (!candidatoEsistente) {
        await strapi.entityService.create('api::candidato.candidato', {
          data: {
            ID_Utente: user.id,
            Nome_Utente: updatedUser.username,
          },
        });
      }
    }

    // Qui puoi estendere con else if per recruiter, azienda ecc.

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
    console.error(error);
    return ctx.internalServerError('Errore durante l\'aggiornamento del tipo utente.');
  }
}

};
