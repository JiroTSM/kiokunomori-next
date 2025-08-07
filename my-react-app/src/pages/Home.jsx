import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';

function Home() {
  const { name } = useContext(UserContext);

  return <p>{name}さん、こんにちは！</p>;
}


export default Home;
