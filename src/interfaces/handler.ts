import { CookieOptions } from "express";

export interface PayloadRequest<D> {
  data: D;
  headers: {
    autorization: string;
    contentType: string;
    accept: string;
    origin: string;
    referer: string;
    userAgent: string;
    ip: string;
    cookies: {
      data: Record<string, string>;
      set: (name: string, value: string, options: CookieOptions) => void;
      remove: (name: string, options?: CookieOptions) => void;
    };
  };
}
