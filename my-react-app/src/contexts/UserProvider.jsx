import { createContext, useReducer, useContext, useEffect, useRef } from "react";

// 状態の初期値
const initialState = {
  user: { name: "未設定" },
  history: []
};

// reducer関数
function userReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: { name: action.payload } };
    case "SET_HISTORY":
      return { ...state, history: action.payload };
    case "ADD_HISTORY":
      return { ...state, history: [...state.history, action.payload] };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    case "LOAD_HISTORY":
      return { ...state, history: action.payload };
    default:
      return state;
  }
}

// Context作成
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // 最初の読み込み完了フラグ（初回だけ　false）
  const didLoad = useRef(false);

  // 初期読み込み時に localStorage から復元
  useEffect(() => {
    const stored = localStorage.getItem("history");
    if(stored){
      dispatch({ type: "LOAD_HISTORY", payload: JSON.parse(stored) });
    }
    // 読み込み完了
    didLoad.current = true;
  }, []);

  // 履歴保存（読み込み完了後にだけ保存する）
  useEffect(() => {
    if(didLoad.current){
      localStorage.setItem("history", JSON.stringify(state.history));
      }
  }, [state.history]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// カスタムフック
export function useUser() {
  return useContext(UserContext);
}
