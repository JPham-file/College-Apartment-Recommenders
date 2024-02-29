export interface ErrorResponse {
  status: number;
  message: string;
  code: string;
  metadata?: {
    path: string;
    version: string;
  }
}