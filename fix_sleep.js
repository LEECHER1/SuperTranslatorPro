const fs = require('fs');
let content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');

// Replace the try/catch block to ensure $.sleep(1200) executes for every request regardless of exceptions
// In ExtendScript, the try/catch can have a finally block

content = content.replace(
    '            // Schutz vor Blockierung durch die kostenlose API (Max. 20 Anfragen / Minute)\n            $.sleep(1200); \n        } catch (e) {\n            // Ignoriere Fehler pro Textblock\n        }',
    '        } catch (e) {\n            // Ignoriere Fehler pro Textblock\n        } finally {\n            // Schutz vor Blockierung durch die kostenlose API (Max. 20 Anfragen / Minute)\n            $.sleep(1200);\n        }'
);

fs.writeFileSync('SuperTranslatorPro_v1.jsx', content);
