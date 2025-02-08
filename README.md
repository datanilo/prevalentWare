# URL del proyecto desplegado:

- [Gestión de ingresos y egresos](http:///)

# Gestión de Ingresos y Egresos - Fullstack Application

## Descripción


Este proyecto es una aplicación fullstack diseñada para gestionar ingresos y egresos, gestionar usuarios y generar reportes financieros. La aplicación está construida con Next.js, TypeScript, Tailwind CSS y utiliza GraphQL para la comunicación con el backend e implementa control de acceso basado en roles y autenticación con Auth0.

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

### Roles y Permisos (control de acceso basado en roles RBAC)

- **Usuario registrado:** Solo puede acceder a la gestión de movimientos (ingresos y egresos) pero no puede ni agregar ni eliminar movimientos.
- **Administrador:** Puede ver los reportes, editar usuarios y agregar movimientos.

- **Usuario no registrado:** Puede acceder solo al index.


##### Todos los usuarios al registrarse adquieren el rol de ADMIN, este se puede cambiar en la gestión de usuarios.

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
   - Botón para Eliminar movimientos seleccionados (solo para administradores).
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
 npx auth secret
```
agrega las claves necesarias al archivo para este proyecto

```ini
# Archivo: .env.local

AUTH0_SECRET="ya generada" # Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL="obtener de Auth0"
AUTH0_CLIENT_ID="obtener de Auth0"
AUTH0_CLIENT_SECRET="obtener de Auth0"

DATABASE_URL="obtenida de Supabase"
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
esto para un entorno de desarrollo, si quieres un entorno de produccion de Next, entonces ejecuta 

```bash
npm run build
```

seguido de 
```bash
npm run start
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


---
## Descripción de las Pruebas

Se realizan tres pruebas a la API GraphQL, cada una enfocada en una mutación específica. Estas pruebas se ejecutan de forma aislada utilizando mocks para simular las operaciones de la base de datos (Prisma), sin depender de un entorno real. Las pruebas se realizan utilizando **Jest** y **Babel**.

### Tecnologías Utilizadas

- **GraphQL:**  
  Se define el esquema (typeDefs) y los resolvers que implementan la lógica de la API.
  
- **Apollo Server:**  
  Se utiliza executeOperation() para enviar queries o mutaciones directamente al servidor Apollo sin necesidad de una conexión HTTP real.

- **Jest:**  
  Framework de testing que se usa para ejecutar las pruebas de integración y unitarias.

- **Babel:**  
  Herramienta de transformación que permite usar sintaxis moderna de JavaScript/TypeScript durante la ejecución de las pruebas.

- **Prisma (mock):**  
  En las pruebas, sus métodos se mockean (usando `jest.mock`) para aislar la lógica de los resolvers y evitar depender de una base de datos real.

### Detalle de las Pruebas

**Test `addMovement`**  
   - **Objetivo:**  
     Verificar que se pueda agregar un nuevo movimiento.
   - **Verificaciones:**  
     - La respuesta de la mutación retorna el movimiento creado con todos los campos esperados.
     - Se comprueba que el método `prisma.movement.create` se invoque una vez y con los parámetros correctos.

**Test `deleteMovements`**  
   - **Objetivo:**  
     Validar que se eliminen los movimientos indicados y se retornen los movimientos eliminados.
   - **Verificaciones:**  
     - La respuesta de la mutación no contiene errores y tiene el formato esperado.
     - Se verifica que los métodos `prisma.movement.findMany` y `prisma.movement.deleteMany` se hayan llamado con los parámetros correctos.

**Test `updateUser`**  
   - **Objetivo:**  
     Confirmar que se actualicen correctamente los campos `name`, `role` y `phone` de un usuario.
   - **Verificaciones:**  
     - La respuesta de la mutación retorna el usuario actualizado, y mostrando los nuevos valores para `name`, `role` y `phone`.
     - Se comprueba que el método `prisma.user.update` se invoque exactamente una vez y con el objeto adecuado.

---

Para ejecutar las pruebas, ejecuta el comando:

```bash
npm run test
```
