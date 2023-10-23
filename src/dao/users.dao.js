import userModel from "./mongo/models/users.model.js";

export default class Users {

    async updateByEmail(email, data) {
        const respuesta = await userModel.findOneAndUpdate({ email }, data);
        return respuesta;
    }
}
