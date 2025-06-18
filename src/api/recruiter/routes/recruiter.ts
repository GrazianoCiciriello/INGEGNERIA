/**
 * recruiter router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/recruiter',
      handler: 'api::recruiter.recruiter.find',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
