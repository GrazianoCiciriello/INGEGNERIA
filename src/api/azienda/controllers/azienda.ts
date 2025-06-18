import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::azienda.azienda', ({ strapi }) => ({
  /**
   * PUT /aziende/aggiorna-profilo
   * Aggiorna il profilo aziendale dell'utente autenticato
   */
  async aggiornareProfiloAziendale(ctx) {
    try {
      const { user } = ctx.state;
      const { data } = ctx.request.body;

      if (!user) {
        return ctx.unauthorized("Devi essere autenticato per aggiornare il profilo aziendale.");
      }

      // Controllo del ruolo (assicurati che 'role' sia popolato)
      if (user.role?.type !== "azienda") {
        return ctx.unauthorized("Solo gli utenti di tipo 'azienda' possono aggiornare il profilo aziendale.");
      }

      if (!data) {
        return ctx.badRequest("Dati per l'aggiornamento mancanti nel corpo della richiesta.");
      }

      const updatedAzienda = await strapi
        .service("api::azienda.azienda")
        .aggiornareProfiloAziendale(user.id, data);

      return this.transformResponse(updatedAzienda);
    } catch (error: any) {
      strapi.log.error("Errore durante l'aggiornamento del profilo aziendale:", error);
      if (error.message?.startsWith("Nessuna azienda trovata")) {
        return ctx.notFound(error.message);
      }
      return ctx.internalServerError("Errore interno del server durante l'aggiornamento del profilo.");
    }
  },

  /**
   * GET /aziende/:id/testimonianze
   * Restituisce le testimonianze associate a un'azienda
   */
  async visualizzareTestimonianze(ctx) {
    try {
      const { id: aziendaId } = ctx.params;

      if (!aziendaId) {
        return ctx.badRequest("ID dell'azienda mancante nei parametri del percorso.");
      }

      const testimonianze = await strapi
        .service("api::azienda.azienda")
        .getTestimonianze(aziendaId);

      return this.transformResponse(testimonianze);
    } catch (error: any) {
      strapi.log.error(`Errore durante il recupero delle testimonianze per l'azienda ID ${ctx.params.id}:`, error);
      if (error.message?.includes("Azienda non trovata")) {
        return ctx.notFound(error.message);
      }
      return ctx.internalServerError("Errore interno del server durante il recupero delle testimonianze.");
    }
  },

  /**
   * GET /aziende/:id/candidati-compatibili?offertaId=123
   * Restituisce i candidati compatibili per una determinata azienda (e opzionalmente offerta)
   */
  async visualizzareCandidatiCompatibili(ctx) {
    try {
      const { user } = ctx.state;
      const { id: aziendaId } = ctx.params;
      const { offertaId } = ctx.query;

      if (!user) {
        return ctx.unauthorized("Autenticazione richiesta.");
      }

      if (!aziendaId) {
        return ctx.badRequest("ID dell'azienda mancante.");
      }

      const candidatiCompatibili = await strapi
        .service("api::azienda.azienda")
        .getCompatibiliCandidati(
          parseInt(aziendaId, 10),
          offertaId ? parseInt(offertaId as string, 10) : undefined
        );

      return this.transformResponse(candidatiCompatibili);
    } catch (error: any) {
      strapi.log.error(`Errore durante il recupero dei candidati compatibili per l'azienda ID ${ctx.params.id}:`, error);
      if (
        error.message?.includes("not found") ||
        error.message?.includes("non trovata")
      ) {
        return ctx.notFound(error.message);
      }
      return ctx.internalServerError("Errore interno del server.");
    }
  },
}));
