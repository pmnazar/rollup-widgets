const rimraf = require('rimraf');

function asyncRimRaf(filepath) {
  return new Promise((resolve, reject) =>
    rimraf(filepath, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    })
  );
}

module.exports = {
  asyncRimRaf
};