import { createContext, useReducer, useContext } from "react";

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
    case "ADD_HISTORY":
      return { ...state, history: [...state.history, action.payload] };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    default:
      return state;
  }
}

// Context作成
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

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
