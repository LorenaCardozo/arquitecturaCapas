async function getResultado(req, res) {
    try {
        // Obtén los productos sin stock de la sesión
        const productosSinStock = req.session.productosSinStock || [];
        const productosCompra = req.session.products || [];

        const total = req.session.ticket.amount;
        const ticketCode = req.session.ticket.code

        res.render("resultado", { leyenda: "Faltan productos", faltantes: productosSinStock, ticket: req.session.ticket, productosCompra: productosCompra, totalAmount: total, ticketCode: ticketCode});

    } catch (error) {
        req.logger.error("Error al obtener el carrito");
        res.json({
            message: "Error al obtener el carrito",
            error: error,
        });

    }
}

export { getResultado };


