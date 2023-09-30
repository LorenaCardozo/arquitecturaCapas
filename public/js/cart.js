document.querySelectorAll('.cart-button').forEach(button => {
    button.addEventListener('click', MostrarCarrito);
});

document.querySelectorAll('.cart-purchase').forEach(button => {
    button.addEventListener('click', ComprarCarrito);
});

function MostrarCarrito(event) {
    const cartButton = event.target;
    const cid = cartButton.getAttribute('data-cart-id');

    if (cid) {
        // Redirigir al usuario al carrito utilizando el cartId
        window.location.href = `/api/carts/${cid}`;
    } else {
        // Manejar el caso en que la cookie "cartId" no existe
        console.error("No se encontró el carrito.");
        // Puedes mostrar un mensaje de error o redirigir a una página predeterminada
    }
}

async function ComprarCarrito(event) {
    const cartButton = event.target;
    const cid = cartButton.getAttribute('data-cart-id');

    console.log("COMPRANDOOOOOO", cid)    
    if (cid) {
        // Redirigir al usuario al carrito utilizando el cartId
        //window.location.href = `/api/carts/${cid}/purchase`;
        
    await fetch(`/api/carts/${cid}/purchase`, { // Usar backticks para interpolar las variables
        method: 'POST',
        //body : JSON.stringify({totalAmount,email,code})
    })

    window.location.href = `/api/resultado`;
    } else {
        // Manejar el caso en que la cookie "cartId" no existe
        console.error("No se encontró el carrito.");
        // Puedes mostrar un mensaje de error o redirigir a una página predeterminada
    }
}
