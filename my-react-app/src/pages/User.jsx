import { useParams } from "react-router-dom";

function User() {
  const { id } = useParams(); // URLからidを取得

  return (
    <div>
      <h2>ユーザー詳細ページ</h2>
      <p>このページはユーザー {id} のページです。</p>
    </div>
  );
}

export default User;
