```javascript
function saveImageFromURL(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        var r = request(uri).pipe(fs.createWriteStream(filename));
        r.on('close', callback);
    });
}
```

```javascript
// REF : https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);

    var client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }

    var request = client.get(url, function(response) {

        // check if response is success
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        response.pipe(file);

        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    });

    // check for request error too
    request.on('error', function (err) {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
};
```

```javascript
// Example 2 : https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
var Stream = require('stream').Transform;

var downloadImageToUrl = (url, filename, callback) => {

    var client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }

    client.request(url, function (response) {
        var data = new Stream();

        response.on('data', function (chunk) {
            data.push(chunk);
        });

        response.on('end', function () {
            fs.writeFile(filename, data.read(), 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        });
    }).end();
};
```

```javascript
// REF : https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
var fs = require('fs'),
http = require('http'),
https = require('https');

var Stream = require('stream').Transform;

var downloadImageToUrl = (url, filename, callback) => {

    var client = http;
    if (url.toString().indexOf("https") === 0){
      client = https;
     }

    client.request(url, function(response) {
      var data = new Stream();

      response.on('data', function(chunk) {
         data.push(chunk);
      });

      response.on('end', function() {
         fs.writeFileSync(filename, data.read());
      });
   }).end();
};

downloadImageToUrl('https://www.google.com/images/srpr/logo11w.png', 'public/uploads/users/abc.jpg');
```

```
// REF : https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs');

var url = 'http://www.google.com/images/srpr/logo11w.png';

http.request(url, function(response) {
  var data = new Stream();

  response.on('data', function(chunk) {
    data.push(chunk);
  });

  response.on('end', function() {
    fs.writeFileSync('image.png', data.read());
  });
}).end();
```

```
// Set the headers
var headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    //url: '/',
    method: 'POST',
    headers: headers
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log('TEST ====', body)
    }
});
```
