export default {
  //FUNZIONE PER IL CAMBIO PASSWORD
  async changePassword(ctx: any) {
    const user = ctx.state.user;
    const { currentPassword, newPassword } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('Utente non autenticato.');
    }

    if (!currentPassword || !newPassword) {
      return ctx.badRequest('Password corrente e nuova sono obbligatorie.');
    }

    // Validazione password attuale
    const isValid = await strapi
      .plugin('users-permissions')
      .service('user')
      .validatePassword(currentPassword, user.password);

    if (!isValid) {
      return ctx.badRequest('Password attuale non corretta.');
    }

    // Aggiorna password
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { password: newPassword },
    });

    ctx.send({ message: 'Password aggiornata con successo.' });
  },//FINE CAMBIO PASSWORD



  //FUNZIONE CAMBIO  EMAIL E USERNAME
  async updateProfile(ctx: any) {
    const user = ctx.state.user;
    const { username, email } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('Utente non autenticato.');
    }

    if (!username && !email) {
      return ctx.badRequest('Almeno uno tra username o email è obbligatorio.');
    }

    // VALIDAZIONE EMAIL UNICA
    if (email) {
      const existingEmailUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          email: email.toLowerCase(),
          id: { $ne: user.id }, // Escludi l'utente attuale
        },
      });

      if (existingEmailUser) {
        return ctx.badRequest('Email già in uso.');
      }
    }

    // VALIDAZIONE USERNAME UNICO + FORMATO
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
};




