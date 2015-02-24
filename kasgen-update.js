#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');

var topicsJSON = require('./data/topics.json');
var videosSize = require('./data/video_file_sizes.json');

//JSON helpers

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

//Command and arguments 
program
  .option('-f, --force-download', 'Forces download of all selected content, even if already cached')
  .option('-i, --input-file [file]', 'Specify an already-built output. Good for picking up where you left off')
  .option('-o, --output-file [file]', 'Specify where you should build the output file', "content.json")
  .parse(process.argv);


// Getting the size right
function getSize(node) {
  var sum = 0;
  if (node.size) {
    sum+= node.size;
  } else if (node.kind === 'Video') {
    sum += videosSize[node.id];
  } else if (node.kind !== 'Exercise') {
    //console.log(node.id);
    for(var i = 0, l = node['children'].length; i < l; i++) {
      sum += getSize(node['children'][i]);
    }
  }
  return sum; 
}

function addSizesRecur(node) {
  if (node.kind === 'Video') {
    node.size = videosSize[node.id];
  } else if (node.kind !== 'Exercise') {
    //console.log(node.id);
    for(var i = 0, l = node['children'].length; i < l; i++) {
      node['children'][i].size = getSize(node['children'][i]);
      node['children'][i] = addSizesRecur(node['children'][i]);
    }
  }
  return node; 
}

var contentObj = addSizesRecur(topicsJSON);
var contentJSON = JSON.stringify(contentObj, null, 2);


//Doing stuff
if (program.forceDownload || program.inputFile || program.outputFile) console.log('Options not implemented yet!');

fs.writeFile('./data/sizeTopics.json', contentJSON, function (err) {
  if (err) return console.log(err);
  console.log('sizes+topics >  ./data/sizeTopics.json');
});



