export const generateProductErrorInfo =(prod)=>{

    return `Faltan datos requeridos:
    * title: dato informado ${prod.title}
    * description: dato informado ${prod.description}
    * price: dato informado ${prod.price}
    * code: dato informado ${prod.code}
    * stock: dato informado ${prod.stock}
    `
}