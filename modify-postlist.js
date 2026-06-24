const fs = require('fs');
let code = fs.readFileSync('src/app/(cms)/posts/[postType]/page.jsx', 'utf8');

// 1. Labels
code = code.replace(
  `  const postTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Events'
      : 'Press Releases';`,
  `  const postTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Events'
      : postType === 'enquiry'
        ? 'Contact Forms'
        : 'Press Releases';`
);

code = code.replace(
  `  const singularPostTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Event'
      : 'Press Release';`,
  `  const singularPostTypeLabel = postType === 'news'
    ? 'News'
    : postType === 'event'
      ? 'Event'
      : postType === 'enquiry'
        ? 'Contact Form'
        : 'Press Release';`
);

// 2. Mock Data
const oldData = `  ] : [
    { id: 1, title: 'Acme Corp Announces Strategic Partnership', category: 'Partnerships', status: 'published', publish_date: '2026-06-20T10:00:00Z', featured: 'Yes' },
    { id: 2, title: 'Quarterly Earnings Report Q2', category: 'Financial', status: 'draft', publish_date: '2026-06-21T14:30:00Z', featured: 'No' },
  ];`;

const newData = `  ] : postType === 'enquiry' ? [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', subject: 'Interested in Services', status: 'New', date: '2026-06-24T10:00:00Z' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', subject: 'Support Request', status: 'In Progress', date: '2026-06-23T14:30:00Z' },
  ] : [
    { id: 1, title: 'Acme Corp Announces Strategic Partnership', category: 'Partnerships', status: 'published', publish_date: '2026-06-20T10:00:00Z', featured: 'Yes' },
    { id: 2, title: 'Quarterly Earnings Report Q2', category: 'Financial', status: 'draft', publish_date: '2026-06-21T14:30:00Z', featured: 'No' },
  ];`;

code = code.replace(oldData, newData);

// 3. Columns
const oldColumns = `  ] : [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },`;

const newColumns = `  ] : postType === 'enquiry' ? [
    { header: 'ID', render: (row) => \`#\${row.id}\` },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Subject', accessorKey: 'subject' },
    {
      header: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'Status',
      render: (row) => {
        const badgeColor = row.status === 'New' ? 'badge-primary' : row.status === 'In Progress' ? 'badge-warning' : row.status === 'Responded' ? 'badge-info' : 'badge-success';
        return <span className={\`badge \${badgeColor}\`}>{row.status}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={\`/posts/\${postType}/\${row.id}/edit\`} className="btn btn-secondary btn-sm">
            View / Edit
          </Link>
        </div>
      ),
    },
  ] : [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },`;

code = code.replace(oldColumns, newColumns);

fs.writeFileSync('src/app/(cms)/posts/[postType]/page.jsx', code);
