/**
 * candidato controller
 */
import { factories } from "@strapi/strapi";

interface PopulatedUser {
  id: number;
  username: string;
  email: string;
  role?: {
    id: number;
    name: string;
    description?: string;
    type?: string;
  };
}

export default factories.createCoreController(
  "api::candidato.candidato",
  ({ strapi }) => ({
    /**
     * Compila o aggiorna il profilo attitudinale e le preferenze del candidato
     */
    async compilareProfiloAttitudinale(ctx) {
      try {
        const { user } = ctx.state;
        const { data } = ctx.request.body;

        if (!user) {
          return ctx.unauthorized(
            "Devi essere autenticato per compilare il profilo."
          );
        }

        // Controllo ruolo 'candidato'
        const populatedUser = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          user.id,
          { populate: ["role"] }
        )) as PopulatedUser;
        if (populatedUser.role?.name?.toLowerCase() !== "candidato") {
          return ctx.forbidden(
            "Solo gli utenti candidati possono compilare questo profilo."
          );
        }

        if (!data || (!data.ProfiloAttitudinale && !data.Preferenze)) {
          return ctx.badRequest(
            "Dati per il profilo attitudinale o preferenze mancanti nel corpo della richiesta."
          );
        }

        const payload: Record<string, any> = {};
        if (data.ProfiloAttitudinale) {
          payload.ProfiloAttitudinale = data.ProfiloAttitudinale;
        }
        if (data.Preferenze) {
          payload.Preferenze = data.Preferenze;
        }

        const updated = await strapi
          .service("api::candidato.candidato")
          .compilareProfiloAttitudinale(user.id, payload);

        const sanitized = await this.sanitizeOutput(updated, ctx);
        return this.transformResponse(sanitized);
      } catch (error) {
        strapi.log.error(
          "Errore durante la compilazione del profilo attitudinale:",
          error
        );
        if (error.message.startsWith("Nessun profilo candidato trovato")) {
          return ctx.notFound(error.message);
        }
        return ctx.internalServerError(
          "Errore interno del server durante la compilazione del profilo."
        );
      }
    },

    /**
     * Aggiunge un'offerta tra i preferiti del candidato
     */
    async salvareOffertaTraPreferiti(ctx) {
      try {
        const { user } = ctx.state;
        const { offertaId } = ctx.params;

        if (!user) {
          return ctx.unauthorized(
            "Devi essere autenticato per salvare un'offerta."
          );
        }

        // Controllo ruolo 'candidato'
        const populatedUserSave = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          user.id,
          { populate: ["role"] }
        )) as PopulatedUser;
        if (populatedUserSave.role?.name?.toLowerCase() !== "candidato") {
          return ctx.forbidden(
            "Solo gli utenti candidati possono salvare offerte."
          );
        }

        if (!offertaId) {
          return ctx.badRequest("ID dell'offerta mancante.");
        }
        const idNum = parseInt(offertaId, 10);
        if (isNaN(idNum)) {
          return ctx.badRequest("ID dell'offerta non valido.");
        }

        const updated = await strapi
          .service("api::candidato.candidato")
          .salvareOffertaTraPreferiti(user.id, idNum);

        const sanitized = await this.sanitizeOutput(updated, ctx);
        return this.transformResponse(sanitized);
      } catch (error) {
        strapi.log.error(
          "Errore durante il salvataggio dell'offerta tra i preferiti:",
          error
        );
        if (error.message.includes("non trovata")) {
          return ctx.notFound(error.message);
        }
        return ctx.internalServerError(
          "Errore interno del server durante il salvataggio dell'offerta."
        );
      }
    },

    /**
     * Rimuove un'offerta dai preferiti del candidato
     */
    async rimuovereOffertaDaPreferiti(ctx) {
      try {
        const { user } = ctx.state;
        const { offertaId } = ctx.params;

        if (!user) {
          return ctx.unauthorized(
            "Devi essere autenticato per rimuovere un'offerta dai preferiti."
          );
        }

        // Controllo ruolo 'candidato'
        const populatedUserRemove = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          user.id,
          { populate: ["role"] }
        )) as PopulatedUser;
        if (populatedUserRemove.role?.name?.toLowerCase() !== "candidato") {
          return ctx.forbidden(
            "Solo gli utenti candidati possono rimuovere offerte dai preferiti."
          );
        }

        if (!offertaId) {
          return ctx.badRequest("ID dell'offerta mancante.");
        }
        const idNum = parseInt(offertaId, 10);
        if (isNaN(idNum)) {
          return ctx.badRequest("ID dell'offerta non valido.");
        }

        await strapi
          .service("api::candidato.candidato")
          .rimuovereOffertaDaPreferiti(user.id, idNum);

        return ctx.send({ message: "Offerta rimossa dai preferiti con successo." });
      } catch (error) {
        strapi.log.error(
          "Errore durante la rimozione dell'offerta dai preferiti:",
          error
        );
        if (error.message.includes("non trovata")) {
          return ctx.notFound(error.message);
        }
        return ctx.internalServerError(
          "Errore interno del server durante la rimozione dell'offerta."
        );
      }
    },
        async prenotareColloquio(ctx) {
      try {
        const { user } = ctx.state; // Authenticated user from JWT
        const { offertaId } = ctx.params; // Get offertaId from URL parameter
        const { data: datiColloquio } = ctx.request.body; // Get colloquio data (e.g., { Data: "YYYY-MM-DD", Tipo: "Reale" }) from request body

        if (!user) {
          return ctx.unauthorized(
            "Devi essere autenticato per prenotare un colloquio."
          );
        }

        // Ensure the user has the 'candidato' role
        const populatedUser = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          user.id,
          { populate: ["role"] }
        )) as PopulatedUser; // Assuming PopulatedUser interface is defined as in your file

        if (populatedUser.role?.name?.toLowerCase() !== "candidato") {
          return ctx.forbidden(
            "Solo gli utenti candidati possono prenotare colloquia."
          );
        }

        if (!offertaId) {
          return ctx.badRequest(
            "ID dell'offerta mancante nei parametri della richiesta."
          );
        }

        const offertaIdNumber = parseInt(offertaId, 10);
        if (isNaN(offertaIdNumber)) {
          return ctx.badRequest("ID dell'offerta non valido.");
        }

        if (!datiColloquio || !datiColloquio.Data || !datiColloquio.Tipo) {
          return ctx.badRequest(
            "Dati per il colloquio (Data, Tipo) mancanti o incompleti nel corpo della richiesta."
          );
        }

        // Validate date format if necessary here, e.g., using a library like Moment.js or date-fns,
        // or a regex, to ensure `datiColloquio.Data` is a valid date string.

        const colloquioPrenotato = await strapi
          .service("api::candidato.candidato")
          .prenotareColloquio(user.id, offertaIdNumber, datiColloquio);

        const sanitizedEntity = await this.sanitizeOutput(
          colloquioPrenotato,
          ctx
        );
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        strapi.log.error(
          "Errore durante la prenotazione del colloquio:",
          error
        );
        if (error.message.includes("non trovat")) {
          // Catches "profilo candidato" or "offerta di lavoro" not found
          return ctx.notFound(error.message);
        }
        return ctx.internalServerError(
          "Errore interno del server durante la prenotazione del colloquio."
        );
      }
    },

        //FILTA OFFERE PER FLESSIBILITA LAVORATIVE
        async valutareFlessibilitaLavorativa(ctx) {
      try {
        const { user } = ctx.state; // Authenticated user
        const { offertaId } = ctx.params; // Get offertaId from URL parameter

        if (!user) {
          return ctx.unauthorized(
            "Devi essere autenticato per valutare la flessibilità dell'offerta."
          );
        }

        // Optional: Check if the user has the 'candidato' role
        const populatedUser = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          user.id,
          { populate: ["role"] }
        )) as PopulatedUser;

        if (populatedUser.role?.name?.toLowerCase() !== "candidato") {
          return ctx.forbidden(
            "Solo gli utenti candidati possono valutare la flessibilità delle offerte."
          );
        }

        if (!offertaId) {
          return ctx.badRequest(
            "ID dell'offerta mancante nei parametri della richiesta."
          );
        }

        const offertaIdNumber = parseInt(offertaId, 10);
        if (isNaN(offertaIdNumber)) {
          return ctx.badRequest("ID dell'offerta non valido.");
        }

        const flessibilitaData = await strapi
          .service("api::candidato.candidato")
          .valutareFlessibilitaLavorativa(offertaIdNumber);

        // Sanitize and transform response (standard practice)
        // Since this data is directly from an offer and likely non-sensitive,
        // default sanitization might be sufficient.
        const sanitizedEntity = await this.sanitizeOutput(
          flessibilitaData,
          ctx
        );
        return this.transformResponse(sanitizedEntity);
      } catch (error: any) {
        strapi.log.error(
          "Errore durante la valutazione della flessibilità lavorativa:",
          error
        );
        if (error.message.includes("Dati non trovati")) {
          return ctx.notFound("Dati richiesti non trovati."); // Generic error message
        }
        // Handle other potential errors, e.g., validation errors from service
        return ctx.internalServerError(
          "Errore interno del server durante la valutazione della flessibilità."
        );
      }
    },
        //MONITORA LO STATO DELLA CANDIDATURA
        async monitorareStatoCandidatura(ctx) {
      try {
        const { user } = ctx.state; // Authenticated user from JWT

        if (!user) {
          return ctx.unauthorized(
            "Devi essere autenticato per monitorare lo stato delle tue candidature."
          );
        }

        // Ensure the user has the 'candidato' role
        const populatedUser = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          user.id,
          { populate: ["role"] }
        )) as PopulatedUser;

        if (populatedUser.role?.name?.toLowerCase() !== "candidato") {
          return ctx.forbidden(
            "Solo gli utenti candidati possono monitorare lo stato delle candidature."
          );
        }

        const mieCandidature = await strapi
          .service("api::candidato.candidato")
          .getMieCandidature(user.id);

        const sanitizedEntity = await this.sanitizeOutput(mieCandidature, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        strapi.log.error(
          "Errore durante il monitoraggio dello stato delle candidature:",
          error
        );
        if (error.message.includes("Nessun profilo candidato trovato")) {
          return ctx.notFound(error.message);
        }
        if (error.message.includes("ID dell'utente non fornito")) {
          return ctx.badRequest(error.message);
        }
        return ctx.internalServerError(
          "Errore interno del server durante il monitoraggio dello stato delle candidature."
        );
      }
    },
  })

  
);
