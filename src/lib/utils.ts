export const cn = (...classes: unknown[]): string => {
  return classes.filter(Boolean).join(" ");
};
