export default {
  routes: [
    {
      method: 'POST',
      path: '/users/change-password',
      handler: 'user.changePassword',
      config: {
        auth: {},
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/users/update-profile',
      handler: 'user.updateProfile',
      config: {
        auth: {},
        policies: [],
      },
    },
  ],
};
