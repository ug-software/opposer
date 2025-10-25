import * as helper from "../handlers/index.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../system/index.js";
import Auth from "../security/handler/auth.js";
const settings = system.getSettingsFile();
export default async (req, res) => {
    var handlerName = req.params.handler;
    var { method, paylod } = req.body;
    if (!handlerName) {
        return res.status(400).json({
            ...HttpStatus[400],
            message: "Unable to identify handler name.",
        });
    }
    var handlers = await helper.loadHandlers();
    var auth = {
        methods: [
            { name: "register" },
            { name: "login" },
            { name: "refresh" },
            { name: "logout" },
            { name: "me" },
            { name: "me" },
        ],
        handler: Auth,
        metadata: { name: "auth" },
    };
    if (typeof settings.auth === "object" && settings.auth.exposeChangePassword) {
        auth.methods.push(...[{ name: "change-password" }, { name: "forgot-password" }]);
    }
    if (settings.auth) {
        handlers["auth"] = auth;
    }
    if (!handlers[handlerName]) {
        return res.status(400).json({
            ...HttpStatus[400],
            message: "Impossible to find handler.",
        });
    }
    if (!method) {
        return res.status(400).json({
            ...HttpStatus[400],
            message: "Unable to identify method name.",
        });
    }
    var __meta = handlers[handlerName];
    if (!__meta.methods.find((x) => x.name === method)) {
        return res.status(400).json({
            ...HttpStatus[400],
            message: "Unable to find action method.",
        });
    }
    var result = await new __meta.handler()[helper.toCamelCase(method)](paylod);
    return res.status(200).json(result);
};
