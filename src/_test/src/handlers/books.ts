import { Handler, Method } from "../../../server/index.js";
import { Global } from "../../../persistent/index.js";

@Handler("book")
export default class Books {
  @Global()
  topAcess!: [];

  @Method()
  getTopAcess() {
    return this.topAcess;
  }

  @Method()
  setNewAcess(payload: any) {}

  @Method()
  generateExtractForManagerTopAcess() {}
}
