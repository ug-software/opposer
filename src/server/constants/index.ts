// Enum só com códigos
export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,

  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  IMUsed = 226,

  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,

  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,

  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

// Map auxiliar para obter name e category
export const HttpStatus: Record<
  HttpStatusCode,
  { code: number; name: string; category: string }
> = {
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

export enum Type {
  string = "string",
  number = "number",
  jsonb = "jsonb",
  boolean = "boolean",
  array = "array",
  date = "date",
  relation = "relation",
}
