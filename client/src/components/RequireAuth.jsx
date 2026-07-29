import { useSelector } from "react-redux";

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