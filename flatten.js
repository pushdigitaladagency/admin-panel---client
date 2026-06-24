const fs = require('fs');

let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

// 1. Simplify renderSeoConfigurations
let seoRegex = /const renderSeoConfigurations = \(\) => \([\s\S]*?<div className="card-body"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\);/;
code = code.replace(seoRegex, (match, inner) => {
  // we also want to remove the grid inside the card-body if we had added it
  // and make sure it just returns a Fragment
  let innerClean = inner.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/g, '');
  // Since we removed an opening div, we need to remove the matching closing div
  innerClean = innerClean.replace(/<\/div>\s*$/, ''); // hacky but we know it's at the end
  // remove md:col-span-2 from SEO description
  innerClean = innerClean.replace(/md:col-span-2/g, '');
  return `const renderSeoConfigurations = () => (<>${innerClean}</>);`;
});


// 2. Flatten the form body
// We'll extract the form content
let formRegex = /<form onSubmit=\{handleSubmit\(onSubmit\)\}>([\s\S]*?)<\/form>/;
let formMatch = code.match(formRegex);
if (formMatch) {
  let formContent = formMatch[1];
  
  // Replace the top-level grid to be the single 2-column grid
  // We remove:
  // <div className="space-y-4">
  // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  // <div className="card" ...>
  // <div className="card-body" ...>
  // <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> -> we KEEP this one but maybe change its gap
  
  // Let's just remove ALL these layout wrappers and their closing tags.
  // A robust way is to parse lines and track indentation, but we can also just use regex to remove the opening tags,
  // and then remove all `</div>` that match their indentations, but that's hard.
  
  // Actually, let's just do it manually with multi_replace_file_content! It's much safer!
}
