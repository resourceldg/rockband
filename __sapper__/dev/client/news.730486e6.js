import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, L as create_component, M as claim_component, N as mount_component, D as noop, t as transition_in, q as transition_out, Q as destroy_component } from './client.ab49adcb.js';
import { c as createCommonjsModule, u as unwrapExports } from './_commonjsHelpers.fffabd3b.js';

var svelteTwitterWidgets = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function noop() {}

  function assign(target) {
    var k,
        source,
        i = 1,
        len = arguments.length;

    for (; i < len; i++) {
      source = arguments[i];

      for (k in source) target[k] = source[k];
    }

    return target;
  }

  function appendNode(node, target) {
    target.appendChild(node);
  }

  function insertNode(node, target, anchor) {
    target.insertBefore(node, anchor);
  }

  function detachNode(node) {
    node.parentNode.removeChild(node);
  }

  function createElement(name) {
    return document.createElement(name);
  }

  function createText(data) {
    return document.createTextNode(data);
  }

  function setAttribute(node, attribute, value) {
    node.setAttribute(attribute, value);
  }

  function blankObject() {
    return Object.create(null);
  }

  function destroy(detach) {
    this.destroy = noop;
    this.fire('destroy');
    this.set = this.get = noop;
    if (detach !== false) this._fragment.u();

    this._fragment.d();

    this._fragment = this._state = null;
  }

  function differs(a, b) {
    return a !== b || a && typeof a === 'object' || typeof a === 'function';
  }

  function dispatchObservers(component, group, changed, newState, oldState) {
    for (var key in group) {
      if (!changed[key]) continue;
      var newValue = newState[key];
      var oldValue = oldState[key];
      var callbacks = group[key];
      if (!callbacks) continue;

      for (var i = 0; i < callbacks.length; i += 1) {
        var callback = callbacks[i];
        if (callback.__calling) continue;
        callback.__calling = true;
        callback.call(component, newValue, oldValue);
        callback.__calling = false;
      }
    }
  }

  function fire(eventName, data) {
    var handlers = eventName in this._handlers && this._handlers[eventName].slice();

    if (!handlers) return;

    for (var i = 0; i < handlers.length; i += 1) {
      handlers[i].call(this, data);
    }
  }

  function get(key) {
    return key ? this._state[key] : this._state;
  }

  function init(component, options) {
    component.options = options;
    component._observers = {
      pre: blankObject(),
      post: blankObject()
    };
    component._handlers = blankObject();
    component._root = options._root || component;
    component._yield = options._yield;
    component._bind = options._bind;
  }

  function observe(key, callback, options) {
    var group = options && options.defer ? this._observers.post : this._observers.pre;
    (group[key] || (group[key] = [])).push(callback);

    if (!options || options.init !== false) {
      callback.__calling = true;
      callback.call(this, this._state[key]);
      callback.__calling = false;
    }

    return {
      cancel: function () {
        var index = group[key].indexOf(callback);
        if (~index) group[key].splice(index, 1);
      }
    };
  }

  function on(eventName, handler) {
    if (eventName === 'teardown') return this.on('destroy', handler);
    var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
    handlers.push(handler);
    return {
      cancel: function () {
        var index = handlers.indexOf(handler);
        if (~index) handlers.splice(index, 1);
      }
    };
  }

  function set(newState) {
    this._set(assign({}, newState));

    if (this._root._lock) return;
    this._root._lock = true;
    callAll(this._root._beforecreate);
    callAll(this._root._oncreate);
    callAll(this._root._aftercreate);
    this._root._lock = false;
  }

  function _set(newState) {
    var oldState = this._state,
        changed = {},
        dirty = false;

    for (var key in newState) {
      if (differs(newState[key], oldState[key])) changed[key] = dirty = true;
    }

    if (!dirty) return;
    this._state = assign({}, oldState, newState);

    this._recompute(changed, this._state);

    if (this._bind) this._bind(changed, this._state);
    dispatchObservers(this, this._observers.pre, changed, this._state, oldState);

    this._fragment.p(changed, this._state);

    dispatchObservers(this, this._observers.post, changed, this._state, oldState);
  }

  function callAll(fns) {
    while (fns && fns.length) fns.pop()();
  }

  function _mount(target, anchor) {
    this._fragment.m(target, anchor);
  }

  function _unmount() {
    this._fragment.u();
  }

  var proto = {
    destroy: destroy,
    get: get,
    fire: fire,
    observe: observe,
    on: on,
    set: set,
    teardown: destroy,
    _recompute: noop,
    _set: _set,
    _mount: _mount,
    _unmount: _unmount
  };
  var twitter = {
    loadAPI() {
      var id = 'twitter-wjs'; // if script was already set, don't load it again.

      if (document.getElementById(id)) return;
      var s = document.createElement('script');
      s.id = id;
      s.type = 'text/javascript';
      s.async = true;
      s.src = '//platform.twitter.com/widgets.js';
      document.getElementsByTagName('head')[0].appendChild(s);
    }

  };
  /* src/components/Timeline.html generated by Svelte v1.40.1 */

  function timelineClass(href, grid) {
    if (href.indexOf('/timelines/') > -1 && grid) return 'twitter-grid';
    return 'twitter-timeline';
  }

  function data() {
    return {
      href: 'https://twitter.com/sveltejs',
      grid: false,
      lang: undefined,
      showReplies: undefined,
      chrome: undefined,
      theme: undefined,
      width: undefined,
      height: undefined,
      tweetLimit: undefined,
      linkColor: undefined,
      borderColor: undefined,
      ariaPolite: undefined,
      dnt: undefined
    };
  }

  function oncreate() {
    twitter.loadAPI();
  }

  function create_main_fragment(state, component) {
    var a, text, text_1, text_2;
    return {
      c: function create() {
        a = createElement("a");
        text = createText("Tweets from ");
        text_1 = createText(state.href);
        text_2 = createText(".");
        this.h();
      },
      h: function hydrate() {
        setAttribute(a, "data-width", state.width);
        a.className = state.timelineClass;
        setAttribute(a, "data-lang", state.lang);
        setAttribute(a, "data-show-replies", state.showReplies);
        setAttribute(a, "data-chrome", state.chrome);
        setAttribute(a, "data-theme", state.theme);
        a.href = state.href;
        setAttribute(a, "data-height", state.height);
        setAttribute(a, "data-tweet-limit", state.tweetLimit);
        setAttribute(a, "data-link-color", state.linkColor);
        setAttribute(a, "data-border-color", state.borderColor);
        setAttribute(a, "data-aria-polite", state.ariaPolite);
        setAttribute(a, "data-dnt", state.dnt);
      },
      m: function mount(target, anchor) {
        insertNode(a, target, anchor);
        appendNode(text, a);
        appendNode(text_1, a);
        appendNode(text_2, a);
      },
      p: function update(changed, state) {
        if (changed.width) {
          setAttribute(a, "data-width", state.width);
        }

        if (changed.timelineClass) {
          a.className = state.timelineClass;
        }

        if (changed.lang) {
          setAttribute(a, "data-lang", state.lang);
        }

        if (changed.showReplies) {
          setAttribute(a, "data-show-replies", state.showReplies);
        }

        if (changed.chrome) {
          setAttribute(a, "data-chrome", state.chrome);
        }

        if (changed.theme) {
          setAttribute(a, "data-theme", state.theme);
        }

        if (changed.href) {
          a.href = state.href;
        }

        if (changed.height) {
          setAttribute(a, "data-height", state.height);
        }

        if (changed.tweetLimit) {
          setAttribute(a, "data-tweet-limit", state.tweetLimit);
        }

        if (changed.linkColor) {
          setAttribute(a, "data-link-color", state.linkColor);
        }

        if (changed.borderColor) {
          setAttribute(a, "data-border-color", state.borderColor);
        }

        if (changed.ariaPolite) {
          setAttribute(a, "data-aria-polite", state.ariaPolite);
        }

        if (changed.dnt) {
          setAttribute(a, "data-dnt", state.dnt);
        }

        if (changed.href) {
          text_1.data = state.href;
        }
      },
      u: function unmount() {
        detachNode(a);
      },
      d: noop
    };
  }

  function Timeline(options) {
    init(this, options);
    this._state = assign(data(), options.data);

    this._recompute({
      href: 1,
      grid: 1
    }, this._state);

    var _oncreate = oncreate.bind(this);

    if (!options._root) {
      this._oncreate = [_oncreate];
    } else {
      this._root._oncreate.push(_oncreate);
    }

    this._fragment = create_main_fragment(this._state);

    if (options.target) {
      this._fragment.c();

      this._fragment.m(options.target, options.anchor || null);

      callAll(this._oncreate);
    }
  }

  assign(Timeline.prototype, proto);

  Timeline.prototype._recompute = function _recompute(changed, state) {
    if (changed.href || changed.grid) {
      if (differs(state.timelineClass, state.timelineClass = timelineClass(state.href, state.grid))) changed.timelineClass = true;
    }
  };
  /* src/components/Tweet.html generated by Svelte v1.40.1 */


  function data$1() {
    return {
      href: 'https://twitter.com/sveltejs/status/802710541366128640',
      cards: undefined,
      conversation: undefined,
      theme: undefined,
      linkColor: undefined,
      width: undefined,
      align: undefined,
      lang: undefined,
      dnt: undefined
    };
  }

  function oncreate$1() {
    twitter.loadAPI();
  }

  function create_main_fragment$1(state, component) {
    var blockquote, a, text, text_1, text_2;
    return {
      c: function create() {
        blockquote = createElement("blockquote");
        a = createElement("a");
        text = createText("Tweet from ");
        text_1 = createText(state.href);
        text_2 = createText(".");
        this.h();
      },
      h: function hydrate() {
        blockquote.className = "twitter-tweet";
        setAttribute(blockquote, "data-cards", state.cards);
        setAttribute(blockquote, "data-conversation", state.conversation);
        setAttribute(blockquote, "data-theme", state.theme);
        setAttribute(blockquote, "data-link-color", state.linkColor);
        setAttribute(blockquote, "data-width", state.width);
        setAttribute(blockquote, "data-align", state.align);
        setAttribute(blockquote, "data-lang", state.lang);
        setAttribute(blockquote, "data-dnt", state.dnt);
        a.href = state.href;
      },
      m: function mount(target, anchor) {
        insertNode(blockquote, target, anchor);
        appendNode(a, blockquote);
        appendNode(text, a);
        appendNode(text_1, a);
        appendNode(text_2, a);
      },
      p: function update(changed, state) {
        if (changed.cards) {
          setAttribute(blockquote, "data-cards", state.cards);
        }

        if (changed.conversation) {
          setAttribute(blockquote, "data-conversation", state.conversation);
        }

        if (changed.theme) {
          setAttribute(blockquote, "data-theme", state.theme);
        }

        if (changed.linkColor) {
          setAttribute(blockquote, "data-link-color", state.linkColor);
        }

        if (changed.width) {
          setAttribute(blockquote, "data-width", state.width);
        }

        if (changed.align) {
          setAttribute(blockquote, "data-align", state.align);
        }

        if (changed.lang) {
          setAttribute(blockquote, "data-lang", state.lang);
        }

        if (changed.dnt) {
          setAttribute(blockquote, "data-dnt", state.dnt);
        }

        if (changed.href) {
          a.href = state.href;
          text_1.data = state.href;
        }
      },
      u: function unmount() {
        detachNode(blockquote);
      },
      d: noop
    };
  }

  function Tweet(options) {
    init(this, options);
    this._state = assign(data$1(), options.data);

    var _oncreate = oncreate$1.bind(this);

    if (!options._root) {
      this._oncreate = [_oncreate];
    } else {
      this._root._oncreate.push(_oncreate);
    }

    this._fragment = create_main_fragment$1(this._state);

    if (options.target) {
      this._fragment.c();

      this._fragment.m(options.target, options.anchor || null);

      callAll(this._oncreate);
    }
  }

  assign(Tweet.prototype, proto);
  exports.Timeline = Timeline;
  exports.Tweet = Tweet;
});
unwrapExports(svelteTwitterWidgets);
var svelteTwitterWidgets_1 = svelteTwitterWidgets.Timeline;
var svelteTwitterWidgets_2 = svelteTwitterWidgets.Tweet;

/* src/routes/news.svelte generated by Svelte v3.24.0 */

function create_fragment(ctx) {
  let timeline;
  let current;
  timeline = new svelteTwitterWidgets_1({
    props: {
      href: "https://twitter.com/TwitterDev/timelines/539487832448843776",
      grid: true,
      theme: "dark"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(timeline.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(timeline.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(timeline, target, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(timeline.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(timeline.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(timeline, detaching);
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
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<News> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("News", $$slots, []);

  $$self.$capture_state = () => ({
    Tweet: svelteTwitterWidgets_2,
    Timeline: svelteTwitterWidgets_1
  });

  return [];
}

class News extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "News",
      options,
      id: create_fragment.name
    });
  }

}

export default News;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy43MzA0ODZlNi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZS10d2l0dGVyLXdpZGdldHMvZGlzdC9zdmVsdGUtdHdpdHRlci13aWRnZXRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcblx0dmFyIGssXG5cdFx0c291cmNlLFxuXHRcdGkgPSAxLFxuXHRcdGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cdFx0Zm9yIChrIGluIHNvdXJjZSkgdGFyZ2V0W2tdID0gc291cmNlW2tdO1xuXHR9XG5cblx0cmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gYXBwZW5kTm9kZShub2RlLCB0YXJnZXQpIHtcblx0dGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnROb2RlKG5vZGUsIHRhcmdldCwgYW5jaG9yKSB7XG5cdHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yKTtcbn1cblxuZnVuY3Rpb24gZGV0YWNoTm9kZShub2RlKSB7XG5cdG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudChuYW1lKSB7XG5cdHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZXh0KGRhdGEpIHtcblx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuXHRub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gYmxhbmtPYmplY3QoKSB7XG5cdHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG5mdW5jdGlvbiBkZXN0cm95KGRldGFjaCkge1xuXHR0aGlzLmRlc3Ryb3kgPSBub29wO1xuXHR0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcblx0dGhpcy5zZXQgPSB0aGlzLmdldCA9IG5vb3A7XG5cblx0aWYgKGRldGFjaCAhPT0gZmFsc2UpIHRoaXMuX2ZyYWdtZW50LnUoKTtcblx0dGhpcy5fZnJhZ21lbnQuZCgpO1xuXHR0aGlzLl9mcmFnbWVudCA9IHRoaXMuX3N0YXRlID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZGlmZmVycyhhLCBiKSB7XG5cdHJldHVybiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hPYnNlcnZlcnMoY29tcG9uZW50LCBncm91cCwgY2hhbmdlZCwgbmV3U3RhdGUsIG9sZFN0YXRlKSB7XG5cdGZvciAodmFyIGtleSBpbiBncm91cCkge1xuXHRcdGlmICghY2hhbmdlZFtrZXldKSBjb250aW51ZTtcblxuXHRcdHZhciBuZXdWYWx1ZSA9IG5ld1N0YXRlW2tleV07XG5cdFx0dmFyIG9sZFZhbHVlID0gb2xkU3RhdGVba2V5XTtcblxuXHRcdHZhciBjYWxsYmFja3MgPSBncm91cFtrZXldO1xuXHRcdGlmICghY2FsbGJhY2tzKSBjb250aW51ZTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHR2YXIgY2FsbGJhY2sgPSBjYWxsYmFja3NbaV07XG5cdFx0XHRpZiAoY2FsbGJhY2suX19jYWxsaW5nKSBjb250aW51ZTtcblxuXHRcdFx0Y2FsbGJhY2suX19jYWxsaW5nID0gdHJ1ZTtcblx0XHRcdGNhbGxiYWNrLmNhbGwoY29tcG9uZW50LCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuXHRcdFx0Y2FsbGJhY2suX19jYWxsaW5nID0gZmFsc2U7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGZpcmUoZXZlbnROYW1lLCBkYXRhKSB7XG5cdHZhciBoYW5kbGVycyA9XG5cdFx0ZXZlbnROYW1lIGluIHRoaXMuX2hhbmRsZXJzICYmIHRoaXMuX2hhbmRsZXJzW2V2ZW50TmFtZV0uc2xpY2UoKTtcblx0aWYgKCFoYW5kbGVycykgcmV0dXJuO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgaGFuZGxlcnMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRoYW5kbGVyc1tpXS5jYWxsKHRoaXMsIGRhdGEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldChrZXkpIHtcblx0cmV0dXJuIGtleSA/IHRoaXMuX3N0YXRlW2tleV0gOiB0aGlzLl9zdGF0ZTtcbn1cblxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMpIHtcblx0Y29tcG9uZW50Lm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cdGNvbXBvbmVudC5fb2JzZXJ2ZXJzID0geyBwcmU6IGJsYW5rT2JqZWN0KCksIHBvc3Q6IGJsYW5rT2JqZWN0KCkgfTtcblx0Y29tcG9uZW50Ll9oYW5kbGVycyA9IGJsYW5rT2JqZWN0KCk7XG5cdGNvbXBvbmVudC5fcm9vdCA9IG9wdGlvbnMuX3Jvb3QgfHwgY29tcG9uZW50O1xuXHRjb21wb25lbnQuX3lpZWxkID0gb3B0aW9ucy5feWllbGQ7XG5cdGNvbXBvbmVudC5fYmluZCA9IG9wdGlvbnMuX2JpbmQ7XG59XG5cbmZ1bmN0aW9uIG9ic2VydmUoa2V5LCBjYWxsYmFjaywgb3B0aW9ucykge1xuXHR2YXIgZ3JvdXAgPSBvcHRpb25zICYmIG9wdGlvbnMuZGVmZXJcblx0XHQ/IHRoaXMuX29ic2VydmVycy5wb3N0XG5cdFx0OiB0aGlzLl9vYnNlcnZlcnMucHJlO1xuXG5cdChncm91cFtrZXldIHx8IChncm91cFtrZXldID0gW10pKS5wdXNoKGNhbGxiYWNrKTtcblxuXHRpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucy5pbml0ICE9PSBmYWxzZSkge1xuXHRcdGNhbGxiYWNrLl9fY2FsbGluZyA9IHRydWU7XG5cdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzLl9zdGF0ZVtrZXldKTtcblx0XHRjYWxsYmFjay5fX2NhbGxpbmcgPSBmYWxzZTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Y2FuY2VsOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbmRleCA9IGdyb3VwW2tleV0uaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0XHRpZiAofmluZGV4KSBncm91cFtrZXldLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcblx0aWYgKGV2ZW50TmFtZSA9PT0gJ3RlYXJkb3duJykgcmV0dXJuIHRoaXMub24oJ2Rlc3Ryb3knLCBoYW5kbGVyKTtcblxuXHR2YXIgaGFuZGxlcnMgPSB0aGlzLl9oYW5kbGVyc1tldmVudE5hbWVdIHx8ICh0aGlzLl9oYW5kbGVyc1tldmVudE5hbWVdID0gW10pO1xuXHRoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuXG5cdHJldHVybiB7XG5cdFx0Y2FuY2VsOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbmRleCA9IGhhbmRsZXJzLmluZGV4T2YoaGFuZGxlcik7XG5cdFx0XHRpZiAofmluZGV4KSBoYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gc2V0KG5ld1N0YXRlKSB7XG5cdHRoaXMuX3NldChhc3NpZ24oe30sIG5ld1N0YXRlKSk7XG5cdGlmICh0aGlzLl9yb290Ll9sb2NrKSByZXR1cm47XG5cdHRoaXMuX3Jvb3QuX2xvY2sgPSB0cnVlO1xuXHRjYWxsQWxsKHRoaXMuX3Jvb3QuX2JlZm9yZWNyZWF0ZSk7XG5cdGNhbGxBbGwodGhpcy5fcm9vdC5fb25jcmVhdGUpO1xuXHRjYWxsQWxsKHRoaXMuX3Jvb3QuX2FmdGVyY3JlYXRlKTtcblx0dGhpcy5fcm9vdC5fbG9jayA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfc2V0KG5ld1N0YXRlKSB7XG5cdHZhciBvbGRTdGF0ZSA9IHRoaXMuX3N0YXRlLFxuXHRcdGNoYW5nZWQgPSB7fSxcblx0XHRkaXJ0eSA9IGZhbHNlO1xuXG5cdGZvciAodmFyIGtleSBpbiBuZXdTdGF0ZSkge1xuXHRcdGlmIChkaWZmZXJzKG5ld1N0YXRlW2tleV0sIG9sZFN0YXRlW2tleV0pKSBjaGFuZ2VkW2tleV0gPSBkaXJ0eSA9IHRydWU7XG5cdH1cblx0aWYgKCFkaXJ0eSkgcmV0dXJuO1xuXG5cdHRoaXMuX3N0YXRlID0gYXNzaWduKHt9LCBvbGRTdGF0ZSwgbmV3U3RhdGUpO1xuXHR0aGlzLl9yZWNvbXB1dGUoY2hhbmdlZCwgdGhpcy5fc3RhdGUpO1xuXHRpZiAodGhpcy5fYmluZCkgdGhpcy5fYmluZChjaGFuZ2VkLCB0aGlzLl9zdGF0ZSk7XG5cdGRpc3BhdGNoT2JzZXJ2ZXJzKHRoaXMsIHRoaXMuX29ic2VydmVycy5wcmUsIGNoYW5nZWQsIHRoaXMuX3N0YXRlLCBvbGRTdGF0ZSk7XG5cdHRoaXMuX2ZyYWdtZW50LnAoY2hhbmdlZCwgdGhpcy5fc3RhdGUpO1xuXHRkaXNwYXRjaE9ic2VydmVycyh0aGlzLCB0aGlzLl9vYnNlcnZlcnMucG9zdCwgY2hhbmdlZCwgdGhpcy5fc3RhdGUsIG9sZFN0YXRlKTtcbn1cblxuZnVuY3Rpb24gY2FsbEFsbChmbnMpIHtcblx0d2hpbGUgKGZucyAmJiBmbnMubGVuZ3RoKSBmbnMucG9wKCkoKTtcbn1cblxuZnVuY3Rpb24gX21vdW50KHRhcmdldCwgYW5jaG9yKSB7XG5cdHRoaXMuX2ZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xufVxuXG5mdW5jdGlvbiBfdW5tb3VudCgpIHtcblx0dGhpcy5fZnJhZ21lbnQudSgpO1xufVxuXG52YXIgcHJvdG8gPSB7XG5cdGRlc3Ryb3k6IGRlc3Ryb3ksXG5cdGdldDogZ2V0LFxuXHRmaXJlOiBmaXJlLFxuXHRvYnNlcnZlOiBvYnNlcnZlLFxuXHRvbjogb24sXG5cdHNldDogc2V0LFxuXHR0ZWFyZG93bjogZGVzdHJveSxcblx0X3JlY29tcHV0ZTogbm9vcCxcblx0X3NldDogX3NldCxcblx0X21vdW50OiBfbW91bnQsXG5cdF91bm1vdW50OiBfdW5tb3VudFxufTtcblxudmFyIHR3aXR0ZXIgPSB7XG5cbiAgbG9hZEFQSSAoKSB7XG4gICAgdmFyIGlkID0gJ3R3aXR0ZXItd2pzJztcblxuICAgIC8vIGlmIHNjcmlwdCB3YXMgYWxyZWFkeSBzZXQsIGRvbid0IGxvYWQgaXQgYWdhaW4uXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuXG5cbiAgICB2YXIgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHMuaWQgPSBpZDtcbiAgICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICBzLmFzeW5jID0gdHJ1ZTtcbiAgICBzLnNyYyA9ICcvL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanMnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQocyk7XG4gIH1cblxufTtcblxuLyogc3JjL2NvbXBvbmVudHMvVGltZWxpbmUuaHRtbCBnZW5lcmF0ZWQgYnkgU3ZlbHRlIHYxLjQwLjEgKi9cbmZ1bmN0aW9uIHRpbWVsaW5lQ2xhc3MoaHJlZiwgZ3JpZCkge1xuICBpZiAoaHJlZi5pbmRleE9mKCcvdGltZWxpbmVzLycpID4gLTEgJiYgZ3JpZCkgcmV0dXJuICd0d2l0dGVyLWdyaWQnXG4gIHJldHVybiAndHdpdHRlci10aW1lbGluZSdcbn1cblxuZnVuY3Rpb24gZGF0YSgpIHtcbiAgcmV0dXJuIHtcbiAgICBocmVmOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9zdmVsdGVqcycsXG4gICAgZ3JpZDogZmFsc2UsXG4gICAgbGFuZzogdW5kZWZpbmVkLFxuICAgIHNob3dSZXBsaWVzOiB1bmRlZmluZWQsXG4gICAgY2hyb21lOiB1bmRlZmluZWQsXG4gICAgdGhlbWU6IHVuZGVmaW5lZCxcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgIHR3ZWV0TGltaXQ6IHVuZGVmaW5lZCxcbiAgICBsaW5rQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBib3JkZXJDb2xvcjogdW5kZWZpbmVkLFxuICAgIGFyaWFQb2xpdGU6IHVuZGVmaW5lZCxcbiAgICBkbnQ6IHVuZGVmaW5lZFxuICB9XG59XG5cbmZ1bmN0aW9uIG9uY3JlYXRlKCkge1xuICB0d2l0dGVyLmxvYWRBUEkoKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlX21haW5fZnJhZ21lbnQoc3RhdGUsIGNvbXBvbmVudCkge1xuXHR2YXIgYSwgdGV4dCwgdGV4dF8xLCB0ZXh0XzI7XG5cblx0cmV0dXJuIHtcblx0XHRjOiBmdW5jdGlvbiBjcmVhdGUoKSB7XG5cdFx0XHRhID0gY3JlYXRlRWxlbWVudChcImFcIik7XG5cdFx0XHR0ZXh0ID0gY3JlYXRlVGV4dChcIlR3ZWV0cyBmcm9tIFwiKTtcblx0XHRcdHRleHRfMSA9IGNyZWF0ZVRleHQoc3RhdGUuaHJlZik7XG5cdFx0XHR0ZXh0XzIgPSBjcmVhdGVUZXh0KFwiLlwiKTtcblx0XHRcdHRoaXMuaCgpO1xuXHRcdH0sXG5cblx0XHRoOiBmdW5jdGlvbiBoeWRyYXRlKCkge1xuXHRcdFx0c2V0QXR0cmlidXRlKGEsIFwiZGF0YS13aWR0aFwiLCBzdGF0ZS53aWR0aCk7XG5cdFx0XHRhLmNsYXNzTmFtZSA9IHN0YXRlLnRpbWVsaW5lQ2xhc3M7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWxhbmdcIiwgc3RhdGUubGFuZyk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLXNob3ctcmVwbGllc1wiLCBzdGF0ZS5zaG93UmVwbGllcyk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWNocm9tZVwiLCBzdGF0ZS5jaHJvbWUpO1xuXHRcdFx0c2V0QXR0cmlidXRlKGEsIFwiZGF0YS10aGVtZVwiLCBzdGF0ZS50aGVtZSk7XG5cdFx0XHRhLmhyZWYgPSBzdGF0ZS5ocmVmO1xuXHRcdFx0c2V0QXR0cmlidXRlKGEsIFwiZGF0YS1oZWlnaHRcIiwgc3RhdGUuaGVpZ2h0KTtcblx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtdHdlZXQtbGltaXRcIiwgc3RhdGUudHdlZXRMaW1pdCk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWxpbmstY29sb3JcIiwgc3RhdGUubGlua0NvbG9yKTtcblx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtYm9yZGVyLWNvbG9yXCIsIHN0YXRlLmJvcmRlckNvbG9yKTtcblx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtYXJpYS1wb2xpdGVcIiwgc3RhdGUuYXJpYVBvbGl0ZSk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWRudFwiLCBzdGF0ZS5kbnQpO1xuXHRcdH0sXG5cblx0XHRtOiBmdW5jdGlvbiBtb3VudCh0YXJnZXQsIGFuY2hvcikge1xuXHRcdFx0aW5zZXJ0Tm9kZShhLCB0YXJnZXQsIGFuY2hvcik7XG5cdFx0XHRhcHBlbmROb2RlKHRleHQsIGEpO1xuXHRcdFx0YXBwZW5kTm9kZSh0ZXh0XzEsIGEpO1xuXHRcdFx0YXBwZW5kTm9kZSh0ZXh0XzIsIGEpO1xuXHRcdH0sXG5cblx0XHRwOiBmdW5jdGlvbiB1cGRhdGUoY2hhbmdlZCwgc3RhdGUpIHtcblx0XHRcdGlmIChjaGFuZ2VkLndpZHRoKSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtd2lkdGhcIiwgc3RhdGUud2lkdGgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC50aW1lbGluZUNsYXNzKSB7XG5cdFx0XHRcdGEuY2xhc3NOYW1lID0gc3RhdGUudGltZWxpbmVDbGFzcztcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoYW5nZWQubGFuZykge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWxhbmdcIiwgc3RhdGUubGFuZyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLnNob3dSZXBsaWVzKSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtc2hvdy1yZXBsaWVzXCIsIHN0YXRlLnNob3dSZXBsaWVzKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoYW5nZWQuY2hyb21lKSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtY2hyb21lXCIsIHN0YXRlLmNocm9tZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLnRoZW1lKSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtdGhlbWVcIiwgc3RhdGUudGhlbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC5ocmVmKSB7XG5cdFx0XHRcdGEuaHJlZiA9IHN0YXRlLmhyZWY7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLmhlaWdodCkge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWhlaWdodFwiLCBzdGF0ZS5oZWlnaHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC50d2VldExpbWl0KSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtdHdlZXQtbGltaXRcIiwgc3RhdGUudHdlZXRMaW1pdCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLmxpbmtDb2xvcikge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWxpbmstY29sb3JcIiwgc3RhdGUubGlua0NvbG9yKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoYW5nZWQuYm9yZGVyQ29sb3IpIHtcblx0XHRcdFx0c2V0QXR0cmlidXRlKGEsIFwiZGF0YS1ib3JkZXItY29sb3JcIiwgc3RhdGUuYm9yZGVyQ29sb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC5hcmlhUG9saXRlKSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShhLCBcImRhdGEtYXJpYS1wb2xpdGVcIiwgc3RhdGUuYXJpYVBvbGl0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLmRudCkge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYSwgXCJkYXRhLWRudFwiLCBzdGF0ZS5kbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC5ocmVmKSB7XG5cdFx0XHRcdHRleHRfMS5kYXRhID0gc3RhdGUuaHJlZjtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0dTogZnVuY3Rpb24gdW5tb3VudCgpIHtcblx0XHRcdGRldGFjaE5vZGUoYSk7XG5cdFx0fSxcblxuXHRcdGQ6IG5vb3Bcblx0fTtcbn1cblxuZnVuY3Rpb24gVGltZWxpbmUob3B0aW9ucykge1xuXHRpbml0KHRoaXMsIG9wdGlvbnMpO1xuXHR0aGlzLl9zdGF0ZSA9IGFzc2lnbihkYXRhKCksIG9wdGlvbnMuZGF0YSk7XG5cdHRoaXMuX3JlY29tcHV0ZSh7IGhyZWY6IDEsIGdyaWQ6IDEgfSwgdGhpcy5fc3RhdGUpO1xuXG5cdHZhciBfb25jcmVhdGUgPSBvbmNyZWF0ZS5iaW5kKHRoaXMpO1xuXG5cdGlmICghb3B0aW9ucy5fcm9vdCkge1xuXHRcdHRoaXMuX29uY3JlYXRlID0gW19vbmNyZWF0ZV07XG5cdH0gZWxzZSB7XG5cdCBcdHRoaXMuX3Jvb3QuX29uY3JlYXRlLnB1c2goX29uY3JlYXRlKTtcblx0IH1cblxuXHR0aGlzLl9mcmFnbWVudCA9IGNyZWF0ZV9tYWluX2ZyYWdtZW50KHRoaXMuX3N0YXRlLCB0aGlzKTtcblxuXHRpZiAob3B0aW9ucy50YXJnZXQpIHtcblx0XHR0aGlzLl9mcmFnbWVudC5jKCk7XG5cdFx0dGhpcy5fZnJhZ21lbnQubShvcHRpb25zLnRhcmdldCwgb3B0aW9ucy5hbmNob3IgfHwgbnVsbCk7XG5cblx0XHRjYWxsQWxsKHRoaXMuX29uY3JlYXRlKTtcblx0fVxufVxuXG5hc3NpZ24oVGltZWxpbmUucHJvdG90eXBlLCBwcm90byk7XG5cblRpbWVsaW5lLnByb3RvdHlwZS5fcmVjb21wdXRlID0gZnVuY3Rpb24gX3JlY29tcHV0ZShjaGFuZ2VkLCBzdGF0ZSkge1xuXHRpZiAoY2hhbmdlZC5ocmVmIHx8IGNoYW5nZWQuZ3JpZCkge1xuXHRcdGlmIChkaWZmZXJzKHN0YXRlLnRpbWVsaW5lQ2xhc3MsIChzdGF0ZS50aW1lbGluZUNsYXNzID0gdGltZWxpbmVDbGFzcyhzdGF0ZS5ocmVmLCBzdGF0ZS5ncmlkKSkpKSBjaGFuZ2VkLnRpbWVsaW5lQ2xhc3MgPSB0cnVlO1xuXHR9XG59O1xuXG4vKiBzcmMvY29tcG9uZW50cy9Ud2VldC5odG1sIGdlbmVyYXRlZCBieSBTdmVsdGUgdjEuNDAuMSAqL1xuZnVuY3Rpb24gZGF0YSQxKCkge1xuICByZXR1cm4ge1xuICAgIGhyZWY6ICdodHRwczovL3R3aXR0ZXIuY29tL3N2ZWx0ZWpzL3N0YXR1cy84MDI3MTA1NDEzNjYxMjg2NDAnLFxuICAgIGNhcmRzOiB1bmRlZmluZWQsXG4gICAgY29udmVyc2F0aW9uOiB1bmRlZmluZWQsXG4gICAgdGhlbWU6IHVuZGVmaW5lZCxcbiAgICBsaW5rQ29sb3I6IHVuZGVmaW5lZCxcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIGFsaWduOiB1bmRlZmluZWQsXG4gICAgbGFuZzogdW5kZWZpbmVkLFxuICAgIGRudDogdW5kZWZpbmVkXG4gIH1cbn1cblxuZnVuY3Rpb24gb25jcmVhdGUkMSgpIHtcbiAgdHdpdHRlci5sb2FkQVBJKCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZV9tYWluX2ZyYWdtZW50JDEoc3RhdGUsIGNvbXBvbmVudCkge1xuXHR2YXIgYmxvY2txdW90ZSwgYSwgdGV4dCwgdGV4dF8xLCB0ZXh0XzI7XG5cblx0cmV0dXJuIHtcblx0XHRjOiBmdW5jdGlvbiBjcmVhdGUoKSB7XG5cdFx0XHRibG9ja3F1b3RlID0gY3JlYXRlRWxlbWVudChcImJsb2NrcXVvdGVcIik7XG5cdFx0XHRhID0gY3JlYXRlRWxlbWVudChcImFcIik7XG5cdFx0XHR0ZXh0ID0gY3JlYXRlVGV4dChcIlR3ZWV0IGZyb20gXCIpO1xuXHRcdFx0dGV4dF8xID0gY3JlYXRlVGV4dChzdGF0ZS5ocmVmKTtcblx0XHRcdHRleHRfMiA9IGNyZWF0ZVRleHQoXCIuXCIpO1xuXHRcdFx0dGhpcy5oKCk7XG5cdFx0fSxcblxuXHRcdGg6IGZ1bmN0aW9uIGh5ZHJhdGUoKSB7XG5cdFx0XHRibG9ja3F1b3RlLmNsYXNzTmFtZSA9IFwidHdpdHRlci10d2VldFwiO1xuXHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS1jYXJkc1wiLCBzdGF0ZS5jYXJkcyk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLWNvbnZlcnNhdGlvblwiLCBzdGF0ZS5jb252ZXJzYXRpb24pO1xuXHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS10aGVtZVwiLCBzdGF0ZS50aGVtZSk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLWxpbmstY29sb3JcIiwgc3RhdGUubGlua0NvbG9yKTtcblx0XHRcdHNldEF0dHJpYnV0ZShibG9ja3F1b3RlLCBcImRhdGEtd2lkdGhcIiwgc3RhdGUud2lkdGgpO1xuXHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS1hbGlnblwiLCBzdGF0ZS5hbGlnbik7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLWxhbmdcIiwgc3RhdGUubGFuZyk7XG5cdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLWRudFwiLCBzdGF0ZS5kbnQpO1xuXHRcdFx0YS5ocmVmID0gc3RhdGUuaHJlZjtcblx0XHR9LFxuXG5cdFx0bTogZnVuY3Rpb24gbW91bnQodGFyZ2V0LCBhbmNob3IpIHtcblx0XHRcdGluc2VydE5vZGUoYmxvY2txdW90ZSwgdGFyZ2V0LCBhbmNob3IpO1xuXHRcdFx0YXBwZW5kTm9kZShhLCBibG9ja3F1b3RlKTtcblx0XHRcdGFwcGVuZE5vZGUodGV4dCwgYSk7XG5cdFx0XHRhcHBlbmROb2RlKHRleHRfMSwgYSk7XG5cdFx0XHRhcHBlbmROb2RlKHRleHRfMiwgYSk7XG5cdFx0fSxcblxuXHRcdHA6IGZ1bmN0aW9uIHVwZGF0ZShjaGFuZ2VkLCBzdGF0ZSkge1xuXHRcdFx0aWYgKGNoYW5nZWQuY2FyZHMpIHtcblx0XHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS1jYXJkc1wiLCBzdGF0ZS5jYXJkcyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLmNvbnZlcnNhdGlvbikge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLWNvbnZlcnNhdGlvblwiLCBzdGF0ZS5jb252ZXJzYXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC50aGVtZSkge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLXRoZW1lXCIsIHN0YXRlLnRoZW1lKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoYW5nZWQubGlua0NvbG9yKSB7XG5cdFx0XHRcdHNldEF0dHJpYnV0ZShibG9ja3F1b3RlLCBcImRhdGEtbGluay1jb2xvclwiLCBzdGF0ZS5saW5rQ29sb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC53aWR0aCkge1xuXHRcdFx0XHRzZXRBdHRyaWJ1dGUoYmxvY2txdW90ZSwgXCJkYXRhLXdpZHRoXCIsIHN0YXRlLndpZHRoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoYW5nZWQuYWxpZ24pIHtcblx0XHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS1hbGlnblwiLCBzdGF0ZS5hbGlnbik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaGFuZ2VkLmxhbmcpIHtcblx0XHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS1sYW5nXCIsIHN0YXRlLmxhbmcpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2hhbmdlZC5kbnQpIHtcblx0XHRcdFx0c2V0QXR0cmlidXRlKGJsb2NrcXVvdGUsIFwiZGF0YS1kbnRcIiwgc3RhdGUuZG50KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoYW5nZWQuaHJlZikge1xuXHRcdFx0XHRhLmhyZWYgPSBzdGF0ZS5ocmVmO1xuXHRcdFx0XHR0ZXh0XzEuZGF0YSA9IHN0YXRlLmhyZWY7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHU6IGZ1bmN0aW9uIHVubW91bnQoKSB7XG5cdFx0XHRkZXRhY2hOb2RlKGJsb2NrcXVvdGUpO1xuXHRcdH0sXG5cblx0XHRkOiBub29wXG5cdH07XG59XG5cbmZ1bmN0aW9uIFR3ZWV0KG9wdGlvbnMpIHtcblx0aW5pdCh0aGlzLCBvcHRpb25zKTtcblx0dGhpcy5fc3RhdGUgPSBhc3NpZ24oZGF0YSQxKCksIG9wdGlvbnMuZGF0YSk7XG5cblx0dmFyIF9vbmNyZWF0ZSA9IG9uY3JlYXRlJDEuYmluZCh0aGlzKTtcblxuXHRpZiAoIW9wdGlvbnMuX3Jvb3QpIHtcblx0XHR0aGlzLl9vbmNyZWF0ZSA9IFtfb25jcmVhdGVdO1xuXHR9IGVsc2Uge1xuXHQgXHR0aGlzLl9yb290Ll9vbmNyZWF0ZS5wdXNoKF9vbmNyZWF0ZSk7XG5cdCB9XG5cblx0dGhpcy5fZnJhZ21lbnQgPSBjcmVhdGVfbWFpbl9mcmFnbWVudCQxKHRoaXMuX3N0YXRlLCB0aGlzKTtcblxuXHRpZiAob3B0aW9ucy50YXJnZXQpIHtcblx0XHR0aGlzLl9mcmFnbWVudC5jKCk7XG5cdFx0dGhpcy5fZnJhZ21lbnQubShvcHRpb25zLnRhcmdldCwgb3B0aW9ucy5hbmNob3IgfHwgbnVsbCk7XG5cblx0XHRjYWxsQWxsKHRoaXMuX29uY3JlYXRlKTtcblx0fVxufVxuXG5hc3NpZ24oVHdlZXQucHJvdG90eXBlLCBwcm90byk7XG5cbmV4cG9ydHMuVGltZWxpbmUgPSBUaW1lbGluZTtcbmV4cG9ydHMuVHdlZXQgPSBUd2VldDtcbiJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIm5vb3AiLCJhc3NpZ24iLCJ0YXJnZXQiLCJrIiwic291cmNlIiwiaSIsImxlbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsImFwcGVuZE5vZGUiLCJub2RlIiwiYXBwZW5kQ2hpbGQiLCJpbnNlcnROb2RlIiwiYW5jaG9yIiwiaW5zZXJ0QmVmb3JlIiwiZGV0YWNoTm9kZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImNyZWF0ZUVsZW1lbnQiLCJuYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVUZXh0IiwiZGF0YSIsImNyZWF0ZVRleHROb2RlIiwic2V0QXR0cmlidXRlIiwiYXR0cmlidXRlIiwiYmxhbmtPYmplY3QiLCJjcmVhdGUiLCJkZXN0cm95IiwiZGV0YWNoIiwiZmlyZSIsInNldCIsImdldCIsIl9mcmFnbWVudCIsInUiLCJkIiwiX3N0YXRlIiwiZGlmZmVycyIsImEiLCJiIiwiZGlzcGF0Y2hPYnNlcnZlcnMiLCJjb21wb25lbnQiLCJncm91cCIsImNoYW5nZWQiLCJuZXdTdGF0ZSIsIm9sZFN0YXRlIiwia2V5IiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsImNhbGxiYWNrcyIsImNhbGxiYWNrIiwiX19jYWxsaW5nIiwiY2FsbCIsImV2ZW50TmFtZSIsImhhbmRsZXJzIiwiX2hhbmRsZXJzIiwic2xpY2UiLCJpbml0Iiwib3B0aW9ucyIsIl9vYnNlcnZlcnMiLCJwcmUiLCJwb3N0IiwiX3Jvb3QiLCJfeWllbGQiLCJfYmluZCIsIm9ic2VydmUiLCJkZWZlciIsInB1c2giLCJjYW5jZWwiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJvbiIsImhhbmRsZXIiLCJfc2V0IiwiX2xvY2siLCJjYWxsQWxsIiwiX2JlZm9yZWNyZWF0ZSIsIl9vbmNyZWF0ZSIsIl9hZnRlcmNyZWF0ZSIsImRpcnR5IiwiX3JlY29tcHV0ZSIsInAiLCJmbnMiLCJwb3AiLCJfbW91bnQiLCJtIiwiX3VubW91bnQiLCJwcm90byIsInRlYXJkb3duIiwidHdpdHRlciIsImxvYWRBUEkiLCJpZCIsImdldEVsZW1lbnRCeUlkIiwicyIsInR5cGUiLCJhc3luYyIsInNyYyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidGltZWxpbmVDbGFzcyIsImhyZWYiLCJncmlkIiwibGFuZyIsInVuZGVmaW5lZCIsInNob3dSZXBsaWVzIiwiY2hyb21lIiwidGhlbWUiLCJ3aWR0aCIsImhlaWdodCIsInR3ZWV0TGltaXQiLCJsaW5rQ29sb3IiLCJib3JkZXJDb2xvciIsImFyaWFQb2xpdGUiLCJkbnQiLCJvbmNyZWF0ZSIsImNyZWF0ZV9tYWluX2ZyYWdtZW50Iiwic3RhdGUiLCJ0ZXh0IiwidGV4dF8xIiwidGV4dF8yIiwiYyIsImgiLCJoeWRyYXRlIiwiY2xhc3NOYW1lIiwibW91bnQiLCJ1cGRhdGUiLCJ1bm1vdW50IiwiVGltZWxpbmUiLCJiaW5kIiwicHJvdG90eXBlIiwiZGF0YSQxIiwiY2FyZHMiLCJjb252ZXJzYXRpb24iLCJhbGlnbiIsIm9uY3JlYXRlJDEiLCJjcmVhdGVfbWFpbl9mcmFnbWVudCQxIiwiYmxvY2txdW90ZSIsIlR3ZWV0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUVBQSxFQUFBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLElBQUFBLEtBQUssRUFBRTtBQUFULEdBQTdDOztBQUVBLFdBQVNDLElBQVQsR0FBZ0I7O0FBRWhCLFdBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCO0FBQ3ZCLFFBQUlDLENBQUo7QUFBQSxRQUNDQyxNQUREO0FBQUEsUUFFQ0MsQ0FBQyxHQUFHLENBRkw7QUFBQSxRQUdDQyxHQUFHLEdBQUdDLFNBQVMsQ0FBQ0MsTUFIakI7O0FBSUEsV0FBT0gsQ0FBQyxHQUFHQyxHQUFYLEVBQWdCRCxDQUFDLEVBQWpCLEVBQXFCO0FBQ3BCRCxNQUFBQSxNQUFNLEdBQUdHLFNBQVMsQ0FBQ0YsQ0FBRCxDQUFsQjs7QUFDQSxXQUFLRixDQUFMLElBQVVDLE1BQVYsRUFBa0JGLE1BQU0sQ0FBQ0Ms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
