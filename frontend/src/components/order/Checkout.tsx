import { useNavigate } from "react-router";
import { useAppSelector } from "../../store/store";

const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = useAppSelector((state)=>state.cart.items);
    const totalPrice = cartItems.reduce((acc, current)=>(acc + current.price),0);
    return (
        <>
            <h1>Checkout</h1>
            <div>
                {
                cartItems && cartItems.length > 0 
                ? cartItems.map(item => (<p key={item.id}>{item.name} - {item.quantity}</p>))
                : <p>no item in cart</p>
            }
            </div>
            <div>
                <p>total price:</p>
                <p>EUR {totalPrice.toFixed(2)}</p>
            </div>
            <div>
                <button onClick={()=>navigate("/kiosk/menu")}>BACK</button>
                <button onClick={()=>navigate("/kiosk")}>DONE</button>
            </div>
        </>
    )
};

export default Checkout;