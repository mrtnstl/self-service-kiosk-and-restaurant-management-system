import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import './App.css'
import RootLayout from './layout/RootLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import AccountVerificationPage from './pages/AccountVerificationPage/AccountVerificationPage';
import AdminPage from './pages/AdminPage/AdminPage';
import KioskPage from './pages/KioskPage/KioskPage';
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={"/"} element={<RootLayout />} >
        <Route index element={<LoginPage />} />
        <Route path={"verify"} element={<AccountVerificationPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path={"kiosk"} element={<KioskPage />} />
          <Route path={"admin"} element={<AdminPage />} />
        </Route>
        <Route path={"*"} element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App;
