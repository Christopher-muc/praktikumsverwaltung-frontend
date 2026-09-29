export function toFirstLetterUppercase(text: string): string {
  return text ? text[0]?.toUpperCase() + text.slice(1).toLowerCase() : "";
}

export function toDateString(date: Date): string {
  return date ? date.toLocaleDateString("de-DE") : "";
}

export function toTimeString(date: Date): string {
  return date ? date.toLocaleTimeString("de-DE") : "";
}

export function toDateAndTimeString(date: Date): string {
  return date ? date.toLocaleString("de-DE") : "";
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toDateInputValue(value: Date | undefined): string {
  if (!value) {
    return "";
  }

  return toDateKey(value);
}
