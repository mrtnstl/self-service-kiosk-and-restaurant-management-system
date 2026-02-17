import { Outlet } from "react-router"

const KioskLayout = () => {
    return (
        <div>
            <header>
                <h1>kiosk header</h1>
                <span>cart</span>
            </header>
        <main>
            <Outlet />            
        </main>
        <footer>kiosk footer</footer>
        </div>
    )
};

export default KioskLayout;