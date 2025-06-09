/**
 * azienda service
 */

//elimina istanza collegata a user

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::candidato.candidato', ({ strapi }) => ({
async eliminaByUserId(userId: number) {
  try {
    const aziende = await strapi.entityService.findMany('api::azienda.azienda', {
      filters: {
        nome_utente: {
          id: userId
        },
      },
    });

    for (const azienda of aziende) {
      await strapi.entityService.delete('api::azienda.azienda', azienda.id);
      strapi.log.info(`Azienda con utente ID ${userId} eliminata.`);
    }

    if (aziende.length === 0) {
      strapi.log.info(`Nessuna azienda trovata con utente ID ${userId}`);
    }
  } catch (err) {
    strapi.log.error('Errore durante eliminazione azienda:', err);
    throw err;
  }
}


}));
