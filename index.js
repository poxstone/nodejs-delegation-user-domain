'use strict';

var fs = require('fs');
var google = require('googleapis');
const PRIVATEKEY = require('./privatekey.json');
const EMAIL_DELEGATE = 'administrador@eforcers.com.co';
const SPREAD_SHEET_ID = '1qlzsDrSbXeuEgN0m4SJi8SDSgsXGmxhlZ514cgvhyCQ';
const SCOPES_ARRAY = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
const DRIVE_SEARCH_QUERY = "name contains 'Battle'";


let jwtClient = new google.auth.JWT(
  PRIVATEKEY.client_email,
  null,
  PRIVATEKEY.private_key,
  SCOPES_ARRAY,
  EMAIL_DELEGATE
);


jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});


function listMajors(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: SPREAD_SHEET_ID,
    range: 'Reg!A:B',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.dir(response.data.values);
    var rows = response.data.values[0];
  });
}

function getDrive(query) {
  let drive = google.drive('v3');

  return new Promise((resolve, reject) => {
    
    let fileDrive = drive.files.list({ auth: jwtClient, pageSize: 200, q:query }, (err, response) => {
  
      if (err) {
        console.log('The API returned an error: ' + err);
        reject(err);
        return;
      }
      
      if( !response.data || !response.data.files ) {
        console.warn('NO FILES FOUND');
        reject(response.data);
        return;
      }
  
      var files = response.data.files;
  
      if (files.length == 0) {
        console.warn('NO FILES FOUND');
      }    
  
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.name, file.id);
      }
  
      resolve(files);
  
    });

    console.log(fileDrive);

  });

}

function downloadItem(metafile) {
  let drive = google.drive('v3');
  var dest = fs.createWriteStream("./downloads/" + metafile.name);
  
  var fileDrive = drive.files.get({ fileId: metafile.id, alt: 'media' });
  fileDrive.on( 'error', err => {
    console.error('Error on download file');
    throw err;
    }
  )
  .pipe(dest);
  
  dest.on('finish', () => {
    console.log('File downloaded');
    process.exit();
  }).on('error', err => {
    console.error('Error writing file!');
    throw err;
  });

}

getDrive(DRIVE_SEARCH_QUERY).then((fileList) => {
  //console.log(fileList);
  console.dir(fileList);
  for( let i in fileList) {
    //downloadItem(fileList[i]);
  }

}).catch((error) => {
  console.error(error);
});


listMajors();

