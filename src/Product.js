export class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }

    setId(id) {
        this.id = id
    }
}