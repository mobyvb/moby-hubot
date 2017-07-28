var fs = require('fs');
var readableStream = fs.createReadStream('callresponse.txt');
var data = '';

readableStream.on('data', function(chunk) {
  data += chunk;
});

readableStream.on('end', function() {
  var callResponses = data.split('call\n').splice(1);
  var fd = fs.openSync('../scripts/data/callresponse.js', 'w');
  fs.appendFileSync(fd, 'module.exports = [\n');

  for (var i=0; i<callResponses.length; i++) {
    var callResponsePair = callResponses[i].split('response\n');

    var nextJson = '{\n\tregex: ';
    nextJson += callResponsePair[0].replace('\n', '');
    nextJson += ',\n\tresponse: \'';
    nextJson += callResponsePair[1].replace(/\n/g, '\\n').replace(/  /g, '\\t').replace(/'/g, '\\\'');
    nextJson += '\'\n}';
    if (i < callResponses.length-1) {
      nextJson += ',';
    }
    nextJson += '\n';

    fs.appendFileSync(fd, nextJson);
  }

  fs.appendFileSync(fd, '];');
  fs.closeSync(fd);
});
