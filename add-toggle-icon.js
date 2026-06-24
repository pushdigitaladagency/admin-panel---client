const fs = require('fs');
let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

// Replace showIcon with showIcon toggleCalendarOnIconClick
code = code.replace(/showIcon/g, "showIcon toggleCalendarOnIconClick");

fs.writeFileSync('src/components/posts/PostForm.jsx', code);
console.log('Added toggleCalendarOnIconClick');
