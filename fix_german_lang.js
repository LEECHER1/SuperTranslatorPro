const fs = require('fs');
let content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');

// The language code from fasttext or ngram might be 'de-DE', 'en-US', etc.
// The check `parsed.language.detectedLanguage.code.indexOf("de") !== 0` works because it correctly skips anything that doesn't start with "de".

// I notice you said "die funktioniert nicht so richtig. es soll auch nur deutsch überprüft werden."
// What does "funktioniert nicht so richtig" mean? Could it be that JSON.parse doesn't exist in older versions of ExtendScript, which throws an error "JSON is undefined"?
// Yes, JSON is generally NOT available in Adobe ExtendScript (unless explicitly polyfilled, e.g. json2.js).
