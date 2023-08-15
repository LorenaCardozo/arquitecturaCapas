import productModel from "../../models/products.models.js";

export default class Products {

    async getAll(limit, page, sort, query) {

        //let respuesta = await productModel.find().limit(limit);

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};
        if (query) {
            const [key, value] = query.split('=');
                filter[key] = parseInt(value);

        }

        const options = {
            page,
            limit,
            sort: { price: (sort === "desc") ? -1 : 1 }
        };

        //const respuesta = await productModel.paginate(query ? query : {}, options);
        const respuesta = await productModel.paginate(filter, options);

        return respuesta;
    }

    async save(data) {
        const respuesta = await productModel.create(data);
        return respuesta;
    }

    async update(id, data) {
        const respuesta = await productModel.findByIdAndUpdate(id, data);
        return respuesta;
    }

    async delete(id) {
        const respuesta = await productModel.findByIdAndDelete(id);
        return respuesta;
    }

    async getById(id) {
        const respuesta = await productModel.find({ _id: id });
        return respuesta;
    }
}