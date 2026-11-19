import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { queryClient } from "./lib/queryClient";

function AuthEvents() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <>
      <AuthEvents />
      <UpdatePrompt />
      <AppRoutes />
    </>
  );
}

export default App;
