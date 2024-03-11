export {};

declare global {
  interface CustomJwtSessionClaims {
    id?: string;
    isEmailVerified?: string;
    email?: string;
  }
}
