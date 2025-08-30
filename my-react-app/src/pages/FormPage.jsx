import { useState } from "react";
import { useUser } from "../contexts/UserProvider";

function FormPage() {
  const { state, dispatch } = useUser();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("名前を入力してください");
      return;
    }

    const isDuplicate = state.history.some((item) => item.name === name);
    if (isDuplicate) {
      alert("この名前はすでに履歴にあります");
      return;
    }

    const entry = {
      name,
      time: new Date().toLocaleString()
    };

    dispatch({ type: "ADD_HISTORY", payload: entry });
    alert(`送信された名前 : ${name}`);
    setName("");
  };

  return (
    <div>
      <h2>名前フォーム</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="お名前を入力してください"
      />
      <button onClick={handleSubmit}>送信</button>

      <h3>通信履歴</h3>
      <ul>
        {state.history.map((item, index) => (
          <li key={index}>
            {item.name}（{item.time}）
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: "CLEAR_HISTORY" })}>
        履歴をすべて削除
      </button>
    </div>
  );
}

export default FormPage;
