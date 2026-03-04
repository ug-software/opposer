import playground from "./playground";

async function login(lg: string, ps: string) {
  return playground.sendRequestOpposer(
    JSON.stringify({
      handler: "Auth",
      method: "login",
      payload: { lg, ps },
    })
  );
}

async function me() {
  return playground.sendRequestOpposer(
    JSON.stringify({
      handler: "Auth",
      method: "me",
    })
  );
}

async function logout() {
  return playground.sendRequestOpposer(
    JSON.stringify({
      handler: "Auth",
      method: "logout",
    })
  );
}

export default { login, me, logout };
