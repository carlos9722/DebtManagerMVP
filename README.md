#Sistema de Gestión de Deudas

Sistema completo para la gestión de deudores y deudas, desarrollado con arquitectura de frontend y backend separados.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Docker** y **Docker Compose** (para la base de datos y Redis)
- **Angular CLI**

## 🚀 Despliegue Local

### Backend

1. **Navegar a la carpeta del backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Copia el contenido del archivo `.env.template` y créalo como `.env` en la carpeta `backend`, luego ajusta los valores según tu configuración local.

4. **Iniciar servicios con Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   
   Esto iniciará:
   - PostgreSQL en el puerto `5432`
   - Redis en el puerto `6379`

5. **Ejecutar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   
   El servidor estará disponible en `http://localhost:3000`

6. **Para producción:**
   ```bash
   npm run build
   npm start
   ```

### Frontend

1. **Navegar a la carpeta del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Verificar configuración del entorno:**
   
   El archivo `src/environments/environment.development.ts` debe tener:
   ```typescript
   export const environment = {
     baseUrl: 'http://localhost:3000/api',
   };
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   ng serve
   ```
   
   La aplicación estará disponible en `http://localhost:4200`

5. **Para producción:**
   ```bash
   npm run build
   ```

## 🛠️ Decisiones Técnicas

### Arquitectura

**Backend:**
- **Express.js**: Framework web minimalista y flexible para Node.js, ideal para APIs REST.
- **TypeScript**: Tipado estático que mejora la mantenibilidad y reduce errores en tiempo de ejecución.
- **Arquitectura por capas**: Separación clara entre presentación (controllers), dominio (entities, DTOs) y datos (repositories).
- **TypeORM**: ORM que facilita el trabajo con PostgreSQL y permite sincronización automática en desarrollo.

**Frontend:**
- **Angular 19**: Framework robusto con inyección de dependencias, routing y arquitectura basada en componentes.
- **TailwindCSS + DaisyUI**: Utilidades CSS para desarrollo rápido con componentes pre-estilizados.
- **RxJS**: Programación reactiva para manejo de flujos de datos asíncronos.

### Base de Datos y Caché

- **PostgreSQL**: Base de datos relacional robusta y confiable para datos estructurados.
- **Redis**: Sistema de caché en memoria para mejorar el rendimiento de consultas frecuentes.
- **Docker Compose**: Orquestación de servicios de base de datos para facilitar el despliegue local.

### Seguridad y Autenticación

- **JWT (JSON Web Tokens)**: Autenticación stateless, escalable y segura.
- **bcryptjs**: Hashing de contraseñas con algoritmo bcrypt para almacenamiento seguro.
- **Middleware de autenticación**: Protección de rutas mediante validación de tokens JWT.

### Validación y Transformación

- **class-validator**: Validación de DTOs mediante decoradores, manteniendo la lógica de validación cerca de los datos.
- **class-transformer**: Transformación de objetos planos a instancias de clases.

### Comunicación

- **CORS**: Configurado para permitir comunicación entre frontend y backend en diferentes puertos.
- **Nodemailer**: Servicio de envío de emails para notificaciones y validación de usuarios.

### Desarrollo

- **tsx**: Ejecución directa de TypeScript en desarrollo sin compilación previa.
- **tsup**: Bundler rápido para producción basado en esbuild.
- **TypeORM Synchronize**: Habilitado solo en desarrollo para sincronización automática del esquema de base de datos.

## 📁 Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Configuraciones (envs, adapters)
│   │   ├── data/            # Capa de datos (PostgreSQL, Redis)
│   │   ├── domain/          # Lógica de negocio (entities, DTOs)
│   │   └── presentation/    # Capa de presentación (controllers, routes)
│   ├── docker-compose.yml   # Configuración de servicios Docker
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── auth/        # Módulo de autenticación
    │   │   ├── debt-front/  # Módulo principal de gestión
    │   │   └── shared/      # Componentes compartidos
    │   └── environments/    # Configuración de entornos
    └── package.json
```

## 🔧 Comandos Útiles

### Backend
- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload

### Frontend
- `ng serve`: Inicia el servidor de desarrollo Angular

### Docker
- `docker-compose up -d`: Inicia los servicios en segundo plano
- `docker-compose down`: Detiene y elimina los contenedores
- `docker-compose logs`: Muestra los logs de los servicios

## ⚠️ Notas Importantes

- Asegúrate de que los puertos `3000` (backend), `4200` (frontend), `5432` (PostgreSQL) y `6379` (Redis) estén disponibles.
- **Autenticación**: Para registrarse y hacer login, es necesario usar un correo electrónico real, ya que el sistema envía un correo de confirmación y validación que debe ser verificado para permitir el acceso al usuario.

