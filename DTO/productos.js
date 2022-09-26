class ProductosDTO {
    constructor({name, price, thumbnail, stock, description, codigo}){
        this.name = name, 
        this.price = price,
        this.thumbnail = thumbnail, 
        this.stock = stock,
        this.description = description, 
        this.codigo = codigo
    }   
}

function tranfProdDTO (productos){
    if (Array.isArray(productos)){
        return productos.map(prod => new ProductosDTO(prod))
    } else {
        return new ProductosDTO(productos)
    }
}

module.exports = tranfProdDTO;