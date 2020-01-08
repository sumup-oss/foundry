export function enumToChoices(enums: { [key: string]: string }): string[] {
  return Object.values(enums);
}
