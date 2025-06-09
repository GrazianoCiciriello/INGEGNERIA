import customUserController from './controllers/custom-user';
import customUserRoutes from './routes/custom-user';

export default (plugin: any) => {
  // Estendi i controller user con le funzioni custom, inclusa aggiornaTipoUtente
  plugin.controllers.user.changePassword = customUserController.changePassword;
  plugin.controllers.user.updateProfile = customUserController.updateProfile;
  plugin.controllers.user.deleteAccount = customUserController.deleteAccount;
  plugin.controllers.user.aggiornaTipoUtente = customUserController.aggiornaTipoUtente;

  // Aggiungi le rotte custom all'API content-api
  plugin.routes['content-api'].routes.push(...customUserRoutes.routes);


  return plugin;
};
