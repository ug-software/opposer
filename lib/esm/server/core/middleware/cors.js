export default function cors(options) {
    return (req, res, next) => {
        const originHeader = req.headers.origin;
        let allowedOrigin = "*";
        if (options?.origin) {
            if (Array.isArray(options.origin)) {
                if (originHeader && options.origin.includes(originHeader)) {
                    allowedOrigin = originHeader;
                }
                else {
                    allowedOrigin = options.origin[0]; // Fallback to first one
                }
            }
            else {
                allowedOrigin = options.origin;
            }
        }
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        res.setHeader("Access-Control-Allow-Methods", options?.methods?.join(", ") || "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", options?.allowedHeaders?.join(", ") ||
            "Content-Type, Authorization, opposer-key");
        res.setHeader("Access-Control-Allow-Credentials", options?.credentials !== undefined ? String(options.credentials) : "true");
        if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
        }
        next();
    };
}
