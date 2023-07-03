export function classes(...cls) {
  return cls.filter(Boolean).join(" ");
}
