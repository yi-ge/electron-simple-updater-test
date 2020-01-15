'use strict';

const { spawn } = require('child_process');
const express   = require('express');
const path      = require('path');

const app = express();

app.use('/updates', express.static(
  path.resolve(__dirname, '../v0.0.2/dist/publish')
));

app.get('/finish', (req, res) => {
  console.log('v2 is going to quit, pid', req.query.pid);
  console.log('Successfully updated, test is finished.');
  res.send('ok');
  process.exit();
});

// eslint-disable-next-line func-names
app.listen(3003, function () {
  console.log(`Listening on port ${this.address().port}.`);
  startAppImageV1();
});

function startAppImageV1() {
  const v1 = spawn('../v0.0.1/dist/appimage-0.0.1.AppImage', [], {
    env: { ...process.env, DESKTOPINTEGRATION: 1 },
    stdio: 'inherit',
  });

  v1.on('exit', () => console.log('v1 process is killed'));

  console.log('v1 process is started, pid', v1.pid);
}
