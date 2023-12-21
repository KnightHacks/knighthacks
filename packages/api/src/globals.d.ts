export {};

declare global {
  interface CustomJwtSessionClaims {
    id: string;
    email: string;
  }
}
