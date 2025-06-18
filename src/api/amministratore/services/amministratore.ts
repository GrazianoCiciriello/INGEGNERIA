/**
 * amministratore service
 */

//elimina l'isatnza collegata a user
export default {
  async eliminaByUserId(userId: number) {
  try {
    const amministratori = await strapi.entityService.findMany('api::amministratore.amministratore', {
      filters: {
  Nome_Utente: {
    id: userId
  }
}
    });

    for (const amministratore of amministratori) {
      await strapi.entityService.delete('api::amministratore.amministratore', amministratore.id);
      strapi.log.info(`Amministratore con utente ID ${userId} eliminato.`);
    }

    if (amministratori.length === 0) {
      strapi.log.info(`Nessun amministratore trovato con utente ID ${userId}`);
    }
  } catch (err) {
    strapi.log.error('Errore durante eliminazione amministratore:', err);
    throw err;
  }
},

};
