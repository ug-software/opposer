export interface CreateServerProps {
  url?: string;
  text: boolean;
  urlencoded: boolean;
  helmet: boolean;
  logger: boolean;
  cors?: {
    origin: string;
  };
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}
