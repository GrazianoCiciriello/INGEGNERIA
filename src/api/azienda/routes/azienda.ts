/**
 * azienda router
 */

export default {
  routes: [
    // === Rotte Standard (CRUD) ===
    {
      method: "GET",
      path: "/aziende",
      handler: "azienda.find",
      config: {
        auth: {},
      },
    },
    {
      method: "GET",
      path: "/aziende/:id",
      handler: "azienda.findOne",
      config: {
        auth: {},
      },
    },
    {
      method: "POST",
      path: "/aziende",
      handler: "azienda.create",
      config: {
        auth: {},
      },
    },
    {
      method: "PUT",
      path: "/aziende/:id",
      handler: "azienda.update",
      config: {
        auth: {},
      },
    },
    {
      method: "DELETE",
      path: "/aziende/:id",
      handler: "azienda.delete",
      config: {
        auth: {},
      },
    },

    // === Rotte Custom ===

    // PUT /aziende/profilo → aggiornare profilo aziendale dell’utente autenticato
    {
      method: "PUT",
      path: "/aziende/profilo",
      handler: "azienda.aggiornareProfiloAziendale",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },

    // GET /aziende/:id/testimonianze → visualizzare testimonianze associate all’azienda
    {
      method: "GET",
      path: "/aziende/:id/testimonianze",
      handler: "azienda.visualizzareTestimonianze",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },

    // GET /aziende/:id/candidati-compatibili?offertaId=123
    {
      method: "GET",
      path: "/aziende/:id/candidati-compatibili",
      handler: "azienda.visualizzareCandidatiCompatibili",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },
  ],
};
