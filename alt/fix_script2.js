const fs = require('fs');
let content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');

// There's a problem when parsing json strings that have special characters in eval if not wrapped safely.
// And since it was JSON.parse before, eval can be a security issue but for ExtendScript eval("(" + str + ")") is standard JSON parser if no JSON object exists.
// Actually there is a library JSON 3 that can be loaded, or eval("(" + jsonString + ")") works.

fs.writeFileSync('SuperTranslatorPro_v1.jsx', content);
