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

function convertMarkdown(input) {
  const lines = input.split(/\r\n|\n/);
  const dict = buildSymbolDuct(lines);
  const result = [];

  const dateIndex = finfDateList(lines);
  if (dateIndex == -1) return "no Date";

  let i = dateIndex + 1;
  while (lines[i] && lines[i].startsWith("- ")) {
    const raw = lines[i].slice(2).trim();
    const parsed = parseDateLine(raw, dict);

    if (parsed != null) {
      result.push(formatDate(parsed));
    }
    i++;
  }

  console.log(result)
  return result.join("\n");
}

function buildSymbolDuct(lines) {
  const dict = {};

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^#\s*(\S+)/);
    if (!match) continue;

    const key = match[1];
    if (key === "*") continue;
    if (key === "date") continue;
    dict[key] = lines[i + 1] ?? "";
  }

  return dict;
}

function finfDateList(lines) {
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^#\s*(\S+)/);
    if (!match) continue;

    const key = match[1];
    if (key === "date") {
      return i;
    }
  }
  return -1;
}

function parseDateLine(line, dict) {
  const match = line.match(/^(\d{1,2})\/(\d{1,2})\s+(.+)$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  let comment = match[3].trim();

  if (comment in dict) {
    comment = dict[comment]?.trim() ?? "";
  }

  return { month, day, comment };
}

function formatDate({ month, day, comment }) {
  return `- ${month}月${day}日（${comment}）`;
}

// ============================================================================