# Buscador de Publicaciones (Fetch vs Axios)

Pequeña aplicación web desarrollada en JavaScript Vanilla que permite consumir la API pública de **JSONPlaceholder**, implementando funcionalidades de búsqueda por texto y paginación, con la opción de alternar entre la API nativa `Fetch` y la librería `Axios`.

## 🚀 Tecnologías y Herramientas
* **HTML5** y **CSS3** para la estructura y diseño visual.
* **JavaScript (ES6+)** para la lógica de la aplicación y manipulación del DOM.
* **Fetch API** (Nativa de JavaScript).
* **Axios** (Importado por CDN).
* **JSONPlaceholder API** (Fuente de datos).
* **Git y GitHub** para el control de versiones.

## ✨ Funcionalidades principales
* **Selector de cliente HTTP:** Permite elegir dinámicamente si deseas realizar las peticiones utilizando `Fetch` o `Axios`.
* **Búsqueda en tiempo real:** Filtra las publicaciones de la API según el término ingresado.
* **Paginación eficiente:** Estructurado para mostrar los resultados divididos por páginas (10 elementos por página).
* **Manejo de estados visuales:** Indicadores de carga (`Carga de datos...`) y gestión de errores en caso de fallos de red.

## 🛠️ Cómo ejecutar el proyecto localmente

1. Clona este repositorio en tu ordenador:
   ```bash
 git clone https://github.com/Evelynmerlo93/api-consumer.git