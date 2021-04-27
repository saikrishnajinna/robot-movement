'use strict';

/**
 * The robot class. Robot's constructor function.
 * The robot's dependencies are: the Table and the Messenger instances
 * @param {object} config    robot's config
 * @param {Table} table The table instance
 * @param {Messenger} messenger The Messenger instance
 * @constructor
 */
class Robot {

  constructor(config, table, messenger) {

    this._config = config;
    this._table = table;
    this._messenger = messenger;
    this._isFirstStepMade = false;
    // We store FACE as an INT, not as a string (such as 'north', 'east',
    // etc.). INT references index in a config.directions array ['NORTH',
    // 'EAST', 'SOUTH', 'WEST'] At the very beginning coordinates are
    // undefined. Coordinates get defined only after the robot was correctly
    // PLACEd X,Y,F
    this._currentPosition = {
      x: undefined,
      y: undefined,
      f: undefined
    };
  }

  /**
   * To PLACE the robot
   * @param  {INT|String} x X-coordinate
   * @param  {INT|String} y y-coordinate
   * @param  {String} f FACE coordinate ('NORTH','EAST', 'SOUTH', 'WEST'). Can
   * come either lowercased of uppercased
   * @return {Error|Robot}   If placed succsessfully it returs this, if not
   * successfully, it returns a corresponding Error instance
   * @public
   */
  place(x, y, f) {

    let arg = {};

    // Validate user input
    try {
      arg = this._validateInput(x, y, f);
    } catch (e) {
      return e;
    }

    // PLACE a robot only inside of the table
    if (this._isOutOfTable(arg.x, arg.y)) {
      return new Error(this._messenger.getMessage({
        msg: 'wrongPlace'
      }));
    }

    // Places a robot - updates its X,Y,F
    this._setPosition(arg.x, arg.y, arg.f);

    // Save that initial PLACE has been made
    if (!this._isFirstStepMade)
      this._isFirstStepMade = true;

    return this;
  }

  /**
   * To MOVE the robot. It is not possible to move the robot if no initial
   * PLACE was made - error is returned.
   * @return {Error|Robot} Robot's instance on succsess and Error instance if
   * any error occurred
   * @public
   */
  move() {
    let x, y, f;

    // Check if initial PLACE command was made
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }

    x = this._currentPosition.x;
    y = this._currentPosition.y;
    f = this._currentPosition.f;

    // Change X or Y correctly to
    switch (f) {
      case 0: // north
        ++y;
        break;
      case 1: // east
        ++x;
        break;
      case 2: // south
        --y;
        break;
      case 3: // west
        --x;
        break;
    }

    // Check if the step in not outside the table
    if (this._isOutOfTable(x, y)) {
      return new Error(this._messenger.getMessage({
        msg: 'wrongMove'
      }));
    }

    // updetes the robot's position
    this._setPosition(x, y, this._config.directions[f]);

    return this;
  }

  /**
   * To turn the robot to the right, that is change its FACE
   * @return {Error|Robot}   If succsess it returs this, if not
   * success, it returns a corresponding Error instance
   */
  right() {
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }
    this._currentPosition.f =
      (this._currentPosition.f + 1) > 3 ?
        0 : this._currentPosition.f + 1;
    return this;
  }

  /**
   * To turn the robot to the left, that is change its FACE
   * @return {Error|Robot}   If succsess it returs this, if not
   * success, it returns a corresponding Error instance
   */
  left() {
    if (!this._isFirstStepMade) {
      return new Error(this._messenger.getMessage({
        msg: 'noInitialCommand'
      }));
    }
    this._currentPosition.f =
      (this._currentPosition.f - 1) < 0 ?
        3 : this._currentPosition.f - 1;
    return this;
  }

  /**
   * Send a message to a user
   * @return {String} proper message
   */
  report() {
    let position = this._getPosition();

    // Very beginning, no any PLACE yet, coords are undefined
    // return a message "PLACE me to begin", not coordinates
    if (position.x === undefined &&
      position.y === undefined &&
      position.f === undefined) {
      return this._messenger.getMessage({
        msg: 'placeMeFirst'
      });
      // coordinates are defined, return robot's position msg
    } else {
      return this._messenger.getMessage({
        msg: 'position',
        x: position.x,
        y: position.y,
        f: position.f
      });
    }
  }

  /**
   * Validate user input for PLACEX,Y,F command. X and Y should be INTs or a
   * String that can be converted to INT
   * @param   {INT|String} x x-coordinate
   * @param   {INT|String} y y-coordinate
   * @param   {String} f [NORTH, EAST, SOUTH, WEST]. Can
   * come either lowercased of uppercased
   * @return  {Object}  {x: correct-int-x, y: correct-int-y, f:
     * correct-FACE-word}. F is returned only UPPERCASED!
   * @private
   */
  _validateInput(x, y, f) {

    // FACE cannot be undefined
    if (!f) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'noFace'
      }));
    }

    // FACE must be a string
    if (typeof f !== 'string') {
      throw new TypeError(this._messenger.getMessage({
        msg: 'faceNotString'
      }));
    }

    let _f = f.toUpperCase(),
      _x = parseInt(x),
      _y = parseInt(y);

    // Only either INT or Strings that can be parsed to INT are accepted as
    // coordinatres
    if (!Number.isInteger(_x) || !Number.isInteger(_y)) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'nonIntCoordinates'
      }));
    }

    // Only positive X and Y are accepted
    if (_x < 0 || _y < 0) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'noNegativeCoordinates'
      }));
    }

    // Only valid FACE words are accepted
    // 'NORTH', 'EAST', 'SOUTH', 'WEST'
    if (!this._isDirectionValid(_f)) {
      throw new TypeError(this._messenger.getMessage({
        msg: 'wrongDirection'
      }));
    }

    return {
      x: _x,
      y: _y,
      f: _f
    };
  }

  /**
   * Check if FACE is a valid word, that is 'NORTH', 'EAST', 'SOUTH' or 'WEST'
   * @param   {String}  sFace 'NORTH', 'EAST', 'SOUTH' or 'WEST' (uppercased)
   * @return  {Boolean}
   * @private
   */
  _isDirectionValid(sFace) {
    return this._config.directions.indexOf(sFace) !== -1;
  }

  /**
   * Update the robot's position
   * @param   {INT} x x-coordinate
   * @param   {INT} y y-coordinate
   * @param   {String} f FACE, 'NORTH', 'EAST', 'SOUTH' or 'WEST' (uppercased)
   * @private
   */
  _setPosition(x, y, f) {
    this._currentPosition.x = x;
    this._currentPosition.y = y;
    this._currentPosition.f = this._config
      .directions.indexOf(f);
  }

  /**
   * Check if action is performed inside of the table
   * @param   {INT}  x x-coordinate
   * @param   {INT}  y y-coordinate
   * @return  {Boolean}
   * @private
   */
  _isOutOfTable(x, y) {
    return this._table.isOutOfTable(x, y);
  }

  /**
   * Getter.
   * @return  {Object} {x: int-x, y: int-y, f: FACE-word (uppercased)}
   * @private
   */
  _getPosition() {
    return {
      x: this._currentPosition.x,
      y: this._currentPosition.y,
      f: this._config.directions[this._currentPosition.f]
    }
  }

  /**
   * These methods are for the sake of testing or for a development fun
   */
  _getIsFirstStepMade() {
    return this._isFirstStepMade;
  }

  /**
   * Get Messenger instance
   * @return {Messenger} messenger instance
   * @public
   */
  getMessenger() {
    return this._messenger;
  }
}

module.exports = Robot;