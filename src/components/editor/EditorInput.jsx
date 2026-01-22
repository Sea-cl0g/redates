//import { jsonLanguage } from "@codemirror/lang-json";
//import { yamlLanguage } from "@codemirror/lang-yaml";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from "@codemirror/language-data";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import { keymap } from "@codemirror/view";
import { Prec } from '@codemirror/state';
import ReactCodeMirror from "@uiw/react-codemirror";

import { useState, useMemo, useEffect } from 'react';
import { Input, Flex, Tabs, Divider } from 'antd';

// ============================================================================ //

function EditorInputMessage({ onMessageChange }) {
    const onChange = key => {
        onMessageChange(key.target.value);
    };
    return (
        <Input.TextArea rows={3} placeholder="Input Message" allowClear onChange={onChange} />
    );
};

function EditorInputDate({ onInputChange }) {
    const getNextDate = (month, day) => {
        const currentYear = new Date().getFullYear();
        const currentDate = new Date(currentYear, month - 1, day);
        currentDate.setDate(currentDate.getDate() + 1);
        return {
            month: currentDate.getMonth() + 1,
            day: currentDate.getDate()
        };
    };

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

    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const nextDate1 = getNextDate(month, date);
    const nextDate2 = getNextDate(nextDate1.month, nextDate1.day);
    const nextDate3 = getNextDate(nextDate2.month, nextDate2.day);
    const defaultVal = `# date\n- ${nextDate1.month}/${nextDate1.day} 10:00~12:00\n- ${nextDate2.month}/${nextDate2.day} *\n- ${nextDate3.month}/${nextDate3.day} *\n\n# format\nMM/dd(ddd)\n\n# *\n終日`;
    const [dateContent, setDateContent] = useState(defaultVal);
    const [tabValue, setTabValue] = useState("1");

    const onTabChange = (key) => {
        setTabValue(key);
    };

    const onDateChanged = (date) => {
        onInputChange(date, tabValue);
        setDateContent(date);
    };

    useEffect(() => {
        onInputChange(defaultVal, tabValue);
    }, []);

    const enterKeyExtension = useMemo(() => {
        return Prec.highest(keymap.of([
            {
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

                            view.dispatch({
                                changes: { from: line.to, insert: newLine },
                                selection: { anchor: line.to + newLine.length }
                            });

                            return true;
                        }
                    }
                    return false;
                }
            }
        ]));
    }, []);

    return (
        <Flex vertical style={{ flex: 1 }}>
            <Tabs
                defaultActiveKey={tabValue}
                items={[
                    {
                        label: 'Markdown',
                        key: '1'
                    },
                    {
                        label: 'JSON',
                        key: '2'
                    },
                    {
                        label: 'YAML',
                        key: '3',
                        disabled: true
                    },
                ]}
                onChange={onTabChange}
            />
            <ReactCodeMirror
                value={dateContent}
                onChange={onDateChanged}
                theme={xcodeLight}
                height="100%"
                extensions={[
                    markdown({
                        base: markdownLanguage,
                        codeLanguages: languages,
                    }),
                    enterKeyExtension,
                ]}
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
