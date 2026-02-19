import { useEffect } from "react";
import { useSearchParams } from "react-router";
import config from "../../config";

const AccountVerificationPage = () =>{
    let [searchParams] = useSearchParams();
    const token = searchParams.get("token")

    useEffect(()=>{
        //getPendingOrders()
    },[]);
    const getPendingOrders = async () => {
        try {
            const reqUrl = new URL(config.BACKEND_BASE_URL + "/api/v1/order/pending");
            const response = await fetch(reqUrl, {
                method: "GET",
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const result = await response.json();
            if(!response.ok){
                console.log("RESP NOT OK:", response);
                return;
            }
            console.log("PENDING ORDERS:", result)
        } catch(err){
            console.log("ERR:", err)
        }

    };

    if(!token){
        return (
            <>
                <h1>Account verification is needed when a new manager type user is registered.</h1>
            </>
        )
    } else {
        return (
            <>
                <h1>Account Verification Page ({token})</h1>
            </>
        )
    }
};

export default AccountVerificationPage;