import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate, Navigate } from "react-router-dom";

function RequireAuth({ children }) {

    const { isAuthenticated } = useSelector(state => state.firebaseLogin);
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/signin"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

export default RequireAuth;