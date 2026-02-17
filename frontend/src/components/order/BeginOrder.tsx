import { useNavigate } from "react-router";

const BeginOrder = () => {
    const navigate = useNavigate();
    return (
        <>
            <h1>Begin Order</h1>
            <div>
                <button onClick={()=>navigate("/kiosk/menu")}>TO MENU</button>
            </div>
        </>
    )
}

export default BeginOrder;