import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import { UserType } from "../../shared/types";
import cloudinary from 'cloudinary';
import multer from "multer";
import { verifyOtp } from '../controllers/emailVerificationController';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

// Cloudinary upload function
async function uploadImage(imageFile: Express.Multer.File) {
  const b64 = Buffer.from(imageFile.buffer).toString("base64");
  const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
  const res = await cloudinary.v2.uploader.upload(dataURI);
  return res.url;
}


router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... other imports

router.post('/verify-email', async (req: Request, res: Response) => {
  const { userId, otp } = req.body; // Get OTP from the request body

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Call verifyOtp with userId and otp
    const isVerified = await verifyOtp(userId, otp); // Pass userId and OTP 

    if (isVerified) {
      return res.status(200).json({ message: 'Email verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verification-status', verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('email isEmailVerified'); // Select only the email and isEmailVerified fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      email: user.email,
      isEmailVerified: user.isEmailVerified
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.get('/verificationstatus', verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    // Select only the fields you need for verification
    const user = await User.findById(userId).select(
      'firstName lastName email phoneNumber profilePicture verified'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if all required fields have non-null, non-empty values
    const isProfileComplete = !!(
      user.firstName && 
      user.lastName && 
      user.email && 
      user.phoneNumber && 
      user.profilePicture !== 'null'
    );

    if (isProfileComplete && !user.verified) {
      // Update the user's verified status if the profile is complete
      user.verified = true;
      await user.save();
    } else if (!isProfileComplete && user.verified) {
      // Optionally, unverify the user if the profile becomes incomplete
      user.verified = false;
      await user.save();
    }

    res.status(200).json({ 
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      verified: user.verified,
      isProfileComplete
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.post("/register", 
[
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

  try {

   
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "2d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 172800000,
    });

    return res.status(200).json({message: "User registered ok"})
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
  
});



router.put(
  '/me/personal-details',
  verifyToken,
  upload.single('profilePicture'), // Handle single file upload
  [
    // Validation rules (same as before)
    check('firstName', 'First name is required').isString().optional({ nullable: true }),
    check('lastName', 'Last name is required').isString().optional({ nullable: true }),
    check('email', 'Email is invalid').isEmail().optional({ nullable: true }),
    check('phoneNumber', 'Phone number is invalid').optional({ nullable: true }),
    check('dateOfBirth', 'Date of birth is invalid').optional({ nullable: true }),
    check('nationality', 'Nationality is invalid').optional({ nullable: true }),
    check('gender', 'Gender is invalid').optional({ nullable: true }),
    check('address.street', 'Street is required').isString().optional({ nullable: true }),
    check('address.city', 'City is required').isString().optional({ nullable: true }),
    check('address.state', 'State is invalid').optional({ nullable: true }),
    check('address.postalCode', 'Postal code is invalid').optional({ nullable: true }),
    check('address.country', 'Country is required').isString().optional({ nullable: true }),
    check('passportDetails.firstName', 'First name is required').isString().optional({ nullable: true }),
    check('passportDetails.lastName', 'Last name is required').isString().optional({ nullable: true }),
    check('passportDetails.issuingCountry', 'Issuing country is required').isString().optional({ nullable: true }),
    check('passportDetails.number', 'Passport number is required').isString().optional({ nullable: true }),
    check('passportDetails.expiryDate', 'Expiry date is invalid').optional({ nullable: true }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const userId = req.userId;
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prepare the update object
      const updatedUserDetails: Partial<UserType> = {
        ...req.body,
        address: { ...user.address, ...req.body.address },
        passportDetails: { ...user.passportDetails, ...req.body.passportDetails },
      };

      // Upload profile picture if present in the request
      if (req.file) {
        const profilePictureUrl = await uploadImage(req.file);
        updatedUserDetails.profilePicture = profilePictureUrl; // Save the Cloudinary URL
      }

      // Update user details
      await user.updateOne(updatedUserDetails);
      res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
);


router.put('/deactivate', verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;  // Assuming you store userId in the token

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already deactivated
    if (!user.isActive) {
      return res.status(400).json({ message: "User is already deactivated" });
    }

    // Set isActive to false to deactivate the account
    user.isActive = false;
    await user.save();
      // Clear the authentication cookie
      res.clearCookie("auth_token");

    res.status(200).json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;