import mongoose from 'mongoose';

const feelingSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  // feeling recursion so that a feeling can have feelings - lol
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feeling',
    },
  ],
});

const Feeling =
  mongoose.models.Feeling || mongoose.model('Feeling', feelingSchema);

export default Feeling;
