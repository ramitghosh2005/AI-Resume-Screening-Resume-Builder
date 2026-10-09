import {createContext, useContext, useState} from 'react';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    var login = localStorage.getItem('isLogin');
    var userInfoData = localStorage.getItem('userInfo');
    const [isLogin, setLogin] = useState(login === 'true' ? true : false);
    const [userInfo, setUserInfo] = useState(userInfoData ? JSON.parse(userInfoData) : null);

    return(
        <AuthContext.Provider value={{isLogin, setLogin, userInfo, setUserInfo}}>
            {children}
        </AuthContext.Provider> 
    )
}
export {AuthContext, AuthProvider};