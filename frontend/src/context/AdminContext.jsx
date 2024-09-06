import React, { createContext, useReducer, useState } from "react";

export const AdminContext = createContext();

const initialState = {
    adminInfo: JSON.parse(localStorage.getItem("adminInfo")) || null,
  };

function reducer(state, action) {
  const resData = action.payload;
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        adminInfo: resData.jwtToken,
      };

      case "USER_LOGOUT":
        return initialState;

    default:
      return state;
  }
}

const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [permissionsData, setPermissionsData] = useState([]);

  const value = {
    state,
    dispatch,
    setPermissionsData,
    permissionsData,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminProvider;
