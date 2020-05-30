import express from 'express';
import * as settings from '../controllers/settings.js';
import * as validate from '../middleware/validation.js';

const router = express.Router(); // eslint-disable-line new-cap

// Settings
router.get('/', settings.viewAll);

// Application settings
router.get('/application', settings.editApplication);
router.post('/application', settings.saveApplication);

// Publication settings
router.get('/publication', settings.editPublication);
router.post('/publication', validate.publicationSettings, settings.savePublication);

// Content host settings
router.get('/:hostId(github|gitlab)', settings.editHost);

// Content host settings: GitHub
router.post('/github', validate.githubSettings, settings.saveGithub);

// Content host settings: GitLab
router.post('/gitlab', validate.gitlabSettings, settings.saveGitlab);

export const settingsRoutes = router;
