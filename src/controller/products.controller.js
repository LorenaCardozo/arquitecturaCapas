import Products from "../dao/products.dao.js";
import { customizeError } from "../service/customizeErrors.js";
import { generateProductErrorInfo } from "../service/info.js";

const products = new Products();

const camposCompletos = (product) => {

    if (
        !product.title || product.title === '' || product.title === 'undefined' ||
        !product.description ||product.description === '' || product.description === 'undefined' ||
        !product.price || product.price === '' || product.price === 'undefined' ||
        !product.code || product.code === '' || product.code === 'undefined' ||
        !product.stock || product.stock === '' || product.stock === 'undefined' 
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
        const admin = req.user.admin;
        const cartId = req.user.cart._id;
        const email = req.user.email;

        const result = await products.getAll(limit, page, sort, query);
        const plainProducts = result.docs.map(doc => doc.toObject());

        //console.log("ESTOS SON LOS PRODUCTOS", plainProducts)

       // console.log("PRODUCTOS", plainProducts);

        res.render("products", { Leyenda: "Lista de productos", productos: plainProducts, userName: userName, userRole: userRole, admin: admin, cartId: cartId, email: email });
    } catch (error) {
        req.logger.error("Error al obtener los productos")
        res.status(500).json({
            message: "Error al obtener los productos",
            error: error,
        });
    }
}
async function save(req, res) {
    try {
        const { title, description, code, price, status, stock } = req.body;
        const owner = req.user.role==='admin'?req.user.role:req.user.email;

        if (!camposCompletos({ title, description, code, price, status, stock })) {

            return res.status(400).json(customizeError('missingRequiredDataProduct', generateProductErrorInfo({title, description, code, price, stock})) )
        } else {
            const p = { title, description, code, price, status, stock,  owner}
            const result = await products.save(p)
            req.logger.info("Producto creado exitosamente")
            res.json({
                data: result,
                message: "Producto creado exitosamente",
            })

        }
    }
    catch (error) {
        req.logger.error(error)
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
        req.logger.error(error)
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
        req.logger.error(error)
        res.json({
            message: "Error al obtener el producto",
            error: error,
        })

    }
}

async function update(req, res) {
    const { id } = req.params;

    try {
        const { title, description, code, price, status, stock } = req.body;

        if (!camposCompletos(req.body) || !id) {
            return res.status(400).json(customizeError('missingRequiredDataProduct', generateProductErrorInfo({title, description, code, price, stock})) )
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
        req.logger.error(error)
        res.status(500).json({
            data: [],
            message: "Error al modificar el producto",
            error: error,
        });

    }
}

export { getAll, save, deleteId, getId, update }