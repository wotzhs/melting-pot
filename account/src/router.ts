import { Application, Request, Response } from "express";
import { SignUpControlller } from "./controllers";

export interface Route {
  path: string;
  method: "get" | "post" | "put" | "delete" | "options";
  methodName: string;
}

export default class Router {
  static register(app: Application) {
    [SignUpControlller].forEach((controller) => {
      const instance = new controller();
      const prefix = Reflect.getMetadata("prefix", controller);
      const routes = Reflect.getMetadata("routes", controller);

      routes.forEach((route: Route) => {
        app[route.method](
          prefix + route.path,
          (req: Request, res: Response) => {
            instance[route.methodName](req, res);
          }
        );
      });
    });
  }
}
