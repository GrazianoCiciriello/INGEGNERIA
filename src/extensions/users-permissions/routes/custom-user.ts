export default {
  routes: [

    //CAMBIA PASSWORD
    {
      method: 'POST',
      path: '/users/change-password',
      handler: 'user.changePassword',
      config: {
        auth: {},//richiede autenticazione 
        policies: [],
      },
    },


    //AGGIORNA PROFILO
    {
      method: 'POST',
      path: '/users/update-profile',
      handler: 'user.updateProfile',
      config: {
        auth: {},//richiede autenticazione
        policies: [],
      },
    },


    //ELIMINA PROFILO
    {
      method: 'DELETE',
      path: '/users/delete-account',
      handler: 'user.deleteAccount',
      config: {
        auth: {}, // richiede autenticazione
        policies: [],
  },
},


    //AGGIONRA TIPO UTENTE
    {
    method: "PUT",
    path: "/user/aggiorna-tipo-utente",
    handler: "user.aggiornaTipoUtente",
    config: {
      auth: {}, //richiede autenticazione 
      policies: [],
    },
  },

  ],
};
