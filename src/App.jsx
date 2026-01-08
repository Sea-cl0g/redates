import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

import { Flex } from 'antd';

export default function App() {
  return (
    <Flex
      vertical
      justify="space-between"
      align="stretch"
      style={{ height: '100vh' }}
    >
      <Header />
      <Main style={{ flex: 1 }} />
      <Footer />
    </Flex>
  );
}