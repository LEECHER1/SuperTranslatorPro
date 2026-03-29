const fs = require('fs');
let content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');

// Also move $.sleep(1200) to a finally block or at the end of loop.
// In javascript try-catch there is no finally in all engines, but we can put it outside the if statement

content = content.replace(
    '// Schutz vor Blockierung durch die kostenlose API (Max. 20 Anfragen / Minute)\n            $.sleep(1200); \n        } catch (e) {',
    '// Schutz vor Blockierung durch die kostenlose API (Max. 20 Anfragen / Minute)\n        } catch (e) {\n            // Ignoriere Fehler pro Textblock\n        }\n        $.sleep(1200);'
);

content = content.replace(
    '        } catch (e) {\n            // Ignoriere Fehler pro Textblock\n        }\n    }\n    progressWin.close();',
    '    }\n    progressWin.close();'
);

fs.writeFileSync('SuperTranslatorPro_v1.jsx', content);
