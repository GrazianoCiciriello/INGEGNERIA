/**
 * azienda router
 */


export default {
  routes: [
    {
      method: 'GET',
      path: '/aziende',
      handler: 'api::azienda.azienda.find',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
