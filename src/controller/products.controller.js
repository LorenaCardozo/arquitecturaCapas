import Products from "../dao/products.dao.js";

const products = new Products();

const camposCompletos = (product) => {
    if (
        product.title === '' || product.title === 'undefined' ||
        product.description === '' || product.description === 'undefined' ||
        product.price === '' || product.price === 'undefined' ||
        product.thumbnail === '' || product.thumbnail === 'undefined' ||
        product.code === '' || product.code === 'undefined' ||
        product.stock === '' || product.stock === 'undefined' ||
        product.category === '' || product.category === 'undefined'
    ) {
        return false;
    }

    return true;
};

async function getAll(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10; // Obtener el límite de la consulta
        const page = parseInt(req.query.page) || 1; // Obtener la pagina de la consulta
        const sort = req.query.sort;
        const query = req.query.query;

        const userName = req.user.username
        const userRole = req.user.role;

        const result = await products.getAll(limit, page, sort, query);
        const plainProducts = result.docs.map(doc => doc.toObject());

        res.render("products", { Leyenda: "Lista de productos", productos: plainProducts, userName: userName, userRole: userRole });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos",
            error: error,
        });
    }
}
async function save(req, res) {
    try {
        const { title, description, code, price, status, stock } = req.body;

        if (!camposCompletos(req.body)) {
            return res.status(400).json({
                message: "Faltan datos requeridos"
            })
        } else {
            const p = { title, description, code, price, status, stock }
            const result = await products.save(p)
            res.json({
                data: result,
                message: "Producto creado exitosamente",
            })

        }
    }
    catch (error) {
        res.status(500).json({
            data: [],
            message: "Error al dar de alta el producto",
            error: error,
        });

    }
}

async function deleteId(req, res) {
    const { id } = req.params;
    try {

        const result = await products.delete(id);
        res.json({
            data: result,
            message: "Producto eliminado exitosamente"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el producto",
            error: error,
        });
    }
}

async function getId(req, res) {
    const { id } = req.params;

    try {
        const result = await products.getById(id);
        res.json({
            data: result,
            message: result.length ? "Producto encontrado" : "Producto no encontrado"
        })

    } catch (error) {
        res.json({
            message: "Error al obtener el producto",
            error: error,
        })

    }
}

async function update(req, res){
    const { id } = req.params;

    try {
        const { title, description, code, price, status, stock } = req.body;

        if (!camposCompletos(req.body) || !id) {
            return res.status(400).json({
                message: "Faltan datos requeridos"
            })
        } else {
            const p = { title, description, code, price, status, stock }
            const result = await products.update(id, p);
            res.json({
                data: result,
                message: "Producto modificado exitosamente",
            })

        }
    }
    catch (error) {
        res.status(500).json({
            data: [],
            message: "Error al modificar el producto",
            error: error,
        });

    }
}

export { getAll, save, deleteId, getId, update }