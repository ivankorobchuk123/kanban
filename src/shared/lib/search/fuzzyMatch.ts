/**
 * Fuzzy/smart search utilities.
 * Supports partial matches and simple similarity scoring.
 */

/**
 * Normalizes string for comparison (lowercase, trim, collapse spaces)
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Checks if search query matches text (substring or word starts).
 * Used for "smart search" - not just exact match.
 */
export function fuzzyMatch(text: string, search: string): boolean {
  if (!search.trim()) return true
  const normText = normalize(text)
  const normSearch = normalize(search)
  if (normText.includes(normSearch)) return true
  const words = normSearch.split(' ')
  return words.every((word) => normText.includes(word))
}

/**
 * Returns positions of matched text for highlighting.
 * Returns array of [start, end] pairs.
 */
export function getHighlightRanges(text: string, search: string): [number, number][] {
  if (!search.trim()) return []
  const normText = text.toLowerCase()
  const normSearch = normalize(search)
  const ranges: [number, number][] = []
  let pos = 0
  while (pos < normText.length) {
    const idx = normText.indexOf(normSearch, pos)
    if (idx === -1) break
    ranges.push([idx, idx + normSearch.length])
    pos = idx + 1
  }
  return ranges
}
