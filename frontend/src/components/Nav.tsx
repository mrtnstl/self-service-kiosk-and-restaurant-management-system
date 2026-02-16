import { useNavigate } from "react-router";

const Nav = ()=>{
    const navigate = useNavigate();
    return (
        <nav>
            <ul>
                <li>
                    <button onClick={()=>navigate("/")}>
                        Login
                    </button>
                </li>
                <li>
                    <button onClick={()=>navigate("/kiosk")}>
                        Kiosk
                    </button>
                </li>
                <li>
                    <button onClick={()=>navigate("/verify")}>
                    Verification
                    </button>
                </li>
                <li>
                    <button onClick={()=>navigate("/admin")}>
                        Admin
                    </button>
                </li>
                <li>
                    <button onClick={()=>navigate("/nonexistentroute")}>
                    non-existent
                    </button>
                </li>
            </ul>
        </nav>
    )
};

export default Nav;