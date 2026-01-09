import React, { useState, useEffect } from 'react';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import { Flex, Switch, Typography, Button, Divider, Tooltip } from 'antd';
const { Text } = Typography;

function EditorOutputHeader({ isAiEnabled, setIsAiEnabled, onGenerate, isGenerating, apiStatus }) {
    console.log(apiStatus, apiStatus.available)
    return (
        <Flex justify="space-between" align="center">
            <Flex justify="flex-start" align="center" gap="small">
                <Text strong>AI Mode</Text>
                <Divider orientation="vertical" />
                <Switch
                    checked={isAiEnabled}
                    onChange={setIsAiEnabled}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    disabled={!apiStatus.available}
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
        overflow: 'auto',
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
        <Flex justify="flex-end" gap="small">
            <Tooltip title="Copy">
                <Button
                    shape="circle"
                    icon={<CopyOutlined />}
                    size="large"
                    type="dashed"
                    disabled="true"
                />
            </Tooltip>
            <Tooltip title="Download">
                <Button
                    shape="circle"
                    icon={<DownloadOutlined />}
                    size="large"
                    type="primary"
                    disabled="true"
                />
            </Tooltip>
        </Flex>
    );
}

export default function EditorOutput({ convertedText, inputMessage, inputText, inputLang }) {
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiText, setAiText] = useState('');
    const [apiStatus, setApiStatus] = useState({available:false});
    const padding = 16;
    useEffect(() => {
        const checkAPI = async () => {
            const { isRewriterAvailable } = await import('./aiSupport');
            const status = await isRewriterAvailable();
            setApiStatus(status);
            console.log(status);
        };
        checkAPI();
    }, []);

    const handleGenerate = async () => {
        if (!inputText) return;

        setIsGenerating(true);
        setAiText('');
        try {
            const { convertTextWithAI } = await import('./dateConvert');

            await convertTextWithAI(
                inputMessage,
                inputText,
                inputLang,
                (currentText) => setAiText(currentText)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
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
            gap="small"
        >
            <Flex
                vertical
                justify="flex-start"
                style={{ flex: 1, minHeight: 0 }}
                gap="small"
            >
                <EditorOutputHeader
                    isAiEnabled={isAiEnabled}
                    setIsAiEnabled={setIsAiEnabled}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    apiStatus={apiStatus}
                />
                <EditorOutputMain convertedText={displayText} />
            </Flex>
            <EditorOutputFooter />
        </Flex>
    );
};
