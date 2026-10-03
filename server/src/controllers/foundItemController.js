import FoundItem from '../models/FoundItem.js';

// @desc    Create a new found item report
// @route   POST /api/found-items
// @access  Public
export const createFoundItem = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      brand,
      color,
      dateFound,
      timeFound,
      locationFound,
      custody,
      imageUrl,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Found item name/title is required',
      });
    }

    if (!locationFound || !locationFound.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Location where item was found is required',
      });
    }

    const foundItem = await FoundItem.create({
      title: title.trim(),
      category: category || 'Electronics',
      description: description ? description.trim() : '',
      brand: brand ? brand.trim() : '',
      color: color ? color.trim() : '',
      dateFound: dateFound ? dateFound.trim() : '',
      timeFound: timeFound ? timeFound.trim() : '',
      locationFound: locationFound.trim(),
      custody: custody ? custody.trim() : 'Campus Safety / Circulation Desk',
      imageUrl: imageUrl ? imageUrl.trim() : '',
      status: 'found',
    });

    res.status(201).json({
      success: true,
      message: 'Found item report created successfully',
      data: foundItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all found item reports
// @route   GET /api/found-items
// @access  Public
export const getFoundItems = async (req, res, next) => {
  try {
    const foundItems = await FoundItem.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: foundItems.length,
      data: foundItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single found item report by ID
// @route   GET /api/found-items/:id
// @access  Public
export const getFoundItemById = async (req, res, next) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: `Found item report not found with id ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: foundItem,
    });
  } catch (error) {
    next(error);
  }
};
