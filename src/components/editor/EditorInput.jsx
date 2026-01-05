import React from 'react';
import { Input, Flex } from 'antd';


export default function App() {
    const padding = 16;
    return (
        <Flex vertical gap="middle" style={{ height: 'calc(100% - ${padding * 2}px)', padding: '${padding}px' }}>
            <Input placeholder="ご連絡ありがとうございます。それでは下記日程でお願いします。" />
            <Input.TextArea
                style={{ flex: 1, resize: 'none' }}
            />
        </Flex>
    );
};
