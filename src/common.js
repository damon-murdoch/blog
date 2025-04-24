function parseMonSprites(content) {
  // Pokemon sprite regex
  const regex = /\[mon\]\{(.*?)\}/g;

  // Search over all of the 'mon' regexes
  for (const match of content.matchAll(regex)) {

    // Full string match
    const fullMatch = match[0];

    // Sprites inserted as table
    let table = "";

    // Get the matched sprites
    const sprites = match[1].split(',');
    for(const sprite of sprites) {
      table += `<td><img src='img/box/${sprite}.png'></img></td>`;
    }
    
    // Add table, tr elements to the contents
    table = `<table><tr>${table}</tr></table>`

    // Replace the original with the table
    content = content.replace(fullMatch, table);
  }

  // Updated content
  return content;
}

function parseLink(content) {
  
  // Pokemon sprite regex
  const regex = /\[link\]\{(.*?)\}/g;

  // [link]{Team Paste,https://pokepast.es/17a7be476fee6db1}
}

function parseGeneric(content) {
  // Generic regex replacement
  const regex = /\[([^\]]+)\]\{(.*?)\}/g;

  // Search over all of the matches
  for(const match of content.matchAll(regex)) {
    // Full string match
    const fullMatch = match[0];

    // Convert the generic tag into html format
    const parsed = `<${match[1]}>${match[2]}</${match[1]}>`;

    // Replace the original with the html format
    content = content.replace(fullMatch, parsed);
  }

  // Updated content
  return content;
}

function parse(content) {
  // Parse Pokemon sprites
  content = parseMonSprites(content);

  // Parse generic sections
  content = parseGeneric(content);

  // Return parsed content
  return content;
}