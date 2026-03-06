import type { OpposerMap } from "../../interfaces";

interface AppMapResponse {
  success: boolean;
  error?: string;
  data?: OpposerMap;
}

interface OpposerRequestResponse<T = any> {
  success: boolean;
  status: number;
  error?: string;
  data?: T;
}

async function getAppMap(): Promise<AppMapResponse> {
  return await fetch("/opposer-map.json", {
    method: "GET",
  })
    .then(async (res) => ({ success: true, data: await res.json() }))
    .catch((err) => ({ success: false, error: err.message }));
}

async function sendRequestOpposer<T = any>(props: string): Promise<OpposerRequestResponse<T>> {
  try {
    const res = await fetch("/opposer", {
      method: "POST",
      body: props,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const status = res.status;

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // resposta sem corpo JSON (204, etc.)
    }

    if (!res.ok) {
      return {
        success: false,
        status,
        error: data?.error || `HTTP ${status}`,
        data,
      };
    }

    return { success: true, status, data };
  } catch (err: any) {
    return {
      success: false,
      status: 0,
      error: err.message || "Erro de conexão",
    };
  }
}

export default { getAppMap, sendRequestOpposer };
