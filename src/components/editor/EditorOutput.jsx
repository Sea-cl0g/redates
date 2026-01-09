import React, { useState } from 'react';
import { DownloadOutlined, CopyOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Flex, Switch, Typography, Button, ConfigProvider, Divider, Tooltip, message } from 'antd';
const { Text } = Typography;
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

// ============================================================================ //


function EditorOutputHeader({ isAiEnabled, setIsAiEnabled, onGenerate, isGenerating }) {
    const { styles } = useStyle();
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
                />
            </Flex>
            <ConfigProvider
                button={{
                    className: styles.linearGradientButton,
                }}
            >
                <Button type="primary" disabled={!isAiEnabled} icon={<AntDesignOutlined />} loading={isGenerating} onClick={onGenerate} >
                    Generate
                </Button>
            </ConfigProvider>
        </Flex >
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

function EditorOutputFooter({ convertedText }) {
    const [copyTooltip, setCopyTooltip] = useState("Copy");
    const onCopyClicked = () => {
        navigator.clipboard.writeText(convertedText)
            .then(() => {
                setCopyTooltip("Copied!");
                setTimeout(() => setCopyTooltip("Copy"), 2000);
            })
            .catch(() => {
                console.log("Failed to copy", convertedText);
                setCopyTooltip("Failed to copy");
                setTimeout(() => setCopyTooltip("Copy"), 2000);
            });
    };

    return (
        <Flex justify="flex-end" gap="small">
            <Tooltip title={copyTooltip}>
                <Button
                    shape="circle"
                    icon={<CopyOutlined />}
                    size="large"
                    type="dashed"
                    onClick={onCopyClicked}
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

// ============================================================================ //


export default function EditorOutput({ convertedText, inputMessage, inputText, inputLang }) {
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiText, setAiText] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const padding = 16;

    const showErrorMessage = (e) => {
        messageApi.open({
            type: 'error',
            content: e.message || 'An error occurred',
        });
    };

    const handleGenerate = async () => {
        if (!inputText) return;

        setIsGenerating(true);
        setAiText('');
        try {
            const { checkRewriterAPI } = await import('./aiSupport');
            const { convertTextWithAI } = await import('./dateConvert');

            await checkRewriterAPI();
            await convertTextWithAI(
                inputMessage,
                inputText,
                inputLang,
                (currentText) => setAiText(currentText)
            );
        } catch (error) {
            console.error(error);
            showErrorMessage(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const displayText = isAiEnabled && aiText ? aiText : convertedText;
    return (
        <>
            {contextHolder}
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
                    />
                    <EditorOutputMain convertedText={displayText} />
                </Flex>
                <EditorOutputFooter convertedText={displayText} />
            </Flex>
        </>
    );
};
