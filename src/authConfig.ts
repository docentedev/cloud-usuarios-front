// Configuración de Cognito / OIDC.
// Los valores reales vienen de variables de entorno (ver .env.example).
// Los fallbacks son el pool de desarrollo actual.

const region = import.meta.env.VITE_COGNITO_REGION ?? "us-east-2";
const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "us-east-2_KDduqjQdn";

export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
  client_id:
    import.meta.env.VITE_COGNITO_CLIENT_ID ?? "8vu37n7dpq595tfgsg8nrajc2",
  redirect_uri:
    import.meta.env.VITE_REDIRECT_URI ?? `${window.location.origin}/`,
  response_type: "code",
  scope: "phone openid email",
};

// Hosted UI domain: https://<prefix>.auth.<region>.amazoncognito.com
// Sin esto no se puede cerrar la sesión de Cognito (solo la local).
export const cognitoDomain = (
  import.meta.env.VITE_COGNITO_DOMAIN ?? ""
).replace(/\/+$/, "");

// URL a la que Cognito devuelve al usuario tras el logout.
// Debe estar registrada en el App Client: "Allowed sign-out URLs".
export const logoutUri =
  import.meta.env.VITE_LOGOUT_URI ?? `${window.location.origin}/`;
