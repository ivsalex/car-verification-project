// import React, { createContext, useState, useContext, useEffect } from 'react';
// import Cookies from 'js-cookie';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState(null);

//     const getUser = () => {
//         const token = Cookies.get('token');
//         if (token) {
//             try {
//                 const payload = JSON.parse(atob(token.split('.')[1]));
//                 setAuth(payload);
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//             }
//         }
//         return null;
//     }

//     useEffect(() => {
//         getUser();
//     }, []);

//     return (
//         <AuthContext.Provider value={{ auth, setAuth }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };