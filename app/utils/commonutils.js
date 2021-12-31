var request = require('request');
var memcached = require('../db/memcachedconnector');
var serialize = require('serialize-javascript');
var constants = require('../../config/constants');
const fs = require('fs');
const path = require('path');

var getPromise = function (options) {
  return new Promise(function(resolve, reject) {
    request(options,function(error,response,body) {
        if (error){
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
    });
  });
}


var downloadImageFromUrl = function(url,downloadedFilename) {
  let options = {
      url: url,
      encoding: 'binary'
  };
  return new Promise(function(resolve, reject) {
    request(options,function(error,response,body) {
        if (error){
          reject(error);
        } else {
          fs.writeFileSync(downloadedFilename,body,'binary');
          resolve(200);
        }
    });
  });
};

var downloadImageListFromUrl = function(imageNameUrlMap) {
  downloadsFolder = constants.downloadFolderPath;
  let imageFilenameList = Object.keys(imageNameUrlMap);
  let imagePromiseList = [];
  for (var i = 0; i < imageFilenameList.length; i++) {
    imagePromiseList.push(downloadImageFromUrl(imageNameUrlMap[imageFilenameList[i]], downloadsFolder + imageFilenameList[i]));
  }
  return new Promise(function(resolve, reject) {
    Promise.all(imagePromiseList).then(function(resultList) {
      resolve(resultList);
    }, function(error) {
      reject(error);
    });
  });
};

var serializeObject = function(javaScriptObject) {
  return serialize(javaScriptObject);
}

var deserialize = function (serializedJavascript) {
  return eval('(' + serializedJavascript + ')');
}

var serializeAndStoreObject = function(keyName,javascriptObject) {
  var serializedObject = serializeObject(javascriptObject);
  memcached.setMemcachedKey(keyName,serializedObject);
}


var deleteAllFilesInDirectory = function(directoryNameOrPath) {
  return new Promise(function(resolve, reject) {
    fs.readdir(directoryNameOrPath, function(error, files) {
      if (error) {
        reject(error);
      }
      for (const file of files) {
        fs.unlink(path.join(directoryNameOrPath, file), function (error) {
          if (error) {
            reject(error);
          }
        });
      }
      resolve(200);
    });
  });
};

module.exports = {
  getPromise: getPromise,
  deserialize: deserialize,
  serializeObject: serializeObject,
  serializeAndStoreObject: serializeAndStoreObject,
  downloadImageListFromUrl: downloadImageListFromUrl,
  deleteAllFilesInDirectory: deleteAllFilesInDirectory
};
