import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const goToUser = () => {
        navigate('/user/123');
    } ;

    return (
        <div>
            <h2>ホームページ</h2>
            <button onClick={goToUser}>ユーザー詳細へ</button>
        </div>
    );
}

export default HomePage;