import React, { useState } from 'react';
import { DownloadOutlined, CopyOutlined, AntDesignOutlined, ToolOutlined } from '@ant-design/icons';
import { Flex, Switch, Typography, Button, ConfigProvider, Divider, Tooltip, message, Modal, Radio, Input, Space } from 'antd';
const { Text } = Typography;
const { TextArea } = Input;

import { createStyles } from 'antd-style';
const tone = ['more-formal', 'as-is', 'more-casual'];
const format = ['as-is', 'markdown', 'plain-text'];
const length = ['shorter', 'as-is', 'longer '];

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState('');
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [value4, setValue4] = useState('as-is');
    const onChange4 = ({ target: { value } }) => {
        console.log('radio4 checked', value);
        setValue4(value);
    };
    return (
        <Flex justify="space-between" align="center">
            <Flex justify="flex-start" align="center" gap="small">
                <Text strong>Rewriter AI</Text>
                <Divider orientation="vertical" />
                <Switch
                    checked={isAiEnabled}
                    onChange={setIsAiEnabled}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                />
            </Flex>
            <Flex justify="flex-end" align="center" gap="small">
                <ConfigProvider
                    button={{
                        className: styles.linearGradientButton,
                    }}
                >
                    <Button
                        type="primary"
                        icon={<AntDesignOutlined />}
                        loading={isGenerating}
                        onClick={onGenerate}
                        disabled={!isAiEnabled}
                    >
                        Generate
                    </Button>
                </ConfigProvider>
                <Tooltip title="Edit Prompt">
                    <Button
                        type="dashed"
                        icon={<ToolOutlined />}
                        size="middle"
                        onClick={showModal}
                        disabled="false"
                    />
                </Tooltip>
            </Flex>
            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Flex
                    vertical
                    justify="space-between"
                    gap="small"
                >
                    <Divider titlePlacement="start">Options</Divider>
                    <Flex justify="space-around" align="center">
                        <Flex justify="flex-start" align="center" gap="small">
                            <Text>Tone</Text>
                            <Divider vertical />
                        </Flex>
                        <Radio.Group
                            options={tone}
                            onChange={onChange4}
                            value={value4}
                            optionType="button"
                            buttonStyle="solid"
                            size="middle"
                        />
                    </Flex>
                    <Flex justify="space-around" align="center">
                        <Flex justify="flex-start" align="center" gap="small">
                            <Text>Tone</Text>
                            <Divider vertical />
                        </Flex>
                        <Radio.Group
                            options={tone}
                            onChange={onChange4}
                            value={value4}
                            optionType="button"
                            buttonStyle="solid"
                            size="middle"
                        />
                    </Flex>
                    <Flex justify="space-around" align="center">
                        <Flex justify="flex-start" align="center" gap="small">
                            <Text>Tone</Text>
                            <Divider vertical />
                        </Flex>
                        <Radio.Group
                            options={tone}
                            onChange={onChange4}
                            value={value4}
                            optionType="button"
                            buttonStyle="solid"
                            size="middle"
                        />
                    </Flex>
                    <Divider titlePlacement="start">sharedContext</Divider>
                    <TextArea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Controlled autosize"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Flex>
            </Modal>
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
