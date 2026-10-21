import { useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { cognitoAuthConfig, cognitoDomain, logoutUri } from "../authConfig";

export function useSignOut() {
  const auth = useAuth();

  return useCallback(async () => {
    // Borra los tokens locales antes de cerrar la sesión de Cognito.
    await auth.removeUser();

    if (!cognitoDomain) {
      console.error(
        "Falta VITE_COGNITO_DOMAIN (https://<prefijo>.auth.<region>.amazoncognito.com). " +
          "Solo se cerró la sesión local.",
      );
      window.location.assign("/");
      return;
    }

    const params = new URLSearchParams({
      client_id: cognitoAuthConfig.client_id,
      logout_uri: logoutUri,
    });

    window.location.assign(`${cognitoDomain}/logout?${params.toString()}`);
  }, [auth]);
}
