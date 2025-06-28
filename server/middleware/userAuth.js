import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({success: false, message: "Access denied. No token provided."}) 
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    

        if(tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.status(401).json({success: false, message: "Access denied. Invalid"});
        }

        next();

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

export default userAuth;