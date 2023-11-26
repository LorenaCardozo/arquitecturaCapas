import Users from "../dao/users.dao.js";
import { enviarCorreoHtml } from "../utils/utils.js";

const users = new Users();

async function getAll(req, res) {
    try {
        const sort = req.query.sort;
        const query = req.query.query;

        // Asegúrate de que el nombre del método sea correcto y utiliza la instancia 'users'
        const result = await users.getAll(sort, query);

        // Mapea los resultados para devolver solo los campos deseados
        const simplifiedUsers = result.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }));

        //res.status(200).json({ users: simplifiedUsers });

        // Si estás utilizando Express y deseas renderizar una vista, utiliza res.render
        res.render("users", { title: "Lista de Usuarios", users: simplifiedUsers });

    } catch (error) {
        console.log(error);
        req.logger.error("Error al obtener los usuarios");
        res.status(500).json({
            message: "Error al obtener los usuarios",
            error: error,
        });
    }
}

async function deleteInactivos(req, res) {
    try {
        const fechaDelete = new Date();
        fechaDelete.setDate(fechaDelete.getDate() - 2);

        // usuarios inactivos que no se han conectado en los últimos 2 días
        //const usuariosInactivos = await users.getAll({ last_login: { $lt: fechaDelete } });

        const usuariosInactivos = await users.getAll({
            $or: [
                { last_login: { $lt: fechaDelete } },
            ]
        });        

        // Enviar correos electrónicos a los usuarios inactivos
        for (const usuario of usuariosInactivos) {
            const { email, username } = usuario;
            enviarCorreoHtml(email, "Usuario Inactivo", `Tu usuario ${username} ha sido eliminado por inactividad.`);
        }

        // Encuentra y elimina usuarios que no se han conectado en los últimos 2 días
        const result = await users.deleteUsers({
            $or: [
                { last_login: { $lt: fechaDelete } },
            ]
        });

        res.status(200).json({
            message: `${result.deletedCount} usuarios eliminados correctamente.`,
        });
    } catch (error) {
        console.log(error);
        req.logger.error("Error al eliminar usuarios inactivos");
        res.status(500).json({
            message: "Error al eliminar usuarios inactivos",
            error: error,
        });
    }
}

async function update(req, res) {
    const { uid } = req.params;

    try {

        const usuario = await users.getById(uid);
        let result = null; // Inicializar result antes del bloque if

        if (usuario) {
            const role = usuario?.role === 'premium' ? 'user' : 'premium'
            result = await users.update(uid, { role: role })
        }

        res.json({
            data: result,
            message: "Usuario modificado exitosamente",
        })

    } catch (error) {
        console.log(error);
        req.logger.error("Error al modificar el usuario");
        res.status(500).json({
            message: "Error al modificar el usuario",
            error: error,
        });
    }
}

async function deleteUser(req, res) {
    try {

        const { uid } = req.params;

        const result = await users.deleteUsers({ _id: uid });

        res.status(200).json({
            message: `${result.deletedCount} usuario eliminado correctamente.`,
        });
    } catch (error) {
        console.log(error);
        req.logger.error("Error al eliminar el usuario");
        res.status(500).json({
            message: "Error al eliminar el usuario",
            error: error,
        });
    }
}

export { getAll, deleteInactivos, update, deleteUser };