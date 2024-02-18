const User = require('../models/user.model');
const bcrypt = require('../utils/bcryptHelper.js');
const jwt = require('../utils/jwtHelper');
const { verifyToken } = require('../utils/jwtHelper');
const { body, validationResult } = require('express-validator');
const Challenge = require('../models/challenge.model.js'); // Adjust the path to your Challenge model


exports.register = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Use the uploaded image URL if available, otherwise use an empty string
    const imageUrl = req.fileUrl || "";

    try {
      const hashedPassword = await bcrypt.hashPassword(req.body.password, 10); // Using bcrypt.hash and specifying salt rounds
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: imageUrl // Save the image URL with the user
      });

      await Challenge.create({
        title: 'Welcome!',
        complexity: 'Bronze',
        tags: [], // Assuming no tags for the welcome post
        description: `Welcome to SkillSphere, ${newUser.name}! We're thrilled to have you join our community.`,
        author: newUser._id, // The author is the newly created user
        comments: [], // No comments initially
        likes: [], // No likes initially
        picture: 'https://skillsphere-pics.s3.amazonaws.com/welcome-message-examples-to-get-you-inspired.jpg' // Assuming no picture for the welcome post
      });


      // Email sending logic
      const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: req.body.email,
        subject: 'Welcome to SkillSphere!',
        text: 'Your registration with SkillSphere was successful! Welcome to our community.',
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <h2>Welcome to SkillSphere!</h2>
                <p>Dear ${req.body.name},</p>
                <p>We're excited to have you on board. Your registration was successful!</p>
                <p>Start exploring the endless possibilities and connect with like-minded individuals today.</p>
                <p>If you have any questions, feel free to reply to this email. We're here to help.</p>
                <br>
                <p>Best Regards,</p>
                <p><strong>The SkillSphere Team</strong></p>
            </div>
        `,
        // You can also include attachments, images, etc. as per your requirements
    };
    

      req.transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log('Email could not be sent: ', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.json({ status: 'ok', message: 'Registration successful' });
    } catch (err) {
      console.error("error:", err);
      res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
  }
];

exports.login = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').exists().withMessage('Password is required'),

  async (req, res) => {
      try {
          const user = await User.findOne({ email: req.body.email });
          if (user) {
              const match = await bcrypt.comparePassword(req.body.password, user.password);
              if (match) {
                  const token = jwt.generateToken(user);
                  return res.json({ status: 'ok', token });
              } else {
                  return res.json({ status: 'error', message: 'Incorrect password' });
              }
          } else {
              return res.json({ status: 'error', message: 'User not found' });
          }
      } catch (err) {
          res.json({ status: 'error', message: 'Internal server error' });
      }
  }
];




exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isOwnProfile = req.user && userId === req.user.id;
    let profileData;
    
    if (isOwnProfile) {
      profileData = user; // All user data for own profile
    } else {
      // Define the public data fields you want to expose
      profileData = {
        userId,
        name: user.name,
        email: user.email,
        friend: user.friends
        // Add other fields that you want to be public
      };
    }
    console.log("Profile Data:", profileData);

    res.json({ status: 'ok', user: profileData });
  } catch (err) {
    console.error(`Error in getProfile: ${err.message}`);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

exports.updateProfile = [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('about').optional().trim().isLength({ min: 1 }).withMessage('About section cannot be empty'), // Validate the 'about' field

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            about: req.body.about,
        };

        // If there's an uploaded file, update the profile picture URL
        if (req.file && req.file.location) {
            updateData.profilePicture = req.file.location;
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email }, // Make sure this identifies the correct user
            { $set: updateData },
            { new: true, fields: { password: 0 }, w: "majority" }
        );

        if (updatedUser) {
            return res.json({ status: 'ok', user: updatedUser });
        } else {
            return res.json({ status: 'error', error: 'User not found' });
        }
    } catch (err) {
        console.log("Error in Update: ", err);
        return res.json({ status: 'error', error: 'Update failed' });
    }
}
];
exports.deleteAccount = async (req, res) => {
    try {
      // Extract user ID from verified JWT token
      const userId = req.user.id;
      console.log('User ID:', userId);  // Debugging line
  
      // Delete user from database
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (deletedUser) {
        res.status(200).json({ status: 'ok', message: 'Account deleted successfully' });
      } else {
        console.log('User not found');  // Debugging line
        res.status(404).json({ error: 'User not found' });
      }      
    } catch (err) {
      console.log('Error:', err);  // Debugging line
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

exports.sendFriendRequest = async (req, res) => {
    const friendId = req.body.friendId;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const friend = await User.findById(req.body.friendId);
  
    if (!friend) {
      return res.json({ status: 'error', error: 'Friend not found' });
    }
    
    user.outgoingRequests.push(friendId);
    friend.incomingRequests.push(userId);
    
    await user.save();
    await friend.save();
    
    res.json({ status: 'ok' });
  };
  
  exports.acceptFriendRequest = async (req, res) => {
    const friendId = req.body.friendId;
    const userId = req.user.id;
  
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
  
    if (!friend || !user.incomingRequests.includes(friendId)) {
      return res.json({ status: 'error', error: 'Invalid request' });
    }
  
    user.friends.push(friendId);
    user.incomingRequests.pull(friendId);
    
    friend.friends.push(userId);
    friend.outgoingRequests.pull(userId);
  
    await user.save();
    await friend.save();
  
    res.json({ status: 'ok' });
  };
  
  exports.rejectFriendRequest = async (req, res) => {
    const friendId = req.body.friendId;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    
    if (!friend || !user.incomingRequests.includes(friendId)) {
      return res.json({ status: 'error', error: 'Invalid request' });
    }
    
    user.incomingRequests.pull(friendId);
    friend.outgoingRequests.pull(userId);
    
    await user.save();
    await friend.save();
    
    res.json({ status: 'ok' });
  };
  
  exports.listFriends = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('friends', '-password');
      
      res.json({ status: 'ok', friends: user.friends });
    } catch (err) {
      console.log(err);
      res.json({ status: 'error', error: 'Error listing friends' });
    }
  };
  exports.listFriends2 = async (req, res) => {
    try {
      // Extract the user ID from the request body
      const userId = req.body.id;
      
      // Validate that the userId is provided
      if (!userId) {
        return res.status(400).json({ status: 'error', error: 'User ID must be provided' });
      }
  
      
  
      const user = await User.findById(userId).populate('friends', '-password');
      
      // Check if the user was found
      if (!user) {
        return res.status(404).json({ status: 'error', error: 'User not found' });
      }
      
      res.json({ status: 'ok', friends: user.friends });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 'error', error: 'Error listing friends' });
    }
  };
  
  exports.listFriendRequests = async (req, res) => {
    const userId = req.user.id;
  
    const user = await User.findById(userId)
                             .populate('incomingRequests', 'name email _id');  // Only get name and email of the friends
    
    if (!user) {
      return res.json({ status: 'error', error: 'User not found' });
    }
  
    res.json({ status: 'ok', incomingRequests: user.incomingRequests });
  };

  exports.searchFriends = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const users = await User.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        }, '-password');  // Exclude password field

        res.json({ status: 'ok', users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', error: 'Error searching for friends' });
    }
};