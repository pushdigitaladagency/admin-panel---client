const fs = require('fs');
let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

if (!code.includes('activeFormat')) {
  code = code.replace(
    "const [mediaTarget, setMediaTarget] = React.useState(null); // 'featured' or 'gallery'",
    "const [mediaTarget, setMediaTarget] = React.useState(null); // 'featured' or 'gallery'\n  const [activeFormat, setActiveFormat] = React.useState(null);"
  );

  code = code.replace(
    /const handleFormat = \(e, command\) => \{\n\s*e\.preventDefault\(\);\n\s*document\.execCommand\(command, false, null\);/g,
    "const handleFormat = (e, command) => {\n    e.preventDefault();\n    document.execCommand(command, false, null);\n    setActiveFormat(prev => prev === command ? null : command);"
  );

  const buttonsHtmlOld = `<button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'bold')}><b>B</b></button>
                        <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'italic')}><i>I</i></button>
                        <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'underline')}><u>U</u></button>`;

  const buttonsHtmlNew = `<button type="button" className={\`btn btn-sm \${activeFormat === 'bold' ? 'btn-primary' : 'btn-secondary'}\`} style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'bold')}><b>B</b></button>
                        <button type="button" className={\`btn btn-sm \${activeFormat === 'italic' ? 'btn-primary' : 'btn-secondary'}\`} style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'italic')}><i>I</i></button>
                        <button type="button" className={\`btn btn-sm \${activeFormat === 'underline' ? 'btn-primary' : 'btn-secondary'}\`} style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'underline')}><u>U</u></button>`;

  code = code.replace(buttonsHtmlOld, buttonsHtmlNew);

  fs.writeFileSync('src/components/posts/PostForm.jsx', code);
  console.log("Successfully added activeFormat to PostForm.jsx");
} else {
  console.log("activeFormat already exists");
}
