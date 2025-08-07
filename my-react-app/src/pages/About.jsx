import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function About() {
  const { name } = useContext(UserContext);

  return <p>このページは{name}さんに関する情報です。</p>;
}

export default About;
