var topicsJSON = require('./data/topics.json');
var languageMappings = require('./data/dubbed_video_mappings.json');
var videosSize = require('./data/video_file_sizes.json');


// JSON parsing helper functions

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




// Creating new objects
var newTopicObject = {
  "id": "",
  "title": "",
  "description": "",
  "size": 0,
  "children": [],
}

var newVideoObject = {
  "id": "",
  "title": "",
  "description": "",
  "kind": "Video",
  "slug": "",
  "duration": 0,
  "size": 0,
  "download_urls": {
    "mp4": "",
    "png": "",
    "m3u8": ""
  },
  "ancestor_ids": []
}



function makeNewObject(old) {
  var newObject = new Object();
  newObject.id = old.id;
  newObject.title = old.title;
  newObject.description = old.description;
  if (old.children) newObject.children = old.children.map(makeNewObject);
  
  //newTopic.size = topicSize(old.children);
  return newObject;
}



var ROOT = topicsJSON;

console.log(makeNewObject(ROOT));




/**
Functions needed


Eventual data structure
{
  "id": "root",
  "title": "Khan Academy",
  "description": "",
  "children": [
    {
      "id": "humanities",
      "title": "Humanities",
      "description": "",
      "children": [
        {
          "id": "history",
          "title": "World history",
          "description": "blah",
          "size": "xxx//new from children of children of children",
          "children": [
            {
              "id": "euro-hist",
              "title": "1900 - present: The recent past",
              "description": "Blahblah",
              "size": "xxx//new from children of children",
              "children": [
                {
                  "id": "world-war-I-tutorial",
                  "title": "Beginning of World War I",
                  "description": "blahblahblah",
                  "size": "xxx//new from children",
                  "children": [
                    {
                      "id": "IyoUWRAharQ",
                      "title": "Empires before World War I",
                      "description": "blhablahblahblah",
                      "kind": "Video",
                      "slug": "empires-before-world-war-i",
                      "duration": 457,
                      "size": "xxxx//new value",
                      "download_urls": {
                        "mp4": "http://s3.amazonaws.com/KA-youtube-converted/IyoUWRAharQ.mp4/IyoUWRAharQ.mp4",
                        "png": "http://s3.amazonaws.com/KA-youtube-converted/IyoUWRAharQ.mp4/IyoUWRAharQ.png",
                        "m3u8": "http://s3.amazonaws.com/KA-youtube-converted/IyoUWRAharQ.m3u8/IyoUWRAharQ.m3u8"
                      },
                      "ancestor_ids": [
                        "root",
                        "humanities",
                        "history",
                        "euro-hist",
                        "world-war-I-tutorial"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}





/*8
function makeNewTopic(old) {
  if (old['ancestor_ids'].length < 5) {
    var newTopic = new Object();
    newTopic.id = old.id;
    newTopic.title = old.title;
    newTopic.description = old.description;
    var newKids = [];
    for(var i = 0, l = old.children.length; i < l; i++) {
      newKids.push(makeNewTopic(old.children[i]));
    }
    newTopic.children = makeNewTopic(old.children[0]);
    //newTopic.size = topicSize(old.children);
    return newTopic;
  } else {
    makeNewVideo(old);
  }
}



function makeNewVideo(old) {
  if (old['kind'] === "Video") {
    var newV = new Object();
    newV.id = old.id;
    newV.title = old.title;
    newV.description = old.description;
    newV.kind = old.kind;
    newV.slug = old.slug;
    newV.duration = old.duration;
    //newVideo.size = findSize(old.id);
    newV.download_urls = old.download_urls;
    newV.ancestor_ids = old.ancestor_ids;

    return newV;
  }
}
*/












