import { useNavigate } from "react-router";

const Nav = ()=>{
    const navigate = useNavigate();
    return (
        <nav id="main__nav">
            <button onClick={()=>navigate("/")}>
                Login
            </button>
            <button onClick={()=>navigate("/kiosk")}>
                Kiosk
            </button>
            <button onClick={()=>navigate("/verify")}>
            Verification
            </button>
            <button onClick={()=>navigate("/admin")}>
                Admin
            </button>
            <button onClick={()=>navigate("/nonexistentroute")}>
            non-existent
            </button>     
        </nav>
    )
};

export default Nav;