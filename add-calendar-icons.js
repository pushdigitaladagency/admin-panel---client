const fs = require('fs');

let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

// 1. Add Calendar to lucide-react import
if (code.includes("import { ImagePlus, FileText } from 'lucide-react';")) {
  code = code.replace(
    "import { ImagePlus, FileText } from 'lucide-react';",
    "import { ImagePlus, FileText, Calendar } from 'lucide-react';"
  );
} else if (!code.includes("Calendar } from 'lucide-react'")) {
  code = code.replace(
    "import { ImagePlus, FileText",
    "import { ImagePlus, FileText, Calendar"
  );
}

// 2. Add showIcon and icon to DatePicker
code = code.replace(/<DatePicker/g, '<DatePicker showIcon icon={<Calendar size={18} className="text-gray-500" />}');

fs.writeFileSync('src/components/posts/PostForm.jsx', code);
console.log('Icons added successfully');
