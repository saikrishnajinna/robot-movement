'use strict';

class Table {

  constructor(config) {
    this._config = config;
  }

  isOutOfTable(x, y) {
    return (x > (this._config.startPointX + (this._config.rows - 1))) ||
      (x < this._config.startPointX) ||
      (y > (this._config.startPointY + (this._config.columns - 1))) ||
      (y < this._config.startPointY);
  }
}

module.exports = Table;