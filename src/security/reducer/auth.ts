import { Action, Handler } from "../../decorators/index.js";

@Handler("auth")
export default class Auth {
  @Action()
  register() {}

  @Action()
  login() {}

  @Action()
  refresh() {}

  @Action()
  logout() {}

  @Action()
  me() {}

  @Action()
  changePassword() {}

  @Action()
  forgotPassword() {}

  @Action()
  resetPassword() {}
}

/*
    {
        handler: auth,
        action: register,
        payload: {
            em: "",
            ps: ""
        }
    }
*/
