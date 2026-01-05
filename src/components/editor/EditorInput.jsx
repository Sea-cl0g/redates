import React from 'react';
import { Input, Flex, Tabs, Divider } from 'antd';

const onChange = key => {
    console.log(key);
};

function EditorInputMessage() {
    return (
        <Input.TextArea rows={3} placeholder="Input Message" allowClear onChange={onChange} />
    );
};

function EditorInputDate() {
    return (
        <Flex vertical style={{ flex: 1 }}>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: 'Plain Text',
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
                onChange={onChange}
            />
            <Input.TextArea style={{ flex: 1, resize: 'none' }} placeholder="Input Date" allowClear onChange={onChange}/>
        </Flex>
    );
}


export default function EditorInput() {
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
            <EditorInputDate />
        </Flex>
    );
};
