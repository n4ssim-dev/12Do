import { useEffect } from "react";
import { useAuth } from "./AuthContext";

const OAuthSuccess = () => {
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      window.location.href = "/dashboard";
    }
  }, []);

  return <p>Connexion en cours...</p>;
};

export default OAuthSuccess;
