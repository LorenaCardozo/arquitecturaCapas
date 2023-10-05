import { faker } from "@faker-js/faker";

faker.location = 'es';

function generateProducts(){
    return{
        title:faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code:faker.random.numeric(4),
        price: faker.commerce.price(),
        status:Math.random() < 0.5,
        stock:faker.random.numeric(4),
        _id: faker.database.mongodbObjectId(),
    }
}

async function mockingProducts (req,res){
    let products = [];
    for (let i=0; i<100; i++){
        products.push(generateProducts())
    }
    res.send({status:"success", payload: products})
}


export {mockingProducts}