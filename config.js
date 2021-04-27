'use strict';

/**
 * Config object
 * It consists of configs for:
 *   Robot class
 *   Messenger class
 *   Table class
 */

const config = {};

config.table = {
  startPointX: 0,
  startPointY: 0,
  rows: 5,
  columns: 5
};
config.robot = {
  commands: ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'],
  directions: ['NORTH', 'EAST', 'SOUTH', 'WEST']
};
config.messenger = {
  messages: {
    default: 'Start with placing placing robot -> typing PLACE X, Y, F.',
    welcome: '{eol}Welcome!{eol}{eol}Start by placing robot on table - PLACE X, Y, F. \'q\' to exit.',
    noInitialCommand: 'Robot is not placed on table. Enter "PLACE X, Y, F" to place robot on table.',
    placeMeFirst: 'Place the robot on table - PLACE X, Y, F.',
    wrongPlace: 'Crossing the table.',
    wrongDirection: 'wrong direction. Available directions are: {availableDirections}',
    noFace: 'Give the direction in which you want to place the robot.',
    faceNotString: 'Wrong command.',
    unknownCommand: 'Invalid command. Available commands are: {availableCommands}',
    position: 'Robot location: {x}, {y} towards {f}',
    noNegativeCoordinates: 'No negative coordinates.',
    nonIntCoordinates: 'coordinates must be intigers.',
    wrongMove: 'Wrong move',
    fileNotFound: 'File not found.',
    needMessageConfig: 'Need a message config to generate a proper message',
    messageKeyNotFound: 'Message key {key} could not be found'
  },
  subMessages: {
    availableDirections: config.robot.directions.join(', '),
    availableCommands: [config.robot.commands.reduce((prev, cur) => {
      if (prev === 'PLACE') {
        prev = [prev, 'X, Y, F'].join(' ');
      }

      return prev + ' | ' + cur;
    }), '.'].join(''),
    caseInsensitive: '(case insensitive)',
    country: 'Dreamland'
  }
};

module.exports = config;