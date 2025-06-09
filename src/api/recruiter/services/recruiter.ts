/**
 * recruiter service
 */

//elimina l'istanza collegata a user
export default {
  async eliminaByUserId(userId: number) {
  try {
    const recruiters = await strapi.entityService.findMany('api::recruiter.recruiter', {
      filters: {
  nome_utente: {
    id: userId
  }
}
    });

    for (const recruiter of recruiters) {
      await strapi.entityService.delete('api::recruiter.recruiter', recruiter.id);
      strapi.log.info(`Recruiter con utente ID ${userId} eliminato.`);
    }

    if (recruiters.length === 0) {
      strapi.log.info(`Nessun recruiter trovato con utente ID ${userId}`);
    }
  } catch (err) {
    strapi.log.error('Errore durante eliminazione recruiter:', err);
    throw err;
  }
}

};
