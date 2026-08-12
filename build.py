import os, re, copy

import json as JSON

from datetime import datetime

from markdown import markdown

# Entries input path
INPUT_PATH = "./entries"

# Blog output path
OUTPUT_PATH = "./www"

def get_outfile(path):

    # Generate the output filename from the path
    outfile = "_".join(path.split("\\")[1:])

    # Relativee path is blank (root)
    if outfile == "":
        # Use index instead
        outfile = "index"

    return outfile


def get_blog_html(path, properties, navbar):

    # Output content
    content = None

    # Open the blog template html file
    with open("template.html", "r") as f:

        # Read contents from file
        content = f.read()

    # Content is not null
    if content:

        # Loop over the properties
        for k, v in properties.items():

            # Replace placeholder items
            content = content.replace(f"[{k}]", v)

        # Get output file name for the path
        outfile = get_outfile(path)

        # Replace the 'blog entries' keyword with the actual reference
        content = content.replace(
            "{BLOG_ENTRIES}", f"<script src='{outfile}.js'></script>"
        )

        # If the blog is set to 'include navbar'
        if properties["BLOG_INCLUDE_NAVBAR"].upper() == "TRUE":
            # Add the navbar contents
            content = content.replace("{BLOG_NAVBAR}", navbar)
        else:
            # Remove the navbar controller
            content = content.replace("{BLOG_NAVBAR}", "")

        # Add file extension
        outfile = f"{outfile}.html"

        # Generate the full output filepath
        outpath = os.path.normpath(os.path.join(OUTPUT_PATH, outfile))

        # Write contents to file
        with open(outpath, "w") as f:
            f.write(content)


def get_blog_js(path, entries):

    # Dump entries data to json format
    entries_json = JSON.dumps(entries)

    # Generate entries output content
    content = f"const ENTRIES = {entries_json}"

    # Get the output filename for the path
    outfile = f"{get_outfile(path)}.js"

    # Generate the full output filepath
    outpath = os.path.normpath(os.path.join(OUTPUT_PATH, outfile))

    # Write contents to file
    with open(outpath, "w") as f:
        f.write(content)


def get_entry_template(metadata):

    # Entry Template

    template = {"id": None, "date": None, "title": None, "tags": [], "content": None}

    # Loop over the metadata
    for k, v in metadata:
        match k:
            case "ENTRY_ID":
                template["id"] = v
            case "ENTRY_DATE":
                template["date"] = v
            case "ENTRY_TITLE":
                template["title"] = v
            case "ENTRY_TAGS":
                template["tags"] = v.strip().split(",")
            case _:  # Unhandled
                print(f"Unhandled meta tag: META_{k}")

    return template


def parse_content(content):
    """
    <!--META_ENTRY_ID=ebr-->
    <!--META_ENTRY_DATE=2026-01-12-->
    <!--META_ENTRY_TITLE=Announcing Emerald Battle Revolution!-->
    <!--META_ENTRY_TAGS=ebr-->
    """

    # Find all of the meta tags in the content
    metadata = re.findall("<!--META_(.*?)=(.*?)-->", content)

    # Get the entry template for the metadata
    entry = get_entry_template(metadata)

    # Add contents to the entry
    entry["content"] = content

    # Return entry data
    return entry


def parse_markdown(path):

    # Read the contents from the file
    with open(path, "r", encoding="utf8") as f:

        # Convert the markdown to html
        content = markdown(f.read())

        # Add 'pre-formatting', sub-sub heading class to the code tag
        content = content.replace("<code>", '<code class="subsubheading">')

        # Fix Headings
        content = content.replace("<h1>", "<h4 class='heading'>")
        content = content.replace("</h1>", "</h4>")

        # Fix Subheadings
        content = content.replace("<h2>", "<h5 class='subheading'>")
        content = content.replace("</h2>", "</h5>")

        # Fix Sub-Subheadings
        content = content.replace("<h3>", "<h6 class='subheading'>")
        content = content.replace("</h3>", "</h6>")

        # Find all 'a' tags
        iter = re.finditer('<a href=\"(.*?)\">', content)
        for i in iter:

            # Dereference match
            match = i.group()

            # Add the 'link' class to the end of the match
            replace = match.replace(">", " class='link'>")

            # Replace the match in the contents
            content = content.replace(match, replace)

        # Parse and return contents
        return parse_content(content)


def parse_html(path):

    # Read the contents from the file
    with open(path, "r", encoding="utf8") as f:
        # Parse and return contents
        return parse_content(f.read())


def parse_properties(path):

    # Properties Placeholder
    properties = {}

    # Read the contents from the file
    with open(path, "r", encoding="utf8") as f:
        content = f.readlines()

        # Loop over the lines
        for line in content:

            # Strip leading/trailing whitespace
            line_stripped = line.strip()

            # Split the k,v into values
            k, v = line_stripped.split("=")

            # Add values to properties
            properties[k] = v

    # Return blog properties
    return properties


def get_navbar(paths):

    # Navbar items list
    nav_items = []

    # Loop over the paths
    for path in paths:

        # Check for a blog properties file at the path
        properties_path = os.path.normpath(os.path.join(path, "blog.properties"))

        # If the blog properties file exists
        if os.path.exists(properties_path):

            # Parse the properties from the file
            properties = parse_properties(properties_path)

            # If the blog has a navbar name
            if properties["BLOG_NAVBAR_NAME"] != "":

                # Get outfile for the path
                outfile = f"{get_outfile(path)}.html"

                # Add the navbar link to the items
                nav_items.append(
                    f"<a class='text-soft px-2' href='{outfile}'>{properties["BLOG_NAVBAR_NAME"]}</a>"
                )

    return f"<div>{''.join(nav_items)}</div>"


def build_entries(paths):

    # List of blog paths
    blog_paths = copy.deepcopy(paths)

    # While paths left
    while len(paths):

        # Get the next path
        path = paths.pop()

        # Get items in the folder
        items = os.listdir(path)

        # Loop over items
        for item in items:

            # Get the normalised path to the item
            item_path = os.path.normpath(os.path.join(path, item))

            # If the item is a directory
            if os.path.isdir(item_path):

                # Add to the paths list (temporary)
                paths.append(item_path)

                # Add to blog paths list (permanent)
                blog_paths.append(item_path)

    # Build the navbar contents
    navbar = get_navbar(blog_paths)

    # Loop over the blog paths
    for path in blog_paths:

        # Blog properties
        properties = {
            "BLOG_TITLE": "Sample Blog Title",
            "BLOG_SUBTITLE": "Sample Blog Subtitle",
        }

        # List of blog entries
        entries = []

        # Get items in the folder
        items = os.listdir(path)

        # Loop over items
        for item in items:

            # Get the normalised path to the item
            item_path = os.path.normpath(os.path.join(path, item))

            # Item is a file
            if os.path.isfile(item_path):

                # Get the file extension
                _, ext = os.path.splitext(item_path)

                match ext:
                    case ".html":
                        entries.append(parse_html(item_path))

                    case ".md":
                        # Convert markdown filename to html file
                        html_path = item_path.replace(".md", ".html")

                        # No matching html file found
                        if not os.path.exists(html_path):

                            # Convert markdown to html
                            html = parse_markdown(item_path)

                            content = html["content"]

                            # Save converted html to file
                            with open(html_path, "w+") as f:
                                f.write(f"{content}\n")

                            # Add converted html to properties
                            entries.append(parse_markdown(item_path))

                        # If matching html file is found, will not be re-generated unless that file is deleted first
                        # This allows for fine-tuned adjustments to be made in the raw html for the blog entry

                    case ".properties":
                        properties = parse_properties(item_path)

                    case _:  # Default
                        print(f"Unhandled file extension: {ext}")

        # Sort the entries by date (from most recent to least recent)
        entries.sort(
            key=lambda e: datetime.strptime(e["date"], "%Y-%m-%d"), reverse=True
        )

        # Create html file for the blog
        get_blog_html(path, properties, navbar)

        # Create js file for the blog
        get_blog_js(path, entries)


if __name__ == "__main__":

    # Build the blog entries
    build_entries([INPUT_PATH])
