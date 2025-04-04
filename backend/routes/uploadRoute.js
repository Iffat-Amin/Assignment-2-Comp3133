// routes/uploadRoute.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /upload
router.post('/upload', upload.single('profile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

  res.status(200).json({ imageUrl });
});


module.exports = router;

