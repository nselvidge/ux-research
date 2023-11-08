export type IdentityTypes = "zoom" | "password";

export interface Identity {
  type: IdentityTypes;
  token: string;
}
