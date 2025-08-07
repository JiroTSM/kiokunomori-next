// src/components/AppLayout.jsx
import { Outlet, Link } from 'react-router-dom';

function AppLayout() {
  return (
    <div>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">ホーム</Link> |{" "}
        <Link to="/about">アバウト</Link> |{" "}
        <Link to="/users/1">ユーザー1</Link>
      </nav>

      <hr />

      <Outlet /> {/* 各ページの中身がここに表示される */}
    </div>
  );
}

export default AppLayout;
