import userModel from './userModel';
import { comparePassword, hashPassword } from './authHelper';
import JWT from 'jsonwebtoken';
import { tokenManager } from './tokenManager';

export const registerController = async (event, userData) => {
  try {
    const { firstName, lastName, email, password, subscribe } = JSON.parse(userData);
    console.log('this is user data');
    console.log(userData);

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

    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return {
        success: false,
        message: 'Already Register please login'
      };
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
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

//POST LOGIN
export const loginController = async (event, userData) => {
  try {
    const { email, password } = userData;
    //validation
    if (!email || !password) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'Email is not registerd'
      };
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return {
        success: false,
        message: 'Invalid Password'
      };
    }
    // const JWT_SECRET = 'kjfoi093';
    //token
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
    const token = tokenManager.getToken();
    tokenManager.deleteToken(token);
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
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not loged in' };
  }

  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode._id);

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

    //update password
    const hashedPassword = await hashPassword(newPassword);
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
