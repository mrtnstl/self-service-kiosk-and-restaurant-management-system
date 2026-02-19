import { Outlet } from "react-router"
const KioskLayout = () => {
    return (    
        <section className="section__kiosk">
            <Outlet />            
        </section>
    )
};

export default KioskLayout;