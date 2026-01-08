import React, { useState } from 'react';
import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons';
import { Flex, Switch, Typography, Button, Divider } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

function EditorOutputHeader({ onGenerate, isGenerating }) {
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
            <Button type="primary" disabled={!isAiEnabled} loading={isGenerating} onClick={onGenerate} >
                Generate
            </Button>
        </Flex>
    );
}

function EditorOutputMain({ convertedText }) {
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
                <Typography.Paragraph style={{ whiteSpace: "pre-line" }}>
                    {convertedText}
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

export default function EditorOutput({ convertedText, inputText, inputLang }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiText, setAiText] = useState('');
    const padding = 16;
    const handleGenerate = async () => {
        if (!inputText) return;

        setIsGenerating(true);
        setAiText('');

        const { convertTextWithAI } = await import('./dateConvert');
        setIsGenerating(false);
    };

    const displayText = isAiEnabled && aiText ? aiText : convertedText;
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
                <EditorOutputHeader
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                />
                <EditorOutputMain convertedText={displayText} />
            </Flex>
            <EditorOutputFooter />
        </Flex>
    );
};
