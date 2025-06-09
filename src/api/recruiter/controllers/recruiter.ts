export default {
  async find(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('Utente non autenticato');
      }
      const userId = user.id;

      const recruiter = await strapi.entityService.findMany('api::recruiter.recruiter', {
        filters: {
          nome_utente: {
            id: userId
          }
        }
      });

      ctx.body = recruiter;
    } catch (err) {
      ctx.throw(500, 'Errore nel recupero dei recruiter');
    }
  },
};
