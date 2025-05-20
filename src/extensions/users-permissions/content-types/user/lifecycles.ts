export default {
  async afterCreate(event: any) {
    const { result } = event;

    const username = result.username;
    const tipoUtente = result.Tipo_Utente;

    const commonData = {
      nome_utente: username,
    };

    if (tipoUtente === 'Candidato') {
      await strapi.entityService.create('api::candidato.candidato', {
        data: commonData as any,
      });
    } else if (tipoUtente === 'Azienda') {
      await strapi.entityService.create('api::azienda.azienda', {
        data: commonData as any,
      });
    } else if (tipoUtente === 'Recruiter') {
      await strapi.entityService.create('api::recruiter.recruiter', {
        data: commonData as any,
      });
    } else if (tipoUtente === 'Amministratore') {
      await strapi.entityService.create('api::amministratore.amministratore', {
        data: commonData as any,
      });
    }
  },
};
