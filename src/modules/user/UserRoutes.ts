import { Application } from 'express';
import { BaseRoutesConfig } from '../../base/BaseRouteConfig';
import UserController from './UserController';

export default class UserRoutes extends BaseRoutesConfig<UserController> {
  constructor(app: Application) {
    super(app, 'User Route', new UserController());
  }
  configureRoutes(): Application {
    this.app.route(this.route).get(this.controller.getAllUsers);
    return this.app;
  }
  get route(): string {
    return (process.env.PATH_PREFIX ?? '') + '/users';
  }
}
