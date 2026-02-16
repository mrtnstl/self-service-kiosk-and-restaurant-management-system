import { Outlet } from "react-router";
import Nav from "../components/Nav";

const RootLayout = ()=>{
    return (
        <main>
            <Nav />
            <Outlet />
        </main>
    )
}

export default RootLayout;