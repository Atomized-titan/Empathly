import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: 'text'
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  gender: String,
  feelings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feeling',
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  termsAccepted: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
