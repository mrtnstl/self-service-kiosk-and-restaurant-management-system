import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import config from "../../config";
import { useAppDispatch } from "../../store/store";
import { addItem } from "../../store/slices/CartSlice";

type Dish = {
    category: string;
    estimated_prep_minutes: number;
    id: string;
    min_price: number
    name: string
};
const OrderSelectionMenu = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(()=>{
        fetchDishes();
    },[]);

    const handleAddItem = (e: React.MouseEvent<HTMLButtonElement> ) => {
        const eventTarget = e.currentTarget;
        const targetParent = eventTarget.parentElement;
        if(!targetParent){
            return null;
        }

        const itemId = targetParent.dataset.dishId;
        if(!itemId){
            return null;
        }
        
        const dish = dishes.find(dish => dish.id === itemId)!;
        dispatch(addItem({id: itemId, name: dish.name, price: dish.min_price}));
    }
    const fetchDishes = async () => {
        try{
            const reqURL = new URL(config.BACKEND_BASE_URL + "/api/v1/menu");
            const response = await fetch(reqURL, {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if(!response.ok){
                throw response;
            }
            const result = await response.json();
            setDishes(result);
            console.log(result)
        } catch(err: any){
            console.log(err.status)
        }
    }
    return(
        <>
            <h1>Order Selection Menu</h1>
            <div>
            {
                dishes && dishes.length > 0 
                ? dishes.map(dish=>(<p key={dish.id} data-dish-id={dish.id} >
                    {dish.name}
                    <button onClick={handleAddItem}>
                        add
                    </button>
                    </p>))
                : <p>no dishes available</p>
            }
            </div>
            <div>
                <button onClick={()=>navigate("/kiosk")}>BACK</button>
                <button onClick={()=>navigate("/kiosk/checkout")}>TO CHECKOUT</button>
            </div>
        </>
    )
}

export default OrderSelectionMenu;