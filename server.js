import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {app} from './packages/app/index.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
