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

## Datos

El CRUD es local: los usuarios se guardan en `localStorage`
(`cloud-usuarios:users:v1`) partiendo de `src/data/seedUsers.ts`. Para conectar
una API real, reemplaza las funciones de `UsersProvider` por llamadas HTTP
manteniendo la misma interfaz `UsersContextValue`.
