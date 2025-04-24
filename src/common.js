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
  
  // [link]{Team Paste,https://pokepast.es/17a7be476fee6db1}

  // Pokemon sprite regex
  const regex = /\[link\]\{(.*?)\}/g;

  // Search over all of the 'mon' regexes
  for (const match of content.matchAll(regex)) {

    // Full string match
    const fullMatch = match[0];

    // Get the matched sprites
    const kv = match[1].split(',');

    // Exactly 2 values
    if (kv.length == 2) {
      
      // Dereference keys
      const text = kv[0];
      const href = kv[1];

      // Generate the link text
      const link = `<a href='${href}' class='link'>${text}</a>`;
      
      // Replace the original with the link
      content = content.replace(fullMatch, link);
    }
    else // More / less than 2 values
    {
      console.warn(`Failed for line ${match}: ${kv.length} values found, but 2 are expected.`)
    }
  }

  // Updated content
  return content;
}

function parseGeneric(content) {
  // Generic regex replacement
  const regex = /\[([^\]]+)\]\{(.*?)\}/g;

  // Search over all of the matches
  for(const match of content.matchAll(regex)) {
    // Full string match
    const fullMatch = match[0];

    // Tag for the element
    const tag = match[1];

    // New Content
    let parsed = "";

    // Special cases
    switch(tag) {
      // Team Paste
      case 'paste': {
        parsed = `<a href='${match[2]}' class='link'>Team Paste</a>`
      }; break;
      // Heading
      case 'h': {
        parsed = `<h4 class='heading'>${match[2]}</h4>`;
      }; break;
      // Sub-heading
      case 'sh': {
        parsed = `<h5 class='subheading'}>${match[2]}</h5>`;
      }; break;
      // Sub-subheading
      case 'ssh': {
        parsed = `<h6 class='subsubheading'}>${match[2]}</h6>`;
      }; break;
      default: {
        // Convert the generic tag into html format
        parsed = `<${match[1]}>${match[2]}</${match[1]}>`;
      }; break;
    }

    // Replace the original with the html format
    content = content.replace(fullMatch, parsed);
  }

  // Updated content
  return content;
}

function parse(content) {
  // Parse Pokemon sprites
  content = parseMonSprites(content);

  // Parse links
  content = parseLink(content);

  // Parse generic sections
  content = parseGeneric(content);

  // Return parsed content
  return content;
}