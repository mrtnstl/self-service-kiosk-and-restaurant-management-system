import React, { useEffect, useRef, useState } from "react";
import config from "../../config";
import { useAuth } from "../../hooks/useAuth";
import parseAndGetCookie from "../../utils/cookieParser";
import type { UserData } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router";

type ApplianceLogin = {
    name: string;
    password: string;
};

const LoginPage = () => {
    const [formData, setFormData] = useState<ApplianceLogin>({name: "", password: ""});
    const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/verify";

    useEffect(()=>{
        if(user){
            // TODO: fix
            navigate(-1);
        }
    },[]);

    // TODO: generating uuid with crypto module is fine in secure context, 
    // but when the dev server is exposed on lan, it'll throw an error, 
    // because it's beyond localhost then
    // !login doesn't need to be idempotent
    const idempotencyKey = "23542c25k2vx9";//useRef(crypto.randomUUID());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        
        setFormData((values)=>({...values, [name]: value}));
    }
    const handleLoginSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault();
        try {
            const reqURL = new URL(config.BACKEND_BASE_URL + "/api/v1/auth/appliance-login");
            const response = await fetch(reqURL, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...formData, idempotencyKey: idempotencyKey/*.current*/})
            });
            if(!response.ok){
                throw new Error("Request failed");
            }
            const result = await response.json();
            console.log(result)
            
            const userData = (parseAndGetCookie("applianceUser") || parseAndGetCookie("reguralUser")) as UserData | null;
            if(userData){
                setUser(userData);
                navigate(from, {replace: true});
            }
        } catch(err){
            console.log(err)
        }
    }
    return (
        <>
        <h1>Login Page (and other auth)</h1>
        <form onSubmit={handleLoginSubmit}>
            <span>
                <label htmlFor="name">username</label>
                <input type="text" name="name" id="name" 
                value={formData?.name || ""} onChange={handleChange}/>
            </span>
            <span>
                <label htmlFor="password">password</label>
                <input type="text" name="password" id="password" 
                value={formData?.password || ""} onChange={handleChange}/>
            </span>
            <input type="submit" value="LOGIN" />
        </form>
        </>
    )
};

export default LoginPage;