# Gestión de Ingresos y Egresos - Fullstack Application

## Descripción


Este proyecto es una aplicación fullstack diseñada para gestionar ingresos y egresos, gestionar usuarios y generar reportes financieros. La aplicación está construida con Next.js, TypeScript, Tailwind CSS y utiliza GraphQL para la comunicación con el backend. Además, implementa control de acceso basado en roles y autenticación con Auth0.

## URL del pryecto desplegado:

- [Gestión de ingresos y egresos](http://prueba-vercel-alpha.vercel.app/)



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

1. **Home:** Página de inicio con un menú que permite acceder a tres secciones:
   - Sistema de gestión de ingresos y egresos.
   - Gestión de usuarios (solo para administradores).
   - Reportes (solo para administradores).

2. **Sistema de Gestión de Ingresos y Gastos:**
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

3. **Gestión de Usuarios (solo para administradores):**
   - Vista con una tabla de usuarios que incluye:
     - Nombre
     - Correo
     - Teléfono
     - Acciones para editar usuario
   - Formulario para editar los detalles del usuario:
     - Nombre
     - Rol
     - Botón para guardar cambios

4. **Reportes (solo para administradores):**
   - Gráfico de movimientos financieros.
   - Saldo actual.
   - Opción para descargar el reporte en formato CSV.

### Control de Acceso
- Implementación de control de acceso basado en roles (RBAC) para asegurar que solo los usuarios autorizados puedan acceder a funcionalidades específicas.

### Autenticación
- Autenticación de usuarios utilizando Auth0 y sesiones de base de datos con Prisma.

## Instrucciones para Ejecutar el Proyecto Localmente
