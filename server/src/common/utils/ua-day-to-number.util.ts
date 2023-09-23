export default function uaDayToNumber(day: string): number {
  switch (day) {
    case 'Понеділок':
      return 1;
    case 'Вівторок':
      return 2;
    case 'Середа':
      return 3;
    case 'Четвер':
      return 4;
    case "П'ятниця":
    case 'П&#39;ятниця':
      return 5;
    case 'Субота':
      return 6;
    case 'Неділя':
      return 7;
    default:
      return -1;
  }
}
