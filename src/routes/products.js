const { Router } = require("express")
// We can also use matched data for getting the validated data
const { validationResult, checkSchema } = require("express-validator")
const ValidationSchemas = require("../utils/validationSchemas")
const { generateErrorJSON, generateSimpleErrorJSON } = require("../utils/error")

const router = Router()

const validationResultMiddleware = ( req, res, next ) => {
  const result = validationResult(req)
  if(!result.isEmpty()){
    return res.status(400).json(generateErrorJSON(result))
  }
  next()
}

const products = [
  { id: 1, price: 100, name: 'Bag' },
  { id: 2, price: 200, name: 'Clothes' },
  { id: 3, price: 150, name: 'Tomato' },
];

router.delete("/",
  checkSchema(ValidationSchemas.Schemas.ProductDeletionSchema, ["body"]),
  validationResultMiddleware,
  ( req, res ) => {

    const { body } = req
    
    let idx;

    if(!products.find(( predicate, index ) => {
      if(predicate.id == body["id"]){
        idx = index
        return true
      }
      return false
    })){
      return res.status(400).json(generateSimpleErrorJSON({msg: "Product ID Not Found", path: "id"}))
    }

    products.splice(idx, 1)
    return res.status(200).json({status: 200, msg: "Deleted"})
})

router.patch("/",
  checkSchema(ValidationSchemas.Schemas.ProductModifySchema, ["body"]),
  validationResultMiddleware,
  ( req, res ) => {
    const { body } = req
    
    let idx;
    if(!products.find(( predicate, index ) => {
      if(predicate.id == body["id"]){
        idx = index
        return true
      }
      return false
    })){
      return res.status(400).json(generateSimpleErrorJSON({msg: "Product ID Not Found", path:"id"}))
    }

    if(body["name"]){
      if(products.find(predicate => {return predicate.name == body["name"]})) return res.status(400).json(generateSimpleErrorJSON({msg: "Duplicate Product", path:"id"}))
      products[idx].name = body["name"]
    }

    if(body["price"]){
      products[idx].price = body["price"]
    }

    return res.status(201).send(products[idx])
})

router.put("/",
  checkSchema(ValidationSchemas.Schemas.ProductReplaceSchema, ["body"]),
  validationResultMiddleware,
  ( req, res ) => {
    const { body } = req

    let idx;
    if(!products.find(( predicate, index ) => {
      if(predicate.id == body["id"]){
        idx = index
        return true
      }
      return false
    })){
      return res.status(400).json(generateSimpleErrorJSON({msg: "Product ID Not Found", path:"id"}))
    }

    const newProduct = {
      id: body["id"],
      price: body["price"],
      name: body["name"],
    }

    if(products.find(predicate => {return predicate.name == newProduct.name})){
      return res.status(400).json(generateSimpleErrorJSON({msg: "Duplicate Product", path:"id"}))
    }

    products[idx] = newProduct
    return res.status(201).send(newProduct)
})

router.post("/",
  checkSchema(ValidationSchemas.Schemas.ProductCreationSchema, ["body"]),
  validationResultMiddleware
  ,( req, res ) => {
    const { body } = req

    const newProduct = {
      id: products[products.length-1].id +1,
      price: body["price"],
      name: body["name"],
    }

    if(products.find(predicate => {return predicate.name == newProduct.name})){
      return res.status(400).json(generateSimpleErrorJSON({msg: "Duplicate Product Name", path: "name"}))
    }

    products.push(newProduct)

    res.status(201).json(newProduct)
})

router.get('/', 
  checkSchema(ValidationSchemas.Schemas.ProductGetterSchema, ["query"]),
  validationResultMiddleware,
  (req, res) => {

    if (!req.query.count) return res.status(200).json(products)
      
    const count = parseInt(req.query.count, 10);

    if (count > products.length) return res.status(400).json(generateSimpleErrorJSON({msg: "Number Too Big", path: "count"}))

    res.status(200).json(products.slice(0, count));
});

module.exports = router