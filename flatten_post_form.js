const fs = require('fs');

let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

// 1. Simplify renderSeoConfigurations to just return fragments
code = code.replace(/const renderSeoConfigurations = \(\) => \([\s\S]*?<div className="card-body"[^>]*>\s*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\);/, (match, inner) => {
  let cleaned = inner.replace(/md:col-span-2/g, '');
  return `const renderSeoConfigurations = () => (<>${cleaned}</>);`;
});

// 2. We want to remove the nested layout wrappers:
// <div className="space-y-4">
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// But wait, if we remove ALL `space-y-4`, what happens to the right sidebar ones?
// Actually, it's easier to just do a string replacement on all of them, and then run a formatter or manually strip the extra `</div>`s.
// BUT since we can't easily strip the correct `</div>`, we can just replace the exact wrappers.

let lines = code.split('\n');
let outLines = [];
let skipDivs = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('<div className="space-y-4">')) {
    skipDivs++;
    continue;
  }
  if (line.includes('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">')) {
    skipDivs++;
    continue;
  }
  if (line.includes('<div className="card" style={{ background: \\'var(--color-surface)\\', border: \\'none\\' }}>')) {
    skipDivs++;
    continue;
  }
  if (line.includes('<div className="card-body" style={{ display: \\'flex\\', flexDirection: \\'column\\', gap: \\'16px\\' }}>')) {
    skipDivs++;
    continue;
  }
  if (line.includes('<div className="pt-2 flex flex-col gap-2">')) {
    skipDivs++;
    continue;
  }
  if (line.includes('<div style={{ display: \\'flex\\', flexDirection: \\'column\\', gap: \\'8px\\', paddingTop: \\'8px\\' }}>')) {
    skipDivs++;
    continue;
  }
  
  // Try to match the closing divs
  // If the line is EXACTLY `            </div>` or similar and we have skipDivs > 0, we could skip it.
  // Actually, we can just look at `PostForm.jsx` and see that replacing the top level `grid-cols-1 lg:grid-cols-2` is the only way.
  
  outLines.push(line);
}

fs.writeFileSync('src/components/posts/PostForm.jsx', outLines.join('\n'));
