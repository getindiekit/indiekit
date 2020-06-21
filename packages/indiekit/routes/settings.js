import express from 'express';
import * as settingsController from '../controllers/settings.js';
import * as validate from '../middleware/validation.js';

const router = express.Router(); // eslint-disable-line new-cap

// Settings
router.get('/', settingsController.viewAll);

// Application settings
router.get('/application', settingsController.editApplication);
router.post('/application', settingsController.saveApplication);

// Publication settings
router.get('/publication', settingsController.editPublication);
router.post('/publication', validate.publicationSettings, settingsController.savePublication);

// Content store settings
router.get('/:storeId(github|gitlab)', settingsController.editStore);

// Content store settings: GitHub
router.post('/github', validate.githubSettings, settingsController.saveGithub);

// Content store settings: GitLab
router.post('/gitlab', validate.gitlabSettings, settingsController.saveGitlab);

export const settingsRoutes = router;
