import { rewriteText } from './aiSupport.js';
import jsYaml from 'js-yaml';

export function convertText(message, date, lang) {
  if (lang == 1) {
    return convertMarkdownText(message, date);
  } else if (lang == 2) {
    return convertJsonText(message, date);
  } else if (lang == 3) {
    return convertYamlText(message, date);
  }
}

export async function convertTextWithAI(message, date, lang, onUpdate) {
  if (lang == 1) {
    return await convertMarkdownTextWithAI(message, date, onUpdate);
  } else if (lang == 2) {
    return await convertJsonTextWithAI(message, date, onUpdate);
  } else if (lang == 3) {
    return await convertYamlTextWithAI(message, date, onUpdate);
  }
}

// ============================================================================
// markdown
function convertMarkdownText(message, date) {
  const lines = date.split(/\r\n|\n/);
  const dict = buildSymbolDuct(lines);
  const result = [];

  const dateIndex = finfDateList(lines);
  if (dateIndex == -1) return "Failed to parse the schedule.";

  const defaultFormat = "MM/dd(ddd)"
  const format = "format" in dict ? (dict["format"]?.trim() ?? defaultFormat) : defaultFormat;

  let i = dateIndex + 1;
  while (lines[i] && lines[i].startsWith("- ")) {
    const raw = lines[i].slice(2).trim();
    const parsed = parseDateLine(raw, dict);
    if (parsed != null) {
      result.push(formatDate(parsed, format));
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
    comment = match[4] ?? "";
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
    comment = match[4] ?? "";
  }

  const key = comment.trim();
  comment = key in dict ? (dict[key]?.trim() ?? "") : key;

  return { dateData, comment };
}

function formatDate({ dateData, comment }, format) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  const map = {
    yyyy: dateData.getFullYear(),
    MM: dateData.getMonth() + 1,
    dd: dateData.getDate(),
    ddd: weekdays[dateData.getDay()],
  };

  const result = format.replace(
    /yyyy|ddd|MM|dd/g,
    token => map[token]
  );
  return `${result} ${comment}`;
}

// ============================================================================
// JSON
function convertJsonText(message, date) {
  let dates;
  try {
    const json = JSON.parse(date);
    const markdown = json2markdown(json);
    dates = convertMarkdownText(message, markdown);
  } catch (e) {
    dates = e.message;
  } finally {
    return dates;
  }
}

async function convertJsonTextWithAI(message, date, onUpdate) {
  const basicResult = convertJsonText(message, date);
  const enhancedResult = await rewriteText(
    basicResult,
    onUpdate
  );
  return enhancedResult;
}

function json2markdown(json, nest = 1) {
  let result = [];
  const prefix = '#'.repeat(nest);
  for (const [key, value] of Object.entries(json)) {
    result.push(`${prefix} ${key}`);

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result.push(json2markdown(value, nest + 1));
    } else if (Array.isArray(value)) {
      for (const item of value) {
        const isObject = typeof item === 'object' && item !== null && !Array.isArray(item);
        const isDateObj = 'date' in item && 'year' in item && 'comment' in item;
        if (isObject && isDateObj) {
          result.push(`- ${item.date} ${item.year} ${item.comment}`);
        }
      }
    } else {
      result.push(String(value));
    }
  }
  return result.join('\n');
}

// ============================================================================
// YAML
function convertYamlText(message, date) {
  const json = yaml2json(date);
  return convertJsonText(message, json);
}

async function convertYamlTextWithAI(message, date, onUpdate) {
  const basicResult = convertYamlText(message, date);
  const enhancedResult = await rewriteText(
    basicResult,
    onUpdate
  );
  return enhancedResult;
}

function yaml2json(yaml) {
  const json = jsYaml.load(yaml);
  return JSON.stringify(json);
}