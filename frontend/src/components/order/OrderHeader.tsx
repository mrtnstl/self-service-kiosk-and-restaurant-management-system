import { ShoppingCart } from "../../assets/icons/Icons";
import { useAppSelector } from "../../store/store";

const OrderHeader = ({title}: {title: string}) => {
    const cartItems = useAppSelector(state=>state.cart.items);
    const cartItemCount = cartItems.reduce((acc, current)=>(acc+current.quantity), 0);
    const orderType = useAppSelector(state => state.orderType.orderType);
    return (
        <div className="section__kiosk__header">
            <span className="kiosk__header_cart-n-order">
                <p>{cartItemCount}</p>
                <ShoppingCart width={40} height={40} color="var(--color-primary)"/>
                <p>order type: {orderType}</p>
            </span>
            <h1 className="kiosk__header_title">{title}</h1>
        </div>
    )
};

export default OrderHeader;