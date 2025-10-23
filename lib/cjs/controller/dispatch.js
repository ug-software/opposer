"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const handler = __importStar(require("../handlers/index.js"));
const index_js_1 = require("../constants/index.js");
exports.default = async (req, res) => {
    var handlerName = req.params.handler;
    var { action, paylod } = req.body;
    if (!handlerName) {
        return res.status(400).json({
            ...index_js_1.HttpStatus[400],
            message: "Unable to identify handler name.",
        });
    }
    var handlers = await handler.loadHandlers();
    if (!handlers[handlerName]) {
        return res.status(400).json({
            ...index_js_1.HttpStatus[400],
            message: "Impossible to find handler.",
        });
    }
    if (!action) {
        return res.status(400).json({
            ...index_js_1.HttpStatus[400],
            message: "Unable to identify action name.",
        });
    }
    var __handler = handlers[handlerName];
    if (!__handler.actions.find((x) => x.name === action)) {
        return res.status(400).json({
            ...index_js_1.HttpStatus[400],
            message: "Unable to find action method.",
        });
    }
    var result = await new __handler.handler()[handler.toCamelCase(action)](paylod);
    return res.status(200).json(result);
};
