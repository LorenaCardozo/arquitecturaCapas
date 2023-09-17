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
        console.log(error);
    }

}

async function getId(req, res){
    const { id } = req.params;

    try {
        const result = await carts.getById(id);

        let leyenda = result[0].products.length ? "Contenido del carrito de compras" : "Carrito vacío"

        res.render("carts", { leyenda: leyenda, productos: result[0].products })

    } catch (error) {
        console.log(error);
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
        res.json({
            data: result,
            message: "Carrito creado exitosamente",
        })

    }
    catch (error) {
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
        res.json({ message: "El producto se agrego correctamente al carrito", data: response })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error al intentar agregar el producto al carrito :(", error: err })
    }
}

async function deleteProduc (req, res){
    try {
        const { cid, pid } = req.params

        const response = await carts.delete(cid, pid)

        if (response != -1) {
            res.json({ message: "El producto se eliminó correctamente del carrito", data: response })
        }
        else {
            res.json({ message: "El producto no pudo ser eliminado. Verifique los datos", data: response })
        }

    }
    catch (err) {
        console.log(err)
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
        console.log(err)
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
        console.log(err)
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
        console.log(err)
        res.status(500).json({ message: "Error al intentar vaciar el carrito", error: err })
    }
    
}

export {getAll, getId, save, saveProduc, deleteProduc, update, updateId, deleteId}