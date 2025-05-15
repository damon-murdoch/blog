function showPageControls(page=0) {
  // Get the body for the page
  const content = document.getElementById('content');

  // Create the page controller entry
  const controls = document.createElement('div');

  // Apply container classes
  controls.classList.add("container", "text-soft", "rounded", "my-2", "p-4");

  // Get the number of entries
  const count = ENTRIES.length;

  // Get the first index for the page
  const first = page * CONFIG.limit;

  // Get the last index for the page
  const last = Math.min(first + CONFIG.limit, count);

  // Get the clean url for the page
  const url = getCleanUrl(window.location.href);

  // Control div contents
  let contents = "";

  // At least one previous page
  if (first > 0) {
    // Add link to the previous page
    contents += `<a class='link' href='${url}?page=${page-1}'>Previous Page</a>`;
  } 
  else // No previous page
  {
    // Add padding element
    contents += "<p></p>";
  }

  // At least one following page
  if (last < count) {
    // Add link to the previous page
    contents += `<a class='link' href='${url}?page=${page+1}'>Next Page</a>`;
  } 
  else // No following page
  {
    // Add padding element
    contents += "<p></p>";
  }

  // Create Entry Contents
  controls.innerHTML = `
<div class='d-flex justify-content-between align-items-center'>
  ${contents}
</div>`;

  // Apply style width
  controls.style.minWidth = CONFIG.width.min;
  controls.style.maxWidth = CONFIG.width.max;

  // Apply style opacity
  controls.style.opacity = CONFIG.opacity;

  // Add the entry to the page
  content.appendChild(controls);
}

function showArticle(index) {

  // Get the body for the page
  const content = document.getElementById('content');

  // Dereference the entry
  const ENTRY = ENTRIES[index];

  // Parse the entry contents
  const parsed = parse(ENTRY.content);

  // Create the blog entry
  const entry = document.createElement('div');

  // Apply container classes
  entry.classList.add("container", "bg-dark", "text-soft", "rounded", "my-2", "p-4");

  // Get the tag link contents
  const tags = getTags(ENTRY.tags);

  // Get the clean (base) url for the page
  const url = getCleanUrl(window.location.href);

  // Create Entry Contents
  entry.innerHTML = `
<div class='d-flex justify-content-between align-items-center'>
  <p>
    <a class='link' href='${url}?id=${ENTRY.id}'>${ENTRY.date}</a>
  </p>
  ${tags}
</div>
<h3><a class='highlight' href='${url}?id=${ENTRY.id}'>${ENTRY.title}</a></h3>
<div>
${parsed}
</div>
`;

  // Apply style width
  entry.style.minWidth = CONFIG.width.min;
  entry.style.maxWidth = CONFIG.width.max;

  // Apply style opacity
  entry.style.opacity = CONFIG.opacity;

  // Add the entry to the page
  content.appendChild(entry);
}

// Show page (articles)
function showPage(page = 0) {

  // Get the number of entries
  const count = ENTRIES.length;

  // Get the first index for the page
  const first = page * CONFIG.limit;

  // Entry out of range
  if (count < first) {
    // Go back to first page
    return showPage(0);
  }

  // Get the last index for the page
  const last = Math.min(first + CONFIG.limit, count);

  // Top controls enabled
  if (CONFIG.controls.top) {
    // Add top page controls
    showPageControls(page);
  }

  // Loop over the page entries
  for (let i = first; i < last; i++) {
    showArticle(i);
  }

  // Bottom controls enabled
  if (CONFIG.controls.bottom) {
    // Add bottom page controls
    showPageControls(page);
  }
}

function showTaggedArticles(tag) {
  // List of articles
  const articles = [];

  // Loop over the entries
  for (const index in ENTRIES) {
    // Get the entry at the index
    const entry = ENTRIES[index];

    // If the article has the tag
    if (entry.tags.includes(tag)) {
      // Add index to list
      articles.push(index);
    }
  }

  // At least one article
  if (articles.length > 0) {
    // Loop over the articles
    for (const article of articles) {
      // Show the article
      showArticle(article);
    }
  }
  else // No articles
  {
    // First page
    showPage();
  }
}

function showArticleId(id) {
  // Find the article with the id provided
  const article = ENTRIES.findIndex(a => a.id === id);

  // Article found
  if (article > -1) {
    showArticle(article)
  }
  else // Not found
  {
    // First page
    showPage();
  }
}

function init() {
  // Get the title 
  const home = document.getElementById('home');

  // Set the target url to the home page
  home.href = getCleanUrl(window.location.href);

  // Get the search parameters for the page
  const params = new URLSearchParams(document.location.search);

  if (params.has('page')) {
    // Page number 
    showPage(params.get('page'));
  } else if (params.has('id')) {
    // Show Article with 'id'
    showArticleId(params.get('id'));
  } else if (params.has('tag')) {
    // Show Tagged Articles
    showTaggedArticles(params.get('tag'));
    // No params
  } else {
    // First page
    showPage();
  }
}

// Initialise the page
init();