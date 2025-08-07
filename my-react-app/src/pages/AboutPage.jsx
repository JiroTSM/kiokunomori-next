import { useContext } from 'react';
import { UserContext } from '../contexts/UserProvider';

function AboutPage() {
  const { name } = useContext(UserContext);

  return <p>このページは{name}さんに関する情報です。</p>;
}

export default AboutPage;
