const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
console.log('✅ data.json 验证通过');
console.log('📊 案例总数:', data.cases.length);
console.log('📋 分类统计:');
const categories = {};
data.cases.forEach(c => {
    categories[c.category] = (categories[c.category] || 0) + 1;
});
Object.entries(categories).forEach(([cat, count]) => {
    console.log('  - ' + cat + ': ' + count + '个');
});
