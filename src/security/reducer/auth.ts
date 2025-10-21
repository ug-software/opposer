import { Action, Reducer } from "../../decorators/index.js";

@Reducer("auth")
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
        reducer: auth,
        action: register,
        payload: {
            em: "",
            ps: ""
        }
    }
*/
