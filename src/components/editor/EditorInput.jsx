import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { json, jsonLanguage } from "@codemirror/lang-json";
//import { yamlLanguage } from "@codemirror/lang-yaml";
import { languages } from "@codemirror/language-data";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import { keymap } from "@codemirror/view";
import { Prec } from '@codemirror/state';
import ReactCodeMirror from "@uiw/react-codemirror";

import { useState, useMemo, useEffect } from 'react';
import { Input, Flex, Tabs, Divider } from 'antd';

import markdownTemplate from '../../../assets/templates/date.md?raw';
import jsonTemplate from '../../../assets/templates/date.json?raw';
import yamlTemplate from '../../../assets/templates/date.yaml?raw';

// ============================================================================ //


function EditorInputMessage({ onMessageChange }) {
    const onChange = key => {
        onMessageChange(key.target.value);
    };
    return (
        <Input.TextArea rows={3} placeholder="Input Message" allowClear onChange={onChange} />
    );
};

// ============================================================================ //
const getNextDate = (month, day) => {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date(currentYear, month - 1, day);
    currentDate.setDate(currentDate.getDate() + 1);
    return {
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate()
    };
};

function CodeEditor({ value, onChange, extensions, LangTabValue }) {
    const shouldInsertNewDate = (state, lineNumber, nextMonth, nextDay) => {
        const nextLine = state.doc.line(lineNumber + 1);
        if (!nextLine) return true;
        const nextLineText = nextLine.text;
        const dateMatch = nextLineText.match(/^-\s+(\d{1,2})\/(\d{1,2})/);
        if (!dateMatch) return true;
        const existingMonth = parseInt(dateMatch[1], 10);
        const existingDay = parseInt(dateMatch[2], 10);
        return !(existingMonth === nextMonth && existingDay === nextDay);
    };

    const markdownEnterKeyExtension = useMemo(() => {
        return Prec.highest(keymap.of([{
            key: "Enter",
            run: (view) => {
                const { state } = view;
                const { from } = state.selection.main;
                const line = state.doc.lineAt(from);
                const lineText = line.text;
                const dateMatch = lineText.match(/^-\s+(\d{1,2})\/(\d{1,2})/);
                if (dateMatch) {
                    const m = parseInt(dateMatch[1], 10);
                    const d = parseInt(dateMatch[2], 10);
                    const { month: nextMonth, day: nextDay } = getNextDate(m, d);
                    if (shouldInsertNewDate(state, line.number, nextMonth, nextDay)) {
                        const newLine = `\n- ${nextMonth}/${nextDay} `;
                        view.dispatch({ changes: { from: line.to, insert: newLine }, selection: { anchor: line.to + newLine.length } });
                        return true;
                    }
                }
                return false;
            }
        }]));
    }, []);
    const jsonEnterKeyExtension = useMemo(() => {
        return Prec.highest(keymap.of([{
            key: "Enter",
            run: (view) => {
                const { state } = view;
                const { from } = state.selection.main;
                const line = state.doc.lineAt(from);
                const lineText = line.text;
                const dateMatch = lineText.match(/\{\s*"date"\s*:\s*"(\d{1,2})\/(\d{1,2})"\s*,\s*"year"\s*:\s*"(\d{4})"\s*,\s*"comment"\s*:\s*"([^"]*)"\s*\}\s*(,?)/);
                if (dateMatch) {
                    const m = parseInt(dateMatch[1], 10);
                    const d = parseInt(dateMatch[2], 10);
                    const year = dateMatch[3];
                    const hasComma = dateMatch[5] === ',';
                    const nextLine = line.number < state.doc.lines ? state.doc.line(line.number + 1) : null;
                    const hasNextObject = nextLine && nextLine.text.trim().match(/^\{/);
                    const { month: nextMonth, day: nextDay } = getNextDate(m, d);
                    if (shouldInsertNewDate(state, line.number, nextMonth, nextDay)) {
                        let newLine = `\n    {"date":"${nextMonth}/${nextDay}", "year":"${year}", "comment":""}`;
                        if (!hasComma) {
                            newLine = `,${newLine}`;
                        }
                        if (hasNextObject) {
                            newLine = `${newLine},`;
                        }
                        view.dispatch({
                            changes: { from: line.to, insert: newLine },
                            selection: { anchor: line.to + newLine.length }
                        });
                        return true;
                    }
                }
                return false;
            }
        }]));
    }, []);
    const yamlEnterKeyExtension = useMemo(() => { }, []);
    let enterKeyExtension;
    if (LangTabValue === '1') {
        enterKeyExtension = markdownEnterKeyExtension;
    } else if (LangTabValue === '2') {
        enterKeyExtension = jsonEnterKeyExtension;
    } else if (LangTabValue === '3') {
        enterKeyExtension = yamlEnterKeyExtension;
    }
    return (
        <ReactCodeMirror
            value={value}
            onChange={onChange}
            theme={xcodeLight}
            height="100%"
            extensions={[
                extensions,
                enterKeyExtension,
            ]}
        />
    )
}

function EditorInputDate({ onInputChange }) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const nextDate1 = getNextDate(month, date);
    const nextDate2 = getNextDate(nextDate1.month, nextDate1.day);
    const nextDate3 = getNextDate(nextDate2.month, nextDate2.day);
    const replaceTemplate = (template) => {
        return template
            .replace("$MONTH1", `${nextDate1.month}`)
            .replace("$DATE1", `${nextDate1.day}`)
            .replace("$MONTH2", `${nextDate2.month}`)
            .replace("$DATE2", `${nextDate2.day}`)
            .replace("$MONTH3", `${nextDate3.month}`)
            .replace("$DATE3", `${nextDate3.day}`);
    };
    const markdownDefaultVal = replaceTemplate(markdownTemplate);
    const jsonDefaultVal = replaceTemplate(jsonTemplate);
    const [markdownDateContent, setMarkdownDateContent] = useState(markdownDefaultVal);
    const [jsonDateContent, setJsonDateContent] = useState(jsonDefaultVal);
    const [LangTabValue, setLangTabValue] = useState("1");

    const onLangTabChange = (tabVal) => {
        if (tabVal === '1') {
            onInputChange(markdownDateContent, tabVal);
        } else if (tabVal === '2') {
            onInputChange(jsonDateContent, tabVal);
        } else if (tabVal === '3') {
            onInputChange("yaml", tabVal);
        }
        setLangTabValue(tabVal);
    };
    const onMarkdownDateChanged = (date) => {
        onInputChange(date, LangTabValue);
        setMarkdownDateContent(date);
    };
    const onJsonDateChanged = (date) => {
        onInputChange(date, LangTabValue);
        setJsonDateContent(date);
    };

    useEffect(() => {
        onInputChange(markdownDateContent, LangTabValue);
    }, []);
    return (
        <Flex vertical style={{ flex: 1 }}>
            <Tabs
                defaultActiveKey={LangTabValue}
                items={[
                    {
                        label: 'Markdown',
                        key: '1',
                        children: <CodeEditor
                            value={markdownDateContent}
                            onChange={onMarkdownDateChanged}
                            extensions={markdown({
                                base: markdownLanguage,
                                codeLanguages: languages,
                            })}
                            LangTabValue='1'
                        />
                    },
                    {
                        label: 'JSON',
                        key: '2',
                        children: <CodeEditor
                            value={jsonDateContent}
                            onChange={onJsonDateChanged}
                            extensions={json({
                                base: jsonLanguage,
                                codeLanguages: languages,
                            })}
                            LangTabValue='2'
                        />
                    },
                    {
                        label: 'YAML',
                        key: '3',
                        disabled: true
                    },
                ]}
                onChange={onLangTabChange}
            />
        </Flex>
    );
}

// ============================================================================ //


export default function EditorInput({ onInputChange }) {
    const [message, setMessage] = useState("");
    const [dateContent, setDateContent] = useState("");
    const [format, setFormat] = useState("1");

    const handleMessageChange = (msg) => {
        setMessage(msg);
        onInputChange(msg, dateContent, format);
    };

    const handleDateChange = (date, fmt) => {
        setDateContent(date);
        setFormat(fmt);
        onInputChange(message, date, fmt);
    };
    const padding = 16;
    return (
        <Flex
            vertical
            gap="small"
            style={{
                height: `calc(100% - ${padding * 2}px)`,
                padding: `${padding}px`,
            }}
        >
            <EditorInputMessage onMessageChange={handleMessageChange} />
            <Divider />
            <EditorInputDate onInputChange={handleDateChange} />
        </Flex>
    );
};
