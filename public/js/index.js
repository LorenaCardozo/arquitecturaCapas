const socket = io();

//socket.emit("connection", "nuevo cliente conectado");

// Agregar un evento de escucha para el formulario
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío del formulario tradicional

    // Obtener los datos del producto del formulario
    const productTitle = document.getElementById('productTitle').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productThumbnail = document.getElementById('productThumbnail').value;
    const productCode = document.getElementById('productCode').value;
    const productStock = document.getElementById('productStock').value;
    const productCateg = document.getElementById('productCateg').value;


    // Crear un objeto con los datos del producto
    const producto = {
        title: productTitle,
        description: productDescription,
        price: productPrice,
        thumbnail: productThumbnail,
        code: productCode,
        stock: productStock,
        category: productCateg
    };

    // Enviar el producto al servidor mediante Socket.IO
    agregarProducto(producto);

    // Limpiar el campo de entrada después de enviar el formulario
    document.getElementById('productTitle').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productThumbnail').value = '';
    document.getElementById('productCode').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productCateg').value = '';

});

/*
// Agregar un evento de escucha para el boton eliminar
const EliminarButton = document.getElementById('btnEliminar');
EliminarButton.addEventListener('click', (event) => {
        // Obtener el código del producto asociado al botón de eliminar
        const codigoProducto = event.target.dataset.id;
        console.log('***********', codigoProducto)
        eliminarProducto (codigoProducto)
});
*/

// Agregar un evento de escucha para el contenedor productList
const productListContainer = document.getElementById('productList');
productListContainer.addEventListener('click', (event) => {
    // Verificar si el botón Eliminar fue clickeado
    if (event.target.classList.contains('btnEliminar')) {
        // Obtener el código del producto asociado al botón de eliminar
        const codigoProducto = event.target.dataset.id;
        eliminarProducto(codigoProducto);
    }
});

socket.on('connection', () => {
    console.log('Conectado al servidor');
});

socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
});

socket.on('okProducto', (data) => {
    let listaProductos = document.getElementById("productList");
    let newProduct = "";

    newProduct += `
    <li data-id="${data.code}">
        <p>Título: ${data.title}</p>
        <p>Descripción: ${data.description}</p>
        <p>Precio: ${data.price}</p>
        <button class="btnEliminar" data-id="${data.code}">Eliminar</button>
    </li>
        `;

    listaProductos.innerHTML += newProduct;        

});

socket.on('okDelete', (data) => {

    console.log('Evento okDelete recibido:', data);

    // La respuesta del servidor debe contener el código del producto eliminado
    const codigoProductoEliminado = data.toString();


    let listaProductos = document.getElementById("productList");
    const productoAEliminar = listaProductos.querySelector(`li[data-id="${codigoProductoEliminado}"]`);

    console.log(listaProductos, `li[data-id="${codigoProductoEliminado}"]`);

    if (productoAEliminar) {
        productoAEliminar.remove();
    }
});

function enviarMensaje(mensaje) {
    socket.emit('mensaje', mensaje);
}

function agregarProducto(datos) {
    socket.emit('agregarProducto', datos);
}

function eliminarProducto(code){
    socket.emit('eliminarProducto', code);
}
