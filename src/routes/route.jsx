import { Navigate } from "react-router-dom";
import { handleSignedIn } from "../firebase/auth";
import { useSelector } from "react-redux";
const PrivateRoute = ({ children }) => {
    //handleSignedIn();
    const { status } = useSelector((state) => state.user);
    if (!status) return <Navigate to="/login" />;
    return children;
};

export default PrivateRoute;
