import { factories } from '@strapi/strapi';

type ColloquioTipoEnum =
  | "Reale"
  | "Simulato"
  | "Telefonico"
  | "Videochiamata"
  | "In presenza"
  | "Tecnico"
  | "HR (risorse umane)"
  | "Panel (colloquio con più intervistatori)";

export default factories.createCoreService('api::candidato.candidato', ({ strapi }) => ({
  // Creazione candidato (chiamato in aggiornatipoutente in user)
  async creaCandidatoDaUser(user: any) {
    try {
      const candidato = await strapi.entityService.create('api::candidato.candidato', {
        data: {
          idUtente: user.id,          // campo relazione oneToOne con user
          Nome_Utente: user.username, // campo string username
        },
      });
      return candidato;
    } catch (error) {
      strapi.log.error('Errore nella creazione del candidato:', error);
      throw error;
    }
  },

  // Elimina candidato (chiamato in elimina user)
  async eliminaByUserId(userId: number) {
    try {
      const candidati = await strapi.entityService.findMany('api::candidato.candidato', {
        filters: {
          ID_Utente: {
            id: {
              $eq: userId,
            },
          },
        },
      });

      if (candidati.length > 0) {
        for (const candidato of candidati) {
          await strapi.entityService.delete('api::candidato.candidato', candidato.id);
          strapi.log.info(`Candidato con utente ID ${userId} eliminato.`);
        }
      } else {
        strapi.log.info(`Nessun candidato trovato con utente ID ${userId}`);
      }
    } catch (err) {
      strapi.log.error('Errore durante eliminazione candidato:', err);
      throw err;
    }
  },

  // Compila profilo attitudinale e preferenze
  async compilareProfiloAttitudinale(userId: number, data: { ProfiloAttitudinale?: string; Preferenze?: string }) {
    const ENUM_VALORI = [
      "Informatica e Software",
      "Ingegneria",
      "Sanità",
      "Educazione e Formazione",
      "Marketing e Comunicazione",
      "Vendite e Servizio Clienti",
      "Finanza e Contabilità",
      "Risorse Umane",
      "Legale e Giuridico",
      "Amministrazione e Segreteria",
      "Arte e Design",
      "Media e Giornalismo",
      "Costruzioni e Architettura",
      "Scienza e Ricerca",
      "Produzione e Manifattura",
      "Logistica e Trasporti",
      "Turismo e Ospitalità",
      "Agricoltura e Ambiente",
      "Servizi Sociali",
      "Sicurezza e Difesa",
      "Sport e Benessere",
      "Pubblica Amministrazione",
      "Imprenditoria",
      "Altro",
    ] as const;

    if (!data || (!data.ProfiloAttitudinale && !data.Preferenze)) {
      throw new Error("Dati per il profilo attitudinale o preferenze mancanti.");
    }

    if (data.Preferenze && !ENUM_VALORI.includes(data.Preferenze as any)) {
      throw new Error("Valore 'Preferenze' non valido.");
    }

    // Trova il candidato associato all'utente
    const [candidato] = await strapi.entityService.findMany('api::candidato.candidato', {
      filters: {
        ID_Utente: {
          id: userId,
        },
      },
    });

    if (!candidato) {
      throw new Error(`Nessun profilo candidato trovato per l'utente con ID ${userId}`);
    }

    const updated = await strapi.entityService.update('api::candidato.candidato', candidato.id, {
      data: {
        ...(data.ProfiloAttitudinale && { ProfiloAttitudinale: data.ProfiloAttitudinale }),
        ...(data.Preferenze && { Preferenze: data.Preferenze as (typeof ENUM_VALORI)[number] }),
      },
    });

    return updated;
  },

  // Aggiunge offerta tra preferiti
  async salvareOffertaTraPreferiti(userId: number, offertaId: number) {
    const [candidato] = await strapi.entityService.findMany("api::candidato.candidato", {
      filters: {
        ID_Utente: { id: userId },
      },
    });

    if (!candidato) {
      throw new Error(`Candidato con utente ID ${userId} non trovato.`);
    }

    const offerta = await strapi.entityService.findOne("api::offerta-lavoro.offerta-lavoro", offertaId);
    if (!offerta) {
      throw new Error(`Offerta con ID ${offertaId} non trovata.`);
    }

    const updated = await strapi.entityService.update("api::candidato.candidato", candidato.id, {
      data: {
        offertePreferite: {
          connect: [{ id: offertaId }],
        },
      },
      populate: ["offertePreferite"],
    }as any 
  );

    return updated;
  },

  //Rimuove offerta dai preferiti
  async rimuovereOffertaDaPreferiti(userId: number, offertaId: number) {
    const [candidato] = await strapi.entityService.findMany("api::candidato.candidato", {
      filters: {
        ID_Utente: { id: userId },
      },
    });

    if (!candidato) {
      throw new Error(`Candidato con utente ID ${userId} non trovato.`);
    }

    const offerta = await strapi.entityService.findOne("api::offerta-lavoro.offerta-lavoro", offertaId);
    if (!offerta) {
      throw new Error(`Offerta con ID ${offertaId} non trovata.`);
    }

    const updated = await strapi.entityService.update("api::candidato.candidato", candidato.id, {
      data: {
        offertePreferite: {
          disconnect: [{ id: offertaId }],
        },
      },
      populate: ["offertePreferite"],
    }as any
  );

    return updated;
  },

  //FUNZIONE PRENOTARE COLLOQUIO
  async prenotareColloquio(
      userId: number,
      offertaId: number,
      datiColloquio: { Data: string; Tipo: ColloquioTipoEnum }
    ) {
      // 1. Trova il record "Candidato" associato all'utente.
      //    La relazione 'ID_Utente' in 'api::candidato.candidato' punta a 'plugin::users-permissions.user'.
      const candidati = await strapi.entityService.findMany(
        "api::candidato.candidato",
        {
          filters: {
            ID_Utente: {
              // Assuming 'ID_Utente' is the correct field name for the relation to user
              id: userId,
            },
          },
        }
      );

      if (!candidati || candidati.length === 0) {
        throw new Error(
          `Nessun profilo candidato trovato per l'utente con ID ${userId}.`
        );
      }
      const candidatoRecord = candidati[0];

      // 2. Verifica che l'offerta di lavoro esista
      const offerta = await strapi.entityService.findOne(
        "api::offerta-lavoro.offerta-lavoro",
        offertaId
      );
      if (!offerta) {
        throw new Error(`Offerta di lavoro con ID ${offertaId} non trovata.`);
      }

      // 3. Crea il nuovo Colloquio
      const nuovoColloquio = await strapi.entityService.create(
        "api::colloquio.colloquio",
        {
          data: {
            Data: datiColloquio.Data,
            Tipo: datiColloquio.Tipo,
            Esito: "In attesa", // Default esito for a new colloquio
            candidato: candidatoRecord.id, // Link to the Candidato record
            offerta_lavoro: offertaId, // Link to the OffertaLavoro record
            publishedAt: new Date(), // Publish immediately
          } as any,
          populate: ["candidato", "offerta_lavoro"] as any, // Optionally populate response
        }
      );
      return nuovoColloquio;
    },
    
    /**
     * Permette a un candidato di valutare (visualizzare) i dettagli di flessibilità di un'offerta di lavoro.
     * @param offertaId - L'ID dell'offerta di lavoro.
     */
    async valutareFlessibilitaLavorativa(offertaId: number) {
      const offerta = await strapi.entityService.findOne(
        "api::offerta-lavoro.offerta-lavoro",
        offertaId,
        {
          // Explicitly select the fields you want to return for flexibility
          fields: [
            "id",
            "Titolo",
            "orarioLavoro",
            "modalitaLavoro",
            "tipoContratto",
            "retribuzionePrevista",
          ] as any,
        }
      );

      if (!offerta) {
        // Throw an error that will be caught by the controller
        throw new Error(`Dati non trovati per l'offerta con ID ${offertaId}.`);
      }

      // Return only the relevant flexibility details (or the whole offer subset)
      return {
        id: offerta.id,
        Titolo: (offerta as any).Titolo, // Adjust if field name casing is different
        orarioLavoro: (offerta as any).orarioLavoro,
        modalitaLavoro: (offerta as any).modalitaLavoro,
        tipoContratto: (offerta as any).tipoContratto,
        retribuzionePrevista: (offerta as any).retribuzionePrevista,
      };
    },

    // AGGIUNTA 2025-06-14
    /**
     * Recupera tutte le candidature inviate da un candidato.
     * @param userId - L'ID dell'utente autenticato (candidato).
     */
    async getMieCandidature(userId: number) {
      if (!userId) {
        throw new Error("ID dell'utente non fornito.");
      }

      // 1. Trova il record "Candidato" associato all'utente.
      const candidati = await strapi.entityService.findMany(
        "api::candidato.candidato",
        {
          filters: {
            ID_Utente: { id: userId },
          },
          populate: {
            candidature: {
              // Popola la relazione 'candidature' (oneToMany da Candidato a Candidatura)
              fields: ["id", "Stato", "DataCandidatura"], // Seleziona campi specifici da Candidatura
              populate: {
                // Popola opzionalmente relazioni dentro ogni Candidatura
                offerta_lavoro: {
                  // Popola l'offerta_lavoro correlata
                  fields: ["id", "Titolo"], // Seleziona campi specifici da OffertaLavoro
                },
              },
            },
          },
        }
      );

      if (!candidati || candidati.length === 0) {
        throw new Error(
          `Nessun profilo candidato trovato per l'utente con ID ${userId}.`
        );
      }

      const candidatoRecord = candidati[0] as any;

      if (
        !candidatoRecord.candidature ||
        candidatoRecord.candidature.length === 0
      ) {
        return []; // Nessuna candidatura trovata per questo candidato
      }

      // Restituisce la lista delle candidature
      return candidatoRecord.candidature;
    },
     /**
     * Recupera le testimonianze (feedback) per una specifica azienda.
     * @param aziendaId - L'ID dell'azienda per cui recuperare le testimonianze.
     */
    async getTestimonianzePerAzienda(aziendaId: number) {
      if (!aziendaId) {
        throw new Error("ID dell'azienda non fornito.");
      }

      const azienda = await strapi.entityService.findOne(
        "api::azienda.azienda",
        aziendaId
      );
      if (!azienda) {
        throw new Error(`Azienda con ID ${aziendaId} non trovata.`);
      }

      // Assuming 'feedback' is the correct API ID for your feedback collection type
      // And 'azienda_target' is the field in your feedback schema linking to the azienda
      const testimonianze = await strapi.entityService.findMany(
        "api::feedback.feedback",
        {
          filters: {
            azienda_target: { id: aziendaId }, // This is line 233 (approximately)
            // Potresti voler aggiungere altri filtri, ad esempio per un 'tipoFeedback' == 'testimonianza'
            // tipoFeedback: "Testimonianza", // Se hai un campo del genere
          } as any,
          populate: { mittente: { fields: ["username", "id"] } }, // Popola i dati del mittente se vuoi mostrarli
        }
      );

      if (!testimonianze || testimonianze.length === 0) {
        return ["Nessuna testimonianza trovata"]; // O un messaggio che indica nessuna testimonianza
      }

      return testimonianze;
    },
    /**
     * Recupera le simulazioni di colloquio per l'utente candidato specificato.
     * @param userId - L'ID dell'utente (collegato al candidato).
     */
    async getSimulazioniColloqui(userId: number) {
      if (!userId) {
        throw new Error("ID dell'utente non fornito.");
      }

      // 1. Trova il record "Candidato" associato all'utente.
      const candidati = await strapi.entityService.findMany(
        "api::candidato.candidato",
        {
          filters: {
            ID_Utente: { id: userId }, // Assicurati che 'ID_Utente' sia il nome corretto della relazione
          },
          populate: { colloqui: true }, // Popola la relazione 'colloqui'
        }
      );

      if (!candidati || candidati.length === 0) {
        throw new Error(
          `Nessun profilo candidato trovato per l'utente con ID ${userId}.`
        );
      }

      const candidatoRecord = candidati[0] as any; // Cast to any to access populated relations easily

      if (!candidatoRecord.colloqui || candidatoRecord.colloqui.length === 0) {
        return ["Nessuna testimonianza trovata"]; // Nessun colloquio associato
      }

      // 2. Filtra i colloquia per quelli di tipo "Simulato"
      const simulazioniColloqui = candidatoRecord.colloqui.filter(
        (colloquio: any) => colloquio.Tipo === "Simulato" // Assicurati che "Simulato" sia il valore esatto nell'enum
      );

      return simulazioniColloqui;
    },
}));
