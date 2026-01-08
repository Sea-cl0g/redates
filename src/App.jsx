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
      style={{ height: '95vh', overflow: 'hidden' }}
    >
      <Header />
      <Main />
      <Footer />
    </Flex>
  );
}