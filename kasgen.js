#!/usr/bin/env node

// Adding all the requirements to make everything work
var program = require('commander');
var inquirer = require("inquirer");
var JSONSelect = require('JSONSelect')
var harp = require('harp');

program
  .description('This does stuff yo')
  .command('explore', 'Explore some junk')
  .command('update', 'search with optional query')
  .parse(process.argv);

if (!program.args.length) program.help();
