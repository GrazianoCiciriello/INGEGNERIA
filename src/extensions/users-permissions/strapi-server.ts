import customUserController from './controllers/custom-user';
import customUserRoutes from './routes/custom-user';

export default (plugin: any) => {
  plugin.controllers.user.changePassword = customUserController.changePassword;
  plugin.controllers.user.updateProfile = customUserController.updateProfile;

  plugin.routes['content-api'].routes.push(...customUserRoutes.routes);
  return plugin;
};
