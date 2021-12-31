var mc = require('mc');
var client = new mc.Client();

var setMemcachedKey = function(keyName,valueObject) {
  client.connect(function() {
    console.log("Connected to the localhost memcache on port 11211!");
    client.set( keyName, valueObject, { flags: 0, exptime: 0}, function(err, status) {
    if (!err) {
        console.log(status); // 'STORED' on success!
      }
    });
    client.disconnect();
  });
}

var getMemcachedValue = function(keyName) {
  return new Promise(function(resolve,reject) {
    client.connect(function() {
      console.log("Connected to the localhost memcache on port 11211!");
        client.get( keyName, function(err, response) {
          if (err) {
            reject(err);
          } else {
            var responseKey = response[keyName];
            client.disconnect();
            resolve(responseKey);
          }
        });
      });
  });
}

module.exports = {
  setMemcachedKey: setMemcachedKey,
  getMemcachedValue: getMemcachedValue
};
