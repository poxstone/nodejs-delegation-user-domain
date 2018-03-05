var fs = require('fs');
var {google} = require('googleapis');
let drive = google.drive('v3');
var file = '1XkZBcMYryIlqlo9Ib3S6BdqMSORrNXFh';
var mime = 'image/jpeg';

function listFiles(auth) {
  var outputExtension = "jpg"; // Extension of output file. This is adapted to only Google Docs.

  var drive = google.drive('v3');
  drive.files.list({
    auth: auth,
    q: "name contains 'Battle'",
    fields: "files(name)"
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    response.files.forEach(function (e) {
      if (e.mimeType.includes("application/vnd.google-apps")) {
        var dlfile = fs.createWriteStream(e.name + "." + outputExtension);
        drive.files.export({
          auth: auth,
          fileId: e.id,
          mimeType: mime
        }).on('end', function () {
          console.log("'%s' was downloaded as %s.", e.name, outputExtension);
        }).on('error', function (err) {
          console.error(err);
          return process.exit();
        }).pipe(dlfile);
      } else {
        var dlfile = fs.createWriteStream(e.name);
        drive.files.get({
          auth: auth,
          fileId: e.id,
          alt: 'media'
        }).on('end', function () {
          console.log("'%s' was downloaded as %s.", e.name, mime.extension(e.mimeType));
        }).on('error', function (err) {
          console.error(err);
          return process.exit();
        }).pipe(dlfile);
      }
    });
  });
}

listFiles();