import { Flex, Typography } from 'antd';
const { Text } = Typography;

export default function Footer() {
  return (
    <footer>
      <Flex justify="space-between" align="center">
        <Text></Text>
        <Text>日本大学文理学部情報科学科 Webプログラミングの演習課題 (宍戸佑匡 5424085)</Text>
      </Flex>
    </footer>
  );
}