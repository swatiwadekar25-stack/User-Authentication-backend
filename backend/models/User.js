import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:2,
        maxlength:60
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        maxlength:254
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:8,
        validate:{
            validator:(password)=>Buffer.byteLength(password,"utf8")<=72,
            message:"Password must not exceed 72 bytes"
        },
        select:false
    }
},
{timestamps:true}
)

const User = mongoose.model("User",userSchema)
export default User ;