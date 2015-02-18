var inquirer = require("inquirer");


var topicsJSON = require('./data/topics.json');
var languageMappings = require('./data/dubbed_video_mappings.json');
var videosSize = require('./data/video_file_sizes.json');



// JSON parsing



function getChildren(data) {
  var kids = [];
  for(var i = 0, l = data.children.length; i < l; i++) {
    kids.push(data['children'][i]);
  }
  return kids;
}

function getTitles(data) {
  var titles = [];
  for(var i = 0, l = data.length; i < l; i++) {
    titles.push(data[i]['title']);
  }
  return titles;
}

function objectByTitle(data, title) {
  for(var i = 0, l = data.length; i < l; i++) {
    if (data[i]['title'] === title) return data[i] ;
  }
}

function objectByID(data, id) {
  for(var i = 0, l = data.length; i < l; i++) {
    if (data[i]['id'] === id) return data[i] ;
  }
}


function getParent(children) {
  var path = children[0]["ancestor_ids"].slice(1,-1)
  console.log(path);
  function acc(IDs, obj) {
    if (IDs.length > 0) {
      var nextChildIDs = IDs.slice(1);
      return acc(nextChildIDs, objectByID(getChildren(obj), IDs[0]));
    } else return obj;
  }
  return acc(path, ROOT);
}


function getX(arr, string) {
  var arrX = [];
  for(var i = 0, l = arr.length; i < l; i++) {
    arrX.push(arr[i][string]);
  }
  return arrX;
}

function getSize(node) {
  var sum = 0;
  if (node.kind === 'Video') {
    sum += videosSize[node.id];
  } else {
    for(var i = 0, l = node['children'].length; i < l; i++) {
      sum += getSize(node['children'][i]);
    }
  }
  return sum; 
}

function addSize(node) {
  node.size = getSize(node);
  return node;
}

function addSizes(arr) {
  var newArr = [];
  for(var i = 0, l = arr.length; i < l; i++) {
    newArr.push(addSize(arr[i]));
  }
  return newArr;
}


var ROOT = topicsJSON

var level1 = getChildren(ROOT);
//console.log(getTitles(level1));

var level2humanities = getChildren(objectByTitle(getChildren(ROOT), 'Humanities'));
//console.log(getTitles(level2humanities));

var level3worldhistory = getChildren(objectByTitle(level2humanities, 'World history'));
//console.log(getTitles(level3worldhistory));

var level4survey = getChildren(objectByTitle(level3worldhistory, 'Surveys of history'));
//console.log(getTitles(level4survey));

var level5obj = objectByTitle(level4survey, 'United States history overview');

var level5us = getChildren(objectByTitle(level4survey, 'United States history overview'));
//console.log(getTitles(level5us));

//console.log(getParent(level5us));

//console.log(getSize(level5obj));

console.log(addSizes(level4survey));

