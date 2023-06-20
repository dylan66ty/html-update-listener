/*!
 * html-update-listener v1.0.5
 * (c) 2023 dylan66ty
 * Released under the ISC License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["html-update-listener"] = {}));
})(this, (function (exports) { 'use strict';

  const asyncInterval = (callback, wait, ...args) => {
      const intervalId = {
          flag: true,
          timer: undefined
      };
      const next = async () => {
          clearTimeout(intervalId.timer);
          if (!intervalId.flag)
              return;
          try {
              await callback(...args);
          }
          catch (error) {
              console.log(error);
          }
          intervalId.timer = setTimeout(next, wait);
      };
      intervalId.timer = setTimeout(next, wait);
      return intervalId;
  };
  const composeAsync = (...fns) => fns.reduce((a, v) => async (...args) => a(await v(...args)));

  class HtmlUpdateListener {
      oldScripts;
      newScripts;
      timer;
      event;
      constructor(timer) {
          this.oldScripts = [];
          this.newScripts = [];
          this.event = {};
          this.timer = timer || 1000;
          this.init();
      }
      async init() {
          try {
              await this.run();
          }
          catch (error) {
              console.log(error);
          }
      }
      parserScript(html) {
          if (!html)
              return [];
          const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi);
          return html.match(reg);
      }
      getHTML() {
          return fetch('/').then((res) => res.text());
      }
      getScripts() {
          return composeAsync(this.parserScript, this.getHTML)();
      }
      async run() {
          this.oldScripts = await this.getScripts();
          window['__BA_DU_UPDATER'] = asyncInterval(async () => {
              this.newScripts = await this.getScripts();
              this.compare();
          }, this.timer);
      }
      compare() {
          const oldScriptStr = this.oldScripts.join('');
          const newScriptStr = this.newScripts.join('');
          const oldIndexMap = {};
          Array.prototype.forEach.call(oldScriptStr, (char, index) => {
              oldIndexMap[index] = char;
          });
          let updatable = false;
          for (let i = 0; i < newScriptStr.length; i++) {
              if (oldIndexMap[i] !== newScriptStr[i]) {
                  updatable = true;
                  break;
              }
          }
          if (updatable) {
              this.emit('update', {
                  destroy: () => {
                      this.offAll('update');
                  }
              });
          }
      }
      on(eventName, callback) {
          if (!this.event[eventName]) {
              this.event[eventName] = [];
          }
          this.event[eventName].push(callback);
      }
      off(eventName, callback) {
          const callbacks = this.event[eventName];
          if (callbacks) {
              const index = callbacks.findIndex((cb) => cb === callback || cb._c === callback);
              console.log(index);
              if (index > -1) {
                  callbacks.splice(index, 1);
              }
          }
      }
      once(eventName, callback) {
          const Wrap = (...args) => {
              callback(...args);
              this.off(eventName, Wrap);
          };
          Wrap._c = callback;
          this.on(eventName, Wrap);
      }
      emit(eventName, ...args) {
          const callbacks = this.event[eventName];
          if (callbacks) {
              callbacks.forEach((cb) => cb(...args));
          }
      }
      offAll(eventName) {
          if (this.event[eventName]) {
              this.event[eventName].length = 0;
          }
      }
  }

  exports.HtmlUpdateListener = HtmlUpdateListener;
  exports.default = HtmlUpdateListener;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
