export default function formatDateForInput(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0];
}
