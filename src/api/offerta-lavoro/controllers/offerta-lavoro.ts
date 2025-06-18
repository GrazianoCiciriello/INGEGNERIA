/**
 * offerta-lavoro controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::offerta-lavoro.offerta-lavoro",
  ({ strapi }) => ({
    /**
     * Crea un'offerta solo se l'utente è autenticato con ruolo "azienda"
     * e quell'utente è collegato a un record "azienda".
     */
    async create(ctx) {
      try {
        const { user } = ctx.state;
        const { data } = ctx.request.body;

        // 1) Controllo che l'utente esista e abbia ruolo "azienda"
        if (!user || user.role.type !== "azienda") {
          return ctx.unauthorized("Solo le aziende possono creare offerte");
        }

        // 2) Chiamo il service creaOfferta: se non trova azienda, lancia errore
        const offerta = await strapi
          .service("api::offerta-lavoro.offerta-lavoro")
          .creaOfferta(user.id, data);

        return this.transformResponse(offerta);
      } catch (error: any) {
        // Se l'errore è “Nessuna azienda trovata…”, restituisco 400 Bad Request
        if (error.message.startsWith("Nessuna azienda trovata")) {
          return ctx.badRequest(error.message);
        }
        // Altrimenti, error generico 500
        ctx.throw(500, error.message);
      }
    },

    /**
     * Chiude un'offerta solo se:
     * - l'utente è admin, oppure
     * - l'utente è proprietario dell'azienda a cui appartiene l'offerta
     */
    async chiudi(ctx) {
      try {
        const { id } = ctx.params;
        const { user } = ctx.state;

        // 1) Recupera l'offerta con la relazione azienda.nome_utente
        const offerta = await strapi.entityService.findOne(
  "api::offerta-lavoro.offerta-lavoro",
  id,
  {
    populate: {
      azienda: {
        populate: {
          nome_utente: true,
        },
      },
    } as any, // ← forza il compilatore a non lamentarsi
  }
);


        if (!offerta) {
          return ctx.notFound("Offerta non trovata");
        }

        // 2) Controllo che l'offerta abbia un record "azienda"
        const aziendaData = (offerta as any).azienda;
        if (!aziendaData) {
          return ctx.badRequest(
            "Questa offerta non è associata a nessuna azienda"
          );
        }

        // 3) Estrai l'ID dell'utente collegato all'azienda
        const aziendaUserId = aziendaData.nome_utente?.id;

        // 4) Controlla permessi: o admin, o proprietario azienda
        const isAdmin = user.role.type === "amministratore";
        const isOwner = aziendaUserId === user.id;

        if (!isAdmin && !isOwner) {
          return ctx.unauthorized("Non sei autorizzato");
        }

        // 5) Chiudo l'offerta
        const offertaChiusa = await strapi
          .service("api::offerta-lavoro.offerta-lavoro")
          .chiudiOfferta(id);

        return this.transformResponse(offertaChiusa);
      } catch (error) {
        strapi.log.error("Errore chiusura offerta:", error);
        ctx.throw(500, "Errore interno del server");
      }
    },
  }) // chiude l'oggetto con le funzioni custom
); // chiude createCoreController
