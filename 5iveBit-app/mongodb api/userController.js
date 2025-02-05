import userModel from './userModel';
import { comparePassword, hashPassword } from './authHelper';
import JWT from 'jsonwebtoken';
import { tokenManager } from './tokenManager';
import chatModel from './chatModel';

// Register a new user
export const registerController = async (event, userData) => {
  try {
    // parse the data passed by user
    const { firstName, lastName, email, password, subscribe } = JSON.parse(userData);

    //validations
    if (!firstName) {
      return { success: false, message: 'First name is Required' };
    }
    if (!lastName) {
      return { success: false, message: 'Last name is Required' };
    }
    if (!email) {
      return { success: false, message: 'Email is Required' };
    }
    if (!password) {
      return { success: false, message: 'Password is Required' };
    }

    //check user validation
    const exisitingUser = await userModel.findOne({ email });
    //Check if the user already exist (i.e user is already registered)
    if (exisitingUser) {
      return {
        success: false,
        message: 'Already Register please login'
      };
    }

    // encrypt the password before saving it to database
    const hashedPassword = await hashPassword(password);
    //register the user
    const user = await new userModel({
      firstName,
      lastName,
      email,
      subscribe,
      password: hashedPassword
    }).save();

    return {
      success: true,
      message: 'User Register Successfully',
      user: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        subscribe: user.subscribe,
        id: user._id
      })
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Errro in Registeration',
      error
    };
  }
};

// LOGIN User
export const loginController = async (event, userData) => {
  try {
    const { email, password } = userData;

    //validation
    // check if email and password are provided
    if (!email || !password) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    //check whether user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'Email is not registerd'
      };
    }
    //check whether password is correct
    const match = await comparePassword(password, user.password);
    if (!match) {
      return {
        success: false,
        message: 'Invalid Password'
      };
    }

    //Set a login Token and then save it
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET);

    tokenManager.saveToken(token); //store the token

    return {
      success: true,
      message: 'login successfully',
      user: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        subscribe: user.subscribe,
        id: user._id
      }),
      token
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error in login',
      error
    };
  }
};

// log out
export const logoutController = async () => {
  try {
    // check for the token(i.e whether the user is logged in)
    const token = tokenManager.getToken();

    // if the token exists then delete the login token
    if (token) tokenManager.deleteToken(token);
    return {
      success: true,
      message: 'logout successfully'
    };
  } catch (error) {
    console.log('error in logout');
  }
};

// check if user is log in
export const isLogin = async () => {
  // check for the token
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not loged in' };
  }

  // decode the token with user's id to extract user data
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode._id);

    // return all the necessary user related data
    return {
      success: true,
      user: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        subscribe: user.subscribe,
        id: user._id
      }),
      token
    };
  } catch (error) {
    tokenManager.deleteToken(); // Clear invalid token
    return { success: false, message: 'Invalid token' };
  }
};

// update password
export const updatePasswordController = async (event, userData) => {
  try {
    const { currentPassword, newPassword, email } = userData;
    // check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'Invalid email'
      };
    }

    // check the provided current password with user current password
    const match = await comparePassword(currentPassword, user.password);
    if (!match) {
      return {
        success: false,
        message: 'Invalid current password'
      };
    }

    // check if updated password is same as current password
    if (await comparePassword(newPassword, user.password)) {
      return {
        success: false,
        message: 'Password is same'
      };
    }

    // encrypt the password before saving it to Data base
    const hashedPassword = await hashPassword(newPassword);

    //update password
    user.password = hashedPassword;
    await user.save();
    return {
      success: true,
      message: 'Password updated successfully',
      user: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        subscribe: user.subscribe,
        id: user._id
      })
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error in updating password',
      error
    };
  }
};

// Delete User
export const deleteUserController = async () => {
  // check if user is loged in
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'Unauthorized: Please log in' };
  }

  try {
    // decode the token to extract user's id
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decode._id;
    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Delete all chats associated with the user
    await chatModel.deleteMany({ user: userId });
    console.log('Deleting chats associated with User');

    //delete the user
    await userModel.findByIdAndDelete(userId);

    // log the user out
    tokenManager.deleteToken();

    return { success: true, message: `User and it's associated chats deleted` };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Error deleting user', error: error.message };
  }
};
