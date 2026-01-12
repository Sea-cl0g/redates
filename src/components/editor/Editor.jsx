import { useState } from 'react';
import { Button, Flex, Splitter, Typography } from 'antd';
const { Text } = Typography;

import EditorInput from "./EditorInput";
import EditorOutput from './EditorOutput';
import { convertText } from './dateConvert';

export default function Editor() {
  const [sizes, setSizes] = useState(['50%', '50%']);
  const [convertedText, setConvertedText] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputLang, setInputLang] = useState('1');

  const onInputChange = (message, date, lang) => {
    setInputMessage(message);
    setInputText(date);
    setInputLang(lang);
    const result = convertText(message, date, lang)
    setConvertedText(result);
  };

  return (
    <Flex vertical gap="middle" style={{ flex: 1 }}>
      <Splitter
        onResize={setSizes}
        style={{ flex: 1, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      >
        <Splitter.Panel size={sizes[0]}>
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
        <Text></Text>
        <Text type="secondary">左上にショートメッセージ、その下に日程を記述するとそれっぽいメッセージに変換されます。</Text>
        <Button onClick={() => setSizes(['50%', '50%'])}>Reset</Button>
      </Flex>
    </Flex>
  );
};