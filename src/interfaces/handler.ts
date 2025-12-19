export interface Payload<D> {
  data: D;
  headers: {
    autorization: string;
    contentType: string;
    accept: string;
    origin: string;
    referer: string;
    userAgent: string;
    forwardedFor: string;
    realIp: string;
  };
}
