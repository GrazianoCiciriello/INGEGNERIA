/**
 * amministratore controller
 */

export default {
  async find(ctx: any) {
    try {
      const amministratori = await strapi.entityService.findMany('api::amministratore.amministratore', {
      });
      ctx.body = amministratori;
    } catch (err) {
      ctx.throw(500, 'Errore nel recupero degli amministratori');
    }
  },
};



