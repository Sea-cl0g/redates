const repositoryURL = import.meta.env.VITE_REPOSITORY_URL;
const refCommit = import.meta.env.VITE_COMMIT_REF;
const deployedAt = import.meta.env.VITE_DEPLOYED_AT;

console.log(repositoryURL);
console.log(refCommit);
console.log(deployedAt);

const refCommitURL = `${repositoryURL}/commit/${refCommit}`;

import { Flex, Typography } from 'antd';
const { Text } = Typography;

export default function Footer() {
  return (
    <footer>
      <Flex justify="space-between" align="center">
        <Text>{repositoryURL && refCommit && deployedAt ? <p>Last deployed on {deployedAt} for commit <a href={refCommitURL}>{refCommit}</a>.</p> : "Build information is unavailable."}</Text>
        <Text>日本大学文理学部情報科学科 Webプログラミングの演習課題 (宍戸佑匡 5424085)</Text>
      </Flex>
    </footer>
  );
}