#!/usr/bin/env node

var program = require('commander');
var inquirer = require("inquirer");

var topicsJSON = require('./data/topics.json');
var videosSize = require('./data/video_file_sizes.json');

/** 
Menu Functions
  mainMenu(content)
  choose(content)
  download()

Command and argument 
  program.etc


**/

// JSON Helper Functions


function getChildren(node) {
  var kids = [];
  for(var i = 0, l = node.children.length; i < l; i++) {
    kids.push(node['children'][i]);
  }
  return kids;
}

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
    objects.push(objectByKeyVal(arr, key, valArr[i]));
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
        "Remove content from selection",
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
      add(selection, ROOT);
    } else if ( answers.main === "Remove content from selection" ) {
      console.log('Not implemented yet, sorry');
      mainMenu(selection);
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
        if ( answers.choose === "Back to main menu" ) {
          mainMenu(selection);
        } else if ( answers.choose === "Back to root categories" ) {
          add(selection, ROOT);
        } else if (answers.choose === "Add (sub)category to selection" ) {
          selection.push.apply(selection, objFromVal(input, 'title', answers.select));
          add(selection, ROOT);
        } else {
          add(selection, getChildren(objFromVal(input, 'title', answers.choose))); //TODO: Parent
        }
      }
  );
}

// selection 
function download(selection) {
  console.log("Download " + getVals(selection, 'title').join('; '));
}


