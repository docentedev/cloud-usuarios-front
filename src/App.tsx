import { useAuth } from "react-oidc-context";
import {
  cognitoAuthConfig,
  cognitoDomain,
  logoutUri,
} from "./authConfig";
import "./App.css";

function App() {
  const auth = useAuth();

  const signOutRedirect = async () => {
    // 1) Borra los tokens locales (sessionStorage/localStorage).
    //    Sin esto, al volver de Cognito la app te seguiría viendo "autenticado".
    await auth.removeUser();

    // 2) Cierra la sesión del Hosted UI de Cognito.
    if (!cognitoDomain) {
      console.error(
        "Falta VITE_COGNITO_DOMAIN (https://<prefijo>.auth.<region>.amazoncognito.com). " +
          "Solo se cerró la sesión local.",
      );
      return;
    }

    const params = new URLSearchParams({
      client_id: cognitoAuthConfig.client_id,
      logout_uri: logoutUri,
    });

    window.location.href = `${cognitoDomain}/logout?${params.toString()}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => void signOutRedirect()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => void auth.signinRedirect()}>Sign in</button>
      <button onClick={() => void signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;
