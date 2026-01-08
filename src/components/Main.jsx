import { Flex } from 'antd';
import Editor from "./editor/Editor";

export default function Main() {
  return (
    <Flex
      component="main"
      style={{ flex: 1, padding: '16px', overflow: 'auto' }}
    >
      <Editor />
    </Flex>
  );
}