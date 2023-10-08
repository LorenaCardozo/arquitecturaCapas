import Carts from "../dao/carts.dao.js";

const carts = new Carts();

async function getAll(req, res){
    try {
        const result = await carts.getAll();

        let leyenda = result.products ? "Carritos" : "No hay carritos"

        res.json({
            data: result,
            message: result.length ? "Carritos" : "No hay Carritos",
        }
        );

    } catch (error) {
        //console.log(error);
        req.logger.error(error)
    }

}

async function getId(req, res){
    const { id } = req.params;

    try {
        const result = await carts.getById(id);

        let leyenda = result[0].products.length ? "Contenido del carrito de compras" : "Carrito vacío"

        res.render("carts", { leyenda: leyenda, productos: result[0].products, cartId: id })

    } catch (error) {
        //console.log(error);
        req.logger.error(error)
        res.json({
            message: "Error al obtener el carrito",
            error: error,
        })

    }
}

async function save(req, res){
    try {
        const p = { products: [] }
        const result = await carts.save(p);
        return result
        /*res.json({
            data: result,
            message: "Carrito creado exitosamente",
        })*/

    }
    catch (error) {
        req.logger.error(error)
        res.status(500).json({
            data: [],
            message: "Error al dar de alta el carrito",
            error: error,
        });

    }
}

async function saveProduc (req, res){
    try {
        const { cid, pid } = req.params

        const response = await carts.addProductToCart(cid, pid)
        req.logger.info({ message: "El producto se agrego correctamente al carrito", data: response })
        res.json({ message: "El producto se agrego correctamente al carrito", data: response })
    }
    catch (err) {
        req.logger.error(error)
        res.status(500).json({ message: "Error al intentar agregar el producto al carrito :(", error: err })
    }
}

async function deleteProduc (req, res){
    try {
        const { cid, pid } = req.params

        const response = await carts.delete(cid, pid)

        if (response != -1) {
            req.logger.info({ message: "El producto se eliminó correctamente del carrito", data: response })
            res.json({ message: "El producto se eliminó correctamente del carrito", data: response })
        }
        else {
            req.logger.info({ message: "El producto no pudo ser eliminado. Verifique los datos", data: response })
            res.json({ message: "El producto no pudo ser eliminado. Verifique los datos", data: response })
        }

    }
    catch (err) {
        req.logger.error(error)
        res.status(500).json({ message: "Algo salío mal al intentar eliminar el producto del carrito :(", error: err })
    }
}

async function update(req, res){
    try {
        const { cid } = req.params
        const { data } = req.body

        const response = await carts.update(cid, data);
        res.json({ message: "Se agregaron los productos al carrito", data: response })
    }
    catch (err) {
        req.logger.error(error)
        res.status(500).json({ message: "Error al intentar actualizar carrito :(", error: err })
    }
}

async function updateId(req, res){
    try{
        const { cid, pid } = req.params
        const { quantity } = req.body
        const response = await carts.updateQuantity(cid,pid, quantity);
        res.json({ message: "Se modificó la cantidad del producto en el carrito", data: response })
    }
    catch(err){
        req.logger.error(error)
        res.status(500).json({ message: "Error al intentar actualizar la cantidad del producto en el carrito :(", error: err })
    }
}

async function deleteId(req, res){
    try{
        const {cid} = req.params

        const response = await carts.EmptyCart(cid);
        res.status(200).json({ message: "Se ha vaciado el carrito." })
    }
    catch(err){
        req.logger.error(error)
        res.status(500).json({ message: "Error al intentar vaciar el carrito", error: err })
    }
    
}

async function purchase(req, res) {
    try {

        const { cid } = req.params;
        const email = req.session.email;

        const result = await carts.FinalizarCompra(cid, email);

        req.session.ticket = result.ticket;
        req.session.productosSinStock = result.productosSinStock;
        req.session.products = result.products;

        // Redirige a la pantalla de resultados
        res.redirect('/api/resultado');

    } catch (error) {
        req.logger.error(error)
    }
}

export {getAll, getId, save, saveProduc, deleteProduc, update, updateId, deleteId, purchase}