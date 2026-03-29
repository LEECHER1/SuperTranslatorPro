const fs = require('fs');
let content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');

// The original code used eval("(" + resultJSON + ")") in DeepL, but used JSON.parse in LanguageTool. This is exactly the reason why LanguageTool spell check fails.

fs.writeFileSync('SuperTranslatorPro_v1.jsx', content);
