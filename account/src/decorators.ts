import { Route } from "./router";
// credits: https://nehalist.io/routing-with-typescript-decorators/
export namespace Methods {
  export const Get = (path: string): MethodDecorator => {
    return (target: object, propertyKey: string): void => {
      if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
      }

      const routes: Route[] = Reflect.getMetadata("routes", target.constructor);

      routes.push({
        method: "get",
        path,
        methodName: propertyKey,
      });
      Reflect.defineMetadata("routes", routes, target.constructor);
    };
  };
}

export const Controller = (prefix: string = ""): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata("prefix", prefix, target);
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
};
