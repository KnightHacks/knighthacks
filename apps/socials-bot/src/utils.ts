export const PRESIDENT_ROLE_ID = "486629323797692431";
export const VICE_PRESIDENT_ROLE_ID = "623165798151618591";
export const OFFICER_ROLE_ID = "486629374758748180";

export type Permission = "president" | "vice-president" | "officer";

export function getUserPermissions(roles: string[]) {
  return roles.reduce((roles, role) => {
    if (role === PRESIDENT_ROLE_ID) {
      roles.push("president");
    } else if (role === VICE_PRESIDENT_ROLE_ID) {
      roles.push("vice-president");
    } else if (role === OFFICER_ROLE_ID) {
      roles.push("officer");
    }
    return roles;
  }, [] as Permission[]);
}
