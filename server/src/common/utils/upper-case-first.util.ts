export default function upperCaseFirst(str: string | null): string {
  if (!str || str.length === 0) {
    return '';
  }

  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
