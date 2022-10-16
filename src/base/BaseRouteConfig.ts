import { Application } from 'express';
export abstract class BaseRoutesConfig<T> {
  private _name: string;
  app: Application;
  constructor(app: Application, name: string, public controller: T) {
    this._name = name;
    this.app = app;
    this.configureRoutes();
  }

  get name(): string {
    return this._name;
  }

  get pathPrefix(): string {
    return process.env.PATH_PREFIX ?? '';
  }

  abstract configureRoutes(): Application;
  abstract get route(): string;
}
