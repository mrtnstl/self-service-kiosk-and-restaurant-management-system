import { Outlet } from "react-router"

const KioskLayout = () => {
    return (
        <div>
            <header>kiosk header</header>
        <main>
            <Outlet />            
        </main>
        <footer>kiosk footer</footer>
        </div>
    )
};

export default KioskLayout;