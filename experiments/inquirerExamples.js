var BottomBar = require("../lib/ui/bottom-bar");
var cmdify = require("cmdify");

var loader = [
  "/ Installing",
  "| Installing",
  "\\ Installing",
  "- Installing"
];
var i = 4;
var ui = new BottomBar({ bottomBar: loader[i % 4] });

setInterval(function() {
  ui.updateBottomBar( loader[i++ % 4] );
}, 300 );

var spawn = require("child_process").spawn;

var cmd = spawn(cmdify("npm"), [ "-g", "install", "inquirer" ], { stdio: "pipe" });
cmd.stdout.pipe( ui.log );
cmd.on( "close", function() {
  ui.updateBottomBar("Installation done!\n");
  process.exit();
});
/**
 * Checkbox list examples
 */

"use strict";
var inquirer = require("../lib/inquirer");

inquirer.prompt([
  {
    type: "checkbox",
    message: "Select toppings",
    name: "toppings",
    choices: [
      new inquirer.Separator("The usual:"),
      {
        name: "Peperonni"
      },
      {
        name: "Cheese",
        checked: true
      },
      {
        name: "Mushroom"
      },
      new inquirer.Separator("The extras:"),
      {
        name: "Pineapple",
      },
      {
        name: "Bacon"
      },
      {
        name: "Olives",
        disabled: "out of stock"
      },
      {
        name: "Extra cheese"
      }
    ],
    validate: function( answer ) {
      if ( answer.length < 1 ) {
        return "You must choose at least one topping.";
      }
      return true;
    }
  }
], function( answers ) {
  console.log( JSON.stringify(answers, null, "  ") );
});
/**
 * Expand list examples
 */

"use strict";
var inquirer = require("../lib/inquirer");

inquirer.prompt([
  {
    type: "expand",
    message: "Conflict on `file.js`: ",
    name: "overwrite",
    choices: [
      {
        key: "y",
        name: "Overwrite",
        value: "overwrite"
      },
      {
        key: "a",
        name: "Overwrite this one and all next",
        value: "overwrite_all"
      },
      {
        key: "d",
        name: "Show diff",
        value: "diff"
      },
      new inquirer.Separator(),
      {
        key: "x",
        name: "Abort",
        value: "abort"
      }
    ]
  }
], function( answers ) {
  console.log( JSON.stringify(answers, null, "  ") );
});
/**
 * Input prompt example
 */

"use strict";
var inquirer = require("../lib/inquirer");

var questions = [
  {
    type: "input",
    name: "first_name",
    message: "What's your first name"
  },
  {
    type: "input",
    name: "last_name",
    message: "What's your last name",
    default: function () { return "Doe"; }
  },
  {
    type: "input",
    name: "phone",
    message: "What's your phone number",
    validate: function( value ) {
      var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid phone number";
      }
    }
  }
];

inquirer.prompt( questions, function( answers ) {
  console.log( JSON.stringify(answers, null, "  ") );
});
/**
 * List prompt example
 */

"use strict";
var inquirer = require("../lib/inquirer");

inquirer.prompt([
  {
    type: "list",
    name: "theme",
    message: "What do you want to do?",
    choices: [
      "Order a pizza",
      "Make a reservation",
      new inquirer.Separator(),
      "Ask opening hours",
      "Talk to the receptionnist"
    ]
  },
  {
    type: "list",
    name: "size",
    message: "What size do you need",
    choices: [ "Jumbo", "Large", "Standard", "Medium", "Small", "Micro" ],
    filter: function( val ) { return val.toLowerCase(); }
  }
], function( answers ) {
    console.log( JSON.stringify(answers, null, "  ") );
  });
/**
 * Paginated list
 */

"use strict";
var inquirer = require("../lib/inquirer");

var choices = Array.apply(0, new Array(26)).map(function(x,y) {
  return String.fromCharCode(y + 65);
});
choices.push("Multiline option \n  super cool feature");

inquirer.prompt([
  {
    type      : "list",
    name      : "letter",
    message   : "What's your favorite letter?",
    paginated : true,
    choices   : choices
  },
  {
    type      : "checkbox",
    name      : "name",
    message   : "Select the letter contained in your name:",
    paginated : true,
    choices   : choices
  }
], function( answers ) {
  console.log( JSON.stringify(answers, null, "  ") );
});
/**
 * Nested Inquirer call
 */

"use strict";
var inquirer = require("../lib/inquirer");

inquirer.prompt({
  type: "list",
  name: "chocolate",
  message: "What's your favorite chocolate?",
  choices: [ "Mars", "Oh Henry", "Hershey" ]
}, function( answers ) {
  inquirer.prompt({
    type: "list",
    name: "beverage",
    message: "And your favorite beverage?",
    choices: [ "Pepsi", "Coke", "7up", "Mountain Dew", "Red Bull" ]
  });
});
/**
 * Password prompt example
 */

"use strict";
var inquirer = require("../lib/inquirer");

inquirer.prompt([
  {
    type: "password",
    message: "Enter your git password",
    name: "password"
  }
], function( answers ) {
  console.log( JSON.stringify(answers, null, "  ") );
});
/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.js` in your console
 */

"use strict";
var inquirer = require("../lib/inquirer");

console.log("Hi, welcome to Node Pizza");

var questions = [
  {
    type: "confirm",
    name: "toBeDelivered",
    message: "Is it for a delivery",
    default: false
  },
  {
    type: "input",
    name: "phone",
    message: "What's your phone number",
    validate: function( value ) {
      var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid phone number";
      }
    }
  },
  {
    type: "list",
    name: "size",
    message: "What size do you need",
    choices: [ "Large", "Medium", "Small" ],
    filter: function( val ) { return val.toLowerCase(); }
  },
  {
    type: "input",
    name: "quantity",
    message: "How many do you need",
    validate: function( value ) {
      var valid = !isNaN(parseFloat(value));
      return valid || "Please enter a number";
    },
    filter: Number
  },
  {
    type: "expand",
    name: "toppings",
    message: "What about the toping",
    choices: [
      {
        key: "p",
        name: "Peperonni and chesse",
        value: "PeperonniChesse"
      },
      {
        key: "a",
        name: "All dressed",
        value: "alldressed"
      },
      {
        key: "w",
        name: "Hawaïan",
        value: "hawaian"
      }
    ]
  },
  {
    type: "rawlist",
    name: "beverage",
    message: "You also get a free 2L beverage",
    choices: [ "Pepsi", "7up", "Coke" ]
  },
  {
    type: "input",
    name: "comments",
    message: "Any comments on your purchase experience",
    default: "Nope, all good!"
  },
  {
    type: "list",
    name: "prize",
    message: "For leaving a comments, you get a freebie",
    choices: [ "cake", "fries" ],
    when: function( answers ) {
      return answers.comments !== "Nope, all good!";
    }
  }
];

inquirer.prompt( questions, function( answers ) {
  console.log("\nOrder receipt:");
  console.log( JSON.stringify(answers, null, "  ") );
});
/**
 * Raw List prompt example
 */

"use strict";
var inquirer = require("../lib/inquirer");

inquirer.prompt([
  {
    type: "rawlist",
    name: "theme",
    message: "What do you want to do?",
    choices: [
      "Order a pizza",
      "Make a reservation",
      new inquirer.Separator(),
      "Ask opening hours",
      "Talk to the receptionnist"
    ]
  },
  {
    type: "rawlist",
    name: "size",
    message: "What size do you need",
    choices: [ "Jumbo", "Large", "Standard", "Medium", "Small", "Micro" ],
    filter: function( val ) { return val.toLowerCase(); }
  }
], function( answers ) {
    console.log( JSON.stringify(answers, null, "  ") );
  });
/**
 * Recursive prompt example
 * Allows user to choose when to exit prompt
 */

"use strict";
var inquirer = require("../lib/inquirer");
var output = [];

var questions = [
  {
    type: "input",
    name: "tvShow",
    message: "What's your favorite TV show?"
  },
  {
    type: "confirm",
    name: "askAgain",
    message: "Want to enter another TV show favorite (just hit enter for YES)?",
    default: true
  }
];

function ask() {
  inquirer.prompt( questions, function( answers ) {
    output.push( answers.tvShow );
    if ( answers.askAgain ) {
      ask();
    } else {
      console.log( "Your favorite TV Shows:", output.join(", ") );
    }
  });
}

ask();
/**
 * When example
 */

"use strict";
var inquirer = require("../lib/inquirer");

var questions = [
  {
    type: "confirm",
    name: "bacon",
    message: "Do you like bacon?"
  },
  {
    type: "input",
    name: "favorite",
    message: "Bacon lover, what is your favorite type of bacon?",
    when: function ( answers ) {
      return answers.bacon;
    }
  },
  {
    type: "confirm",
    name: "pizza",
    message: "Ok... Do you like pizza?",
    when: function (answers) {
      return !likesFood( "bacon" )(answers);
    }
  },
  {
    type: "input",
    name: "favorite",
    message: "Whew! What is your favorite type of pizza?",
    when: likesFood( "pizza" )
  }
];

function likesFood ( aFood ) {
  return function ( answers ) {
    return answers[ aFood ];
  }
}

inquirer.prompt(questions, function (answers) {
  console.log( JSON.stringify(answers, null, "  ") );
});
