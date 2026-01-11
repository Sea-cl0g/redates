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
function convertMarkdownText(message, date) {
  const lines = date.split(/\r\n|\n/);
  const dict = buildSymbolDuct(lines);
  const result = [];

  const dateIndex = finfDateList(lines);
  if (dateIndex == -1) return "no Date";

  let i = dateIndex + 1;
  while (lines[i] && lines[i].startsWith("- ")) {
    const raw = lines[i].slice(2).trim();
    const parsed = parseDateLine(raw, dict);
    console.log(parsed);
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
  const match = line.match(/^(\d{1,2})\/(\d{1,2})(?:\s+(\d{4}|\d{2}))?(?:\s+(.+))?$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);

  let dateData;
  let comment;

  if (match[3] && /^\d{2,4}$/.test(match[3])) {
    // 年が指定
    let year = Number(match[3]);
    if (year < 100) year += 2000;
    dateData = new Date(year, month - 1, day);
    comment = match[4];
  } else {
    // 年が未指定
    const now = new Date();
    let year = now.getFullYear();
    let tmp = new Date(year, month - 1, day);

    if (tmp < now) {
      year += 1;
      tmp = new Date(year, month - 1, day);
    }

    dateData = tmp;
    comment = match[4];
  }

  if (comment) {
    const key = comment.trim();
    comment = key in dict ? (dict[key]?.trim() ?? "") : key;
  }

  return { dateData, comment };
}

function formatDate({ dateData, comment, useYear }) {
  const month = dateData.getMonth() + 1;
  const date = dateData.getDate();
  const day = useYear ? `(${dateData.getDay()})` : '';
  const commentText = !comment ? "" : `${comment}`;
  return `- ${month}月${date}日${day} ${commentText}`;
}

/*
function formatDate({ dateData, comment, useYear }, format) {
  const pad = (num, len = 2) => String(num).padStart(len, "0");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  const map = {
    yyyy: dateData.getFullYear(),
    MM: pad(dateData.getMonth() + 1),
    dd: pad(dateData.getDate()),
    HH: pad(dateData.getHours()),
    hh: pad(dateData.getHours() % 12 || 12),
    mm: pad(dateData.getMinutes()),
    ss: pad(dateData.getSeconds()),
    dddd: weekdays[dateData.getDay()],
  };

  result = format.replace(
    /yyyy|MM|dd|HH|hh|mm|ss|dddd/g,
    token => map[token]
  );
  return `${result} ${comment}`;
}
*/

// ============================================================================