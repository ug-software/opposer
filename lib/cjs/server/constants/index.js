"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.HttpStatus = exports.HttpStatusCode = void 0;
// Enum só com códigos
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["Continue"] = 100] = "Continue";
    HttpStatusCode[HttpStatusCode["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    HttpStatusCode[HttpStatusCode["Processing"] = 102] = "Processing";
    HttpStatusCode[HttpStatusCode["EarlyHints"] = 103] = "EarlyHints";
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["Created"] = 201] = "Created";
    HttpStatusCode[HttpStatusCode["Accepted"] = 202] = "Accepted";
    HttpStatusCode[HttpStatusCode["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
    HttpStatusCode[HttpStatusCode["NoContent"] = 204] = "NoContent";
    HttpStatusCode[HttpStatusCode["ResetContent"] = 205] = "ResetContent";
    HttpStatusCode[HttpStatusCode["PartialContent"] = 206] = "PartialContent";
    HttpStatusCode[HttpStatusCode["MultiStatus"] = 207] = "MultiStatus";
    HttpStatusCode[HttpStatusCode["AlreadyReported"] = 208] = "AlreadyReported";
    HttpStatusCode[HttpStatusCode["IMUsed"] = 226] = "IMUsed";
    HttpStatusCode[HttpStatusCode["MultipleChoices"] = 300] = "MultipleChoices";
    HttpStatusCode[HttpStatusCode["MovedPermanently"] = 301] = "MovedPermanently";
    HttpStatusCode[HttpStatusCode["Found"] = 302] = "Found";
    HttpStatusCode[HttpStatusCode["SeeOther"] = 303] = "SeeOther";
    HttpStatusCode[HttpStatusCode["NotModified"] = 304] = "NotModified";
    HttpStatusCode[HttpStatusCode["UseProxy"] = 305] = "UseProxy";
    HttpStatusCode[HttpStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpStatusCode[HttpStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
    HttpStatusCode[HttpStatusCode["PaymentRequired"] = 402] = "PaymentRequired";
    HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
    HttpStatusCode[HttpStatusCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpStatusCode[HttpStatusCode["NotAcceptable"] = 406] = "NotAcceptable";
    HttpStatusCode[HttpStatusCode["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpStatusCode[HttpStatusCode["RequestTimeout"] = 408] = "RequestTimeout";
    HttpStatusCode[HttpStatusCode["Conflict"] = 409] = "Conflict";
    HttpStatusCode[HttpStatusCode["Gone"] = 410] = "Gone";
    HttpStatusCode[HttpStatusCode["LengthRequired"] = 411] = "LengthRequired";
    HttpStatusCode[HttpStatusCode["PreconditionFailed"] = 412] = "PreconditionFailed";
    HttpStatusCode[HttpStatusCode["PayloadTooLarge"] = 413] = "PayloadTooLarge";
    HttpStatusCode[HttpStatusCode["URITooLong"] = 414] = "URITooLong";
    HttpStatusCode[HttpStatusCode["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    HttpStatusCode[HttpStatusCode["RangeNotSatisfiable"] = 416] = "RangeNotSatisfiable";
    HttpStatusCode[HttpStatusCode["ExpectationFailed"] = 417] = "ExpectationFailed";
    HttpStatusCode[HttpStatusCode["ImATeapot"] = 418] = "ImATeapot";
    HttpStatusCode[HttpStatusCode["MisdirectedRequest"] = 421] = "MisdirectedRequest";
    HttpStatusCode[HttpStatusCode["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    HttpStatusCode[HttpStatusCode["Locked"] = 423] = "Locked";
    HttpStatusCode[HttpStatusCode["FailedDependency"] = 424] = "FailedDependency";
    HttpStatusCode[HttpStatusCode["TooEarly"] = 425] = "TooEarly";
    HttpStatusCode[HttpStatusCode["UpgradeRequired"] = 426] = "UpgradeRequired";
    HttpStatusCode[HttpStatusCode["PreconditionRequired"] = 428] = "PreconditionRequired";
    HttpStatusCode[HttpStatusCode["TooManyRequests"] = 429] = "TooManyRequests";
    HttpStatusCode[HttpStatusCode["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    HttpStatusCode[HttpStatusCode["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    HttpStatusCode[HttpStatusCode["InternalServerError"] = 500] = "InternalServerError";
    HttpStatusCode[HttpStatusCode["NotImplemented"] = 501] = "NotImplemented";
    HttpStatusCode[HttpStatusCode["BadGateway"] = 502] = "BadGateway";
    HttpStatusCode[HttpStatusCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpStatusCode[HttpStatusCode["GatewayTimeout"] = 504] = "GatewayTimeout";
    HttpStatusCode[HttpStatusCode["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    HttpStatusCode[HttpStatusCode["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    HttpStatusCode[HttpStatusCode["InsufficientStorage"] = 507] = "InsufficientStorage";
    HttpStatusCode[HttpStatusCode["LoopDetected"] = 508] = "LoopDetected";
    HttpStatusCode[HttpStatusCode["NotExtended"] = 510] = "NotExtended";
    HttpStatusCode[HttpStatusCode["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(HttpStatusCode || (exports.HttpStatusCode = HttpStatusCode = {}));
// Map auxiliar para obter name e category
exports.HttpStatus = {
    [HttpStatusCode.Continue]: {
        code: 100,
        name: "Continue",
        category: "Informational",
    },
    [HttpStatusCode.SwitchingProtocols]: {
        code: 101,
        name: "SwitchingProtocols",
        category: "Informational",
    },
    [HttpStatusCode.Processing]: {
        code: 102,
        name: "Processing",
        category: "Informational",
    },
    [HttpStatusCode.EarlyHints]: {
        code: 103,
        name: "EarlyHints",
        category: "Informational",
    },
    [HttpStatusCode.OK]: { code: 200, name: "OK", category: "Success" },
    [HttpStatusCode.Created]: { code: 201, name: "Created", category: "Success" },
    [HttpStatusCode.Accepted]: {
        code: 202,
        name: "Accepted",
        category: "Success",
    },
    [HttpStatusCode.NonAuthoritativeInformation]: {
        code: 203,
        name: "NonAuthoritativeInformation",
        category: "Success",
    },
    [HttpStatusCode.NoContent]: {
        code: 204,
        name: "NoContent",
        category: "Success",
    },
    [HttpStatusCode.ResetContent]: {
        code: 205,
        name: "ResetContent",
        category: "Success",
    },
    [HttpStatusCode.PartialContent]: {
        code: 206,
        name: "PartialContent",
        category: "Success",
    },
    [HttpStatusCode.MultiStatus]: {
        code: 207,
        name: "MultiStatus",
        category: "Success",
    },
    [HttpStatusCode.AlreadyReported]: {
        code: 208,
        name: "AlreadyReported",
        category: "Success",
    },
    [HttpStatusCode.IMUsed]: { code: 226, name: "IMUsed", category: "Success" },
    [HttpStatusCode.MultipleChoices]: {
        code: 300,
        name: "MultipleChoices",
        category: "Redirection",
    },
    [HttpStatusCode.MovedPermanently]: {
        code: 301,
        name: "MovedPermanently",
        category: "Redirection",
    },
    [HttpStatusCode.Found]: { code: 302, name: "Found", category: "Redirection" },
    [HttpStatusCode.SeeOther]: {
        code: 303,
        name: "SeeOther",
        category: "Redirection",
    },
    [HttpStatusCode.NotModified]: {
        code: 304,
        name: "NotModified",
        category: "Redirection",
    },
    [HttpStatusCode.UseProxy]: {
        code: 305,
        name: "UseProxy",
        category: "Redirection",
    },
    [HttpStatusCode.TemporaryRedirect]: {
        code: 307,
        name: "TemporaryRedirect",
        category: "Redirection",
    },
    [HttpStatusCode.PermanentRedirect]: {
        code: 308,
        name: "PermanentRedirect",
        category: "Redirection",
    },
    [HttpStatusCode.BadRequest]: {
        code: 400,
        name: "BadRequest",
        category: "Client Error",
    },
    [HttpStatusCode.Unauthorized]: {
        code: 401,
        name: "Unauthorized",
        category: "Client Error",
    },
    [HttpStatusCode.PaymentRequired]: {
        code: 402,
        name: "PaymentRequired",
        category: "Client Error",
    },
    [HttpStatusCode.Forbidden]: {
        code: 403,
        name: "Forbidden",
        category: "Client Error",
    },
    [HttpStatusCode.NotFound]: {
        code: 404,
        name: "NotFound",
        category: "Client Error",
    },
    [HttpStatusCode.MethodNotAllowed]: {
        code: 405,
        name: "MethodNotAllowed",
        category: "Client Error",
    },
    [HttpStatusCode.NotAcceptable]: {
        code: 406,
        name: "NotAcceptable",
        category: "Client Error",
    },
    [HttpStatusCode.ProxyAuthenticationRequired]: {
        code: 407,
        name: "ProxyAuthenticationRequired",
        category: "Client Error",
    },
    [HttpStatusCode.RequestTimeout]: {
        code: 408,
        name: "RequestTimeout",
        category: "Client Error",
    },
    [HttpStatusCode.Conflict]: {
        code: 409,
        name: "Conflict",
        category: "Client Error",
    },
    [HttpStatusCode.Gone]: { code: 410, name: "Gone", category: "Client Error" },
    [HttpStatusCode.LengthRequired]: {
        code: 411,
        name: "LengthRequired",
        category: "Client Error",
    },
    [HttpStatusCode.PreconditionFailed]: {
        code: 412,
        name: "PreconditionFailed",
        category: "Client Error",
    },
    [HttpStatusCode.PayloadTooLarge]: {
        code: 413,
        name: "PayloadTooLarge",
        category: "Client Error",
    },
    [HttpStatusCode.URITooLong]: {
        code: 414,
        name: "URITooLong",
        category: "Client Error",
    },
    [HttpStatusCode.UnsupportedMediaType]: {
        code: 415,
        name: "UnsupportedMediaType",
        category: "Client Error",
    },
    [HttpStatusCode.RangeNotSatisfiable]: {
        code: 416,
        name: "RangeNotSatisfiable",
        category: "Client Error",
    },
    [HttpStatusCode.ExpectationFailed]: {
        code: 417,
        name: "ExpectationFailed",
        category: "Client Error",
    },
    [HttpStatusCode.ImATeapot]: {
        code: 418,
        name: "ImATeapot",
        category: "Client Error",
    },
    [HttpStatusCode.MisdirectedRequest]: {
        code: 421,
        name: "MisdirectedRequest",
        category: "Client Error",
    },
    [HttpStatusCode.UnprocessableEntity]: {
        code: 422,
        name: "UnprocessableEntity",
        category: "Client Error",
    },
    [HttpStatusCode.Locked]: {
        code: 423,
        name: "Locked",
        category: "Client Error",
    },
    [HttpStatusCode.FailedDependency]: {
        code: 424,
        name: "FailedDependency",
        category: "Client Error",
    },
    [HttpStatusCode.TooEarly]: {
        code: 425,
        name: "TooEarly",
        category: "Client Error",
    },
    [HttpStatusCode.UpgradeRequired]: {
        code: 426,
        name: "UpgradeRequired",
        category: "Client Error",
    },
    [HttpStatusCode.PreconditionRequired]: {
        code: 428,
        name: "PreconditionRequired",
        category: "Client Error",
    },
    [HttpStatusCode.TooManyRequests]: {
        code: 429,
        name: "TooManyRequests",
        category: "Client Error",
    },
    [HttpStatusCode.RequestHeaderFieldsTooLarge]: {
        code: 431,
        name: "RequestHeaderFieldsTooLarge",
        category: "Client Error",
    },
    [HttpStatusCode.UnavailableForLegalReasons]: {
        code: 451,
        name: "UnavailableForLegalReasons",
        category: "Client Error",
    },
    [HttpStatusCode.InternalServerError]: {
        code: 500,
        name: "InternalServerError",
        category: "Server Error",
    },
    [HttpStatusCode.NotImplemented]: {
        code: 501,
        name: "NotImplemented",
        category: "Server Error",
    },
    [HttpStatusCode.BadGateway]: {
        code: 502,
        name: "BadGateway",
        category: "Server Error",
    },
    [HttpStatusCode.ServiceUnavailable]: {
        code: 503,
        name: "ServiceUnavailable",
        category: "Server Error",
    },
    [HttpStatusCode.GatewayTimeout]: {
        code: 504,
        name: "GatewayTimeout",
        category: "Server Error",
    },
    [HttpStatusCode.HTTPVersionNotSupported]: {
        code: 505,
        name: "HTTPVersionNotSupported",
        category: "Server Error",
    },
    [HttpStatusCode.VariantAlsoNegotiates]: {
        code: 506,
        name: "VariantAlsoNegotiates",
        category: "Server Error",
    },
    [HttpStatusCode.InsufficientStorage]: {
        code: 507,
        name: "InsufficientStorage",
        category: "Server Error",
    },
    [HttpStatusCode.LoopDetected]: {
        code: 508,
        name: "LoopDetected",
        category: "Server Error",
    },
    [HttpStatusCode.NotExtended]: {
        code: 510,
        name: "NotExtended",
        category: "Server Error",
    },
    [HttpStatusCode.NetworkAuthenticationRequired]: {
        code: 511,
        name: "NetworkAuthenticationRequired",
        category: "Server Error",
    },
};
var Type;
(function (Type) {
    Type["string"] = "string";
    Type["number"] = "number";
    Type["jsonb"] = "jsonb";
    Type["boolean"] = "boolean";
    Type["array"] = "array";
    Type["date"] = "date";
    Type["relation"] = "relation";
})(Type || (exports.Type = Type = {}));
