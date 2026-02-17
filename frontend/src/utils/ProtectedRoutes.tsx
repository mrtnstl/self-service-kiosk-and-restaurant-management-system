import { Outlet, Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoutes = ({allowedRoles}:{allowedRoles: number[]}) => {
    const location= useLocation();
    const {user} = useAuth()
    
    if(!user){
        return <Navigate to={"/"} state={{from: location}} replace />
    } else if(!allowedRoles.find(roleId => roleId ===  user.roleId)){
        return <Navigate to={"unauthorized"} state={{from: location}} replace />
    } else {
        return <Outlet />
    }
};

export default ProtectedRoutes;
