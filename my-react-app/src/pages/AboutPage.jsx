import { useContext } from 'react';
import { useUser } from "../contexts/UserProvider";

function AboutPage() {
  const { state } = useUser();
  const name = state.user.name;

  return <p>このページは{name}さんに関する情報です。</p>;
}

export default AboutPage;
