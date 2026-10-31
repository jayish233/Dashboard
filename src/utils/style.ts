export function parseInlineStyle(cssText: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cssText) return result;
  for (const part of cssText.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const prop = trimmed
      .slice(0, colonIdx)
      .trim()
      .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    const val = trimmed.slice(colonIdx + 1).trim();
    result[prop] = val;
  }
  return result;
}
