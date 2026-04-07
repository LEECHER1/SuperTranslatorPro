const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
function align4(n) { return n + 3 & ~3; }
function readPickleUint32(buf) { return buf.readUInt32LE(4); }
function readPickleString(buf) { const len = buf.readUInt32LE(4); return buf.toString('utf8', 8, 8 + len); }
function writePickleUint32(value) { const buf = Buffer.alloc(8); buf.writeUInt32LE(4, 0); buf.writeUInt32LE(value, 4); return buf; }
function writePickleString(str) { const strBuf = Buffer.from(str, 'utf8'); const payloadSize = 4 + align4(strBuf.length); const buf = Buffer.alloc(4 + payloadSize); buf.writeUInt32LE(payloadSize, 0); buf.writeUInt32LE(strBuf.length, 4); strBuf.copy(buf, 8); return buf; }
function isFileEntry(e) { return 'size' in e && !('link' in e) && !('files' in e); }
function isDirectoryEntry(e) { return 'files' in e; }
function parseAsarHeader(asarPath) { const fd = fs.openSync(asarPath, 'r'); try { const sizeBuf = Buffer.alloc(8); fs.readSync(fd, sizeBuf, 0, 8, 0); const headerPickleSize = readPickleUint32(sizeBuf); const headerBuf = Buffer.alloc(headerPickleSize); fs.readSync(fd, headerBuf, 0, headerPickleSize, 8); const headerJson = readPickleString(headerBuf); return { header: JSON.parse(headerJson), headerPickleSize, dataOffset: 8 + headerPickleSize }; } finally { fs.closeSync(fd); } }
function collectFiles(dir, prefix, out) { for (const [name, entry] of Object.entries(dir.files)) { const entryPath = prefix ? `${prefix}/${name}` : name; if (isFileEntry(entry) && !entry.unpacked) { out.push({ entryPath, entry, oldOffset: parseInt(entry.offset, 10), oldSize: entry.size }); } else if (isDirectoryEntry(entry)) { collectFiles(entry, entryPath, out); } } }
function readFileFromAsar(asarPath, dataOffset, file) { if (file.oldSize === 0) return Buffer.alloc(0); const buf = Buffer.alloc(file.oldSize); const fd = fs.openSync(asarPath, 'r'); try { fs.readSync(fd, buf, 0, file.oldSize, dataOffset + file.oldOffset); } finally { fs.closeSync(fd); } return buf; }
function computeIntegrity(content, blockSize) { const hash = crypto.createHash('sha256').update(content).digest('hex'); const blocks = []; for (let i = 0; i < content.length; i += blockSize) { const end = Math.min(i + blockSize, content.length); blocks.push(crypto.createHash('sha256').update(content.subarray(i, end)).digest('hex')); } return { algorithm: 'SHA256', hash, blockSize, blocks }; }
function writeBuffer(out, data) { return new Promise((resolve, reject) => { const ok = out.write(data, (err) => { if (err) reject(err); }); if (ok) resolve(); else out.once('drain', resolve); }); }
function pipeChunk(srcPath, start, size, out) { if (size === 0) return Promise.resolve(); return new Promise((resolve, reject) => { const src = fs.createReadStream(srcPath, { start, end: start + size - 1 }); src.pipe(out, { end: false }); src.on('error', reject); src.on('end', resolve); }); }
const PATCH_MARKER = '/* __UXPRC_PERSIST__ */';
function patchBundleContent(content) { if (content.includes(PATCH_MARKER)) return { patched: content, status: 'already' }; const ctxRe = /(\w+)\.dirname\(e\.params\.manifest\),e\.params\.breakOnStart[\s\S]{0,600}?_handleLoadCommandResult/; const ctxMatch = content.match(ctxRe); if (!ctxMatch) { console.error('[bundle] Could not locate path-module variable near _handleLoadCommandResult.'); return { patched: content, status: 'failed' }; } const pathVar = ctxMatch[1]; const re = new RegExp('_handleLoadCommandResult",value:function\\((\\w+)\\)\\{var (\\w+)=\\{id:this\\.manifest\\.id,name:this\\.manifest\\.name\\};return (\\w+)\\.createFromLoadResults\\(\\1,\\2\\)\\}'); const m = content.match(re); if (!m) { console.error('[bundle] Could not match _handleLoadCommandResult pattern.'); return { patched: content, status: 'failed' }; } const [fullMatch, argVar, infoVar, sessionMod] = m; const replacement = `_handleLoadCommandResult",value:function(${argVar}){var ${infoVar}={id:this.manifest.id,name:this.manifest.name};var _s=${sessionMod}.createFromLoadResults(${argVar},${infoVar});try{_s.commitToRc(${pathVar}.dirname(this.params.manifest))}catch(_e){}${PATCH_MARKER}return _s}`; return { patched: content.replace(fullMatch, replacement), status: 'patched' }; }
function patchSourceContent(content) { if (content.includes(PATCH_MARKER) || content.includes('session.commitToRc(pluginFolder)')) return { patched: content, status: 'already' }; const target = 'return PluginSession.createFromLoadResults(loadResults, pluginInfo);'; if (!content.includes(target)) { console.error('[source] Could not find target line in PluginLoadCommand.js'); return { patched: content, status: 'failed' }; } const replacement = `const session = PluginSession.createFromLoadResults(loadResults, pluginInfo);\n        const pluginFolder = path.dirname(this.params.manifest);\n        session.commitToRc(pluginFolder); ${PATCH_MARKER}\n        return session;`; return { patched: content.replace(target, replacement), status: 'patched' }; }
async function patchAsarFile(asarPath) {
  const { header, dataOffset } = parseAsarHeader(asarPath);
  const files = [];
  collectFiles(header, '', files);
  files.sort((a, b) => a.oldOffset - b.oldOffset);
  const bundleFile = files.find((f) => f.entryPath.startsWith('dist/main.') && f.entryPath.endsWith('.js'));
  const sourceFile = files.find((f) => f.entryPath.endsWith('node_modules/@adobe/uxp-devtools-core/src/core/client/plugin/actions/PluginLoadCommand.js'));
  const patches = new Map();
  let bundleStatus = 'notfound';
  let sourceStatus = 'skipped';
  if (bundleFile) {
    const raw = readFileFromAsar(asarPath, dataOffset, bundleFile);
    const content = raw.toString('utf8');
    const { patched, status } = patchBundleContent(content);
    bundleStatus = status;
    if (status === 'failed') return { bundleStatus: 'failed', sourceStatus: 'skipped', summary: 'Bundle patch failed — pattern not found.' };
    if (status === 'patched') patches.set(bundleFile.entryPath, Buffer.from(patched, 'utf8')); }
  else { return { bundleStatus: 'notfound', sourceStatus: 'skipped', summary: 'Bundle not found (dist/main.*.js missing).' }; }
  if (sourceFile) {
    const raw = readFileFromAsar(asarPath, dataOffset, sourceFile);
    const content = raw.toString('utf8');
    const { patched, status } = patchSourceContent(content);
    sourceStatus = status;
    if (status === 'patched') patches.set(sourceFile.entryPath, Buffer.from(patched, 'utf8')); }
  if (patches.size === 0) return { bundleStatus, sourceStatus, summary: 'Already patched — no changes made.' };
  for (const file of files) {
    const patchedBuf = patches.get(file.entryPath);
    if (patchedBuf) {
      file.entry.size = patchedBuf.length;
      if (file.entry.integrity) {
        file.entry.integrity = computeIntegrity(patchedBuf, file.entry.integrity.blockSize); } } }
  let newOffset = 0;
  for (const file of files) { file.entry.offset = String(newOffset); newOffset += file.entry.size; }
  const headerPickle = writePickleString(JSON.stringify(header));
  const sizePickle = writePickleUint32(headerPickle.length);
  const tmpPath = asarPath + '.tmp';
  const bakPath = asarPath + '.bak';
  const out = fs.createWriteStream(tmpPath);
  try {
    await writeBuffer(out, sizePickle);
    await writeBuffer(out, headerPickle);
    for (const file of files) {
      const patchedBuf = patches.get(file.entryPath);
      if (patchedBuf) {
        await writeBuffer(out, patchedBuf); } else { const start = dataOffset + file.oldOffset; await pipeChunk(asarPath, start, file.oldSize, out); } }
    await new Promise((resolve, reject) => { out.end(() => resolve()); out.on('error', reject); }); }
  catch (err) { out.destroy(); try { fs.unlinkSync(tmpPath); } catch {} throw err; }
  if (!fs.existsSync(bakPath)) { fs.renameSync(asarPath, bakPath); } else { fs.unlinkSync(asarPath); }
  fs.renameSync(tmpPath, asarPath);
  const parts = [];
  if (bundleStatus === 'patched') parts.push('bundle patched');
  if (sourceStatus === 'patched') parts.push('source patched');
  return { bundleStatus, sourceStatus, summary: `Patched successfully (${parts.join(', ')}).` };
}
(async () => {
  const target = process.argv[2];
  if (!target) { console.error('Usage: node /Users/andreas.schwarz/Documents/SuperTranslatorPro/uxp_patch.js /path/to/app.asar'); process.exit(1); }
  try { const r = await patchAsarFile(target); console.log(r.summary); if (r.bundleStatus === 'failed' || r.bundleStatus === 'notfound') process.exit(1); } catch (e) { console.error('Error:', e && e.message ? e.message : e); process.exit(1); }
})();
