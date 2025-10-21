import {
  Server,
  HandleCallback,
  ListinerCallback,
} from "../interfaces/server.js";
import http from "http";
import url from "url";

export default class Http {
  private __handlers = {};
  private __instance: Server | null = null;

  use(path: string | "*", handler: HandleCallback) {}

  controller(path: string, callback: HandleCallback) {}

  listen(port: number, callback: ListinerCallback) {
    //creation server
    const server = http.createServer((req, res) => {
      callback();
    });
  }
}
