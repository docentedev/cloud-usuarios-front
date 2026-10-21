# Cloud Usuarios · Frontend

Panel de administración de usuarios construido con **React 19 + TypeScript + Vite + Tailwind CSS v4 + Wouter**, autenticado contra **Amazon Cognito** vía `react-oidc-context`.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b + vite build
npm run lint     # oxlint
npm run preview
```

## Configuración de Cognito

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
| --- | --- |
| `VITE_COGNITO_REGION` | Región del User Pool (`us-east-2`). |
| `VITE_COGNITO_USER_POOL_ID` | ID del User Pool. |
| `VITE_COGNITO_CLIENT_ID` | App Client ID (sin secret). |
| `VITE_COGNITO_DOMAIN` | `https://<prefijo>.auth.<region>.amazoncognito.com`. |
| `VITE_REDIRECT_URI` | Callback URL registrada en el App Client. |
| `VITE_LOGOUT_URI` | Allowed sign-out URL registrada en el App Client. |

Si `VITE_COGNITO_DOMAIN` no está definido, el botón de cerrar sesión solo
limpia los tokens locales y deja un aviso en consola.

## Estructura

```
src/
  authConfig.ts              Config OIDC + dominio de logout
  components/
    dashboard/StatCard.tsx
    layout/                  Sidebar, Header y AppLayout
    ui/                      Button, Card, Badges, Modal, Fields, etc.
    users/                   UserTable y UserForm
  context/                   UsersProvider (CRUD) y ThemeProvider (dark mode)
  data/seedUsers.ts          Datos iniciales de demo
  hooks/                     useUsers, useTheme, useSignOut
  pages/                     Overview, Users, UserCreate, UserDetail, Login
  types/user.ts              Modelo y helpers de formato
```

## Rutas

- `/` — Resumen general con métricas y actividad reciente.
- `/users` — Listado con búsqueda, filtros por rol/estado y paginación.
- `/user/create` — Alta de usuario con validación de formulario.
- `/user/detail/:id` — Detalle, edición inline (`?edit=1`) y eliminación.

## Troubleshooting

### `Invalid request` al cerrar sesión

Si después del logout el navegador termina en
`https://<dominio>.auth.<region>.amazoncognito.com/login?client_id=...&logout_uri=...`
con el mensaje **Invalid request**, significa que Cognito **ignoró** el
`logout_uri` porque no está registrado en las *Allowed sign-out URLs* del App
Client, y redirigió al endpoint `/login` (que no acepta `logout_uri`).

Solución: en **Cognito → User pools → (tu pool) → App integration → App client
→ Hosted UI**, agrega la URL exacta (incluyendo el slash final) a **Allowed
sign-out URLs** y guarda. Debe coincidir con `VITE_LOGOUT_URI`.

Verifica también que `VITE_REDIRECT_URI` esté en **Allowed callback URLs**; si
no, el login falla con `redirect_mismatch` después de ingresar las credenciales.

### `redirect_mismatch` al iniciar sesión

La `redirect_uri` enviada por la app no coincide con ninguna *Allowed callback
URL* del App Client. Revisa esquema (`http`/`https`), puerto y slash final.

## API de personajes

Cliente `fetch` con JWT de Cognito en `src/client/get-api-personajes/`:

| Archivo | Contenido |
| --- | --- |
| `client.ts` | `createPersonajesClient({ token })`, `API_PERSONAJES_URL` y `PersonajesApiError`. |
| `useGetPersonajes.ts` | Hook con estado (`data`, `personajes`, `isLoading`, `error`, `refetch`). |
| `types.ts` | `PersonajesResponse` y `Personaje`. |
| `index.ts` | Barrel: reexporta cliente, hook y tipos. |

Uso del hook (ya se ejecuta en `/` y deja la respuesta en consola):

```tsx
import { useGetPersonajes } from "../client/get-api-personajes";

const { personajes, isLoading, error, refetch } = useGetPersonajes();
```

Uso directo del cliente:

```ts
import { createPersonajesClient } from "../client/get-api-personajes";

const client = createPersonajesClient({ token: auth.user.id_token });
const data = await client.getPersonajes();
```

Notas:

- Envía `Authorization: Bearer <JWT>` en cada request y **no** loguea el token.
- Usa `id_token` por defecto (lo que espera un authorizer de Cognito en API
  Gateway REST). Si tu API usa un JWT authorizer de HTTP API con access token,
  cambia `useGetPersonajes.ts` a `access_token ?? id_token`.
- El API Gateway no devuelve cabeceras CORS para `http://localhost:5173`, por eso
  `vite.config.ts` proxea `/api-personajes` al endpoint real en desarrollo. En
  producción habilita CORS en API Gateway o sirve el front bajo el mismo origen,
  o define `VITE_API_PERSONAJES_URL` con la URL definitiva.

## Datos

- **`/users` consume la API real** (`GET /prod/api-usuarios/usuarios`) mediante
  `useGetUsuarios` + `getApiUsuarios`. Envía el **access token** de Cognito
  (`Authorization: Bearer ...`) porque es el que incluye `cognito:groups`; la
  API exige el grupo `administrador` y responde `403` si no perteneces.
  Los campos de la API (`nombre`, `rol`, `estado`, `creadoEn`, ...) se adaptan
  al modelo de la UI con `mapUsuario`.
- El resto de las vistas (resumen, detalle, crear, editar, eliminar) siguen
  usando `UsersProvider` con `localStorage` y los datos de `seedUsers.ts`.
  Por eso el total del resumen no coincide todavía con el listado de `/users`.
  Migrar esas vistas a la API es el siguiente paso pendiente.

