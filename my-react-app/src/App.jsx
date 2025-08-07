import { useContext, useState, useEffect } from "react";
import { UserContext } from "./contexts/UserProvider";
import { Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage"; // 今のフォーム部分をこのページに分離
import AboutPage from "./pages/AboutPage"; // 追加例
import { Link } from "react-router-dom"; // 画面遷移リンクの追加

function App() {
  const { user } = useContext(UserContext);

  return(
    <div>
      <h1>React ルーティングアプリ</h1>

      {/* ナビゲーションリンク */}
      <nav>
        <Link to="/">フォーム</Link> | <Link to="/about">このアプリについて</Link>
      </nav>

      {/* ルーティング設定 */}
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}


export default App;