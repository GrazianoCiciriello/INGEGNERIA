/**
 * amministratore router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/amministratori',
      handler: 'api::amministratore.amministratore.find',
      config: {
        auth: false, // metti true se vuoi proteggerla
        policies: [],
      },
    },
  ],
};
