import { Flex, Typography } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

export default function Footer() {
  return (
    <footer>
      <Flex justify="space-between" align="center">
        <Text>test</Text>
        <Text>日本大学文理学部情報科学科 Webプログラミングの演習課題 (宍戸佑匡 5424085)</Text>
      </Flex>
    </footer>
  );
}