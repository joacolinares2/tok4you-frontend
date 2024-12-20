export function sanitizeAndValidate(value: any, isString: boolean = true) {
  if (value === undefined || value === null) return null;
  return isString ? value.toString().trim() : value;
}
