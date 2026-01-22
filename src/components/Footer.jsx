const repositoryURL = import.meta.env.VITE_REPOSITORY_URL;
const refCommit = import.meta.env.VITE_COMMIT_REF;
const deployedAt = import.meta.env.VITE_DEPLOYED_AT;
const authorInfo = import.meta.env.VITE_AUTHOR_INFO;

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
        <Text>{repositoryURL && refCommit && deployedAt ? <p>Last deployed on {deployedAt} for commit <a href={refCommitURL} target="_blank">{refCommit.slice(0, 8)}</a>.</p> : "Build information is unavailable."}</Text>
        <Text>{authorInfo || ""}</Text>
      </Flex>
    </footer>
  );
}