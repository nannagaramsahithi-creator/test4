import mongoose from 'mongoose';

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the found item name'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      default: 'Electronics',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    dateFound: {
      type: String,
      trim: true,
      default: '',
    },
    timeFound: {
      type: String,
      trim: true,
      default: '',
    },
    locationFound: {
      type: String,
      required: [true, 'Please specify where the item was found'],
      trim: true,
    },
    custody: {
      type: String,
      trim: true,
      default: 'Campus Safety / Circulation Desk',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['found', 'matched', 'claimed', 'recovered'],
      default: 'found',
    },
  },
  {
    timestamps: true,
  }
);

const FoundItem = mongoose.model('FoundItem', foundItemSchema);

export default FoundItem;
