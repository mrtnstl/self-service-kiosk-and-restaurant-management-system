import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import './App.css'
import config from './config';
import RootLayout from './layout/RootLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import AccountVerificationPage from './pages/AccountVerificationPage/AccountVerificationPage';
import AdminPage from './pages/AdminPage/AdminPage';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage';
import KitchenPage from './pages/KitchenPage/KitchenPage';
import ProtectedRoutes from './utils/ProtectedRoutes';
import KioskLayout from './layout/KioskLayout';
import BeginOrder from './components/order/BeginOrder';
import OrderSelectionMenu from './components/order/OrderSelectionMenu';
import Checkout from './components/order/Checkout';

function App() {
  const { ROLES } = config;
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={"/"} element={<RootLayout />} >
        <Route index element={<LoginPage />} />
        <Route path={"verify"} element={<AccountVerificationPage />} />
        <Route element={<ProtectedRoutes allowedRoles={[ROLES.KIOSK, ROLES.MANAGER]} />}>
          <Route path={"kiosk"} element={<KioskLayout />}>
            <Route path={""} element={<BeginOrder />}/>
            <Route path={"menu"} element={<OrderSelectionMenu />}/>
            <Route path={"checkout"} element={<Checkout />}/>
          </Route>
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={[ROLES.KITCHEN_MONITOR, ROLES.MANAGER]}/>}>
          <Route path={"kitchen"} element={<KitchenPage />} />
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={[ROLES.MANAGER]}/>}>
          <Route path={"admin"} element={<AdminPage />} />
        </Route>
        <Route path={"unauthorized"} element={<UnauthorizedPage />} />
        <Route path={"*"} element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App;
