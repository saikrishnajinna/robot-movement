'use strict';

class Messenger {
  /**
   * @constructor
   * @param {object} config Messenger's config
   */
  constructor(config) {
    this._config = config || {};
  }


  /**
   * @private
   * @method _generateMessage Parses message string from messages config by replacing {keys}
   * @param  {object} messageConfig {msg: 'messageKey', x: 10, y: 20, f: 'north', anyKey: 'someKey'}
   * @return {string} - parsed message
   */
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

  /**
   * @public
   * @method getMessage Instruction for a Messenger what message is needed
   * @param  {object} messageConfig - {msg: 'messageKey', x: 10, y: 20, f: 'north', anyKey: 'someKey'}
   * @return {string} - parsed message
   */
  getMessage(messageConfig) {
    /**
     * If no any parameters provided.
     * Return a default welcome message.
     */
    if (!messageConfig) {
      return new Error(this.getMessage({
        msg: 'needMessageConfig'
      }));
    }
    /**
     * If there is no such a message-key in our messages config.
     * Return a default welcome message.
     */
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