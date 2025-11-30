export function normalizePhone(input: string): string {
  const trimmed = input.trim();

  // If starts with "+880", remove the "+"
  if (/^\+8801\d{9}$/.test(trimmed)) {
    return trimmed.slice(1);
  }

  // If starts with "880", assume already normalized
  if (/^8801\d{9}$/.test(trimmed)) {
    return trimmed;
  }

  // If starts with "01", convert to "8801"
  if (/^01\d{9}$/.test(trimmed)) {
    return "880" + trimmed.slice(1);
  }

  throw new Error(`Invalid Bangladeshi phone number format: ${input}`);
}
