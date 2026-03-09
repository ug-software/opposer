export default function bodyParser() {
    return async (req, res, next) => {
        if (req.method === "POST" || req.method === "PUT") {
            const chunks = [];
            req.on("data", (chunk) => chunks.push(chunk));
            req.on("end", () => {
                const bodyStr = Buffer.concat(chunks).toString();
                try {
                    if (bodyStr) {
                        req.body = JSON.parse(bodyStr);
                    }
                }
                catch (e) {
                    console.error("[core] JSON parsing error:", e);
                    req.body = {};
                }
                next();
            });
        }
        else {
            next();
        }
    };
}
