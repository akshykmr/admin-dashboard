import User from "../model/user";
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const { name, email, mobileno, password, role, permissions, userstatus } =
      req.body;

    // Check for existing users with the same email and mobile number
    const existingUserWithEmail = await User.findOne({ Email: email });
    const existingUserWithMobile = await User.findOne({ MobileNo: mobileno });

    if (existingUserWithEmail) {
      return res.json({
        success: false,
        message: "Email already exists, please choose another email",
        action: "email",
      });
    } else if (existingUserWithMobile) {
      return res.json({
        success: false,
        message:
          "Mobile number already exists, please choose another mobile number",
        action: "mobile",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance
    const user = new User({
      Name: name,
      Email: email,
      MobileNo: mobileno,
      Password: hashedPassword,
      Role: role,
      Permissions: permissions,
      UserStatus: userstatus,
    });
    // Save the user to the database
    const response = await user.save();

    // Generate and include a token if needed
    const token = await user.generateAuthToken();

    return res.json({
      success: true,
      message: "User successfully registered",
      token,
      // Include the token here if generated
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};



const logInUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log("1");

    let user;

    // Check if userId looks like an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId);

    if (isEmail) {
      user = await User.findOne({ Email: userId });
    } else {
      user = await User.findOne({ MobileNo: userId });
    }

    if (!user) {
      console.log("User Not Found");
      res.json({ success: false, message: "User Not Found" });
    } else {
      console.log("else");
      const isPasswordValid = await bcrypt.compare(password, user.Password);
      console.log("else", isPasswordValid);

      if (!isPasswordValid) {
        console.log("Invalid Password");
        res.json({ success: false, message: "Invalid Password" });
      } else {
        const token = await user.generateAuthToken();
        res.json({
          success: true,
          message: "Login successful!",
          data: {
            Name: user.Name,
            Email: user.Email,
            MobileNo: user.MobileNo,
            Role: user.Role,
            Permissions: user.Permissions,
            UserStatus: user.Userstatus,
          },
          token,
        });
        console.log("Login successful!");
      }
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};

const logInUserwithToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    } 
    else if(user.Role==='admin') {
      const allUsers = await User.find();
      // Check if there are any documents
      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({ success: false, message: "No users found" });
      }
      // Send the array of documents as the response
      res.json({
        success: true,
        data: allUsers.map((user) => ({
          Name: user.Name,
          Email: user.Email,
          MobileNo: user.Mobileno,
          Role: user.Role,
          Permissions: user.Permissions,
          UserStatus: user.Userstatus,
        })),
      });
  
      console.log("Data Transfered");
    } else if(user.Role==='subadmin') {
      const allUsers = await User.find();
      // Check if there are any documents
      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({ success: false, message: "No users found" });
      }
      // Send the array of documents as the response
      res.json({
        success: true,
        data: allUsers.map((user) => ({
          Name: user.Name,
          Email: user.Email,
          MobileNo: user.Mobileno,
          Role: user.Role,
          Permissions: user.Permissions,
          UserStatus: user.Userstatus,
        })),
      });
  
      console.log("Data Transfered");
    } else if(user.Role==='user') {
      const allUsers = await User.find();
      // Check if there are any documents
      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({ success: false, message: "No users found" });
      }
      // Send the array of documents as the response
      res.json({
        success: true,
        data: allUsers.map((user) => ({
          Name: user.Name,
          Email: user.Email,
          MobileNo: user.Mobileno,
          Role: user.Role,
          Permissions: user.Permissions,
          UserStatus: user.Userstatus,
        })),
      });
  
      console.log("Data Transfered");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the data",
    });
  }
};

// const logInUserwithToken = async (req, res) => {
//   try {
//     // Fetch all documents from the User collection
//     const allUsers = await User.find();

//     // Check if there are any documents
//     if (!allUsers || allUsers.length === 0) {
//       return res.status(404).json({ success: false, message: "No users found" });
//     }

//     // Send the array of documents as the response
//     res.json({
//       success: true,
//       data: allUsers.map((user) => ({
//         Name: user.Name,
//         Email: user.Email,
//         MobileNo: user.Mobileno,
//         Role: user.Role,
//         Permissions: user.Permissions,
//         UserStatus: user.Userstatus,
//       })),
//     });

//     console.log("Data Transfered");
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while retrieving the data",
//     });
//   }
// };

const UserServices = {
  addUser,
  logInUser,
  logInUserwithToken,
};

export default UserServices;
