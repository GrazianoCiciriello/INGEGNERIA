export default {
  routes: [
    {
      method: "GET",
      path: "/offerte",
      handler: "offerta-lavoro.find",
      config: {
        auth: false, // pubblica
      },
    },
    {
      method: "GET",
      path: "/offerte/:id",
      handler: "offerta-lavoro.findOne",
      config: {
        auth: false, // pubblica
      },
    },
    {
      method: "POST",
      path: "/offerte",
      handler: "offerta-lavoro.create",
      config: {
        auth: {}, // autenticazione richiesta
      },
    },
    {
      method: "PUT",
      path: "/offerte/:id",
      handler: "offerta-lavoro.update",
      config: {
        auth: {}, // autenticazione richiesta
      },
    },
    {
      method: "DELETE",
      path: "/offerte/:id",
      handler: "offerta-lavoro.delete",
      config: {
        auth: {}, // autenticazione richiesta
      },
    },
    {
      method: "POST",
      path: "/offerte/:id/chiudi",
      handler: "offerta-lavoro.chiudi",
      config: {
        auth: {}, // autenticazione richiesta
      },
    },
  ],
};
