// Read dimensions before allocating an image. Derived from the existing app's
// JPEG/PNG metadata reader; the byte/pixel bounds are explicit for this workflow.
export function badgeImageSize(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let size;
  if (b.length >= 24 && [137, 80, 78, 71, 13, 10, 26, 10].every((x, i) => b[i] === x) && String.fromCharCode(...b.slice(12, 16)) === 'IHDR') size = {width: view.getUint32(16), height: view.getUint32(20)};
  else if (b.length > 4 && b[0] === 255 && b[1] === 216) {
    let offset = 2;
    while (offset + 3 < b.length) {
      if (b[offset++] !== 255) throw Error('Unsupported JPEG header. Crop or retake the badge.');
      while (offset < b.length && b[offset] === 255) offset++;
      const marker = b[offset++]; if (marker === 217 || marker === 218) break;
      if (marker === 1 || marker >= 208 && marker <= 215) continue;
      if (offset + 2 > b.length) break;
      const length = view.getUint16(offset); if (length < 2) break;
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && offset + 7 <= b.length) { size = {height: view.getUint16(offset + 3), width: view.getUint16(offset + 5)}; break; }
      offset += length;
    }
  }
  if (!size) throw Error('Choose a JPEG or PNG. Export other formats as JPEG, or use a cropped screenshot.');
  if (!size.width || !size.height || size.width > 10000 || size.height > 10000 || size.width * size.height > 60000000) throw Error('Photo is too large. Crop closely to the badge.');
  return size;
}
