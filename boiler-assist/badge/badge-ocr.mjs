// Images remain on this device. Only static, version-pinned OCR files are fetched.
import {badgeImageSize} from './badge-image-bounds.mjs';
export function createBadgeReader({baseURL, progress = () => {}, load = url => import(url), timeoutMs = 90000} = {}) {
  const base = new URL(baseURL, globalThis.location?.href);
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw Error('Invalid OCR files.');
  let worker = null, busy = false, generation = 0;
  async function dispose() { generation++; const current = worker; worker = null; if (current) await current.terminate(); }
  async function read(file, {rotation = 0, crop = {x: 0, y: 0, width: 1, height: 1}} = {}) {
    if (busy) throw Error('A photo is already being read.');
    if (!(file instanceof Blob) || !file.size || file.size > 20 * 1024 * 1024) throw Error('Choose a photo up to 20 MB.');
    if (file.type && !/^image\/(jpeg|png)$/i.test(file.type)) throw Error('Choose a JPEG or PNG photo.');
    if (![0, 90, 180, 270].includes(rotation)) throw Error('Invalid photo rotation.');
    if (!crop || ['x', 'y', 'width', 'height'].some(k => !Number.isFinite(crop[k])) || crop.x < 0 || crop.y < 0 || crop.width < 0.03 || crop.height < 0.03 || crop.x + crop.width > 1.000001 || crop.y + crop.height > 1.000001) throw Error('Select the badge within the photo.');
    busy = true; const current = ++generation; let timer, bitmap;
    const run = async () => {
      badgeImageSize(await file.slice(0, 512 * 1024).arrayBuffer());
      if (current !== generation) throw Error('Photo reading cancelled.');
      bitmap = await createImageBitmap(file, {imageOrientation: 'from-image'});
      if (current !== generation) { bitmap.close(); throw Error('Photo reading cancelled.'); }
      if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 60000000) throw Error('Photo is too large. Crop to the badge.');
      const sourceWidth = bitmap.width * crop.width, sourceHeight = bitmap.height * crop.height;
      const scale = Math.min(2, 3200 / Math.max(sourceWidth, sourceHeight));
      const width = Math.max(1, Math.round(sourceWidth * scale)), height = Math.max(1, Math.round(sourceHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = rotation % 180 ? height : width; canvas.height = rotation % 180 ? width : height;
      const context = canvas.getContext('2d', {alpha: false}); if (!context) throw Error('Photo preview is unavailable.');
      context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.translate(canvas.width / 2, canvas.height / 2); context.rotate(rotation * Math.PI / 180);
      context.drawImage(bitmap, bitmap.width * crop.x, bitmap.height * crop.y, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
      if (current !== generation) throw Error('Photo reading cancelled.');
      if (!worker) {
        const module = await load(new URL('tesseract.esm.min.js', base).href);
        const createWorker = module.createWorker || module.default?.createWorker;
        if (typeof createWorker !== 'function') throw Error('Photo reader could not load.');
        const created = await createWorker('eng', 1, {workerPath: new URL('worker.min.js', base).href,
          corePath: new URL('core/', base).href, langPath: new URL('lang/', base).href,
          workerBlobURL: true, logger: value => { if (current === generation) progress(value); }});
        if (current !== generation) { await created.terminate(); throw Error('Photo reading cancelled.'); }
        worker = created;
        await worker.setParameters({tessedit_pageseg_mode: '3', preserve_interword_spaces: '1'});
      }
      let result = await worker.recognize(canvas, {rotateAuto: true}, {text: true, blocks: true});
      if (!result?.data?.text?.trim()) {
        // A narrow boiler sticker can be rejected as an empty page by automatic
        // layout detection. Sparse-text mode is a finite local-only fallback.
        await worker.setParameters({tessedit_pageseg_mode: '11'});
        result = await worker.recognize(canvas, {}, {text: true, blocks: true});
        await worker.setParameters({tessedit_pageseg_mode: '3'});
      }
      if (current !== generation) throw Error('Photo reading cancelled.');
      if (typeof result?.data?.text !== 'string' || result.data.text.length > 16000) throw Error('Crop the photo to one boiler badge.');
      if (!result.data.text.trim()) throw Error('No badge text was read. Crop closer or enter the details manually.');
      const bytes = await file.arrayBuffer();
      const imageSHA256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
      return {text: result.data.text, confidence: result.data.confidence, imageSHA256, rotation, crop,
        width: canvas.width, height: canvas.height, processedOnDevice: true, uploaded: false};
    };
    try { return await Promise.race([run(), new Promise((_, reject) => { timer = setTimeout(() => {
      void dispose(); reject(Error('Photo reading timed out. Crop to the badge and try again.'));
    }, timeoutMs); })]); }
    catch (error) { await dispose(); throw error; }
    finally { clearTimeout(timer); bitmap?.close(); busy = false; }
  }
  return {read, dispose};
}
