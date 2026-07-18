import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useAuth from "../store/AuthStore/useAuth";

import Main from "../pages/Main";
import AuthPage from "../pages/Auth/Login/AuthPage";
import CadastroEmpresaPage from "../pages/Auth/SignUp/CadastroPage";

import Workflow from "../pages/PDVPage";
import ClientesPage from "../pages/Clientes/ClientesPage";
import CustomersTable from "../pages/SalesTable";

import LoadingScreen from "../pages/Main/LoadingScreen";
import CustomerDetailPage from "../pages/Clientes/CustomerDetailPage";
import TableStock from "../pages/Stock/StockPage";
import ConfiguracoesPage from "../pages/Config/ConfiguracoesPage";
import LandingPage from "../pages/LadingPage";

const PUBLIC_PATHS = ["/login", "/cadastro", "/page"];

function AnimatedRoutes({ isLogged }: { isLogged: boolean }) {
  const location = useLocation();

  const pageAnimation = (page: React.ReactNode) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.99, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.995, y: -8 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1],
      }}
      style={{
        width: "100%",
        height: "100%",
        willChange: "transform, opacity",
      }}
    >
      {page}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={pageAnimation(<AuthPage />)} />
        <Route path="/cadastro" element={pageAnimation(<CadastroEmpresaPage />)} />
        <Route path="/page" element={pageAnimation(<LandingPage />)} />

        {isLogged && (
          <Route path="/" element={<Main />}>
            <Route index element={<Workflow />} />

            <Route path="workflow" element={<Workflow />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="configuracoes" element={<ConfiguracoesPage />} />
            <Route path="clientes/:clienteId" element={<CustomerDetailPage />} />
            <Route path="estoque" element={<TableStock />} />

            <Route path="vendas">
              <Route index element={<CustomersTable />} />
            </Route>
          </Route>
        )}
      </Routes>
    </AnimatePresence>
  );
}

function AuthGate({ isLogged }: { isLogged: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  useEffect(() => {
    if (!isLogged && !isPublic) {
      navigate("/login", { replace: true });
    } else if (isLogged && location.pathname === "/login") {
      navigate("/workflow", { replace: true });
    }
  }, [isLogged, isPublic, location.pathname, navigate]);

  return <AnimatedRoutes isLogged={isLogged} />;
}

const AppRoutes = () => {
  const { isLogged, initialize, loading } = useAuth();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AuthGate isLogged={isLogged} />
    </BrowserRouter>
  );
};

export default AppRoutes;
