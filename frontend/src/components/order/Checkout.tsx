import { useNavigate } from "react-router";

const Checkout = () => {
    const navigate = useNavigate();
    return (
        <>
            <h1>Checkout</h1>
            <div>
                <button onClick={()=>navigate("/kiosk/menu")}>BACK</button>
                <button onClick={()=>navigate("/kiosk")}>DONE</button>
            </div>
        </>
    )
};

export default Checkout;