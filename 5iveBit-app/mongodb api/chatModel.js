import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // user field is a Reference to User model
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'] }, // Role must be 'user' or 'assistant'
      content: { type: String } // Message content
    }
  ]
});

const chatModel = mongoose.model('chats', chatSchema);

export default chatModel;
