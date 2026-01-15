function getCleanUrl(url) {
  // Remove '#' from url
  url = url.replace('#', '');

  // Remove arguments from url
  return url.split('?')[0];
}

function getTags(tags) {
  // Tags list
  let list = [];

  // Get the clean (base) url for the page
  const url = getCleanUrl(window.location.href);

  // Loop over the tags
  for (const tag of tags) {
    list.push(`<a class='link' href='${url}?tag=${tag}'>${tag}</a>`);
  }

  // Add table, tr elements to the contents
  return `<p class='link'>${list.join(', ')}</p>`;
}

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
    for (const sprite of sprites) {
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

function parseList(content) {
  // Pokemon sprite regex
  const regex = /\[(ul|ol)\]\{(.*?)\}/gs;

  // Search over all of the 'list' regexes
  for (const match of content.matchAll(regex)) {

    // List placeholder
    let list = "";

    // Full string match
    const fullMatch = match[0];

    // Get the list type
    const type = match[1];

    // Get the list items
    const items = match[2].split('\n');

    // Add the list items
    for (const item of items) {
      // Item is not empty
      if (item !== "") {
        // Add item to the list
        list += `<li>${item}</li>`
      }
    }

    // Close the list
    list = `<${type}>${list}</${type}>`;

    // Replace the list with the parsed list
    content = content.replace(fullMatch, list);
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

function parseImage(content) {

  // [image]{Replacement Text,image url,behavior}

  // Pokemon sprite regex
  const regex = /\[image\]\{(.*?)\}/g;

  // Search over all of the 'mon' regexes
  for (const match of content.matchAll(regex)) {

    // Full string match
    const fullMatch = match[0];

    // Get the matched sprites
    const kv = match[1].split(',');

    // Exactly 3 values
    if (kv.length == 2) {

      // Dereference keys
      const alt = kv[0];
      const src = kv[1];

      // Fit image to parent width
      const image = `<a href='${src}' target='_Blank'><img src='${src}' alt='${alt}' class='img-fluid'></a>`;

      // Replace the original with the link
      content = content.replace(fullMatch, image);
    }
    else // More / less than 2 values
    {
      console.warn(`Failed for line ${match}: ${kv.length} values found, but 2 are expected.`)
    }
  }

  // Updated content
  return content;
}

function parseTable(content) {
  
  // [image]{Replacement Text,image url,behavior}

  // Table Rows / Headers
  const regex_tr_th = /\[(tr|th)\]\{(.*?)\}/gs;

  // Search over all of the 'tr', 'th' regexes
  for (const match of content.matchAll(regex_tr_th)) {

    // Row contents
    const row = [];

    // Full string match
    const fullMatch = match[0];

    // Columns within the row
    const cols = match[2].split('\n');

    // Loop over the columns
    for(const col of cols) {
      // Add column to table if it has any contents
      if (col.length > 0) row.push(`<td>${col}</td>`);
    }

    // Generate the text for the full row
    const parsed = `<${match[1]}>${row.join("")}</${match[1]}>`

    // Replace the original with the link
    content = content.replace(fullMatch, parsed);
  }

  const regex_table = /\[table\]\{(.*?)\}/gs;

  // Search for all of the 'table' regexes
  for(const match of content.matchAll(regex_table)) {

    // <div class='table-responsive'>
    // <table class='mx-auto w-auto'>

    // Full string match
    const fullMatch = match[0];

    // Create table
    const parsed = `<div class='table-responsive'><table class='mx-auto w-auto'>${match[1]}</table></div>`;

    // Replace the original with the link
    content = content.replace(fullMatch, parsed);
  }

  // Updated content
  return content;
}

function parseFormatting(content) {
  // Regex replacement for formatting tags
  const regex = /\[(b|i|u|em|strong|mark|small|sub|sup|pre)\]\{(.*?)\}/gs;

  // Search over all of the matches
  for (const match of content.matchAll(regex)) {
    // Generate parsed content
    const parsed = `<${match[1]}>${match[2]}</${match[1]}>`;

    // Replace the original with the html format
    content = content.replace(match[0], parsed);
  }

  // Updated content
  return content;
}

function parseGeneric(content) {
  // Generic regex replacement
  const regex = /\[([^\]]+)\]\{(.*?)\}/gs;

  // Search over all of the matches
  for (const match of content.matchAll(regex)) {
    // Full string match
    const fullMatch = match[0];

    // Tag for the element
    const tag = match[1];

    // New Content
    let parsed = "";

    // Special cases
    switch (tag) {
      // Team Paste
      case 'paste': {
        parsed = `<a href='${match[2]}' class='link'>Team Paste</a>`
      }; break;
      // Code Block
      case 'code': {
        parsed = `<code><pre class='subsubheading'>${match[2]}</code></pre>`
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

function removeComments(content) {
  return content.replace(/#.*$/gm, '');
}

function parse(content) {

  // Remove comments
  content = removeComments(content);

  // Parse Pokemon sprites
  content = parseMonSprites(content);

  // Parse formatting
  content = parseFormatting(content);

  // Parse links
  content = parseLink(content);

  // Parse images
  content = parseImage(content);

  // Parse lists
  content = parseList(content);

  // Parse tables
  content = parseTable(content);

  // Parse generic sections
  content = parseGeneric(content);

  // Return parsed content
  return content;
}
