import { useContext, useState, useEffect } from "react";
import { UserContext } from "./contexts/UserProvider";
import { Routes, Route, Form } from "react-router-dom";
import FormPage from "./pages/FormPage"; // 今のフォーム部分をこのページに分離
import AboutPage from "./pages/AboutPage"; // 追加例
import { Link } from "react-router-dom"; // 画面遷移リンクの追加
import HomePage from "./pages/HomePage"; //
import UserDetailPage from "./pages/UserDetailPage" ; //
import NotFoundPage from "./pages/NotFoundPage";

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
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} /> 
        <Route path="/about" element={<AboutPage />} />
        <Route path="/user/:id" element={<UserDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}


export default App;