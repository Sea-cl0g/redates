import React, { useState } from 'react';
import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons';
import { Flex, Switch, Typography, Button, Divider } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

function EditorOutputHeader() {
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const changeIsAiEnabled = value => {
        setIsAiEnabled(value);
    };


    const [loadings, setLoadings] = useState([]);
    const enterLoading = index => {
        console.log('Start loading:', index);
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 3000);
    };

    return (
        <Flex justify="space-between" align="center">
            <Flex justify="flex-start" align="center" gap="small">
                <Text strong>AI Mode</Text>
                <Divider orientation="vertical" />
                <Switch
                    checked={isAiEnabled}
                    onChange={changeIsAiEnabled}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                />
            </Flex>
            <Button type="primary" disabled={!isAiEnabled} loading={loadings[0]} onClick={() => enterLoading(0)}>
                Generate
            </Button>
        </Flex>
    );
}

function EditorOutputMain() {
    const outputStyle = {
        flex: 1,
        height: `100%`,
        borderRadius: 6,
        border: '1px solid #d9d9d9',
    }

    return (
        <Flex
            style={outputStyle}
        >
            <Flex style={{ padding: 6 }}>
                <Typography.Paragraph>
                    この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字
                </Typography.Paragraph>
            </Flex>
        </Flex>
    );
}

function EditorOutputFooter() {
    return (
        <Flex>
            <p>test</p>
        </Flex>
    );
}

export default function EditorOutput() {
    const padding = 16;
    return (
        <Flex
            vertical
            justify="space-between"
            style={{
                height: `calc(100% - ${padding * 2}px)`,
                padding: `${padding}px`,
            }}
        >
            <Flex
                vertical
                justify="flex-start"
                style={{ flex: 1 }}
                gap="small"
            >
                <EditorOutputHeader />
                <EditorOutputMain />
            </Flex>
            <EditorOutputFooter />
        </Flex>
    );
};
