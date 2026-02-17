import { useNavigate } from "react-router";

const OrderSelectionMenu = () => {
    const navigate = useNavigate();
    return(
        <>
            <h1>Order Selection Menu</h1>
            <div>
                <button onClick={()=>navigate("/kiosk")}>BACK</button>
                <button onClick={()=>navigate("/kiosk/checkout")}>TO CHECKOUT</button>
            </div>
        </>
    )
}

export default OrderSelectionMenu;