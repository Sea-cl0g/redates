import React from 'react';
import { GithubOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Typography, Tooltip } from 'antd';
const { Title } = Typography;

export default function Header() {
  return (
    <header>
      <Flex justify="space-between" align="center">
        <Title>Re:dates</Title>
        <Flex gap="small" wrap>
          <Tooltip title="Question">
            <Button
              shape="circle"
              icon={<QuestionCircleOutlined />}
              size="large"
              href="https://github.com/Sea-cl0g/redates/tree/main"
              target="_blank"
            />
          </Tooltip>
          <Tooltip title="GitHub">
            <Button
              shape="circle"
              icon={<GithubOutlined />}
              size="large"
              href="https://github.com/Sea-cl0g/redates/tree/main"
              target="_blank"
            />
          </Tooltip>
        </Flex>
      </Flex>
    </header >
  );
}