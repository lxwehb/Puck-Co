
// export-airtable.mjs
import fs from 'fs';
import path from 'path';

const AIRTABLE_API_KEY = 'pat3ZZ9vmTkZBjyWm.xxxxxxxxxxxxxx';

const BASES = [
  {
    id: 'appZLgeh4eHBXYk0c', // ID di kdp_buonanotte
    tables: ['01_Goodnight_Big_Hockey_Puck', '02_Goodnight_Little_Goalie', '01FEST_Buonanotte_Hallowen']
  },
  {
    id: 'appPw1ePAjGXfJkaB', // ID di kdp_rubik
    tables: ['rubik_s']
  }
];

async function fetchTable(baseId, tableName) {
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } });
  if (!res.ok) throw new Error(`Errore su ${tableName}`);
  const data = await res.json();
  return data.records.map(r => r.fields);
}

async function exportAll() {
  const allBooks = [];
  for (const base of BASES) {
    for (const table of base.tables) {
      console.log(`Scaricando ${table}...`);
      const records = await fetchTable(base.id, table);
      allBooks.push(...records);
    }
  }

  const outDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'books.json'), JSON.stringify(allBooks, null, 2));
  console.log(`✅ Esportati ${allBooks.length} libri in public/data/books.json`);
}

exportAll().catch(console.error);