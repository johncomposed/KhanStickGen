
// Load topics and language file
var topics = require('./topics.json');
var languageMappings = require('./dubbed_video_mappings.json');
var videosSize = require('./video_file_sizes.json');

// Init count
var countTotal = 0;
var countVideo = 0;
var sizeVideo = 0;
var countExercice = 0;
var countTopic = 0;
var countMapped = 0;
var sizeMapped = 0;
var modeList = false;


// Look for a language mapping
function getMapping(mappings, language) {
  return mappings[language];
}

// Explore a node
function explore(node, level, mapping, language) {
  // Stats
  countTotal++;
  if (node.kind == 'Topic') countTopic++;
  else if (node.kind == 'Video') countVideo++;
  else if (node.kind == 'Exercise') countExercice++;
  
  // Display properties
  var line = '';
  var videoUrl = '';  
  for (var i = 0 ; i < level ; i++) line += '  ';
  if (node.kind == 'Video') {
    videoUrl = node.download_urls.mp4;
    sizeVideo += videosSize[node.id];
    line += 'Video: '+node.title+' '+videoUrl;
    if (mapping) {
      if (mapping[node.id]) {
        sizeMapped += videosSize[node.id];
        videoUrl = videoUrl.replace(new RegExp(node.id, 'g'), mapping[node.id]);
        line += videoUrl + ' ('+language+')';
        countMapped++;
      } else
        videoUrl = '';
    }
    line += ' ('+node.duration+'s)';
  }
  else if (node.kind == 'Exercise') {
    line += 'Exercice: '+node.title;
  }
  else {
    line += node.title;
  }
  if (!modeList)
    console.log(line);
  else if (videoUrl.length != 0) console.log(videoUrl);

  // Explore children
  var length = node.children ? node.children.length : 0;
  for (var i = 0 ; i < length ; i++) {
    explore(node.children[i], level+1, mapping, language);
  }
}

// Write usage
function writeUsage() {
  console.log("Usage: "+process.argv[0]+" kaexplore.js [-l] [<language>]");
}

// Get language mapping
var argv = process.argv;
var listOption = argv.indexOf("-l");
if (listOption != -1) {
  argv.splice(listOption, 1);
  modeList = true;
}
if (argv.length > 3) {
  writeUsage();
  return;
}
var languageToMap = argv[2];
var languagemapping = languageToMap ? getMapping(languageMappings, languageToMap) : null;

// Launch from root
explore(topics, 0, languagemapping, languageToMap);

// Display stats
if (!modeList) {
  console.log();
  console.log("= "+countTopic+" topics");
  console.log("= "+countVideo+" videos, "+Math.floor(sizeVideo/(1024*1024))+" Mb");
  if (languagemapping) console.log("= "+countMapped+" videos "+languageToMap+", "+Math.floor(sizeMapped/(1024*1024))+" Mb");
  console.log("= "+countExercice+" exercices");
  console.log("--- Total = "+countTotal+"/"+(countTopic+countVideo+countExercice));
}
