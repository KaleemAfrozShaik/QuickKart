const mongoose=require("mongoose");
const dotenv=require("dotenv");
const User=require("./models/User");
const Product=require("./models/Product");
const products=require("./data/products");
const Cart=require("./models/Cart");

dotenv.config();

//connect to mongodb
mongoose.connect(process.env.MONGO_URI);
//function to send data

const seedData=async ()=>{
    try {
        //Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        //create default admin user
        const createdUser=await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123454321",
            role:"admin",
        });

        //Assign the defau;t user ID rto each person
        const userID=createdUser._id;
        const sampleProducts=products.map((product)=>{
            return {...product,user: userID};
        });
        //insert the products into the db
        await Product.insertMany(sampleProducts);
        console.log("Products added successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding the data",error);
        process.exit();
    }
}
seedData();