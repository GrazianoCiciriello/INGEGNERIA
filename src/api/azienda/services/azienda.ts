import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::azienda.azienda", ({ strapi }) => ({
  async eliminaByUserId(userId: number) {
    try {
      const aziende = await strapi.entityService.findMany("api::azienda.azienda", {
        filters: {
          nome_utente: {
            id: userId,
          },
        },
      });

      for (const azienda of aziende) {
        await strapi.entityService.delete("api::azienda.azienda", azienda.id);
        strapi.log.info(`Azienda con utente ID ${userId} eliminata.`);
      }

      if (aziende.length === 0) {
        strapi.log.info(`Nessuna azienda trovata con utente ID ${userId}`);
      }
    } catch (err) {
      strapi.log.error("Errore durante eliminazione azienda:", err);
      throw err;
    }
  },

  async aggiornareProfiloAziendale(userId: number, datiAggiornamento: any) {
    const aziende = await strapi.entityService.findMany("api::azienda.azienda", {
      filters: {
        nome_utente: {
          id: {
            $eq: userId,
          },
        },
      },
      populate: ["nome_utente"],
    });

    if (!aziende || aziende.length === 0) {
      throw new Error(`Nessuna azienda trovata per l'utente con ID ${userId}.`);
    }

    const aziendaRecord = aziende[0];

    const updatedAzienda = await strapi.entityService.update(
      "api::azienda.azienda",
      aziendaRecord.id,
      {
        data: datiAggiornamento,
      }
    );

    return updatedAzienda;
  },

  async getTestimonianze(aziendaId: number | string) {
    const azienda = await strapi.entityService.findOne(
      "api::azienda.azienda",
      aziendaId,
      {
        populate: {
          feedbacks: true,
        },
      }
    );

    if (!azienda) {
      throw new Error(`Azienda non trovata con ID ${aziendaId}.`);
    }

    return (azienda as any).feedbacks || [];
  },

  async getCompatibiliCandidati(aziendaId: number, offertaLavoroId?: number) {
    const azienda = await strapi.entityService.findOne("api::azienda.azienda", aziendaId);
    if (!azienda) throw new Error(`Azienda con ID ${aziendaId} non trovata.`);

    let offerteDaConsiderare = [];

    if (offertaLavoroId) {
      const offerte = await strapi.entityService.findMany("api::offerta-lavoro.offerta-lavoro", {
        filters: {
          ["azienda.id"]: {
            $eq: aziendaId,
          },
          statoOfferta: "attiva",
        } as any,
        populate: {
          azienda: true,
        } as any,
      });

      offerteDaConsiderare = offerte;
    }

    if (offerteDaConsiderare.length === 0) {
      return [];
    }

    const tuttiICandidati = await strapi.entityService.findMany("api::candidato.candidato", {
      populate: { preferenza: true },
    });

    const candidatiCompatibiliPerOfferta = [];

    for (const offerta of offerteDaConsiderare) {
      const requisitiOfferta = ((offerta as any).requisiti || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      const candidatiPerQuestaOfferta = [];

      for (const candidato of tuttiICandidati) {
        const areaInteresse = (candidato as any).preferenza?.Area_Interesse ?? "";
        const localita = (candidato as any).preferenza?.localita ?? "";
        const tipoContratto = (candidato as any).preferenza?.Tipo_Contratto ?? "";

        const testoCandidato = [
          candidato.ProfiloAttitudinale ?? "",
          areaInteresse,
          localita,
          tipoContratto,
        ]
          .join(" ")
          .toLowerCase();

        const matchCount = requisitiOfferta.filter((requisito) =>
          testoCandidato.includes(requisito)
        ).length;

        if (matchCount > 0) {
          candidatiPerQuestaOfferta.push({
            id: candidato.id,
            nome: candidato.Nome_Utente ?? "Nome non disponibile",
            cognome: "", // Se c'è campo cognome aggiungilo qui
            profiloAttitudinale: candidato.ProfiloAttitudinale ?? "",
            matchScore: matchCount,
          });
        }
      }

      candidatiCompatibiliPerOfferta.push({
        offertaId: offerta.id,
        titoloOfferta: (offerta as any).Titolo,
        compatibili: candidatiPerQuestaOfferta,
      });
    }

    return candidatiCompatibiliPerOfferta;
  },
}));
