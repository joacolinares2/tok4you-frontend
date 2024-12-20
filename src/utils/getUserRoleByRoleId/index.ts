const roles: { [key: number]: string } = {
  1: "Usuario",
  2: "Inversor",
  3: "Promotor de proyectos",
  4: "Administrador",
};

export function getRoleName(roleId: number): string | undefined {
  return roles[roleId];
}
