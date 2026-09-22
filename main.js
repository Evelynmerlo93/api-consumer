//La direccion de donde vamos a sacar las publicaciones
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

let paginaActual = 1; 
const elementosPorPagina = 10; 

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
    loadingElement.classList.remove('hidden'); //quita el cartel escondido
}

// OCULTA "CARGANDO"
function ocultarCargando() {
    loadingElement.classList.add('hidden'); //Vuelve a esconder el cartel 
}

// MUESTRA ERROR en pantalla
function mostrarError(texto) {
    errorElement.textContent = texto; 
    errorElement.classList.remove('hidden');
}

// OCULTA ERROR en pantalla
function ocultarError() {
    errorElement.classList.add('hidden');
}

// DISPARADOR: BOTON //

//clic en el boton, ejecuto funcion vacia
fetchButton.addEventListener('click', function() {
    
    // Miramos si el usuario eligio "axios" en el menú
    const esAxios = apiSelection.value === 'axios';
    // Guardamos lo que escribio en la barra de busqueda
    const texto = searchInput.value;

    // Mostramos el letrero de carga y borramos errores que esten de antes( si es q los hay)
    mostrarCargando();
    ocultarError();

    //Si eligio Axios, usamos Axios. Sino, fetch.
    if (esAxios) {
        fetchDataWithAxios(texto);
    } else {
        fetchDataWithFetch(texto);
    }
});

//FUNCION PARA USAR FETCH CON FILTRO Y PAGINACION
async function fetchDataWithFetch(textoBusqueda) {
    try {
        //Creamos la URL : PAG actual, lim pag y lo que queremos buscar (q)
        const url = `${API_URL}?_page=${paginaActual}&_limit=${elementosPorPagina}&q=${textoBusqueda}`;

        //Pedimos los datos a esa URL especial
        const respuesta = await fetch(url);
        
        // Si hay algun problema con la red, avisamos
        if (!respuesta.ok) { // si es diferente de ok
            throw new Error(`Error HTTP: ${respuesta.status}`); //para errores pero no se ven ?
        }

        //Obtenemos el nUmero total de elementos que hay en total (viene en los encabezados)
        const totalItems = respuesta.headers.get('X-Total-Count');

        // Convertimos respuesta en formato que JavaScript entienda JSON
        const datos = await respuesta.json();

        //Pintamos los resultados y creamos la paginacion
        mostrarResultados(datos, textoBusqueda);

    } catch (error) {
        // Si algo falla, mostramos el error
        mostrarError("Hubo un error con Fetch: " + error.message);
    } finally {
        // Pase lo que pase, apagamos el letrero de carga
        ocultarCargando();
    }
}

//FUNCION PARA USAR AXIOS CON FILTRO 
async function fetchDataWithAxios(textoBusqueda) {
    try {
        //Pedimos los datos usando Axios y pasandole los parametros en un objeto
        const respuesta = await axios.get(API_URL, {
            params: {
                _page: paginaActual,
                _limit: elementosPorPagina,
                q: textoBusqueda
            }
        });

        //Obtenemos el total de items de los encabezados de Axios
        const totalItems = respuesta.headers['x-total-count'];

        // Axios guarda los datos en .data
        const datos = respuesta.data;

        // Pintamos los resultados
        mostrarResultados(datos, textoBusqueda);

    } catch (error) {
        // Si algo falla, mostramos el error
        mostrarError("Hubo un error con Axios: " + (error.response?.statusText || error.message));
    } finally {
        ocultarCargando();
    }
}

// FUNCION PARA PINTAR Y FILTRAR LOS RESULTADOS 
function mostrarResultados(listaDePosts, textoBusqueda = '') {
    
    // Filtramos la lista:nos quedamos solo con lo que escribe con filter
    const postsFiltrados = listaDePosts.filter(post => 
        post.title.toLowerCase().includes(textoBusqueda.toLowerCase())
    );

    // Si despues de filtrar no queda nada, avisamos
    if (postsFiltrados.length === 0) {
        resultsContainer.innerHTML = 
        '<p>No se encontraron resultados.</p>';
        return;
    }

    // Transformamos los posts filtrados en tarjetas y los ponemos en la pantalla
    resultsContainer.innerHTML = postsFiltrados.map(post => `
        <div class="card">

            <h3>${post.title}</h3>
            <p>${post.body}</p>
            
        </div>
    `).join('');
}