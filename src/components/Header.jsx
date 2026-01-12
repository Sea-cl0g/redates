import { useState } from 'react';
import { GithubOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Typography, Tooltip, Modal } from 'antd';
const { Title, Text, link } = Typography;

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');
  const [loading, setLoading] = useState(true);
  const showModal = async () => {
    setLoading(true);
    setIsModalOpen(true);
    try {
      const response = await fetch('../../README.md');
      const text = await response.text();
      setReadmeContent(text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header>
      <Flex justify="space-between" align="center">
        <Title>Re:dates</Title>
        <Flex gap="small" wrap>
          <Tooltip title="About">
            <Button
              shape="circle"
              icon={<QuestionCircleOutlined />}
              size="large"
              onClick={showModal}
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
      <Modal
        title="About Re:dates"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        loading={loading}
        footer={
          <p>View source on <a href="https://github.com/Sea-cl0g/redates">GitHub</a></p>
        }
        width={800}
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                src={props.src || ''}
                alt={props.alt || ''}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ),
          }}
        >
          {readmeContent}
        </ReactMarkdown>
      </Modal>
    </header >
  );
}