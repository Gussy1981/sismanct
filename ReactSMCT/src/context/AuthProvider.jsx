import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
   const [user, setUser] = useState(null);

   const login = (userLogged) =>{

        setUser(userLogged);
   };

   const logout = () => {
    setUser(null);
   };

   useEffect(() => {
      console.log("Provider user" + user);
   }, [user]);

  return (
    <AuthContext.Provider value={{
                                  user,
                                  login,
                                  logout
                                }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
