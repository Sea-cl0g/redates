import { jsonLanguage } from "@codemirror/lang-json";
import { yamlLanguage } from "@codemirror/lang-yaml";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from "@codemirror/language-data";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";

import React, { useState } from 'react';
import { Input, Flex, Tabs, Divider } from 'antd';

function EditorInputMessage({ onMessageChange }) {
    const onChange = key => {
        onMessageChange(key.target.value);
    };
    return (
        <Input.TextArea rows={3} placeholder="Input Message" allowClear onChange={onChange} />
    );
};

function EditorInputDate({ onInputChange }) {
    const [dateContent, setDateContent] = useState("");
    const [tabValue, setTabValue] = useState("1");

    const onTabChange = (key) => {
        setTabValue(key);
    };

    const onDateChanged = (date) => {
        onInputChange(date, tabValue);
        setDateContent(date);
    };

    return (
        <Flex vertical style={{ flex: 1 }}>
            <Tabs
                defaultActiveKey={tabValue}
                items={[
                    {
                        label: 'Markdown',
                        key: '1',
                    },
                    {
                        label: 'Json',
                        key: '2',
                        disabled: true
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
                height="240px"
                extensions={[
                    markdown({
                        base: markdownLanguage,
                        codeLanguages: languages,
                    }),
                ]}
            />
        </Flex>
    );
}


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
