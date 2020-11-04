import "reflect-metadata";
import express from "express";
import Router from "./router";

export class App {
  private app: express.Application;
  private readonly port = 5000;

  constructor() {
    this.app = express();
    Router.register(this.app);
  }

  run() {
    this.app.listen(this.port, () =>
      console.log(`Running on port ${this.port}`)
    );
  }
}
