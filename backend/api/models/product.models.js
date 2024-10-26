import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["men's clothing","jewelery","electronics","women's clothing"]
    },
    image:{
        type:String,
        required:true
    },
    sold:{
        type:Boolean,
        default:false,
    },
    dateOfSale:{
        type:Date,
    }
},{timestamps:true})

export const Product=mongoose.model("Product",productSchema)