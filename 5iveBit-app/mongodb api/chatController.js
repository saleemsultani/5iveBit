import chatModel from './chatModel';
import { tokenManager } from './tokenManager';
import userModel from './userModel';
import JWT from 'jsonwebtoken';

export const createChat = async (event, chatData) => {
  const { messages } = chatData;
  const token = tokenManager.getToken();

  if (!token) {
    return { success: false, message: 'You are not logged in' };
  }

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

export const getAllChats = async () => {
  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not loged in' };
  }
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decode._id;
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

  const token = tokenManager.getToken();
  if (!token) {
    return { success: false, message: 'You are not logged in' };
  }

  try {
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return { success: false, message: 'Chat not found' };
    } else {
      chat.messages = messages;
      await chat.save();
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
