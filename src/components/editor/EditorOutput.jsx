import { useState } from 'react';
import { DownloadOutlined, CopyOutlined, AntDesignOutlined, ToolOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { Flex, Switch, Typography, Button, ConfigProvider, Divider, Tooltip, message, Modal, Radio, Input, Select } from 'antd';
import ISO6391 from 'iso-639-1';
const { Text } = Typography;
const { TextArea } = Input;

const toneList = ['more-formal', 'as-is', 'more-casual'];
const formatList = ['markdown', 'as-is', 'plain-text'];
const lengthList = ['shorter', 'as-is', 'longer'];

function array2selecterMapArray(array) {
    const mapArray = [];
    for (const val of array) {
        mapArray.push({ label: val, value: val });
    }
    return mapArray;
}
const allLanguages = array2selecterMapArray(ISO6391.getAllCodes());

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
    // Modal
    const showModal = async () => {
        const { getOptions } = await import('./aiSupport');
        const currentOptions = getOptions();
        setTone(currentOptions.tone);
        setFormat(currentOptions.format);
        setLength(currentOptions.length);
        setValue(currentOptions.sharedContext);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        import('./aiSupport').then(({ updateOptions }) => {
            updateOptions({
                tone,
                format,
                length,
                sharedContext: value
            });
        });
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // Prompt
    // Tone
    const [tone, setTone] = useState('more-formal');
    const onToneChanged = ({ target: { value } }) => {
        setTone(value);
    };
    // Format
    const [format, setFormat] = useState('as-is');
    const onFormatChanged = ({ target: { value } }) => {
        setFormat(value);
    };
    // Length
    const [length, setLength] = useState('as-is');
    const onLengthChanged = ({ target: { value } }) => {
        setLength(value);
    };
    const handleChange = value => {
        console.log(`selected ${value}`);
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
                        disabled={!isAiEnabled}
                    />
                </Tooltip>
            </Flex>
            <Modal
                title="Prompt Settings"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Divider titlePlacement="start">Options</Divider>
                <Flex vertical gap="small" style={{ padding: `0 5% 0 5%` }}>
                    <Flex justify="space-between" align="center" >
                        <Text>Tone</Text>
                        <Divider vertical />
                        <Radio.Group
                            options={toneList}
                            onChange={onToneChanged}
                            value={tone}
                            optionType="button"
                            buttonStyle="solid"
                            size="middle"
                        />
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text>Format</Text>
                        <Divider vertical />
                        <Radio.Group
                            options={formatList}
                            onChange={onFormatChanged}
                            value={format}
                            optionType="button"
                            buttonStyle="solid"
                            size="middle"
                        />
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text>Length</Text>
                        <Divider vertical />
                        <Radio.Group
                            options={lengthList}
                            onChange={onLengthChanged}
                            value={length}
                            optionType="button"
                            buttonStyle="solid"
                            size="middle"
                        />
                    </Flex>
                </Flex>
                <Divider titlePlacement="start">Languages</Divider>
                <Flex vertical gap="small" style={{ padding: `0 5% 0 5%` }}>
                    <Flex justify="space-between" align="center" >
                        <Text>Tone</Text>
                        <Divider vertical />
                        <Select
                            mode="tags"
                            style={{ width: '50%' }}
                            placeholder="Tags Mode"
                            onChange={handleChange}
                            options={allLanguages}
                        />
                    </Flex>
                </Flex>
                <Divider titlePlacement="start">sharedContext</Divider>
                <Flex vertical style={{ padding: `0 5% 0 5%` }}>
                    <TextArea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="In Japanese."
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
    const [Downloadtip, setDownloadTooltip] = useState("Download");
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
    const onDownloadClicked = () => {
        var blob = new Blob([convertedText], { type: "text/plain" });
        var urlAPI = window.URL || window.webkitURL;
        var downloadUrl = urlAPI.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "schedule.txt";

        try {
            a.click();
            setDownloadTooltip("Downloaded!");
            setTimeout(() => setDownloadTooltip("Download"), 2000);
        } catch (error) {
            console.log("Failed to download", convertedText);
            setDownloadTooltip("Failed to download");
            setTimeout(() => setDownloadTooltip("Download"), 2000);
        }
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
            <Tooltip title={Downloadtip}>
                <Button
                    shape="circle"
                    icon={<DownloadOutlined />}
                    size="large"
                    type="default"
                    onClick={onDownloadClicked}
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
