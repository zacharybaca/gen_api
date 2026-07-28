import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import NavBar from './components/Layout/NavBar/NavBar';
import Footer from './components/Layout/Footer/Footer';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword';
import Home from './components/Pages/Home';
import NotFound from './components/Pages/NotFound';
import './App.css';

// The Layout Component: Wraps pages with Header and Footer
const Layout = () => {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        {/* Outlet renders the child route's element (e.g., Home, Login) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Wrap all routes in the Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="resetpassword/:resettoken" element={<ResetPassword />} />

        {/* Catch-all for 404s */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
