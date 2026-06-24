const fs = require('fs');

function processFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  
  content = content.replace(/'#ffffff'/g, "'var(--color-bg-alt)'");
  content = content.replace(/'#fcfcfc'/g, "'var(--color-surface)'");
  content = content.replace(/'#0f172a'/g, "'var(--color-text)'");
  content = content.replace(/'#475569'/g, "'var(--color-text-muted)'");
  content = content.replace(/'#f1f5f9'/g, "'var(--color-surface)'");
  content = content.replace(/'#e2e8f0'/g, "'var(--color-border)'");
  content = content.replace(/'#f3e8ff'/g, "'var(--color-surface-hover)'");

  fs.writeFileSync(path, content);
}

processFile('src/app/(cms)/dashboard/page.jsx');
processFile('src/components/dashboard/UserGrowthChart.jsx');
processFile('src/components/dashboard/PostActivityChart.jsx');
