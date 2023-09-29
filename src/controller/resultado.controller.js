async function getResultado(req, res) {
    try {
        /*const limit = parseInt(req.query.limit) || 10; // Obtener el límite de la consulta
        const page = parseInt(req.query.page) || 1; // Obtener la pagina de la consulta
        const sort = req.query.sort;
        const query = req.query.query;

        const userName = req.user.username
        const userRole = req.user.role;
        const admin = req.user.admin;
        const cartId = req.user.cart._id;
        const email = req.user.email;

        const result = await products.getAll(limit, page, sort, query);
        const plainProducts = result.docs.map(doc => doc.toObject());

       // console.log("PRODUCTOS", plainProducts);

        res.render("products", { Leyenda: "Lista de productos", productos: plainProducts, userName: userName, userRole: userRole, admin: admin, cartId: cartId, email: email });*/

        console.log('MOSTRAR RESULTADO', req);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos",
            error: error,
        });
    }
}

export {getResultado}