const rawdataURL = import.meta.env.VITE_REPOSITORY_URL?.replace("https://github.com", "");
const refCommit = import.meta.env.VITE_COMMIT_REF;

import { useState } from 'react';
import { GithubOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Modal } from 'antd';

import '../styles/font.css';

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
      const readmeSource = rawdataURL && refCommit ? `https://raw.githubusercontent.com${rawdataURL}/${refCommit}/README.md` : '../../README.md'
      console.log(`README Source: ${readmeSource}`);
      const response = await fetch(readmeSource);
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
        <h1
          onClick={() => window.location.reload()}
          style={{ cursor: 'pointer' }}
        >
          Re:dates
        </h1>
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
          <p>View source on <a href="https://github.com/Sea-cl0g/redates" target="_blank">GitHub</a>.</p>
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
            pre: ({ node, children, ...props }) => (
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 16,
                  borderRadius: 6,
                  overflowX: 'auto',
                  border: '1px solid #e0e0e0'
                }}
                {...props}
              >
                {children}
              </pre>
            )
          }}
        >
          {readmeContent}
        </ReactMarkdown>
      </Modal>
    </header >
  );
}