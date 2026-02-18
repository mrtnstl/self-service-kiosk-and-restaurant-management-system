import { Outlet } from "react-router"
import { useAppSelector } from "../store/store";

const KioskLayout = () => {
    const cartItems = useAppSelector(state=>state.cart.items);
    const cartItemCount = cartItems.reduce((acc, current)=>(acc+current.quantity), 0);
    const orderType = useAppSelector(state => state.orderType.orderType);
    return (
        <div>
            <header>
                <p>cart <span>{cartItemCount}</span></p>
                <p>order type: {orderType}</p>
            </header>
        <main>
            <Outlet />            
        </main>
        <footer>kiosk footer</footer>
        </div>
    )
};

export default KioskLayout;