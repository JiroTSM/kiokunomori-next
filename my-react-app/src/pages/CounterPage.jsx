import { useCounter } from "../contexts/CounterProvider"; 

function CounterPage() {
    const { state, dispatch } = useCounter();


    return (
        <div>
            <h2>グローバルカウント: {state.count}</h2>
            <button onClick={() => dispatch({ type: "increment"})}>＋</button>
            <button onClick={() => dispatch({ type: "decrement"})}>ー</button>
            <button onClick={() => dispatch({ type: "reset"})}>リセット</button>
        </div>
    );
}

export default CounterPage;