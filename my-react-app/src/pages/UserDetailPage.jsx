import { useParams } from "react-router-dom";

function UserDetailPage() {
    const { id } = useParams();

    return (
    <div>
        <h2>ユーザー詳細ページ</h2>
        <p>対象ユーザーID: {id}</p>
    </div>
    );
}

export default UserDetailPage;