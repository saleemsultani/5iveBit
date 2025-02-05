import chatModel from './chatModel';
import { tokenManager } from './tokenManager';
import userModel from './userModel';
import JWT from 'jsonwebtoken';

// create new chat
export const createChat = async (event, chatData) => {
  const { messages } = chatData;

  // check the login token (whether or not the user is loged in)
  const token = tokenManager.getToken();

  if (!token) {
    return { success: false, message: 'You are not logged in' };
  }

  //  decode the token to extract user ID
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decode._id;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if an empty chat already exists
    const existingChat = await chatModel.findOne({ user: userId, messages: { $size: 0 } });

    if (existingChat) {
      return {
        success: true,
        message: 'Existing empty chat found',
        chatId: existingChat._id.toString(),
        emptyChatExist: true,
        messages: []
      };
    }

    // Create a new chat if no empty chat exists
    const chat = await new chatModel({
      user: userId,
      messages: messages
    }).save();

    return {
      success: true,
      message: 'Chat created successfully',
      chatId: chat._id.toString(),
      messages: JSON.stringify(chat.messages)
    };
  } catch (error) {
    console.log('Error in creating chat:', error);
    return {
      success: false,
      message: 'Error in creating chat',
      error: error.message
    };
  }
};

// Get All chats
export const getAllChats = async () => {
  // check the login token (whether or not the user is loged in)
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not loged in' };
  }
  try {
    // decode the token to find userId
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decode._id;

    // Find all chats for the user
    const chats = await chatModel.find({ user: userId }).select('-user');

    if (chats) {
      return { success: true, message: 'Chats found successfully', chats: JSON.stringify(chats) };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error in getting chats',
      error
    };
  }
};

// update chat
export const updateChat = async (event, chatData) => {
  const { chatId, messages } = JSON.parse(chatData);

  // check the login token
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not logged in' };
  }

  try {
    // find the chat with it's id and update it
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return { success: false, message: 'Chat not found' };
    } else {
      // set chat messages to the messages passed by user and then save it
      chat.messages = messages;
      const res = await chat.save();
      console.log('this is update chat : ', res);
      return {
        success: true,
        message: 'Chat updated successfully',
        chatId: chatId,
        messages: JSON.stringify(chat.messages)
      };
    }
  } catch (error) {
    console.log('Error in updating chat:', error);
    return { success: false, message: 'Error in updating chat', error: error.message };
  }
};

// Delete Chat
export const deleteChat = async (event, chatId) => {
  // check the login token
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not logged in' };
  }
  try {
    // find the chat with it's id and delete it
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return { success: false, message: 'Chat not found' };
    } else {
      // delete the chat
      const res = await chat.deleteOne();
      console.log('this is delete chat : ', res);
      return {
        success: true,
        message: 'Chat deleted successfully'
      };
    }
  } catch (error) {
    console.log('Error in deleting chat:', error);
    return { success: false, message: 'Error in deleting chat', error: error.message };
  }
};
