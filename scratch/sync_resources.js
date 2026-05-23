const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function sync() {
  console.log('Fetching all resources from the remote production D1 database...');
  
  // 1. Fetch remote resources as JSON
  let remoteData;
  try {
    const rawOutput = execSync('npx wrangler d1 execute vibe-db --remote --command "SELECT * FROM vibe_resources ORDER BY id ASC" --json', {
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024 // 50MB buffer
    });
    
    // Parse wrangler JSON output
    const parsed = JSON.parse(rawOutput);
    remoteData = parsed[0].results;
    console.log(`Successfully fetched ${remoteData.length} records from production.`);
  } catch (error) {
    console.error('Error fetching remote resources:', error);
    process.exit(1);
  }

  if (!remoteData || remoteData.length === 0) {
    console.log('No records found in remote database.');
    return;
  }

  // 2. Clear local table
  console.log('Clearing local vibe_resources table...');
  try {
    execSync('npx wrangler d1 execute vibe-db --local --command "DELETE FROM vibe_resources"', { stdio: 'inherit' });
    console.log('Local table cleared successfully.');
  } catch (error) {
    console.error('Failed to clear local table:', error);
    process.exit(1);
  }

  // 3. Build SQL statements for local insertion
  console.log('Inserting remote records into local D1 database...');
  
  // We will build a temporary SQL file to run all inserts in a single transaction
  const tempSqlPath = path.join(__dirname, 'temp_sync.sql');
  const sqlStatements = ['BEGIN TRANSACTION;'];

  for (const row of remoteData) {
    // Escape string values for SQL
    const escape = (val) => {
      if (val === null || val === undefined) return 'NULL';
      return `'${String(val).replace(/'/g, "''")}'`;
    };

    const columns = ['id', 'title', 'description', 'url', 'category', 'tags', 'provider', 'rating', 'icon_text', 'created_at'];
    const values = [
      row.id,
      escape(row.title),
      escape(row.description),
      escape(row.url),
      escape(row.category),
      escape(row.tags),
      escape(row.provider),
      row.rating,
      escape(row.icon_text),
      escape(row.created_at)
    ];

    sqlStatements.push(`INSERT INTO vibe_resources (${columns.join(', ')}) VALUES (${values.join(', ')});`);
  }

  sqlStatements.push('COMMIT;');

  fs.writeFileSync(tempSqlPath, sqlStatements.join('\n'), 'utf-8');

  // 4. Execute the temporary SQL file locally
  try {
    execSync(`npx wrangler d1 execute vibe-db --local --file "${tempSqlPath}"`, { stdio: 'inherit' });
    console.log('Local resources successfully synchronized with production database!');
  } catch (error) {
    console.error('Failed to insert records locally:', error);
  } finally {
    // Cleanup temporary SQL file
    if (fs.existsSync(tempSqlPath)) {
      fs.unlinkSync(tempSqlPath);
    }
  }
}

sync();
