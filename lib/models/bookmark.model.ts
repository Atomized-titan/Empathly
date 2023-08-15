import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feeling: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feeling',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bookmark =
  mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
