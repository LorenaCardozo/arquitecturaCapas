import userModel from "./mongo/models/users.model.js";

export default class Users {

    async updateByEmail(email, data) {
        const respuesta = await userModel.findOneAndUpdate({ email }, data);
        return respuesta;
    }

    async getAll(condicion) {
        try {
            const respuesta = await userModel.find(condicion);
            //console.log(respuesta); // Agrega esta línea para imprimir el resultado
            return respuesta;
        } catch (error) {
            throw error;
        }
    }

    async deleteUsers(condicion){
        try{
            const respuesta = await userModel.deleteMany(condicion);
            return respuesta
        }catch(error){
            throw error;
        }
    }

    async getById(id) {
        const respuesta = await userModel.find({ _id: id });
        return respuesta[0];
    }

    async getByMail(email) {
        const respuesta = await userModel.find({ email: email });
        return respuesta[0];
    }

    async update(id, data) {
        const respuesta = await userModel.findByIdAndUpdate(id, data);
        return respuesta;
    }    

}
