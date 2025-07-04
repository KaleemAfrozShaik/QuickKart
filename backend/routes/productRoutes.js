const express=require("express");
const {protect,admin} = require("../middleware/authMiddleware");
const router = express.Router();
const Product=require("../models/Product");

//@route POST /api/products
//@desc Create a new product
//@access Private/Admin

router.post("/",protect,admin,async (req,res)=>{
    try {
        const {
            name
            ,description
            ,price
            ,discountPrice
            ,countInStock
            ,category
            ,brand
            ,sizes
            ,colors
            ,collections
            ,material
            ,gender
            ,images
            ,isFeatured
            ,isPublished
            ,tags
            ,dimensions
            ,weight
            ,sku
        }=req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,  // fixed spelling
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,           // fixed from "tage"
            dimensions,
            weight,
            sku,
            user: req.user._id,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
        
    }
});

//@route PUT /api/products/:id
//@deesc update an existing product id
//@access Private/admin
router.put("/:id",protect,admin,async (req,res)=>{
    try {
        const {
            name
            ,description
            ,price
            ,discountPrice
            ,countInStock
            ,category
            ,brand
            ,sizes
            ,colors
            ,collections
            ,material
            ,gender
            ,images
            ,isFeatured
            ,isPublished
            ,tags
            ,dimensions
            ,weight
            ,sku
        }=req.body;
        //find product by id
        const product= await Product.findById(req.params.id);
        if(product){
            product.name= name || product.name;
            product.description= description || product.description;
            product.price= price || product.price;
            product.discountPrice= discountPrice || product.discountPrice;
            product.countInStock= countInStock || product.countInStock;
            product.category= category || product.category;
            product.brand= brand || product.brand;
            product.sizes= sizes || product.sizes;
            product.colors= colors || product.colors;
            product.collections= collections || product.collections;
            product.material= material || product.material;
            product.gender= gender || product.gender;
            product.images= images || product.images;
            product.isFeatured= isFeatured || product.isFeatured;
            product.isPublished= isPublished || product.isPublished;
            product.tags= tags || product.tags;
            product.dimensions= dimensions || product.dimensions;
            product.weight= weight || product.weight;
            product.sku= sku || product.sku;

            //save the product to db
            const updatedProduct=await product.save();
            res.json(updatedProduct)
        }else{
            res.status(404).json({message: "Product not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
});

//@route Delete /api/products/:id
//@desc Delete an existing product id
//@access Private/admin
router.delete("/:id",protect,admin,async (req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(product){
            //remove from db
            await product.deleteOne();
            res.json({message:" Product Removed"});
        }
        else{
            res.status(404).json({message:"Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route GET /api/products
//@desc GET all products woth optional query filters
//@access Public
router.get("/",async(req,res)=>{
    try {
        const {collection,size,color,gender,minPrice,maxPrice,sortBy,search,category,material,brand,limit}=req.query;
        let query = {};
        //Filter logic
        if(collection && collection.toLocaleLowerCase() !=="all"){
            query.collections=collection;
        }
        if(category && category.toLocaleLowerCase() !=="all"){
            query.category=category;
        }
        if(material){
            query.material = {$in: material.split(",")};
        }
        if(brand){
            query.brand = {$in: brand.split(",")};
        }
        if(size){
            query.sizes = {$in: size.split(",")};
        }
        if(color){
            query.colors = {$in: [color]};
        }
        if(gender){
            query.gender=gender;
        }
        if(minPrice || maxPrice){
            query.price={};
            if(minPrice){
                query.price.$gte = Number(minPrice);
            }
            if(maxPrice){
                query.price.$lte = Number(maxPrice);
            }
        }
        if(search){
            query.$or = [
                {
                    name:{$regex: search,$options:"i"}
                },
                {
                    description:{$regex: search,$options:"i"}
                }
            ];
        }
        //sort logic
        let sort={};
        if(sortBy){
            switch(sortBy){
                case "priceAsc":
                    sort={price:1};
                    break;
                case "priceDesc":
                    sort={price:-1};
                    break;
                case "popularity":
                    sort={rating:-1};
                    break;
            }
        }
        //Fetch products and apply sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);  
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
        
    }
});

//@route GET /api/products/new-arrivals
//@desc retrieve  latest 8 products - creation date
//@access Public
router.get("/new-arrivals",async(req,res)=>{
    try {
        //fetch latest 8 records
        const newArrivals = await Product.find().sort({ createdAt:-1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
})

//@route GET /api/products/best-seller
//@desc retrieve  products with highest rating
//@access Public
router.get("/best-seller",async(req,res)=>{
    try {
        const bestSeller = await Product.findOne().sort({rating: -1});
        if(bestSeller){
            res.json(bestSeller);
        }
        else{
            res.status(404).json({message: "No best seller found."})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
});

//@route GET /api/products/:id
//@desc retrieve a single product by ID
//@access Public
router.get("/:id",async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }
        else{
            res.status(404).json({message:"Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route GET /api/products/similar/:id
//@desc retrieve similar products based on current gender and category
//@access Public
router.get("/similar/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        const similarProducts=await Product.find({
            _id: {$ne:id},
            gender: product.gender,
            category: product.category,
        }).limit(4); 
        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



module.exports=router;
