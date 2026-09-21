//La direccion de donde vamos a sacar las publicaciones
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

//Variables para las paginas(empezamos en pagina 1 y mostraremos 10 por página)
let paginaActual = 1; //let, porque cambiar//recordar en que pagina estamos
const elementosPorPagina = 10; //10 elementos por pagina 

//Puentes con mi html, busca id y lo guarda en variable 
const apiSelection = document.getElementById('apiSelection');
const searchInput = document.getElementById('searchInput');
const fetchButton = document.getElementById('fetchButton');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const resultsContainer = document.getElementById('results');
const paginationContainer = document.getElementById('pagination');

//Herramientas visuales(cargando y errores) 

// MUESTRA "CARGANDO"
function mostrarCargando() {
    loadingElement.classList.remove('hidden'); //quita el escondite para que el usuario vea texto de carga
}

// OCULTA "CARGANDO"
function ocultarCargando() {
    loadingElement.classList.add('hidden'); //Lo vuelve a esconder.
}

// MUESTRA ERROR en la pantalla
function mostrarError(texto) {
    errorElement.textContent = texto;
    errorElement.classList.remove('hidden');
}

// OCULTA ERROR en la pantalla
function ocultarError() {
    errorElement.classList.add('hidden');
}

// DISPARADOR: BOTON //

// Cuando hace clic en el botOn, ejecutamos esta funcion
fetchButton.addEventListener('click', function() {
    
    // Miramos si el usuario eligió "axios" en el menú
    const esAxios = apiSelection.value === 'axios';
    // Guardamos lo que escribió en la barra de búsqueda
    const texto = searchInput.value;

    // Mostramos el letrero de carga y borramos errores antiguos
    mostrarCargando();
    ocultarError();

    // Si eligió Axios, usamos Axios. Si no, usamos Fetch.
    if (esAxios) {
        fetchDataWithAxios(texto);
    } else {
        fetchDataWithFetch(texto);
    }
});

// --- 4. FUNCIÓN PARA USAR FETCH CON FILTRO Y PAGINACIÓN ---
async function fetchDataWithFetch(textoBusqueda) {
    try {
        // 1. Creamos la URL con los súper poderes: página actual, límite y lo que queremos buscar (q)
        const url = `${API_URL}?_page=${paginaActual}&_limit=${elementosPorPagina}&q=${textoBusqueda}`;

        // 2. Pedimos los datos a esa URL especial
        const respuesta = await fetch(url);
        
        // Si hay algún problema con la red, avisamos
        if (!respuesta.ok) { // si es diferente de ok
            throw new Error(`Error HTTP: ${respuesta.status}`); //para errores pero no se ven ?
        }

        //  Obtenemos el número total de elementos que hay en total (viene en los encabezados)
        const totalItems = respuesta.headers.get('X-Total-Count');

        // 4. Convertimos la respuesta en un formato que JavaScript entienda (JSON)
        const datos = await respuesta.json();

        // 5. Pintamos los resultados y creamos la paginación
        mostrarResultados(datos, totalItems);

    } catch (error) {
        // Si algo falla, mostramos el error
        mostrarError("Hubo un error con Fetch: " + error.message);
    } finally {
        // Pase lo que pase, apagamos el letrero de carga
        ocultarCargando();
    }
}

// --- 5. FUNCIÓN PARA USAR AXIOS CON FILTRO Y PAGINACIÓN ---
async function fetchDataWithAxios(textoBusqueda) {
    try {
        // 1. Pedimos los datos usando Axios y pasándole los parámetros en un objeto
        const respuesta = await axios.get(API_URL, {
            params: {
                _page: paginaActual,
                _limit: elementosPorPagina,
                q: textoBusqueda
            }
        });

        // 2. Obtenemos el total de ítems de los encabezados de Axios
        const totalItems = respuesta.headers['x-total-count'];

        // 3. Axios guarda los datos en .data
        const datos = respuesta.data;

        // 4. Pintamos los resultados
        mostrarResultados(datos, totalItems);

    } catch (error) {
        // Si algo falla, mostramos el error
        mostrarError("Hubo un error con Axios: " + (error.response?.statusText || error.message));
    } finally {
        ocultarCargando();
    }
}

// --- 6. FUNCIÓN PARA PINTAR Y FILTRAR LOS RESULTADOS ---
function mostrarResultados(listaDePosts, textoBusqueda = '') {
    
    // 1. Filtramos la lista: nos quedamos solo con los posts cuyo título incluya lo que escribiste
    const postsFiltrados = listaDePosts.filter(post => 
        post.title.toLowerCase().includes(textoBusqueda.toLowerCase())
    );

    // 2. Si después de filtrar no queda nada, avisamos
    if (postsFiltrados.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    // 3. Transformamos los posts filtrados en tarjetas y los ponemos en la pantalla
    resultsContainer.innerHTML = postsFiltrados.map(post => `
        <div class="card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `).join('');
}