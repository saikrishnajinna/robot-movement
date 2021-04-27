'use strict';

class Messenger {
  
  constructor(config) {
    this._config = config || {};
  }


  _generateMessage(messageConfig) {
    let _combined = Object.assign({}, messageConfig, this._config.subMessages),
      str;

    str = this._config.messages[_combined.msg].replace(
      /{(\w+)}/g,
      (match, p) => {
        return _combined[p];
      });
    return str;
  }

  getMessage(messageConfig) {
    if (!messageConfig) {
      return new Error(this.getMessage({
        msg: 'needMessageConfig'
      }));
    }
    if (!this._config.messages[messageConfig.msg]) {
      return new Error(this.getMessage({
        msg: 'messageKeyNotFound',
        key: messageConfig.msg
      }));
    }
    return this._generateMessage(messageConfig);
  }
}

module.exports = Messenger;