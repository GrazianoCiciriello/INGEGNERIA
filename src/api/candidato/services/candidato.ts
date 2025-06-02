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
 async eliminaCandidatoByUserId(user: any) {
    const candidato = await strapi.entityService.findMany('api::candidato.candidato', {
      filters: { ID_Utente: user },
    });

    if (candidato.length > 0) {
      await strapi.entityService.delete('api::candidato.candidato', candidato[0].id);
    }
  }
}));