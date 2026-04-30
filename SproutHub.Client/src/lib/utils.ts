export function cn(...args: Array<string | undefined>) {
  return args.filter(Boolean).join(" ");
}
