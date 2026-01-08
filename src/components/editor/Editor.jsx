import React from 'react';
import { Button, Flex, Splitter, Switch, Typography } from 'antd';

import EditorInput from "./EditorInput";
import EditorOutput from './EditorOutput';
import { convertText } from './dateConvert';

export default function Editor() {
  const [sizes, setSizes] = React.useState(['50%', '50%']);
  const [enabled, setEnabled] = React.useState(true);
  const [convertedText, setConvertedText] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  const [inputLang, setInputLang] = React.useState('1');

  const onInputChange = (date, lang) => {
    setInputText(date);
    setInputLang(lang);
    const result = convertText(date, lang)
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
        <Button onClick={() => setSizes(['50%', '50%'])}>Reset</Button>
      </Flex>
    </Flex>
  );
};