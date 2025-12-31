// server/controllers/slamController.js
const SlamEntry = require('../models/Slam.js');

// Very small helper to trim and strip basic HTML tags
const cleanText = (value = '') => {
  const trimmed = String(value).trim();
  return trimmed.replace(/<\/?[^>]+(>|$)/g, '');
};

// Create a new entry
exports.createEntry = async (req, res, next) => {
  try {
    const rawFriendName = req.body.friendName;
    const rawMessage = req.body.message;

    const friendName = cleanText(rawFriendName);
    const message = cleanText(rawMessage);

    if (!friendName || !message) {
      return res
        .status(400)
        .json({ error: 'Both name and message are required.' });
    }

    if (friendName.length > 80) {
      return res
        .status(400)
        .json({ error: 'Name is a bit too long. Keep it under 80 characters.' });
    }

    // Multer adds file info to req.files if uploaded
    // Cloudinary returns URLs in the 'path' property or 'secure_url'
    let audioUrl = null;
    let doodleUrl = null;

    if (req.files) {
      console.log('📁 Files received:', {
        hasFiles: !!req.files,
        fileKeys: Object.keys(req.files),
        audioCount: req.files['audio']?.length || 0,
        doodleCount: req.files['doodle']?.length || 0,
      });

      // Log all file properties for debugging
      if (req.files['audio'] && req.files['audio'][0]) {
        const audioFile = req.files['audio'][0];
        console.log('🎵 Audio file properties:', Object.keys(audioFile));
        console.log('🎵 Audio file details:', {
          fieldname: audioFile.fieldname,
          originalname: audioFile.originalname,
          encoding: audioFile.encoding,
          mimetype: audioFile.mimetype,
          size: audioFile.size,
          path: audioFile.path,
          url: audioFile.url,
          secure_url: audioFile.secure_url,
        });
        // multer-storage-cloudinary stores the Cloudinary URL in the 'path' property
        audioUrl = audioFile.secure_url || audioFile.url || audioFile.path;
        
        // Ensure the URL is a valid HTTP(S) URL
        if (audioUrl && !audioUrl.startsWith('http')) {
          if (audioFile.secure_url) {
            audioUrl = audioFile.secure_url;
          } else if (audioFile.url) {
            audioUrl = audioFile.url;
          }
        }
        
        console.log('✅ Audio URL extracted:', audioUrl);
      }
      if (req.files['doodle'] && req.files['doodle'][0]) {
        const doodleFile = req.files['doodle'][0];
        console.log('🖊️ Doodle file properties:', Object.keys(doodleFile));
        console.log('🖊️ Doodle file details:', {
          fieldname: doodleFile.fieldname,
          originalname: doodleFile.originalname,
          encoding: doodleFile.encoding,
          mimetype: doodleFile.mimetype,
          size: doodleFile.size,
          path: doodleFile.path,
          url: doodleFile.url,
          secure_url: doodleFile.secure_url,
        });
        // multer-storage-cloudinary stores the Cloudinary URL in the 'path' property
        // Try all possible URL properties
        doodleUrl = doodleFile.secure_url || doodleFile.url || doodleFile.path;
        
        // Ensure the URL is a valid HTTP(S) URL
        if (doodleUrl && !doodleUrl.startsWith('http')) {
          // If it's not a full URL, it might be a Cloudinary public_id
          // In that case, we need to construct the full URL
          console.warn('⚠️ Doodle URL is not a full URL:', doodleUrl);
          // Try to get the secure_url from the full response
          if (doodleFile.secure_url) {
            doodleUrl = doodleFile.secure_url;
          } else if (doodleFile.url) {
            doodleUrl = doodleFile.url;
          }
        }
        
        console.log('✅ Doodle URL extracted:', doodleUrl);
        console.log('✅ Doodle URL type:', typeof doodleUrl);
        console.log('✅ Doodle URL starts with http:', doodleUrl?.startsWith('http'));
      } else {
        console.log('⚠️ No doodle file found in request');
      }
    } else {
      console.log('⚠️ No files object in request');
    }

    const mood = req.body.mood || 'classic';
    const validMoods = ['nostalgic', 'funny', 'heartfelt', 'adventurous', 'classic'];
    const finalMood = validMoods.includes(mood) ? mood : 'classic';

    // Clean and store all individual fields
    const newEntry = new SlamEntry({
      friendName,
      nickname: cleanText(req.body.nickname) || null,
      // Personal & Emotional
      firstMemory: cleanText(req.body.firstMemory) || null,
      favouriteThing: cleanText(req.body.favouriteThing) || null,
      oneWord: cleanText(req.body.oneWord) || null,
      wish: cleanText(req.body.wish) || null,
      bestMemory: cleanText(req.body.bestMemory) || null,
      whatMakesMeLaugh: cleanText(req.body.whatMakesMeLaugh) || null,
      // Favorites
      favoriteHero: cleanText(req.body.favoriteHero) || null,
      favoriteSong: cleanText(req.body.favoriteSong) || null,
      favoriteSinger: cleanText(req.body.favoriteSinger) || null,
      favoriteMovie: cleanText(req.body.favoriteMovie) || null,
      favoriteFood: cleanText(req.body.favoriteFood) || null,
      favoriteColor: cleanText(req.body.favoriteColor) || null,
      // Dreams & Future
      dreamDestination: cleanText(req.body.dreamDestination) || null,
      futurePrediction: cleanText(req.body.futurePrediction) || null,
      // Final message
      message,
      audioUrl,
      doodleUrl,
      mood: finalMood,
    });

    const savedEntry = await newEntry.save();
    
    // Log saved entry for debugging
    console.log('Entry saved:', {
      id: savedEntry._id,
      name: savedEntry.friendName,
      hasAudio: !!savedEntry.audioUrl,
      hasDoodle: !!savedEntry.doodleUrl,
      audioUrl: savedEntry.audioUrl,
      doodleUrl: savedEntry.doodleUrl,
    });
    
    res.status(201).json(savedEntry);
  } catch (error) {
    next(error);
  }
};

// Get all entries for the book
exports.getEntries = async (req, res, next) => {
  try {
    const entries = await SlamEntry.find().sort({ createdAt: -1 }).lean();
    
    // Ensure all entries have a mood field and log media URLs for debugging
    const entriesWithMood = entries.map((entry) => {
      const entryData = {
        ...entry,
        mood: entry.mood || 'classic',
      };
      
      // Log media URLs for debugging
      if (entry.doodleUrl || entry.audioUrl) {
        console.log(`Entry ${entry._id}:`, {
          hasDoodle: !!entry.doodleUrl,
          hasAudio: !!entry.audioUrl,
          doodleUrl: entry.doodleUrl,
          audioUrl: entry.audioUrl,
        });
      }
      
      return entryData;
    });
    
    res.status(200).json(entriesWithMood);
  } catch (error) {
    console.error('Error fetching entries:', error);
    next(error);
  }
};