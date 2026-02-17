import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store/store";
import { setOrderType } from "../../store/slices/OrderTypeSlice";

const BeginOrder = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    return (
        <>
            <h1>Begin Order</h1>
            <div>
                <p>dining with us or want it to go</p>
                <span>
                    <button onClick={()=>dispatch(setOrderType("local"))}>eat here</button>
                    <button onClick={()=>dispatch(setOrderType("togo"))}>to go</button>
                </span>
            </div>
            <div>
                <button onClick={()=>navigate("/kiosk/menu")}>TO MENU</button>
            </div>
        </>
    )
}

export default BeginOrder;