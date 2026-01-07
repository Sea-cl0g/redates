import { jsonLanguage } from "@codemirror/lang-json";
import { yamlLanguage } from "@codemirror/lang-yaml";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from "@codemirror/language-data";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";

import React, { useState } from 'react';
import { Input, Flex, Tabs, Divider } from 'antd';

function EditorInputMessage() {
    const onChange = key => {
        console.log(key);
    };

    return (
        <Input.TextArea rows={3} placeholder="Input Message" allowClear onChange={onChange} />
    );
};

function EditorInputDate({ onInputChange }) {
    const [value, setValue] = useState("");

    const onTabChange = (key) => {
        console.log(key);
    };

    const onCodeChange = (val) => {
        setValue(val);
        onInputChange(val)
    };

    return (
        <Flex vertical style={{ flex: 1 }}>
            <Tabs
                defaultActiveKey="1"
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
                value={value}
                onChange={onCodeChange}
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
            <EditorInputMessage />
            <Divider />
            <EditorInputDate onInputChange={onInputChange} />
        </Flex>
    );
};
