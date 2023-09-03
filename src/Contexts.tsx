import React, { createContext } from 'react';
import User from "./interfaces/User";


export const ScheduleContext = React.createContext<any>(null);

export const UserContext = createContext<any>(null);

export const UserContextProvider = ({ children }: any) => {
  const setItem = (item: User) => {
    window.localStorage.setItem("user", JSON.stringify(item));
  };
  const getItem = (item: User) => {
    // @ts-ignore
    return JSON.parse(window.localStorage.getItem("user")) || [];
  };

  return (
    <UserContext.Provider value={[setItem, getItem]}>
      {children}
    </UserContext.Provider>
  );
};
