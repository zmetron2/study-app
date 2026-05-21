const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../migrations/0031_enrich_professional_projects.sql');
const content = fs.readFileSync(filePath, 'utf8');

// We want to parse the SQL and find unescaped single quotes.
// A simple state machine to walk through the characters:
let inString = false;
let currentStringStartChar = -1;
let currentStringLine = -1;
let currentStringContent = '';

const lines = content.split('\n');
let totalQuotes = 0;

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  const line = lines[lineIdx];
  for (let colIdx = 0; colIdx < line.length; colIdx++) {
    const char = line[colIdx];
    
    if (char === "'") {
      // Check if it's a doubled single quote (escaped)
      const nextChar = colIdx + 1 < line.length ? line[colIdx + 1] : '';
      if (inString && nextChar === "'") {
        // Escaped single quote, skip next char too
        colIdx++;
        continue;
      }
      
      // Toggle state
      if (!inString) {
        inString = true;
        currentStringStartChar = colIdx;
        currentStringLine = lineIdx;
        currentStringContent = '';
      } else {
        // We hit a single quote. Is it the real end of the string?
        // In our SQL, a string is opened with SET description = ' or content = '
        // and closed either at the end of description line, or at the end of content section.
        // Let's print out all quotes in lines that are inside the string but not closing it.
        // For our simple check, let's see if the next non-whitespace characters are WHERE, SET, UPDATE, or comma.
        // If not, it's highly likely an unescaped quote inside a string!
        const remaining = line.substring(colIdx + 1).trim();
        const nextLines = lines.slice(lineIdx + 1).map(l => l.trim()).filter(l => l.length > 0);
        const nextContent = (remaining + ' ' + nextLines.slice(0, 3).join(' ')).trim();
        
        const isClosing = 
          remaining.startsWith(',') || 
          remaining.startsWith(';') || 
          nextContent.startsWith('WHERE') || 
          nextContent.startsWith('--') ||
          (line.trim().endsWith("'") && (nextContent.startsWith('WHERE') || nextContent.startsWith('UPDATE') || nextContent.startsWith('--')));
          
        if (isClosing) {
          inString = false;
        } else {
          console.log(`Potential unescaped quote at Line ${lineIdx + 1}, Col ${colIdx + 1}:`);
          console.log(`Line content: ${line}`);
          console.log(`Context: ... ${line.substring(Math.max(0, colIdx - 20), Math.min(line.length, colIdx + 20))} ...`);
          console.log('--------------------------------------------------');
        }
      }
    }
  }
}
