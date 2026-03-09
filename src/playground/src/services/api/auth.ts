import playground from "./playground";

async function login(lg: string, ps: string) {
  return playground.sendRequestOpposer(
    JSON.stringify({
      controller: "Auth",
      method: "login",
      payload: { lg, ps },
    })
  );
}

async function me() {
  return playground.sendRequestOpposer(
    JSON.stringify({
      controller: "Auth",
      method: "me",
    })
  );
}

async function logout() {
  return playground.sendRequestOpposer(
    JSON.stringify({
      controller: "Auth",
      method: "logout",
    })
  );
}

export default { login, me, logout };
