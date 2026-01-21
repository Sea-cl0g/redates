export const commit = import.meta.env.COMMIT_REF;
console.log(commit);
import { Flex, Typography } from 'antd';
const { Text } = Typography;

export default function Footer() {
  return (
    <footer>
      <Flex justify="space-between" align="center">
        <Text>{commit || 'empty'}</Text>
        <Text>日本大学文理学部情報科学科 Webプログラミングの演習課題 (宍戸佑匡 5424085)</Text>
      </Flex>
    </footer>
  );
}