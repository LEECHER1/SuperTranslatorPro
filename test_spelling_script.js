const fs = require('fs');

const content = fs.readFileSync('SuperTranslatorPro_v1.jsx', 'utf8');
const lines = content.split('\n');

for (let i = 590; i < 615; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
