import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import config from "../../config";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addItem } from "../../store/slices/CartSlice";
import OrderHeader from "./OrderHeader";

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
            <OrderHeader title={"Menu"} />
            <div className="menu__item__wrapper section__kiosk__body">
            {
                dishes && dishes.length > 0 
                ? dishes.map(dish=>(<div className="menu__item__card" key={dish.id} data-dish-id={dish.id} >
                    <div className="menu__item__image__wrapper">
                        <small className="menu__item__image__category">{dish.category}</small>
                        <div className="menu__item__image"></div>
                        {/*<img className="menu__item__image" src="objectstoreurl" alt="dish_pic" />*/}
                    </div>
                    <span className="menu__item__info">
                        <h3 className="menu__item__title">{dish.name}</h3>
                        <p className="menu__item__preptime">prepared in {dish.estimated_prep_minutes} minutes</p>
                    </span>
                    <p className="menu__item__price">&euro; {dish.min_price}</p>
                    <button className="menu__item__button--add" onClick={handleAddItem}>
                        add
                    </button>
                    </div>))
                : <p>no dishes available</p>
            }
            </div>
            <div className="section__kiosk__footer">
                <button onClick={()=>navigate("/kiosk")}>BACK</button>
                <button onClick={()=>navigate("/kiosk/checkout")}>TO CHECKOUT</button>
            </div>
        </>
    )
}

export default OrderSelectionMenu;