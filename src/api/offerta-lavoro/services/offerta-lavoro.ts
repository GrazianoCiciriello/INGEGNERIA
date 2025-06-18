/**
 * offerta-lavoro service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::offerta-lavoro.offerta-lavoro",
  ({ strapi }) => ({
    /**
     * Crea una nuova offerta associandola al record "azienda"
     * che ha nome_utente = userId. Se non trova alcuna azienda,
     * lancia un errore.
     */
    async creaOfferta(userId: number, datiOfferta: any) {
      // 1) Trova il record "azienda" collegato a quell'utente
      const aziende = await strapi.entityService.findMany(
        "api::azienda.azienda",
        {
          filters: {
            // Filtriamo la relazione "nome_utente" in base all'id dell'utente autenticato
            nome_utente: {
              id: {
                $eq: userId,
              },
            },
          },
          fields: ["id"],
        }
      );

      if (!aziende || aziende.length === 0) {
        throw new Error(
          `Nessuna azienda trovata per l'utente con ID ${userId}`
        );
      }

      const aziendaRecord = aziende[0] as any;
      const aziendaId = aziendaRecord.id as number;

      // 2) Crea l'offerta usando l'ID reale del record "azienda"
      return strapi.entityService.create("api::offerta-lavoro.offerta-lavoro", {
        data: {
          ...datiOfferta,
          azienda: aziendaId,
          statoOfferta: "attiva",
          publishedAt: new Date(),
        },
        populate: ["azienda"] as any,
      });
    },

    /**
     * Aggiorna uno statoOfferta = "chiusa" e publishedAt = null
     */
    async chiudiOfferta(offertaId: number) {
      return strapi.entityService.update(
        "api::offerta-lavoro.offerta-lavoro",
        offertaId,
        {
          data: {
            statoOfferta: "chiusa",
            publishedAt: null,
          } as any, // cast perché publishedAt=nil non sempre tipizzato
        }
      );
    },

    /**
     * Aggiorna i requisiti testuali di un'offerta
     */
    async aggiornaRequisiti(offertaId: number, nuoviRequisiti: string) {
      return strapi.entityService.update(
        "api::offerta-lavoro.offerta-lavoro",
        offertaId,
        {
          data: { requisiti: nuoviRequisiti } as any,
        }
      );
    },

    /**
     * Ritorna tutte le candidature di una specifica offerta
     */
    async getCandidature(offertaId: number) {
      const offerta = await strapi.entityService.findOne(
        "api::offerta-lavoro.offerta-lavoro",
        offertaId,
        {
          populate: {
            candidature: {
              fields: ["*"],
              populate: { candidato: true },
            },
          } as any,
        }
      );
      return (offerta as any).candidature || [];
    },

    /**
     * Cerca offerte attive che contengono termineRicerca in titoloPosizione o requisiti
     */
    async cercaOfferte(termineRicerca: string) {
      return strapi.entityService.findMany(
        "api::offerta-lavoro.offerta-lavoro",
        {
          filters: {
            $or: [
              { titoloPosizione: { $containsi: termineRicerca } } as any,
              { requisiti: { $containsi: termineRicerca } } as any,
            ],
            statoOfferta: "attiva",
          },
          sort: { createdAt: "desc" },
          publicationState: "live",
        }
      );
    },
  })
);
