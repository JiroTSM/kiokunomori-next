import { useContext, useState, useEffect } from "react";
import { UserContext } from "./contexts/UserProvider";

function App() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
  const saved = localStorage.getItem("history");
  if (saved) {
    setHistory(JSON.parse(saved)); // ← 文字列を配列に戻す
  }
  },[]); // ← 初回のみ実行

    useEffect(() => {
  // 履歴が保存されるたびに保存
  localStorage.setItem("history", JSON.stringify(history));
  }, 
  [history]);

  const handleSubmit = () => {
    if (name.trim() === ""){
    alert("名前を入力してください");
    return;
    }

    if (history.some(item => item.name === name)) {
      alert("この名前はすでに履歴にあります");
      return;
    }

    const entry = {
      name,
      time: new Date().toLocaleString(),
    }

  alert(`送信された名前 : ${name}`);

  setHistory([...history, entry]); // ← 履歴に追加!
  setName("") //入力をクリア
  }

  return (
    <div>
      <h1>名前フォーム</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="お名前を入力してください"
      />
      <button onClick={handleSubmit}>送信</button>
      <p>入力中の名前：{name}</p>
      <h2>通信履歴</h2>
      <ul>
        {history.map((item, index) =>
        <li key={index}>{item.name}({item.time})</li>)}
      </ul>
      <button onClick={() => setHistory([])}>履歴をすべて削除</button>
    </div>
  );
}

export default App;