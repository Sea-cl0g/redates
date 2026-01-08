import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export default function Header() {
  return (
    <header>
      <Typography>
        <Title>Re:dates</Title>
      </Typography>
    </header>
  );
}