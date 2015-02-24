/*
// Parsing comma seperated command line arguments 
program
  .version('0.0.1')
  .option('-t, --template-engine [engine]', 'Add template [engine] support', 'jade')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marbley]', 'marble')
  .option('-l, --list [items]', 'Specify list items defaulting to 1,2,3', list, [1,2,3])
  .option('-u, --update', 'Updates the local JSON files containing download information')
  .parse(process.argv);

function list(val) {
  return val.split(',');
}

console.log(' - %s template engine', program.templateEngine);
console.log(' - %s cheese', program.cheese);
console.log(' - %j', program.list);

*/


/*
var selector = ':has(.parent_id:val("root")) > .title'; // xPath CSS like selector    

var resultObj = JSONSelect.match(selector, topics);
var stuff = [];

console.log("selector matches " + typeof resultObj);
console.log("selector be " + resultObj);
console.log('- - - - anyway - - - - - ');

JSONSelect.forEach(selector, topics, function(resultObj) {
  stuff.push(resultObj);
});

console.log(stuff);
*/


EXAMPLE for kasgen-design.js (currently kasgen-explore)

Currently selected content: []
Estimated size: 4kb
Would you like to:
  Add more content
  Remove content from selection
  Download content selection
  Exit without downloading

Choose a topic to explore:
  Math
  Science
  Go back to main menu

Math: Explore a subtopic or download 
  whatever
  whatevs
  ----
  Add a subtopic from this list
  Go back 

Math/whatever: Explore a subtopic or download 
  omg
  wtf
  ----
  Add a subtopic from this list
  Go back 

Which subtopics are you adding?
  omg
  wtf
  Add selected
  Go back

Currently selected content: [omg, wtf]
Estimated size: 4kb
Would you like to:
  Add more content
  Remove content from selection
  Download and Build content selection
  Exit without downloading

Building KA Stick Content
Already downloaded content:
omg

Needs to be downloaded:
wtf

You will need to download 4mb. Continue? (Y)n

Downloading wtf
100% =================== 4/4mb

Success!
Content built to output.json, videos cached in ./cache/

You probably now want to run "kasgen demo" or "kasgen deploy"
