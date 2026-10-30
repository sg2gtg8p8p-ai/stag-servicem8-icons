// Conservative suggestions only. Each value remains editable and unchecked.
// Badge text may identify an uncatalogued boiler; that must not prevent saving
// literal identity details. No service values or manufacture dates are inferred.
export function suggestBadgeFields(text) {
  if (typeof text !== 'string' || text.length > 16000) throw Error('Read one badge at a time.');
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean), suggestions = {}, candidates = {};
  const record = (key, value) => { if (value && value.length <= 160) (candidates[key] ||= []).push(value); };
  const brands = [['Worcester Bosch', /\bworcester\b/i], ['Vaillant', /\bvaillant\b/i], ['Ideal', /\b(?:caradon ideal|ideal)\b/i],
    ['Baxi', /\bbaxi\b/i], ['Glow-worm', /\bglow[ -]?worm\b/i], ['Viessmann', /\bviessmann\b/i], ['Potterton', /\bpotterton\b/i], ['Main', /^main$/i]];
  for (const [brand, pattern] of brands) if (lines.some(line => pattern.test(line))) record('manufacturer', brand);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/^["'“”‘’]+/, '');
    const gc = line.match(/\b(?:g\s*\.?\s*c\s*\.?\s*(?:number|no\.?|nr\.?)?|gas council(?: number)?)\s*[:#=-]?\s*(\d{2}[ -]?\d{3}[ -]?\d{2})\b/i);
    if (gc) { const digits = gc[1].replace(/\D/g, ''); record('gcNumber', digits.slice(0, 2) + '-' + digits.slice(2, 5) + '-' + digits.slice(5)); }
    const serial = line.match(/^(?:serial(?:\s*(?:number|no\.?|nr\.?))?|s\s*\/\s*n|ser\.?\s*no\.?)\s*[:#=-]?\s+(.+)$/i);
    if (serial && !/^(?:no\.?|number)$/i.test(serial[1])) record('serial', serial[1]);
    const model = line.match(/^(?:model(?:\s*(?:number|no\.?))?)\s*[:#=-]?\s+(.+)$/i);
    if (model) record('model', model[1]);
    // A standalone familiar product line is a suggestion, never a replacement
    // for the exact GC/variant. Do not interpret flue Type C13/C33 as a model.
    const homeCombi = line.match(/\bHOME\s+COMBI\s+\d{2}\b/i);
    if (homeCombi) record('model', homeCombi[0]);
    const family = line.match(/\b((?:GREENSTAR|MINI\s+C|LOGIC|ECOFIT|ECOTEC|ECOBLUE)\b.*)$/i);
    if (family) record('model', family[1]);
    if (/^(?:serial(?:\s*(?:number|no\.?))?|s\/n)\s*[:#]?$/i.test(line) && lines[i + 1] && /^[a-z0-9][a-z0-9 -]{3,79}$/i.test(lines[i + 1])) record('serial', lines[i + 1]);
  }
  const conflicts = [];
  for (const [key, values] of Object.entries(candidates)) {
    const unique = [...new Set(values)];
    if (unique.length === 1) suggestions[key] = unique[0]; else conflicts.push(key);
  }
  return {suggestions, conflicts};
}
