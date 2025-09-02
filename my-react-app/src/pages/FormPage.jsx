import { useState } from "react";
import { useUser } from "../contexts/UserProvider";

function FormPage() {
  const { state, dispatch } = useUser();

  const [name, setName] = useState("");
  const [sotobaList, setSotobaList] = useState(
    Array.from({ length: 10 }, () => ({
      targetName: "",
      sponsorName: "",
      furigana: ""
    }))
  );

  const handleSotobaChange = (index, field, value) => {
    const newList = [...sotobaList];
    newList[index][field] = value;
    setSotobaList(newList);
  };

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("名前を入力してください");
      return;
    }

    // バリデーションチェック（卒塔婆）
    for (let i = 0; i < sotobaList.length; i++) {
      const entry = sotobaList[i];
      const hasAny = entry.targetName || entry.sponsorName || entry.furigana;
      const isComplete = entry.targetName && entry.sponsorName && entry.furigana;

      if (hasAny && !isComplete) {
        alert(`${i + 1}人目の卒塔婆情報が不完全です`);
        return;
      }
    }

    // 完成した卒塔婆のみ抽出
    const validSotoba = sotobaList.filter(
      (entry) => entry.targetName && entry.sponsorName && entry.furigana
    );

    // 同一名チェック（履歴内にすでにあるか）
    const isDuplicate = state.history.some((item) =>
    item.name === name);

    // 履歴に登録するデータ
    const formEntry = {
      name,
      time: new Date().toLocaleString(),
      sotoba: validSotoba,
      duplicate: isDuplicate //　←フラグを追加
    };

    // 履歴に追加
    dispatch({ type: "ADD_HISTORY", payload: formEntry });
    alert(`送信されました：${name}`);

    setName("");
    setSotobaList(
      Array.from({ length: 10 }, () => ({
        targetName: "",
        sponsorName: "",
        furigana: ""
      }))
    );
  };

  return (
    <div>
      <h2>名前フォーム（必須）</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="お名前を入力してください"
      />

      <h3>卒塔婆申込み（最大10名分・任意）</h3>
      {sotobaList.map((entry, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <p>{index + 1}人目</p>
          <input
            type="text"
            placeholder="卒塔婆対象者名"
            value={entry.targetName}
            onChange={(e) => handleSotobaChange(index, "targetName", e.target.value)}
          />
          <input
            type="text"
            placeholder="施主名"
            value={entry.sponsorName}
            onChange={(e) => handleSotobaChange(index, "sponsorName", e.target.value)}
          />
          <input
            type="text"
            placeholder="ふりがな"
            value={entry.furigana}
            onChange={(e) => handleSotobaChange(index, "furigana", e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>送信</button>

      <h3>通信履歴</h3>
      <ul>
        {state.history.map((item, index) => (
          <li key={index}>
            {item.name}（{item.time}）{item.duplicate && (
        <span style={{ color: "red", marginLeft: "0.5rem" }}>（同一名あり）</span>
      )}
            {item.sotoba && item.sotoba.length > 0 && (
              <ul>
                {item.sotoba.map((s, i) => (
                  <li key={i}>
                    対象：{s.targetName} / 施主：{s.sponsorName} / ふりがな：{s.furigana}
                  </li>
                ))}
              </ul>
            )}
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