const fs = require('fs');

function writeJson(file, data){
  fs.writeFile(file, data, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
}

module.exports.writeJson = writeJson;
