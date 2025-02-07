# URL del proyecto desplegado:

- [Gestión de ingresos y egresos](http://prueba-vercel-alpha.vercel.app/)


# Gestión de Ingresos y Egresos - Fullstack Application

## Descripción


Este proyecto es una aplicación fullstack diseñada para gestionar ingresos y egresos, gestionar usuarios y generar reportes financieros. La aplicación está construida con Next.js, TypeScript, Tailwind CSS y utiliza GraphQL para la comunicación con el backend. Además, implementa control de acceso basado en roles y autenticación con Auth0.

## Tecnologías y Herramientas Utilizadas

- **Frontend:**
  - Next.js (con Pages Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI (para componentes de la interfaz de usuario)
  - Apollo Client (para GraphQL)
  
- **Backend:**
  - API GraphQL con Apollo Server (implementada en Next.js)
  - Base de datos: Supabase (PostgreSQL)
  - Autenticación: Auth0 con Auth.js y Prisma como adaptador
  
- **Despliegue:**
  - Vercel

## Funcionalidades

### Roles y Permisos

- **Usuario:** Solo puede acceder a la gestión de movimientos (ingresos y egresos).
- **Administrador:** Puede ver los reportes, editar usuarios y agregar movimientos.

### Páginas Principales

  **Home:** Página de inicio con un menú que permite acceder a tres secciones:
   - Sistema de gestión de ingresos y egresos.
   - Gestión de usuarios (solo para administradores).
   - Reportes (solo para administradores).

**Sistema de Gestión de Ingresos y Gastos:**
   - Vista de ingresos y egresos con una tabla que muestra:
     - Concepto
     - Monto
     - Fecha
     - Usuario
   - Botón para agregar nuevos movimientos (solo para administradores).
   - Formulario para agregar un nuevo ingreso o egreso con los siguientes campos:
     - Monto
     - Concepto
     - Fecha

**Gestión de Usuarios (solo para administradores):**
   - Vista con una tabla de usuarios que incluye:
     - Nombre
     - Correo
     - Teléfono
     - Acciones para editar usuario
   - Formulario para editar los detalles del usuario:
     - Nombre
     - Rol
     - Botón para guardar cambios

**Reportes (solo para administradores):**
   - Gráfico de movimientos financieros.
   - Saldo actual.
   - Opción para descargar el reporte en formato CSV.

### Control de Acceso
- Implementación de control de acceso basado en roles (RBAC) para asegurar que solo los usuarios autorizados puedan acceder a funcionalidades específicas.

### Autenticación
- Autenticación de usuarios utilizando Auth0 y sesiones de base de datos con Prisma.


---


# Instrucciones para Ejecutar el proyecto localmente



## 1. Clonar el Repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/datanilo/prevalentWare.git
cd prevalentWare
```

## 2. Instalar las Dependencias

```bash
npm install
```


## 3. Configurar el Archivo de Entorno

El proyecto utiliza variables de entorno definidas en un archivo .env.local.

Para generar una clave aleatoria y crear el archivo:

```bash
 npx auth
```
agrega las claves necesarias al archivo para este proyecto

```ini
# Archivo: .env.local

AUTH0_SECRET=4567576iuyrtrrtry7564556476tryrty65tuyk
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://prueba-prevalentware.us.auth0.com
AUTH0_CLIENT_ID=9BdcgvXCQEncyBLUedECCMK9ALAKiIwL
AUTH0_CLIENT_SECRET=NLzF_UiGjxJL6xsSKX0M-O-_orhPGJFltIkiFvqAjmSCeRivP_hfIjtOZ8mbX2Pr

AUTH_SECRET="" # Added by `npx auth`. Read more: https://cli.authjs.dev

DATABASE_URL=postgresql://postgres.rtvlfjrlsiqlmpushnio:prevalentWare@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

## 4. Ejecutar el Cliente de Prisma

Para generar el cliente de Prisma, ejecuta:

```bash
npx prisma generate
```

## 5. Iniciar el Proyecto

Con todo configurado, inicia la aplicación:

```bash
npm run dev
```

---

# Despliegue en Vercel


 inicia sesión en Vercel

```bash
vercel login
```

Conecta el Proyecto a Vercel
```bash
vercel
```

Agrega las variables de Entorno
```bash
vercel env add AUTH0_SECRET production
vercel env add AUTH0_BASE_URL production
vercel env add AUTH0_ISSUER_BASE_URL production
vercel env add AUTH0_CLIENT_ID production
vercel env add AUTH0_CLIENT_SECRET production
vercel env add AUTH_SECRET production
vercel env add DATABASE_URL production
```

verifica que las variables fueron añadidas correctamente:

```bash
vercel env ls
```

Una vez que el proyecto esté configurado y las variables de entorno hayan sido agregadas, realiza el despliegue a producción ejecutando:

```bash
vercel --prod
```

