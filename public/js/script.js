// AGREGAR PRODUCTOS // 

document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', agregarAlCarrito);
});


function agregarAlCarrito(event) {
    // Realizar una solicitud POST para agregar el producto al carrito

    // Obtenenog el elemento en el que se hizo click
    //const cartButton = document.getElementById('cart-button');
    const cartButton = document.querySelector('.cart-button');
    const cid = cartButton.getAttribute('data-cart-id');

    const pid = event.target.getAttribute('data-product-id');

    fetch(`/api/carts/${cid}/product/${pid}`, { // Usar backticks para interpolar las variables
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                // La solicitud se completó correctamente, puedes manejar la respuesta si es necesario
                console.log('Producto agregado al carrito');
            } else {
                // La solicitud falló, maneja el error si es necesario
                console.error('Error al agregar el producto al carrito');
            }
        })
        .catch(error => {
            // Maneja errores de red u otros errores
            console.error('Error de red:', error);
        });
}
