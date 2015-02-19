#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var program = require('commander');
var inquirer = require("inquirer");

var sizeTopicsJSON = require('./data/sizeTopics.json');


/** 
Menu Functions
  mainMenu(content)
  choose(content)
  download()

Command and argument 
  program.etc


**/
// Main program
//Command and arguments 
program
  .option('-f, --force-download', 'Forces download of all selected content, even if already cached')
  .option('-i, --input-file [file]', 'Specify an already-built output. Good for picking up where you left off')
  .option('-o, --output-file [file]', 'Specify where you should build the output file', "content.json")
  .parse(process.argv);

var rootKids = sizeTopicsJSON.children;
mainMenu([]);


// JSON Helper Functions

function getVals(arr, val) {
  var vals = [];
  for(var i = 0, l = arr.length; i < l; i++) {
    vals.push(arr[i][val]);
  }
  return vals;
}

function objFromVal(arr, key, val) {
  for(var i = 0, l = arr.length; i < l; i++) {
    if (arr[i][key] === val) return arr[i] ;
  }
}

function objArrFromValArr(arr, key, valArr) {
  var objects = [];
  for(var i = 0, l = valArr.length; i < l; i++) {
    objects.push(objFromVal(arr, key, valArr[i]));
  }
  return objects;
}




// Menu Functions
function mainMenu(selection) {
  var selectionTitles = getVals(selection, 'title');
  console.log("Currently selected content: " + selectionTitles.join(', '));
  inquirer.prompt([
  {
    type: "list",
    name: "main",
    message: "Would you like to:",
    choices: [
        "Add more content to selection",
        "Download currently selected content",
        "Exit without downloading"
      ]
  },
  {
    type: "confirm",
    name: "writeFile",
    message: "Do you still want to create a content.json file? This might break things.",
    default: false,
    when: function( answers ) {
      return answers.main === "Exit without downloading";
    }

  }
], function( answers ) {
    if ( answers.main === "Add more content to selection" ) {
      add(selection, rootKids);
    } else if ( answers.main === "Download currently selected content" ) {
      download(selection);
    } else {
      if (answers.writeFile) console.log("lol not implemented yet");
    }
  });
}


// Adding content
// selection is an array of nodes
// input is an array of children nodes
function add(selection, input) {
  var selectionTitles = getVals(selection, 'title');
  var line = new inquirer.Separator();
  var inputTitles = getVals(input, 'title');
  if (input[0]['id'] === 'math') {
    var inputChoose = inputTitles.concat([line,"Add (sub)category to selection","Back to main menu"]);
  } else {
    var inputChoose = inputTitles.concat([line,"Add (sub)category to selection","Back to root categories"]);
  }

  console.log("Current selection: " + selectionTitles.join('; '));
  inquirer.prompt([
    {
      type: "list",
      name: "choose",
      message: "Explore a (sub)category: ",
      choices: inputChoose
    },
    {
      type: "checkbox",
      name: "select",
      message: "Check all (sub)categories you'd like to add: ",
      choices: inputTitles,
      when: function( answers ) {
              return answers.choose === "Add (sub)category to selection";
            }
    }
  ], function( answers ) {
        var chosenObj = objFromVal(input, 'title', answers.choose);
        if ( answers.choose === "Back to main menu" ) {
          mainMenu(selection);
        } else if ( answers.choose === "Back to root categories" ) {
          add(selection, rootKids);
        } else if (answers.choose === "Add (sub)category to selection" ) {
          var selectArr = objArrFromValArr(input, 'title', answers.select); 
          selection.push.apply(selection, selectArr);
          console.log(); //New line for readability
          add(selection, rootKids);
        } else {
          if (!chosenObj.children[0].children) {
            console.log('Lowest subtopic reached!');
            add(selection, input);
          } else add(selection, chosenObj['children']);
        }
      }
  );
}

// Downloader Helper Functions
function downloadVideo(obj, dir, callback) {
    var url = obj['download_urls'].mp4;
    var title = obj.title;
    var dest = dir + obj.id + '.mp4'

    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        response.pipe(file);
        //percent downloaded
        file.on('data', function(chunk) {
          file.write(chunk);
          len += chunk.length;
          var percent = (len / file.headers['content-length']) * 100;
          console.log(title + ": " + percent + 'downloaded')
        });
        file.on('finish', function () {
            console.log(title + ' succesfully downloaded!');
            file.close(callback); // close() is async, call callback after close completes.
        });
        file.on('error', function (err) {
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (callback)
                callback(err.message);
        });
    });
}

function videosFromSelection(arr) {
  var videoArr = [];
  for(var i = 0, l = arr.length; i < l; i++) {
    if (arr[i].kind === 'Video') {
      videoArr.push(arr[i]);
    } else if (arr[i].children) {
      videoArr.push.apply(videoArr, videosFromSelection(arr[i].children));
    }
  }
  return videoArr;
}


// The actual downloader
function download(selection) {
  var videos = videosFromSelection(selection);
  console.log("Downloading " + getVals(selection, 'title').join('; '));

  for(var i = 0, l = videos.length; i < l; i++) {
    downloadVideo(videos[i], 'cache/');
  }
}




