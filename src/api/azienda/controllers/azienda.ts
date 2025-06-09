/**
 * azienda controller
 */


export default {
  async find(ctx: any) {
    try {
      const aziende = await strapi.entityService.findMany('api::azienda.azienda', {
      });
      ctx.body = aziende;
    } catch (err) {
      ctx.throw(500, 'Errore nel recupero delle aziende');
    }
  },
};
