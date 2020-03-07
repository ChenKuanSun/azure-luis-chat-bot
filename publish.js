var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../chatbottestnoluis5.zip');
var kuduApi = 'https://chatbottestnoluis5.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$chatbottestnoluis5';
var password = '6kD0R8PQQ0eHFfE4Hf8sqruphPe8vN05rYzbRHBaaAglFjtvZfmsDa9W9zYZ';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('chatbottestnoluis5 publish');
  } else {
    console.error('failed to publish chatbottestnoluis5', err);
  }
});