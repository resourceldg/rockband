import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, e as element, c as claim_element, a as children, b as detach_dev, f as add_location, g as attr_dev, h as insert_dev, j as append_dev, n as noop } from './client.b0aae0e4.js';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var prism = createCommonjsModule(function (module) {
  /* **********************************************
       Begin prism-core.js
  ********************************************** */
  /// <reference lib="WebWorker"/>
  var _self = typeof window !== 'undefined' ? window // if in browser
  : typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self // if in worker
  : {} // if in node js
  ;
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */


  var Prism = function (_self) {
    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;
    var _ = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: _self.Prism && _self.Prism.manual,
      disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: function encode(tokens) {
          if (tokens instanceof Token) {
            return new Token(tokens.type, encode(tokens.content), tokens.alias);
          } else if (Array.isArray(tokens)) {
            return tokens.map(encode);
          } else {
            return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
          }
        },

        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: function (o) {
          return Object.prototype.toString.call(o).slice(8, -1);
        },

        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function (obj) {
          if (!obj['__id']) {
            Object.defineProperty(obj, '__id', {
              value: ++uniqueId
            });
          }

          return obj['__id'];
        },

        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: function deepClone(o, visited) {
          visited = visited || {};
          var clone, id;

          switch (_.util.type(o)) {
            case 'Object':
              id = _.util.objId(o);

              if (visited[id]) {
                return visited[id];
              }

              clone =
              /** @type {Record<string, any>} */
              {};
              visited[id] = clone;

              for (var key in o) {
                if (o.hasOwnProperty(key)) {
                  clone[key] = deepClone(o[key], visited);
                }
              }

              return (
                /** @type {any} */
                clone
              );

            case 'Array':
              id = _.util.objId(o);

              if (visited[id]) {
                return visited[id];
              }

              clone = [];
              visited[id] = clone;

              /** @type {Array} */

              /** @type {any} */
              o.forEach(function (v, i) {
                clone[i] = deepClone(v, visited);
              });
              return (
                /** @type {any} */
                clone
              );

            default:
              return o;
          }
        },

        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: function (element) {
          while (element && !lang.test(element.className)) {
            element = element.parentElement;
          }

          if (element) {
            return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
          }

          return 'none';
        },

        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: function () {
          if (typeof document === 'undefined') {
            return null;
          }

          if ('currentScript' in document && 1 < 2
          /* hack to trip TS' flow analysis */
          ) {
              return (
                /** @type {any} */
                document.currentScript
              );
            } // IE11 workaround
          // we'll get the src of the current script by parsing IE11's error stack trace
          // this will not work for inline scripts


          try {
            throw new Error();
          } catch (err) {
            // Get file src url from stack. Specifically works with the format of stack traces in IE.
            // A stack will look like this:
            //
            // Error
            //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
            //    at Global code (http://localhost/components/prism-core.js:606:1)
            var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];

            if (src) {
              var scripts = document.getElementsByTagName('script');

              for (var i in scripts) {
                if (scripts[i].src == src) {
                  return scripts[i];
                }
              }
            }

            return null;
          }
        },

        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: function (element, className, defaultActivation) {
          var no = 'no-' + className;

          while (element) {
            var classList = element.classList;

            if (classList.contains(className)) {
              return true;
            }

            if (classList.contains(no)) {
              return false;
            }

            element = element.parentElement;
          }

          return !!defaultActivation;
        }
      },

      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: function (id, redef) {
          var lang = _.util.clone(_.languages[id]);

          for (var key in redef) {
            lang[key] = redef[key];
          }

          return lang;
        },

        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: function (inside, before, insert, root) {
          root = root ||
          /** @type {any} */
          _.languages;
          var grammar = root[inside];
          /** @type {Grammar} */

          var ret = {};

          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              } // Do not insert token which also occur in insert. See #1525


              if (!insert.hasOwnProperty(token)) {
                ret[token] = grammar[token];
              }
            }
          }

          var old = root[inside];
          root[inside] = ret; // Update references in other language definitions

          _.languages.DFS(_.languages, function (key, value) {
            if (value === old && key != inside) {
              this[key] = ret;
            }
          });

          return ret;
        },
        // Traverse a language definition with Depth First Search
        DFS: function DFS(o, callback, type, visited) {
          visited = visited || {};
          var objId = _.util.objId;

          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);

              var property = o[i],
                  propertyType = _.util.type(property);

              if (propertyType === 'Object' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, null, visited);
              } else if (propertyType === 'Array' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, i, visited);
              }
            }
          }
        }
      },
      plugins: {},

      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: function (async, callback) {
        _.highlightAllUnder(document, async, callback);
      },

      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: function (container, async, callback) {
        var env = {
          callback: callback,
          container: container,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };

        _.hooks.run('before-highlightall', env);

        env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

        _.hooks.run('before-all-elements-highlight', env);

        for (var i = 0, element; element = env.elements[i++];) {
          _.highlightElement(element, async === true, env.callback);
        }
      },

      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will only be run by the current worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: function (element, async, callback) {
        // Find language
        var language = _.util.getLanguage(element);

        var grammar = _.languages[language]; // Set language on the element, if not present

        element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language; // Set language on the parent, for styling

        var parent = element.parentElement;

        if (parent && parent.nodeName.toLowerCase() === 'pre') {
          parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
        }

        var code = element.textContent;
        var env = {
          element: element,
          language: language,
          grammar: grammar,
          code: code
        };

        function insertHighlightedCode(highlightedCode) {
          env.highlightedCode = highlightedCode;

          _.hooks.run('before-insert', env);

          env.element.innerHTML = env.highlightedCode;

          _.hooks.run('after-highlight', env);

          _.hooks.run('complete', env);

          callback && callback.call(env.element);
        }

        _.hooks.run('before-sanity-check', env);

        if (!env.code) {
          _.hooks.run('complete', env);

          callback && callback.call(env.element);
          return;
        }

        _.hooks.run('before-highlight', env);

        if (!env.grammar) {
          insertHighlightedCode(_.util.encode(env.code));
          return;
        }

        if (async && _self.Worker) {
          var worker = new Worker(_.filename);

          worker.onmessage = function (evt) {
            insertHighlightedCode(evt.data);
          };

          worker.postMessage(JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true
          }));
        } else {
          insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
        }
      },

      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: function (text, grammar, language) {
        var env = {
          code: text,
          grammar: grammar,
          language: language
        };

        _.hooks.run('before-tokenize', env);

        env.tokens = _.tokenize(env.code, env.grammar);

        _.hooks.run('after-tokenize', env);

        return Token.stringify(_.util.encode(env.tokens), env.language);
      },

      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: function (text, grammar) {
        var rest = grammar.rest;

        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }

          delete grammar.rest;
        }

        var tokenList = new LinkedList();
        addAfter(tokenList, tokenList.head, text);
        matchGrammar(text, tokenList, grammar, tokenList.head, 0);
        return toArray(tokenList);
      },

      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},

        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: function (name, callback) {
          var hooks = _.hooks.all;
          hooks[name] = hooks[name] || [];
          hooks[name].push(callback);
        },

        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: function (name, env) {
          var callbacks = _.hooks.all[name];

          if (!callbacks || !callbacks.length) {
            return;
          }

          for (var i = 0, callback; callback = callbacks[i++];) {
            callback(env);
          }
        }
      },
      Token: Token
    };
    _self.Prism = _; // Typescript note:
    // The following can be used to import the Token type in JSDoc:
    //
    //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */

    function Token(type, content, alias, matchedStr) {
      /**
       * The type of the token.
       *
       * This is usually the key of a pattern in a {@link Grammar}.
       *
       * @type {string}
       * @see GrammarToken
       * @public
       */
      this.type = type;
      /**
       * The strings or tokens contained by this token.
       *
       * This will be a token stream if the pattern matched also defined an `inside` grammar.
       *
       * @type {string | TokenStream}
       * @public
       */

      this.content = content;
      /**
       * The alias(es) of the token.
       *
       * @type {string|string[]}
       * @see GrammarToken
       * @public
       */

      this.alias = alias; // Copy of the full string this token was created from

      this.length = (matchedStr || '').length | 0;
    }
    /**
     * A token stream is an array of strings and {@link Token Token} objects.
     *
     * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
     * them.
     *
     * 1. No adjacent strings.
     * 2. No empty strings.
     *
     *    The only exception here is the token stream that only contains the empty string and nothing else.
     *
     * @typedef {Array<string | Token>} TokenStream
     * @global
     * @public
     */

    /**
     * Converts the given token or token stream to an HTML representation.
     *
     * The following hooks will be run:
     * 1. `wrap`: On each {@link Token}.
     *
     * @param {string | Token | TokenStream} o The token or token stream to be converted.
     * @param {string} language The name of current language.
     * @returns {string} The HTML representation of the token or token stream.
     * @memberof Token
     * @static
     */


    Token.stringify = function stringify(o, language) {
      if (typeof o == 'string') {
        return o;
      }

      if (Array.isArray(o)) {
        var s = '';
        o.forEach(function (e) {
          s += stringify(e, language);
        });
        return s;
      }

      var env = {
        type: o.type,
        content: stringify(o.content, language),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language
      };
      var aliases = o.alias;

      if (aliases) {
        if (Array.isArray(aliases)) {
          Array.prototype.push.apply(env.classes, aliases);
        } else {
          env.classes.push(aliases);
        }
      }

      _.hooks.run('wrap', env);

      var attributes = '';

      for (var name in env.attributes) {
        attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
      }

      return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };
    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {RematchOptions} [rematch]
     * @returns {void}
     * @private
     *
     * @typedef RematchOptions
     * @property {string} cause
     * @property {number} reach
     */


    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }

        var patterns = grammar[token];
        patterns = Array.isArray(patterns) ? patterns : [patterns];

        for (var j = 0; j < patterns.length; ++j) {
          if (rematch && rematch.cause == token + ',' + j) {
            return;
          }

          var patternObj = patterns[j],
              inside = patternObj.inside,
              lookbehind = !!patternObj.lookbehind,
              greedy = !!patternObj.greedy,
              lookbehindLength = 0,
              alias = patternObj.alias;

          if (greedy && !patternObj.pattern.global) {
            // Without the global flag, lastIndex won't work
            var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
            patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
          }
          /** @type {RegExp} */


          var pattern = patternObj.pattern || patternObj;

          for ( // iterate the token list and keep track of the current token/string position
          var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
            if (rematch && pos >= rematch.reach) {
              break;
            }

            var str = currentNode.value;

            if (tokenList.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return;
            }

            if (str instanceof Token) {
              continue;
            }

            var removeCount = 1; // this is the to parameter of removeBetween

            if (greedy && currentNode != tokenList.tail.prev) {
              pattern.lastIndex = pos;
              var match = pattern.exec(text);

              if (!match) {
                break;
              }

              var from = match.index + (lookbehind && match[1] ? match[1].length : 0);
              var to = match.index + match[0].length;
              var p = pos; // find the node that contains the match

              p += currentNode.value.length;

              while (from >= p) {
                currentNode = currentNode.next;
                p += currentNode.value.length;
              } // adjust pos (and p)


              p -= currentNode.value.length;
              pos = p; // the current node is a Token, then the match starts inside another Token, which is invalid

              if (currentNode.value instanceof Token) {
                continue;
              } // find the last node which is affected by this match


              for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
                removeCount++;
                p += k.value.length;
              }

              removeCount--; // replace with the new match

              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              pattern.lastIndex = 0;
              var match = pattern.exec(str);
            }

            if (!match) {
              continue;
            }

            if (lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0;
            }

            var from = match.index + lookbehindLength,
                matchStr = match[0].slice(lookbehindLength),
                to = from + matchStr.length,
                before = str.slice(0, from),
                after = str.slice(to);
            var reach = pos + str.length;

            if (rematch && reach > rematch.reach) {
              rematch.reach = reach;
            }

            var removeFrom = currentNode.prev;

            if (before) {
              removeFrom = addAfter(tokenList, removeFrom, before);
              pos += before.length;
            }

            removeRange(tokenList, removeFrom, removeCount);
            var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
            currentNode = addAfter(tokenList, removeFrom, wrapped);

            if (after) {
              addAfter(tokenList, currentNode, after);
            }

            if (removeCount > 1) {
              // at least one Token object was removed, so we have to do some rematching
              // this can only happen if the current pattern is greedy
              matchGrammar(text, tokenList, grammar, currentNode.prev, pos, {
                cause: token + ',' + j,
                reach: reach
              });
            }
          }
        }
      }
    }
    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     * @private
     */

    /**
     * @template T
     * @private
     */


    function LinkedList() {
      /** @type {LinkedListNode<T>} */
      var head = {
        value: null,
        prev: null,
        next: null
      };
      /** @type {LinkedListNode<T>} */

      var tail = {
        value: null,
        prev: head,
        next: null
      };
      head.next = tail;
      /** @type {LinkedListNode<T>} */

      this.head = head;
      /** @type {LinkedListNode<T>} */

      this.tail = tail;
      this.length = 0;
    }
    /**
     * Adds a new node with the given value to the list.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */


    function addAfter(list, node, value) {
      // assumes that node != list.tail && values.length >= 0
      var next = node.next;
      var newNode = {
        value: value,
        prev: node,
        next: next
      };
      node.next = newNode;
      next.prev = newNode;
      list.length++;
      return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */


    function removeRange(list, node, count) {
      var next = node.next;

      for (var i = 0; i < count && next !== list.tail; i++) {
        next = next.next;
      }

      node.next = next;
      next.prev = node;
      list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */


    function toArray(list) {
      var array = [];
      var node = list.head.next;

      while (node !== list.tail) {
        array.push(node.value);
        node = node.next;
      }

      return array;
    }

    if (!_self.document) {
      if (!_self.addEventListener) {
        // in Node.js
        return _;
      }

      if (!_.disableWorkerMessageHandler) {
        // In worker
        _self.addEventListener('message', function (evt) {
          var message = JSON.parse(evt.data),
              lang = message.language,
              code = message.code,
              immediateClose = message.immediateClose;

          _self.postMessage(_.highlight(code, _.languages[lang], lang));

          if (immediateClose) {
            _self.close();
          }
        }, false);
      }

      return _;
    } // Get current script and highlight


    var script = _.util.currentScript();

    if (script) {
      _.filename = script.src;

      if (script.hasAttribute('data-manual')) {
        _.manual = true;
      }
    }

    function highlightAutomaticallyCallback() {
      if (!_.manual) {
        _.highlightAll();
      }
    }

    if (!_.manual) {
      // If the document state is "loading", then we'll use DOMContentLoaded.
      // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
      // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
      // might take longer one animation frame to execute which can create a race condition where only some plugins have
      // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
      // See https://github.com/PrismJS/prism/issues/2102
      var readyState = document.readyState;

      if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
        document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
      } else {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(highlightAutomaticallyCallback);
        } else {
          window.setTimeout(highlightAutomaticallyCallback, 16);
        }
      }
    }

    return _;
  }(_self);

  if ( module.exports) {
    module.exports = Prism;
  } // hack for components to work correctly in node.js


  if (typeof commonjsGlobal !== 'undefined') {
    commonjsGlobal.Prism = Prism;
  } // some additional documentation/types

  /**
   * The expansion of a simple `RegExp` literal to support additional properties.
   *
   * @typedef GrammarToken
   * @property {RegExp} pattern The regular expression of the token.
   * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
   * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
   * @property {boolean} [greedy=false] Whether the token is greedy.
   * @property {string|string[]} [alias] An optional alias or list of aliases.
   * @property {Grammar} [inside] The nested grammar of this token.
   *
   * The `inside` grammar will be used to tokenize the text value of each token of this kind.
   *
   * This can be used to make nested and even recursive language definitions.
   *
   * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
   * each another.
   * @global
   * @public
  */

  /**
   * @typedef Grammar
   * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
   * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
   * @global
   * @public
   */

  /**
   * A function which will invoked after an element was successfully highlighted.
   *
   * @callback HighlightCallback
   * @param {Element} element The element successfully highlighted.
   * @returns {void}
   * @global
   * @public
  */

  /**
   * @callback HookCallback
   * @param {Object<string, any>} env The environment variables of the hook.
   * @returns {void}
   * @global
   * @public
   */

  /* **********************************************
       Begin prism-markup.js
  ********************************************** */


  Prism.languages.markup = {
    'comment': /<!--[\s\S]*?-->/,
    'prolog': /<\?[\s\S]+?\?>/,
    'doctype': {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: true,
      inside: {
        'internal-subset': {
          pattern: /(\[)[\s\S]+(?=\]>$)/,
          lookbehind: true,
          greedy: true,
          inside: null // see below

        },
        'string': {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true
        },
        'punctuation': /^<!|>$|[[\]]/,
        'doctype-tag': /^DOCTYPE/,
        'name': /[^\s<>'"]+/
      }
    },
    'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
    'tag': {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: true,
      inside: {
        'tag': {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            'punctuation': /^<\/?/,
            'namespace': /^[^\s>\/:]+:/
          }
        },
        'attr-value': {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            'punctuation': [{
              pattern: /^=/,
              alias: 'attr-equals'
            }, /"|'/]
          }
        },
        'punctuation': /\/?>/,
        'attr-name': {
          pattern: /[^\s>\/]+/,
          inside: {
            'namespace': /^[^\s>\/:]+:/
          }
        }
      }
    },
    'entity': [{
      pattern: /&[\da-z]{1,8};/i,
      alias: 'named-entity'
    }, /&#x?[\da-f]{1,8};/i]
  };
  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];
  Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup; // Plugin to make entity title show the real entity, idea by Roman Komarov

  Prism.hooks.add('wrap', function (env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
  });
  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {};
      includedCdataInside['language-' + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism.languages[lang]
      };
      includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
      var inside = {
        'included-cdata': {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      };
      inside['language-' + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[lang]
      };
      var def = {};
      def[tagName] = {
        pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () {
          return tagName;
        }), 'i'),
        lookbehind: true,
        greedy: true,
        inside: inside
      };
      Prism.languages.insertBefore('markup', 'cdata', def);
    }
  });
  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;
  Prism.languages.xml = Prism.languages.extend('markup', {});
  Prism.languages.ssml = Prism.languages.xml;
  Prism.languages.atom = Prism.languages.xml;
  Prism.languages.rss = Prism.languages.xml;
  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  (function (Prism) {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    Prism.languages.css = {
      'comment': /\/\*[\s\S]*?\*\//,
      'atrule': {
        pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
        inside: {
          'rule': /^@[\w-]+/,
          'selector-function-argument': {
            pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
            lookbehind: true,
            alias: 'selector'
          },
          'keyword': {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: true
          } // See rest below

        }
      },
      'url': {
        // https://drafts.csswg.org/css-values-3/#urls
        pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
        greedy: true,
        inside: {
          'function': /^url/i,
          'punctuation': /^\(|\)$/,
          'string': {
            pattern: RegExp('^' + string.source + '$'),
            alias: 'url'
          }
        }
      },
      'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
      'string': {
        pattern: string,
        greedy: true
      },
      'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      'important': /!important\b/i,
      'function': /[-a-z0-9]+(?=\()/i,
      'punctuation': /[(){};:,]/
    };
    Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
    var markup = Prism.languages.markup;

    if (markup) {
      markup.tag.addInlined('style', 'css');
      Prism.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: markup.tag.inside
            },
            'punctuation': /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: 'language-css'
        }
      }, markup.tag);
    }
  })(Prism);
  /* **********************************************
       Begin prism-clike.js
  ********************************************** */


  Prism.languages.clike = {
    'comment': [{
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }],
    'string': {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    'class-name': {
      pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: true,
      inside: {
        'punctuation': /[.\\]/
      }
    },
    'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    'boolean': /\b(?:true|false)\b/,
    'function': /\w+(?=\()/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    'punctuation': /[{}[\];(),.:]/
  };
  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [Prism.languages.clike['class-name'], {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: true
    }],
    'keyword': [{
      pattern: /((?:^|})\s*)(?:catch|finally)\b/,
      lookbehind: true
    }, {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }],
    'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  });
  Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
  Prism.languages.insertBefore('javascript', 'keyword', {
    'regex': {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: true,
      greedy: true
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
      pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: 'function'
    },
    'parameter': [{
      pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }, {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
      inside: Prism.languages.javascript
    }, {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }, {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }],
    'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });
  Prism.languages.insertBefore('javascript', 'string', {
    'template-string': {
      pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string'
        },
        'interpolation': {
          pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\${|}$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.javascript
          }
        },
        'string': /[\s\S]+/
      }
    }
  });

  if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined('script', 'javascript');
  }

  Prism.languages.js = Prism.languages.javascript;
  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {
    if (typeof self === 'undefined' || !self.Prism || !self.document) {
      return;
    }

    var Prism = window.Prism;
    var LOADING_MESSAGE = 'Loading…';

    var FAILURE_MESSAGE = function (status, message) {
      return '✖ Error ' + status + ' while fetching file: ' + message;
    };

    var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';
    var EXTENSIONS = {
      'js': 'javascript',
      'py': 'python',
      'rb': 'ruby',
      'ps1': 'powershell',
      'psm1': 'powershell',
      'sh': 'bash',
      'bat': 'batch',
      'h': 'c',
      'tex': 'latex'
    };
    var STATUS_ATTR = 'data-src-status';
    var STATUS_LOADING = 'loading';
    var STATUS_LOADED = 'loaded';
    var STATUS_FAILED = 'failed';
    var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])' + ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    /**
     * Sets the Prism `language-xxxx` or `lang-xxxx` class to the given language.
     *
     * @param {HTMLElement} element
     * @param {string} language
     * @returns {void}
     */

    function setLanguageClass(element, language) {
      var className = element.className;
      className = className.replace(lang, ' ') + ' language-' + language;
      element.className = className.replace(/\s+/g, ' ').trim();
    }

    Prism.hooks.add('before-highlightall', function (env) {
      env.selector += ', ' + SELECTOR;
    });
    Prism.hooks.add('before-sanity-check', function (env) {
      var pre =
      /** @type {HTMLPreElement} */
      env.element;

      if (pre.matches(SELECTOR)) {
        env.code = ''; // fast-path the whole thing and go to complete

        pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading
        // add code element with loading message

        var code = pre.appendChild(document.createElement('CODE'));
        code.textContent = LOADING_MESSAGE;
        var src = pre.getAttribute('data-src');
        var language = env.language;

        if (language === 'none') {
          // the language might be 'none' because there is no language set;
          // in this case, we want to use the extension as the language
          var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
          language = EXTENSIONS[extension] || extension;
        } // set language classes


        setLanguageClass(code, language);
        setLanguageClass(pre, language); // preload the language

        var autoloader = Prism.plugins.autoloader;

        if (autoloader) {
          autoloader.loadLanguages(language);
        } // load file


        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);

        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status < 400 && xhr.responseText) {
              // mark as loaded
              pre.setAttribute(STATUS_ATTR, STATUS_LOADED); // highlight code

              code.textContent = xhr.responseText;
              Prism.highlightElement(code);
            } else {
              // mark as failed
              pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

              if (xhr.status >= 400) {
                code.textContent = FAILURE_MESSAGE(xhr.status, xhr.statusText);
              } else {
                code.textContent = FAILURE_EMPTY_MESSAGE;
              }
            }
          }
        };

        xhr.send(null);
      }
    });
    Prism.plugins.fileHighlight = {
      /**
       * Executes the File Highlight plugin for all matching `pre` elements under the given container.
       *
       * Note: Elements which are already loaded or currently loading will not be touched by this method.
       *
       * @param {ParentNode} [container=document]
       */
      highlight: function highlight(container) {
        var elements = (container || document).querySelectorAll(SELECTOR);

        for (var i = 0, element; element = elements[i++];) {
          Prism.highlightElement(element);
        }
      }
    };
    var logged = false;
    /** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */

    Prism.fileHighlight = function () {
      if (!logged) {
        console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
        logged = true;
      }

      Prism.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  })();
});

/* src/docs/Code.svelte generated by Svelte v3.24.0 */
const file = "src/docs/Code.svelte";

function create_fragment(ctx) {
  let pre;
  let code_1;
  let pre_class_value;
  const block = {
    c: function create() {
      pre = element("pre");
      code_1 = element("code");
      this.h();
    },
    l: function claim(nodes) {
      pre = claim_element(nodes, "PRE", {
        class: true
      });
      var pre_nodes = children(pre);
      code_1 = claim_element(pre_nodes, "CODE", {});
      var code_1_nodes = children(code_1);
      code_1_nodes.forEach(detach_dev);
      pre_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(code_1, file, 10, 2, 218);
      attr_dev(pre, "class", pre_class_value = "language-" +
      /*lang*/
      ctx[0]);
      add_location(pre, file, 9, 0, 186);
    },
    m: function mount(target, anchor) {
      insert_dev(target, pre, anchor);
      append_dev(pre, code_1);
      code_1.innerHTML =
      /*html*/
      ctx[1];
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*lang*/
      1 && pre_class_value !== (pre_class_value = "language-" +
      /*lang*/
      ctx[0])) {
        attr_dev(pre, "class", pre_class_value);
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(pre);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance($$self, $$props, $$invalidate) {
  let {
    code = ""
  } = $$props;
  let {
    lang = "javascript"
  } = $$props;
  const html = prism.highlight(code, prism.languages[lang], "javascript");
  const writable_props = ["code", "lang"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Code> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Code", $$slots, []);

  $$self.$set = $$props => {
    if ("code" in $$props) $$invalidate(2, code = $$props.code);
    if ("lang" in $$props) $$invalidate(0, lang = $$props.lang);
  };

  $$self.$capture_state = () => ({
    Prism: prism,
    code,
    lang,
    html
  });

  $$self.$inject_state = $$props => {
    if ("code" in $$props) $$invalidate(2, code = $$props.code);
    if ("lang" in $$props) $$invalidate(0, lang = $$props.lang);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [lang, html, code];
}

class Code extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {
      code: 2,
      lang: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Code",
      options,
      id: create_fragment.name
    });
  }

  get code() {
    throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set code(value) {
    throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get lang() {
    throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set lang(value) {
    throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

export { Code as C };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZS5kYWQ0YmI0NS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByaXNtanMvcHJpc20uanMiLCIuLi8uLi8uLi9zcmMvZG9jcy9Db2RlLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgQmVnaW4gcHJpc20tY29yZS5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLy8gPHJlZmVyZW5jZSBsaWI9XCJXZWJXb3JrZXJcIi8+XG5cbnZhciBfc2VsZiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJylcblx0PyB3aW5kb3cgICAvLyBpZiBpbiBicm93c2VyXG5cdDogKFxuXHRcdCh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSlcblx0XHQ/IHNlbGYgLy8gaWYgaW4gd29ya2VyXG5cdFx0OiB7fSAgIC8vIGlmIGluIG5vZGUganNcblx0KTtcblxuLyoqXG4gKiBQcmlzbTogTGlnaHR3ZWlnaHQsIHJvYnVzdCwgZWxlZ2FudCBzeW50YXggaGlnaGxpZ2h0aW5nXG4gKlxuICogQGxpY2Vuc2UgTUlUIDxodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVD5cbiAqIEBhdXRob3IgTGVhIFZlcm91IDxodHRwczovL2xlYS52ZXJvdS5tZT5cbiAqIEBuYW1lc3BhY2VcbiAqIEBwdWJsaWNcbiAqL1xudmFyIFByaXNtID0gKGZ1bmN0aW9uIChfc2VsZil7XG5cbi8vIFByaXZhdGUgaGVscGVyIHZhcnNcbnZhciBsYW5nID0gL1xcYmxhbmcoPzp1YWdlKT8tKFtcXHctXSspXFxiL2k7XG52YXIgdW5pcXVlSWQgPSAwO1xuXG5cbnZhciBfID0ge1xuXHQvKipcblx0ICogQnkgZGVmYXVsdCwgUHJpc20gd2lsbCBhdHRlbXB0IHRvIGhpZ2hsaWdodCBhbGwgY29kZSBlbGVtZW50cyAoYnkgY2FsbGluZyB7QGxpbmsgUHJpc20uaGlnaGxpZ2h0QWxsfSkgb24gdGhlXG5cdCAqIGN1cnJlbnQgcGFnZSBhZnRlciB0aGUgcGFnZSBmaW5pc2hlZCBsb2FkaW5nLiBUaGlzIG1pZ2h0IGJlIGEgcHJvYmxlbSBpZiBlLmcuIHlvdSB3YW50ZWQgdG8gYXN5bmNocm9ub3VzbHkgbG9hZFxuXHQgKiBhZGRpdGlvbmFsIGxhbmd1YWdlcyBvciBwbHVnaW5zIHlvdXJzZWxmLlxuXHQgKlxuXHQgKiBCeSBzZXR0aW5nIHRoaXMgdmFsdWUgdG8gYHRydWVgLCBQcmlzbSB3aWxsIG5vdCBhdXRvbWF0aWNhbGx5IGhpZ2hsaWdodCBhbGwgY29kZSBlbGVtZW50cyBvbiB0aGUgcGFnZS5cblx0ICpcblx0ICogWW91IG9idmlvdXNseSBoYXZlIHRvIGNoYW5nZSB0aGlzIHZhbHVlIGJlZm9yZSB0aGUgYXV0b21hdGljIGhpZ2hsaWdodGluZyBzdGFydGVkLiBUbyBkbyB0aGlzLCB5b3UgY2FuIGFkZCBhblxuXHQgKiBlbXB0eSBQcmlzbSBvYmplY3QgaW50byB0aGUgZ2xvYmFsIHNjb3BlIGJlZm9yZSBsb2FkaW5nIHRoZSBQcmlzbSBzY3JpcHQgbGlrZSB0aGlzOlxuXHQgKlxuXHQgKiBgYGBqc1xuXHQgKiB3aW5kb3cuUHJpc20gPSB3aW5kb3cuUHJpc20gfHwge307XG5cdCAqIFByaXNtLm1hbnVhbCA9IHRydWU7XG5cdCAqIC8vIGFkZCBhIG5ldyA8c2NyaXB0PiB0byBsb2FkIFByaXNtJ3Mgc2NyaXB0XG5cdCAqIGBgYFxuXHQgKlxuXHQgKiBAZGVmYXVsdCBmYWxzZVxuXHQgKiBAdHlwZSB7Ym9vbGVhbn1cblx0ICogQG1lbWJlcm9mIFByaXNtXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdG1hbnVhbDogX3NlbGYuUHJpc20gJiYgX3NlbGYuUHJpc20ubWFudWFsLFxuXHRkaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXI6IF9zZWxmLlByaXNtICYmIF9zZWxmLlByaXNtLmRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcixcblxuXHQvKipcblx0ICogQSBuYW1lc3BhY2UgZm9yIHV0aWxpdHkgbWV0aG9kcy5cblx0ICpcblx0ICogQWxsIGZ1bmN0aW9uIGluIHRoaXMgbmFtZXNwYWNlIHRoYXQgYXJlIG5vdCBleHBsaWNpdGx5IG1hcmtlZCBhcyBfcHVibGljXyBhcmUgZm9yIF9faW50ZXJuYWwgdXNlIG9ubHlfXyBhbmQgbWF5XG5cdCAqIGNoYW5nZSBvciBkaXNhcHBlYXIgYXQgYW55IHRpbWUuXG5cdCAqXG5cdCAqIEBuYW1lc3BhY2Vcblx0ICogQG1lbWJlcm9mIFByaXNtXG5cdCAqL1xuXHR1dGlsOiB7XG5cdFx0ZW5jb2RlOiBmdW5jdGlvbiBlbmNvZGUodG9rZW5zKSB7XG5cdFx0XHRpZiAodG9rZW5zIGluc3RhbmNlb2YgVG9rZW4pIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBUb2tlbih0b2tlbnMudHlwZSwgZW5jb2RlKHRva2Vucy5jb250ZW50KSwgdG9rZW5zLmFsaWFzKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0b2tlbnMpKSB7XG5cdFx0XHRcdHJldHVybiB0b2tlbnMubWFwKGVuY29kZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdG9rZW5zLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoL1xcdTAwYTAvZywgJyAnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgdHlwZSBvZiB0aGUgZ2l2ZW4gdmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2FueX0gb1xuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICogQGV4YW1wbGVcblx0XHQgKiB0eXBlKG51bGwpICAgICAgPT09ICdOdWxsJ1xuXHRcdCAqIHR5cGUodW5kZWZpbmVkKSA9PT0gJ1VuZGVmaW5lZCdcblx0XHQgKiB0eXBlKDEyMykgICAgICAgPT09ICdOdW1iZXInXG5cdFx0ICogdHlwZSgnZm9vJykgICAgID09PSAnU3RyaW5nJ1xuXHRcdCAqIHR5cGUodHJ1ZSkgICAgICA9PT0gJ0Jvb2xlYW4nXG5cdFx0ICogdHlwZShbMSwgMl0pICAgID09PSAnQXJyYXknXG5cdFx0ICogdHlwZSh7fSkgICAgICAgID09PSAnT2JqZWN0J1xuXHRcdCAqIHR5cGUoU3RyaW5nKSAgICA9PT0gJ0Z1bmN0aW9uJ1xuXHRcdCAqIHR5cGUoL2FiYysvKSAgICA9PT0gJ1JlZ0V4cCdcblx0XHQgKi9cblx0XHR0eXBlOiBmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgYSB1bmlxdWUgbnVtYmVyIGZvciB0aGUgZ2l2ZW4gb2JqZWN0LiBMYXRlciBjYWxscyB3aWxsIHN0aWxsIHJldHVybiB0aGUgc2FtZSBudW1iZXIuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gb2JqXG5cdFx0ICogQHJldHVybnMge251bWJlcn1cblx0XHQgKi9cblx0XHRvYmpJZDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYgKCFvYmpbJ19faWQnXSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAnX19pZCcsIHsgdmFsdWU6ICsrdW5pcXVlSWQgfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqWydfX2lkJ107XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgYSBkZWVwIGNsb25lIG9mIHRoZSBnaXZlbiBvYmplY3QuXG5cdFx0ICpcblx0XHQgKiBUaGUgbWFpbiBpbnRlbmRlZCB1c2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyB0byBjbG9uZSBsYW5ndWFnZSBkZWZpbml0aW9ucy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7VH0gb1xuXHRcdCAqIEBwYXJhbSB7UmVjb3JkPG51bWJlciwgYW55Pn0gW3Zpc2l0ZWRdXG5cdFx0ICogQHJldHVybnMge1R9XG5cdFx0ICogQHRlbXBsYXRlIFRcblx0XHQgKi9cblx0XHRjbG9uZTogZnVuY3Rpb24gZGVlcENsb25lKG8sIHZpc2l0ZWQpIHtcblx0XHRcdHZpc2l0ZWQgPSB2aXNpdGVkIHx8IHt9O1xuXG5cdFx0XHR2YXIgY2xvbmUsIGlkO1xuXHRcdFx0c3dpdGNoIChfLnV0aWwudHlwZShvKSkge1xuXHRcdFx0XHRjYXNlICdPYmplY3QnOlxuXHRcdFx0XHRcdGlkID0gXy51dGlsLm9iaklkKG8pO1xuXHRcdFx0XHRcdGlmICh2aXNpdGVkW2lkXSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZpc2l0ZWRbaWRdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjbG9uZSA9IC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gKi8gKHt9KTtcblx0XHRcdFx0XHR2aXNpdGVkW2lkXSA9IGNsb25lO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIG8pIHtcblx0XHRcdFx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmVba2V5XSA9IGRlZXBDbG9uZShvW2tleV0sIHZpc2l0ZWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGNsb25lKTtcblxuXHRcdFx0XHRjYXNlICdBcnJheSc6XG5cdFx0XHRcdFx0aWQgPSBfLnV0aWwub2JqSWQobyk7XG5cdFx0XHRcdFx0aWYgKHZpc2l0ZWRbaWRdKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmlzaXRlZFtpZF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNsb25lID0gW107XG5cdFx0XHRcdFx0dmlzaXRlZFtpZF0gPSBjbG9uZTtcblxuXHRcdFx0XHRcdCgvKiogQHR5cGUge0FycmF5fSAqLygvKiogQHR5cGUge2FueX0gKi8obykpKS5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XG5cdFx0XHRcdFx0XHRjbG9uZVtpXSA9IGRlZXBDbG9uZSh2LCB2aXNpdGVkKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGNsb25lKTtcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIHRoZSBQcmlzbSBsYW5ndWFnZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudCBzZXQgYnkgYSBgbGFuZ3VhZ2UteHh4eGAgb3IgYGxhbmcteHh4eGAgY2xhc3MuXG5cdFx0ICpcblx0XHQgKiBJZiBubyBsYW5ndWFnZSBpcyBzZXQgZm9yIHRoZSBlbGVtZW50IG9yIHRoZSBlbGVtZW50IGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgYG5vbmVgIHdpbGwgYmUgcmV0dXJuZWQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldExhbmd1YWdlOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0d2hpbGUgKGVsZW1lbnQgJiYgIWxhbmcudGVzdChlbGVtZW50LmNsYXNzTmFtZSkpIHtcblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHRcdH1cblx0XHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdHJldHVybiAoZWxlbWVudC5jbGFzc05hbWUubWF0Y2gobGFuZykgfHwgWywgJ25vbmUnXSlbMV0udG9Mb3dlckNhc2UoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAnbm9uZSc7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIHNjcmlwdCBlbGVtZW50IHRoYXQgaXMgY3VycmVudGx5IGV4ZWN1dGluZy5cblx0XHQgKlxuXHRcdCAqIFRoaXMgZG9lcyBfX25vdF9fIHdvcmsgZm9yIGxpbmUgc2NyaXB0IGVsZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7SFRNTFNjcmlwdEVsZW1lbnQgfCBudWxsfVxuXHRcdCAqL1xuXHRcdGN1cnJlbnRTY3JpcHQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCdjdXJyZW50U2NyaXB0JyBpbiBkb2N1bWVudCAmJiAxIDwgMiAvKiBoYWNrIHRvIHRyaXAgVFMnIGZsb3cgYW5hbHlzaXMgKi8pIHtcblx0XHRcdFx0cmV0dXJuIC8qKiBAdHlwZSB7YW55fSAqLyAoZG9jdW1lbnQuY3VycmVudFNjcmlwdCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElFMTEgd29ya2Fyb3VuZFxuXHRcdFx0Ly8gd2UnbGwgZ2V0IHRoZSBzcmMgb2YgdGhlIGN1cnJlbnQgc2NyaXB0IGJ5IHBhcnNpbmcgSUUxMSdzIGVycm9yIHN0YWNrIHRyYWNlXG5cdFx0XHQvLyB0aGlzIHdpbGwgbm90IHdvcmsgZm9yIGlubGluZSBzY3JpcHRzXG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdC8vIEdldCBmaWxlIHNyYyB1cmwgZnJvbSBzdGFjay4gU3BlY2lmaWNhbGx5IHdvcmtzIHdpdGggdGhlIGZvcm1hdCBvZiBzdGFjayB0cmFjZXMgaW4gSUUuXG5cdFx0XHRcdC8vIEEgc3RhY2sgd2lsbCBsb29rIGxpa2UgdGhpczpcblx0XHRcdFx0Ly9cblx0XHRcdFx0Ly8gRXJyb3Jcblx0XHRcdFx0Ly8gICAgYXQgXy51dGlsLmN1cnJlbnRTY3JpcHQgKGh0dHA6Ly9sb2NhbGhvc3QvY29tcG9uZW50cy9wcmlzbS1jb3JlLmpzOjExOTo1KVxuXHRcdFx0XHQvLyAgICBhdCBHbG9iYWwgY29kZSAoaHR0cDovL2xvY2FsaG9zdC9jb21wb25lbnRzL3ByaXNtLWNvcmUuanM6NjA2OjEpXG5cblx0XHRcdFx0dmFyIHNyYyA9ICgvYXQgW14oXFxyXFxuXSpcXCgoLiopOi4rOi4rXFwpJC9pLmV4ZWMoZXJyLnN0YWNrKSB8fCBbXSlbMV07XG5cdFx0XHRcdGlmIChzcmMpIHtcblx0XHRcdFx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcblx0XHRcdFx0XHRmb3IgKHZhciBpIGluIHNjcmlwdHMpIHtcblx0XHRcdFx0XHRcdGlmIChzY3JpcHRzW2ldLnNyYyA9PSBzcmMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjcmlwdHNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIHdoZXRoZXIgYSBnaXZlbiBjbGFzcyBpcyBhY3RpdmUgZm9yIGBlbGVtZW50YC5cblx0XHQgKlxuXHRcdCAqIFRoZSBjbGFzcyBjYW4gYmUgYWN0aXZhdGVkIGlmIGBlbGVtZW50YCBvciBvbmUgb2YgaXRzIGFuY2VzdG9ycyBoYXMgdGhlIGdpdmVuIGNsYXNzIGFuZCBpdCBjYW4gYmUgZGVhY3RpdmF0ZWRcblx0XHQgKiBpZiBgZWxlbWVudGAgb3Igb25lIG9mIGl0cyBhbmNlc3RvcnMgaGFzIHRoZSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIGdpdmVuIGNsYXNzLiBUaGUgX25lZ2F0ZWQgdmVyc2lvbl8gb2YgdGhlXG5cdFx0ICogZ2l2ZW4gY2xhc3MgaXMganVzdCB0aGUgZ2l2ZW4gY2xhc3Mgd2l0aCBhIGBuby1gIHByZWZpeC5cblx0XHQgKlxuXHRcdCAqIFdoZXRoZXIgdGhlIGNsYXNzIGlzIGFjdGl2ZSBpcyBkZXRlcm1pbmVkIGJ5IHRoZSBjbG9zZXN0IGFuY2VzdG9yIG9mIGBlbGVtZW50YCAod2hlcmUgYGVsZW1lbnRgIGl0c2VsZiBpc1xuXHRcdCAqIGNsb3Nlc3QgYW5jZXN0b3IpIHRoYXQgaGFzIHRoZSBnaXZlbiBjbGFzcyBvciB0aGUgbmVnYXRlZCB2ZXJzaW9uIG9mIGl0LiBJZiBuZWl0aGVyIGBlbGVtZW50YCBub3IgYW55IG9mIGl0c1xuXHRcdCAqIGFuY2VzdG9ycyBoYXZlIHRoZSBnaXZlbiBjbGFzcyBvciB0aGUgbmVnYXRlZCB2ZXJzaW9uIG9mIGl0LCB0aGVuIHRoZSBkZWZhdWx0IGFjdGl2YXRpb24gd2lsbCBiZSByZXR1cm5lZC5cblx0XHQgKlxuXHRcdCAqIEluIHRoZSBwYXJhZG94aWNhbCBzaXR1YXRpb24gd2hlcmUgdGhlIGNsb3Nlc3QgYW5jZXN0b3IgY29udGFpbnMgX19ib3RoX18gdGhlIGdpdmVuIGNsYXNzIGFuZCB0aGUgbmVnYXRlZFxuXHRcdCAqIHZlcnNpb24gb2YgaXQsIHRoZSBjbGFzcyBpcyBjb25zaWRlcmVkIGFjdGl2ZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtkZWZhdWx0QWN0aXZhdGlvbj1mYWxzZV1cblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRpc0FjdGl2ZTogZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSwgZGVmYXVsdEFjdGl2YXRpb24pIHtcblx0XHRcdHZhciBubyA9ICduby0nICsgY2xhc3NOYW1lO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgY2xhc3NMaXN0ID0gZWxlbWVudC5jbGFzc0xpc3Q7XG5cdFx0XHRcdGlmIChjbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjbGFzc0xpc3QuY29udGFpbnMobm8pKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gISFkZWZhdWx0QWN0aXZhdGlvbjtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFRoaXMgbmFtZXNwYWNlIGNvbnRhaW5zIGFsbCBjdXJyZW50bHkgbG9hZGVkIGxhbmd1YWdlcyBhbmQgdGhlIHNvbWUgaGVscGVyIGZ1bmN0aW9ucyB0byBjcmVhdGUgYW5kIG1vZGlmeSBsYW5ndWFnZXMuXG5cdCAqXG5cdCAqIEBuYW1lc3BhY2Vcblx0ICogQG1lbWJlcm9mIFByaXNtXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGxhbmd1YWdlczoge1xuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgYSBkZWVwIGNvcHkgb2YgdGhlIGxhbmd1YWdlIHdpdGggdGhlIGdpdmVuIGlkIGFuZCBhcHBlbmRzIHRoZSBnaXZlbiB0b2tlbnMuXG5cdFx0ICpcblx0XHQgKiBJZiBhIHRva2VuIGluIGByZWRlZmAgYWxzbyBhcHBlYXJzIGluIHRoZSBjb3BpZWQgbGFuZ3VhZ2UsIHRoZW4gdGhlIGV4aXN0aW5nIHRva2VuIGluIHRoZSBjb3BpZWQgbGFuZ3VhZ2Vcblx0XHQgKiB3aWxsIGJlIG92ZXJ3cml0dGVuIGF0IGl0cyBvcmlnaW5hbCBwb3NpdGlvbi5cblx0XHQgKlxuXHRcdCAqICMjIEJlc3QgcHJhY3RpY2VzXG5cdFx0ICpcblx0XHQgKiBTaW5jZSB0aGUgcG9zaXRpb24gb2Ygb3ZlcndyaXRpbmcgdG9rZW5zICh0b2tlbiBpbiBgcmVkZWZgIHRoYXQgb3ZlcndyaXRlIHRva2VucyBpbiB0aGUgY29waWVkIGxhbmd1YWdlKVxuXHRcdCAqIGRvZXNuJ3QgbWF0dGVyLCB0aGV5IGNhbiB0ZWNobmljYWxseSBiZSBpbiBhbnkgb3JkZXIuIEhvd2V2ZXIsIHRoaXMgY2FuIGJlIGNvbmZ1c2luZyB0byBvdGhlcnMgdGhhdCB0cnlpbmcgdG9cblx0XHQgKiB1bmRlcnN0YW5kIHRoZSBsYW5ndWFnZSBkZWZpbml0aW9uIGJlY2F1c2UsIG5vcm1hbGx5LCB0aGUgb3JkZXIgb2YgdG9rZW5zIG1hdHRlcnMgaW4gUHJpc20gZ3JhbW1hcnMuXG5cdFx0ICpcblx0XHQgKiBUaGVyZWZvcmUsIGl0IGlzIGVuY291cmFnZWQgdG8gb3JkZXIgb3ZlcndyaXRpbmcgdG9rZW5zIGFjY29yZGluZyB0byB0aGUgcG9zaXRpb25zIG9mIHRoZSBvdmVyd3JpdHRlbiB0b2tlbnMuXG5cdFx0ICogRnVydGhlcm1vcmUsIGFsbCBub24tb3ZlcndyaXRpbmcgdG9rZW5zIHNob3VsZCBiZSBwbGFjZWQgYWZ0ZXIgdGhlIG92ZXJ3cml0aW5nIG9uZXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIGlkIG9mIHRoZSBsYW5ndWFnZSB0byBleHRlbmQuIFRoaXMgaGFzIHRvIGJlIGEga2V5IGluIGBQcmlzbS5sYW5ndWFnZXNgLlxuXHRcdCAqIEBwYXJhbSB7R3JhbW1hcn0gcmVkZWYgVGhlIG5ldyB0b2tlbnMgdG8gYXBwZW5kLlxuXHRcdCAqIEByZXR1cm5zIHtHcmFtbWFyfSBUaGUgbmV3IGxhbmd1YWdlIGNyZWF0ZWQuXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqIEBleGFtcGxlXG5cdFx0ICogUHJpc20ubGFuZ3VhZ2VzWydjc3Mtd2l0aC1jb2xvcnMnXSA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NzcycsIHtcblx0XHQgKiAgICAgLy8gUHJpc20ubGFuZ3VhZ2VzLmNzcyBhbHJlYWR5IGhhcyBhICdjb21tZW50JyB0b2tlbiwgc28gdGhpcyB0b2tlbiB3aWxsIG92ZXJ3cml0ZSBDU1MnICdjb21tZW50JyB0b2tlblxuXHRcdCAqICAgICAvLyBhdCBpdHMgb3JpZ2luYWwgcG9zaXRpb25cblx0XHQgKiAgICAgJ2NvbW1lbnQnOiB7IC4uLiB9LFxuXHRcdCAqICAgICAvLyBDU1MgZG9lc24ndCBoYXZlIGEgJ2NvbG9yJyB0b2tlbiwgc28gdGhpcyB0b2tlbiB3aWxsIGJlIGFwcGVuZGVkXG5cdFx0ICogICAgICdjb2xvcic6IC9cXGIoPzpyZWR8Z3JlZW58Ymx1ZSlcXGIvXG5cdFx0ICogfSk7XG5cdFx0ICovXG5cdFx0ZXh0ZW5kOiBmdW5jdGlvbiAoaWQsIHJlZGVmKSB7XG5cdFx0XHR2YXIgbGFuZyA9IF8udXRpbC5jbG9uZShfLmxhbmd1YWdlc1tpZF0pO1xuXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gcmVkZWYpIHtcblx0XHRcdFx0bGFuZ1trZXldID0gcmVkZWZba2V5XTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGxhbmc7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEluc2VydHMgdG9rZW5zIF9iZWZvcmVfIGFub3RoZXIgdG9rZW4gaW4gYSBsYW5ndWFnZSBkZWZpbml0aW9uIG9yIGFueSBvdGhlciBncmFtbWFyLlxuXHRcdCAqXG5cdFx0ICogIyMgVXNhZ2Vcblx0XHQgKlxuXHRcdCAqIFRoaXMgaGVscGVyIG1ldGhvZCBtYWtlcyBpdCBlYXN5IHRvIG1vZGlmeSBleGlzdGluZyBsYW5ndWFnZXMuIEZvciBleGFtcGxlLCB0aGUgQ1NTIGxhbmd1YWdlIGRlZmluaXRpb25cblx0XHQgKiBub3Qgb25seSBkZWZpbmVzIENTUyBoaWdobGlnaHRpbmcgZm9yIENTUyBkb2N1bWVudHMsIGJ1dCBhbHNvIG5lZWRzIHRvIGRlZmluZSBoaWdobGlnaHRpbmcgZm9yIENTUyBlbWJlZGRlZFxuXHRcdCAqIGluIEhUTUwgdGhyb3VnaCBgPHN0eWxlPmAgZWxlbWVudHMuIFRvIGRvIHRoaXMsIGl0IG5lZWRzIHRvIG1vZGlmeSBgUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cGAgYW5kIGFkZCB0aGVcblx0XHQgKiBhcHByb3ByaWF0ZSB0b2tlbnMuIEhvd2V2ZXIsIGBQcmlzbS5sYW5ndWFnZXMubWFya3VwYCBpcyBhIHJlZ3VsYXIgSmF2YVNjcmlwdCBvYmplY3QgbGl0ZXJhbCwgc28gaWYgeW91IGRvXG5cdFx0ICogdGhpczpcblx0XHQgKlxuXHRcdCAqIGBgYGpzXG5cdFx0ICogUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC5zdHlsZSA9IHtcblx0XHQgKiAgICAgLy8gdG9rZW5cblx0XHQgKiB9O1xuXHRcdCAqIGBgYFxuXHRcdCAqXG5cdFx0ICogdGhlbiB0aGUgYHN0eWxlYCB0b2tlbiB3aWxsIGJlIGFkZGVkIChhbmQgcHJvY2Vzc2VkKSBhdCB0aGUgZW5kLiBgaW5zZXJ0QmVmb3JlYCBhbGxvd3MgeW91IHRvIGluc2VydCB0b2tlbnNcblx0XHQgKiBiZWZvcmUgZXhpc3RpbmcgdG9rZW5zLiBGb3IgdGhlIENTUyBleGFtcGxlIGFib3ZlLCB5b3Ugd291bGQgdXNlIGl0IGxpa2UgdGhpczpcblx0XHQgKlxuXHRcdCAqIGBgYGpzXG5cdFx0ICogUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnbWFya3VwJywgJ2NkYXRhJywge1xuXHRcdCAqICAgICAnc3R5bGUnOiB7XG5cdFx0ICogICAgICAgICAvLyB0b2tlblxuXHRcdCAqICAgICB9XG5cdFx0ICogfSk7XG5cdFx0ICogYGBgXG5cdFx0ICpcblx0XHQgKiAjIyBTcGVjaWFsIGNhc2VzXG5cdFx0ICpcblx0XHQgKiBJZiB0aGUgZ3JhbW1hcnMgb2YgYGluc2lkZWAgYW5kIGBpbnNlcnRgIGhhdmUgdG9rZW5zIHdpdGggdGhlIHNhbWUgbmFtZSwgdGhlIHRva2VucyBpbiBgaW5zaWRlYCdzIGdyYW1tYXJcblx0XHQgKiB3aWxsIGJlIGlnbm9yZWQuXG5cdFx0ICpcblx0XHQgKiBUaGlzIGJlaGF2aW9yIGNhbiBiZSB1c2VkIHRvIGluc2VydCB0b2tlbnMgYWZ0ZXIgYGJlZm9yZWA6XG5cdFx0ICpcblx0XHQgKiBgYGBqc1xuXHRcdCAqIFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ21hcmt1cCcsICdjb21tZW50Jywge1xuXHRcdCAqICAgICAnY29tbWVudCc6IFByaXNtLmxhbmd1YWdlcy5tYXJrdXAuY29tbWVudCxcblx0XHQgKiAgICAgLy8gdG9rZW5zIGFmdGVyICdjb21tZW50J1xuXHRcdCAqIH0pO1xuXHRcdCAqIGBgYFxuXHRcdCAqXG5cdFx0ICogIyMgTGltaXRhdGlvbnNcblx0XHQgKlxuXHRcdCAqIFRoZSBtYWluIHByb2JsZW0gYGluc2VydEJlZm9yZWAgaGFzIHRvIHNvbHZlIGlzIGl0ZXJhdGlvbiBvcmRlci4gU2luY2UgRVMyMDE1LCB0aGUgaXRlcmF0aW9uIG9yZGVyIGZvciBvYmplY3Rcblx0XHQgKiBwcm9wZXJ0aWVzIGlzIGd1YXJhbnRlZWQgdG8gYmUgdGhlIGluc2VydGlvbiBvcmRlciAoZXhjZXB0IGZvciBpbnRlZ2VyIGtleXMpIGJ1dCBzb21lIGJyb3dzZXJzIGJlaGF2ZVxuXHRcdCAqIGRpZmZlcmVudGx5IHdoZW4ga2V5cyBhcmUgZGVsZXRlZCBhbmQgcmUtaW5zZXJ0ZWQuIFNvIGBpbnNlcnRCZWZvcmVgIGNhbid0IGJlIGltcGxlbWVudGVkIGJ5IHRlbXBvcmFyaWx5XG5cdFx0ICogZGVsZXRpbmcgcHJvcGVydGllcyB3aGljaCBpcyBuZWNlc3NhcnkgdG8gaW5zZXJ0IGF0IGFyYml0cmFyeSBwb3NpdGlvbnMuXG5cdFx0ICpcblx0XHQgKiBUbyBzb2x2ZSB0aGlzIHByb2JsZW0sIGBpbnNlcnRCZWZvcmVgIGRvZXNuJ3QgYWN0dWFsbHkgaW5zZXJ0IHRoZSBnaXZlbiB0b2tlbnMgaW50byB0aGUgdGFyZ2V0IG9iamVjdC5cblx0XHQgKiBJbnN0ZWFkLCBpdCB3aWxsIGNyZWF0ZSBhIG5ldyBvYmplY3QgYW5kIHJlcGxhY2UgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIHRhcmdldCBvYmplY3Qgd2l0aCB0aGUgbmV3IG9uZS4gVGhpc1xuXHRcdCAqIGNhbiBiZSBkb25lIHdpdGhvdXQgdGVtcG9yYXJpbHkgZGVsZXRpbmcgcHJvcGVydGllcywgc28gdGhlIGl0ZXJhdGlvbiBvcmRlciBpcyB3ZWxsLWRlZmluZWQuXG5cdFx0ICpcblx0XHQgKiBIb3dldmVyLCBvbmx5IHJlZmVyZW5jZXMgdGhhdCBjYW4gYmUgcmVhY2hlZCBmcm9tIGBQcmlzbS5sYW5ndWFnZXNgIG9yIGBpbnNlcnRgIHdpbGwgYmUgcmVwbGFjZWQuIEkuZS4gaWZcblx0XHQgKiB5b3UgaG9sZCB0aGUgdGFyZ2V0IG9iamVjdCBpbiBhIHZhcmlhYmxlLCB0aGVuIHRoZSB2YWx1ZSBvZiB0aGUgdmFyaWFibGUgd2lsbCBub3QgY2hhbmdlLlxuXHRcdCAqXG5cdFx0ICogYGBganNcblx0XHQgKiB2YXIgb2xkTWFya3VwID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cDtcblx0XHQgKiB2YXIgbmV3TWFya3VwID0gUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnbWFya3VwJywgJ2NvbW1lbnQnLCB7IC4uLiB9KTtcblx0XHQgKlxuXHRcdCAqIGFzc2VydChvbGRNYXJrdXAgIT09IFByaXNtLmxhbmd1YWdlcy5tYXJrdXApO1xuXHRcdCAqIGFzc2VydChuZXdNYXJrdXAgPT09IFByaXNtLmxhbmd1YWdlcy5tYXJrdXApO1xuXHRcdCAqIGBgYFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGluc2lkZSBUaGUgcHJvcGVydHkgb2YgYHJvb3RgIChlLmcuIGEgbGFuZ3VhZ2UgaWQgaW4gYFByaXNtLmxhbmd1YWdlc2ApIHRoYXQgY29udGFpbnMgdGhlXG5cdFx0ICogb2JqZWN0IHRvIGJlIG1vZGlmaWVkLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBiZWZvcmUgVGhlIGtleSB0byBpbnNlcnQgYmVmb3JlLlxuXHRcdCAqIEBwYXJhbSB7R3JhbW1hcn0gaW5zZXJ0IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBrZXktdmFsdWUgcGFpcnMgdG8gYmUgaW5zZXJ0ZWQuXG5cdFx0ICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBbcm9vdF0gVGhlIG9iamVjdCBjb250YWluaW5nIGBpbnNpZGVgLCBpLmUuIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGVcblx0XHQgKiBvYmplY3QgdG8gYmUgbW9kaWZpZWQuXG5cdFx0ICpcblx0XHQgKiBEZWZhdWx0cyB0byBgUHJpc20ubGFuZ3VhZ2VzYC5cblx0XHQgKiBAcmV0dXJucyB7R3JhbW1hcn0gVGhlIG5ldyBncmFtbWFyIG9iamVjdC5cblx0XHQgKiBAcHVibGljXG5cdFx0ICovXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoaW5zaWRlLCBiZWZvcmUsIGluc2VydCwgcm9vdCkge1xuXHRcdFx0cm9vdCA9IHJvb3QgfHwgLyoqIEB0eXBlIHthbnl9ICovIChfLmxhbmd1YWdlcyk7XG5cdFx0XHR2YXIgZ3JhbW1hciA9IHJvb3RbaW5zaWRlXTtcblx0XHRcdC8qKiBAdHlwZSB7R3JhbW1hcn0gKi9cblx0XHRcdHZhciByZXQgPSB7fTtcblxuXHRcdFx0Zm9yICh2YXIgdG9rZW4gaW4gZ3JhbW1hcikge1xuXHRcdFx0XHRpZiAoZ3JhbW1hci5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcblxuXHRcdFx0XHRcdGlmICh0b2tlbiA9PSBiZWZvcmUpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIG5ld1Rva2VuIGluIGluc2VydCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaW5zZXJ0Lmhhc093blByb3BlcnR5KG5ld1Rva2VuKSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldFtuZXdUb2tlbl0gPSBpbnNlcnRbbmV3VG9rZW5dO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRG8gbm90IGluc2VydCB0b2tlbiB3aGljaCBhbHNvIG9jY3VyIGluIGluc2VydC4gU2VlICMxNTI1XG5cdFx0XHRcdFx0aWYgKCFpbnNlcnQuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG5cdFx0XHRcdFx0XHRyZXRbdG9rZW5dID0gZ3JhbW1hclt0b2tlbl07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBvbGQgPSByb290W2luc2lkZV07XG5cdFx0XHRyb290W2luc2lkZV0gPSByZXQ7XG5cblx0XHRcdC8vIFVwZGF0ZSByZWZlcmVuY2VzIGluIG90aGVyIGxhbmd1YWdlIGRlZmluaXRpb25zXG5cdFx0XHRfLmxhbmd1YWdlcy5ERlMoXy5sYW5ndWFnZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSBvbGQgJiYga2V5ICE9IGluc2lkZSkge1xuXHRcdFx0XHRcdHRoaXNba2V5XSA9IHJldDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdC8vIFRyYXZlcnNlIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiB3aXRoIERlcHRoIEZpcnN0IFNlYXJjaFxuXHRcdERGUzogZnVuY3Rpb24gREZTKG8sIGNhbGxiYWNrLCB0eXBlLCB2aXNpdGVkKSB7XG5cdFx0XHR2aXNpdGVkID0gdmlzaXRlZCB8fCB7fTtcblxuXHRcdFx0dmFyIG9iaklkID0gXy51dGlsLm9iaklkO1xuXG5cdFx0XHRmb3IgKHZhciBpIGluIG8pIHtcblx0XHRcdFx0aWYgKG8uaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKG8sIGksIG9baV0sIHR5cGUgfHwgaSk7XG5cblx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSBvW2ldLFxuXHRcdFx0XHRcdCAgICBwcm9wZXJ0eVR5cGUgPSBfLnV0aWwudHlwZShwcm9wZXJ0eSk7XG5cblx0XHRcdFx0XHRpZiAocHJvcGVydHlUeXBlID09PSAnT2JqZWN0JyAmJiAhdmlzaXRlZFtvYmpJZChwcm9wZXJ0eSldKSB7XG5cdFx0XHRcdFx0XHR2aXNpdGVkW29iaklkKHByb3BlcnR5KV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0REZTKHByb3BlcnR5LCBjYWxsYmFjaywgbnVsbCwgdmlzaXRlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKHByb3BlcnR5VHlwZSA9PT0gJ0FycmF5JyAmJiAhdmlzaXRlZFtvYmpJZChwcm9wZXJ0eSldKSB7XG5cdFx0XHRcdFx0XHR2aXNpdGVkW29iaklkKHByb3BlcnR5KV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0REZTKHByb3BlcnR5LCBjYWxsYmFjaywgaSwgdmlzaXRlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHBsdWdpbnM6IHt9LFxuXG5cdC8qKlxuXHQgKiBUaGlzIGlzIHRoZSBtb3N0IGhpZ2gtbGV2ZWwgZnVuY3Rpb24gaW4gUHJpc23igJlzIEFQSS5cblx0ICogSXQgZmV0Y2hlcyBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgaGF2ZSBhIGAubGFuZ3VhZ2UteHh4eGAgY2xhc3MgYW5kIHRoZW4gY2FsbHMge0BsaW5rIFByaXNtLmhpZ2hsaWdodEVsZW1lbnR9IG9uXG5cdCAqIGVhY2ggb25lIG9mIHRoZW0uXG5cdCAqXG5cdCAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byBgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIoZG9jdW1lbnQsIGFzeW5jLCBjYWxsYmFjaylgLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFthc3luYz1mYWxzZV0gU2FtZSBhcyBpbiB7QGxpbmsgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXJ9LlxuXHQgKiBAcGFyYW0ge0hpZ2hsaWdodENhbGxiYWNrfSBbY2FsbGJhY2tdIFNhbWUgYXMgaW4ge0BsaW5rIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyfS5cblx0ICogQG1lbWJlcm9mIFByaXNtXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGhpZ2hsaWdodEFsbDogZnVuY3Rpb24oYXN5bmMsIGNhbGxiYWNrKSB7XG5cdFx0Xy5oaWdobGlnaHRBbGxVbmRlcihkb2N1bWVudCwgYXN5bmMsIGNhbGxiYWNrKTtcblx0fSxcblxuXHQvKipcblx0ICogRmV0Y2hlcyBhbGwgdGhlIGRlc2NlbmRhbnRzIG9mIGBjb250YWluZXJgIHRoYXQgaGF2ZSBhIGAubGFuZ3VhZ2UteHh4eGAgY2xhc3MgYW5kIHRoZW4gY2FsbHNcblx0ICoge0BsaW5rIFByaXNtLmhpZ2hsaWdodEVsZW1lbnR9IG9uIGVhY2ggb25lIG9mIHRoZW0uXG5cdCAqXG5cdCAqIFRoZSBmb2xsb3dpbmcgaG9va3Mgd2lsbCBiZSBydW46XG5cdCAqIDEuIGBiZWZvcmUtaGlnaGxpZ2h0YWxsYFxuXHQgKiAyLiBBbGwgaG9va3Mgb2Yge0BsaW5rIFByaXNtLmhpZ2hsaWdodEVsZW1lbnR9IGZvciBlYWNoIGVsZW1lbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gY29udGFpbmVyIFRoZSByb290IGVsZW1lbnQsIHdob3NlIGRlc2NlbmRhbnRzIHRoYXQgaGF2ZSBhIGAubGFuZ3VhZ2UteHh4eGAgY2xhc3Mgd2lsbCBiZSBoaWdobGlnaHRlZC5cblx0ICogQHBhcmFtIHtib29sZWFufSBbYXN5bmM9ZmFsc2VdIFdoZXRoZXIgZWFjaCBlbGVtZW50IGlzIHRvIGJlIGhpZ2hsaWdodGVkIGFzeW5jaHJvbm91c2x5IHVzaW5nIFdlYiBXb3JrZXJzLlxuXHQgKiBAcGFyYW0ge0hpZ2hsaWdodENhbGxiYWNrfSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgb24gZWFjaCBlbGVtZW50IGFmdGVyIGl0cyBoaWdobGlnaHRpbmcgaXMgZG9uZS5cblx0ICogQG1lbWJlcm9mIFByaXNtXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGhpZ2hsaWdodEFsbFVuZGVyOiBmdW5jdGlvbihjb250YWluZXIsIGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdHZhciBlbnYgPSB7XG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2ssXG5cdFx0XHRjb250YWluZXI6IGNvbnRhaW5lcixcblx0XHRcdHNlbGVjdG9yOiAnY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sIFtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gY29kZSwgY29kZVtjbGFzcyo9XCJsYW5nLVwiXSwgW2NsYXNzKj1cImxhbmctXCJdIGNvZGUnXG5cdFx0fTtcblxuXHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaGlnaGxpZ2h0YWxsJywgZW52KTtcblxuXHRcdGVudi5lbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShlbnYuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZW52LnNlbGVjdG9yKSk7XG5cblx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLWFsbC1lbGVtZW50cy1oaWdobGlnaHQnLCBlbnYpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGVsZW1lbnQ7IGVsZW1lbnQgPSBlbnYuZWxlbWVudHNbaSsrXTspIHtcblx0XHRcdF8uaGlnaGxpZ2h0RWxlbWVudChlbGVtZW50LCBhc3luYyA9PT0gdHJ1ZSwgZW52LmNhbGxiYWNrKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEhpZ2hsaWdodHMgdGhlIGNvZGUgaW5zaWRlIGEgc2luZ2xlIGVsZW1lbnQuXG5cdCAqXG5cdCAqIFRoZSBmb2xsb3dpbmcgaG9va3Mgd2lsbCBiZSBydW46XG5cdCAqIDEuIGBiZWZvcmUtc2FuaXR5LWNoZWNrYFxuXHQgKiAyLiBgYmVmb3JlLWhpZ2hsaWdodGBcblx0ICogMy4gQWxsIGhvb2tzIG9mIHtAbGluayBQcmlzbS5oaWdobGlnaHR9LiBUaGVzZSBob29rcyB3aWxsIG9ubHkgYmUgcnVuIGJ5IHRoZSBjdXJyZW50IHdvcmtlciBpZiBgYXN5bmNgIGlzIGB0cnVlYC5cblx0ICogNC4gYGJlZm9yZS1pbnNlcnRgXG5cdCAqIDUuIGBhZnRlci1oaWdobGlnaHRgXG5cdCAqIDYuIGBjb21wbGV0ZWBcblx0ICpcblx0ICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGNvZGUuXG5cdCAqIEl0IG11c3QgaGF2ZSBhIGNsYXNzIG9mIGBsYW5ndWFnZS14eHh4YCB0byBiZSBwcm9jZXNzZWQsIHdoZXJlIGB4eHh4YCBpcyBhIHZhbGlkIGxhbmd1YWdlIGlkZW50aWZpZXIuXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FzeW5jPWZhbHNlXSBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIHRvIGJlIGhpZ2hsaWdodGVkIGFzeW5jaHJvbm91c2x5IHVzaW5nIFdlYiBXb3JrZXJzXG5cdCAqIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UgYW5kIGF2b2lkIGJsb2NraW5nIHRoZSBVSSB3aGVuIGhpZ2hsaWdodGluZyB2ZXJ5IGxhcmdlIGNodW5rcyBvZiBjb2RlLiBUaGlzIG9wdGlvbiBpc1xuXHQgKiBbZGlzYWJsZWQgYnkgZGVmYXVsdF0oaHR0cHM6Ly9wcmlzbWpzLmNvbS9mYXEuaHRtbCN3aHktaXMtYXN5bmNocm9ub3VzLWhpZ2hsaWdodGluZy1kaXNhYmxlZC1ieS1kZWZhdWx0KS5cblx0ICpcblx0ICogTm90ZTogQWxsIGxhbmd1YWdlIGRlZmluaXRpb25zIHJlcXVpcmVkIHRvIGhpZ2hsaWdodCB0aGUgY29kZSBtdXN0IGJlIGluY2x1ZGVkIGluIHRoZSBtYWluIGBwcmlzbS5qc2AgZmlsZSBmb3Jcblx0ICogYXN5bmNocm9ub3VzIGhpZ2hsaWdodGluZyB0byB3b3JrLiBZb3UgY2FuIGJ1aWxkIHlvdXIgb3duIGJ1bmRsZSBvbiB0aGVcblx0ICogW0Rvd25sb2FkIHBhZ2VdKGh0dHBzOi8vcHJpc21qcy5jb20vZG93bmxvYWQuaHRtbCkuXG5cdCAqIEBwYXJhbSB7SGlnaGxpZ2h0Q2FsbGJhY2t9IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBhZnRlciB0aGUgaGlnaGxpZ2h0aW5nIGlzIGRvbmUuXG5cdCAqIE1vc3RseSB1c2VmdWwgd2hlbiBgYXN5bmNgIGlzIGB0cnVlYCwgc2luY2UgaW4gdGhhdCBjYXNlLCB0aGUgaGlnaGxpZ2h0aW5nIGlzIGRvbmUgYXN5bmNocm9ub3VzbHkuXG5cdCAqIEBtZW1iZXJvZiBQcmlzbVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRoaWdobGlnaHRFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50LCBhc3luYywgY2FsbGJhY2spIHtcblx0XHQvLyBGaW5kIGxhbmd1YWdlXG5cdFx0dmFyIGxhbmd1YWdlID0gXy51dGlsLmdldExhbmd1YWdlKGVsZW1lbnQpO1xuXHRcdHZhciBncmFtbWFyID0gXy5sYW5ndWFnZXNbbGFuZ3VhZ2VdO1xuXG5cdFx0Ly8gU2V0IGxhbmd1YWdlIG9uIHRoZSBlbGVtZW50LCBpZiBub3QgcHJlc2VudFxuXHRcdGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShsYW5nLCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpICsgJyBsYW5ndWFnZS0nICsgbGFuZ3VhZ2U7XG5cblx0XHQvLyBTZXQgbGFuZ3VhZ2Ugb24gdGhlIHBhcmVudCwgZm9yIHN0eWxpbmdcblx0XHR2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdGlmIChwYXJlbnQgJiYgcGFyZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdwcmUnKSB7XG5cdFx0XHRwYXJlbnQuY2xhc3NOYW1lID0gcGFyZW50LmNsYXNzTmFtZS5yZXBsYWNlKGxhbmcsICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykgKyAnIGxhbmd1YWdlLScgKyBsYW5ndWFnZTtcblx0XHR9XG5cblx0XHR2YXIgY29kZSA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cblx0XHR2YXIgZW52ID0ge1xuXHRcdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRcdGxhbmd1YWdlOiBsYW5ndWFnZSxcblx0XHRcdGdyYW1tYXI6IGdyYW1tYXIsXG5cdFx0XHRjb2RlOiBjb2RlXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGluc2VydEhpZ2hsaWdodGVkQ29kZShoaWdobGlnaHRlZENvZGUpIHtcblx0XHRcdGVudi5oaWdobGlnaHRlZENvZGUgPSBoaWdobGlnaHRlZENvZGU7XG5cblx0XHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaW5zZXJ0JywgZW52KTtcblxuXHRcdFx0ZW52LmVsZW1lbnQuaW5uZXJIVE1MID0gZW52LmhpZ2hsaWdodGVkQ29kZTtcblxuXHRcdFx0Xy5ob29rcy5ydW4oJ2FmdGVyLWhpZ2hsaWdodCcsIGVudik7XG5cdFx0XHRfLmhvb2tzLnJ1bignY29tcGxldGUnLCBlbnYpO1xuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChlbnYuZWxlbWVudCk7XG5cdFx0fVxuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1zYW5pdHktY2hlY2snLCBlbnYpO1xuXG5cdFx0aWYgKCFlbnYuY29kZSkge1xuXHRcdFx0Xy5ob29rcy5ydW4oJ2NvbXBsZXRlJywgZW52KTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoZW52LmVsZW1lbnQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaGlnaGxpZ2h0JywgZW52KTtcblxuXHRcdGlmICghZW52LmdyYW1tYXIpIHtcblx0XHRcdGluc2VydEhpZ2hsaWdodGVkQ29kZShfLnV0aWwuZW5jb2RlKGVudi5jb2RlKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGFzeW5jICYmIF9zZWxmLldvcmtlcikge1xuXHRcdFx0dmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoXy5maWxlbmFtZSk7XG5cblx0XHRcdHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0aW5zZXJ0SGlnaGxpZ2h0ZWRDb2RlKGV2dC5kYXRhKTtcblx0XHRcdH07XG5cblx0XHRcdHdvcmtlci5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdGxhbmd1YWdlOiBlbnYubGFuZ3VhZ2UsXG5cdFx0XHRcdGNvZGU6IGVudi5jb2RlLFxuXHRcdFx0XHRpbW1lZGlhdGVDbG9zZTogdHJ1ZVxuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGluc2VydEhpZ2hsaWdodGVkQ29kZShfLmhpZ2hsaWdodChlbnYuY29kZSwgZW52LmdyYW1tYXIsIGVudi5sYW5ndWFnZSkpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG93LWxldmVsIGZ1bmN0aW9uLCBvbmx5IHVzZSBpZiB5b3Uga25vdyB3aGF0IHlvdeKAmXJlIGRvaW5nLiBJdCBhY2NlcHRzIGEgc3RyaW5nIG9mIHRleHQgYXMgaW5wdXRcblx0ICogYW5kIHRoZSBsYW5ndWFnZSBkZWZpbml0aW9ucyB0byB1c2UsIGFuZCByZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIEhUTUwgcHJvZHVjZWQuXG5cdCAqXG5cdCAqIFRoZSBmb2xsb3dpbmcgaG9va3Mgd2lsbCBiZSBydW46XG5cdCAqIDEuIGBiZWZvcmUtdG9rZW5pemVgXG5cdCAqIDIuIGBhZnRlci10b2tlbml6ZWBcblx0ICogMy4gYHdyYXBgOiBPbiBlYWNoIHtAbGluayBUb2tlbn0uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IEEgc3RyaW5nIHdpdGggdGhlIGNvZGUgdG8gYmUgaGlnaGxpZ2h0ZWQuXG5cdCAqIEBwYXJhbSB7R3JhbW1hcn0gZ3JhbW1hciBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdG9rZW5zIHRvIHVzZS5cblx0ICpcblx0ICogVXN1YWxseSBhIGxhbmd1YWdlIGRlZmluaXRpb24gbGlrZSBgUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cGAuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSBUaGUgbmFtZSBvZiB0aGUgbGFuZ3VhZ2UgZGVmaW5pdGlvbiBwYXNzZWQgdG8gYGdyYW1tYXJgLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgaGlnaGxpZ2h0ZWQgSFRNTC5cblx0ICogQG1lbWJlcm9mIFByaXNtXG5cdCAqIEBwdWJsaWNcblx0ICogQGV4YW1wbGVcblx0ICogUHJpc20uaGlnaGxpZ2h0KCd2YXIgZm9vID0gdHJ1ZTsnLCBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCwgJ2phdmFzY3JpcHQnKTtcblx0ICovXG5cdGhpZ2hsaWdodDogZnVuY3Rpb24gKHRleHQsIGdyYW1tYXIsIGxhbmd1YWdlKSB7XG5cdFx0dmFyIGVudiA9IHtcblx0XHRcdGNvZGU6IHRleHQsXG5cdFx0XHRncmFtbWFyOiBncmFtbWFyLFxuXHRcdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlXG5cdFx0fTtcblx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLXRva2VuaXplJywgZW52KTtcblx0XHRlbnYudG9rZW5zID0gXy50b2tlbml6ZShlbnYuY29kZSwgZW52LmdyYW1tYXIpO1xuXHRcdF8uaG9va3MucnVuKCdhZnRlci10b2tlbml6ZScsIGVudik7XG5cdFx0cmV0dXJuIFRva2VuLnN0cmluZ2lmeShfLnV0aWwuZW5jb2RlKGVudi50b2tlbnMpLCBlbnYubGFuZ3VhZ2UpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBUaGlzIGlzIHRoZSBoZWFydCBvZiBQcmlzbSwgYW5kIHRoZSBtb3N0IGxvdy1sZXZlbCBmdW5jdGlvbiB5b3UgY2FuIHVzZS4gSXQgYWNjZXB0cyBhIHN0cmluZyBvZiB0ZXh0IGFzIGlucHV0XG5cdCAqIGFuZCB0aGUgbGFuZ3VhZ2UgZGVmaW5pdGlvbnMgdG8gdXNlLCBhbmQgcmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSB0b2tlbml6ZWQgY29kZS5cblx0ICpcblx0ICogV2hlbiB0aGUgbGFuZ3VhZ2UgZGVmaW5pdGlvbiBpbmNsdWRlcyBuZXN0ZWQgdG9rZW5zLCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIHJlY3Vyc2l2ZWx5IG9uIGVhY2ggb2YgdGhlc2UgdG9rZW5zLlxuXHQgKlxuXHQgKiBUaGlzIG1ldGhvZCBjb3VsZCBiZSB1c2VmdWwgaW4gb3RoZXIgY29udGV4dHMgYXMgd2VsbCwgYXMgYSB2ZXJ5IGNydWRlIHBhcnNlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgQSBzdHJpbmcgd2l0aCB0aGUgY29kZSB0byBiZSBoaWdobGlnaHRlZC5cblx0ICogQHBhcmFtIHtHcmFtbWFyfSBncmFtbWFyIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0b2tlbnMgdG8gdXNlLlxuXHQgKlxuXHQgKiBVc3VhbGx5IGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiBsaWtlIGBQcmlzbS5sYW5ndWFnZXMubWFya3VwYC5cblx0ICogQHJldHVybnMge1Rva2VuU3RyZWFtfSBBbiBhcnJheSBvZiBzdHJpbmdzIGFuZCB0b2tlbnMsIGEgdG9rZW4gc3RyZWFtLlxuXHQgKiBAbWVtYmVyb2YgUHJpc21cblx0ICogQHB1YmxpY1xuXHQgKiBAZXhhbXBsZVxuXHQgKiBsZXQgY29kZSA9IGB2YXIgZm9vID0gMDtgO1xuXHQgKiBsZXQgdG9rZW5zID0gUHJpc20udG9rZW5pemUoY29kZSwgUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQpO1xuXHQgKiB0b2tlbnMuZm9yRWFjaCh0b2tlbiA9PiB7XG5cdCAqICAgICBpZiAodG9rZW4gaW5zdGFuY2VvZiBQcmlzbS5Ub2tlbiAmJiB0b2tlbi50eXBlID09PSAnbnVtYmVyJykge1xuXHQgKiAgICAgICAgIGNvbnNvbGUubG9nKGBGb3VuZCBudW1lcmljIGxpdGVyYWw6ICR7dG9rZW4uY29udGVudH1gKTtcblx0ICogICAgIH1cblx0ICogfSk7XG5cdCAqL1xuXHR0b2tlbml6ZTogZnVuY3Rpb24odGV4dCwgZ3JhbW1hcikge1xuXHRcdHZhciByZXN0ID0gZ3JhbW1hci5yZXN0O1xuXHRcdGlmIChyZXN0KSB7XG5cdFx0XHRmb3IgKHZhciB0b2tlbiBpbiByZXN0KSB7XG5cdFx0XHRcdGdyYW1tYXJbdG9rZW5dID0gcmVzdFt0b2tlbl07XG5cdFx0XHR9XG5cblx0XHRcdGRlbGV0ZSBncmFtbWFyLnJlc3Q7XG5cdFx0fVxuXG5cdFx0dmFyIHRva2VuTGlzdCA9IG5ldyBMaW5rZWRMaXN0KCk7XG5cdFx0YWRkQWZ0ZXIodG9rZW5MaXN0LCB0b2tlbkxpc3QuaGVhZCwgdGV4dCk7XG5cblx0XHRtYXRjaEdyYW1tYXIodGV4dCwgdG9rZW5MaXN0LCBncmFtbWFyLCB0b2tlbkxpc3QuaGVhZCwgMCk7XG5cblx0XHRyZXR1cm4gdG9BcnJheSh0b2tlbkxpc3QpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAbmFtZXNwYWNlXG5cdCAqIEBtZW1iZXJvZiBQcmlzbVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRob29rczoge1xuXHRcdGFsbDoge30sXG5cblx0XHQvKipcblx0XHQgKiBBZGRzIHRoZSBnaXZlbiBjYWxsYmFjayB0byB0aGUgbGlzdCBvZiBjYWxsYmFja3MgZm9yIHRoZSBnaXZlbiBob29rLlxuXHRcdCAqXG5cdFx0ICogVGhlIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBob29rIGl0IGlzIHJlZ2lzdGVyZWQgZm9yIGlzIHJ1bi5cblx0XHQgKiBIb29rcyBhcmUgdXN1YWxseSBkaXJlY3RseSBydW4gYnkgYSBoaWdobGlnaHQgZnVuY3Rpb24gYnV0IHlvdSBjYW4gYWxzbyBydW4gaG9va3MgeW91cnNlbGYuXG5cdFx0ICpcblx0XHQgKiBPbmUgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHJlZ2lzdGVyZWQgdG8gbXVsdGlwbGUgaG9va3MgYW5kIHRoZSBzYW1lIGhvb2sgbXVsdGlwbGUgdGltZXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgaG9vay5cblx0XHQgKiBAcGFyYW0ge0hvb2tDYWxsYmFja30gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdoaWNoIGlzIGdpdmVuIGVudmlyb25tZW50IHZhcmlhYmxlcy5cblx0XHQgKiBAcHVibGljXG5cdFx0ICovXG5cdFx0YWRkOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBob29rcyA9IF8uaG9va3MuYWxsO1xuXG5cdFx0XHRob29rc1tuYW1lXSA9IGhvb2tzW25hbWVdIHx8IFtdO1xuXG5cdFx0XHRob29rc1tuYW1lXS5wdXNoKGNhbGxiYWNrKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUnVucyBhIGhvb2sgaW52b2tpbmcgYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIHdpdGggdGhlIGdpdmVuIGVudmlyb25tZW50IHZhcmlhYmxlcy5cblx0XHQgKlxuXHRcdCAqIENhbGxiYWNrcyB3aWxsIGJlIGludm9rZWQgc3luY2hyb25vdXNseSBhbmQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIHRoZXkgd2VyZSByZWdpc3RlcmVkLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGhvb2suXG5cdFx0ICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBlbnYgVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyBvZiB0aGUgaG9vayBwYXNzZWQgdG8gYWxsIGNhbGxiYWNrcyByZWdpc3RlcmVkLlxuXHRcdCAqIEBwdWJsaWNcblx0XHQgKi9cblx0XHRydW46IGZ1bmN0aW9uIChuYW1lLCBlbnYpIHtcblx0XHRcdHZhciBjYWxsYmFja3MgPSBfLmhvb2tzLmFsbFtuYW1lXTtcblxuXHRcdFx0aWYgKCFjYWxsYmFja3MgfHwgIWNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBpPTAsIGNhbGxiYWNrOyBjYWxsYmFjayA9IGNhbGxiYWNrc1tpKytdOykge1xuXHRcdFx0XHRjYWxsYmFjayhlbnYpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRUb2tlbjogVG9rZW5cbn07XG5fc2VsZi5QcmlzbSA9IF87XG5cblxuLy8gVHlwZXNjcmlwdCBub3RlOlxuLy8gVGhlIGZvbGxvd2luZyBjYW4gYmUgdXNlZCB0byBpbXBvcnQgdGhlIFRva2VuIHR5cGUgaW4gSlNEb2M6XG4vL1xuLy8gICBAdHlwZWRlZiB7SW5zdGFuY2VUeXBlPGltcG9ydChcIi4vcHJpc20tY29yZVwiKVtcIlRva2VuXCJdPn0gVG9rZW5cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRva2VuLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFNlZSB7QGxpbmsgVG9rZW4jdHlwZSB0eXBlfVxuICogQHBhcmFtIHtzdHJpbmcgfCBUb2tlblN0cmVhbX0gY29udGVudCBTZWUge0BsaW5rIFRva2VuI2NvbnRlbnQgY29udGVudH1cbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBbYWxpYXNdIFRoZSBhbGlhcyhlcykgb2YgdGhlIHRva2VuLlxuICogQHBhcmFtIHtzdHJpbmd9IFttYXRjaGVkU3RyPVwiXCJdIEEgY29weSBvZiB0aGUgZnVsbCBzdHJpbmcgdGhpcyB0b2tlbiB3YXMgY3JlYXRlZCBmcm9tLlxuICogQGNsYXNzXG4gKiBAZ2xvYmFsXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIFRva2VuKHR5cGUsIGNvbnRlbnQsIGFsaWFzLCBtYXRjaGVkU3RyKSB7XG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgdG9rZW4uXG5cdCAqXG5cdCAqIFRoaXMgaXMgdXN1YWxseSB0aGUga2V5IG9mIGEgcGF0dGVybiBpbiBhIHtAbGluayBHcmFtbWFyfS5cblx0ICpcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICogQHNlZSBHcmFtbWFyVG9rZW5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0dGhpcy50eXBlID0gdHlwZTtcblx0LyoqXG5cdCAqIFRoZSBzdHJpbmdzIG9yIHRva2VucyBjb250YWluZWQgYnkgdGhpcyB0b2tlbi5cblx0ICpcblx0ICogVGhpcyB3aWxsIGJlIGEgdG9rZW4gc3RyZWFtIGlmIHRoZSBwYXR0ZXJuIG1hdGNoZWQgYWxzbyBkZWZpbmVkIGFuIGBpbnNpZGVgIGdyYW1tYXIuXG5cdCAqXG5cdCAqIEB0eXBlIHtzdHJpbmcgfCBUb2tlblN0cmVhbX1cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0dGhpcy5jb250ZW50ID0gY29udGVudDtcblx0LyoqXG5cdCAqIFRoZSBhbGlhcyhlcykgb2YgdGhlIHRva2VuLlxuXHQgKlxuXHQgKiBAdHlwZSB7c3RyaW5nfHN0cmluZ1tdfVxuXHQgKiBAc2VlIEdyYW1tYXJUb2tlblxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHR0aGlzLmFsaWFzID0gYWxpYXM7XG5cdC8vIENvcHkgb2YgdGhlIGZ1bGwgc3RyaW5nIHRoaXMgdG9rZW4gd2FzIGNyZWF0ZWQgZnJvbVxuXHR0aGlzLmxlbmd0aCA9IChtYXRjaGVkU3RyIHx8ICcnKS5sZW5ndGggfCAwO1xufVxuXG4vKipcbiAqIEEgdG9rZW4gc3RyZWFtIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIHtAbGluayBUb2tlbiBUb2tlbn0gb2JqZWN0cy5cbiAqXG4gKiBUb2tlbiBzdHJlYW1zIGhhdmUgdG8gZnVsZmlsbCBhIGZldyBwcm9wZXJ0aWVzIHRoYXQgYXJlIGFzc3VtZWQgYnkgbW9zdCBmdW5jdGlvbnMgKG1vc3RseSBpbnRlcm5hbCBvbmVzKSB0aGF0IHByb2Nlc3NcbiAqIHRoZW0uXG4gKlxuICogMS4gTm8gYWRqYWNlbnQgc3RyaW5ncy5cbiAqIDIuIE5vIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogICAgVGhlIG9ubHkgZXhjZXB0aW9uIGhlcmUgaXMgdGhlIHRva2VuIHN0cmVhbSB0aGF0IG9ubHkgY29udGFpbnMgdGhlIGVtcHR5IHN0cmluZyBhbmQgbm90aGluZyBlbHNlLlxuICpcbiAqIEB0eXBlZGVmIHtBcnJheTxzdHJpbmcgfCBUb2tlbj59IFRva2VuU3RyZWFtXG4gKiBAZ2xvYmFsXG4gKiBAcHVibGljXG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gdG9rZW4gb3IgdG9rZW4gc3RyZWFtIHRvIGFuIEhUTUwgcmVwcmVzZW50YXRpb24uXG4gKlxuICogVGhlIGZvbGxvd2luZyBob29rcyB3aWxsIGJlIHJ1bjpcbiAqIDEuIGB3cmFwYDogT24gZWFjaCB7QGxpbmsgVG9rZW59LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgVG9rZW4gfCBUb2tlblN0cmVhbX0gbyBUaGUgdG9rZW4gb3IgdG9rZW4gc3RyZWFtIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSBUaGUgbmFtZSBvZiBjdXJyZW50IGxhbmd1YWdlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIEhUTUwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRva2VuIG9yIHRva2VuIHN0cmVhbS5cbiAqIEBtZW1iZXJvZiBUb2tlblxuICogQHN0YXRpY1xuICovXG5Ub2tlbi5zdHJpbmdpZnkgPSBmdW5jdGlvbiBzdHJpbmdpZnkobywgbGFuZ3VhZ2UpIHtcblx0aWYgKHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIG87XG5cdH1cblx0aWYgKEFycmF5LmlzQXJyYXkobykpIHtcblx0XHR2YXIgcyA9ICcnO1xuXHRcdG8uZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuXHRcdFx0cyArPSBzdHJpbmdpZnkoZSwgbGFuZ3VhZ2UpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBzO1xuXHR9XG5cblx0dmFyIGVudiA9IHtcblx0XHR0eXBlOiBvLnR5cGUsXG5cdFx0Y29udGVudDogc3RyaW5naWZ5KG8uY29udGVudCwgbGFuZ3VhZ2UpLFxuXHRcdHRhZzogJ3NwYW4nLFxuXHRcdGNsYXNzZXM6IFsndG9rZW4nLCBvLnR5cGVdLFxuXHRcdGF0dHJpYnV0ZXM6IHt9LFxuXHRcdGxhbmd1YWdlOiBsYW5ndWFnZVxuXHR9O1xuXG5cdHZhciBhbGlhc2VzID0gby5hbGlhcztcblx0aWYgKGFsaWFzZXMpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhbGlhc2VzKSkge1xuXHRcdFx0QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZW52LmNsYXNzZXMsIGFsaWFzZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbnYuY2xhc3Nlcy5wdXNoKGFsaWFzZXMpO1xuXHRcdH1cblx0fVxuXG5cdF8uaG9va3MucnVuKCd3cmFwJywgZW52KTtcblxuXHR2YXIgYXR0cmlidXRlcyA9ICcnO1xuXHRmb3IgKHZhciBuYW1lIGluIGVudi5hdHRyaWJ1dGVzKSB7XG5cdFx0YXR0cmlidXRlcyArPSAnICcgKyBuYW1lICsgJz1cIicgKyAoZW52LmF0dHJpYnV0ZXNbbmFtZV0gfHwgJycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKSArICdcIic7XG5cdH1cblxuXHRyZXR1cm4gJzwnICsgZW52LnRhZyArICcgY2xhc3M9XCInICsgZW52LmNsYXNzZXMuam9pbignICcpICsgJ1wiJyArIGF0dHJpYnV0ZXMgKyAnPicgKyBlbnYuY29udGVudCArICc8LycgKyBlbnYudGFnICsgJz4nO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICogQHBhcmFtIHtMaW5rZWRMaXN0PHN0cmluZyB8IFRva2VuPn0gdG9rZW5MaXN0XG4gKiBAcGFyYW0ge2FueX0gZ3JhbW1hclxuICogQHBhcmFtIHtMaW5rZWRMaXN0Tm9kZTxzdHJpbmcgfCBUb2tlbj59IHN0YXJ0Tm9kZVxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0UG9zXG4gKiBAcGFyYW0ge1JlbWF0Y2hPcHRpb25zfSBbcmVtYXRjaF1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQHByaXZhdGVcbiAqXG4gKiBAdHlwZWRlZiBSZW1hdGNoT3B0aW9uc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGNhdXNlXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmVhY2hcbiAqL1xuZnVuY3Rpb24gbWF0Y2hHcmFtbWFyKHRleHQsIHRva2VuTGlzdCwgZ3JhbW1hciwgc3RhcnROb2RlLCBzdGFydFBvcywgcmVtYXRjaCkge1xuXHRmb3IgKHZhciB0b2tlbiBpbiBncmFtbWFyKSB7XG5cdFx0aWYgKCFncmFtbWFyLmhhc093blByb3BlcnR5KHRva2VuKSB8fCAhZ3JhbW1hclt0b2tlbl0pIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdHZhciBwYXR0ZXJucyA9IGdyYW1tYXJbdG9rZW5dO1xuXHRcdHBhdHRlcm5zID0gQXJyYXkuaXNBcnJheShwYXR0ZXJucykgPyBwYXR0ZXJucyA6IFtwYXR0ZXJuc107XG5cblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHBhdHRlcm5zLmxlbmd0aDsgKytqKSB7XG5cdFx0XHRpZiAocmVtYXRjaCAmJiByZW1hdGNoLmNhdXNlID09IHRva2VuICsgJywnICsgaikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwYXR0ZXJuT2JqID0gcGF0dGVybnNbal0sXG5cdFx0XHRcdGluc2lkZSA9IHBhdHRlcm5PYmouaW5zaWRlLFxuXHRcdFx0XHRsb29rYmVoaW5kID0gISFwYXR0ZXJuT2JqLmxvb2tiZWhpbmQsXG5cdFx0XHRcdGdyZWVkeSA9ICEhcGF0dGVybk9iai5ncmVlZHksXG5cdFx0XHRcdGxvb2tiZWhpbmRMZW5ndGggPSAwLFxuXHRcdFx0XHRhbGlhcyA9IHBhdHRlcm5PYmouYWxpYXM7XG5cblx0XHRcdGlmIChncmVlZHkgJiYgIXBhdHRlcm5PYmoucGF0dGVybi5nbG9iYWwpIHtcblx0XHRcdFx0Ly8gV2l0aG91dCB0aGUgZ2xvYmFsIGZsYWcsIGxhc3RJbmRleCB3b24ndCB3b3JrXG5cdFx0XHRcdHZhciBmbGFncyA9IHBhdHRlcm5PYmoucGF0dGVybi50b1N0cmluZygpLm1hdGNoKC9baW1zdXldKiQvKVswXTtcblx0XHRcdFx0cGF0dGVybk9iai5wYXR0ZXJuID0gUmVnRXhwKHBhdHRlcm5PYmoucGF0dGVybi5zb3VyY2UsIGZsYWdzICsgJ2cnKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqIEB0eXBlIHtSZWdFeHB9ICovXG5cdFx0XHR2YXIgcGF0dGVybiA9IHBhdHRlcm5PYmoucGF0dGVybiB8fCBwYXR0ZXJuT2JqO1xuXG5cdFx0XHRmb3IgKCAvLyBpdGVyYXRlIHRoZSB0b2tlbiBsaXN0IGFuZCBrZWVwIHRyYWNrIG9mIHRoZSBjdXJyZW50IHRva2VuL3N0cmluZyBwb3NpdGlvblxuXHRcdFx0XHR2YXIgY3VycmVudE5vZGUgPSBzdGFydE5vZGUubmV4dCwgcG9zID0gc3RhcnRQb3M7XG5cdFx0XHRcdGN1cnJlbnROb2RlICE9PSB0b2tlbkxpc3QudGFpbDtcblx0XHRcdFx0cG9zICs9IGN1cnJlbnROb2RlLnZhbHVlLmxlbmd0aCwgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0XG5cdFx0XHQpIHtcblxuXHRcdFx0XHRpZiAocmVtYXRjaCAmJiBwb3MgPj0gcmVtYXRjaC5yZWFjaCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHN0ciA9IGN1cnJlbnROb2RlLnZhbHVlO1xuXG5cdFx0XHRcdGlmICh0b2tlbkxpc3QubGVuZ3RoID4gdGV4dC5sZW5ndGgpIHtcblx0XHRcdFx0XHQvLyBTb21ldGhpbmcgd2VudCB0ZXJyaWJseSB3cm9uZywgQUJPUlQsIEFCT1JUIVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzdHIgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHJlbW92ZUNvdW50ID0gMTsgLy8gdGhpcyBpcyB0aGUgdG8gcGFyYW1ldGVyIG9mIHJlbW92ZUJldHdlZW5cblxuXHRcdFx0XHRpZiAoZ3JlZWR5ICYmIGN1cnJlbnROb2RlICE9IHRva2VuTGlzdC50YWlsLnByZXYpIHtcblx0XHRcdFx0XHRwYXR0ZXJuLmxhc3RJbmRleCA9IHBvcztcblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWModGV4dCk7XG5cdFx0XHRcdFx0aWYgKCFtYXRjaCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGZyb20gPSBtYXRjaC5pbmRleCArIChsb29rYmVoaW5kICYmIG1hdGNoWzFdID8gbWF0Y2hbMV0ubGVuZ3RoIDogMCk7XG5cdFx0XHRcdFx0dmFyIHRvID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG5cdFx0XHRcdFx0dmFyIHAgPSBwb3M7XG5cblx0XHRcdFx0XHQvLyBmaW5kIHRoZSBub2RlIHRoYXQgY29udGFpbnMgdGhlIG1hdGNoXG5cdFx0XHRcdFx0cCArPSBjdXJyZW50Tm9kZS52YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKGZyb20gPj0gcCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0O1xuXHRcdFx0XHRcdFx0cCArPSBjdXJyZW50Tm9kZS52YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGFkanVzdCBwb3MgKGFuZCBwKVxuXHRcdFx0XHRcdHAgLT0gY3VycmVudE5vZGUudmFsdWUubGVuZ3RoO1xuXHRcdFx0XHRcdHBvcyA9IHA7XG5cblx0XHRcdFx0XHQvLyB0aGUgY3VycmVudCBub2RlIGlzIGEgVG9rZW4sIHRoZW4gdGhlIG1hdGNoIHN0YXJ0cyBpbnNpZGUgYW5vdGhlciBUb2tlbiwgd2hpY2ggaXMgaW52YWxpZFxuXHRcdFx0XHRcdGlmIChjdXJyZW50Tm9kZS52YWx1ZSBpbnN0YW5jZW9mIFRva2VuKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaW5kIHRoZSBsYXN0IG5vZGUgd2hpY2ggaXMgYWZmZWN0ZWQgYnkgdGhpcyBtYXRjaFxuXHRcdFx0XHRcdGZvciAoXG5cdFx0XHRcdFx0XHR2YXIgayA9IGN1cnJlbnROb2RlO1xuXHRcdFx0XHRcdFx0ayAhPT0gdG9rZW5MaXN0LnRhaWwgJiYgKHAgPCB0byB8fCB0eXBlb2Ygay52YWx1ZSA9PT0gJ3N0cmluZycpO1xuXHRcdFx0XHRcdFx0ayA9IGsubmV4dFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0cmVtb3ZlQ291bnQrKztcblx0XHRcdFx0XHRcdHAgKz0gay52YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlbW92ZUNvdW50LS07XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIHdpdGggdGhlIG5ldyBtYXRjaFxuXHRcdFx0XHRcdHN0ciA9IHRleHQuc2xpY2UocG9zLCBwKTtcblx0XHRcdFx0XHRtYXRjaC5pbmRleCAtPSBwb3M7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGF0dGVybi5sYXN0SW5kZXggPSAwO1xuXG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gcGF0dGVybi5leGVjKHN0cik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobG9va2JlaGluZCkge1xuXHRcdFx0XHRcdGxvb2tiZWhpbmRMZW5ndGggPSBtYXRjaFsxXSA/IG1hdGNoWzFdLmxlbmd0aCA6IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4ICsgbG9va2JlaGluZExlbmd0aCxcblx0XHRcdFx0XHRtYXRjaFN0ciA9IG1hdGNoWzBdLnNsaWNlKGxvb2tiZWhpbmRMZW5ndGgpLFxuXHRcdFx0XHRcdHRvID0gZnJvbSArIG1hdGNoU3RyLmxlbmd0aCxcblx0XHRcdFx0XHRiZWZvcmUgPSBzdHIuc2xpY2UoMCwgZnJvbSksXG5cdFx0XHRcdFx0YWZ0ZXIgPSBzdHIuc2xpY2UodG8pO1xuXG5cdFx0XHRcdHZhciByZWFjaCA9IHBvcyArIHN0ci5sZW5ndGg7XG5cdFx0XHRcdGlmIChyZW1hdGNoICYmIHJlYWNoID4gcmVtYXRjaC5yZWFjaCkge1xuXHRcdFx0XHRcdHJlbWF0Y2gucmVhY2ggPSByZWFjaDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciByZW1vdmVGcm9tID0gY3VycmVudE5vZGUucHJldjtcblxuXHRcdFx0XHRpZiAoYmVmb3JlKSB7XG5cdFx0XHRcdFx0cmVtb3ZlRnJvbSA9IGFkZEFmdGVyKHRva2VuTGlzdCwgcmVtb3ZlRnJvbSwgYmVmb3JlKTtcblx0XHRcdFx0XHRwb3MgKz0gYmVmb3JlLmxlbmd0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlbW92ZVJhbmdlKHRva2VuTGlzdCwgcmVtb3ZlRnJvbSwgcmVtb3ZlQ291bnQpO1xuXG5cdFx0XHRcdHZhciB3cmFwcGVkID0gbmV3IFRva2VuKHRva2VuLCBpbnNpZGUgPyBfLnRva2VuaXplKG1hdGNoU3RyLCBpbnNpZGUpIDogbWF0Y2hTdHIsIGFsaWFzLCBtYXRjaFN0cik7XG5cdFx0XHRcdGN1cnJlbnROb2RlID0gYWRkQWZ0ZXIodG9rZW5MaXN0LCByZW1vdmVGcm9tLCB3cmFwcGVkKTtcblxuXHRcdFx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdFx0XHRhZGRBZnRlcih0b2tlbkxpc3QsIGN1cnJlbnROb2RlLCBhZnRlcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocmVtb3ZlQ291bnQgPiAxKSB7XG5cdFx0XHRcdFx0Ly8gYXQgbGVhc3Qgb25lIFRva2VuIG9iamVjdCB3YXMgcmVtb3ZlZCwgc28gd2UgaGF2ZSB0byBkbyBzb21lIHJlbWF0Y2hpbmdcblx0XHRcdFx0XHQvLyB0aGlzIGNhbiBvbmx5IGhhcHBlbiBpZiB0aGUgY3VycmVudCBwYXR0ZXJuIGlzIGdyZWVkeVxuXHRcdFx0XHRcdG1hdGNoR3JhbW1hcih0ZXh0LCB0b2tlbkxpc3QsIGdyYW1tYXIsIGN1cnJlbnROb2RlLnByZXYsIHBvcywge1xuXHRcdFx0XHRcdFx0Y2F1c2U6IHRva2VuICsgJywnICsgaixcblx0XHRcdFx0XHRcdHJlYWNoOiByZWFjaFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQHR5cGVkZWYgTGlua2VkTGlzdE5vZGVcbiAqIEBwcm9wZXJ0eSB7VH0gdmFsdWVcbiAqIEBwcm9wZXJ0eSB7TGlua2VkTGlzdE5vZGU8VD4gfCBudWxsfSBwcmV2IFRoZSBwcmV2aW91cyBub2RlLlxuICogQHByb3BlcnR5IHtMaW5rZWRMaXN0Tm9kZTxUPiB8IG51bGx9IG5leHQgVGhlIG5leHQgbm9kZS5cbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIExpbmtlZExpc3QoKSB7XG5cdC8qKiBAdHlwZSB7TGlua2VkTGlzdE5vZGU8VD59ICovXG5cdHZhciBoZWFkID0geyB2YWx1ZTogbnVsbCwgcHJldjogbnVsbCwgbmV4dDogbnVsbCB9O1xuXHQvKiogQHR5cGUge0xpbmtlZExpc3ROb2RlPFQ+fSAqL1xuXHR2YXIgdGFpbCA9IHsgdmFsdWU6IG51bGwsIHByZXY6IGhlYWQsIG5leHQ6IG51bGwgfTtcblx0aGVhZC5uZXh0ID0gdGFpbDtcblxuXHQvKiogQHR5cGUge0xpbmtlZExpc3ROb2RlPFQ+fSAqL1xuXHR0aGlzLmhlYWQgPSBoZWFkO1xuXHQvKiogQHR5cGUge0xpbmtlZExpc3ROb2RlPFQ+fSAqL1xuXHR0aGlzLnRhaWwgPSB0YWlsO1xuXHR0aGlzLmxlbmd0aCA9IDA7XG59XG5cbi8qKlxuICogQWRkcyBhIG5ldyBub2RlIHdpdGggdGhlIGdpdmVuIHZhbHVlIHRvIHRoZSBsaXN0LlxuICogQHBhcmFtIHtMaW5rZWRMaXN0PFQ+fSBsaXN0XG4gKiBAcGFyYW0ge0xpbmtlZExpc3ROb2RlPFQ+fSBub2RlXG4gKiBAcGFyYW0ge1R9IHZhbHVlXG4gKiBAcmV0dXJucyB7TGlua2VkTGlzdE5vZGU8VD59IFRoZSBhZGRlZCBub2RlLlxuICogQHRlbXBsYXRlIFRcbiAqL1xuZnVuY3Rpb24gYWRkQWZ0ZXIobGlzdCwgbm9kZSwgdmFsdWUpIHtcblx0Ly8gYXNzdW1lcyB0aGF0IG5vZGUgIT0gbGlzdC50YWlsICYmIHZhbHVlcy5sZW5ndGggPj0gMFxuXHR2YXIgbmV4dCA9IG5vZGUubmV4dDtcblxuXHR2YXIgbmV3Tm9kZSA9IHsgdmFsdWU6IHZhbHVlLCBwcmV2OiBub2RlLCBuZXh0OiBuZXh0IH07XG5cdG5vZGUubmV4dCA9IG5ld05vZGU7XG5cdG5leHQucHJldiA9IG5ld05vZGU7XG5cdGxpc3QubGVuZ3RoKys7XG5cblx0cmV0dXJuIG5ld05vZGU7XG59XG4vKipcbiAqIFJlbW92ZXMgYGNvdW50YCBub2RlcyBhZnRlciB0aGUgZ2l2ZW4gbm9kZS4gVGhlIGdpdmVuIG5vZGUgd2lsbCBub3QgYmUgcmVtb3ZlZC5cbiAqIEBwYXJhbSB7TGlua2VkTGlzdDxUPn0gbGlzdFxuICogQHBhcmFtIHtMaW5rZWRMaXN0Tm9kZTxUPn0gbm9kZVxuICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gKiBAdGVtcGxhdGUgVFxuICovXG5mdW5jdGlvbiByZW1vdmVSYW5nZShsaXN0LCBub2RlLCBjb3VudCkge1xuXHR2YXIgbmV4dCA9IG5vZGUubmV4dDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudCAmJiBuZXh0ICE9PSBsaXN0LnRhaWw7IGkrKykge1xuXHRcdG5leHQgPSBuZXh0Lm5leHQ7XG5cdH1cblx0bm9kZS5uZXh0ID0gbmV4dDtcblx0bmV4dC5wcmV2ID0gbm9kZTtcblx0bGlzdC5sZW5ndGggLT0gaTtcbn1cbi8qKlxuICogQHBhcmFtIHtMaW5rZWRMaXN0PFQ+fSBsaXN0XG4gKiBAcmV0dXJucyB7VFtdfVxuICogQHRlbXBsYXRlIFRcbiAqL1xuZnVuY3Rpb24gdG9BcnJheShsaXN0KSB7XG5cdHZhciBhcnJheSA9IFtdO1xuXHR2YXIgbm9kZSA9IGxpc3QuaGVhZC5uZXh0O1xuXHR3aGlsZSAobm9kZSAhPT0gbGlzdC50YWlsKSB7XG5cdFx0YXJyYXkucHVzaChub2RlLnZhbHVlKTtcblx0XHRub2RlID0gbm9kZS5uZXh0O1xuXHR9XG5cdHJldHVybiBhcnJheTtcbn1cblxuXG5pZiAoIV9zZWxmLmRvY3VtZW50KSB7XG5cdGlmICghX3NlbGYuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdC8vIGluIE5vZGUuanNcblx0XHRyZXR1cm4gXztcblx0fVxuXG5cdGlmICghXy5kaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXIpIHtcblx0XHQvLyBJbiB3b3JrZXJcblx0XHRfc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2dCkge1xuXHRcdFx0dmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2dC5kYXRhKSxcblx0XHRcdFx0bGFuZyA9IG1lc3NhZ2UubGFuZ3VhZ2UsXG5cdFx0XHRcdGNvZGUgPSBtZXNzYWdlLmNvZGUsXG5cdFx0XHRcdGltbWVkaWF0ZUNsb3NlID0gbWVzc2FnZS5pbW1lZGlhdGVDbG9zZTtcblxuXHRcdFx0X3NlbGYucG9zdE1lc3NhZ2UoXy5oaWdobGlnaHQoY29kZSwgXy5sYW5ndWFnZXNbbGFuZ10sIGxhbmcpKTtcblx0XHRcdGlmIChpbW1lZGlhdGVDbG9zZSkge1xuXHRcdFx0XHRfc2VsZi5jbG9zZSgpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblx0fVxuXG5cdHJldHVybiBfO1xufVxuXG4vLyBHZXQgY3VycmVudCBzY3JpcHQgYW5kIGhpZ2hsaWdodFxudmFyIHNjcmlwdCA9IF8udXRpbC5jdXJyZW50U2NyaXB0KCk7XG5cbmlmIChzY3JpcHQpIHtcblx0Xy5maWxlbmFtZSA9IHNjcmlwdC5zcmM7XG5cblx0aWYgKHNjcmlwdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWFudWFsJykpIHtcblx0XHRfLm1hbnVhbCA9IHRydWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGlnaGxpZ2h0QXV0b21hdGljYWxseUNhbGxiYWNrKCkge1xuXHRpZiAoIV8ubWFudWFsKSB7XG5cdFx0Xy5oaWdobGlnaHRBbGwoKTtcblx0fVxufVxuXG5pZiAoIV8ubWFudWFsKSB7XG5cdC8vIElmIHRoZSBkb2N1bWVudCBzdGF0ZSBpcyBcImxvYWRpbmdcIiwgdGhlbiB3ZSdsbCB1c2UgRE9NQ29udGVudExvYWRlZC5cblx0Ly8gSWYgdGhlIGRvY3VtZW50IHN0YXRlIGlzIFwiaW50ZXJhY3RpdmVcIiBhbmQgdGhlIHByaXNtLmpzIHNjcmlwdCBpcyBkZWZlcnJlZCwgdGhlbiB3ZSdsbCBhbHNvIHVzZSB0aGVcblx0Ly8gRE9NQ29udGVudExvYWRlZCBldmVudCBiZWNhdXNlIHRoZXJlIG1pZ2h0IGJlIHNvbWUgcGx1Z2lucyBvciBsYW5ndWFnZXMgd2hpY2ggaGF2ZSBhbHNvIGJlZW4gZGVmZXJyZWQgYW5kIHRoZXlcblx0Ly8gbWlnaHQgdGFrZSBsb25nZXIgb25lIGFuaW1hdGlvbiBmcmFtZSB0byBleGVjdXRlIHdoaWNoIGNhbiBjcmVhdGUgYSByYWNlIGNvbmRpdGlvbiB3aGVyZSBvbmx5IHNvbWUgcGx1Z2lucyBoYXZlXG5cdC8vIGJlZW4gbG9hZGVkIHdoZW4gUHJpc20uaGlnaGxpZ2h0QWxsKCkgaXMgZXhlY3V0ZWQsIGRlcGVuZGluZyBvbiBob3cgZmFzdCByZXNvdXJjZXMgYXJlIGxvYWRlZC5cblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9QcmlzbUpTL3ByaXNtL2lzc3Vlcy8yMTAyXG5cdHZhciByZWFkeVN0YXRlID0gZG9jdW1lbnQucmVhZHlTdGF0ZTtcblx0aWYgKHJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJyB8fCByZWFkeVN0YXRlID09PSAnaW50ZXJhY3RpdmUnICYmIHNjcmlwdCAmJiBzY3JpcHQuZGVmZXIpIHtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaGlnaGxpZ2h0QXV0b21hdGljYWxseUNhbGxiYWNrKTtcblx0fSBlbHNlIHtcblx0XHRpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShoaWdobGlnaHRBdXRvbWF0aWNhbGx5Q2FsbGJhY2spO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChoaWdobGlnaHRBdXRvbWF0aWNhbGx5Q2FsbGJhY2ssIDE2KTtcblx0XHR9XG5cdH1cbn1cblxucmV0dXJuIF87XG5cbn0pKF9zZWxmKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gUHJpc207XG59XG5cbi8vIGhhY2sgZm9yIGNvbXBvbmVudHMgdG8gd29yayBjb3JyZWN0bHkgaW4gbm9kZS5qc1xuaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdGdsb2JhbC5QcmlzbSA9IFByaXNtO1xufVxuXG4vLyBzb21lIGFkZGl0aW9uYWwgZG9jdW1lbnRhdGlvbi90eXBlc1xuXG4vKipcbiAqIFRoZSBleHBhbnNpb24gb2YgYSBzaW1wbGUgYFJlZ0V4cGAgbGl0ZXJhbCB0byBzdXBwb3J0IGFkZGl0aW9uYWwgcHJvcGVydGllcy5cbiAqXG4gKiBAdHlwZWRlZiBHcmFtbWFyVG9rZW5cbiAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBwYXR0ZXJuIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gb2YgdGhlIHRva2VuLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbbG9va2JlaGluZD1mYWxzZV0gSWYgYHRydWVgLCB0aGVuIHRoZSBmaXJzdCBjYXB0dXJpbmcgZ3JvdXAgb2YgYHBhdHRlcm5gIHdpbGwgKGVmZmVjdGl2ZWx5KVxuICogYmVoYXZlIGFzIGEgbG9va2JlaGluZCBncm91cCBtZWFuaW5nIHRoYXQgdGhlIGNhcHR1cmVkIHRleHQgd2lsbCBub3QgYmUgcGFydCBvZiB0aGUgbWF0Y2hlZCB0ZXh0IG9mIHRoZSBuZXcgdG9rZW4uXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtncmVlZHk9ZmFsc2VdIFdoZXRoZXIgdGhlIHRva2VuIGlzIGdyZWVkeS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfHN0cmluZ1tdfSBbYWxpYXNdIEFuIG9wdGlvbmFsIGFsaWFzIG9yIGxpc3Qgb2YgYWxpYXNlcy5cbiAqIEBwcm9wZXJ0eSB7R3JhbW1hcn0gW2luc2lkZV0gVGhlIG5lc3RlZCBncmFtbWFyIG9mIHRoaXMgdG9rZW4uXG4gKlxuICogVGhlIGBpbnNpZGVgIGdyYW1tYXIgd2lsbCBiZSB1c2VkIHRvIHRva2VuaXplIHRoZSB0ZXh0IHZhbHVlIG9mIGVhY2ggdG9rZW4gb2YgdGhpcyBraW5kLlxuICpcbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbWFrZSBuZXN0ZWQgYW5kIGV2ZW4gcmVjdXJzaXZlIGxhbmd1YWdlIGRlZmluaXRpb25zLlxuICpcbiAqIE5vdGU6IFRoaXMgY2FuIGNhdXNlIGluZmluaXRlIHJlY3Vyc2lvbi4gQmUgY2FyZWZ1bCB3aGVuIHlvdSBlbWJlZCBkaWZmZXJlbnQgbGFuZ3VhZ2VzIG9yIGV2ZW4gdGhlIHNhbWUgbGFuZ3VhZ2UgaW50b1xuICogZWFjaCBhbm90aGVyLlxuICogQGdsb2JhbFxuICogQHB1YmxpY1xuKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBHcmFtbWFyXG4gKiBAdHlwZSB7T2JqZWN0PHN0cmluZywgUmVnRXhwIHwgR3JhbW1hclRva2VuIHwgQXJyYXk8UmVnRXhwIHwgR3JhbW1hclRva2VuPj59XG4gKiBAcHJvcGVydHkge0dyYW1tYXJ9IFtyZXN0XSBBbiBvcHRpb25hbCBncmFtbWFyIG9iamVjdCB0aGF0IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhpcyBncmFtbWFyLlxuICogQGdsb2JhbFxuICogQHB1YmxpY1xuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB3aGljaCB3aWxsIGludm9rZWQgYWZ0ZXIgYW4gZWxlbWVudCB3YXMgc3VjY2Vzc2Z1bGx5IGhpZ2hsaWdodGVkLlxuICpcbiAqIEBjYWxsYmFjayBIaWdobGlnaHRDYWxsYmFja1xuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHN1Y2Nlc3NmdWxseSBoaWdobGlnaHRlZC5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGdsb2JhbFxuICogQHB1YmxpY1xuKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgSG9va0NhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdDxzdHJpbmcsIGFueT59IGVudiBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIG9mIHRoZSBob29rLlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZ2xvYmFsXG4gKiBAcHVibGljXG4gKi9cblxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgIEJlZ2luIHByaXNtLW1hcmt1cC5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5QcmlzbS5sYW5ndWFnZXMubWFya3VwID0ge1xuXHQnY29tbWVudCc6IC88IS0tW1xcc1xcU10qPy0tPi8sXG5cdCdwcm9sb2cnOiAvPFxcP1tcXHNcXFNdKz9cXD8+Lyxcblx0J2RvY3R5cGUnOiB7XG5cdFx0Ly8gaHR0cHM6Ly93d3cudzMub3JnL1RSL3htbC8jTlQtZG9jdHlwZWRlY2xcblx0XHRwYXR0ZXJuOiAvPCFET0NUWVBFKD86W14+XCInW1xcXV18XCJbXlwiXSpcInwnW14nXSonKSsoPzpcXFsoPzpbXjxcIidcXF1dfFwiW15cIl0qXCJ8J1teJ10qJ3w8KD8hIS0tKXw8IS0tKD86W14tXXwtKD8hLT4pKSotLT4pKlxcXVxccyopPz4vaSxcblx0XHRncmVlZHk6IHRydWUsXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQnaW50ZXJuYWwtc3Vic2V0Jzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvKFxcWylbXFxzXFxTXSsoPz1cXF0+JCkvLFxuXHRcdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0XHRncmVlZHk6IHRydWUsXG5cdFx0XHRcdGluc2lkZTogbnVsbCAvLyBzZWUgYmVsb3dcblx0XHRcdH0sXG5cdFx0XHQnc3RyaW5nJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvXCJbXlwiXSpcInwnW14nXSonLyxcblx0XHRcdFx0Z3JlZWR5OiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0J3B1bmN0dWF0aW9uJzogL148IXw+JHxbW1xcXV0vLFxuXHRcdFx0J2RvY3R5cGUtdGFnJzogL15ET0NUWVBFLyxcblx0XHRcdCduYW1lJzogL1teXFxzPD4nXCJdKy9cblx0XHR9XG5cdH0sXG5cdCdjZGF0YSc6IC88IVxcW0NEQVRBXFxbW1xcc1xcU10qP11dPi9pLFxuXHQndGFnJzoge1xuXHRcdHBhdHRlcm46IC88XFwvPyg/IVxcZClbXlxccz5cXC89JDwlXSsoPzpcXHMoPzpcXHMqW15cXHM+XFwvPV0rKD86XFxzKj1cXHMqKD86XCJbXlwiXSpcInwnW14nXSonfFteXFxzJ1wiPj1dKyg/PVtcXHM+XSkpfCg/PVtcXHMvPl0pKSkrKT9cXHMqXFwvPz4vLFxuXHRcdGdyZWVkeTogdHJ1ZSxcblx0XHRpbnNpZGU6IHtcblx0XHRcdCd0YWcnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9ePFxcLz9bXlxccz5cXC9dKy8sXG5cdFx0XHRcdGluc2lkZToge1xuXHRcdFx0XHRcdCdwdW5jdHVhdGlvbic6IC9ePFxcLz8vLFxuXHRcdFx0XHRcdCduYW1lc3BhY2UnOiAvXlteXFxzPlxcLzpdKzovXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQnYXR0ci12YWx1ZSc6IHtcblx0XHRcdFx0cGF0dGVybjogLz1cXHMqKD86XCJbXlwiXSpcInwnW14nXSonfFteXFxzJ1wiPj1dKykvLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQncHVuY3R1YXRpb24nOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHBhdHRlcm46IC9ePS8sXG5cdFx0XHRcdFx0XHRcdGFsaWFzOiAnYXR0ci1lcXVhbHMnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0L1wifCcvXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3B1bmN0dWF0aW9uJzogL1xcLz8+Lyxcblx0XHRcdCdhdHRyLW5hbWUnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9bXlxccz5cXC9dKy8sXG5cdFx0XHRcdGluc2lkZToge1xuXHRcdFx0XHRcdCduYW1lc3BhY2UnOiAvXlteXFxzPlxcLzpdKzovXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fSxcblx0J2VudGl0eSc6IFtcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvJltcXGRhLXpdezEsOH07L2ksXG5cdFx0XHRhbGlhczogJ25hbWVkLWVudGl0eSdcblx0XHR9LFxuXHRcdC8mI3g/W1xcZGEtZl17MSw4fTsvaVxuXHRdXG59O1xuXG5QcmlzbS5sYW5ndWFnZXMubWFya3VwWyd0YWcnXS5pbnNpZGVbJ2F0dHItdmFsdWUnXS5pbnNpZGVbJ2VudGl0eSddID1cblx0UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cFsnZW50aXR5J107XG5QcmlzbS5sYW5ndWFnZXMubWFya3VwWydkb2N0eXBlJ10uaW5zaWRlWydpbnRlcm5hbC1zdWJzZXQnXS5pbnNpZGUgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuXG4vLyBQbHVnaW4gdG8gbWFrZSBlbnRpdHkgdGl0bGUgc2hvdyB0aGUgcmVhbCBlbnRpdHksIGlkZWEgYnkgUm9tYW4gS29tYXJvdlxuUHJpc20uaG9va3MuYWRkKCd3cmFwJywgZnVuY3Rpb24gKGVudikge1xuXG5cdGlmIChlbnYudHlwZSA9PT0gJ2VudGl0eScpIHtcblx0XHRlbnYuYXR0cmlidXRlc1sndGl0bGUnXSA9IGVudi5jb250ZW50LnJlcGxhY2UoLyZhbXA7LywgJyYnKTtcblx0fVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZywgJ2FkZElubGluZWQnLCB7XG5cdC8qKlxuXHQgKiBBZGRzIGFuIGlubGluZWQgbGFuZ3VhZ2UgdG8gbWFya3VwLlxuXHQgKlxuXHQgKiBBbiBleGFtcGxlIG9mIGFuIGlubGluZWQgbGFuZ3VhZ2UgaXMgQ1NTIHdpdGggYDxzdHlsZT5gIHRhZ3MuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0YWdOYW1lIFRoZSBuYW1lIG9mIHRoZSB0YWcgdGhhdCBjb250YWlucyB0aGUgaW5saW5lZCBsYW5ndWFnZS4gVGhpcyBuYW1lIHdpbGwgYmUgdHJlYXRlZCBhc1xuXHQgKiBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbGFuZyBUaGUgbGFuZ3VhZ2Uga2V5LlxuXHQgKiBAZXhhbXBsZVxuXHQgKiBhZGRJbmxpbmVkKCdzdHlsZScsICdjc3MnKTtcblx0ICovXG5cdHZhbHVlOiBmdW5jdGlvbiBhZGRJbmxpbmVkKHRhZ05hbWUsIGxhbmcpIHtcblx0XHR2YXIgaW5jbHVkZWRDZGF0YUluc2lkZSA9IHt9O1xuXHRcdGluY2x1ZGVkQ2RhdGFJbnNpZGVbJ2xhbmd1YWdlLScgKyBsYW5nXSA9IHtcblx0XHRcdHBhdHRlcm46IC8oXjwhXFxbQ0RBVEFcXFspW1xcc1xcU10rPyg/PVxcXVxcXT4kKS9pLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzW2xhbmddXG5cdFx0fTtcblx0XHRpbmNsdWRlZENkYXRhSW5zaWRlWydjZGF0YSddID0gL148IVxcW0NEQVRBXFxbfFxcXVxcXT4kL2k7XG5cblx0XHR2YXIgaW5zaWRlID0ge1xuXHRcdFx0J2luY2x1ZGVkLWNkYXRhJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvPCFcXFtDREFUQVxcW1tcXHNcXFNdKj9cXF1cXF0+L2ksXG5cdFx0XHRcdGluc2lkZTogaW5jbHVkZWRDZGF0YUluc2lkZVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0aW5zaWRlWydsYW5ndWFnZS0nICsgbGFuZ10gPSB7XG5cdFx0XHRwYXR0ZXJuOiAvW1xcc1xcU10rLyxcblx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzW2xhbmddXG5cdFx0fTtcblxuXHRcdHZhciBkZWYgPSB7fTtcblx0XHRkZWZbdGFnTmFtZV0gPSB7XG5cdFx0XHRwYXR0ZXJuOiBSZWdFeHAoLyg8X19bXFxzXFxTXSo/PikoPzo8IVxcW0NEQVRBXFxbKD86W15cXF1dfFxcXSg/IVxcXT4pKSpcXF1cXF0+fCg/ITwhXFxbQ0RBVEFcXFspW1xcc1xcU10pKj8oPz08XFwvX18+KS8uc291cmNlLnJlcGxhY2UoL19fL2csIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRhZ05hbWU7IH0pLCAnaScpLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdGdyZWVkeTogdHJ1ZSxcblx0XHRcdGluc2lkZTogaW5zaWRlXG5cdFx0fTtcblxuXHRcdFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ21hcmt1cCcsICdjZGF0YScsIGRlZik7XG5cdH1cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaHRtbCA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXA7XG5QcmlzbS5sYW5ndWFnZXMubWF0aG1sID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cDtcblByaXNtLmxhbmd1YWdlcy5zdmcgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuXG5QcmlzbS5sYW5ndWFnZXMueG1sID0gUHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgnbWFya3VwJywge30pO1xuUHJpc20ubGFuZ3VhZ2VzLnNzbWwgPSBQcmlzbS5sYW5ndWFnZXMueG1sO1xuUHJpc20ubGFuZ3VhZ2VzLmF0b20gPSBQcmlzbS5sYW5ndWFnZXMueG1sO1xuUHJpc20ubGFuZ3VhZ2VzLnJzcyA9IFByaXNtLmxhbmd1YWdlcy54bWw7XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1jc3MuanNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuKGZ1bmN0aW9uIChQcmlzbSkge1xuXG5cdHZhciBzdHJpbmcgPSAvKFwifCcpKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS87XG5cblx0UHJpc20ubGFuZ3VhZ2VzLmNzcyA9IHtcblx0XHQnY29tbWVudCc6IC9cXC9cXCpbXFxzXFxTXSo/XFwqXFwvLyxcblx0XHQnYXRydWxlJzoge1xuXHRcdFx0cGF0dGVybjogL0BbXFx3LV0rW1xcc1xcU10qPyg/Ojt8KD89XFxzKlxceykpLyxcblx0XHRcdGluc2lkZToge1xuXHRcdFx0XHQncnVsZSc6IC9eQFtcXHctXSsvLFxuXHRcdFx0XHQnc2VsZWN0b3ItZnVuY3Rpb24tYXJndW1lbnQnOiB7XG5cdFx0XHRcdFx0cGF0dGVybjogLyhcXGJzZWxlY3RvclxccypcXCgoPyFcXHMqXFwpKVxccyopKD86W14oKV18XFwoKD86W14oKV18XFwoW14oKV0qXFwpKSpcXCkpKz8oPz1cXHMqXFwpKS8sXG5cdFx0XHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdFx0XHRhbGlhczogJ3NlbGVjdG9yJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQna2V5d29yZCc6IHtcblx0XHRcdFx0XHRwYXR0ZXJuOiAvKF58W15cXHctXSkoPzphbmR8bm90fG9ubHl8b3IpKD8hW1xcdy1dKS8sXG5cdFx0XHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIFNlZSByZXN0IGJlbG93XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQndXJsJzoge1xuXHRcdFx0Ly8gaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuXHRcdFx0cGF0dGVybjogUmVnRXhwKCdcXFxcYnVybFxcXFwoKD86JyArIHN0cmluZy5zb3VyY2UgKyAnfCcgKyAvKD86W15cXFxcXFxyXFxuKClcIiddfFxcXFxbXFxzXFxTXSkqLy5zb3VyY2UgKyAnKVxcXFwpJywgJ2knKSxcblx0XHRcdGdyZWVkeTogdHJ1ZSxcblx0XHRcdGluc2lkZToge1xuXHRcdFx0XHQnZnVuY3Rpb24nOiAvXnVybC9pLFxuXHRcdFx0XHQncHVuY3R1YXRpb24nOiAvXlxcKHxcXCkkLyxcblx0XHRcdFx0J3N0cmluZyc6IHtcblx0XHRcdFx0XHRwYXR0ZXJuOiBSZWdFeHAoJ14nICsgc3RyaW5nLnNvdXJjZSArICckJyksXG5cdFx0XHRcdFx0YWxpYXM6ICd1cmwnXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdCdzZWxlY3Rvcic6IFJlZ0V4cCgnW157fVxcXFxzXSg/Oltee307XCJcXCddfCcgKyBzdHJpbmcuc291cmNlICsgJykqPyg/PVxcXFxzKlxcXFx7KScpLFxuXHRcdCdzdHJpbmcnOiB7XG5cdFx0XHRwYXR0ZXJuOiBzdHJpbmcsXG5cdFx0XHRncmVlZHk6IHRydWVcblx0XHR9LFxuXHRcdCdwcm9wZXJ0eSc6IC9bLV9hLXpcXHhBMC1cXHVGRkZGXVstXFx3XFx4QTAtXFx1RkZGRl0qKD89XFxzKjopL2ksXG5cdFx0J2ltcG9ydGFudCc6IC8haW1wb3J0YW50XFxiL2ksXG5cdFx0J2Z1bmN0aW9uJzogL1stYS16MC05XSsoPz1cXCgpL2ksXG5cdFx0J3B1bmN0dWF0aW9uJzogL1soKXt9OzosXS9cblx0fTtcblxuXHRQcmlzbS5sYW5ndWFnZXMuY3NzWydhdHJ1bGUnXS5pbnNpZGUucmVzdCA9IFByaXNtLmxhbmd1YWdlcy5jc3M7XG5cblx0dmFyIG1hcmt1cCA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXA7XG5cdGlmIChtYXJrdXApIHtcblx0XHRtYXJrdXAudGFnLmFkZElubGluZWQoJ3N0eWxlJywgJ2NzcycpO1xuXG5cdFx0UHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnaW5zaWRlJywgJ2F0dHItdmFsdWUnLCB7XG5cdFx0XHQnc3R5bGUtYXR0cic6IHtcblx0XHRcdFx0cGF0dGVybjogL1xccypzdHlsZT0oXCJ8JykoPzpcXFxcW1xcc1xcU118KD8hXFwxKVteXFxcXF0pKlxcMS9pLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQnYXR0ci1uYW1lJzoge1xuXHRcdFx0XHRcdFx0cGF0dGVybjogL15cXHMqc3R5bGUvaSxcblx0XHRcdFx0XHRcdGluc2lkZTogbWFya3VwLnRhZy5pbnNpZGVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCdwdW5jdHVhdGlvbic6IC9eXFxzKj1cXHMqWydcIl18WydcIl1cXHMqJC8sXG5cdFx0XHRcdFx0J2F0dHItdmFsdWUnOiB7XG5cdFx0XHRcdFx0XHRwYXR0ZXJuOiAvLisvaSxcblx0XHRcdFx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmNzc1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0YWxpYXM6ICdsYW5ndWFnZS1jc3MnXG5cdFx0XHR9XG5cdFx0fSwgbWFya3VwLnRhZyk7XG5cdH1cblxufShQcmlzbSkpO1xuXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgQmVnaW4gcHJpc20tY2xpa2UuanNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuUHJpc20ubGFuZ3VhZ2VzLmNsaWtlID0ge1xuXHQnY29tbWVudCc6IFtcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvKF58W15cXFxcXSlcXC9cXCpbXFxzXFxTXSo/KD86XFwqXFwvfCQpLyxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0XHR9LFxuXHRcdHtcblx0XHRcdHBhdHRlcm46IC8oXnxbXlxcXFw6XSlcXC9cXC8uKi8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0Z3JlZWR5OiB0cnVlXG5cdFx0fVxuXHRdLFxuXHQnc3RyaW5nJzoge1xuXHRcdHBhdHRlcm46IC8oW1wiJ10pKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG5cdFx0Z3JlZWR5OiB0cnVlXG5cdH0sXG5cdCdjbGFzcy1uYW1lJzoge1xuXHRcdHBhdHRlcm46IC8oXFxiKD86Y2xhc3N8aW50ZXJmYWNlfGV4dGVuZHN8aW1wbGVtZW50c3x0cmFpdHxpbnN0YW5jZW9mfG5ldylcXHMrfFxcYmNhdGNoXFxzK1xcKClbXFx3LlxcXFxdKy9pLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQncHVuY3R1YXRpb24nOiAvWy5cXFxcXS9cblx0XHR9XG5cdH0sXG5cdCdrZXl3b3JkJzogL1xcYig/OmlmfGVsc2V8d2hpbGV8ZG98Zm9yfHJldHVybnxpbnxpbnN0YW5jZW9mfGZ1bmN0aW9ufG5ld3x0cnl8dGhyb3d8Y2F0Y2h8ZmluYWxseXxudWxsfGJyZWFrfGNvbnRpbnVlKVxcYi8sXG5cdCdib29sZWFuJzogL1xcYig/OnRydWV8ZmFsc2UpXFxiLyxcblx0J2Z1bmN0aW9uJzogL1xcdysoPz1cXCgpLyxcblx0J251bWJlcic6IC9cXGIweFtcXGRhLWZdK1xcYnwoPzpcXGJcXGQrXFwuP1xcZCp8XFxCXFwuXFxkKykoPzplWystXT9cXGQrKT8vaSxcblx0J29wZXJhdG9yJzogL1s8Pl09P3xbIT1dPT89P3wtLT98XFwrXFwrP3wmJj98XFx8XFx8P3xbPyovfl4lXS8sXG5cdCdwdW5jdHVhdGlvbic6IC9be31bXFxdOygpLC46XS9cbn07XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1qYXZhc2NyaXB0LmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cblByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0ID0gUHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgnY2xpa2UnLCB7XG5cdCdjbGFzcy1uYW1lJzogW1xuXHRcdFByaXNtLmxhbmd1YWdlcy5jbGlrZVsnY2xhc3MtbmFtZSddLFxuXHRcdHtcblx0XHRcdHBhdHRlcm46IC8oXnxbXiRcXHdcXHhBMC1cXHVGRkZGXSlbXyRBLVpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKD89XFwuKD86cHJvdG90eXBlfGNvbnN0cnVjdG9yKSkvLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdH1cblx0XSxcblx0J2tleXdvcmQnOiBbXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLygoPzpefH0pXFxzKikoPzpjYXRjaHxmaW5hbGx5KVxcYi8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvKF58W14uXXxcXC5cXC5cXC5cXHMqKVxcYig/OmFzfGFzeW5jKD89XFxzKig/OmZ1bmN0aW9uXFxifFxcKHxbJFxcd1xceEEwLVxcdUZGRkZdfCQpKXxhd2FpdHxicmVha3xjYXNlfGNsYXNzfGNvbnN0fGNvbnRpbnVlfGRlYnVnZ2VyfGRlZmF1bHR8ZGVsZXRlfGRvfGVsc2V8ZW51bXxleHBvcnR8ZXh0ZW5kc3xmb3J8ZnJvbXxmdW5jdGlvbnwoPzpnZXR8c2V0KSg/PVxccypbXFxbJFxcd1xceEEwLVxcdUZGRkZdKXxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHVuZGVmaW5lZHx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkKVxcYi8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdFx0fSxcblx0XSxcblx0J251bWJlcic6IC9cXGIoPzooPzowW3hYXSg/OltcXGRBLUZhLWZdKD86X1tcXGRBLUZhLWZdKT8pK3wwW2JCXSg/OlswMV0oPzpfWzAxXSk/KSt8MFtvT10oPzpbMC03XSg/Ol9bMC03XSk/KSspbj98KD86XFxkKD86X1xcZCk/KStufE5hTnxJbmZpbml0eSlcXGJ8KD86XFxiKD86XFxkKD86X1xcZCk/KStcXC4/KD86XFxkKD86X1xcZCk/KSp8XFxCXFwuKD86XFxkKD86X1xcZCk/KSspKD86W0VlXVsrLV0/KD86XFxkKD86X1xcZCk/KSspPy8sXG5cdC8vIEFsbG93IGZvciBhbGwgbm9uLUFTQ0lJIGNoYXJhY3RlcnMgKFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMDA4NDQ0KVxuXHQnZnVuY3Rpb24nOiAvIz9bXyRhLXpBLVpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKD89XFxzKig/OlxcLlxccyooPzphcHBseXxiaW5kfGNhbGwpXFxzKik/XFwoKS8sXG5cdCdvcGVyYXRvcic6IC8tLXxcXCtcXCt8XFwqXFwqPT98PT58JiY9P3xcXHxcXHw9P3xbIT1dPT18PDw9P3w+Pj4/PT98Wy0rKi8lJnxeIT08Pl09P3xcXC57M318XFw/XFw/PT98XFw/XFwuP3xbfjpdL1xufSk7XG5cblByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0WydjbGFzcy1uYW1lJ11bMF0ucGF0dGVybiA9IC8oXFxiKD86Y2xhc3N8aW50ZXJmYWNlfGV4dGVuZHN8aW1wbGVtZW50c3xpbnN0YW5jZW9mfG5ldylcXHMrKVtcXHcuXFxcXF0rLztcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnamF2YXNjcmlwdCcsICdrZXl3b3JkJywge1xuXHQncmVnZXgnOiB7XG5cdFx0cGF0dGVybjogLygoPzpefFteJFxcd1xceEEwLVxcdUZGRkYuXCInXFxdKVxcc118XFxiKD86cmV0dXJufHlpZWxkKSlcXHMqKVxcLyg/OlxcWyg/OlteXFxdXFxcXFxcclxcbl18XFxcXC4pKl18XFxcXC58W14vXFxcXFxcW1xcclxcbl0pK1xcL1tnaW15dXNdezAsNn0oPz0oPzpcXHN8XFwvXFwqKD86W14qXXxcXCooPyFcXC8pKSpcXCpcXC8pKig/OiR8W1xcclxcbiwuOzp9KVxcXV18XFwvXFwvKSkvLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0Z3JlZWR5OiB0cnVlXG5cdH0sXG5cdC8vIFRoaXMgbXVzdCBiZSBkZWNsYXJlZCBiZWZvcmUga2V5d29yZCBiZWNhdXNlIHdlIHVzZSBcImZ1bmN0aW9uXCIgaW5zaWRlIHRoZSBsb29rLWZvcndhcmRcblx0J2Z1bmN0aW9uLXZhcmlhYmxlJzoge1xuXHRcdHBhdHRlcm46IC8jP1tfJGEtekEtWlxceEEwLVxcdUZGRkZdWyRcXHdcXHhBMC1cXHVGRkZGXSooPz1cXHMqWz06XVxccyooPzphc3luY1xccyopPyg/OlxcYmZ1bmN0aW9uXFxifCg/OlxcKCg/OlteKCldfFxcKFteKCldKlxcKSkqXFwpfFtfJGEtekEtWlxceEEwLVxcdUZGRkZdWyRcXHdcXHhBMC1cXHVGRkZGXSopXFxzKj0+KSkvLFxuXHRcdGFsaWFzOiAnZnVuY3Rpb24nXG5cdH0sXG5cdCdwYXJhbWV0ZXInOiBbXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhmdW5jdGlvbig/OlxccytbXyRBLVphLXpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKT9cXHMqXFwoXFxzKikoPyFcXHMpKD86W14oKV18XFwoW14oKV0qXFwpKSs/KD89XFxzKlxcKSkvLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRcblx0XHR9LFxuXHRcdHtcblx0XHRcdHBhdHRlcm46IC9bXyRhLXpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKD89XFxzKj0+KS9pLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhcXChcXHMqKSg/IVxccykoPzpbXigpXXxcXChbXigpXSpcXCkpKz8oPz1cXHMqXFwpXFxzKj0+KS8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLygoPzpcXGJ8XFxzfF4pKD8hKD86YXN8YXN5bmN8YXdhaXR8YnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmluYWxseXxmb3J8ZnJvbXxmdW5jdGlvbnxnZXR8aWZ8aW1wbGVtZW50c3xpbXBvcnR8aW58aW5zdGFuY2VvZnxpbnRlcmZhY2V8bGV0fG5ld3xudWxsfG9mfHBhY2thZ2V8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJldHVybnxzZXR8c3RhdGljfHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRyeXx0eXBlb2Z8dW5kZWZpbmVkfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpKD8hWyRcXHdcXHhBMC1cXHVGRkZGXSkpKD86W18kQS1aYS16XFx4QTAtXFx1RkZGRl1bJFxcd1xceEEwLVxcdUZGRkZdKlxccyopXFwoXFxzKnxcXF1cXHMqXFwoXFxzKikoPyFcXHMpKD86W14oKV18XFwoW14oKV0qXFwpKSs/KD89XFxzKlxcKVxccypcXHspLyxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0XG5cdFx0fVxuXHRdLFxuXHQnY29uc3RhbnQnOiAvXFxiW0EtWl0oPzpbQS1aX118XFxkeD8pKlxcYi9cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdqYXZhc2NyaXB0JywgJ3N0cmluZycsIHtcblx0J3RlbXBsYXRlLXN0cmluZyc6IHtcblx0XHRwYXR0ZXJuOiAvYCg/OlxcXFxbXFxzXFxTXXxcXCR7KD86W157fV18eyg/Oltee31dfHtbXn1dKn0pKn0pK318KD8hXFwkeylbXlxcXFxgXSkqYC8sXG5cdFx0Z3JlZWR5OiB0cnVlLFxuXHRcdGluc2lkZToge1xuXHRcdFx0J3RlbXBsYXRlLXB1bmN0dWF0aW9uJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvXmB8YCQvLFxuXHRcdFx0XHRhbGlhczogJ3N0cmluZydcblx0XHRcdH0sXG5cdFx0XHQnaW50ZXJwb2xhdGlvbic6IHtcblx0XHRcdFx0cGF0dGVybjogLygoPzpefFteXFxcXF0pKD86XFxcXHsyfSkqKVxcJHsoPzpbXnt9XXx7KD86W157fV18e1tefV0qfSkqfSkrfS8sXG5cdFx0XHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0XHRcdGluc2lkZToge1xuXHRcdFx0XHRcdCdpbnRlcnBvbGF0aW9uLXB1bmN0dWF0aW9uJzoge1xuXHRcdFx0XHRcdFx0cGF0dGVybjogL15cXCR7fH0kLyxcblx0XHRcdFx0XHRcdGFsaWFzOiAncHVuY3R1YXRpb24nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZXN0OiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3N0cmluZyc6IC9bXFxzXFxTXSsvXG5cdFx0fVxuXHR9XG59KTtcblxuaWYgKFByaXNtLmxhbmd1YWdlcy5tYXJrdXApIHtcblx0UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuYWRkSW5saW5lZCgnc2NyaXB0JywgJ2phdmFzY3JpcHQnKTtcbn1cblxuUHJpc20ubGFuZ3VhZ2VzLmpzID0gUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQ7XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1maWxlLWhpZ2hsaWdodC5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHRpZiAodHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnIHx8ICFzZWxmLlByaXNtIHx8ICFzZWxmLmRvY3VtZW50KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIFByaXNtID0gd2luZG93LlByaXNtO1xuXG5cdHZhciBMT0FESU5HX01FU1NBR0UgPSAnTG9hZGluZ+KApic7XG5cdHZhciBGQUlMVVJFX01FU1NBR0UgPSBmdW5jdGlvbiAoc3RhdHVzLCBtZXNzYWdlKSB7XG5cdFx0cmV0dXJuICfinJYgRXJyb3IgJyArIHN0YXR1cyArICcgd2hpbGUgZmV0Y2hpbmcgZmlsZTogJyArIG1lc3NhZ2U7XG5cdH07XG5cdHZhciBGQUlMVVJFX0VNUFRZX01FU1NBR0UgPSAn4pyWIEVycm9yOiBGaWxlIGRvZXMgbm90IGV4aXN0IG9yIGlzIGVtcHR5JztcblxuXHR2YXIgRVhURU5TSU9OUyA9IHtcblx0XHQnanMnOiAnamF2YXNjcmlwdCcsXG5cdFx0J3B5JzogJ3B5dGhvbicsXG5cdFx0J3JiJzogJ3J1YnknLFxuXHRcdCdwczEnOiAncG93ZXJzaGVsbCcsXG5cdFx0J3BzbTEnOiAncG93ZXJzaGVsbCcsXG5cdFx0J3NoJzogJ2Jhc2gnLFxuXHRcdCdiYXQnOiAnYmF0Y2gnLFxuXHRcdCdoJzogJ2MnLFxuXHRcdCd0ZXgnOiAnbGF0ZXgnXG5cdH07XG5cblx0dmFyIFNUQVRVU19BVFRSID0gJ2RhdGEtc3JjLXN0YXR1cyc7XG5cdHZhciBTVEFUVVNfTE9BRElORyA9ICdsb2FkaW5nJztcblx0dmFyIFNUQVRVU19MT0FERUQgPSAnbG9hZGVkJztcblx0dmFyIFNUQVRVU19GQUlMRUQgPSAnZmFpbGVkJztcblxuXHR2YXIgU0VMRUNUT1IgPSAncHJlW2RhdGEtc3JjXTpub3QoWycgKyBTVEFUVVNfQVRUUiArICc9XCInICsgU1RBVFVTX0xPQURFRCArICdcIl0pJ1xuXHRcdCsgJzpub3QoWycgKyBTVEFUVVNfQVRUUiArICc9XCInICsgU1RBVFVTX0xPQURJTkcgKyAnXCJdKSc7XG5cblx0dmFyIGxhbmcgPSAvXFxibGFuZyg/OnVhZ2UpPy0oW1xcdy1dKylcXGIvaTtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgUHJpc20gYGxhbmd1YWdlLXh4eHhgIG9yIGBsYW5nLXh4eHhgIGNsYXNzIHRvIHRoZSBnaXZlbiBsYW5ndWFnZS5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2Vcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRMYW5ndWFnZUNsYXNzKGVsZW1lbnQsIGxhbmd1YWdlKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lO1xuXHRcdGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKGxhbmcsICcgJykgKyAnIGxhbmd1YWdlLScgKyBsYW5ndWFnZTtcblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuXHR9XG5cblxuXHRQcmlzbS5ob29rcy5hZGQoJ2JlZm9yZS1oaWdobGlnaHRhbGwnLCBmdW5jdGlvbiAoZW52KSB7XG5cdFx0ZW52LnNlbGVjdG9yICs9ICcsICcgKyBTRUxFQ1RPUjtcblx0fSk7XG5cblx0UHJpc20uaG9va3MuYWRkKCdiZWZvcmUtc2FuaXR5LWNoZWNrJywgZnVuY3Rpb24gKGVudikge1xuXHRcdHZhciBwcmUgPSAvKiogQHR5cGUge0hUTUxQcmVFbGVtZW50fSAqLyAoZW52LmVsZW1lbnQpO1xuXHRcdGlmIChwcmUubWF0Y2hlcyhTRUxFQ1RPUikpIHtcblx0XHRcdGVudi5jb2RlID0gJyc7IC8vIGZhc3QtcGF0aCB0aGUgd2hvbGUgdGhpbmcgYW5kIGdvIHRvIGNvbXBsZXRlXG5cblx0XHRcdHByZS5zZXRBdHRyaWJ1dGUoU1RBVFVTX0FUVFIsIFNUQVRVU19MT0FESU5HKTsgLy8gbWFyayBhcyBsb2FkaW5nXG5cblx0XHRcdC8vIGFkZCBjb2RlIGVsZW1lbnQgd2l0aCBsb2FkaW5nIG1lc3NhZ2Vcblx0XHRcdHZhciBjb2RlID0gcHJlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0NPREUnKSk7XG5cdFx0XHRjb2RlLnRleHRDb250ZW50ID0gTE9BRElOR19NRVNTQUdFO1xuXG5cdFx0XHR2YXIgc3JjID0gcHJlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcblxuXHRcdFx0dmFyIGxhbmd1YWdlID0gZW52Lmxhbmd1YWdlO1xuXHRcdFx0aWYgKGxhbmd1YWdlID09PSAnbm9uZScpIHtcblx0XHRcdFx0Ly8gdGhlIGxhbmd1YWdlIG1pZ2h0IGJlICdub25lJyBiZWNhdXNlIHRoZXJlIGlzIG5vIGxhbmd1YWdlIHNldDtcblx0XHRcdFx0Ly8gaW4gdGhpcyBjYXNlLCB3ZSB3YW50IHRvIHVzZSB0aGUgZXh0ZW5zaW9uIGFzIHRoZSBsYW5ndWFnZVxuXHRcdFx0XHR2YXIgZXh0ZW5zaW9uID0gKC9cXC4oXFx3KykkLy5leGVjKHNyYykgfHwgWywgJ25vbmUnXSlbMV07XG5cdFx0XHRcdGxhbmd1YWdlID0gRVhURU5TSU9OU1tleHRlbnNpb25dIHx8IGV4dGVuc2lvbjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IGxhbmd1YWdlIGNsYXNzZXNcblx0XHRcdHNldExhbmd1YWdlQ2xhc3MoY29kZSwgbGFuZ3VhZ2UpO1xuXHRcdFx0c2V0TGFuZ3VhZ2VDbGFzcyhwcmUsIGxhbmd1YWdlKTtcblxuXHRcdFx0Ly8gcHJlbG9hZCB0aGUgbGFuZ3VhZ2Vcblx0XHRcdHZhciBhdXRvbG9hZGVyID0gUHJpc20ucGx1Z2lucy5hdXRvbG9hZGVyO1xuXHRcdFx0aWYgKGF1dG9sb2FkZXIpIHtcblx0XHRcdFx0YXV0b2xvYWRlci5sb2FkTGFuZ3VhZ2VzKGxhbmd1YWdlKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbG9hZCBmaWxlXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHR4aHIub3BlbignR0VUJywgc3JjLCB0cnVlKTtcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KSB7XG5cdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPCA0MDAgJiYgeGhyLnJlc3BvbnNlVGV4dCkge1xuXHRcdFx0XHRcdFx0Ly8gbWFyayBhcyBsb2FkZWRcblx0XHRcdFx0XHRcdHByZS5zZXRBdHRyaWJ1dGUoU1RBVFVTX0FUVFIsIFNUQVRVU19MT0FERUQpO1xuXG5cdFx0XHRcdFx0XHQvLyBoaWdobGlnaHQgY29kZVxuXHRcdFx0XHRcdFx0Y29kZS50ZXh0Q29udGVudCA9IHhoci5yZXNwb25zZVRleHQ7XG5cdFx0XHRcdFx0XHRQcmlzbS5oaWdobGlnaHRFbGVtZW50KGNvZGUpO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIG1hcmsgYXMgZmFpbGVkXG5cdFx0XHRcdFx0XHRwcmUuc2V0QXR0cmlidXRlKFNUQVRVU19BVFRSLCBTVEFUVVNfRkFJTEVEKTtcblxuXHRcdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPj0gNDAwKSB7XG5cdFx0XHRcdFx0XHRcdGNvZGUudGV4dENvbnRlbnQgPSBGQUlMVVJFX01FU1NBR0UoeGhyLnN0YXR1cywgeGhyLnN0YXR1c1RleHQpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29kZS50ZXh0Q29udGVudCA9IEZBSUxVUkVfRU1QVFlfTUVTU0FHRTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHR4aHIuc2VuZChudWxsKTtcblx0XHR9XG5cdH0pO1xuXG5cdFByaXNtLnBsdWdpbnMuZmlsZUhpZ2hsaWdodCA9IHtcblx0XHQvKipcblx0XHQgKiBFeGVjdXRlcyB0aGUgRmlsZSBIaWdobGlnaHQgcGx1Z2luIGZvciBhbGwgbWF0Y2hpbmcgYHByZWAgZWxlbWVudHMgdW5kZXIgdGhlIGdpdmVuIGNvbnRhaW5lci5cblx0XHQgKlxuXHRcdCAqIE5vdGU6IEVsZW1lbnRzIHdoaWNoIGFyZSBhbHJlYWR5IGxvYWRlZCBvciBjdXJyZW50bHkgbG9hZGluZyB3aWxsIG5vdCBiZSB0b3VjaGVkIGJ5IHRoaXMgbWV0aG9kLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtQYXJlbnROb2RlfSBbY29udGFpbmVyPWRvY3VtZW50XVxuXHRcdCAqL1xuXHRcdGhpZ2hsaWdodDogZnVuY3Rpb24gaGlnaGxpZ2h0KGNvbnRhaW5lcikge1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gKGNvbnRhaW5lciB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUik7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwLCBlbGVtZW50OyBlbGVtZW50ID0gZWxlbWVudHNbaSsrXTspIHtcblx0XHRcdFx0UHJpc20uaGlnaGxpZ2h0RWxlbWVudChlbGVtZW50KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dmFyIGxvZ2dlZCA9IGZhbHNlO1xuXHQvKiogQGRlcHJlY2F0ZWQgVXNlIGBQcmlzbS5wbHVnaW5zLmZpbGVIaWdobGlnaHQuaGlnaGxpZ2h0YCBpbnN0ZWFkLiAqL1xuXHRQcmlzbS5maWxlSGlnaGxpZ2h0ID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICghbG9nZ2VkKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ1ByaXNtLmZpbGVIaWdobGlnaHQgaXMgZGVwcmVjYXRlZC4gVXNlIGBQcmlzbS5wbHVnaW5zLmZpbGVIaWdobGlnaHQuaGlnaGxpZ2h0YCBpbnN0ZWFkLicpO1xuXHRcdFx0bG9nZ2VkID0gdHJ1ZTtcblx0XHR9XG5cdFx0UHJpc20ucGx1Z2lucy5maWxlSGlnaGxpZ2h0LmhpZ2hsaWdodC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9XG5cbn0pKCk7XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgUHJpc20gZnJvbSBcInByaXNtanNcIjtcblxuICBleHBvcnQgbGV0IGNvZGUgPSBcIlwiO1xuICBleHBvcnQgbGV0IGxhbmcgPSBcImphdmFzY3JpcHRcIjtcblxuICBjb25zdCBodG1sID0gUHJpc20uaGlnaGxpZ2h0KGNvZGUsIFByaXNtLmxhbmd1YWdlc1tsYW5nXSwgXCJqYXZhc2NyaXB0XCIpO1xuPC9zY3JpcHQ+XG5cbjxwcmUgY2xhc3M9XCJsYW5ndWFnZS17bGFuZ31cIj5cbiAgPGNvZGU+XG4gICAge0BodG1sIGh0bWx9XG4gIDwvY29kZT5cbjwvcHJlPlxuIl0sIm5hbWVzIjpbIl9zZWxmIiwid2luZG93IiwiV29ya2VyR2xvYmFsU2NvcGUiLCJzZWxmIiwiUHJpc20iLCJsYW5nIiwidW5pcXVlSWQiLCJfIiwibWFudWFsIiwiZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyIiwidXRpbCIsImVuY29kZSIsInRva2VucyIsIlRva2VuIiwidHlwZSIsImNvbnRlbnQiLCJhbGlhcyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsInJlcGxhY2UiLCJvIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwic2xpY2UiLCJvYmpJZCIsIm9iaiIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJjbG9uZSIsImRlZXBDbG9uZSIsInZpc2l0ZWQiLCJpZCIsImtleSIsImhhc093blByb3BlcnR5IiwiZm9yRWFjaCIsInYiLCJpIiwiZ2V0TGFuZ3VhZ2UiLCJlbGVtZW50IiwidGVzdCIsImNsYXNzTmFtZSIsInBhcmVudEVsZW1lbnQiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiY3VycmVudFNjcmlwdCIsImRvY3VtZW50IiwiRXJyb3IiLCJlcnIiLCJzcmMiLCJleGVjIiwic3RhY2siLCJzY3JpcHRzIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJpc0FjdGl2ZSIsImRlZmF1bHRBY3RpdmF0aW9uIiwibm8iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImxhbmd1YWdlcyIsImV4dGVuZCIsInJlZGVmIiwiaW5zZXJ0QmVmb3JlIiwiaW5zaWRlIiwiYmVmb3JlIiwiaW5zZXJ0Iiwicm9vdCIsImdyYW1tYXIiLCJyZXQiLCJ0b2tlbiIsIm5ld1Rva2VuIiwib2xkIiwiREZTIiwiY2FsbGJhY2siLCJwcm9wZXJ0eSIsInByb3BlcnR5VHlwZSIsInBsdWdpbnMiLCJoaWdobGlnaHRBbGwiLCJhc3luYyIsImhpZ2hsaWdodEFsbFVuZGVyIiwiY29udGFpbmVyIiwiZW52Iiwic2VsZWN0b3IiLCJob29rcyIsInJ1biIsImVsZW1lbnRzIiwiYXBwbHkiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGlnaGxpZ2h0RWxlbWVudCIsImxhbmd1YWdlIiwicGFyZW50Iiwibm9kZU5hbWUiLCJjb2RlIiwidGV4dENvbnRlbnQiLCJpbnNlcnRIaWdobGlnaHRlZENvZGUiLCJoaWdobGlnaHRlZENvZGUiLCJpbm5lckhUTUwiLCJXb3JrZXIiLCJ3b3JrZXIiLCJmaWxlbmFtZSIsIm9ubWVzc2FnZSIsImV2dCIsImRhdGEiLCJwb3N0TWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbW1lZGlhdGVDbG9zZSIsImhpZ2hsaWdodCIsInRleHQiLCJ0b2tlbml6ZSIsInJlc3QiLCJ0b2tlbkxpc3QiLCJMaW5rZWRMaXN0IiwiYWRkQWZ0ZXIiLCJoZWFkIiwibWF0Y2hHcmFtbWFyIiwidG9BcnJheSIsImFsbCIsImFkZCIsIm5hbWUiLCJwdXNoIiwiY2FsbGJhY2tzIiwibGVuZ3RoIiwibWF0Y2hlZFN0ciIsInMiLCJlIiwidGFnIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJhbGlhc2VzIiwiam9pbiIsInN0YXJ0Tm9kZSIsInN0YXJ0UG9zIiwicmVtYXRjaCIsInBhdHRlcm5zIiwiaiIsImNhdXNlIiwicGF0dGVybk9iaiIsImxvb2tiZWhpbmQiLCJncmVlZHkiLCJsb29rYmVoaW5kTGVuZ3RoIiwicGF0dGVybiIsImdsb2JhbCIsImZsYWdzIiwiUmVnRXhwIiwic291cmNlIiwiY3VycmVudE5vZGUiLCJuZXh0IiwicG9zIiwidGFpbCIsInJlYWNoIiwic3RyIiwicmVtb3ZlQ291bnQiLCJwcmV2IiwibGFzdEluZGV4IiwiZnJvbSIsImluZGV4IiwidG8iLCJwIiwiayIsIm1hdGNoU3RyIiwiYWZ0ZXIiLCJyZW1vdmVGcm9tIiwicmVtb3ZlUmFuZ2UiLCJ3cmFwcGVkIiwibGlzdCIsIm5vZGUiLCJuZXdOb2RlIiwiY291bnQiLCJhcnJheSIsImFkZEV2ZW50TGlzdGVuZXIiLCJtZXNzYWdlIiwicGFyc2UiLCJjbG9zZSIsInNjcmlwdCIsImhhc0F0dHJpYnV0ZSIsImhpZ2hsaWdodEF1dG9tYXRpY2FsbHlDYWxsYmFjayIsInJlYWR5U3RhdGUiLCJkZWZlciIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNldFRpbWVvdXQiLCJtb2R1bGUiLCJleHBvcnRzIiwibWFya3VwIiwiYWRkSW5saW5lZCIsInRhZ05hbWUiLCJpbmNsdWRlZENkYXRhSW5zaWRlIiwiZGVmIiwiaHRtbCIsIm1hdGhtbCIsInN2ZyIsInhtbCIsInNzbWwiLCJhdG9tIiwicnNzIiwic3RyaW5nIiwiY3NzIiwiY2xpa2UiLCJqYXZhc2NyaXB0IiwianMiLCJMT0FESU5HX01FU1NBR0UiLCJGQUlMVVJFX01FU1NBR0UiLCJzdGF0dXMiLCJGQUlMVVJFX0VNUFRZX01FU1NBR0UiLCJFWFRFTlNJT05TIiwiU1RBVFVTX0FUVFIiLCJTVEFUVVNfTE9BRElORyIsIlNUQVRVU19MT0FERUQiLCJTVEFUVVNfRkFJTEVEIiwiU0VMRUNUT1IiLCJzZXRMYW5ndWFnZUNsYXNzIiwidHJpbSIsInByZSIsIm1hdGNoZXMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJleHRlbnNpb24iLCJhdXRvbG9hZGVyIiwibG9hZExhbmd1YWdlcyIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlc3BvbnNlVGV4dCIsInN0YXR1c1RleHQiLCJzZW5kIiwiZmlsZUhpZ2hsaWdodCIsImxvZ2dlZCIsImNvbnNvbGUiLCJ3YXJuIiwiYXJndW1lbnRzIiwiY3R4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7O0FBSUE7QUFFQSxNQUFJQSxLQUFLLEdBQUksT0FBT0MsTUFBUCxLQUFrQixXQUFuQixHQUNUQSxNQURTO0FBQUEsSUFHVCxPQUFPQyxpQkFBUCxLQUE2QixXQUE3QixJQUE0Q0MsSUFBSSxZQUFZRCxpQkFBN0QsR0FDRUMsSUFERjtBQUFBLElBRUUsRUFMUTtBQUFaO0FBUUE7Ozs7Ozs7Ozs7QUFRQSxNQUFJQyxLQUFLLEdBQUksVUFBVUosS0FBVixFQUFnQjtBQUU3QjtBQUNBLFFBQUlLLElBQUksR0FBRyw2QkFBWDtBQUNBLFFBQUlDLFFBQVEsR0FBRyxDQUFmO0FBR0EsUUFBSUMsQ0FBQyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JQQyxNQUFBQSxNQUFNLEVBQUVSLEtBQUssQ0FBQ0ksS0FBTixJQUFlSixLQUFLLENBQUNJLEtBQU4sQ0FBWUksTUF0QjVCO0FBdUJQQyxNQUFBQSwyQkFBMkIsRUFBRVQsS0FBSyxDQUFDSSxLQUFOLElBQWVKLEtBQUssQ0FBQ0ksS0FBTixDQUFZSywyQkF2QmpEOzs7Ozs7Ozs7OztBQWtDUEMsTUFBQUEsSUFBSSxFQUFFO0FBQ0xDLFFBQUFBLE1BQU0sRUFBRSxTQUFTQSxNQUFULENBQWdCQyxNQUFoQixFQUF3QjtBQUMvQixjQUFJQSxNQUFNLFlBQVlDLEtBQXRCLEVBQTZCO0FBQzVCLG1CQUFPLElBQUlBLEtBQUosQ0FBVUQsTUFBTSxDQUFDRSxJQUFqQixFQUF1QkgsTUFBTSxDQUFDQyxNQUFNLENBQUNHLE9BQVIsQ0FBN0IsRUFBK0NILE1BQU0sQ0FBQ0ksS0FBdEQsQ0FBUDtBQUNBLFdBRkQsTUFFTyxJQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY04sTUFBZCxDQUFKLEVBQTJCO0FBQ2pDLG1CQUFPQSxNQUFNLENBQUNPLEdBQVAsQ0FBV1IsTUFBWCxDQUFQO0FBQ0EsV0FGTSxNQUVBO0FBQ04sbUJBQU9DLE1BQU0sQ0FBQ1EsT0FBUCxDQUFlLElBQWYsRUFBcUIsT0FBckIsRUFBOEJBLE9BQTlCLENBQXNDLElBQXRDLEVBQTRDLE1BQTVDLEVBQW9EQSxPQUFwRCxDQUE0RCxTQUE1RCxFQUF1RSxHQUF2RSxDQUFQO0FBQ0E7QUFDRCxTQVRJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkxOLFFBQUFBLElBQUksRUFBRSxVQUFVTyxDQUFWLEVBQWE7QUFDbEIsaUJBQU9DLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixDQUEvQixFQUFrQ0ssS0FBbEMsQ0FBd0MsQ0FBeEMsRUFBMkMsQ0FBQyxDQUE1QyxDQUFQO0FBQ0EsU0E3Qkk7Ozs7Ozs7O0FBcUNMQyxRQUFBQSxLQUFLLEVBQUUsVUFBVUMsR0FBVixFQUFlO0FBQ3JCLGNBQUksQ0FBQ0EsR0FBRyxDQUFDLE1BQUQsQ0FBUixFQUFrQjtBQUNqQk4sWUFBQUEsTUFBTSxDQUFDTyxjQUFQLENBQXNCRCxHQUF0QixFQUEyQixNQUEzQixFQUFtQztBQUFFRSxjQUFBQSxLQUFLLEVBQUUsRUFBRXhCO0FBQVgsYUFBbkM7QUFDQTs7QUFDRCxpQkFBT3NCLEdBQUcsQ0FBQyxNQUFELENBQVY7QUFDQSxTQTFDSTs7Ozs7Ozs7Ozs7O0FBc0RMRyxRQUFBQSxLQUFLLEVBQUUsU0FBU0MsU0FBVCxDQUFtQlgsQ0FBbkIsRUFBc0JZLE9BQXRCLEVBQStCO0FBQ3JDQSxVQUFBQSxPQUFPLEdBQUdBLE9BQU8sSUFBSSxFQUFyQjtBQUVBLGNBQUlGLEtBQUosRUFBV0csRUFBWDs7QUFDQSxrQkFBUTNCLENBQUMsQ0FBQ0csSUFBRixDQUFPSSxJQUFQLENBQVlPLENBQVosQ0FBUjtBQUNDLGlCQUFLLFFBQUw7QUFDQ2EsY0FBQUEsRUFBRSxHQUFHM0IsQ0FBQyxDQUFDRyxJQUFGLENBQU9pQixLQUFQLENBQWFOLENBQWIsQ0FBTDs7QUFDQSxrQkFBSVksT0FBTyxDQUFDQyxFQUFELENBQVgsRUFBaUI7QUFDaEIsdUJBQU9ELE9BQU8sQ0FBQ0MsRUFBRCxDQUFkO0FBQ0E7O0FBQ0RILGNBQUFBLEtBQUs7O0FBQXVDLGdCQUE1QztBQUNBRSxjQUFBQSxPQUFPLENBQUNDLEVBQUQsQ0FBUCxHQUFjSCxLQUFkOztBQUVBLG1CQUFLLElBQUlJLEdBQVQsSUFBZ0JkLENBQWhCLEVBQW1CO0FBQ2xCLG9CQUFJQSxDQUFDLENBQUNlLGNBQUYsQ0FBaUJELEdBQWpCLENBQUosRUFBMkI7QUFDMUJKLGtCQUFBQSxLQUFLLENBQUNJLEdBQUQsQ0FBTCxHQUFhSCxTQUFTLENBQUNYLENBQUMsQ0FBQ2MsR0FBRCxDQUFGLEVBQVNGLE9BQVQsQ0FBdEI7QUFDQTtBQUNEOztBQUVEOztBQUEyQkYsZ0JBQUFBO0FBQTNCOztBQUVELGlCQUFLLE9BQUw7QUFDQ0csY0FBQUEsRUFBRSxHQUFHM0IsQ0FBQyxDQUFDRyxJQUFGLENBQU9pQixLQUFQLENBQWFOLENBQWIsQ0FBTDs7QUFDQSxrQkFBSVksT0FBTyxDQUFDQyxFQUFELENBQVgsRUFBaUI7QUFDaEIsdUJBQU9ELE9BQU8sQ0FBQ0MsRUFBRCxDQUFkO0FBQ0E7O0FBQ0RILGNBQUFBLEtBQUssR0FBRyxFQUFSO0FBQ0FFLGNBQUFBLE9BQU8sQ0FBQ0MsRUFBRCxDQUFQLEdBQWNILEtBQWQ7Ozs7O0FBRXlDVixjQUFBQSxDQUF6QyxDQUE4Q2dCLE9BQTlDLENBQXNELFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtBQUNyRVIsZ0JBQUFBLEtBQUssQ0FBQ1EsQ0FBRCxDQUFMLEdBQVdQLFNBQVMsQ0FBQ00sQ0FBRCxFQUFJTCxPQUFKLENBQXBCO0FBQ0EsZUFGRDtBQUlBOztBQUEyQkYsZ0JBQUFBO0FBQTNCOztBQUVEO0FBQ0MscUJBQU9WLENBQVA7QUFoQ0Y7QUFrQ0EsU0E1Rkk7Ozs7Ozs7Ozs7QUFzR0xtQixRQUFBQSxXQUFXLEVBQUUsVUFBVUMsT0FBVixFQUFtQjtBQUMvQixpQkFBT0EsT0FBTyxJQUFJLENBQUNwQyxJQUFJLENBQUNxQyxJQUFMLENBQVVELE9BQU8sQ0FBQ0UsU0FBbEIsQ0FBbkIsRUFBaUQ7QUFDaERGLFlBQUFBLE9BQU8sR0FBR0EsT0FBTyxDQUFDRyxhQUFsQjtBQUNBOztBQUNELGNBQUlILE9BQUosRUFBYTtBQUNaLG1CQUFPLENBQUNBLE9BQU8sQ0FBQ0UsU0FBUixDQUFrQkUsS0FBbEIsQ0FBd0J4QyxJQUF4QixLQUFpQyxHQUFHLE1BQUgsQ0FBbEMsRUFBOEMsQ0FBOUMsRUFBaUR5QyxXQUFqRCxFQUFQO0FBQ0E7O0FBQ0QsaUJBQU8sTUFBUDtBQUNBLFNBOUdJOzs7Ozs7Ozs7QUF1SExDLFFBQUFBLGFBQWEsRUFBRSxZQUFZO0FBQzFCLGNBQUksT0FBT0MsUUFBUCxLQUFvQixXQUF4QixFQUFxQztBQUNwQyxtQkFBTyxJQUFQO0FBQ0E7O0FBQ0QsY0FBSSxtQkFBbUJBLFFBQW5CLElBQStCLElBQUk7O0FBQXZDLFlBQStFO0FBQzlFOztBQUEyQkEsZ0JBQUFBLFFBQVEsQ0FBQ0Q7QUFBcEM7QUFDQSxhQU55Qjs7Ozs7QUFZMUIsY0FBSTtBQUNILGtCQUFNLElBQUlFLEtBQUosRUFBTjtBQUNBLFdBRkQsQ0FFRSxPQUFPQyxHQUFQLEVBQVk7Ozs7Ozs7QUFRYixnQkFBSUMsR0FBRyxHQUFHLENBQUMsK0JBQStCQyxJQUEvQixDQUFvQ0YsR0FBRyxDQUFDRyxLQUF4QyxLQUFrRCxFQUFuRCxFQUF1RCxDQUF2RCxDQUFWOztBQUNBLGdCQUFJRixHQUFKLEVBQVM7QUFDUixrQkFBSUcsT0FBTyxHQUFHTixRQUFRLENBQUNPLG9CQUFULENBQThCLFFBQTlCLENBQWQ7O0FBQ0EsbUJBQUssSUFBSWhCLENBQVQsSUFBY2UsT0FBZCxFQUF1QjtBQUN0QixvQkFBSUEsT0FBTyxDQUFDZixDQUFELENBQVAsQ0FBV1ksR0FBWCxJQUFrQkEsR0FBdEIsRUFBMkI7QUFDMUIseUJBQU9HLE9BQU8sQ0FBQ2YsQ0FBRCxDQUFkO0FBQ0E7QUFDRDtBQUNEOztBQUNELG1CQUFPLElBQVA7QUFDQTtBQUNELFNBeEpJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2S0xpQixRQUFBQSxRQUFRLEVBQUUsVUFBVWYsT0FBVixFQUFtQkUsU0FBbkIsRUFBOEJjLGlCQUE5QixFQUFpRDtBQUMxRCxjQUFJQyxFQUFFLEdBQUcsUUFBUWYsU0FBakI7O0FBRUEsaUJBQU9GLE9BQVAsRUFBZ0I7QUFDZixnQkFBSWtCLFNBQVMsR0FBR2xCLE9BQU8sQ0FBQ2tCLFNBQXhCOztBQUNBLGdCQUFJQSxTQUFTLENBQUNDLFFBQVYsQ0FBbUJqQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDLHFCQUFPLElBQVA7QUFDQTs7QUFDRCxnQkFBSWdCLFNBQVMsQ0FBQ0MsUUFBVixDQUFtQkYsRUFBbkIsQ0FBSixFQUE0QjtBQUMzQixxQkFBTyxLQUFQO0FBQ0E7O0FBQ0RqQixZQUFBQSxPQUFPLEdBQUdBLE9BQU8sQ0FBQ0csYUFBbEI7QUFDQTs7QUFDRCxpQkFBTyxDQUFDLENBQUNhLGlCQUFUO0FBQ0E7QUEzTEksT0FsQ0M7Ozs7Ozs7OztBQXVPUEksTUFBQUEsU0FBUyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCVkMsUUFBQUEsTUFBTSxFQUFFLFVBQVU1QixFQUFWLEVBQWM2QixLQUFkLEVBQXFCO0FBQzVCLGNBQUkxRCxJQUFJLEdBQUdFLENBQUMsQ0FBQ0csSUFBRixDQUFPcUIsS0FBUCxDQUFheEIsQ0FBQyxDQUFDc0QsU0FBRixDQUFZM0IsRUFBWixDQUFiLENBQVg7O0FBRUEsZUFBSyxJQUFJQyxHQUFULElBQWdCNEIsS0FBaEIsRUFBdUI7QUFDdEIxRCxZQUFBQSxJQUFJLENBQUM4QixHQUFELENBQUosR0FBWTRCLEtBQUssQ0FBQzVCLEdBQUQsQ0FBakI7QUFDQTs7QUFFRCxpQkFBTzlCLElBQVA7QUFDQSxTQXJDUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrSFYyRCxRQUFBQSxZQUFZLEVBQUUsVUFBVUMsTUFBVixFQUFrQkMsTUFBbEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxJQUFsQyxFQUF3QztBQUNyREEsVUFBQUEsSUFBSSxHQUFHQSxJQUFJOztBQUF3QjdELFVBQUFBLENBQUMsQ0FBQ3NELFNBQXJDO0FBQ0EsY0FBSVEsT0FBTyxHQUFHRCxJQUFJLENBQUNILE1BQUQsQ0FBbEI7OztBQUVBLGNBQUlLLEdBQUcsR0FBRyxFQUFWOztBQUVBLGVBQUssSUFBSUMsS0FBVCxJQUFrQkYsT0FBbEIsRUFBMkI7QUFDMUIsZ0JBQUlBLE9BQU8sQ0FBQ2pDLGNBQVIsQ0FBdUJtQyxLQUF2QixDQUFKLEVBQW1DO0FBRWxDLGtCQUFJQSxLQUFLLElBQUlMLE1BQWIsRUFBcUI7QUFDcEIscUJBQUssSUFBSU0sUUFBVCxJQUFxQkwsTUFBckIsRUFBNkI7QUFDNUIsc0JBQUlBLE1BQU0sQ0FBQy9CLGNBQVAsQ0FBc0JvQyxRQUF0QixDQUFKLEVBQXFDO0FBQ3BDRixvQkFBQUEsR0FBRyxDQUFDRSxRQUFELENBQUgsR0FBZ0JMLE1BQU0sQ0FBQ0ssUUFBRCxDQUF0QjtBQUNBO0FBQ0Q7QUFDRCxlQVJpQzs7O0FBV2xDLGtCQUFJLENBQUNMLE1BQU0sQ0FBQy9CLGNBQVAsQ0FBc0JtQyxLQUF0QixDQUFMLEVBQW1DO0FBQ2xDRCxnQkFBQUEsR0FBRyxDQUFDQyxLQUFELENBQUgsR0FBYUYsT0FBTyxDQUFDRSxLQUFELENBQXBCO0FBQ0E7QUFDRDtBQUNEOztBQUVELGNBQUlFLEdBQUcsR0FBR0wsSUFBSSxDQUFDSCxNQUFELENBQWQ7QUFDQUcsVUFBQUEsSUFBSSxDQUFDSCxNQUFELENBQUosR0FBZUssR0FBZixDQXpCcUQ7O0FBNEJyRC9ELFVBQUFBLENBQUMsQ0FBQ3NELFNBQUYsQ0FBWWEsR0FBWixDQUFnQm5FLENBQUMsQ0FBQ3NELFNBQWxCLEVBQTZCLFVBQVMxQixHQUFULEVBQWNMLEtBQWQsRUFBcUI7QUFDakQsZ0JBQUlBLEtBQUssS0FBSzJDLEdBQVYsSUFBaUJ0QyxHQUFHLElBQUk4QixNQUE1QixFQUFvQztBQUNuQyxtQkFBSzlCLEdBQUwsSUFBWW1DLEdBQVo7QUFDQTtBQUNELFdBSkQ7O0FBTUEsaUJBQU9BLEdBQVA7QUFDQSxTQXJKUzs7QUF3SlZJLFFBQUFBLEdBQUcsRUFBRSxTQUFTQSxHQUFULENBQWFyRCxDQUFiLEVBQWdCc0QsUUFBaEIsRUFBMEI3RCxJQUExQixFQUFnQ21CLE9BQWhDLEVBQXlDO0FBQzdDQSxVQUFBQSxPQUFPLEdBQUdBLE9BQU8sSUFBSSxFQUFyQjtBQUVBLGNBQUlOLEtBQUssR0FBR3BCLENBQUMsQ0FBQ0csSUFBRixDQUFPaUIsS0FBbkI7O0FBRUEsZUFBSyxJQUFJWSxDQUFULElBQWNsQixDQUFkLEVBQWlCO0FBQ2hCLGdCQUFJQSxDQUFDLENBQUNlLGNBQUYsQ0FBaUJHLENBQWpCLENBQUosRUFBeUI7QUFDeEJvQyxjQUFBQSxRQUFRLENBQUNsRCxJQUFULENBQWNKLENBQWQsRUFBaUJrQixDQUFqQixFQUFvQmxCLENBQUMsQ0FBQ2tCLENBQUQsQ0FBckIsRUFBMEJ6QixJQUFJLElBQUl5QixDQUFsQzs7QUFFQSxrQkFBSXFDLFFBQVEsR0FBR3ZELENBQUMsQ0FBQ2tCLENBQUQsQ0FBaEI7QUFBQSxrQkFDSXNDLFlBQVksR0FBR3RFLENBQUMsQ0FBQ0csSUFBRixDQUFPSSxJQUFQLENBQVk4RCxRQUFaLENBRG5COztBQUdBLGtCQUFJQyxZQUFZLEtBQUssUUFBakIsSUFBNkIsQ0FBQzVDLE9BQU8sQ0FBQ04sS0FBSyxDQUFDaUQsUUFBRCxDQUFOLENBQXpDLEVBQTREO0FBQzNEM0MsZ0JBQUFBLE9BQU8sQ0FBQ04sS0FBSyxDQUFDaUQsUUFBRCxDQUFOLENBQVAsR0FBMkIsSUFBM0I7QUFDQUYsZ0JBQUFBLEdBQUcsQ0FBQ0UsUUFBRCxFQUFXRCxRQUFYLEVBQXFCLElBQXJCLEVBQTJCMUMsT0FBM0IsQ0FBSDtBQUNBLGVBSEQsTUFJSyxJQUFJNEMsWUFBWSxLQUFLLE9BQWpCLElBQTRCLENBQUM1QyxPQUFPLENBQUNOLEtBQUssQ0FBQ2lELFFBQUQsQ0FBTixDQUF4QyxFQUEyRDtBQUMvRDNDLGdCQUFBQSxPQUFPLENBQUNOLEtBQUssQ0FBQ2lELFFBQUQsQ0FBTixDQUFQLEdBQTJCLElBQTNCO0FBQ0FGLGdCQUFBQSxHQUFHLENBQUNFLFFBQUQsRUFBV0QsUUFBWCxFQUFxQnBDLENBQXJCLEVBQXdCTixPQUF4QixDQUFIO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7QUE5S1MsT0F2T0o7QUF3WlA2QyxNQUFBQSxPQUFPLEVBQUUsRUF4WkY7Ozs7Ozs7Ozs7Ozs7O0FBc2FQQyxNQUFBQSxZQUFZLEVBQUUsVUFBU0MsS0FBVCxFQUFnQkwsUUFBaEIsRUFBMEI7QUFDdkNwRSxRQUFBQSxDQUFDLENBQUMwRSxpQkFBRixDQUFvQmpDLFFBQXBCLEVBQThCZ0MsS0FBOUIsRUFBcUNMLFFBQXJDO0FBQ0EsT0F4YU07Ozs7Ozs7Ozs7Ozs7Ozs7QUF3YlBNLE1BQUFBLGlCQUFpQixFQUFFLFVBQVNDLFNBQVQsRUFBb0JGLEtBQXBCLEVBQTJCTCxRQUEzQixFQUFxQztBQUN2RCxZQUFJUSxHQUFHLEdBQUc7QUFDVFIsVUFBQUEsUUFBUSxFQUFFQSxRQUREO0FBRVRPLFVBQUFBLFNBQVMsRUFBRUEsU0FGRjtBQUdURSxVQUFBQSxRQUFRLEVBQUU7QUFIRCxTQUFWOztBQU1BN0UsUUFBQUEsQ0FBQyxDQUFDOEUsS0FBRixDQUFRQyxHQUFSLENBQVkscUJBQVosRUFBbUNILEdBQW5DOztBQUVBQSxRQUFBQSxHQUFHLENBQUNJLFFBQUosR0FBZXRFLEtBQUssQ0FBQ00sU0FBTixDQUFnQkcsS0FBaEIsQ0FBc0I4RCxLQUF0QixDQUE0QkwsR0FBRyxDQUFDRCxTQUFKLENBQWNPLGdCQUFkLENBQStCTixHQUFHLENBQUNDLFFBQW5DLENBQTVCLENBQWY7O0FBRUE3RSxRQUFBQSxDQUFDLENBQUM4RSxLQUFGLENBQVFDLEdBQVIsQ0FBWSwrQkFBWixFQUE2Q0gsR0FBN0M7O0FBRUEsYUFBSyxJQUFJNUMsQ0FBQyxHQUFHLENBQVIsRUFBV0UsT0FBaEIsRUFBeUJBLE9BQU8sR0FBRzBDLEdBQUcsQ0FBQ0ksUUFBSixDQUFhaEQsQ0FBQyxFQUFkLENBQW5DLEdBQXVEO0FBQ3REaEMsVUFBQUEsQ0FBQyxDQUFDbUYsZ0JBQUYsQ0FBbUJqRCxPQUFuQixFQUE0QnVDLEtBQUssS0FBSyxJQUF0QyxFQUE0Q0csR0FBRyxDQUFDUixRQUFoRDtBQUNBO0FBQ0QsT0F4Y007Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1lUGUsTUFBQUEsZ0JBQWdCLEVBQUUsVUFBU2pELE9BQVQsRUFBa0J1QyxLQUFsQixFQUF5QkwsUUFBekIsRUFBbUM7O0FBRXBELFlBQUlnQixRQUFRLEdBQUdwRixDQUFDLENBQUNHLElBQUYsQ0FBTzhCLFdBQVAsQ0FBbUJDLE9BQW5CLENBQWY7O0FBQ0EsWUFBSTRCLE9BQU8sR0FBRzlELENBQUMsQ0FBQ3NELFNBQUYsQ0FBWThCLFFBQVosQ0FBZCxDQUhvRDs7QUFNcERsRCxRQUFBQSxPQUFPLENBQUNFLFNBQVIsR0FBb0JGLE9BQU8sQ0FBQ0UsU0FBUixDQUFrQnZCLE9BQWxCLENBQTBCZixJQUExQixFQUFnQyxFQUFoQyxFQUFvQ2UsT0FBcEMsQ0FBNEMsTUFBNUMsRUFBb0QsR0FBcEQsSUFBMkQsWUFBM0QsR0FBMEV1RSxRQUE5RixDQU5vRDs7QUFTcEQsWUFBSUMsTUFBTSxHQUFHbkQsT0FBTyxDQUFDRyxhQUFyQjs7QUFDQSxZQUFJZ0QsTUFBTSxJQUFJQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0IvQyxXQUFoQixPQUFrQyxLQUFoRCxFQUF1RDtBQUN0RDhDLFVBQUFBLE1BQU0sQ0FBQ2pELFNBQVAsR0FBbUJpRCxNQUFNLENBQUNqRCxTQUFQLENBQWlCdkIsT0FBakIsQ0FBeUJmLElBQXpCLEVBQStCLEVBQS9CLEVBQW1DZSxPQUFuQyxDQUEyQyxNQUEzQyxFQUFtRCxHQUFuRCxJQUEwRCxZQUExRCxHQUF5RXVFLFFBQTVGO0FBQ0E7O0FBRUQsWUFBSUcsSUFBSSxHQUFHckQsT0FBTyxDQUFDc0QsV0FBbkI7QUFFQSxZQUFJWixHQUFHLEdBQUc7QUFDVDFDLFVBQUFBLE9BQU8sRUFBRUEsT0FEQTtBQUVUa0QsVUFBQUEsUUFBUSxFQUFFQSxRQUZEO0FBR1R0QixVQUFBQSxPQUFPLEVBQUVBLE9BSEE7QUFJVHlCLFVBQUFBLElBQUksRUFBRUE7QUFKRyxTQUFWOztBQU9BLGlCQUFTRSxxQkFBVCxDQUErQkMsZUFBL0IsRUFBZ0Q7QUFDL0NkLFVBQUFBLEdBQUcsQ0FBQ2MsZUFBSixHQUFzQkEsZUFBdEI7O0FBRUExRixVQUFBQSxDQUFDLENBQUM4RSxLQUFGLENBQVFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCSCxHQUE3Qjs7QUFFQUEsVUFBQUEsR0FBRyxDQUFDMUMsT0FBSixDQUFZeUQsU0FBWixHQUF3QmYsR0FBRyxDQUFDYyxlQUE1Qjs7QUFFQTFGLFVBQUFBLENBQUMsQ0FBQzhFLEtBQUYsQ0FBUUMsR0FBUixDQUFZLGlCQUFaLEVBQStCSCxHQUEvQjs7QUFDQTVFLFVBQUFBLENBQUMsQ0FBQzhFLEtBQUYsQ0FBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JILEdBQXhCOztBQUNBUixVQUFBQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ2xELElBQVQsQ0FBYzBELEdBQUcsQ0FBQzFDLE9BQWxCLENBQVo7QUFDQTs7QUFFRGxDLFFBQUFBLENBQUMsQ0FBQzhFLEtBQUYsQ0FBUUMsR0FBUixDQUFZLHFCQUFaLEVBQW1DSCxHQUFuQzs7QUFFQSxZQUFJLENBQUNBLEdBQUcsQ0FBQ1csSUFBVCxFQUFlO0FBQ2R2RixVQUFBQSxDQUFDLENBQUM4RSxLQUFGLENBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCSCxHQUF4Qjs7QUFDQVIsVUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNsRCxJQUFULENBQWMwRCxHQUFHLENBQUMxQyxPQUFsQixDQUFaO0FBQ0E7QUFDQTs7QUFFRGxDLFFBQUFBLENBQUMsQ0FBQzhFLEtBQUYsQ0FBUUMsR0FBUixDQUFZLGtCQUFaLEVBQWdDSCxHQUFoQzs7QUFFQSxZQUFJLENBQUNBLEdBQUcsQ0FBQ2QsT0FBVCxFQUFrQjtBQUNqQjJCLFVBQUFBLHFCQUFxQixDQUFDekYsQ0FBQyxDQUFDRyxJQUFGLENBQU9DLE1BQVAsQ0FBY3dFLEdBQUcsQ0FBQ1csSUFBbEIsQ0FBRCxDQUFyQjtBQUNBO0FBQ0E7O0FBRUQsWUFBSWQsS0FBSyxJQUFJaEYsS0FBSyxDQUFDbUcsTUFBbkIsRUFBMkI7QUFDMUIsY0FBSUMsTUFBTSxHQUFHLElBQUlELE1BQUosQ0FBVzVGLENBQUMsQ0FBQzhGLFFBQWIsQ0FBYjs7QUFFQUQsVUFBQUEsTUFBTSxDQUFDRSxTQUFQLEdBQW1CLFVBQVNDLEdBQVQsRUFBYztBQUNoQ1AsWUFBQUEscUJBQXFCLENBQUNPLEdBQUcsQ0FBQ0MsSUFBTCxDQUFyQjtBQUNBLFdBRkQ7O0FBSUFKLFVBQUFBLE1BQU0sQ0FBQ0ssV0FBUCxDQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFDakNoQixZQUFBQSxRQUFRLEVBQUVSLEdBQUcsQ0FBQ1EsUUFEbUI7QUFFakNHLFlBQUFBLElBQUksRUFBRVgsR0FBRyxDQUFDVyxJQUZ1QjtBQUdqQ2MsWUFBQUEsY0FBYyxFQUFFO0FBSGlCLFdBQWYsQ0FBbkI7QUFLQSxTQVpELE1BYUs7QUFDSlosVUFBQUEscUJBQXFCLENBQUN6RixDQUFDLENBQUNzRyxTQUFGLENBQVkxQixHQUFHLENBQUNXLElBQWhCLEVBQXNCWCxHQUFHLENBQUNkLE9BQTFCLEVBQW1DYyxHQUFHLENBQUNRLFFBQXZDLENBQUQsQ0FBckI7QUFDQTtBQUNELE9BcmlCTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJqQlBrQixNQUFBQSxTQUFTLEVBQUUsVUFBVUMsSUFBVixFQUFnQnpDLE9BQWhCLEVBQXlCc0IsUUFBekIsRUFBbUM7QUFDN0MsWUFBSVIsR0FBRyxHQUFHO0FBQ1RXLFVBQUFBLElBQUksRUFBRWdCLElBREc7QUFFVHpDLFVBQUFBLE9BQU8sRUFBRUEsT0FGQTtBQUdUc0IsVUFBQUEsUUFBUSxFQUFFQTtBQUhELFNBQVY7O0FBS0FwRixRQUFBQSxDQUFDLENBQUM4RSxLQUFGLENBQVFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQkgsR0FBL0I7O0FBQ0FBLFFBQUFBLEdBQUcsQ0FBQ3ZFLE1BQUosR0FBYUwsQ0FBQyxDQUFDd0csUUFBRixDQUFXNUIsR0FBRyxDQUFDVyxJQUFmLEVBQXFCWCxHQUFHLENBQUNkLE9BQXpCLENBQWI7O0FBQ0E5RCxRQUFBQSxDQUFDLENBQUM4RSxLQUFGLENBQVFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4QkgsR0FBOUI7O0FBQ0EsZUFBT3RFLEtBQUssQ0FBQzhGLFNBQU4sQ0FBZ0JwRyxDQUFDLENBQUNHLElBQUYsQ0FBT0MsTUFBUCxDQUFjd0UsR0FBRyxDQUFDdkUsTUFBbEIsQ0FBaEIsRUFBMkN1RSxHQUFHLENBQUNRLFFBQS9DLENBQVA7QUFDQSxPQXJrQk07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK2xCUG9CLE1BQUFBLFFBQVEsRUFBRSxVQUFTRCxJQUFULEVBQWV6QyxPQUFmLEVBQXdCO0FBQ2pDLFlBQUkyQyxJQUFJLEdBQUczQyxPQUFPLENBQUMyQyxJQUFuQjs7QUFDQSxZQUFJQSxJQUFKLEVBQVU7QUFDVCxlQUFLLElBQUl6QyxLQUFULElBQWtCeUMsSUFBbEIsRUFBd0I7QUFDdkIzQyxZQUFBQSxPQUFPLENBQUNFLEtBQUQsQ0FBUCxHQUFpQnlDLElBQUksQ0FBQ3pDLEtBQUQsQ0FBckI7QUFDQTs7QUFFRCxpQkFBT0YsT0FBTyxDQUFDMkMsSUFBZjtBQUNBOztBQUVELFlBQUlDLFNBQVMsR0FBRyxJQUFJQyxVQUFKLEVBQWhCO0FBQ0FDLFFBQUFBLFFBQVEsQ0FBQ0YsU0FBRCxFQUFZQSxTQUFTLENBQUNHLElBQXRCLEVBQTRCTixJQUE1QixDQUFSO0FBRUFPLFFBQUFBLFlBQVksQ0FBQ1AsSUFBRCxFQUFPRyxTQUFQLEVBQWtCNUMsT0FBbEIsRUFBMkI0QyxTQUFTLENBQUNHLElBQXJDLEVBQTJDLENBQTNDLENBQVo7QUFFQSxlQUFPRSxPQUFPLENBQUNMLFNBQUQsQ0FBZDtBQUNBLE9BL21CTTs7Ozs7OztBQXNuQlA1QixNQUFBQSxLQUFLLEVBQUU7QUFDTmtDLFFBQUFBLEdBQUcsRUFBRSxFQURDOzs7Ozs7Ozs7Ozs7OztBQWVOQyxRQUFBQSxHQUFHLEVBQUUsVUFBVUMsSUFBVixFQUFnQjlDLFFBQWhCLEVBQTBCO0FBQzlCLGNBQUlVLEtBQUssR0FBRzlFLENBQUMsQ0FBQzhFLEtBQUYsQ0FBUWtDLEdBQXBCO0FBRUFsQyxVQUFBQSxLQUFLLENBQUNvQyxJQUFELENBQUwsR0FBY3BDLEtBQUssQ0FBQ29DLElBQUQsQ0FBTCxJQUFlLEVBQTdCO0FBRUFwQyxVQUFBQSxLQUFLLENBQUNvQyxJQUFELENBQUwsQ0FBWUMsSUFBWixDQUFpQi9DLFFBQWpCO0FBQ0EsU0FyQks7Ozs7Ozs7Ozs7O0FBZ0NOVyxRQUFBQSxHQUFHLEVBQUUsVUFBVW1DLElBQVYsRUFBZ0J0QyxHQUFoQixFQUFxQjtBQUN6QixjQUFJd0MsU0FBUyxHQUFHcEgsQ0FBQyxDQUFDOEUsS0FBRixDQUFRa0MsR0FBUixDQUFZRSxJQUFaLENBQWhCOztBQUVBLGNBQUksQ0FBQ0UsU0FBRCxJQUFjLENBQUNBLFNBQVMsQ0FBQ0MsTUFBN0IsRUFBcUM7QUFDcEM7QUFDQTs7QUFFRCxlQUFLLElBQUlyRixDQUFDLEdBQUMsQ0FBTixFQUFTb0MsUUFBZCxFQUF3QkEsUUFBUSxHQUFHZ0QsU0FBUyxDQUFDcEYsQ0FBQyxFQUFGLENBQTVDLEdBQW9EO0FBQ25Eb0MsWUFBQUEsUUFBUSxDQUFDUSxHQUFELENBQVI7QUFDQTtBQUNEO0FBMUNLLE9BdG5CQTtBQW1xQlB0RSxNQUFBQSxLQUFLLEVBQUVBO0FBbnFCQSxLQUFSO0FBcXFCQWIsSUFBQUEsS0FBSyxDQUFDSSxLQUFOLEdBQWNHLENBQWQsQ0E1cUI2QjtBQWdyQjdCO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBV0EsYUFBU00sS0FBVCxDQUFlQyxJQUFmLEVBQXFCQyxPQUFyQixFQUE4QkMsS0FBOUIsRUFBcUM2RyxVQUFyQyxFQUFpRDs7Ozs7Ozs7OztBQVVoRCxXQUFLL0csSUFBTCxHQUFZQSxJQUFaOzs7Ozs7Ozs7O0FBU0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmOzs7Ozs7Ozs7QUFRQSxXQUFLQyxLQUFMLEdBQWFBLEtBQWIsQ0EzQmdEOztBQTZCaEQsV0FBSzRHLE1BQUwsR0FBYyxDQUFDQyxVQUFVLElBQUksRUFBZixFQUFtQkQsTUFBbkIsR0FBNEIsQ0FBMUM7QUFDQTtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7OztBQVlBL0csSUFBQUEsS0FBSyxDQUFDOEYsU0FBTixHQUFrQixTQUFTQSxTQUFULENBQW1CdEYsQ0FBbkIsRUFBc0JzRSxRQUF0QixFQUFnQztBQUNqRCxVQUFJLE9BQU90RSxDQUFQLElBQVksUUFBaEIsRUFBMEI7QUFDekIsZUFBT0EsQ0FBUDtBQUNBOztBQUNELFVBQUlKLEtBQUssQ0FBQ0MsT0FBTixDQUFjRyxDQUFkLENBQUosRUFBc0I7QUFDckIsWUFBSXlHLENBQUMsR0FBRyxFQUFSO0FBQ0F6RyxRQUFBQSxDQUFDLENBQUNnQixPQUFGLENBQVUsVUFBVTBGLENBQVYsRUFBYTtBQUN0QkQsVUFBQUEsQ0FBQyxJQUFJbkIsU0FBUyxDQUFDb0IsQ0FBRCxFQUFJcEMsUUFBSixDQUFkO0FBQ0EsU0FGRDtBQUdBLGVBQU9tQyxDQUFQO0FBQ0E7O0FBRUQsVUFBSTNDLEdBQUcsR0FBRztBQUNUckUsUUFBQUEsSUFBSSxFQUFFTyxDQUFDLENBQUNQLElBREM7QUFFVEMsUUFBQUEsT0FBTyxFQUFFNEYsU0FBUyxDQUFDdEYsQ0FBQyxDQUFDTixPQUFILEVBQVk0RSxRQUFaLENBRlQ7QUFHVHFDLFFBQUFBLEdBQUcsRUFBRSxNQUhJO0FBSVRDLFFBQUFBLE9BQU8sRUFBRSxDQUFDLE9BQUQsRUFBVTVHLENBQUMsQ0FBQ1AsSUFBWixDQUpBO0FBS1RvSCxRQUFBQSxVQUFVLEVBQUUsRUFMSDtBQU1UdkMsUUFBQUEsUUFBUSxFQUFFQTtBQU5ELE9BQVY7QUFTQSxVQUFJd0MsT0FBTyxHQUFHOUcsQ0FBQyxDQUFDTCxLQUFoQjs7QUFDQSxVQUFJbUgsT0FBSixFQUFhO0FBQ1osWUFBSWxILEtBQUssQ0FBQ0MsT0FBTixDQUFjaUgsT0FBZCxDQUFKLEVBQTRCO0FBQzNCbEgsVUFBQUEsS0FBSyxDQUFDTSxTQUFOLENBQWdCbUcsSUFBaEIsQ0FBcUJsQyxLQUFyQixDQUEyQkwsR0FBRyxDQUFDOEMsT0FBL0IsRUFBd0NFLE9BQXhDO0FBQ0EsU0FGRCxNQUVPO0FBQ05oRCxVQUFBQSxHQUFHLENBQUM4QyxPQUFKLENBQVlQLElBQVosQ0FBaUJTLE9BQWpCO0FBQ0E7QUFDRDs7QUFFRDVILE1BQUFBLENBQUMsQ0FBQzhFLEtBQUYsQ0FBUUMsR0FBUixDQUFZLE1BQVosRUFBb0JILEdBQXBCOztBQUVBLFVBQUkrQyxVQUFVLEdBQUcsRUFBakI7O0FBQ0EsV0FBSyxJQUFJVCxJQUFULElBQWlCdEMsR0FBRyxDQUFDK0MsVUFBckIsRUFBaUM7QUFDaENBLFFBQUFBLFVBQVUsSUFBSSxNQUFNVCxJQUFOLEdBQWEsSUFBYixHQUFvQixDQUFDdEMsR0FBRyxDQUFDK0MsVUFBSixDQUFlVCxJQUFmLEtBQXdCLEVBQXpCLEVBQTZCckcsT0FBN0IsQ0FBcUMsSUFBckMsRUFBMkMsUUFBM0MsQ0FBcEIsR0FBMkUsR0FBekY7QUFDQTs7QUFFRCxhQUFPLE1BQU0rRCxHQUFHLENBQUM2QyxHQUFWLEdBQWdCLFVBQWhCLEdBQTZCN0MsR0FBRyxDQUFDOEMsT0FBSixDQUFZRyxJQUFaLENBQWlCLEdBQWpCLENBQTdCLEdBQXFELEdBQXJELEdBQTJERixVQUEzRCxHQUF3RSxHQUF4RSxHQUE4RS9DLEdBQUcsQ0FBQ3BFLE9BQWxGLEdBQTRGLElBQTVGLEdBQW1Hb0UsR0FBRyxDQUFDNkMsR0FBdkcsR0FBNkcsR0FBcEg7QUFDQSxLQXRDRDtBQXdDQTs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLGFBQVNYLFlBQVQsQ0FBc0JQLElBQXRCLEVBQTRCRyxTQUE1QixFQUF1QzVDLE9BQXZDLEVBQWdEZ0UsU0FBaEQsRUFBMkRDLFFBQTNELEVBQXFFQyxPQUFyRSxFQUE4RTtBQUM3RSxXQUFLLElBQUloRSxLQUFULElBQWtCRixPQUFsQixFQUEyQjtBQUMxQixZQUFJLENBQUNBLE9BQU8sQ0FBQ2pDLGNBQVIsQ0FBdUJtQyxLQUF2QixDQUFELElBQWtDLENBQUNGLE9BQU8sQ0FBQ0UsS0FBRCxDQUE5QyxFQUF1RDtBQUN0RDtBQUNBOztBQUVELFlBQUlpRSxRQUFRLEdBQUduRSxPQUFPLENBQUNFLEtBQUQsQ0FBdEI7QUFDQWlFLFFBQUFBLFFBQVEsR0FBR3ZILEtBQUssQ0FBQ0MsT0FBTixDQUFjc0gsUUFBZCxJQUEwQkEsUUFBMUIsR0FBcUMsQ0FBQ0EsUUFBRCxDQUFoRDs7QUFFQSxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELFFBQVEsQ0FBQ1osTUFBN0IsRUFBcUMsRUFBRWEsQ0FBdkMsRUFBMEM7QUFDekMsY0FBSUYsT0FBTyxJQUFJQSxPQUFPLENBQUNHLEtBQVIsSUFBaUJuRSxLQUFLLEdBQUcsR0FBUixHQUFja0UsQ0FBOUMsRUFBaUQ7QUFDaEQ7QUFDQTs7QUFFRCxjQUFJRSxVQUFVLEdBQUdILFFBQVEsQ0FBQ0MsQ0FBRCxDQUF6QjtBQUFBLGNBQ0N4RSxNQUFNLEdBQUcwRSxVQUFVLENBQUMxRSxNQURyQjtBQUFBLGNBRUMyRSxVQUFVLEdBQUcsQ0FBQyxDQUFDRCxVQUFVLENBQUNDLFVBRjNCO0FBQUEsY0FHQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQ0YsVUFBVSxDQUFDRSxNQUh2QjtBQUFBLGNBSUNDLGdCQUFnQixHQUFHLENBSnBCO0FBQUEsY0FLQzlILEtBQUssR0FBRzJILFVBQVUsQ0FBQzNILEtBTHBCOztBQU9BLGNBQUk2SCxNQUFNLElBQUksQ0FBQ0YsVUFBVSxDQUFDSSxPQUFYLENBQW1CQyxNQUFsQyxFQUEwQzs7QUFFekMsZ0JBQUlDLEtBQUssR0FBR04sVUFBVSxDQUFDSSxPQUFYLENBQW1CdkgsUUFBbkIsR0FBOEJxQixLQUE5QixDQUFvQyxXQUFwQyxFQUFpRCxDQUFqRCxDQUFaO0FBQ0E4RixZQUFBQSxVQUFVLENBQUNJLE9BQVgsR0FBcUJHLE1BQU0sQ0FBQ1AsVUFBVSxDQUFDSSxPQUFYLENBQW1CSSxNQUFwQixFQUE0QkYsS0FBSyxHQUFHLEdBQXBDLENBQTNCO0FBQ0E7Ozs7QUFHRCxjQUFJRixPQUFPLEdBQUdKLFVBQVUsQ0FBQ0ksT0FBWCxJQUFzQkosVUFBcEM7O0FBRUE7QUFDQyxjQUFJUyxXQUFXLEdBQUdmLFNBQVMsQ0FBQ2dCLElBQTVCLEVBQWtDQyxHQUFHLEdBQUdoQixRQUR6QyxFQUVDYyxXQUFXLEtBQUtuQyxTQUFTLENBQUNzQyxJQUYzQixFQUdDRCxHQUFHLElBQUlGLFdBQVcsQ0FBQ3RILEtBQVosQ0FBa0I4RixNQUF6QixFQUFpQ3dCLFdBQVcsR0FBR0EsV0FBVyxDQUFDQyxJQUg1RCxFQUlFO0FBRUQsZ0JBQUlkLE9BQU8sSUFBSWUsR0FBRyxJQUFJZixPQUFPLENBQUNpQixLQUE5QixFQUFxQztBQUNwQztBQUNBOztBQUVELGdCQUFJQyxHQUFHLEdBQUdMLFdBQVcsQ0FBQ3RILEtBQXRCOztBQUVBLGdCQUFJbUYsU0FBUyxDQUFDVyxNQUFWLEdBQW1CZCxJQUFJLENBQUNjLE1BQTVCLEVBQW9DOztBQUVuQztBQUNBOztBQUVELGdCQUFJNkIsR0FBRyxZQUFZNUksS0FBbkIsRUFBMEI7QUFDekI7QUFDQTs7QUFFRCxnQkFBSTZJLFdBQVcsR0FBRyxDQUFsQixDQWpCQzs7QUFtQkQsZ0JBQUliLE1BQU0sSUFBSU8sV0FBVyxJQUFJbkMsU0FBUyxDQUFDc0MsSUFBVixDQUFlSSxJQUE1QyxFQUFrRDtBQUNqRFosY0FBQUEsT0FBTyxDQUFDYSxTQUFSLEdBQW9CTixHQUFwQjtBQUNBLGtCQUFJekcsS0FBSyxHQUFHa0csT0FBTyxDQUFDM0YsSUFBUixDQUFhMEQsSUFBYixDQUFaOztBQUNBLGtCQUFJLENBQUNqRSxLQUFMLEVBQVk7QUFDWDtBQUNBOztBQUVELGtCQUFJZ0gsSUFBSSxHQUFHaEgsS0FBSyxDQUFDaUgsS0FBTixJQUFlbEIsVUFBVSxJQUFJL0YsS0FBSyxDQUFDLENBQUQsQ0FBbkIsR0FBeUJBLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBUytFLE1BQWxDLEdBQTJDLENBQTFELENBQVg7QUFDQSxrQkFBSW1DLEVBQUUsR0FBR2xILEtBQUssQ0FBQ2lILEtBQU4sR0FBY2pILEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBUytFLE1BQWhDO0FBQ0Esa0JBQUlvQyxDQUFDLEdBQUdWLEdBQVIsQ0FUaUQ7O0FBWWpEVSxjQUFBQSxDQUFDLElBQUlaLFdBQVcsQ0FBQ3RILEtBQVosQ0FBa0I4RixNQUF2Qjs7QUFDQSxxQkFBT2lDLElBQUksSUFBSUcsQ0FBZixFQUFrQjtBQUNqQlosZ0JBQUFBLFdBQVcsR0FBR0EsV0FBVyxDQUFDQyxJQUExQjtBQUNBVyxnQkFBQUEsQ0FBQyxJQUFJWixXQUFXLENBQUN0SCxLQUFaLENBQWtCOEYsTUFBdkI7QUFDQSxlQWhCZ0Q7OztBQWtCakRvQyxjQUFBQSxDQUFDLElBQUlaLFdBQVcsQ0FBQ3RILEtBQVosQ0FBa0I4RixNQUF2QjtBQUNBMEIsY0FBQUEsR0FBRyxHQUFHVSxDQUFOLENBbkJpRDs7QUFzQmpELGtCQUFJWixXQUFXLENBQUN0SCxLQUFaLFlBQTZCakIsS0FBakMsRUFBd0M7QUFDdkM7QUFDQSxlQXhCZ0Q7OztBQTJCakQsbUJBQ0MsSUFBSW9KLENBQUMsR0FBR2IsV0FEVCxFQUVDYSxDQUFDLEtBQUtoRCxTQUFTLENBQUNzQyxJQUFoQixLQUF5QlMsQ0FBQyxHQUFHRCxFQUFKLElBQVUsT0FBT0UsQ0FBQyxDQUFDbkksS0FBVCxLQUFtQixRQUF0RCxDQUZELEVBR0NtSSxDQUFDLEdBQUdBLENBQUMsQ0FBQ1osSUFIUCxFQUlFO0FBQ0RLLGdCQUFBQSxXQUFXO0FBQ1hNLGdCQUFBQSxDQUFDLElBQUlDLENBQUMsQ0FBQ25JLEtBQUYsQ0FBUThGLE1BQWI7QUFDQTs7QUFDRDhCLGNBQUFBLFdBQVcsR0FuQ3NDOztBQXNDakRELGNBQUFBLEdBQUcsR0FBRzNDLElBQUksQ0FBQ3BGLEtBQUwsQ0FBVzRILEdBQVgsRUFBZ0JVLENBQWhCLENBQU47QUFDQW5ILGNBQUFBLEtBQUssQ0FBQ2lILEtBQU4sSUFBZVIsR0FBZjtBQUNBLGFBeENELE1Bd0NPO0FBQ05QLGNBQUFBLE9BQU8sQ0FBQ2EsU0FBUixHQUFvQixDQUFwQjtBQUVBLGtCQUFJL0csS0FBSyxHQUFHa0csT0FBTyxDQUFDM0YsSUFBUixDQUFhcUcsR0FBYixDQUFaO0FBQ0E7O0FBRUQsZ0JBQUksQ0FBQzVHLEtBQUwsRUFBWTtBQUNYO0FBQ0E7O0FBRUQsZ0JBQUkrRixVQUFKLEVBQWdCO0FBQ2ZFLGNBQUFBLGdCQUFnQixHQUFHakcsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVMrRSxNQUFwQixHQUE2QixDQUFoRDtBQUNBOztBQUVELGdCQUFJaUMsSUFBSSxHQUFHaEgsS0FBSyxDQUFDaUgsS0FBTixHQUFjaEIsZ0JBQXpCO0FBQUEsZ0JBQ0NvQixRQUFRLEdBQUdySCxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVNuQixLQUFULENBQWVvSCxnQkFBZixDQURaO0FBQUEsZ0JBRUNpQixFQUFFLEdBQUdGLElBQUksR0FBR0ssUUFBUSxDQUFDdEMsTUFGdEI7QUFBQSxnQkFHQzFELE1BQU0sR0FBR3VGLEdBQUcsQ0FBQy9ILEtBQUosQ0FBVSxDQUFWLEVBQWFtSSxJQUFiLENBSFY7QUFBQSxnQkFJQ00sS0FBSyxHQUFHVixHQUFHLENBQUMvSCxLQUFKLENBQVVxSSxFQUFWLENBSlQ7QUFNQSxnQkFBSVAsS0FBSyxHQUFHRixHQUFHLEdBQUdHLEdBQUcsQ0FBQzdCLE1BQXRCOztBQUNBLGdCQUFJVyxPQUFPLElBQUlpQixLQUFLLEdBQUdqQixPQUFPLENBQUNpQixLQUEvQixFQUFzQztBQUNyQ2pCLGNBQUFBLE9BQU8sQ0FBQ2lCLEtBQVIsR0FBZ0JBLEtBQWhCO0FBQ0E7O0FBRUQsZ0JBQUlZLFVBQVUsR0FBR2hCLFdBQVcsQ0FBQ08sSUFBN0I7O0FBRUEsZ0JBQUl6RixNQUFKLEVBQVk7QUFDWGtHLGNBQUFBLFVBQVUsR0FBR2pELFFBQVEsQ0FBQ0YsU0FBRCxFQUFZbUQsVUFBWixFQUF3QmxHLE1BQXhCLENBQXJCO0FBQ0FvRixjQUFBQSxHQUFHLElBQUlwRixNQUFNLENBQUMwRCxNQUFkO0FBQ0E7O0FBRUR5QyxZQUFBQSxXQUFXLENBQUNwRCxTQUFELEVBQVltRCxVQUFaLEVBQXdCVixXQUF4QixDQUFYO0FBRUEsZ0JBQUlZLE9BQU8sR0FBRyxJQUFJekosS0FBSixDQUFVMEQsS0FBVixFQUFpQk4sTUFBTSxHQUFHMUQsQ0FBQyxDQUFDd0csUUFBRixDQUFXbUQsUUFBWCxFQUFxQmpHLE1BQXJCLENBQUgsR0FBa0NpRyxRQUF6RCxFQUFtRWxKLEtBQW5FLEVBQTBFa0osUUFBMUUsQ0FBZDtBQUNBZCxZQUFBQSxXQUFXLEdBQUdqQyxRQUFRLENBQUNGLFNBQUQsRUFBWW1ELFVBQVosRUFBd0JFLE9BQXhCLENBQXRCOztBQUVBLGdCQUFJSCxLQUFKLEVBQVc7QUFDVmhELGNBQUFBLFFBQVEsQ0FBQ0YsU0FBRCxFQUFZbUMsV0FBWixFQUF5QmUsS0FBekIsQ0FBUjtBQUNBOztBQUVELGdCQUFJVCxXQUFXLEdBQUcsQ0FBbEIsRUFBcUI7OztBQUdwQnJDLGNBQUFBLFlBQVksQ0FBQ1AsSUFBRCxFQUFPRyxTQUFQLEVBQWtCNUMsT0FBbEIsRUFBMkIrRSxXQUFXLENBQUNPLElBQXZDLEVBQTZDTCxHQUE3QyxFQUFrRDtBQUM3RFosZ0JBQUFBLEtBQUssRUFBRW5FLEtBQUssR0FBRyxHQUFSLEdBQWNrRSxDQUR3QztBQUU3RGUsZ0JBQUFBLEtBQUssRUFBRUE7QUFGc0QsZUFBbEQsQ0FBWjtBQUlBO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Q7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7OztBQUlBLGFBQVN0QyxVQUFULEdBQXNCOztBQUVyQixVQUFJRSxJQUFJLEdBQUc7QUFBRXRGLFFBQUFBLEtBQUssRUFBRSxJQUFUO0FBQWU2SCxRQUFBQSxJQUFJLEVBQUUsSUFBckI7QUFBMkJOLFFBQUFBLElBQUksRUFBRTtBQUFqQyxPQUFYOzs7QUFFQSxVQUFJRSxJQUFJLEdBQUc7QUFBRXpILFFBQUFBLEtBQUssRUFBRSxJQUFUO0FBQWU2SCxRQUFBQSxJQUFJLEVBQUV2QyxJQUFyQjtBQUEyQmlDLFFBQUFBLElBQUksRUFBRTtBQUFqQyxPQUFYO0FBQ0FqQyxNQUFBQSxJQUFJLENBQUNpQyxJQUFMLEdBQVlFLElBQVo7OztBQUdBLFdBQUtuQyxJQUFMLEdBQVlBLElBQVo7OztBQUVBLFdBQUttQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxXQUFLM0IsTUFBTCxHQUFjLENBQWQ7QUFDQTtBQUVEOzs7Ozs7Ozs7O0FBUUEsYUFBU1QsUUFBVCxDQUFrQm9ELElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QjFJLEtBQTlCLEVBQXFDOztBQUVwQyxVQUFJdUgsSUFBSSxHQUFHbUIsSUFBSSxDQUFDbkIsSUFBaEI7QUFFQSxVQUFJb0IsT0FBTyxHQUFHO0FBQUUzSSxRQUFBQSxLQUFLLEVBQUVBLEtBQVQ7QUFBZ0I2SCxRQUFBQSxJQUFJLEVBQUVhLElBQXRCO0FBQTRCbkIsUUFBQUEsSUFBSSxFQUFFQTtBQUFsQyxPQUFkO0FBQ0FtQixNQUFBQSxJQUFJLENBQUNuQixJQUFMLEdBQVlvQixPQUFaO0FBQ0FwQixNQUFBQSxJQUFJLENBQUNNLElBQUwsR0FBWWMsT0FBWjtBQUNBRixNQUFBQSxJQUFJLENBQUMzQyxNQUFMO0FBRUEsYUFBTzZDLE9BQVA7QUFDQTtBQUNEOzs7Ozs7Ozs7QUFPQSxhQUFTSixXQUFULENBQXFCRSxJQUFyQixFQUEyQkMsSUFBM0IsRUFBaUNFLEtBQWpDLEVBQXdDO0FBQ3ZDLFVBQUlyQixJQUFJLEdBQUdtQixJQUFJLENBQUNuQixJQUFoQjs7QUFDQSxXQUFLLElBQUk5RyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbUksS0FBSixJQUFhckIsSUFBSSxLQUFLa0IsSUFBSSxDQUFDaEIsSUFBM0MsRUFBaURoSCxDQUFDLEVBQWxELEVBQXNEO0FBQ3JEOEcsUUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNBLElBQVo7QUFDQTs7QUFDRG1CLE1BQUFBLElBQUksQ0FBQ25CLElBQUwsR0FBWUEsSUFBWjtBQUNBQSxNQUFBQSxJQUFJLENBQUNNLElBQUwsR0FBWWEsSUFBWjtBQUNBRCxNQUFBQSxJQUFJLENBQUMzQyxNQUFMLElBQWVyRixDQUFmO0FBQ0E7QUFDRDs7Ozs7OztBQUtBLGFBQVMrRSxPQUFULENBQWlCaUQsSUFBakIsRUFBdUI7QUFDdEIsVUFBSUksS0FBSyxHQUFHLEVBQVo7QUFDQSxVQUFJSCxJQUFJLEdBQUdELElBQUksQ0FBQ25ELElBQUwsQ0FBVWlDLElBQXJCOztBQUNBLGFBQU9tQixJQUFJLEtBQUtELElBQUksQ0FBQ2hCLElBQXJCLEVBQTJCO0FBQzFCb0IsUUFBQUEsS0FBSyxDQUFDakQsSUFBTixDQUFXOEMsSUFBSSxDQUFDMUksS0FBaEI7QUFDQTBJLFFBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDbkIsSUFBWjtBQUNBOztBQUNELGFBQU9zQixLQUFQO0FBQ0E7O0FBR0QsUUFBSSxDQUFDM0ssS0FBSyxDQUFDZ0QsUUFBWCxFQUFxQjtBQUNwQixVQUFJLENBQUNoRCxLQUFLLENBQUM0SyxnQkFBWCxFQUE2Qjs7QUFFNUIsZUFBT3JLLENBQVA7QUFDQTs7QUFFRCxVQUFJLENBQUNBLENBQUMsQ0FBQ0UsMkJBQVAsRUFBb0M7O0FBRW5DVCxRQUFBQSxLQUFLLENBQUM0SyxnQkFBTixDQUF1QixTQUF2QixFQUFrQyxVQUFVckUsR0FBVixFQUFlO0FBQ2hELGNBQUlzRSxPQUFPLEdBQUduRSxJQUFJLENBQUNvRSxLQUFMLENBQVd2RSxHQUFHLENBQUNDLElBQWYsQ0FBZDtBQUFBLGNBQ0NuRyxJQUFJLEdBQUd3SyxPQUFPLENBQUNsRixRQURoQjtBQUFBLGNBRUNHLElBQUksR0FBRytFLE9BQU8sQ0FBQy9FLElBRmhCO0FBQUEsY0FHQ2MsY0FBYyxHQUFHaUUsT0FBTyxDQUFDakUsY0FIMUI7O0FBS0E1RyxVQUFBQSxLQUFLLENBQUN5RyxXQUFOLENBQWtCbEcsQ0FBQyxDQUFDc0csU0FBRixDQUFZZixJQUFaLEVBQWtCdkYsQ0FBQyxDQUFDc0QsU0FBRixDQUFZeEQsSUFBWixDQUFsQixFQUFxQ0EsSUFBckMsQ0FBbEI7O0FBQ0EsY0FBSXVHLGNBQUosRUFBb0I7QUFDbkI1RyxZQUFBQSxLQUFLLENBQUMrSyxLQUFOO0FBQ0E7QUFDRCxTQVZELEVBVUcsS0FWSDtBQVdBOztBQUVELGFBQU94SyxDQUFQO0FBQ0EsS0F4aUM0Qjs7O0FBMmlDN0IsUUFBSXlLLE1BQU0sR0FBR3pLLENBQUMsQ0FBQ0csSUFBRixDQUFPcUMsYUFBUCxFQUFiOztBQUVBLFFBQUlpSSxNQUFKLEVBQVk7QUFDWHpLLE1BQUFBLENBQUMsQ0FBQzhGLFFBQUYsR0FBYTJFLE1BQU0sQ0FBQzdILEdBQXBCOztBQUVBLFVBQUk2SCxNQUFNLENBQUNDLFlBQVAsQ0FBb0IsYUFBcEIsQ0FBSixFQUF3QztBQUN2QzFLLFFBQUFBLENBQUMsQ0FBQ0MsTUFBRixHQUFXLElBQVg7QUFDQTtBQUNEOztBQUVELGFBQVMwSyw4QkFBVCxHQUEwQztBQUN6QyxVQUFJLENBQUMzSyxDQUFDLENBQUNDLE1BQVAsRUFBZTtBQUNkRCxRQUFBQSxDQUFDLENBQUN3RSxZQUFGO0FBQ0E7QUFDRDs7QUFFRCxRQUFJLENBQUN4RSxDQUFDLENBQUNDLE1BQVAsRUFBZTs7Ozs7OztBQU9kLFVBQUkySyxVQUFVLEdBQUduSSxRQUFRLENBQUNtSSxVQUExQjs7QUFDQSxVQUFJQSxVQUFVLEtBQUssU0FBZixJQUE0QkEsVUFBVSxLQUFLLGFBQWYsSUFBZ0NILE1BQWhDLElBQTBDQSxNQUFNLENBQUNJLEtBQWpGLEVBQXdGO0FBQ3ZGcEksUUFBQUEsUUFBUSxDQUFDNEgsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDTSw4QkFBOUM7QUFDQSxPQUZELE1BRU87QUFDTixZQUFJakwsTUFBTSxDQUFDb0wscUJBQVgsRUFBa0M7QUFDakNwTCxVQUFBQSxNQUFNLENBQUNvTCxxQkFBUCxDQUE2QkgsOEJBQTdCO0FBQ0EsU0FGRCxNQUVPO0FBQ05qTCxVQUFBQSxNQUFNLENBQUNxTCxVQUFQLENBQWtCSiw4QkFBbEIsRUFBa0QsRUFBbEQ7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsV0FBTzNLLENBQVA7QUFFQyxHQWhsQ1csQ0FnbENUUCxLQWhsQ1MsQ0FBWjs7QUFrbENBLE9BQXFDdUwsTUFBTSxDQUFDQyxPQUE1QyxFQUFxRDtBQUNwREQsSUFBQUEsY0FBQSxHQUFpQm5MLEtBQWpCO0FBQ0E7OztBQUdELE1BQUksT0FBTzRJLGNBQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDbENBLElBQUFBLGNBQUFBLENBQU81SSxLQUFQNEksR0FBZTVJLEtBQWY0STtBQUNBOztBQUlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7QUFTQTs7Ozs7QUFJQTVJLEVBQUFBLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0I0SCxNQUFoQixHQUF5QjtBQUN4QixlQUFXLGlCQURhO0FBRXhCLGNBQVUsZ0JBRmM7QUFHeEIsZUFBVzs7QUFFVjFDLE1BQUFBLE9BQU8sRUFBRSxzSEFGQztBQUdWRixNQUFBQSxNQUFNLEVBQUUsSUFIRTtBQUlWNUUsTUFBQUEsTUFBTSxFQUFFO0FBQ1AsMkJBQW1CO0FBQ2xCOEUsVUFBQUEsT0FBTyxFQUFFLHFCQURTO0FBRWxCSCxVQUFBQSxVQUFVLEVBQUUsSUFGTTtBQUdsQkMsVUFBQUEsTUFBTSxFQUFFLElBSFU7QUFJbEI1RSxVQUFBQSxNQUFNLEVBQUUsSUFKVTs7QUFBQSxTQURaO0FBT1Asa0JBQVU7QUFDVDhFLFVBQUFBLE9BQU8sRUFBRSxpQkFEQTtBQUVURixVQUFBQSxNQUFNLEVBQUU7QUFGQyxTQVBIO0FBV1AsdUJBQWUsY0FYUjtBQVlQLHVCQUFlLFVBWlI7QUFhUCxnQkFBUTtBQWJEO0FBSkUsS0FIYTtBQXVCeEIsYUFBUyx5QkF2QmU7QUF3QnhCLFdBQU87QUFDTkUsTUFBQUEsT0FBTyxFQUFFLHNIQURIO0FBRU5GLE1BQUFBLE1BQU0sRUFBRSxJQUZGO0FBR041RSxNQUFBQSxNQUFNLEVBQUU7QUFDUCxlQUFPO0FBQ044RSxVQUFBQSxPQUFPLEVBQUUsZ0JBREg7QUFFTjlFLFVBQUFBLE1BQU0sRUFBRTtBQUNQLDJCQUFlLE9BRFI7QUFFUCx5QkFBYTtBQUZOO0FBRkYsU0FEQTtBQVFQLHNCQUFjO0FBQ2I4RSxVQUFBQSxPQUFPLEVBQUUsb0NBREk7QUFFYjlFLFVBQUFBLE1BQU0sRUFBRTtBQUNQLDJCQUFlLENBQ2Q7QUFDQzhFLGNBQUFBLE9BQU8sRUFBRSxJQURWO0FBRUMvSCxjQUFBQSxLQUFLLEVBQUU7QUFGUixhQURjLEVBS2QsS0FMYztBQURSO0FBRkssU0FSUDtBQW9CUCx1QkFBZSxNQXBCUjtBQXFCUCxxQkFBYTtBQUNaK0gsVUFBQUEsT0FBTyxFQUFFLFdBREc7QUFFWjlFLFVBQUFBLE1BQU0sRUFBRTtBQUNQLHlCQUFhO0FBRE47QUFGSTtBQXJCTjtBQUhGLEtBeEJpQjtBQXlEeEIsY0FBVSxDQUNUO0FBQ0M4RSxNQUFBQSxPQUFPLEVBQUUsaUJBRFY7QUFFQy9ILE1BQUFBLEtBQUssRUFBRTtBQUZSLEtBRFMsRUFLVCxvQkFMUztBQXpEYyxHQUF6QjtBQWtFQVosRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjRILE1BQWhCLENBQXVCLEtBQXZCLEVBQThCeEgsTUFBOUIsQ0FBcUMsWUFBckMsRUFBbURBLE1BQW5ELENBQTBELFFBQTFELElBQ0M3RCxLQUFLLENBQUN5RCxTQUFOLENBQWdCNEgsTUFBaEIsQ0FBdUIsUUFBdkIsQ0FERDtBQUVBckwsRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjRILE1BQWhCLENBQXVCLFNBQXZCLEVBQWtDeEgsTUFBbEMsQ0FBeUMsaUJBQXpDLEVBQTREQSxNQUE1RCxHQUFxRTdELEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0I0SCxNQUFyRjs7QUFHQXJMLEVBQUFBLEtBQUssQ0FBQ2lGLEtBQU4sQ0FBWW1DLEdBQVosQ0FBZ0IsTUFBaEIsRUFBd0IsVUFBVXJDLEdBQVYsRUFBZTtBQUV0QyxRQUFJQSxHQUFHLENBQUNyRSxJQUFKLEtBQWEsUUFBakIsRUFBMkI7QUFDMUJxRSxNQUFBQSxHQUFHLENBQUMrQyxVQUFKLENBQWUsT0FBZixJQUEwQi9DLEdBQUcsQ0FBQ3BFLE9BQUosQ0FBWUssT0FBWixDQUFvQixPQUFwQixFQUE2QixHQUE3QixDQUExQjtBQUNBO0FBQ0QsR0FMRDtBQU9BRSxFQUFBQSxNQUFNLENBQUNPLGNBQVAsQ0FBc0J6QixLQUFLLENBQUN5RCxTQUFOLENBQWdCNEgsTUFBaEIsQ0FBdUJ6RCxHQUE3QyxFQUFrRCxZQUFsRCxFQUFnRTs7Ozs7Ozs7Ozs7O0FBWS9EbEcsSUFBQUEsS0FBSyxFQUFFLFNBQVM0SixVQUFULENBQW9CQyxPQUFwQixFQUE2QnRMLElBQTdCLEVBQW1DO0FBQ3pDLFVBQUl1TCxtQkFBbUIsR0FBRyxFQUExQjtBQUNBQSxNQUFBQSxtQkFBbUIsQ0FBQyxjQUFjdkwsSUFBZixDQUFuQixHQUEwQztBQUN6QzBJLFFBQUFBLE9BQU8sRUFBRSxtQ0FEZ0M7QUFFekNILFFBQUFBLFVBQVUsRUFBRSxJQUY2QjtBQUd6QzNFLFFBQUFBLE1BQU0sRUFBRTdELEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0J4RCxJQUFoQjtBQUhpQyxPQUExQztBQUtBdUwsTUFBQUEsbUJBQW1CLENBQUMsT0FBRCxDQUFuQixHQUErQixzQkFBL0I7QUFFQSxVQUFJM0gsTUFBTSxHQUFHO0FBQ1osMEJBQWtCO0FBQ2pCOEUsVUFBQUEsT0FBTyxFQUFFLDJCQURRO0FBRWpCOUUsVUFBQUEsTUFBTSxFQUFFMkg7QUFGUztBQUROLE9BQWI7QUFNQTNILE1BQUFBLE1BQU0sQ0FBQyxjQUFjNUQsSUFBZixDQUFOLEdBQTZCO0FBQzVCMEksUUFBQUEsT0FBTyxFQUFFLFNBRG1CO0FBRTVCOUUsUUFBQUEsTUFBTSxFQUFFN0QsS0FBSyxDQUFDeUQsU0FBTixDQUFnQnhELElBQWhCO0FBRm9CLE9BQTdCO0FBS0EsVUFBSXdMLEdBQUcsR0FBRyxFQUFWO0FBQ0FBLE1BQUFBLEdBQUcsQ0FBQ0YsT0FBRCxDQUFILEdBQWU7QUFDZDVDLFFBQUFBLE9BQU8sRUFBRUcsTUFBTSxDQUFDLDJGQUEyRkMsTUFBM0YsQ0FBa0cvSCxPQUFsRyxDQUEwRyxLQUExRyxFQUFpSCxZQUFZO0FBQUUsaUJBQU91SyxPQUFQO0FBQWlCLFNBQWhKLENBQUQsRUFBb0osR0FBcEosQ0FERDtBQUVkL0MsUUFBQUEsVUFBVSxFQUFFLElBRkU7QUFHZEMsUUFBQUEsTUFBTSxFQUFFLElBSE07QUFJZDVFLFFBQUFBLE1BQU0sRUFBRUE7QUFKTSxPQUFmO0FBT0E3RCxNQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCRyxZQUFoQixDQUE2QixRQUE3QixFQUF1QyxPQUF2QyxFQUFnRDZILEdBQWhEO0FBQ0E7QUF6QzhELEdBQWhFO0FBNENBekwsRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQmlJLElBQWhCLEdBQXVCMUwsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjRILE1BQXZDO0FBQ0FyTCxFQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCa0ksTUFBaEIsR0FBeUIzTCxLQUFLLENBQUN5RCxTQUFOLENBQWdCNEgsTUFBekM7QUFDQXJMLEVBQUFBLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0JtSSxHQUFoQixHQUFzQjVMLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0I0SCxNQUF0QztBQUVBckwsRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQm9JLEdBQWhCLEdBQXNCN0wsS0FBSyxDQUFDeUQsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUIsUUFBdkIsRUFBaUMsRUFBakMsQ0FBdEI7QUFDQTFELEVBQUFBLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0JxSSxJQUFoQixHQUF1QjlMLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0JvSSxHQUF2QztBQUNBN0wsRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQnNJLElBQWhCLEdBQXVCL0wsS0FBSyxDQUFDeUQsU0FBTixDQUFnQm9JLEdBQXZDO0FBQ0E3TCxFQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCdUksR0FBaEIsR0FBc0JoTSxLQUFLLENBQUN5RCxTQUFOLENBQWdCb0ksR0FBdEM7QUFHQTs7OztBQUlDLGFBQVU3TCxLQUFWLEVBQWlCO0FBRWpCLFFBQUlpTSxNQUFNLEdBQUcsK0NBQWI7QUFFQWpNLElBQUFBLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0J5SSxHQUFoQixHQUFzQjtBQUNyQixpQkFBVyxrQkFEVTtBQUVyQixnQkFBVTtBQUNUdkQsUUFBQUEsT0FBTyxFQUFFLGdDQURBO0FBRVQ5RSxRQUFBQSxNQUFNLEVBQUU7QUFDUCxrQkFBUSxVQUREO0FBRVAsd0NBQThCO0FBQzdCOEUsWUFBQUEsT0FBTyxFQUFFLDZFQURvQjtBQUU3QkgsWUFBQUEsVUFBVSxFQUFFLElBRmlCO0FBRzdCNUgsWUFBQUEsS0FBSyxFQUFFO0FBSHNCLFdBRnZCO0FBT1AscUJBQVc7QUFDVitILFlBQUFBLE9BQU8sRUFBRSx3Q0FEQztBQUVWSCxZQUFBQSxVQUFVLEVBQUU7QUFGRixXQVBKOztBQUFBO0FBRkMsT0FGVztBQWtCckIsYUFBTzs7QUFFTkcsUUFBQUEsT0FBTyxFQUFFRyxNQUFNLENBQUMsaUJBQWlCbUQsTUFBTSxDQUFDbEQsTUFBeEIsR0FBaUMsR0FBakMsR0FBdUMsOEJBQThCQSxNQUFyRSxHQUE4RSxNQUEvRSxFQUF1RixHQUF2RixDQUZUO0FBR05OLFFBQUFBLE1BQU0sRUFBRSxJQUhGO0FBSU41RSxRQUFBQSxNQUFNLEVBQUU7QUFDUCxzQkFBWSxPQURMO0FBRVAseUJBQWUsU0FGUjtBQUdQLG9CQUFVO0FBQ1Q4RSxZQUFBQSxPQUFPLEVBQUVHLE1BQU0sQ0FBQyxNQUFNbUQsTUFBTSxDQUFDbEQsTUFBYixHQUFzQixHQUF2QixDQUROO0FBRVRuSSxZQUFBQSxLQUFLLEVBQUU7QUFGRTtBQUhIO0FBSkYsT0FsQmM7QUErQnJCLGtCQUFZa0ksTUFBTSxDQUFDLDBCQUEwQm1ELE1BQU0sQ0FBQ2xELE1BQWpDLEdBQTBDLGdCQUEzQyxDQS9CRztBQWdDckIsZ0JBQVU7QUFDVEosUUFBQUEsT0FBTyxFQUFFc0QsTUFEQTtBQUVUeEQsUUFBQUEsTUFBTSxFQUFFO0FBRkMsT0FoQ1c7QUFvQ3JCLGtCQUFZLDhDQXBDUztBQXFDckIsbUJBQWEsZUFyQ1E7QUFzQ3JCLGtCQUFZLG1CQXRDUztBQXVDckIscUJBQWU7QUF2Q00sS0FBdEI7QUEwQ0F6SSxJQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCeUksR0FBaEIsQ0FBb0IsUUFBcEIsRUFBOEJySSxNQUE5QixDQUFxQytDLElBQXJDLEdBQTRDNUcsS0FBSyxDQUFDeUQsU0FBTixDQUFnQnlJLEdBQTVEO0FBRUEsUUFBSWIsTUFBTSxHQUFHckwsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjRILE1BQTdCOztBQUNBLFFBQUlBLE1BQUosRUFBWTtBQUNYQSxNQUFBQSxNQUFNLENBQUN6RCxHQUFQLENBQVcwRCxVQUFYLENBQXNCLE9BQXRCLEVBQStCLEtBQS9CO0FBRUF0TCxNQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCRyxZQUFoQixDQUE2QixRQUE3QixFQUF1QyxZQUF2QyxFQUFxRDtBQUNwRCxzQkFBYztBQUNiK0UsVUFBQUEsT0FBTyxFQUFFLDRDQURJO0FBRWI5RSxVQUFBQSxNQUFNLEVBQUU7QUFDUCx5QkFBYTtBQUNaOEUsY0FBQUEsT0FBTyxFQUFFLFlBREc7QUFFWjlFLGNBQUFBLE1BQU0sRUFBRXdILE1BQU0sQ0FBQ3pELEdBQVAsQ0FBVy9EO0FBRlAsYUFETjtBQUtQLDJCQUFlLHVCQUxSO0FBTVAsMEJBQWM7QUFDYjhFLGNBQUFBLE9BQU8sRUFBRSxLQURJO0FBRWI5RSxjQUFBQSxNQUFNLEVBQUU3RCxLQUFLLENBQUN5RCxTQUFOLENBQWdCeUk7QUFGWDtBQU5QLFdBRks7QUFhYnRMLFVBQUFBLEtBQUssRUFBRTtBQWJNO0FBRHNDLE9BQXJELEVBZ0JHeUssTUFBTSxDQUFDekQsR0FoQlY7QUFpQkE7QUFFRCxHQXZFQSxFQXVFQzVILEtBdkVELENBQUQ7QUEwRUE7Ozs7O0FBSUFBLEVBQUFBLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0IwSSxLQUFoQixHQUF3QjtBQUN2QixlQUFXLENBQ1Y7QUFDQ3hELE1BQUFBLE9BQU8sRUFBRSxpQ0FEVjtBQUVDSCxNQUFBQSxVQUFVLEVBQUU7QUFGYixLQURVLEVBS1Y7QUFDQ0csTUFBQUEsT0FBTyxFQUFFLGtCQURWO0FBRUNILE1BQUFBLFVBQVUsRUFBRSxJQUZiO0FBR0NDLE1BQUFBLE1BQU0sRUFBRTtBQUhULEtBTFUsQ0FEWTtBQVl2QixjQUFVO0FBQ1RFLE1BQUFBLE9BQU8sRUFBRSxnREFEQTtBQUVURixNQUFBQSxNQUFNLEVBQUU7QUFGQyxLQVphO0FBZ0J2QixrQkFBYztBQUNiRSxNQUFBQSxPQUFPLEVBQUUsMEZBREk7QUFFYkgsTUFBQUEsVUFBVSxFQUFFLElBRkM7QUFHYjNFLE1BQUFBLE1BQU0sRUFBRTtBQUNQLHVCQUFlO0FBRFI7QUFISyxLQWhCUztBQXVCdkIsZUFBVyw0R0F2Qlk7QUF3QnZCLGVBQVcsb0JBeEJZO0FBeUJ2QixnQkFBWSxXQXpCVztBQTBCdkIsY0FBVSx1REExQmE7QUEyQnZCLGdCQUFZLDhDQTNCVztBQTRCdkIsbUJBQWU7QUE1QlEsR0FBeEI7QUFnQ0E7Ozs7QUFJQTdELEVBQUFBLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0IySSxVQUFoQixHQUE2QnBNLEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCLE9BQXZCLEVBQWdDO0FBQzVELGtCQUFjLENBQ2IxRCxLQUFLLENBQUN5RCxTQUFOLENBQWdCMEksS0FBaEIsQ0FBc0IsWUFBdEIsQ0FEYSxFQUViO0FBQ0N4RCxNQUFBQSxPQUFPLEVBQUUseUZBRFY7QUFFQ0gsTUFBQUEsVUFBVSxFQUFFO0FBRmIsS0FGYSxDQUQ4QztBQVE1RCxlQUFXLENBQ1Y7QUFDQ0csTUFBQUEsT0FBTyxFQUFFLGlDQURWO0FBRUNILE1BQUFBLFVBQVUsRUFBRTtBQUZiLEtBRFUsRUFLVjtBQUNDRyxNQUFBQSxPQUFPLEVBQUUsbVpBRFY7QUFFQ0gsTUFBQUEsVUFBVSxFQUFFO0FBRmIsS0FMVSxDQVJpRDtBQWtCNUQsY0FBVSwrTkFsQmtEOztBQW9CNUQsZ0JBQVksbUZBcEJnRDtBQXFCNUQsZ0JBQVk7QUFyQmdELEdBQWhDLENBQTdCO0FBd0JBeEksRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjJJLFVBQWhCLENBQTJCLFlBQTNCLEVBQXlDLENBQXpDLEVBQTRDekQsT0FBNUMsR0FBc0Qsc0VBQXREO0FBRUEzSSxFQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCRyxZQUFoQixDQUE2QixZQUE3QixFQUEyQyxTQUEzQyxFQUFzRDtBQUNyRCxhQUFTO0FBQ1IrRSxNQUFBQSxPQUFPLEVBQUUsc0xBREQ7QUFFUkgsTUFBQUEsVUFBVSxFQUFFLElBRko7QUFHUkMsTUFBQUEsTUFBTSxFQUFFO0FBSEEsS0FENEM7O0FBT3JELHlCQUFxQjtBQUNwQkUsTUFBQUEsT0FBTyxFQUFFLCtKQURXO0FBRXBCL0gsTUFBQUEsS0FBSyxFQUFFO0FBRmEsS0FQZ0M7QUFXckQsaUJBQWEsQ0FDWjtBQUNDK0gsTUFBQUEsT0FBTyxFQUFFLHVHQURWO0FBRUNILE1BQUFBLFVBQVUsRUFBRSxJQUZiO0FBR0MzRSxNQUFBQSxNQUFNLEVBQUU3RCxLQUFLLENBQUN5RCxTQUFOLENBQWdCMkk7QUFIekIsS0FEWSxFQU1aO0FBQ0N6RCxNQUFBQSxPQUFPLEVBQUUsK0NBRFY7QUFFQzlFLE1BQUFBLE1BQU0sRUFBRTdELEtBQUssQ0FBQ3lELFNBQU4sQ0FBZ0IySTtBQUZ6QixLQU5ZLEVBVVo7QUFDQ3pELE1BQUFBLE9BQU8sRUFBRSxtREFEVjtBQUVDSCxNQUFBQSxVQUFVLEVBQUUsSUFGYjtBQUdDM0UsTUFBQUEsTUFBTSxFQUFFN0QsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjJJO0FBSHpCLEtBVlksRUFlWjtBQUNDekQsTUFBQUEsT0FBTyxFQUFFLCtjQURWO0FBRUNILE1BQUFBLFVBQVUsRUFBRSxJQUZiO0FBR0MzRSxNQUFBQSxNQUFNLEVBQUU3RCxLQUFLLENBQUN5RCxTQUFOLENBQWdCMkk7QUFIekIsS0FmWSxDQVh3QztBQWdDckQsZ0JBQVk7QUFoQ3lDLEdBQXREO0FBbUNBcE0sRUFBQUEsS0FBSyxDQUFDeUQsU0FBTixDQUFnQkcsWUFBaEIsQ0FBNkIsWUFBN0IsRUFBMkMsUUFBM0MsRUFBcUQ7QUFDcEQsdUJBQW1CO0FBQ2xCK0UsTUFBQUEsT0FBTyxFQUFFLG1FQURTO0FBRWxCRixNQUFBQSxNQUFNLEVBQUUsSUFGVTtBQUdsQjVFLE1BQUFBLE1BQU0sRUFBRTtBQUNQLGdDQUF3QjtBQUN2QjhFLFVBQUFBLE9BQU8sRUFBRSxPQURjO0FBRXZCL0gsVUFBQUEsS0FBSyxFQUFFO0FBRmdCLFNBRGpCO0FBS1AseUJBQWlCO0FBQ2hCK0gsVUFBQUEsT0FBTyxFQUFFLDREQURPO0FBRWhCSCxVQUFBQSxVQUFVLEVBQUUsSUFGSTtBQUdoQjNFLFVBQUFBLE1BQU0sRUFBRTtBQUNQLHlDQUE2QjtBQUM1QjhFLGNBQUFBLE9BQU8sRUFBRSxTQURtQjtBQUU1Qi9ILGNBQUFBLEtBQUssRUFBRTtBQUZxQixhQUR0QjtBQUtQZ0csWUFBQUEsSUFBSSxFQUFFNUcsS0FBSyxDQUFDeUQsU0FBTixDQUFnQjJJO0FBTGY7QUFIUSxTQUxWO0FBZ0JQLGtCQUFVO0FBaEJIO0FBSFU7QUFEaUMsR0FBckQ7O0FBeUJBLE1BQUlwTSxLQUFLLENBQUN5RCxTQUFOLENBQWdCNEgsTUFBcEIsRUFBNEI7QUFDM0JyTCxJQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCNEgsTUFBaEIsQ0FBdUJ6RCxHQUF2QixDQUEyQjBELFVBQTNCLENBQXNDLFFBQXRDLEVBQWdELFlBQWhEO0FBQ0E7O0FBRUR0TCxFQUFBQSxLQUFLLENBQUN5RCxTQUFOLENBQWdCNEksRUFBaEIsR0FBcUJyTSxLQUFLLENBQUN5RCxTQUFOLENBQWdCMkksVUFBckM7QUFHQTs7OztBQUlBLEdBQUMsWUFBWTtBQUNaLFFBQUksT0FBT3JNLElBQVAsS0FBZ0IsV0FBaEIsSUFBK0IsQ0FBQ0EsSUFBSSxDQUFDQyxLQUFyQyxJQUE4QyxDQUFDRCxJQUFJLENBQUM2QyxRQUF4RCxFQUFrRTtBQUNqRTtBQUNBOztBQUVELFFBQUk1QyxLQUFLLEdBQUdILE1BQU0sQ0FBQ0csS0FBbkI7QUFFQSxRQUFJc00sZUFBZSxHQUFHLFVBQXRCOztBQUNBLFFBQUlDLGVBQWUsR0FBRyxVQUFVQyxNQUFWLEVBQWtCL0IsT0FBbEIsRUFBMkI7QUFDaEQsYUFBTyxhQUFhK0IsTUFBYixHQUFzQix3QkFBdEIsR0FBaUQvQixPQUF4RDtBQUNBLEtBRkQ7O0FBR0EsUUFBSWdDLHFCQUFxQixHQUFHLDBDQUE1QjtBQUVBLFFBQUlDLFVBQVUsR0FBRztBQUNoQixZQUFNLFlBRFU7QUFFaEIsWUFBTSxRQUZVO0FBR2hCLFlBQU0sTUFIVTtBQUloQixhQUFPLFlBSlM7QUFLaEIsY0FBUSxZQUxRO0FBTWhCLFlBQU0sTUFOVTtBQU9oQixhQUFPLE9BUFM7QUFRaEIsV0FBSyxHQVJXO0FBU2hCLGFBQU87QUFUUyxLQUFqQjtBQVlBLFFBQUlDLFdBQVcsR0FBRyxpQkFBbEI7QUFDQSxRQUFJQyxjQUFjLEdBQUcsU0FBckI7QUFDQSxRQUFJQyxhQUFhLEdBQUcsUUFBcEI7QUFDQSxRQUFJQyxhQUFhLEdBQUcsUUFBcEI7QUFFQSxRQUFJQyxRQUFRLEdBQUcsd0JBQXdCSixXQUF4QixHQUFzQyxJQUF0QyxHQUE2Q0UsYUFBN0MsR0FBNkQsS0FBN0QsR0FDWixRQURZLEdBQ0RGLFdBREMsR0FDYSxJQURiLEdBQ29CQyxjQURwQixHQUNxQyxLQURwRDtBQUdBLFFBQUkzTSxJQUFJLEdBQUcsNkJBQVg7Ozs7Ozs7OztBQVNBLGFBQVMrTSxnQkFBVCxDQUEwQjNLLE9BQTFCLEVBQW1Da0QsUUFBbkMsRUFBNkM7QUFDNUMsVUFBSWhELFNBQVMsR0FBR0YsT0FBTyxDQUFDRSxTQUF4QjtBQUNBQSxNQUFBQSxTQUFTLEdBQUdBLFNBQVMsQ0FBQ3ZCLE9BQVYsQ0FBa0JmLElBQWxCLEVBQXdCLEdBQXhCLElBQStCLFlBQS9CLEdBQThDc0YsUUFBMUQ7QUFDQWxELE1BQUFBLE9BQU8sQ0FBQ0UsU0FBUixHQUFvQkEsU0FBUyxDQUFDdkIsT0FBVixDQUFrQixNQUFsQixFQUEwQixHQUExQixFQUErQmlNLElBQS9CLEVBQXBCO0FBQ0E7O0FBR0RqTixJQUFBQSxLQUFLLENBQUNpRixLQUFOLENBQVltQyxHQUFaLENBQWdCLHFCQUFoQixFQUF1QyxVQUFVckMsR0FBVixFQUFlO0FBQ3JEQSxNQUFBQSxHQUFHLENBQUNDLFFBQUosSUFBZ0IsT0FBTytILFFBQXZCO0FBQ0EsS0FGRDtBQUlBL00sSUFBQUEsS0FBSyxDQUFDaUYsS0FBTixDQUFZbUMsR0FBWixDQUFnQixxQkFBaEIsRUFBdUMsVUFBVXJDLEdBQVYsRUFBZTtBQUNyRCxVQUFJbUksR0FBRzs7QUFBa0NuSSxNQUFBQSxHQUFHLENBQUMxQyxPQUE3Qzs7QUFDQSxVQUFJNkssR0FBRyxDQUFDQyxPQUFKLENBQVlKLFFBQVosQ0FBSixFQUEyQjtBQUMxQmhJLFFBQUFBLEdBQUcsQ0FBQ1csSUFBSixHQUFXLEVBQVgsQ0FEMEI7O0FBRzFCd0gsUUFBQUEsR0FBRyxDQUFDRSxZQUFKLENBQWlCVCxXQUFqQixFQUE4QkMsY0FBOUIsRUFIMEI7OztBQU0xQixZQUFJbEgsSUFBSSxHQUFHd0gsR0FBRyxDQUFDRyxXQUFKLENBQWdCekssUUFBUSxDQUFDMEssYUFBVCxDQUF1QixNQUF2QixDQUFoQixDQUFYO0FBQ0E1SCxRQUFBQSxJQUFJLENBQUNDLFdBQUwsR0FBbUIyRyxlQUFuQjtBQUVBLFlBQUl2SixHQUFHLEdBQUdtSyxHQUFHLENBQUNLLFlBQUosQ0FBaUIsVUFBakIsQ0FBVjtBQUVBLFlBQUloSSxRQUFRLEdBQUdSLEdBQUcsQ0FBQ1EsUUFBbkI7O0FBQ0EsWUFBSUEsUUFBUSxLQUFLLE1BQWpCLEVBQXlCOzs7QUFHeEIsY0FBSWlJLFNBQVMsR0FBRyxDQUFDLFdBQVd4SyxJQUFYLENBQWdCRCxHQUFoQixLQUF3QixHQUFHLE1BQUgsQ0FBekIsRUFBcUMsQ0FBckMsQ0FBaEI7QUFDQXdDLFVBQUFBLFFBQVEsR0FBR21ILFVBQVUsQ0FBQ2MsU0FBRCxDQUFWLElBQXlCQSxTQUFwQztBQUNBLFNBakJ5Qjs7O0FBb0IxQlIsUUFBQUEsZ0JBQWdCLENBQUN0SCxJQUFELEVBQU9ILFFBQVAsQ0FBaEI7QUFDQXlILFFBQUFBLGdCQUFnQixDQUFDRSxHQUFELEVBQU0zSCxRQUFOLENBQWhCLENBckIwQjs7QUF3QjFCLFlBQUlrSSxVQUFVLEdBQUd6TixLQUFLLENBQUMwRSxPQUFOLENBQWMrSSxVQUEvQjs7QUFDQSxZQUFJQSxVQUFKLEVBQWdCO0FBQ2ZBLFVBQUFBLFVBQVUsQ0FBQ0MsYUFBWCxDQUF5Qm5JLFFBQXpCO0FBQ0EsU0EzQnlCOzs7QUE4QjFCLFlBQUlvSSxHQUFHLEdBQUcsSUFBSUMsY0FBSixFQUFWO0FBQ0FELFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTLEtBQVQsRUFBZ0I5SyxHQUFoQixFQUFxQixJQUFyQjs7QUFDQTRLLFFBQUFBLEdBQUcsQ0FBQ0csa0JBQUosR0FBeUIsWUFBWTtBQUNwQyxjQUFJSCxHQUFHLENBQUM1QyxVQUFKLElBQWtCLENBQXRCLEVBQXlCO0FBQ3hCLGdCQUFJNEMsR0FBRyxDQUFDbkIsTUFBSixHQUFhLEdBQWIsSUFBb0JtQixHQUFHLENBQUNJLFlBQTVCLEVBQTBDOztBQUV6Q2IsY0FBQUEsR0FBRyxDQUFDRSxZQUFKLENBQWlCVCxXQUFqQixFQUE4QkUsYUFBOUIsRUFGeUM7O0FBS3pDbkgsY0FBQUEsSUFBSSxDQUFDQyxXQUFMLEdBQW1CZ0ksR0FBRyxDQUFDSSxZQUF2QjtBQUNBL04sY0FBQUEsS0FBSyxDQUFDc0YsZ0JBQU4sQ0FBdUJJLElBQXZCO0FBRUEsYUFSRCxNQVFPOztBQUVOd0gsY0FBQUEsR0FBRyxDQUFDRSxZQUFKLENBQWlCVCxXQUFqQixFQUE4QkcsYUFBOUI7O0FBRUEsa0JBQUlhLEdBQUcsQ0FBQ25CLE1BQUosSUFBYyxHQUFsQixFQUF1QjtBQUN0QjlHLGdCQUFBQSxJQUFJLENBQUNDLFdBQUwsR0FBbUI0RyxlQUFlLENBQUNvQixHQUFHLENBQUNuQixNQUFMLEVBQWFtQixHQUFHLENBQUNLLFVBQWpCLENBQWxDO0FBQ0EsZUFGRCxNQUVPO0FBQ050SSxnQkFBQUEsSUFBSSxDQUFDQyxXQUFMLEdBQW1COEcscUJBQW5CO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsU0FyQkQ7O0FBc0JBa0IsUUFBQUEsR0FBRyxDQUFDTSxJQUFKLENBQVMsSUFBVDtBQUNBO0FBQ0QsS0ExREQ7QUE0REFqTyxJQUFBQSxLQUFLLENBQUMwRSxPQUFOLENBQWN3SixhQUFkLEdBQThCOzs7Ozs7OztBQVE3QnpILE1BQUFBLFNBQVMsRUFBRSxTQUFTQSxTQUFULENBQW1CM0IsU0FBbkIsRUFBOEI7QUFDeEMsWUFBSUssUUFBUSxHQUFHLENBQUNMLFNBQVMsSUFBSWxDLFFBQWQsRUFBd0J5QyxnQkFBeEIsQ0FBeUMwSCxRQUF6QyxDQUFmOztBQUVBLGFBQUssSUFBSTVLLENBQUMsR0FBRyxDQUFSLEVBQVdFLE9BQWhCLEVBQXlCQSxPQUFPLEdBQUc4QyxRQUFRLENBQUNoRCxDQUFDLEVBQUYsQ0FBM0MsR0FBbUQ7QUFDbERuQyxVQUFBQSxLQUFLLENBQUNzRixnQkFBTixDQUF1QmpELE9BQXZCO0FBQ0E7QUFDRDtBQWQ0QixLQUE5QjtBQWlCQSxRQUFJOEwsTUFBTSxHQUFHLEtBQWI7OztBQUVBbk8sSUFBQUEsS0FBSyxDQUFDa08sYUFBTixHQUFzQixZQUFZO0FBQ2pDLFVBQUksQ0FBQ0MsTUFBTCxFQUFhO0FBQ1pDLFFBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHlGQUFiO0FBQ0FGLFFBQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0E7O0FBQ0RuTyxNQUFBQSxLQUFLLENBQUMwRSxPQUFOLENBQWN3SixhQUFkLENBQTRCekgsU0FBNUIsQ0FBc0NyQixLQUF0QyxDQUE0QyxJQUE1QyxFQUFrRGtKLFNBQWxEO0FBQ0EsS0FORDtBQVFBLEdBNUlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMS9Dc0JDLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7QUFFZkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7O0FBRk9BLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU5iN0ksSUFBQUEsSUFBSSxHQUFHOzs7QUFDUHpGLElBQUFBLElBQUksR0FBRzs7UUFFWnlMLElBQUksR0FBRzFMLEtBQUssQ0FBQ3lHLFNBQU4sQ0FBZ0JmLElBQWhCLEVBQXNCMUYsS0FBSyxDQUFDeUQsU0FBTixDQUFnQnhELElBQWhCLENBQXRCLEVBQTZDLFlBQTdDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
