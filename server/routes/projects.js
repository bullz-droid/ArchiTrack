const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.put('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);
router.post('/:id/upload', authMiddleware, upload.array('files'), projectController.uploadFiles);
router.get('/portfolio/:username', projectController.getPublicPortfolio);

module.exports = router;
