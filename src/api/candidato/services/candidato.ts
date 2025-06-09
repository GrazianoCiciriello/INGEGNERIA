
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::candidato.candidato', ({ strapi }) => ({
  //Creazione candidato(chiamato in aggiornatipoutente in user)
  async creaCandidatoDaUser(user: any) {
    try {
        //attenzione potrebbe non funIonare il create in base alla versione
      const candidato = await strapi.entityService.create('api::candidato.candidato', {
        data: {
          idUtente: user.id,         // campo relazione oneToOne con user
          Nome_Utente: user.username, // campo string username
        },
      });
      return candidato;
    } catch (error) {
      strapi.log.error('Errore nella creazione del candidato:', error);
      throw error;
    }
  },
  //elimina candidato (chiamato in elimina user)
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
}


}));