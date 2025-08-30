import { createContext, useReducer, useContext } from "react";

// 初期状態
const initialState = { count: 0};

// reducer関数
function counterReducer(state, action){
    switch (action.type){
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "reset":
            return { count: 0 };
        default:
            return state;
    }
}

// Context作成
const CounterContext = createContext();

export function CounterProvider({ children }) {
    const [ state, dispatch ] = useReducer(counterReducer,initialState);

    return (
        <CounterContext.Provider value={{ state, dispatch }}>{ children}</CounterContext.Provider>
    );
}

//外部からの使うためにカスタムフック
export function useCounter() {
    return useContext(CounterContext);
}