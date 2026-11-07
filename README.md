# Catálogo de productos · Examen Final · Desarrollo Web 036 · Variante A

Aplicación web para consultar, buscar, crear y eliminar productos. Consume la API pública de
[DummyJSON](https://dummyjson.com) e incluye inicio de sesión con renovación automática de tokens.

**Sitio desplegado:** [PEGAR_AQUI_LA_URL_DE_RENDER](https://PEGAR_AQUI_LA_URL_DE_RENDER)

## Funcionalidades

- **Autenticación:** inicio de sesión, sesión guardada en el navegador, rutas protegidas y cierre de sesión.
- **Renovación de tokens:** ante un error 401 se renueva el token una sola vez y se repite la petición.
- **Listado:** búsqueda y paginación guardadas en la URL (`?page=2&q=texto`), para que la vista se pueda recargar o compartir.
- **Detalle:** datos del producto, descarga de la imagen y descarga de una ficha en texto.
- **Crear producto:** formulario con validación (Zod y React Hook Form), carga de imagen JPG o PNG de máximo 1 MB con vista previa.
- **Eliminar producto:** con confirmación previa.
- **Manejo de errores:** mensajes en español y botón para reintentar cuando falla la carga.
- **Diseño adaptable:** la cuadrícula muestra 1, 2 o 4 columnas según el ancho de pantalla.

## Tecnologías

- React + TypeScript + Vite
- React Router (rutas)
- TanStack Query (datos del servidor)
- Zustand con `persist` (estado de sesión)
- React Hook Form + Zod (formularios)
- Axios (peticiones HTTP con interceptores)
- Tailwind CSS y componentes shadcn/ui
- React Hot Toast (notificaciones)

## Instalación

Requisitos: Node.js 20.19 o superior.

```bash
npm install
cp .env.example .env
npm run dev
```

La aplicación abre en `http://localhost:5173`.

Usuario de prueba de la API: `emilys` / `emilyspass`.

## Variables de entorno

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `https://dummyjson.com` |

## Comandos

| Comando | Para qué |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila y genera `dist/` |
| `npm run lint` | Revisa el código con ESLint |

## Despliegue

El sitio está publicado como **Static Site** en Render:

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Regla de rutas: `/*` → `/index.html` (Rewrite)

## Capturas de pantalla

<!-- Agregue aquí capturas del login, el listado, el detalle y el formulario de creación -->

## Autor

PEGAR_AQUI_TU_NOMBRE
