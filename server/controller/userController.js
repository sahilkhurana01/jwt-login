import User from "../models/userModel.js";

export const getUserData = async (req,res)=>{
    try{
        const userId  = req.userId;

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(401).json({success: false, message: 'User not found'});

        }

        res.json({
            success: true,
            userData: {
                username: user.username,
                isAccountVerified: user.isAccountVerified
            }
        });

    }catch(error){
        res.status(404).json({success: false, message: error.message});
    }
}