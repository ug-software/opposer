import { Middleware } from "../index.js";

export default function bodyParser(): Middleware {
  return async (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
      const chunks: any[] = [];
      
      req.on("data", (chunk: any) => chunks.push(chunk));
      
      req.on("end", () => {
        const bodyStr = Buffer.concat(chunks).toString();
        try {
          if (bodyStr) {
            req.body = JSON.parse(bodyStr);
          }
        } catch (e) {
          console.error("[core] JSON parsing error:", e);
          req.body = {};
        }
        next();
      });
    } else {
      next();
    }
  };
}
