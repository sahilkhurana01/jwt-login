import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import transporter from "../config/nodemailer.js";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'your-email@gmail.com';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(req.body)

  if (!username || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await User.findOne({ email });
    // console.log("test",existingUser)

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log(hashedPassword)

    const user = new User({ username, email, password: hashedPassword });
    // console.log(user)
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: SENDER_EMAIL,
      to: email,
      subject: "Welcome to our community",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to Our Community!</h2>
                <p>Hello <strong>${username}</strong>,</p>
                <p>Welcome to our community. We are glad to have you on board!</p>
                <p>Your account has been created successfully with email: <strong>${email}</strong></p>
                <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0;"><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Complete your profile</li>
                        <li>Explore our features</li>
                        <li>Connect with other members</li>
                    </ul>
                </div>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The Team</p>
            </div>
        `,
      text: `Hello ${username}, welcome to our community. We are glad to have you on board! Your account has been created with email id: ${email}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
      // Continue without sending email for now
    }

    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logout Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send verification otp
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;

    if (userId) {
      const user = await User.findById(userId);
      if (user.isAccountVerified) {
        return res.json({
          success: false,
          message: "Account is already verified",
        });
      }


      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
  
      await user.save();
  
      const mailOption = {
        from: SENDER_EMAIL,
        to: user.email,
        subject: "Account Verification OTP",
        text: `Your OTP is ${otp}. Verify your account using this OTP`,
      };
  
      try {
        await transporter.sendMail(mailOption);
        return res.status(200).json({ success: true, message: "OTP sent to email" });
      } catch (emailError) {
        console.log("Email sending failed:", emailError.message);
        return res.status(200).json({ success: true, message: "OTP generated but email sending failed" });
      }
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  
console.log(req.body)
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;

    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    res.json({ success: true, message: "Account Verified" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const isAuthenticated = async (req,res)=>{
  try {
    return res.json({success: true});
  } catch (error){
    res.status(502).json({success: false, message: error.message});
  }
}

//send pass reset otp
export const sendResetOtp = async(req,res)=>{
  const {email} = req.body;

  if(!email){
    return res.json({success: false, message: 'Email is required'})
  }

  try{

    const user = await User.findOne({email});
    if(!user){
      return res.json({success: false, message: 'User not found'});
    }
    
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      user.resetOtp = otp;
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
  
      await user.save();
  
      const mailOption = {
        from: SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP is for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.
        OTP is valid for 15 miniutes only.`,
      };

      try {
        await transporter.sendMail(mailOption);
        res.json({success: true, message: 'OTP sent to your email'});
      } catch (emailError) {
        console.log("Email sending failed:", emailError.message);
        res.json({success: true, message: 'OTP generated but email sending failed'});
      }

  } catch (error){
    return res.status(410).json({success: false, message: error.message})
  }
}

//Verify reset OTP
export const verifyResetOtp = async (req,res)=>{
  const {email, otp} = req.body;

  if(!email || !otp){
    return res.status(400).json({ success: false, message: 'Email and OTP are required'});
  }
  
  try{
    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({success: false, message: 'User not found'});
    }

    if(!user.resetOtp || user.resetOtp !== otp){
      return res.status(400).json({success: false, message: 'Invalid OTP'});
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success: false, message: 'OTP Expired'});
    }

    return res.json({success: true, message: 'OTP verified successfully'});

  }catch(error){
    return res.status(500).json({success: false, message: error.message});
  }
}

//Reset User Password
export const resetPassword = async (req,res)=>{
  const {email, otp, newPassword} = req.body;

  if(!email || !otp || !newPassword){
    return res.status(404).json({ success: false, message: 'Email, OTP. and new password are required'});
  }
  
  try{
    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({success: false, message: 'User not found'});

    }

    if(!user.resetOtp || user.resetOtp !== otp){
      return res.status(400).json({success: false, message: 'Invalid OTP'});
    }
    console.log(otp)

    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success: false, message: 'OTP Expired'});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({success: true, message: 'Password has been reset successfully'});


  }catch(error){
    return res.status(407).json({success: false, message: error,message});
  }
}