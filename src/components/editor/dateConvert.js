import { rewriteText } from './aiSupport.js';

export function convertText(message, date, lang) {
  if (lang == 1) {
    return convertMarkdownText(message, date);
  } else if (lang == 2) {
    return;
  } else if (lang == 3) {
    return;
  }
}

export async function convertTextWithAI(message, date, lang, onUpdate) {
  if (lang == 1) {
    return await convertMarkdownTextWithAI(message, date, onUpdate);
  } else if (lang == 2) {
    return;
  } else if (lang == 3) {
    return;
  }
}

// ============================================================================
// markdown
function convertMarkdownText(date) {
  const lines = date.split(/\r\n|\n/);
  const dict = buildSymbolDuct(lines);
  const result = [];

  const dateIndex = finfDateList(lines);
  if (dateIndex == -1) return "no Date";

  let i = dateIndex + 1;
  while (lines[i] && lines[i].startsWith("- ")) {
    const raw = lines[i].slice(2).trim();
    const parsed = parseDateLine(raw, dict);
    console.log(parsed)

    if (parsed != null) {
      result.push(formatDate(parsed));
    }
    i++;
  }
  const dates = result.join("\n");
  return message ? `${message}\n\n${dates}` : dates;
}

async function convertMarkdownTextWithAI(message, date, onUpdate) {
  const basicResult = convertMarkdownText(message, date);

  const enhancedResult = await rewriteText(
    basicResult,
    onUpdate
  );

  return enhancedResult;
}

function buildSymbolDuct(lines) {
  const dict = {};

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^#\s*(\S+)/);
    if (!match) continue;

    const key = match[1];
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
    if (key.toLowerCase() === "date" || key.toLowerCase() === "dates") {
      return i;
    }
  }
  return -1;
}

function parseDateLine(line, dict) {
  const match = line.match(/^(\d{1,2})\/(\d{1,2})(?:\s+(.+))?$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  let comment;
  if (match[3]) {
    comment = match[3].trim();
  }

  if (comment in dict) {
    comment = dict[comment]?.trim() ?? "";
  }

  return { month, day, comment };
}

function formatDate({ month, day, comment }) {
  comment = !comment ? "" : `（${(comment)}）`
  return `- ${month}月${day}日${(comment)}`;
}

// ============================================================================