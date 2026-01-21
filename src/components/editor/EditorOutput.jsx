import { useState, useEffect } from 'react';
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
    return array.map(val => ({ label: val, value: val }));
}
const allLanguages = ['en', 'ja', 'es'];
const normalizeLang = lang => lang.split('-')[0];
const browserLanguages = navigator.languages.map(normalizeLang);
const primaryLanguage = normalizeLang(navigator.language);

const allLanguagesMap = array2selecterMapArray(allLanguages);
const defaultLanguages = Array.from(new Set(browserLanguages.filter(element => allLanguages.includes(element))));
const defaultOutputLanguage = allLanguages.includes(primaryLanguage) ? primaryLanguage : 'en';

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
    const [tone, setTone] = useState('');
    const [format, setFormat] = useState('');
    const [length, setLength] = useState('');
    const [expectedInputLanguages, setExpectedInputLanguages] = useState([]);
    const [expectedContextLanguages, setExpectedContextLanguages] = useState([]);
    const [outputLanguage, setOutputLanguage] = useState('');
    const [sharedContext, setSharedContext] = useState('');

    // Modal
    const showModal = async () => {
        const { getOptions } = await import('./aiSupport');
        const currentOptions = getOptions();
        setTone(currentOptions.tone);
        setFormat(currentOptions.format);
        setLength(currentOptions.length);
        setExpectedInputLanguages(currentOptions.expectedInputLanguages);
        setExpectedContextLanguages(currentOptions.expectedContextLanguages);
        setOutputLanguage(currentOptions.outputLanguage);
        setSharedContext(currentOptions.sharedContext);
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        import('./aiSupport').then(({ updateOptions }) => {
            updateOptions({
                tone,
                format,
                length,
                expectedInputLanguages,
                expectedContextLanguages,
                outputLanguage,
                sharedContext
            });
        });
        setIsModalOpen(false);
    };
    // Prompt
    // Tone
    const onToneChanged = ({ target: { value } }) => {
        setTone(value);
    };
    // Format
    const onFormatChanged = ({ target: { value } }) => {
        setFormat(value);
    };
    // Length
    const onLengthChanged = ({ target: { value } }) => {
        setLength(value);
    };
    // AI Languages
    const onExpectedInputLanguagesChanged = value => {
        setExpectedInputLanguages(value);
    };
    const onExpectedContextLanguages = value => {
        setExpectedContextLanguages(value);
    };
    const onOutputLanguage = value => {
        setOutputLanguage(value);
    };

    useEffect(() => {
        const loadOptions = async () => {
            const { updateOptions } = await import('./aiSupport');
            updateOptions({
                expectedInputLanguages: defaultLanguages,
                expectedContextLanguages: defaultLanguages,
                outputLanguage: defaultOutputLanguage
            });
        };
        loadOptions();
        const aaa = async () => {
            const { getOptions } = await import('./aiSupport');
            const s = getOptions();
            console.log(s);
        };
        aaa();
    }, []);

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
                onCancel={handleCancel}
                footer={
                    <p>See the <a href="https://developer.chrome.com/docs/ai/rewriter-api">Rewriter API Doc</a> for prompt details.</p>
                }
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
                        <Text>expectedInputLanguages</Text>
                        <Divider vertical />
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '50%' }}
                            placeholder="input search language"
                            defaultValue={expectedInputLanguages}
                            onChange={onExpectedInputLanguagesChanged}
                            options={allLanguagesMap}
                        />
                    </Flex>
                    <Flex justify="space-between" align="center" >
                        <Text>expectedContextLanguages</Text>
                        <Divider vertical />
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '50%' }}
                            placeholder="input search language"
                            defaultValue={expectedContextLanguages}
                            onChange={onExpectedContextLanguages}
                            options={allLanguagesMap}
                        />
                    </Flex>
                    <Flex justify="space-between" align="center" >
                        <Text>outputLanguage</Text>
                        <Divider vertical />
                        <Select
                            style={{ width: '50%' }}
                            placeholder="input search language"
                            defaultValue={outputLanguage}
                            showSearch
                            onChange={onOutputLanguage}
                            options={allLanguagesMap}
                        />
                    </Flex>
                </Flex>
                <Divider titlePlacement="start">sharedContext</Divider>
                <Flex vertical style={{ padding: `0 5% 0 5%` }}>
                    <TextArea
                        value={sharedContext}
                        onChange={e => setSharedContext(e.target.value)}
                        placeholder="Inout text"
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
