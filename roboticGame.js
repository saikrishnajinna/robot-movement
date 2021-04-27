'use strict';




const os = require("os"); 
const fs = require('fs'); 
const path = require('path');
const readline = require('readline'); 
const EventEmitter = require('events').EventEmitter;

let config = require('./config');
let Table = require('./table');
let Messenger = require('./messenger');
let Robot = require('./robot');

let stdin = process.stdin;
let stdout = process.stdout;
let stderr = process.stderr;
let argv = process.argv.slice(2); 
let EOL = os.EOL; 
let rl; 


class RoboticGame extends EventEmitter {

  constructor() {
    super();

    this.robot = new Robot(config.robot,
      new Table(config.table),
      new Messenger(config.messenger));
  }

   _actionCommand(command) {
    let res;

    command = command.trim();
    if (command.match(/^place\s+\w+(?:,\s*|\s+)\w+(?:,\s*|\s+)\w+$/i)) {
      let args = command.split(/(?:\s+|,\s*)/).slice(1);
      res = this.robot.place(args[0], args[1], args[2]);
    } else if (command.match(/^move$/i)) {
      res = this.robot.move();
    } else if (command.match(/^left$/i)) {
      res = this.robot.left();
    } else if (command.match(/^right$/i)) {
      res = this.robot.right();
    } else if (command.match(/^report$/i)) {
      res = this.robot.report();
    } else {
      res = new Error(this.robot.getMessenger().getMessage({
        msg: 'unknownCommand'
      }));
    }
    return res;
  }

  _processInput(command) {
    let response;
    let output = '> ';

    if (command.trim().match(/(q|quit|exit)/i)) {
      process.exit();
    }

    response = this._actionCommand(command);
    if (response instanceof Error) {
      output = `${response.message}${EOL}${output}`;
    } else if (typeof response === 'string') {
      output = `${response}${EOL}${output}`;
    }

    stdout.write(output);
  }

  _welcomePlayer() {
    stdout.write(this.robot.getMessenger().getMessage({
      msg: 'welcome',
      eol: EOL
    }) + EOL + '> ');
  }

  _initializeStdIn() {
    stdin.setEncoding('utf8');
    stdin.on('data', (data) => this._processInput(data));

    stdin.resume();
  }

  run() {
    if (argv.length) {
      this._readFromFile(argv[0]);
    }

    this._welcomePlayer();
    this._initializeStdIn();
  };
}

module.exports = RoboticGame;