// Prepared photo-text review only. Does not decode a date, fetch or save a serial.
// The existing on-device help/ocr.mjs reader remains the image-to-text boundary.
export function reviewBadgeText(text) {
  if (typeof text !== 'string' || text.length > 12000)
    return {status: 'invalid', candidates: [], message: 'Crop the badge or enter its serial manually.'};
  const lines = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').split(/\r?\n/);
  const candidates = [];
  const seen = new Set();
  for (let i = 0; i < lines.length; i++) {
    // Keep model, GC, article, component and date lines out of this serial list.
    const match = lines[i].match(/^\s*(?:serial(?:\s*(?:number|no\.?|nr\.?))?|s\s*\/\s*n)\s*[:#=-]?\s*(.*?)\s*$/i);
    if (!match) continue;
    const raw = match[1].trim() || (lines[i + 1] || '').trim();
    if (!/^[a-z0-9][a-z0-9 /.-]{3,79}$/i.test(raw) || !/\d/.test(raw)) continue;
    if (/^(?:GC|MODEL|ARTICLE|PRODUCT|DATE|YEAR|FD)\b/i.test(raw)) continue;
    const serial = raw.toUpperCase().replace(/[\s-]/g, '');
    if (seen.has(serial)) continue;
    seen.add(serial);
    candidates.push({raw, serial, printedLine: i + 1});
  }
  return {
    status: candidates.length ? 'review-required' : 'manual-entry-required',
    candidates,
    automaticSelection: null,
    manufactureDate: null,
    age: null,
    message: candidates.length ? 'Check the complete serial against the badge, including every letter and digit. Choose the make and exact supported range before checking age.' : 'No clearly labelled serial was found. Type the complete serial from the badge.',
  };
}

export function acceptReviewedSerial(review, index, {checkedAgainstBadge = false} = {}) {
  if (!checkedAgainstBadge || review?.status !== 'review-required' || !Number.isInteger(index) || !review.candidates?.[index])
    return {status: 'held', serial: null, manufactureDate: null};
  return {status: 'ready-for-supported-decoder', serial: review.candidates[index].serial, manufactureDate: null};
}
