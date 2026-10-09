import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const withAuthHOC = (WrappedComponent) => {
    
    return (props) => {

        const navigate = useNavigate();
        const {setLogin, setUserInfo} = useContext(AuthContext);
        useEffect(() => {

            const isLogin = localStorage.getItem('isLogin');

            if (!isLogin) {
                se
                navigate('/');
                return;
            }

        }, [navigate]);

        return <WrappedComponent {...props} />;

    };
};

export default withAuthHOC;