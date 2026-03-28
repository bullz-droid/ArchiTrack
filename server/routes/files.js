const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authMiddleware, fileController.getFiles);
router.post('/upload', authMiddleware, upload.single('file'), fileController.uploadFile);
router.post('/:id/share', authMiddleware, fileController.createSignedUrl);
router.delete('/:id', authMiddleware, fileController.deleteFile);

module.exports = router;
