import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearItems } from "../../store/slices/CartSlice";
import { resetOrderType } from "../../store/slices/OrderTypeSlice";
import config from "../../config";

const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = useAppSelector((state)=>state.cart.items);
    const totalPrice = cartItems.reduce((acc, current)=>(acc + current.price * current.quantity),0);
    const orderType = useAppSelector(state => state.orderType.orderType);
    const dispatch = useAppDispatch();
    const handleOrderSubmit = async () => {
        // TODO: post to be
        const items = cartItems.map(item => ({id: item.id, quantity: item.quantity}));
        const order = {
            type: orderType,
            items: items
        };

        console.log("order:", order);
        try {
            const reqUrl = new URL(config.BACKEND_BASE_URL + "/api/v1/order");
            const response = await fetch(reqUrl, {
                method: "POST",
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });
            const result = await response.json();
            if(!response.ok){
                console.log("FAIL RESPONSE:",response)
                console.log("FAIL RESULT:",result)
                return;
            }
            console.log("SUCCESS RESULT:",result);
            // if success, show order serialNr(from be response then), 
            // get confirmation, clear cart and order type and redirect to first page
            dispatch(clearItems());
            dispatch(resetOrderType());
            navigate("/kiosk");
            
        } catch(err){
            console.log("ERROR:",err);
        }
        
    };
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