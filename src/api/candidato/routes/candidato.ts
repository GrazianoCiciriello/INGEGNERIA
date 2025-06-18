/**
 * candidato router
 */
export default {
  routes: [
    // Rotte CRUD di default
    {
      method: 'GET',
      path: '/candidati',
      handler: 'candidato.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/candidati/:id',
      handler: 'candidato.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/candidati',
      handler: 'candidato.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/candidati/:id',
      handler: 'candidato.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/candidati/:id',
      handler: 'candidato.delete',
      config: { policies: [] },
    },

    // Rotta custom per compilare il profilo attitudinale
    {
      method: 'PUT',
      path: '/candidati/me/profilo-attitudinale',
      handler: 'candidato.compilareProfiloAttitudinale',
      config: { auth: {} },
    },

    // Rotta custom per aggiungere un'offerta ai preferiti
    {
      method: 'PUT',
      path: '/candidati/me/preferiti/:offertaId',
      handler: 'candidato.salvareOffertaTraPreferiti',
      config: { auth: {} },
    },

    // Rotta custom per rimuovere un'offerta dai preferiti
    {
      method: 'DELETE',
      path: '/candidati/me/preferiti/:offertaId',
      handler: 'candidato.rimuovereOffertaDaPreferiti',
      config: { auth: {} },
    },
    {
      method: "POST",
      path: "/candidati/me/offerte/:offertaId/colloqui", // Candidate books a colloquio for a specific offer
      handler: "candidato.prenotareColloquio", // Points to the controller action
      config: {
        auth: {}, // Requires authentication. User must be logged in.
        policies: [], // Add policies if needed, e.g., ensure user is 'Candidato' role.
        // Example: policies: ['global::is-candidato'], if you create such a policy
      },
    },
    {
      method: "GET",
      path: "/candidati/me/offerte/:offertaId/flessibilita",
      handler: "candidato.valutareFlessibilitaLavorativa",
      config: {
        auth: {}, // Requires authentication
        // policies: ['global::is-candidato'], // Example: if you have a policy to ensure user is 'Candidato'
      },
    },

        {
      method: "GET",
      path: "/candidati/me/candidature", // Candidate monitors the status of their applications
      handler: "candidato.monitorareStatoCandidatura", // Points to the controller action
      config: {
        auth: {}, // Requires authentication
        // policies: ['global::is-candidato'], // Esempio se hai una policy per assicurare che l'utente sia 'Candidato'
      },
    },
  ],
};
