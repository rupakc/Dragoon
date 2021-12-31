const fs = require('fs');

var appendToFile = function(fileNameOrPath,textToWrite) {
  fs.appendFileSync(fileNameOrPath,textToWrite);
};

var writeToFile = function(fileNameOrPath,textToWrite) {
  fs.writeFileSync(fileNameOrPath,textToWrite);
};

var readFromFile = function(fileNameOrPath) {
  return fs.readFileSync(fileNameOrPath,{ encoding: 'utf8' });
};

module.exports = {
  appendToFile: appendToFile,
  writeToFile: writeToFile,
  readFromFile: readFromFile
};
