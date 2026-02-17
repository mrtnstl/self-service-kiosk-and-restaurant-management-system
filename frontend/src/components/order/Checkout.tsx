import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearItems } from "../../store/slices/CartSlice";
import { resetOrderType } from "../../store/slices/OrderTypeSlice";

const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = useAppSelector((state)=>state.cart.items);
    const totalPrice = cartItems.reduce((acc, current)=>(acc + current.price * current.quantity),0);
    const orderType = useAppSelector(state => state.orderType.orderType);
    const dispatch = useAppDispatch();
    const handleOrderSubmit = () => {
        // TODO: post to be
        const items = cartItems.map(item => ({id: item.id, quantity: item.quantity}));
        const order = {
            type: orderType,
            items: items
        };
        console.log("order:", order);
        // if success, show order serialNr(from be response then), 
        // get confirmation, clear cart and order type and redirect to first page
        setTimeout(()=>{
            dispatch(clearItems());
            dispatch(resetOrderType());
            navigate("/kiosk");
        },2000);
    }
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
                <button onClick={handleOrderSubmit}>DONE</button>
            </div>
        </>
    )
};

export default Checkout;