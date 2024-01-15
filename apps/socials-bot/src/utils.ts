export function isAdmin(roles: string[], adminRoleId: string) {
  return roles.includes(adminRoleId);
}

