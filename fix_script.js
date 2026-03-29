const fs = require('fs');
let content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');

// Replace JSON.parse(resultStr) with eval("(" + resultStr + ")")
// And check language
content = content.replace(
    '                var parsed = JSON.parse(resultStr);\n                if (parsed && parsed.matches && parsed.matches.length > 0) {',
    '                var parsed = eval("(" + resultStr + ")");\n                if (parsed && parsed.language && parsed.language.detectedLanguage && parsed.language.detectedLanguage.code && parsed.language.detectedLanguage.code.indexOf("de") !== 0) {\n                    // Not German, skip\n                } else if (parsed && parsed.matches && parsed.matches.length > 0) {'
);

fs.writeFileSync('SuperTranslatorPro_v1.jsx', content);
