import express from "express";
import DatabaseController from "../controller/database.js";
import DispatchController from "../controller/dispatch.js";
import * as database from "../database/index.js";
import * as system from "../system/index.js";
const settings = system.getSettingsFile();
export default async function Server(props) {
    console.log("-> Initializing database connection.");
    if (!settings.database) {
        throw new Error("-> It is necessary to inform database properties.");
    }
    await database.connect(settings.database);
    console.log("-> Initializing server.");
    const opposer = express();
    let url = "/opposer";
    if (props.url) {
        url = props.url;
    }
    // parsing Middleware
    opposer.use(express.json()); // JSON forever active
    if (props.urlencoded) {
        opposer.use(express.urlencoded({ extended: true }));
    }
    if (props.text) {
        opposer.use(express.text());
    }
    // Security
    if (props.helmet) {
        //@ts-ignore
        const helmet = (await import("helmet")).default;
        opposer.use(helmet());
    }
    // CORS
    if (props.cors) {
        //@ts-ignore
        const cors = (await import("cors")).default;
        opposer.use(cors({ ...props.cors }));
    }
    // Rate limit
    if (props.rateLimit) {
        //@ts-ignore
        const rateLimit = (await import("express-rate-limit")).default;
        opposer.use(rateLimit({
            windowMs: props.rateLimit.windowMs || 15 * 60 * 1000, // 15 minutos por padrão
            max: props.rateLimit.max || 100, // máximo 100 requests por IP
        }));
    }
    // Logging
    if (props.logger) {
        //@ts-ignore
        const morgan = (await import("morgan")).default;
        opposer.use(morgan("dev"));
    }
    // Routes
    opposer.post(url, DatabaseController);
    // Handlers
    opposer.post("/handler/:handler", DispatchController);
    // Error Middleware
    opposer.use((err, req, res, next) => {
        console.error(err);
        res
            .status(err.status || 500)
            .json({ message: err.message || "Internal Server Error" });
    });
    function initialize() {
        opposer.listen(props.port, () => {
            console.log(`⚡Opposer is running in port ${props.port}`);
        });
    }
    return { opposer, initialize };
}
