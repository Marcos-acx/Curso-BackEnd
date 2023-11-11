import { log } from "console"
import { existsSync } from "fs"
import fs from "fs/promises"
import { Product } from './Product.js'

export class ProductManager {
    #path
    constructor(path) {
        this.#path = path
    }

    async addProduct(product) {

        if (!product instanceof Product)
            throw new Error("Error: el objeto recibido no es un Producto")
        else {
            try {
                const products = await this.getProducts()
                const existingProduct = products.find(p => p.code === product.code)
                if (existingProduct) {
                    existingProduct.stock += product.stock
                } else {
                    const id = products.length ? products[products.length - 1].id + 1 : 1
                    product.setId(id)
                    products.push(product)
                }
                
                await fs.writeFile(this.#path, JSON.stringify(products, null, 2))
            } catch (error) {
                console.log(`Error en addProduct: ${error}`);
            }
        }

    }
    async getProducts({ limit }) {
        try {
            if (existsSync(this.#path)) {
                const products = JSON.parse(await fs.readFile(this.#path, 'utf-8'))
                if (limit) {
                    return products.slice(0, limit)
                }
                return products
            } else {
                return []
            }
        } catch (error) {
            return []
        }
    }

    async getProductById(id) {
        const products = await this.getProducts()
        const searchedProd = products.find(p => p.id === id)

        if (searchedProd) {
            return searchedProd
        } else {
            throw new Error(`No se ha encontrado un producto de id ${id}`)
        }
    }

    async updateProduct(product) {
        const outdatedProd = await this.getProductById(product.id) 
        if (outdatedProd) {
            const products = await this.getProducts()
            const index = products.findIndex(p => p.id === outdatedProd.id)
            products[index] = product
            await fs.writeFile(this.#path, JSON.stringify(products, null, 2))
        } else {
            return
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        const updatedProducts = products.filter(p => p.id !== id)
        await fs.writeFile(this.#path, JSON.stringify(updatedProducts, null, 2))
    }
}

/* async function testing() {
    const productManager = new ProductManager("db/productos.json")
    let producto = new Product("papa", "verdura", 100, "ruta", 2, 3)
    let productoNuevo = new Product("manzana", "ftqruta", 100, "ruta", 5, 3)
    productoNuevo.setId(2)

    await productManager.addProduct(producto)
    await productManager.addProduct(productoNuevo)

    console.log(await productManager.getProducts());
    
    await productManager.deleteProduct(3)
    
    console.log(await productManager.getProducts());

}

testing() */