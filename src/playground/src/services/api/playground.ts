import type { OpposerMap } from "../../interfaces";

async function getAppMap(): Promise<{
  success: boolean;
  error?: string;
  data?: OpposerMap;
}> {
  return await fetch("/data/opposer-map.json", {
    method: "GET",
  })
    .then(async (res) => ({ success: true, data: await res.json() }))
    .catch((err) => ({ success: false, error: err.message }));
}

async function sendRequestOpposer(props: string): Promise<{
  success: boolean;
  status: number;
  error?: string;
  data?: any;
}> {
  try {
    const res = await fetch("http://localhost:3838/opposer", {
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
