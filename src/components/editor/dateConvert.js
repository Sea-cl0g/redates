export function convertText(input, lang) {
  console.log(input, lang)
  if (lang == 1) {
    return convertMarkdownText(input);
  } else if (lang == 2) {
    return;
  } else if (lang == 3) {
    return;
  }
}

// ============================================================================
// markdown
function convertMarkdownText(input) {
  return convertMarkdown(input);
}

export function convertMarkdown(input) {
  const lines = input.split(/\r\n|\n/);
  const result = ["test", "test"];

  // dict
  const dict = {};
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^#\s*(\S+)/);
    if (match == "") continue;
    const key = match[1];
    if (key === "*") continue;
    if (key === "date") continue;
    dict[key] = lines[i + 1] ?? "";
  }

  return result.join("\n");
}




// ============================================================================



// ============================================================================