#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var program = require('commander');
var inquirer = require("inquirer");

var sizeTopicsJSON = require('./data/sizeTopics.json');
var rootKids = sizeTopicsJSON.children;

var testSelection = sizeTopicsJSON.children[0].children[0];


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
  .option('-s, --selection', 'Plug in a selection arr, good for testing')
  .parse(process.argv);


if (program.selection) {
  mainMenu([testSelection]);
} else mainMenu([]);


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
    message: "Do you still want to create a dummy harp install? This might break things.",
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
      createHarp(selection);
    } else {
      if (answers.writeFile) createHarp(selection);
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
    inputChoose = inputTitles.concat([line,"Add (sub)category to selection","Back to main menu"]);
  } else {
    inputChoose = inputTitles.concat([line,"Add (sub)category to selection","Back to root categories"]);
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
          if (chosenObj['ancestor_ids'].length > 3) {
            console.log('Lowest subtopic reached!');
            add(selection, input);
          } else add(selection, chosenObj['children']);
        }
      }
  );
}






// Downloading and Writing Files


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


// Downloader Helper Functions
function downloadVideo(obj, dir, callback) {
    var url = obj['download_urls'].mp4;
    var title = obj.title;
    var dest = dir + obj.id + '.mp4'

    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            console.log(title + ' succesfully downloaded!');
            file.close(callback); // close() is async, call callback after close
        });
        file.on('error', function (err) {
          fs.unlink(dest); // Delete the file async. (But don't check result)
          if (callback) callback(err.message);
        });
    });
}



// Downloader
function download(selection) {
  var videos = videosFromSelection(selection);
  console.log("Downloading " + getVals(selection, 'title').join('; '));

  for(var i = 0, l = videos.length; i < l; i++) {
    downloadVideo(videos[i], 'cache/');
  }
}



// Desc Writing Helper Function
function writeVideoDesc(obj, dir, callback) {
  var desc = obj.description;
  var slug = obj.slug;
  var parentsdir = obj['ancestor_ids'].slice(3);
  var parentPath = dir + parentsdir.join('/')
  var oFile = parentPath + '/' + slug + '.md';

  // Quick hack to make dirs
  for(var i = 1, l = 4; i < l; i++) {
    makeDir = dir + parentsdir.slice(0,i).join('/');
    if (!fs.existsSync(makeDir)) fs.mkdirSync(makeDir);
  }

  fs.writeFile(oFile, desc, function(err) {
    if(err) {
      console.log(err);
    } else {
      //console.log(obj.title  + " description saved to " + oFile);
    }
  });
}


// Desc Writer
function writeSelectionDesc(selection) {
  var videos = videosFromSelection(selection);
  console.log("Writing " + getVals(selection, 'title').join('; '));

  for(var i = 0, l = videos.length; i < l; i++) {
    writeVideoDesc(videos[i], 'harp/');
  }
}



// Turns selection into an Arr of topicObj with topicObj kids 
// who each have of videoObj kids. So videoParentParents 
function vPPsFromSelection(arr) {
  var videoParentParents = [];
  for(var i = 0, l = arr.length; i < l; i++) {
    if (arr[i].ancestor_ids.length === 3) {
      videoParentParents.push(arr[i]);
    } else if (arr[i].children) {
      videoParentParents.push.apply(videoParentParents, vPPsFromSelection(arr[i].children));
    }
  }
  return videoParentParents;
}


function writeData(obj, dir, callback) {
  var dataFile = dir + obj.id + '/_data.json';
  
  fs.writeFile(dataFile, JSON.stringify(obj, null, 2), function(err) {
    if(err) console.log('writeData ' + err);
    else {
      console.log("_data.json added to " + dataFile);
    }
  });
}


// Writing the selection to data.json
function writeDataJSON(selection) {
  var vpp = vPPsFromSelection(selection);
  console.log("Writing " + getVals(selection, 'title').join('; '));

  for(var i = 0, l = vpp.length; i < l; i++) {
    writeData(vpp[i], 'harp/');
  }
}



// Create harp template
function createHarp(selection) {
  writeSelectionDesc(selection);
  writeDataJSON(selection);
  //console.log('Writing the json is still broken :/')

}



















