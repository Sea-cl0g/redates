import React from 'react';
import { Button, Flex, Splitter, Switch, Typography } from 'antd';
const { Text } = Typography;

import EditorInput from "./EditorInput";
import EditorOutput from './EditorOutput';
import { convertText } from './dateConvert';

export default function Editor() {
  const [sizes, setSizes] = React.useState(['50%', '50%']);
  const [enabled, setEnabled] = React.useState(true);
  const [convertedText, setConvertedText] = React.useState('');
  const [inputMessage, setInputMessage] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  const [inputLang, setInputLang] = React.useState('1');

  const onInputChange = (message, date, lang) => {
    setInputMessage(message);
    setInputText(date);
    setInputLang(lang);
    const result = convertText(message, date, lang)
    setConvertedText(result);
  };

  return (
    <Flex vertical gap="middle">
      <Splitter
        onResize={setSizes}
        style={{ height: 500, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      >
        <Splitter.Panel size={sizes[0]} resizable={enabled}>
          <EditorInput onInputChange={onInputChange} />
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]}>
          <EditorOutput
            convertedText={convertedText}
            inputMessage={inputMessage}
            inputText={inputText}
            inputLang={inputLang}
          />
        </Splitter.Panel>
      </Splitter>
      <Flex gap="middle" justify="space-between">
        <Switch
          value={enabled}
          onChange={() => setEnabled(!enabled)}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
        <Text type="secondary">左上にショートメッセージ、その下に日程を記述するとそれっぽいメッセージに変換されます。</Text>
        <Button onClick={() => setSizes(['50%', '50%'])}>Reset</Button>
      </Flex>
    </Flex>
  );
};