export const redirectToPath = (navigate: Function, path: string) => {
  localStorage.setItem("XXcurrentPath", path);
  navigate(path);
};
