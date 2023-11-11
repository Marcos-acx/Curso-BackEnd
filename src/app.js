import express from 'express'
import { ProductManager } from './ProductManager.js'


const app = express()

const pm = new ProductManager('db/productos.json')

app.get('/products', async (req, res) => {
    const limit = req.query
    const products = await pm.getProducts(limit)
    if (!products.length) {
        res.send("<h1>No hay productos disponibles en este momnento.</h1>")
    } else {
        res.json(products)
    }
})

app.get('/products/:pid', async (req, res) => {
    const pid = Number(req.params.pid)
    try {
        const searchedProd = await pm.getProductById(pid)
        res.json(searchedProd)
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})

app.listen(8080)