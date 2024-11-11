import express from 'express';
import SavedHotel from '../models/SavedHotel'; 
import Hotel from '../models/hotel'; 
import { SavedHotelType } from '../../shared/types'; 
import verifyToken from '../middleware/auth';

const router = express.Router();

// Apply verifyToken middleware to protect all routes
router.use(verifyToken);

// GET /api/saved-hotels
router.get('/', async (req, res) => {
  try {
    const savedHotels = await SavedHotel.find({ userId: req.userId }).populate('hotelId');
    res.json(savedHotels); 

  } catch (error) {
    console.error('Error fetching saved hotels:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/saved-hotels/:hotelId
router.post('/:hotelId', async (req, res) => {
  const { hotelId } = req.params;
  const userId = req.userId;
  try {
    const existingSavedHotel = await SavedHotel.findOne({ userId, hotelId });
    if (existingSavedHotel) {
      return res.status(400).json({ message: 'Hotel already saved' }); 
    }

    const hotel = await Hotel.findById(hotelId); 
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const newSavedHotel: SavedHotelType = {
      userId,
      hotelId,
      lastUpdated: new Date(),
      ...req.body,
    };

    const savedhotel = new SavedHotel(newSavedHotel);
    await savedhotel.save(); 

    res.status(201).json({ message: 'Hotel saved successfully' }); 
  } catch (error) {
    console.error('Error saving hotel:', error);
    res.status(500).json({ message: 'Server Error' }); 
  }
});

// DELETE /api/saved-hotels/:hotelId
router.delete('/:hotelId', async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid Hotel ID format' });
  }

  try {
    const result = await SavedHotel.findOneAndDelete({ userId: req.userId, hotelId });
    if (!result) {
      return res.status(404).json({ message: 'Saved hotel not found' });
    }
    res.json({ message: 'Hotel removed from saved list' }); 
  } catch (error) {
    console.error('Error removing hotel:', error);
    res.status(500).json({ message: 'Server Error' }); 
  }
});

export default router;
