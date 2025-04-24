/*
* Javascript code goes here :)
* Any libraries should be placed in directory 'src' or 'js', 
* and included in the project by adding something similar to
* the following to 'index.html': 
*/

function populate(page = 0) {

  // Get the body for the page
  const content = document.getElementById('content');

  // Blog entries will be added to this section

  // Get the number of entries
  const count = ENTRIES.length;

  // Get the first index for the page
  const first = page * CONFIG.limit;

  // Entry out of range
  if (count < first) {
    // Go back to first page
    return populate(0);
  }

  // Get the last index for the page
  const last = Math.min(first + CONFIG.limit, count);

  // Loop over the page entries
  for (let i = first; i < last; i++) {

    // Dereference the entry
    const ENTRY = ENTRIES[i];

    // Parse the entry contents
    const parsed = parse(ENTRY.content);

    // Create the blog entry
    const entry = document.createElement('div');

    // Apply container classes
    entry.classList.add("container", "bg-dark", "text-secondary", "rounded", "my-2", "pb-3");

    // Create Entry Contents
    entry.innerHTML = `
<p>${ENTRY.date}<p>
<h4>${ENTRY.title}</h4>
<div>
${parsed}
</div>
`;

    // Apply style opacity
    entry.style.opacity = 0.8;

    // Add the entry to the page
    content.appendChild(entry);
  }
}

populate();