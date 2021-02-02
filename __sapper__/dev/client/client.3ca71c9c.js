function noop() {}

const identity = x => x;

function assign(tar, src) {
  // @ts-ignore
  for (const k in src) tar[k] = src[k];

  return tar;
}

function add_location(element, file, line, column, char) {
  element.__svelte_meta = {
    loc: {
      file,
      line,
      column,
      char
    }
  };
}

function run(fn) {
  return fn();
}

function blank_object() {
  return Object.create(null);
}

function run_all(fns) {
  fns.forEach(run);
}

function is_function(thing) {
  return typeof thing === 'function';
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

function validate_store(store, name) {
  if (store != null && typeof store.subscribe !== 'function') {
    throw new Error(`'${name}' is not a store with a 'subscribe' method`);
  }
}

function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }

  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}

function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}

function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));

    if ($$scope.dirty === undefined) {
      return lets;
    }

    if (typeof lets === 'object') {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);

      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }

      return merged;
    }

    return $$scope.dirty | lets;
  }

  return $$scope.dirty;
}

function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
  const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);

  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}

function exclude_internal_props(props) {
  const result = {};

  for (const k in props) if (k[0] !== '$') result[k] = props[k];

  return result;
}

function null_to_empty(value) {
  return value == null ? '' : value;
}

function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop; // used internally for testing

const tasks = new Set();

function run_tasks(now) {
  tasks.forEach(task => {
    if (!task.c(now)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */


function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise(fulfill => {
      tasks.add(task = {
        c: callback,
        f: fulfill
      });
    }),

    abort() {
      tasks.delete(task);
    }

  };
}

function append(target, node) {
  target.appendChild(node);
}

function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}

function detach(node) {
  node.parentNode.removeChild(node);
}

function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}

function element(name) {
  return document.createElement(name);
}

function svg_element(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function text(data) {
  return document.createTextNode(data);
}

function space() {
  return text(' ');
}

function empty() {
  return text('');
}

function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}

function prevent_default(fn) {
  return function (event) {
    event.preventDefault(); // @ts-ignore

    return fn.call(this, event);
  };
}

function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

function set_attributes(node, attributes) {
  // @ts-ignore
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);

  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === 'style') {
      node.style.cssText = attributes[key];
    } else if (key === '__value') {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}

function children(element) {
  return Array.from(element.childNodes);
}

function claim_element(nodes, name, attributes, svg) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];

    if (node.nodeName === name) {
      let j = 0;
      const remove = [];

      while (j < node.attributes.length) {
        const attribute = node.attributes[j++];

        if (!attributes[attribute.name]) {
          remove.push(attribute.name);
        }
      }

      for (let k = 0; k < remove.length; k++) {
        node.removeAttribute(remove[k]);
      }

      return nodes.splice(i, 1)[0];
    }
  }

  return svg ? svg_element(name) : element(name);
}

function claim_text(nodes, data) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];

    if (node.nodeType === 3) {
      node.data = '' + data;
      return nodes.splice(i, 1)[0];
    }
  }

  return text(data);
}

function claim_space(nodes) {
  return claim_text(nodes, ' ');
}

function set_style(node, key, value, important) {
  node.style.setProperty(key, value, important ? 'important' : '');
}

function toggle_class(element, name, toggle) {
  element.classList[toggle ? 'add' : 'remove'](name);
}

function custom_event(type, detail) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, false, false, detail);
  return e;
}

function query_selector_all(selector, parent = document.body) {
  return Array.from(parent.querySelectorAll(selector));
}

const active_docs = new Set();
let active = 0; // https://github.com/darkskyapp/string-hash/blob/master/index.js

function hash(str) {
  let hash = 5381;
  let i = str.length;

  while (i--) hash = (hash << 5) - hash ^ str.charCodeAt(i);

  return hash >>> 0;
}

function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = '{\n';

  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
  }

  const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = node.ownerDocument;
  active_docs.add(doc);
  const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
  const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});

  if (!current_rules[name]) {
    current_rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }

  const animation = node.style.animation || '';
  node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}

function delete_rule(node, name) {
  const previous = (node.style.animation || '').split(', ');
  const next = previous.filter(name ? anim => anim.indexOf(name) < 0 // remove specific animation
  : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
  );
  const deleted = previous.length - next.length;

  if (deleted) {
    node.style.animation = next.join(', ');
    active -= deleted;
    if (!active) clear_rules();
  }
}

function clear_rules() {
  raf(() => {
    if (active) return;
    active_docs.forEach(doc => {
      const stylesheet = doc.__svelte_stylesheet;
      let i = stylesheet.cssRules.length;

      while (i--) stylesheet.deleteRule(i);

      doc.__svelte_rules = {};
    });
    active_docs.clear();
  });
}

let current_component;

function set_current_component(component) {
  current_component = component;
}

function get_current_component() {
  if (!current_component) throw new Error(`Function called outside component initialization`);
  return current_component;
}

function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}

function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}

function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];

    if (callbacks) {
      // TODO are there situations where events could be dispatched
      // in a server (non-DOM) environment?
      const event = custom_event(type, detail);
      callbacks.slice().forEach(fn => {
        fn.call(component, event);
      });
    }
  };
}

function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}

function getContext(key) {
  return get_current_component().$$.context.get(key);
} // TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism


function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];

  if (callbacks) {
    callbacks.slice().forEach(fn => fn(event));
  }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;

function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}

function add_render_callback(fn) {
  render_callbacks.push(fn);
}

function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}

let flushing = false;
const seen_callbacks = new Set();

function flush() {
  if (flushing) return;
  flushing = true;

  do {
    // first, call beforeUpdate functions
    // and update components
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }

    dirty_components.length = 0;

    while (binding_callbacks.length) binding_callbacks.pop()(); // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...


    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];

      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }

    render_callbacks.length = 0;
  } while (dirty_components.length);

  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }

  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}

function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}

let promise;

function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }

  return promise;
}

function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}

const outroing = new Set();
let outros;

function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros // parent group

  };
}

function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }

  outros = outros.p;
}

function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}

function transition_out(block, local, detach, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);

      if (callback) {
        if (detach) block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}

const null_transition = {
  duration: 0
};

function create_in_transition(node, fn, params) {
  let config = fn(node, params);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;

  function cleanup() {
    if (animation_name) delete_rule(node, animation_name);
  }

  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task) task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, 'start'));
    task = loop(now => {
      if (running) {
        if (now >= end_time) {
          tick(1, 0);
          dispatch(node, true, 'end');
          cleanup();
          return running = false;
        }

        if (now >= start_time) {
          const t = easing((now - start_time) / duration);
          tick(t, 1 - t);
        }
      }

      return running;
    });
  }

  let started = false;
  return {
    start() {
      if (started) return;
      delete_rule(node);

      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },

    invalidate() {
      started = false;
    },

    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }

  };
}

function create_out_transition(node, fn, params) {
  let config = fn(node, params);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;

  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, 'start'));
    loop(now => {
      if (running) {
        if (now >= end_time) {
          tick(0, 1);
          dispatch(node, false, 'end');

          if (! --group.r) {
            // this will result in `end()` being called,
            // so we don't need to clean up here
            run_all(group.c);
          }

          return false;
        }

        if (now >= start_time) {
          const t = easing((now - start_time) / duration);
          tick(1 - t, t);
        }
      }

      return running;
    });
  }

  if (is_function(config)) {
    wait().then(() => {
      // @ts-ignore
      config = config();
      go();
    });
  } else {
    go();
  }

  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }

      if (running) {
        if (animation_name) delete_rule(node, animation_name);
        running = false;
      }
    }

  };
}

function create_bidirectional_transition(node, fn, params, intro) {
  let config = fn(node, params);
  let t = intro ? 0 : 1;
  let running_program = null;
  let pending_program = null;
  let animation_name = null;

  function clear_animation() {
    if (animation_name) delete_rule(node, animation_name);
  }

  function init(program, duration) {
    const d = program.b - t;
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d,
      duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }

  function go(b) {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    const program = {
      start: now() + delay,
      b
    };

    if (!b) {
      // @ts-ignore todo: improve typings
      program.group = outros;
      outros.r += 1;
    }

    if (running_program) {
      pending_program = program;
    } else {
      // if this is an intro, and there's a delay, we need to do
      // an initial tick and/or apply CSS animation immediately
      if (css) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css);
      }

      if (b) tick(0, 1);
      running_program = init(program, duration);
      add_render_callback(() => dispatch(node, b, 'start'));
      loop(now => {
        if (pending_program && now > pending_program.start) {
          running_program = init(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, 'start');

          if (css) {
            clear_animation();
            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
          }
        }

        if (running_program) {
          if (now >= running_program.end) {
            tick(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, 'end');

            if (!pending_program) {
              // we're done
              if (running_program.b) {
                // intro — we can tidy up immediately
                clear_animation();
              } else {
                // outro — needs to be coordinated
                if (! --running_program.group.r) run_all(running_program.group.c);
              }
            }

            running_program = null;
          } else if (now >= running_program.start) {
            const p = now - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick(t, 1 - t);
          }
        }

        return !!(running_program || pending_program);
      });
    }
  }

  return {
    run(b) {
      if (is_function(config)) {
        wait().then(() => {
          // @ts-ignore
          config = config();
          go(b);
        });
      } else {
        go(b);
      }
    },

    end() {
      clear_animation();
      running_program = pending_program = null;
    }

  };
}

const globals = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : global;

function get_spread_update(levels, updates) {
  const update = {};
  const to_null_out = {};
  const accounted_for = {
    $$scope: 1
  };
  let i = levels.length;

  while (i--) {
    const o = levels[i];
    const n = updates[i];

    if (n) {
      for (const key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }

      for (const key in n) {
        if (!accounted_for[key]) {
          update[key] = n[key];
          accounted_for[key] = 1;
        }
      }

      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }

  for (const key in to_null_out) {
    if (!(key in update)) update[key] = undefined;
  }

  return update;
}

function get_spread_object(spread_props) {
  return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
} // source: https://html.spec.whatwg.org/multipage/indices.html

function bind(component, name, callback) {
  const index = component.$$.props[name];

  if (index !== undefined) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}

function create_component(block) {
  block && block.c();
}

function claim_component(block, parent_nodes) {
  block && block.l(parent_nodes);
}

function mount_component(component, target, anchor) {
  const {
    fragment,
    on_mount,
    on_destroy,
    after_update
  } = component.$$;
  fragment && fragment.m(target, anchor); // onMount happens before the initial afterUpdate

  add_render_callback(() => {
    const new_on_destroy = on_mount.map(run).filter(is_function);

    if (on_destroy) {
      on_destroy.push(...new_on_destroy);
    } else {
      // Edge case - component was destroyed immediately,
      // most likely as a result of a binding initialising
      run_all(new_on_destroy);
    }

    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}

function destroy_component(component, detaching) {
  const $$ = component.$$;

  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)

    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}

function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }

  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}

function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const prop_values = options.props || {};
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    // everything else
    callbacks: blank_object(),
    dirty
  };
  let ready = false;
  $$.ctx = instance ? instance(component, prop_values, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;

    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if ($$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }

    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update); // `false` as a special case of no DOM component

  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }

    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }

  set_current_component(parent_component);
}

class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }

  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }

  $set() {// overridden by instance, if it has props
  }

}

function dispatch_dev(type, detail) {
  document.dispatchEvent(custom_event(type, Object.assign({
    version: '3.24.0'
  }, detail)));
}

function append_dev(target, node) {
  dispatch_dev("SvelteDOMInsert", {
    target,
    node
  });
  append(target, node);
}

function insert_dev(target, node, anchor) {
  dispatch_dev("SvelteDOMInsert", {
    target,
    node,
    anchor
  });
  insert(target, node, anchor);
}

function detach_dev(node) {
  dispatch_dev("SvelteDOMRemove", {
    node
  });
  detach(node);
}

function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
  const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
  if (has_prevent_default) modifiers.push('preventDefault');
  if (has_stop_propagation) modifiers.push('stopPropagation');
  dispatch_dev("SvelteDOMAddEventListener", {
    node,
    event,
    handler,
    modifiers
  });
  const dispose = listen(node, event, handler, options);
  return () => {
    dispatch_dev("SvelteDOMRemoveEventListener", {
      node,
      event,
      handler,
      modifiers
    });
    dispose();
  };
}

function attr_dev(node, attribute, value) {
  attr(node, attribute, value);
  if (value == null) dispatch_dev("SvelteDOMRemoveAttribute", {
    node,
    attribute
  });else dispatch_dev("SvelteDOMSetAttribute", {
    node,
    attribute,
    value
  });
}

function set_data_dev(text, data) {
  data = '' + data;
  if (text.wholeText === data) return;
  dispatch_dev("SvelteDOMSetData", {
    node: text,
    data
  });
  text.data = data;
}

function validate_each_argument(arg) {
  if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
    let msg = '{#each} only iterates over array-like objects.';

    if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
      msg += ' You can use a spread to convert this iterable into an array.';
    }

    throw new Error(msg);
  }
}

function validate_slots(name, slot, keys) {
  for (const slot_key of Object.keys(slot)) {
    if (!~keys.indexOf(slot_key)) {
      console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
    }
  }
}

class SvelteComponentDev extends SvelteComponent {
  constructor(options) {
    if (!options || !options.target && !options.$$inline) {
      throw new Error(`'target' is a required option`);
    }

    super();
  }

  $destroy() {
    super.$destroy();

    this.$destroy = () => {
      console.warn(`Component was already destroyed`); // eslint-disable-line no-console
    };
  }

  $capture_state() {}

  $inject_state() {}

}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */


function writable(value, start = noop) {
  let stop;
  const subscribers = [];

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        // store is ready
        const run_queue = !subscriber_queue.length;

        for (let i = 0; i < subscribers.length; i += 1) {
          const s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }

        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }

          subscriber_queue.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.push(subscriber);

    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }

    run(value);
    return () => {
      const index = subscribers.indexOf(subscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
      }

      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }

  return {
    set,
    update,
    subscribe
  };
}

const CONTEXT_KEY = {};
const preload = () => ({});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

const noDepth = ["white", "black", "transparent"];

function getClass(prop, color, depth, defaultDepth) {
  if (noDepth.includes(color)) {
    return `${prop}-${color}`;
  }

  return `${prop}-${color}-${depth || defaultDepth} `;
}

function utils(color, defaultDepth = 500) {
  return {
    bg: depth => getClass("bg", color, depth, defaultDepth),
    border: depth => getClass("border", color, depth, defaultDepth),
    txt: depth => getClass("text", color, depth, defaultDepth),
    caret: depth => getClass("caret", color, depth, defaultDepth)
  };
}
class ClassBuilder {
  constructor(classes, defaultClasses) {
    this.defaults = (typeof classes === "function" ? classes(defaultClasses) : classes) || defaultClasses;
    this.classes = this.defaults;
  }

  flush() {
    this.classes = this.defaults;
    return this;
  }

  extend(...fns) {
    return this;
  }

  get() {
    return this.classes;
  }

  replace(classes, cond = true) {
    if (cond && classes) {
      this.classes = Object.keys(classes).reduce((acc, from) => acc.replace(new RegExp(from, "g"), classes[from]), this.classes);
    }

    return this;
  }

  remove(classes, cond = true) {
    if (cond && classes) {
      this.classes = classes.split(" ").reduce((acc, cur) => acc.replace(new RegExp(cur, "g"), ""), this.classes);
    }

    return this;
  }

  add(className, cond = true, defaultValue) {
    if (!cond || !className) return this;

    switch (typeof className) {
      case "string":
      default:
        this.classes += ` ${className} `;
        return this;

      case "function":
        this.classes += ` ${className(defaultValue || this.classes)} `;
        return this;
    }
  }

}
const defaultReserved = ["class", "add", "remove", "replace", "value"];
function filterProps(reserved, props) {
  const r = [...reserved, ...defaultReserved];
  return Object.keys(props).reduce((acc, cur) => cur.includes("$$") || cur.includes("Class") || r.includes(cur) ? acc : _objectSpread2(_objectSpread2({}, acc), {}, {
    [cur]: props[cur]
  }), {});
}

/* src/components/AppBar/AppBar.svelte generated by Svelte v3.24.0 */
const file = "src/components/AppBar/AppBar.svelte";

function create_fragment(ctx) {
  let header;
  let current;
  const default_slot_template =
  /*$$slots*/
  ctx[3].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[2], null);
  const block = {
    c: function create() {
      header = element("header");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      header = claim_element(nodes, "HEADER", {
        class: true
      });
      var header_nodes = children(header);
      if (default_slot) default_slot.l(header_nodes);
      header_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(header, "class",
      /*c*/
      ctx[0]);
      add_location(header, file, 16, 0, 370);
    },
    m: function mount(target, anchor) {
      insert_dev(target, header, anchor);

      if (default_slot) {
        default_slot.m(header, null);
      }

      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        4) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[2], dirty, null, null);
        }
      }

      if (!current || dirty &
      /*c*/
      1) {
        attr_dev(header, "class",
        /*c*/
        ctx[0]);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(header);
      if (default_slot) default_slot.d(detaching);
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
  let classesDefault = "fixed top-0 w-full items-center flex no-wrap flex left-0 z-30 p-0 h-16 elevation-3 bg-primary-300 dark:bg-dark-600";
  let {
    classes = classesDefault
  } = $$props;
  const cb = new ClassBuilder(classes, classesDefault);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("AppBar", $$slots, ['default']);

  $$self.$set = $$new_props => {
    $$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("classes" in $$new_props) $$invalidate(1, classes = $$new_props.classes);
    if ("$$scope" in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    ClassBuilder,
    classesDefault,
    classes,
    cb,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    if ("classesDefault" in $$props) classesDefault = $$new_props.classesDefault;
    if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    if ("c" in $$props) $$invalidate(0, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
     $$invalidate(0, c = cb.flush().add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [c, classes, $$scope, $$slots];
}

class AppBar extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {
      classes: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "AppBar",
      options,
      id: create_fragment.name
    });
  }

  get classes() {
    throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Icon/Icon.svelte generated by Svelte v3.24.0 */
const file$1 = "src/components/Icon/Icon.svelte";

function add_css() {
  var style = element("style");
  style.id = "svelte-zzky5a-style";
  style.textContent = ".reverse.svelte-zzky5a{transform:rotate(180deg)}.tip.svelte-zzky5a{transform:rotate(90deg)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIkljb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG5cblxuICBleHBvcnQgbGV0IHNtYWxsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgeHMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCByZXZlcnNlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGlwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcImRlZmF1bHRcIjtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5yZXZlcnNlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICB9XG5cbiAgLnRpcCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuICB9XG48L3N0eWxlPlxuXG48aVxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGljb24gdGV4dC14bCBzZWxlY3Qtbm9uZSB7JCRwcm9wcy5jbGFzc30gZHVyYXRpb24tMjAwIGVhc2UtaW5cIlxuICBjbGFzczpyZXZlcnNlXG4gIGNsYXNzOnRpcFxuICBvbjpjbGlja1xuICBjbGFzczp0ZXh0LWJhc2U9e3NtYWxsfVxuICBjbGFzczp0ZXh0LXhzPXt4c31cbiAgc3R5bGU9e2NvbG9yID8gYGNvbG9yOiAke2NvbG9yfWAgOiAnJ30+XG4gIDxzbG90IC8+XG48L2k+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV0UsUUFBUSxjQUFDLENBQUMsQUFDUixTQUFTLENBQUUsT0FBTyxNQUFNLENBQUMsQUFDM0IsQ0FBQyxBQUVELElBQUksY0FBQyxDQUFDLEFBQ0osU0FBUyxDQUFFLE9BQU8sS0FBSyxDQUFDLEFBQzFCLENBQUMifQ== */";
  append_dev(document.head, style);
}

function create_fragment$1(ctx) {
  let i;
  let i_class_value;
  let i_style_value;
  let current;
  let mounted;
  let dispose;
  const default_slot_template =
  /*$$slots*/
  ctx[7].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[6], null);
  const block = {
    c: function create() {
      i = element("i");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      i = claim_element(nodes, "I", {
        "aria-hidden": true,
        class: true,
        style: true
      });
      var i_nodes = children(i);
      if (default_slot) default_slot.l(i_nodes);
      i_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(i, "aria-hidden", "true");
      attr_dev(i, "class", i_class_value = "material-icons icon text-xl select-none " +
      /*$$props*/
      ctx[5].class + " duration-200 ease-in" + " svelte-zzky5a");
      attr_dev(i, "style", i_style_value =
      /*color*/
      ctx[4] ? `color: ${
      /*color*/
      ctx[4]}` : "");
      toggle_class(i, "reverse",
      /*reverse*/
      ctx[2]);
      toggle_class(i, "tip",
      /*tip*/
      ctx[3]);
      toggle_class(i, "text-base",
      /*small*/
      ctx[0]);
      toggle_class(i, "text-xs",
      /*xs*/
      ctx[1]);
      add_location(i, file$1, 20, 0, 273);
    },
    m: function mount(target, anchor) {
      insert_dev(target, i, anchor);

      if (default_slot) {
        default_slot.m(i, null);
      }

      current = true;

      if (!mounted) {
        dispose = listen_dev(i, "click",
        /*click_handler*/
        ctx[8], false, false, false);
        mounted = true;
      }
    },
    p: function update(ctx, [dirty]) {
      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        64) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[6], dirty, null, null);
        }
      }

      if (!current || dirty &
      /*$$props*/
      32 && i_class_value !== (i_class_value = "material-icons icon text-xl select-none " +
      /*$$props*/
      ctx[5].class + " duration-200 ease-in" + " svelte-zzky5a")) {
        attr_dev(i, "class", i_class_value);
      }

      if (!current || dirty &
      /*color*/
      16 && i_style_value !== (i_style_value =
      /*color*/
      ctx[4] ? `color: ${
      /*color*/
      ctx[4]}` : "")) {
        attr_dev(i, "style", i_style_value);
      }

      if (dirty &
      /*$$props, reverse*/
      36) {
        toggle_class(i, "reverse",
        /*reverse*/
        ctx[2]);
      }

      if (dirty &
      /*$$props, tip*/
      40) {
        toggle_class(i, "tip",
        /*tip*/
        ctx[3]);
      }

      if (dirty &
      /*$$props, small*/
      33) {
        toggle_class(i, "text-base",
        /*small*/
        ctx[0]);
      }

      if (dirty &
      /*$$props, xs*/
      34) {
        toggle_class(i, "text-xs",
        /*xs*/
        ctx[1]);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(i);
      if (default_slot) default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$1($$self, $$props, $$invalidate) {
  let {
    small = false
  } = $$props;
  let {
    xs = false
  } = $$props;
  let {
    reverse = false
  } = $$props;
  let {
    tip = false
  } = $$props;
  let {
    color = "default"
  } = $$props;
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Icon", $$slots, ['default']);

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = $$new_props => {
    $$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("small" in $$new_props) $$invalidate(0, small = $$new_props.small);
    if ("xs" in $$new_props) $$invalidate(1, xs = $$new_props.xs);
    if ("reverse" in $$new_props) $$invalidate(2, reverse = $$new_props.reverse);
    if ("tip" in $$new_props) $$invalidate(3, tip = $$new_props.tip);
    if ("color" in $$new_props) $$invalidate(4, color = $$new_props.color);
    if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    small,
    xs,
    reverse,
    tip,
    color
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    if ("small" in $$props) $$invalidate(0, small = $$new_props.small);
    if ("xs" in $$props) $$invalidate(1, xs = $$new_props.xs);
    if ("reverse" in $$props) $$invalidate(2, reverse = $$new_props.reverse);
    if ("tip" in $$props) $$invalidate(3, tip = $$new_props.tip);
    if ("color" in $$props) $$invalidate(4, color = $$new_props.color);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$props = exclude_internal_props($$props);
  return [small, xs, reverse, tip, color, $$props, $$scope, $$slots, click_handler];
}

class Icon extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-zzky5a-style")) add_css();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      small: 0,
      xs: 1,
      reverse: 2,
      tip: 3,
      color: 4
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Icon",
      options,
      id: create_fragment$1.name
    });
  }

  get small() {
    throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set small(value) {
    throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get xs() {
    throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set xs(value) {
    throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get reverse() {
    throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set reverse(value) {
    throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get tip() {
    throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set tip(value) {
    throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

// Thanks Lagden! https://svelte.dev/repl/61d9178d2b9944f2aa2bfe31612ab09f?version=3.6.7
function ripple(color, centered) {
  return function (event) {
    const target = event.currentTarget;
    const circle = document.createElement("span");
    const d = Math.max(target.clientWidth, target.clientHeight);

    const removeCircle = () => {
      circle.remove();
      circle.removeEventListener("animationend", removeCircle);
    };

    circle.addEventListener("animationend", removeCircle);
    circle.style.width = circle.style.height = `${d}px`;
    const rect = target.getBoundingClientRect();

    if (centered) {
      circle.classList.add("absolute", "top-0", "left-0", "ripple-centered", `bg-${color}-transDark`);
    } else {
      circle.style.left = `${event.clientX - rect.left - d / 2}px`;
      circle.style.top = `${event.clientY - rect.top - d / 2}px`;
      circle.classList.add("ripple-normal", `bg-${color}-trans`);
    }

    circle.classList.add("ripple");
    target.appendChild(circle);
  };
}

function r(color = "primary", centered = false) {
  return function (node) {
    const onMouseDown = ripple(color, centered);
    node.addEventListener("mousedown", onMouseDown);
    return {
      onDestroy: () => node.removeEventListener("mousedown", onMouseDown)
    };
  };
}

/* src/components/Tabs/TabButton.svelte generated by Svelte v3.24.0 */
const file$2 = "src/components/Tabs/TabButton.svelte"; // (57:0) {:else}

function create_else_block(ctx) {
  let li;
  let div1;
  let t;
  let div0;
  let ripple_action;
  let current;
  let mounted;
  let dispose;
  let if_block =
  /*icon*/
  ctx[1] && create_if_block_2(ctx);
  const default_slot_template =
  /*$$slots*/
  ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[16], null);
  const default_slot_or_fallback = default_slot || fallback_block_1(ctx);
  const block = {
    c: function create() {
      li = element("li");
      div1 = element("div");
      if (if_block) if_block.c();
      t = space();
      div0 = element("div");
      if (default_slot_or_fallback) default_slot_or_fallback.c();
      this.h();
    },
    l: function claim(nodes) {
      li = claim_element(nodes, "LI", {
        class: true
      });
      var li_nodes = children(li);
      div1 = claim_element(li_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      if (if_block) if_block.l(div1_nodes);
      t = claim_space(div1_nodes);
      div0 = claim_element(div1_nodes, "DIV", {});
      var div0_nodes = children(div0);
      if (default_slot_or_fallback) default_slot_or_fallback.l(div0_nodes);
      div0_nodes.forEach(detach_dev);
      div1_nodes.forEach(detach_dev);
      li_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(div0, file$2, 68, 6, 1528);
      attr_dev(div1, "class",
      /*tabClasses*/
      ctx[5]);
      add_location(div1, file$2, 63, 4, 1408);
      attr_dev(li, "class",
      /*c*/
      ctx[7]);
      add_location(li, file$2, 57, 2, 1318);
    },
    m: function mount(target, anchor) {
      insert_dev(target, li, anchor);
      append_dev(li, div1);
      if (if_block) if_block.m(div1, null);
      append_dev(div1, t);
      append_dev(div1, div0);

      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(div0, null);
      }

      current = true;

      if (!mounted) {
        dispose = [action_destroyer(ripple_action =
        /*ripple*/
        ctx[8].call(null, li)), listen_dev(li, "click",
        /*click_handler_2*/
        ctx[15], false, false, false), listen_dev(li, "click",
        /*click_handler_1*/
        ctx[14], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, dirty) {
      if (
      /*icon*/
      ctx[1]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*icon*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        65536) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[16], dirty, null, null);
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && dirty &
        /*text*/
        8) {
          default_slot_or_fallback.p(ctx, dirty);
        }
      }

      if (!current || dirty &
      /*tabClasses*/
      32) {
        attr_dev(div1, "class",
        /*tabClasses*/
        ctx[5]);
      }

      if (!current || dirty &
      /*c*/
      128) {
        attr_dev(li, "class",
        /*c*/
        ctx[7]);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(li);
      if (if_block) if_block.d();
      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block.name,
    type: "else",
    source: "(57:0) {:else}",
    ctx
  });
  return block;
} // (40:0) {#if to}


function create_if_block(ctx) {
  let a;
  let div1;
  let t;
  let div0;
  let ripple_action;
  let current;
  let mounted;
  let dispose;
  let if_block =
  /*icon*/
  ctx[1] && create_if_block_1(ctx);
  const default_slot_template =
  /*$$slots*/
  ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[16], null);
  const default_slot_or_fallback = default_slot || fallback_block(ctx);
  const block = {
    c: function create() {
      a = element("a");
      div1 = element("div");
      if (if_block) if_block.c();
      t = space();
      div0 = element("div");
      if (default_slot_or_fallback) default_slot_or_fallback.c();
      this.h();
    },
    l: function claim(nodes) {
      a = claim_element(nodes, "A", {
        href: true,
        class: true
      });
      var a_nodes = children(a);
      div1 = claim_element(a_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      if (if_block) if_block.l(div1_nodes);
      t = claim_space(div1_nodes);
      div0 = claim_element(div1_nodes, "DIV", {});
      var div0_nodes = children(div0);
      if (default_slot_or_fallback) default_slot_or_fallback.l(div0_nodes);
      div0_nodes.forEach(detach_dev);
      div1_nodes.forEach(detach_dev);
      a_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(div0, file$2, 51, 6, 1243);
      attr_dev(div1, "class",
      /*tabClasses*/
      ctx[5]);
      add_location(div1, file$2, 46, 4, 1123);
      attr_dev(a, "href",
      /*to*/
      ctx[4]);
      attr_dev(a, "class",
      /*c*/
      ctx[7]);
      add_location(a, file$2, 40, 2, 1056);
    },
    m: function mount(target, anchor) {
      insert_dev(target, a, anchor);
      append_dev(a, div1);
      if (if_block) if_block.m(div1, null);
      append_dev(div1, t);
      append_dev(div1, div0);

      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(div0, null);
      }

      current = true;

      if (!mounted) {
        dispose = [action_destroyer(ripple_action =
        /*ripple*/
        ctx[8].call(null, a)), listen_dev(a, "click",
        /*click_handler*/
        ctx[13], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, dirty) {
      if (
      /*icon*/
      ctx[1]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*icon*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        65536) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[16], dirty, null, null);
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && dirty &
        /*text*/
        8) {
          default_slot_or_fallback.p(ctx, dirty);
        }
      }

      if (!current || dirty &
      /*tabClasses*/
      32) {
        attr_dev(div1, "class",
        /*tabClasses*/
        ctx[5]);
      }

      if (!current || dirty &
      /*to*/
      16) {
        attr_dev(a, "href",
        /*to*/
        ctx[4]);
      }

      if (!current || dirty &
      /*c*/
      128) {
        attr_dev(a, "class",
        /*c*/
        ctx[7]);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(a);
      if (if_block) if_block.d();
      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block.name,
    type: "if",
    source: "(40:0) {#if to}",
    ctx
  });
  return block;
} // (65:6) {#if icon}


function create_if_block_2(ctx) {
  let icon_1;
  let current;
  icon_1 = new Icon({
    props: {
      class: "mb-1",
      color:
      /*textColor*/
      ctx[6],
      $$slots: {
        default: [create_default_slot_1]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(icon_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_1_changes = {};
      if (dirty &
      /*textColor*/
      64) icon_1_changes.color =
      /*textColor*/
      ctx[6];

      if (dirty &
      /*$$scope, icon*/
      65538) {
        icon_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon_1.$set(icon_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_2.name,
    type: "if",
    source: "(65:6) {#if icon}",
    ctx
  });
  return block;
} // (66:8) <Icon class="mb-1" color={textColor}>


function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*icon*/
      ctx[1]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*icon*/
      ctx[1]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*icon*/
      2) set_data_dev(t,
      /*icon*/
      ctx[1]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_1.name,
    type: "slot",
    source: "(66:8) <Icon class=\\\"mb-1\\\" color={textColor}>",
    ctx
  });
  return block;
} // (70:14) {text}


function fallback_block_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*text*/
      ctx[3]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*text*/
      ctx[3]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*text*/
      8) set_data_dev(t,
      /*text*/
      ctx[3]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block_1.name,
    type: "fallback",
    source: "(70:14) {text}",
    ctx
  });
  return block;
} // (48:6) {#if icon}


function create_if_block_1(ctx) {
  let icon_1;
  let current;
  icon_1 = new Icon({
    props: {
      class: "mb-1",
      color:
      /*textColor*/
      ctx[6],
      $$slots: {
        default: [create_default_slot]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(icon_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_1_changes = {};
      if (dirty &
      /*textColor*/
      64) icon_1_changes.color =
      /*textColor*/
      ctx[6];

      if (dirty &
      /*$$scope, icon*/
      65538) {
        icon_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon_1.$set(icon_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1.name,
    type: "if",
    source: "(48:6) {#if icon}",
    ctx
  });
  return block;
} // (49:8) <Icon class="mb-1" color={textColor}>


function create_default_slot(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*icon*/
      ctx[1]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*icon*/
      ctx[1]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*icon*/
      2) set_data_dev(t,
      /*icon*/
      ctx[1]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: "(49:8) <Icon class=\\\"mb-1\\\" color={textColor}>",
    ctx
  });
  return block;
} // (53:14) {text}


function fallback_block(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*text*/
      ctx[3]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*text*/
      ctx[3]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*text*/
      8) set_data_dev(t,
      /*text*/
      ctx[3]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block.name,
    type: "fallback",
    source: "(53:14) {text}",
    ctx
  });
  return block;
}

function create_fragment$2(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*to*/
    ctx[4]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$2.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault = "duration-100 relative overflow-hidden text-center w-full h-full p-4 cursor-pointer flex mx-auto items-center text-sm h-full";

function instance$2($$self, $$props, $$invalidate) {
  let {
    classes = classesDefault
  } = $$props;
  let {
    icon = ""
  } = $$props;
  let {
    id = ""
  } = $$props;
  let {
    text = ""
  } = $$props;
  let {
    to = ""
  } = $$props;
  let {
    selected = ""
  } = $$props;
  let {
    color = "primary"
  } = $$props;
  let {
    notSelectedColor = "white"
  } = $$props;
  let {
    tabClasses = "flex flex-col items-center content-center mx-auto"
  } = $$props;
  const ripple = r(color);
  const {
    txt,
    bg
  } = utils(color);
  const notSelected = utils(notSelectedColor);
  const cb = new ClassBuilder(classes, classesDefault);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("TabButton", $$slots, ['default']);

  function click_handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  const click_handler_2 = () => $$invalidate(0, selected = id);

  $$self.$set = $$new_props => {
    $$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("classes" in $$new_props) $$invalidate(9, classes = $$new_props.classes);
    if ("icon" in $$new_props) $$invalidate(1, icon = $$new_props.icon);
    if ("id" in $$new_props) $$invalidate(2, id = $$new_props.id);
    if ("text" in $$new_props) $$invalidate(3, text = $$new_props.text);
    if ("to" in $$new_props) $$invalidate(4, to = $$new_props.to);
    if ("selected" in $$new_props) $$invalidate(0, selected = $$new_props.selected);
    if ("color" in $$new_props) $$invalidate(10, color = $$new_props.color);
    if ("notSelectedColor" in $$new_props) $$invalidate(11, notSelectedColor = $$new_props.notSelectedColor);
    if ("tabClasses" in $$new_props) $$invalidate(5, tabClasses = $$new_props.tabClasses);
    if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    Icon,
    createRipple: r,
    utils,
    ClassBuilder,
    classesDefault,
    classes,
    icon,
    id,
    text,
    to,
    selected,
    color,
    notSelectedColor,
    tabClasses,
    ripple,
    txt,
    bg,
    notSelected,
    cb,
    textColor,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
    if ("classes" in $$props) $$invalidate(9, classes = $$new_props.classes);
    if ("icon" in $$props) $$invalidate(1, icon = $$new_props.icon);
    if ("id" in $$props) $$invalidate(2, id = $$new_props.id);
    if ("text" in $$props) $$invalidate(3, text = $$new_props.text);
    if ("to" in $$props) $$invalidate(4, to = $$new_props.to);
    if ("selected" in $$props) $$invalidate(0, selected = $$new_props.selected);
    if ("color" in $$props) $$invalidate(10, color = $$new_props.color);
    if ("notSelectedColor" in $$props) $$invalidate(11, notSelectedColor = $$new_props.notSelectedColor);
    if ("tabClasses" in $$props) $$invalidate(5, tabClasses = $$new_props.tabClasses);
    if ("textColor" in $$props) $$invalidate(6, textColor = $$new_props.textColor);
    if ("c" in $$props) $$invalidate(7, c = $$new_props.c);
  };

  let textColor;
  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*selected, id*/
    5) {
       $$invalidate(6, textColor = selected === id ? txt() : notSelected.txt());
    }

     $$invalidate(7, c = cb.flush().add($$props.class).add("uppercase", icon).add(textColor).add(`hover:bg-${color}-transLight hover:${txt(900)}`).get());
  };

  $$props = exclude_internal_props($$props);
  return [selected, icon, id, text, to, tabClasses, textColor, c, ripple, classes, color, notSelectedColor, $$slots, click_handler, click_handler_1, click_handler_2, $$scope];
}

class TabButton extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {
      classes: 9,
      icon: 1,
      id: 2,
      text: 3,
      to: 4,
      selected: 0,
      color: 10,
      notSelectedColor: 11,
      tabClasses: 5
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "TabButton",
      options,
      id: create_fragment$2.name
    });
  }

  get classes() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get icon() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set icon(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get id() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set id(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get text() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set text(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get to() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set to(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get selected() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set selected(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get notSelectedColor() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set notSelectedColor(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get tabClasses() {
    throw new Error("<TabButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set tabClasses(value) {
    throw new Error("<TabButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

function cubicOut(t) {
  const f = t - 1.0;
  return f * f * f + 1.0;
}

function quadIn(t) {
  return t * t;
}

function quadOut(t) {
  return -t * (t - 2.0);
}

function fade(node, {
  delay = 0,
  duration = 400,
  easing = identity
}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: t => `opacity: ${t * o}`
  };
}

function fly(node, {
  delay = 0,
  duration = 400,
  easing = cubicOut,
  x = 0,
  y = 0,
  opacity = 0
}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - od * u}`
  };
}

function slide(node, {
  delay = 0,
  duration = 400,
  easing = cubicOut
}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const height = parseFloat(style.height);
  const padding_top = parseFloat(style.paddingTop);
  const padding_bottom = parseFloat(style.paddingBottom);
  const margin_top = parseFloat(style.marginTop);
  const margin_bottom = parseFloat(style.marginBottom);
  const border_top_width = parseFloat(style.borderTopWidth);
  const border_bottom_width = parseFloat(style.borderBottomWidth);
  return {
    delay,
    duration,
    easing,
    css: t => `overflow: hidden;` + `opacity: ${Math.min(t * 20, 1) * opacity};` + `height: ${t * height}px;` + `padding-top: ${t * padding_top}px;` + `padding-bottom: ${t * padding_bottom}px;` + `margin-top: ${t * margin_top}px;` + `margin-bottom: ${t * margin_bottom}px;` + `border-top-width: ${t * border_top_width}px;` + `border-bottom-width: ${t * border_bottom_width}px;`
  };
}

function scale(node, {
  delay = 0,
  duration = 400,
  easing = cubicOut,
  start = 0,
  opacity = 0
}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;
  const sd = 1 - start;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${target_opacity - od * u}
		`
  };
}

/* src/components/Tabs/Indicator.svelte generated by Svelte v3.24.0 */
const file$3 = "src/components/Tabs/Indicator.svelte";

function create_fragment$3(ctx) {
  let div;
  let div_class_value;
  let div_transition;
  let current;
  const block = {
    c: function create() {
      div = element("div");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      children(div).forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", div_class_value = "absolute bottom-0 left-0 transition " +
      /*bg*/
      ctx[2](700));
      set_style(div, "width",
      /*width*/
      ctx[0] + "px");
      set_style(div, "left",
      /*left*/
      ctx[1] + "px");
      set_style(div, "height", "2px");
      toggle_class(div, "hidden",
      /*left*/
      ctx[1] < 0);
      add_location(div, file$3, 11, 0, 223);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (!current || dirty &
      /*width*/
      1) {
        set_style(div, "width",
        /*width*/
        ctx[0] + "px");
      }

      if (!current || dirty &
      /*left*/
      2) {
        set_style(div, "left",
        /*left*/
        ctx[1] + "px");
      }

      if (dirty &
      /*left*/
      2) {
        toggle_class(div, "hidden",
        /*left*/
        ctx[1] < 0);
      }
    },
    i: function intro(local) {
      if (current) return;
      add_render_callback(() => {
        if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
        div_transition.run(1);
      });
      current = true;
    },
    o: function outro(local) {
      if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
      div_transition.run(0);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      if (detaching && div_transition) div_transition.end();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$3.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$3($$self, $$props, $$invalidate) {
  let {
    width = 0
  } = $$props;
  let {
    left = 0
  } = $$props;
  let {
    color = "primary"
  } = $$props;
  const {
    bg
  } = utils(color);
  const writable_props = ["width", "left", "color"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Indicator> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Indicator", $$slots, []);

  $$self.$set = $$props => {
    if ("width" in $$props) $$invalidate(0, width = $$props.width);
    if ("left" in $$props) $$invalidate(1, left = $$props.left);
    if ("color" in $$props) $$invalidate(3, color = $$props.color);
  };

  $$self.$capture_state = () => ({
    slide,
    utils,
    width,
    left,
    color,
    bg
  });

  $$self.$inject_state = $$props => {
    if ("width" in $$props) $$invalidate(0, width = $$props.width);
    if ("left" in $$props) $$invalidate(1, left = $$props.left);
    if ("color" in $$props) $$invalidate(3, color = $$props.color);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [width, left, bg, color];
}

class Indicator extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      width: 0,
      left: 1,
      color: 3
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Indicator",
      options,
      id: create_fragment$3.name
    });
  }

  get width() {
    throw new Error("<Indicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set width(value) {
    throw new Error("<Indicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get left() {
    throw new Error("<Indicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set left(value) {
    throw new Error("<Indicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<Indicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<Indicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/ProgressLinear/ProgressLinear.svelte generated by Svelte v3.24.0 */
const file$4 = "src/components/ProgressLinear/ProgressLinear.svelte";

function add_css$1() {
  var style = element("style");
  style.id = "svelte-mguqwa-style";
  style.textContent = ".inc.svelte-mguqwa{animation:svelte-mguqwa-increase 2s ease-in-out infinite}.dec.svelte-mguqwa{animation:svelte-mguqwa-decrease 2s 0.9s ease-in-out infinite}@keyframes svelte-mguqwa-increase{from{left:-5%;width:5%}to{left:130%;width:150%}}@keyframes svelte-mguqwa-decrease{from{left:-90%;width:90%}to{left:110%;width:10%}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3NMaW5lYXIuc3ZlbHRlIiwic291cmNlcyI6WyJQcm9ncmVzc0xpbmVhci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgaW1wb3J0IHsgc2xpZGUgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcblxuICBleHBvcnQgbGV0IGFwcCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHByb2dyZXNzID0gMDtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwicHJpbWFyeVwiO1xuXG4gIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIGlmICghYXBwKSByZXR1cm47XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9LCAyMDApO1xuICB9KTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC8qIGt1ZG9zIGh0dHBzOi8vY29kZXBlbi5pby9zaGFsaW1hbm8vcGVuL3dCbU5HSiAqL1xuICAuaW5jIHtcbiAgICBhbmltYXRpb246IGluY3JlYXNlIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICB9XG4gIC5kZWMge1xuICAgIGFuaW1hdGlvbjogZGVjcmVhc2UgMnMgMC45cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgaW5jcmVhc2Uge1xuICAgIGZyb20ge1xuICAgICAgbGVmdDogLTUlO1xuICAgICAgd2lkdGg6IDUlO1xuICAgIH1cbiAgICB0byB7XG4gICAgICBsZWZ0OiAxMzAlO1xuICAgICAgd2lkdGg6IDE1MCU7XG4gICAgfVxuICB9XG4gIEBrZXlmcmFtZXMgZGVjcmVhc2Uge1xuICAgIGZyb20ge1xuICAgICAgbGVmdDogLTkwJTtcbiAgICAgIHdpZHRoOiA5MCU7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgIGxlZnQ6IDExMCU7XG4gICAgICB3aWR0aDogMTAlO1xuICAgIH1cbiAgfVxuPC9zdHlsZT5cblxuPGRpdlxuICBjbGFzczpmaXhlZD17YXBwfVxuICBjbGFzczp6LTUwPXthcHB9XG4gIGNsYXNzPVwidG9wLTAgbGVmdC0wIHctZnVsbCBoLTEgYmcte2NvbG9yfS0xMDAgb3ZlcmZsb3ctaGlkZGVuIHJlbGF0aXZlXCJcbiAgY2xhc3M6aGlkZGVuPXthcHAgJiYgIWluaXRpYWxpemVkfVxuICB0cmFuc2l0aW9uOnNsaWRlPXt7IGR1cmF0aW9uOiAzMDAgfX0+XG4gIDxkaXZcbiAgICBjbGFzcz1cImJnLXtjb2xvcn0tNTAwIGgtMSBhYnNvbHV0ZVwiXG4gICAgY2xhc3M6aW5jPXshcHJvZ3Jlc3N9XG4gICAgY2xhc3M6dHJhbnNpdGlvbj17cHJvZ3Jlc3N9XG4gICAgc3R5bGU9e3Byb2dyZXNzID8gYHdpZHRoOiAke3Byb2dyZXNzfSVgIDogXCJcIn0gLz5cbiAgPGRpdiBjbGFzcz1cImJnLXtjb2xvcn0tNTAwIGgtMSBhYnNvbHV0ZSBkZWNcIiBjbGFzczpoaWRkZW49e3Byb2dyZXNzfSAvPlxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUJFLElBQUksY0FBQyxDQUFDLEFBQ0osU0FBUyxDQUFFLHNCQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEFBQzdDLENBQUMsQUFDRCxJQUFJLGNBQUMsQ0FBQyxBQUNKLFNBQVMsQ0FBRSxzQkFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQUFDbEQsQ0FBQyxBQUVELFdBQVcsc0JBQVMsQ0FBQyxBQUNuQixJQUFJLEFBQUMsQ0FBQyxBQUNKLElBQUksQ0FBRSxHQUFHLENBQ1QsS0FBSyxDQUFFLEVBQUUsQUFDWCxDQUFDLEFBQ0QsRUFBRSxBQUFDLENBQUMsQUFDRixJQUFJLENBQUUsSUFBSSxDQUNWLEtBQUssQ0FBRSxJQUFJLEFBQ2IsQ0FBQyxBQUNILENBQUMsQUFDRCxXQUFXLHNCQUFTLENBQUMsQUFDbkIsSUFBSSxBQUFDLENBQUMsQUFDSixJQUFJLENBQUUsSUFBSSxDQUNWLEtBQUssQ0FBRSxHQUFHLEFBQ1osQ0FBQyxBQUNELEVBQUUsQUFBQyxDQUFDLEFBQ0YsSUFBSSxDQUFFLElBQUksQ0FDVixLQUFLLENBQUUsR0FBRyxBQUNaLENBQUMsQUFDSCxDQUFDIn0= */";
  append_dev(document.head, style);
}

function create_fragment$4(ctx) {
  let div2;
  let div0;
  let div0_class_value;
  let div0_style_value;
  let t;
  let div1;
  let div1_class_value;
  let div2_class_value;
  let div2_transition;
  let current;
  const block = {
    c: function create() {
      div2 = element("div");
      div0 = element("div");
      t = space();
      div1 = element("div");
      this.h();
    },
    l: function claim(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true,
        style: true
      });
      children(div0).forEach(detach_dev);
      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      children(div1).forEach(detach_dev);
      div2_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", div0_class_value = "bg-" +
      /*color*/
      ctx[2] + "-500 h-1 absolute" + " svelte-mguqwa");
      attr_dev(div0, "style", div0_style_value =
      /*progress*/
      ctx[1] ? `width: ${
      /*progress*/
      ctx[1]}%` : "");
      toggle_class(div0, "inc", !
      /*progress*/
      ctx[1]);
      toggle_class(div0, "transition",
      /*progress*/
      ctx[1]);
      add_location(div0, file$4, 56, 2, 987);
      attr_dev(div1, "class", div1_class_value = "bg-" +
      /*color*/
      ctx[2] + "-500 h-1 absolute dec" + " svelte-mguqwa");
      toggle_class(div1, "hidden",
      /*progress*/
      ctx[1]);
      add_location(div1, file$4, 61, 2, 1145);
      attr_dev(div2, "class", div2_class_value = "top-0 left-0 w-full h-1 bg-" +
      /*color*/
      ctx[2] + "-100 overflow-hidden relative" + " svelte-mguqwa");
      toggle_class(div2, "fixed",
      /*app*/
      ctx[0]);
      toggle_class(div2, "z-50",
      /*app*/
      ctx[0]);
      toggle_class(div2, "hidden",
      /*app*/
      ctx[0] && !
      /*initialized*/
      ctx[3]);
      add_location(div2, file$4, 50, 0, 790);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div0);
      append_dev(div2, t);
      append_dev(div2, div1);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (!current || dirty &
      /*color*/
      4 && div0_class_value !== (div0_class_value = "bg-" +
      /*color*/
      ctx[2] + "-500 h-1 absolute" + " svelte-mguqwa")) {
        attr_dev(div0, "class", div0_class_value);
      }

      if (!current || dirty &
      /*progress*/
      2 && div0_style_value !== (div0_style_value =
      /*progress*/
      ctx[1] ? `width: ${
      /*progress*/
      ctx[1]}%` : "")) {
        attr_dev(div0, "style", div0_style_value);
      }

      if (dirty &
      /*color, progress*/
      6) {
        toggle_class(div0, "inc", !
        /*progress*/
        ctx[1]);
      }

      if (dirty &
      /*color, progress*/
      6) {
        toggle_class(div0, "transition",
        /*progress*/
        ctx[1]);
      }

      if (!current || dirty &
      /*color*/
      4 && div1_class_value !== (div1_class_value = "bg-" +
      /*color*/
      ctx[2] + "-500 h-1 absolute dec" + " svelte-mguqwa")) {
        attr_dev(div1, "class", div1_class_value);
      }

      if (dirty &
      /*color, progress*/
      6) {
        toggle_class(div1, "hidden",
        /*progress*/
        ctx[1]);
      }

      if (!current || dirty &
      /*color*/
      4 && div2_class_value !== (div2_class_value = "top-0 left-0 w-full h-1 bg-" +
      /*color*/
      ctx[2] + "-100 overflow-hidden relative" + " svelte-mguqwa")) {
        attr_dev(div2, "class", div2_class_value);
      }

      if (dirty &
      /*color, app*/
      5) {
        toggle_class(div2, "fixed",
        /*app*/
        ctx[0]);
      }

      if (dirty &
      /*color, app*/
      5) {
        toggle_class(div2, "z-50",
        /*app*/
        ctx[0]);
      }

      if (dirty &
      /*color, app, initialized*/
      13) {
        toggle_class(div2, "hidden",
        /*app*/
        ctx[0] && !
        /*initialized*/
        ctx[3]);
      }
    },
    i: function intro(local) {
      if (current) return;
      add_render_callback(() => {
        if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, {
          duration: 300
        }, true);
        div2_transition.run(1);
      });
      current = true;
    },
    o: function outro(local) {
      if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, {
        duration: 300
      }, false);
      div2_transition.run(0);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div2);
      if (detaching && div2_transition) div2_transition.end();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$4.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$4($$self, $$props, $$invalidate) {
  let {
    app = false
  } = $$props;
  let {
    progress = 0
  } = $$props;
  let {
    color = "primary"
  } = $$props;
  let initialized = false;
  onMount(() => {
    if (!app) return;
    setTimeout(() => {
      $$invalidate(3, initialized = true);
    }, 200);
  });
  const writable_props = ["app", "progress", "color"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProgressLinear> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("ProgressLinear", $$slots, []);

  $$self.$set = $$props => {
    if ("app" in $$props) $$invalidate(0, app = $$props.app);
    if ("progress" in $$props) $$invalidate(1, progress = $$props.progress);
    if ("color" in $$props) $$invalidate(2, color = $$props.color);
  };

  $$self.$capture_state = () => ({
    onMount,
    slide,
    app,
    progress,
    color,
    initialized
  });

  $$self.$inject_state = $$props => {
    if ("app" in $$props) $$invalidate(0, app = $$props.app);
    if ("progress" in $$props) $$invalidate(1, progress = $$props.progress);
    if ("color" in $$props) $$invalidate(2, color = $$props.color);
    if ("initialized" in $$props) $$invalidate(3, initialized = $$props.initialized);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [app, progress, color, initialized];
}

class ProgressLinear extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-mguqwa-style")) add_css$1();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {
      app: 0,
      progress: 1,
      color: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "ProgressLinear",
      options,
      id: create_fragment$4.name
    });
  }

  get app() {
    throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set app(value) {
    throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get progress() {
    throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set progress(value) {
    throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Tabs/Tabs.svelte generated by Svelte v3.24.0 */
const file$5 = "src/components/Tabs/Tabs.svelte";

const get_content_slot_changes = dirty => ({
  selected: dirty &
  /*selected*/
  1
});

const get_content_slot_context = ctx => ({
  selected:
  /*selected*/
  ctx[0]
});

const get_item_slot_changes = dirty => ({
  color: dirty &
  /*color*/
  8,
  item: dirty &
  /*items*/
  2
});

const get_item_slot_context = ctx => ({
  color:
  /*color*/
  ctx[3],
  item:
  /*item*/
  ctx[21]
});

function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[21] = list[i];
  child_ctx[23] = i;
  return child_ctx;
} // (69:6) <TabButton         class={tabButtonClasses}         bind:selected         {...item}         {color}         {notSelectedColor}       >


function create_default_slot$1(ctx) {
  let t_value =
  /*item*/
  ctx[21].text + "";
  let t;
  const block = {
    c: function create() {
      t = text(t_value);
    },
    l: function claim(nodes) {
      t = claim_text(nodes, t_value);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*items*/
      2 && t_value !== (t_value =
      /*item*/
      ctx[21].text + "")) set_data_dev(t, t_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$1.name,
    type: "slot",
    source: "(69:6) <TabButton         class={tabButtonClasses}         bind:selected         {...item}         {color}         {notSelectedColor}       >",
    ctx
  });
  return block;
} // (68:37)        


function fallback_block$1(ctx) {
  let tabbutton;
  let updating_selected;
  let current;
  const tabbutton_spread_levels = [{
    class:
    /*tabButtonClasses*/
    ctx[6]
  },
  /*item*/
  ctx[21], {
    color:
    /*color*/
    ctx[3]
  }, {
    notSelectedColor:
    /*notSelectedColor*/
    ctx[4]
  }];

  function tabbutton_selected_binding(value) {
    /*tabbutton_selected_binding*/
    ctx[14].call(null, value);
  }

  let tabbutton_props = {
    $$slots: {
      default: [create_default_slot$1]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < tabbutton_spread_levels.length; i += 1) {
    tabbutton_props = assign(tabbutton_props, tabbutton_spread_levels[i]);
  }

  if (
  /*selected*/
  ctx[0] !== void 0) {
    tabbutton_props.selected =
    /*selected*/
    ctx[0];
  }

  tabbutton = new TabButton({
    props: tabbutton_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(tabbutton, "selected", tabbutton_selected_binding));
  const block = {
    c: function create() {
      create_component(tabbutton.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(tabbutton.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(tabbutton, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const tabbutton_changes = dirty &
      /*tabButtonClasses, items, color, notSelectedColor*/
      90 ? get_spread_update(tabbutton_spread_levels, [dirty &
      /*tabButtonClasses*/
      64 && {
        class:
        /*tabButtonClasses*/
        ctx[6]
      }, dirty &
      /*items*/
      2 && get_spread_object(
      /*item*/
      ctx[21]), dirty &
      /*color*/
      8 && {
        color:
        /*color*/
        ctx[3]
      }, dirty &
      /*notSelectedColor*/
      16 && {
        notSelectedColor:
        /*notSelectedColor*/
        ctx[4]
      }]) : {};

      if (dirty &
      /*$$scope, items*/
      65538) {
        tabbutton_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_selected && dirty &
      /*selected*/
      1) {
        updating_selected = true;
        tabbutton_changes.selected =
        /*selected*/
        ctx[0];
        add_flush_callback(() => updating_selected = false);
      }

      tabbutton.$set(tabbutton_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(tabbutton.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(tabbutton.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(tabbutton, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block$1.name,
    type: "fallback",
    source: "(68:37)        ",
    ctx
  });
  return block;
} // (67:2) {#each items as item, i}


function create_each_block(ctx) {
  let current;
  const item_slot_template =
  /*$$slots*/
  ctx[13].item;
  const item_slot = create_slot(item_slot_template, ctx,
  /*$$scope*/
  ctx[16], get_item_slot_context);
  const item_slot_or_fallback = item_slot || fallback_block$1(ctx);
  const block = {
    c: function create() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    l: function claim(nodes) {
      if (item_slot_or_fallback) item_slot_or_fallback.l(nodes);
    },
    m: function mount(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (item_slot) {
        if (item_slot.p && dirty &
        /*$$scope, color, items*/
        65546) {
          update_slot(item_slot, item_slot_template, ctx,
          /*$$scope*/
          ctx[16], dirty, get_item_slot_changes, get_item_slot_context);
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && dirty &
        /*tabButtonClasses, items, color, notSelectedColor, selected*/
        91) {
          item_slot_or_fallback.p(ctx, dirty);
        }
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block.name,
    type: "each",
    source: "(67:2) {#each items as item, i}",
    ctx
  });
  return block;
} // (78:2) {#if indicator && offset !== null}


function create_if_block_1$1(ctx) {
  let indicator_1;
  let current;
  indicator_1 = new Indicator({
    props: {
      color:
      /*color*/
      ctx[3],
      width:
      /*indicatorWidth*/
      ctx[8],
      left:
      /*offset*/
      ctx[9]
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(indicator_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(indicator_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(indicator_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const indicator_1_changes = {};
      if (dirty &
      /*color*/
      8) indicator_1_changes.color =
      /*color*/
      ctx[3];
      if (dirty &
      /*indicatorWidth*/
      256) indicator_1_changes.width =
      /*indicatorWidth*/
      ctx[8];
      if (dirty &
      /*offset*/
      512) indicator_1_changes.left =
      /*offset*/
      ctx[9];
      indicator_1.$set(indicator_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(indicator_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(indicator_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(indicator_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1$1.name,
    type: "if",
    source: "(78:2) {#if indicator && offset !== null}",
    ctx
  });
  return block;
} // (82:0) {#if loading}


function create_if_block$1(ctx) {
  let progresslinear;
  let current;
  progresslinear = new ProgressLinear({
    props: {
      color:
      /*color*/
      ctx[3]
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(progresslinear.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(progresslinear.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(progresslinear, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const progresslinear_changes = {};
      if (dirty &
      /*color*/
      8) progresslinear_changes.color =
      /*color*/
      ctx[3];
      progresslinear.$set(progresslinear_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(progresslinear.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(progresslinear.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(progresslinear, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$1.name,
    type: "if",
    source: "(82:0) {#if loading}",
    ctx
  });
  return block;
}

function create_fragment$5(ctx) {
  let div;
  let t0;
  let t1;
  let t2;
  let current;
  let each_value =
  /*items*/
  ctx[1];
  validate_each_argument(each_value);
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  const out = i => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });

  let if_block0 =
  /*indicator*/
  ctx[2] &&
  /*offset*/
  ctx[9] !== null && create_if_block_1$1(ctx);
  let if_block1 =
  /*loading*/
  ctx[5] && create_if_block$1(ctx);
  const content_slot_template =
  /*$$slots*/
  ctx[13].content;
  const content_slot = create_slot(content_slot_template, ctx,
  /*$$scope*/
  ctx[16], get_content_slot_context);
  const block = {
    c: function create() {
      div = element("div");

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      t0 = space();
      if (if_block0) if_block0.c();
      t1 = space();
      if (if_block1) if_block1.c();
      t2 = space();
      if (content_slot) content_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }

      t0 = claim_space(div_nodes);
      if (if_block0) if_block0.l(div_nodes);
      div_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      if (if_block1) if_block1.l(nodes);
      t2 = claim_space(nodes);
      if (content_slot) content_slot.l(nodes);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class",
      /*c*/
      ctx[10]);
      add_location(div, file$5, 63, 0, 1651);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }

      append_dev(div, t0);
      if (if_block0) if_block0.m(div, null);
      /*div_binding*/

      ctx[15](div);
      insert_dev(target, t1, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert_dev(target, t2, anchor);

      if (content_slot) {
        content_slot.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*tabButtonClasses, items, color, notSelectedColor, selected, $$scope*/
      65627) {
        each_value =
        /*items*/
        ctx[1];
        validate_each_argument(each_value);
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, t0);
          }
        }

        group_outros();

        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }

        check_outros();
      }

      if (
      /*indicator*/
      ctx[2] &&
      /*offset*/
      ctx[9] !== null) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty &
          /*indicator, offset*/
          516) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$1(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, null);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }

      if (!current || dirty &
      /*c*/
      1024) {
        attr_dev(div, "class",
        /*c*/
        ctx[10]);
      }

      if (
      /*loading*/
      ctx[5]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);

          if (dirty &
          /*loading*/
          32) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$1(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t2.parentNode, t2);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }

      if (content_slot) {
        if (content_slot.p && dirty &
        /*$$scope, selected*/
        65537) {
          update_slot(content_slot, content_slot_template, ctx,
          /*$$scope*/
          ctx[16], dirty, get_content_slot_changes, get_content_slot_context);
        }
      }
    },
    i: function intro(local) {
      if (current) return;

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(content_slot, local);
      current = true;
    },
    o: function outro(local) {
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(content_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_each(each_blocks, detaching);
      if (if_block0) if_block0.d();
      /*div_binding*/

      ctx[15](null);
      if (detaching) detach_dev(t1);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach_dev(t2);
      if (content_slot) content_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$5.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$1 = "y-0 h-full items-center relative mx-auto z-20";

function instance$5($$self, $$props, $$invalidate) {
  let {
    selected = null
  } = $$props;
  let {
    navigation = false
  } = $$props;
  let {
    items = []
  } = $$props;
  let {
    indicator = true
  } = $$props;
  let {
    color = "white"
  } = $$props;
  let {
    notSelectedColor = "white"
  } = $$props;
  let {
    loading = false
  } = $$props;
  let {
    tabButtonClasses = i => i
  } = $$props;
  let node;
  let indicatorWidth = 0;
  let indicatorOffset = 0;
  let offset = null;

  function calcIndicator() {
    $$invalidate(8, indicatorWidth = node ? node.offsetWidth / items.length : 0);
    let left = 0;

    if (selected && items.findIndex(i => selected.includes(i.to || i.id)) !== -1) {
      const longestMatch = items.map((item, index) => [index, item]).filter(([index, item]) => selected.includes(item.to || item.id)).sort(([index1, item1], [index2, item2]) => (item2.to || item2.id).length - (item1.to || item1.id).length)[0];

      if (longestMatch) {
        left = longestMatch[0];
        $$invalidate(9, offset = left * indicatorWidth);
      }
    } else {
      $$invalidate(9, offset = null);
    }
  }

  onMount(() => calcIndicator());
  let {
    classes = classesDefault$1
  } = $$props;
  const cb = new ClassBuilder(classes, classesDefault$1);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Tabs", $$slots, ['item', 'content']);

  function tabbutton_selected_binding(value) {
    selected = value;
    $$invalidate(0, selected);
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      node = $$value;
      $$invalidate(7, node);
    });
  }

  $$self.$set = $$new_props => {
    $$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("selected" in $$new_props) $$invalidate(0, selected = $$new_props.selected);
    if ("navigation" in $$new_props) $$invalidate(11, navigation = $$new_props.navigation);
    if ("items" in $$new_props) $$invalidate(1, items = $$new_props.items);
    if ("indicator" in $$new_props) $$invalidate(2, indicator = $$new_props.indicator);
    if ("color" in $$new_props) $$invalidate(3, color = $$new_props.color);
    if ("notSelectedColor" in $$new_props) $$invalidate(4, notSelectedColor = $$new_props.notSelectedColor);
    if ("loading" in $$new_props) $$invalidate(5, loading = $$new_props.loading);
    if ("tabButtonClasses" in $$new_props) $$invalidate(6, tabButtonClasses = $$new_props.tabButtonClasses);
    if ("classes" in $$new_props) $$invalidate(12, classes = $$new_props.classes);
    if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    onMount,
    ClassBuilder,
    Indicator,
    ProgressLinear,
    TabButton,
    selected,
    navigation,
    items,
    indicator,
    color,
    notSelectedColor,
    loading,
    tabButtonClasses,
    node,
    indicatorWidth,
    indicatorOffset,
    offset,
    calcIndicator,
    classesDefault: classesDefault$1,
    classes,
    cb,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    if ("selected" in $$props) $$invalidate(0, selected = $$new_props.selected);
    if ("navigation" in $$props) $$invalidate(11, navigation = $$new_props.navigation);
    if ("items" in $$props) $$invalidate(1, items = $$new_props.items);
    if ("indicator" in $$props) $$invalidate(2, indicator = $$new_props.indicator);
    if ("color" in $$props) $$invalidate(3, color = $$new_props.color);
    if ("notSelectedColor" in $$props) $$invalidate(4, notSelectedColor = $$new_props.notSelectedColor);
    if ("loading" in $$props) $$invalidate(5, loading = $$new_props.loading);
    if ("tabButtonClasses" in $$props) $$invalidate(6, tabButtonClasses = $$new_props.tabButtonClasses);
    if ("node" in $$props) $$invalidate(7, node = $$new_props.node);
    if ("indicatorWidth" in $$props) $$invalidate(8, indicatorWidth = $$new_props.indicatorWidth);
    if ("indicatorOffset" in $$props) indicatorOffset = $$new_props.indicatorOffset;
    if ("offset" in $$props) $$invalidate(9, offset = $$new_props.offset);
    if ("classes" in $$props) $$invalidate(12, classes = $$new_props.classes);
    if ("c" in $$props) $$invalidate(10, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*selected*/
    1) {
       calcIndicator();
    }

     $$invalidate(10, c = cb.flush().add($$props.class).add("hidden md:flex w-full max-w-2xl", navigation).add("flex", !navigation).get());
  };

  $$props = exclude_internal_props($$props);
  return [selected, items, indicator, color, notSelectedColor, loading, tabButtonClasses, node, indicatorWidth, offset, c, navigation, classes, $$slots, tabbutton_selected_binding, div_binding, $$scope];
}

class Tabs extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      selected: 0,
      navigation: 11,
      items: 1,
      indicator: 2,
      color: 3,
      notSelectedColor: 4,
      loading: 5,
      tabButtonClasses: 6,
      classes: 12
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Tabs",
      options,
      id: create_fragment$5.name
    });
  }

  get selected() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set selected(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get navigation() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set navigation(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get items() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set items(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get indicator() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set indicator(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get notSelectedColor() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set notSelectedColor(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get loading() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set loading(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get tabButtonClasses() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set tabButtonClasses(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Button/Button.svelte generated by Svelte v3.24.0 */
const file$6 = "src/components/Button/Button.svelte"; // (151:0) {:else}

function create_else_block$1(ctx) {
  let button;
  let t;
  let ripple_action;
  let current;
  let mounted;
  let dispose;
  let if_block =
  /*icon*/
  ctx[3] && create_if_block_2$1(ctx);
  const default_slot_template =
  /*$$slots*/
  ctx[29].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[38], null);
  let button_levels = [{
    class:
    /*classes*/
    ctx[1]
  },
  /*props*/
  ctx[8], {
    disabled:
    /*disabled*/
    ctx[2]
  }];
  let button_data = {};

  for (let i = 0; i < button_levels.length; i += 1) {
    button_data = assign(button_data, button_levels[i]);
  }

  const block_1 = {
    c: function create() {
      button = element("button");
      if (if_block) if_block.c();
      t = space();
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      button = claim_element(nodes, "BUTTON", {
        class: true,
        disabled: true
      });
      var button_nodes = children(button);
      if (if_block) if_block.l(button_nodes);
      t = claim_space(button_nodes);
      if (default_slot) default_slot.l(button_nodes);
      button_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      set_attributes(button, button_data);
      add_location(button, file$6, 151, 2, 4057);
    },
    m: function mount(target, anchor) {
      insert_dev(target, button, anchor);
      if (if_block) if_block.m(button, null);
      append_dev(button, t);

      if (default_slot) {
        default_slot.m(button, null);
      }

      current = true;

      if (!mounted) {
        dispose = [action_destroyer(ripple_action =
        /*ripple*/
        ctx[7].call(null, button)), listen_dev(button, "click",
        /*click_handler_3*/
        ctx[37], false, false, false), listen_dev(button, "click",
        /*click_handler_1*/
        ctx[33], false, false, false), listen_dev(button, "mouseover",
        /*mouseover_handler_1*/
        ctx[34], false, false, false), listen_dev(button, "*",
        /*_handler_1*/
        ctx[35], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, dirty) {
      if (
      /*icon*/
      ctx[3]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty[0] &
          /*icon*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2$1(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(button, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }

      if (default_slot) {
        if (default_slot.p && dirty[1] &
        /*$$scope*/
        128) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[38], dirty, null, null);
        }
      }

      set_attributes(button, button_data = get_spread_update(button_levels, [(!current || dirty[0] &
      /*classes*/
      2) && {
        class:
        /*classes*/
        ctx[1]
      },
      /*props*/
      ctx[8], (!current || dirty[0] &
      /*disabled*/
      4) && {
        disabled:
        /*disabled*/
        ctx[2]
      }]));
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(button);
      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_else_block$1.name,
    type: "else",
    source: "(151:0) {:else}",
    ctx
  });
  return block_1;
} // (130:0) {#if href}


function create_if_block$2(ctx) {
  let a;
  let button;
  let t;
  let ripple_action;
  let current;
  let mounted;
  let dispose;
  let if_block =
  /*icon*/
  ctx[3] && create_if_block_1$2(ctx);
  const default_slot_template =
  /*$$slots*/
  ctx[29].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[38], null);
  let button_levels = [{
    class:
    /*classes*/
    ctx[1]
  },
  /*props*/
  ctx[8], {
    disabled:
    /*disabled*/
    ctx[2]
  }];
  let button_data = {};

  for (let i = 0; i < button_levels.length; i += 1) {
    button_data = assign(button_data, button_levels[i]);
  }

  let a_levels = [{
    href:
    /*href*/
    ctx[5]
  },
  /*props*/
  ctx[8]];
  let a_data = {};

  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }

  const block_1 = {
    c: function create() {
      a = element("a");
      button = element("button");
      if (if_block) if_block.c();
      t = space();
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      a = claim_element(nodes, "A", {
        href: true
      });
      var a_nodes = children(a);
      button = claim_element(a_nodes, "BUTTON", {
        class: true,
        disabled: true
      });
      var button_nodes = children(button);
      if (if_block) if_block.l(button_nodes);
      t = claim_space(button_nodes);
      if (default_slot) default_slot.l(button_nodes);
      button_nodes.forEach(detach_dev);
      a_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      set_attributes(button, button_data);
      add_location(button, file$6, 134, 4, 3757);
      set_attributes(a, a_data);
      add_location(a, file$6, 130, 2, 3720);
    },
    m: function mount(target, anchor) {
      insert_dev(target, a, anchor);
      append_dev(a, button);
      if (if_block) if_block.m(button, null);
      append_dev(button, t);

      if (default_slot) {
        default_slot.m(button, null);
      }

      current = true;

      if (!mounted) {
        dispose = [action_destroyer(ripple_action =
        /*ripple*/
        ctx[7].call(null, button)), listen_dev(button, "click",
        /*click_handler_2*/
        ctx[36], false, false, false), listen_dev(button, "click",
        /*click_handler*/
        ctx[30], false, false, false), listen_dev(button, "mouseover",
        /*mouseover_handler*/
        ctx[31], false, false, false), listen_dev(button, "*",
        /*_handler*/
        ctx[32], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, dirty) {
      if (
      /*icon*/
      ctx[3]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty[0] &
          /*icon*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1$2(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(button, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }

      if (default_slot) {
        if (default_slot.p && dirty[1] &
        /*$$scope*/
        128) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[38], dirty, null, null);
        }
      }

      set_attributes(button, button_data = get_spread_update(button_levels, [(!current || dirty[0] &
      /*classes*/
      2) && {
        class:
        /*classes*/
        ctx[1]
      },
      /*props*/
      ctx[8], (!current || dirty[0] &
      /*disabled*/
      4) && {
        disabled:
        /*disabled*/
        ctx[2]
      }]));
      set_attributes(a, a_data = get_spread_update(a_levels, [(!current || dirty[0] &
      /*href*/
      32) && {
        href:
        /*href*/
        ctx[5]
      },
      /*props*/
      ctx[8]]));
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(a);
      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_if_block$2.name,
    type: "if",
    source: "(130:0) {#if href}",
    ctx
  });
  return block_1;
} // (162:4) {#if icon}


function create_if_block_2$1(ctx) {
  let icon_1;
  let current;
  icon_1 = new Icon({
    props: {
      class:
      /*iClasses*/
      ctx[6],
      small:
      /*small*/
      ctx[4],
      $$slots: {
        default: [create_default_slot_1$1]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block_1 = {
    c: function create() {
      create_component(icon_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_1_changes = {};
      if (dirty[0] &
      /*iClasses*/
      64) icon_1_changes.class =
      /*iClasses*/
      ctx[6];
      if (dirty[0] &
      /*small*/
      16) icon_1_changes.small =
      /*small*/
      ctx[4];

      if (dirty[0] &
      /*icon*/
      8 | dirty[1] &
      /*$$scope*/
      128) {
        icon_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon_1.$set(icon_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_if_block_2$1.name,
    type: "if",
    source: "(162:4) {#if icon}",
    ctx
  });
  return block_1;
} // (163:6) <Icon class={iClasses} {small}>


function create_default_slot_1$1(ctx) {
  let t;
  const block_1 = {
    c: function create() {
      t = text(
      /*icon*/
      ctx[3]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*icon*/
      ctx[3]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty[0] &
      /*icon*/
      8) set_data_dev(t,
      /*icon*/
      ctx[3]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_default_slot_1$1.name,
    type: "slot",
    source: "(163:6) <Icon class={iClasses} {small}>",
    ctx
  });
  return block_1;
} // (145:6) {#if icon}


function create_if_block_1$2(ctx) {
  let icon_1;
  let current;
  icon_1 = new Icon({
    props: {
      class:
      /*iClasses*/
      ctx[6],
      small:
      /*small*/
      ctx[4],
      $$slots: {
        default: [create_default_slot$2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block_1 = {
    c: function create() {
      create_component(icon_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_1_changes = {};
      if (dirty[0] &
      /*iClasses*/
      64) icon_1_changes.class =
      /*iClasses*/
      ctx[6];
      if (dirty[0] &
      /*small*/
      16) icon_1_changes.small =
      /*small*/
      ctx[4];

      if (dirty[0] &
      /*icon*/
      8 | dirty[1] &
      /*$$scope*/
      128) {
        icon_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon_1.$set(icon_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_if_block_1$2.name,
    type: "if",
    source: "(145:6) {#if icon}",
    ctx
  });
  return block_1;
} // (146:8) <Icon class={iClasses} {small}>


function create_default_slot$2(ctx) {
  let t;
  const block_1 = {
    c: function create() {
      t = text(
      /*icon*/
      ctx[3]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*icon*/
      ctx[3]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty[0] &
      /*icon*/
      8) set_data_dev(t,
      /*icon*/
      ctx[3]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_default_slot$2.name,
    type: "slot",
    source: "(146:8) <Icon class={iClasses} {small}>",
    ctx
  });
  return block_1;
}

function create_fragment$6(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$1];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*href*/
    ctx[5]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block_1 = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block_1,
    id: create_fragment$6.name,
    type: "component",
    source: "",
    ctx
  });
  return block_1;
}

const classesDefault$2 = "z-10 py-2 px-4 uppercase text-sm font-medium relative overflow-hidden";
const basicDefault = "text-white duration-200 ease-in";
const outlinedDefault = "bg-transparent border border-solid";
const textDefault = "bg-transparent border-none px-4 hover:bg-transparent";
const iconDefault = "p-4 flex items-center select-none";
const fabDefault = "hover:bg-transparent";
const smallDefault = "pt-1 pb-1 pl-2 pr-2 text-xs";
const disabledDefault = "bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default";
const elevationDefault = "hover:elevation-5 elevation-3";

function instance$6($$self, $$props, $$invalidate) {
  let {
    value = false
  } = $$props;
  let {
    outlined = false
  } = $$props;
  let {
    text = false
  } = $$props;
  let {
    block = false
  } = $$props;
  let {
    disabled = false
  } = $$props;
  let {
    icon = null
  } = $$props;
  let {
    small = false
  } = $$props;
  let {
    light = false
  } = $$props;
  let {
    dark = false
  } = $$props;
  let {
    flat = false
  } = $$props;
  let {
    iconClass = ""
  } = $$props;
  let {
    color = "primary"
  } = $$props;
  let {
    href = null
  } = $$props;
  let {
    fab = false
  } = $$props;
  let {
    remove = ""
  } = $$props;
  let {
    add = ""
  } = $$props;
  let {
    replace = {}
  } = $$props;
  let {
    classes = classesDefault$2
  } = $$props;
  let {
    basicClasses = basicDefault
  } = $$props;
  let {
    outlinedClasses = outlinedDefault
  } = $$props;
  let {
    textClasses = textDefault
  } = $$props;
  let {
    iconClasses = iconDefault
  } = $$props;
  let {
    fabClasses = fabDefault
  } = $$props;
  let {
    smallClasses = smallDefault
  } = $$props;
  let {
    disabledClasses = disabledDefault
  } = $$props;
  let {
    elevationClasses = elevationDefault
  } = $$props;
  fab = fab || text && icon;
  const basic = !outlined && !text && !fab;
  const elevation = (basic || icon) && !disabled && !flat && !text;

  let Classes = i => i;

  let iClasses = i => i;

  let shade = 0;
  const {
    bg,
    border,
    txt
  } = utils(color);
  const cb = new ClassBuilder(classes, classesDefault$2);
  let iconCb;

  if (icon) {
    iconCb = new ClassBuilder(iconClass);
  }

  const ripple = r(text || fab || outlined ? color : "white");
  const props = filterProps(["outlined", "text", "color", "block", "disabled", "icon", "small", "light", "dark", "flat", "add", "remove", "replace"], $$props);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Button", $$slots, ['default']);

  function click_handler(event) {
    bubble($$self, event);
  }

  function mouseover_handler(event) {
    bubble($$self, event);
  }

  function _handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  function mouseover_handler_1(event) {
    bubble($$self, event);
  }

  function _handler_1(event) {
    bubble($$self, event);
  }

  const click_handler_2 = () => $$invalidate(0, value = !value);

  const click_handler_3 = () => $$invalidate(0, value = !value);

  $$self.$set = $$new_props => {
    $$invalidate(50, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
    if ("outlined" in $$new_props) $$invalidate(10, outlined = $$new_props.outlined);
    if ("text" in $$new_props) $$invalidate(11, text = $$new_props.text);
    if ("block" in $$new_props) $$invalidate(12, block = $$new_props.block);
    if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    if ("small" in $$new_props) $$invalidate(4, small = $$new_props.small);
    if ("light" in $$new_props) $$invalidate(13, light = $$new_props.light);
    if ("dark" in $$new_props) $$invalidate(14, dark = $$new_props.dark);
    if ("flat" in $$new_props) $$invalidate(15, flat = $$new_props.flat);
    if ("iconClass" in $$new_props) $$invalidate(16, iconClass = $$new_props.iconClass);
    if ("color" in $$new_props) $$invalidate(17, color = $$new_props.color);
    if ("href" in $$new_props) $$invalidate(5, href = $$new_props.href);
    if ("fab" in $$new_props) $$invalidate(9, fab = $$new_props.fab);
    if ("remove" in $$new_props) $$invalidate(18, remove = $$new_props.remove);
    if ("add" in $$new_props) $$invalidate(19, add = $$new_props.add);
    if ("replace" in $$new_props) $$invalidate(20, replace = $$new_props.replace);
    if ("classes" in $$new_props) $$invalidate(1, classes = $$new_props.classes);
    if ("basicClasses" in $$new_props) $$invalidate(21, basicClasses = $$new_props.basicClasses);
    if ("outlinedClasses" in $$new_props) $$invalidate(22, outlinedClasses = $$new_props.outlinedClasses);
    if ("textClasses" in $$new_props) $$invalidate(23, textClasses = $$new_props.textClasses);
    if ("iconClasses" in $$new_props) $$invalidate(24, iconClasses = $$new_props.iconClasses);
    if ("fabClasses" in $$new_props) $$invalidate(25, fabClasses = $$new_props.fabClasses);
    if ("smallClasses" in $$new_props) $$invalidate(26, smallClasses = $$new_props.smallClasses);
    if ("disabledClasses" in $$new_props) $$invalidate(27, disabledClasses = $$new_props.disabledClasses);
    if ("elevationClasses" in $$new_props) $$invalidate(28, elevationClasses = $$new_props.elevationClasses);
    if ("$$scope" in $$new_props) $$invalidate(38, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    Icon,
    utils,
    ClassBuilder,
    filterProps,
    createRipple: r,
    value,
    outlined,
    text,
    block,
    disabled,
    icon,
    small,
    light,
    dark,
    flat,
    iconClass,
    color,
    href,
    fab,
    remove,
    add,
    replace,
    classesDefault: classesDefault$2,
    basicDefault,
    outlinedDefault,
    textDefault,
    iconDefault,
    fabDefault,
    smallDefault,
    disabledDefault,
    elevationDefault,
    classes,
    basicClasses,
    outlinedClasses,
    textClasses,
    iconClasses,
    fabClasses,
    smallClasses,
    disabledClasses,
    elevationClasses,
    basic,
    elevation,
    Classes,
    iClasses,
    shade,
    bg,
    border,
    txt,
    cb,
    iconCb,
    ripple,
    props,
    normal,
    lighter
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(50, $$props = assign(assign({}, $$props), $$new_props));
    if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
    if ("outlined" in $$props) $$invalidate(10, outlined = $$new_props.outlined);
    if ("text" in $$props) $$invalidate(11, text = $$new_props.text);
    if ("block" in $$props) $$invalidate(12, block = $$new_props.block);
    if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    if ("small" in $$props) $$invalidate(4, small = $$new_props.small);
    if ("light" in $$props) $$invalidate(13, light = $$new_props.light);
    if ("dark" in $$props) $$invalidate(14, dark = $$new_props.dark);
    if ("flat" in $$props) $$invalidate(15, flat = $$new_props.flat);
    if ("iconClass" in $$props) $$invalidate(16, iconClass = $$new_props.iconClass);
    if ("color" in $$props) $$invalidate(17, color = $$new_props.color);
    if ("href" in $$props) $$invalidate(5, href = $$new_props.href);
    if ("fab" in $$props) $$invalidate(9, fab = $$new_props.fab);
    if ("remove" in $$props) $$invalidate(18, remove = $$new_props.remove);
    if ("add" in $$props) $$invalidate(19, add = $$new_props.add);
    if ("replace" in $$props) $$invalidate(20, replace = $$new_props.replace);
    if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    if ("basicClasses" in $$props) $$invalidate(21, basicClasses = $$new_props.basicClasses);
    if ("outlinedClasses" in $$props) $$invalidate(22, outlinedClasses = $$new_props.outlinedClasses);
    if ("textClasses" in $$props) $$invalidate(23, textClasses = $$new_props.textClasses);
    if ("iconClasses" in $$props) $$invalidate(24, iconClasses = $$new_props.iconClasses);
    if ("fabClasses" in $$props) $$invalidate(25, fabClasses = $$new_props.fabClasses);
    if ("smallClasses" in $$props) $$invalidate(26, smallClasses = $$new_props.smallClasses);
    if ("disabledClasses" in $$props) $$invalidate(27, disabledClasses = $$new_props.disabledClasses);
    if ("elevationClasses" in $$props) $$invalidate(28, elevationClasses = $$new_props.elevationClasses);
    if ("Classes" in $$props) Classes = $$new_props.Classes;
    if ("iClasses" in $$props) $$invalidate(6, iClasses = $$new_props.iClasses);
    if ("shade" in $$props) $$invalidate(39, shade = $$new_props.shade);
    if ("iconCb" in $$props) $$invalidate(40, iconCb = $$new_props.iconCb);
    if ("normal" in $$props) $$invalidate(41, normal = $$new_props.normal);
    if ("lighter" in $$props) $$invalidate(42, lighter = $$new_props.lighter);
  };

  let normal;
  let lighter;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] &
    /*light, dark*/
    24576 | $$self.$$.dirty[1] &
    /*shade*/
    256) {
       {
        $$invalidate(39, shade = light ? 200 : 0);
        $$invalidate(39, shade = dark ? -400 : shade);
      }
    }

    if ($$self.$$.dirty[1] &
    /*shade*/
    256) {
       $$invalidate(41, normal = 500 - shade);
    }

    if ($$self.$$.dirty[1] &
    /*shade*/
    256) {
       $$invalidate(42, lighter = 400 - shade);
    }

     $$invalidate(1, classes = cb.flush().add(basicClasses, basic, basicDefault).add(`${bg(normal)} hover:${bg(lighter)}`, basic).add(elevationClasses, elevation, elevationDefault).add(outlinedClasses, outlined, outlinedDefault).add(`${border(lighter)} ${txt(normal)} hover:${bg("trans")} dark-hover:${bg("transDark")}`, outlined).add(`${txt(lighter)}`, text).add(textClasses, text, textDefault).add(iconClasses, icon, iconDefault).remove("py-2", icon).remove(txt(lighter), fab).add(disabledClasses, disabled, disabledDefault).add(smallClasses, small, smallDefault).add("flex items-center justify-center h-8 w-8", small && icon).add("border-solid", outlined).add("rounded-full", icon).add("w-full", block).add("rounded", basic || outlined || text).add("button", !icon).add(fabClasses, fab, fabDefault).add(`hover:${bg("transLight")}`, fab).add($$props.class).remove(remove).replace(replace).add(add).get());

    if ($$self.$$.dirty[0] &
    /*fab, iconClass*/
    66048 | $$self.$$.dirty[1] &
    /*iconCb*/
    512) {
       if (iconCb) {
        $$invalidate(6, iClasses = iconCb.flush().add(txt(), fab && !iconClass).get());
      }
    }
  };

  $$props = exclude_internal_props($$props);
  return [value, classes, disabled, icon, small, href, iClasses, ripple, props, fab, outlined, text, block, light, dark, flat, iconClass, color, remove, add, replace, basicClasses, outlinedClasses, textClasses, iconClasses, fabClasses, smallClasses, disabledClasses, elevationClasses, $$slots, click_handler, mouseover_handler, _handler, click_handler_1, mouseover_handler_1, _handler_1, click_handler_2, click_handler_3, $$scope];
}

class Button extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {
      value: 0,
      outlined: 10,
      text: 11,
      block: 12,
      disabled: 2,
      icon: 3,
      small: 4,
      light: 13,
      dark: 14,
      flat: 15,
      iconClass: 16,
      color: 17,
      href: 5,
      fab: 9,
      remove: 18,
      add: 19,
      replace: 20,
      classes: 1,
      basicClasses: 21,
      outlinedClasses: 22,
      textClasses: 23,
      iconClasses: 24,
      fabClasses: 25,
      smallClasses: 26,
      disabledClasses: 27,
      elevationClasses: 28
    }, [-1, -1]);
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Button",
      options,
      id: create_fragment$6.name
    });
  }

  get value() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set value(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get outlined() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set outlined(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get text() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set text(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get block() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set block(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get disabled() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set disabled(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get icon() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set icon(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get small() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set small(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get light() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set light(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get dark() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set dark(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get flat() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set flat(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get iconClass() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set iconClass(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get href() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set href(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get fab() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set fab(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get remove() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set remove(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get add() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set add(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get replace() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set replace(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get basicClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set basicClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get outlinedClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set outlinedClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get textClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set textClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get iconClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set iconClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get fabClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set fabClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get smallClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set smallClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get disabledClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set disabledClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get elevationClasses() {
    throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set elevationClasses(value) {
    throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Util/Scrim.svelte generated by Svelte v3.24.0 */
const file$7 = "src/components/Util/Scrim.svelte";

function create_fragment$7(ctx) {
  let div;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  const block = {
    c: function create() {
      div = element("div");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      children(div).forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "bg-black fixed top-0 left-0 z-10 w-full h-full");
      set_style(div, "opacity",
      /*opacity*/
      ctx[0]);
      add_location(div, file$7, 9, 0, 262);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      current = true;

      if (!mounted) {
        dispose = listen_dev(div, "click",
        /*click_handler*/
        ctx[3], false, false, false);
        mounted = true;
      }
    },
    p: function update(ctx, [dirty]) {
      if (!current || dirty &
      /*opacity*/
      1) {
        set_style(div, "opacity",
        /*opacity*/
        ctx[0]);
      }
    },
    i: function intro(local) {
      if (current) return;
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        if (!div_intro) div_intro = create_in_transition(div, fade,
        /*inProps*/
        ctx[1]);
        div_intro.start();
      });
      current = true;
    },
    o: function outro(local) {
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div, fade,
      /*outProps*/
      ctx[2]);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      dispose();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$7.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$7($$self, $$props, $$invalidate) {
  let {
    opacity = 0.5
  } = $$props;
  let {
    inProps = {
      duration: 200,
      easing: quadIn
    }
  } = $$props;
  let {
    outProps = {
      duration: 200,
      easing: quadOut
    }
  } = $$props;
  const writable_props = ["opacity", "inProps", "outProps"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Scrim> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Scrim", $$slots, []);

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = $$props => {
    if ("opacity" in $$props) $$invalidate(0, opacity = $$props.opacity);
    if ("inProps" in $$props) $$invalidate(1, inProps = $$props.inProps);
    if ("outProps" in $$props) $$invalidate(2, outProps = $$props.outProps);
  };

  $$self.$capture_state = () => ({
    fade,
    quadOut,
    quadIn,
    opacity,
    inProps,
    outProps
  });

  $$self.$inject_state = $$props => {
    if ("opacity" in $$props) $$invalidate(0, opacity = $$props.opacity);
    if ("inProps" in $$props) $$invalidate(1, inProps = $$props.inProps);
    if ("outProps" in $$props) $$invalidate(2, outProps = $$props.outProps);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [opacity, inProps, outProps, click_handler];
}

class Scrim extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
      opacity: 0,
      inProps: 1,
      outProps: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Scrim",
      options,
      id: create_fragment$7.name
    });
  }

  get opacity() {
    throw new Error("<Scrim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set opacity(value) {
    throw new Error("<Scrim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get inProps() {
    throw new Error("<Scrim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set inProps(value) {
    throw new Error("<Scrim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get outProps() {
    throw new Error("<Scrim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set outProps(value) {
    throw new Error("<Scrim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Util/Spacer.svelte generated by Svelte v3.24.0 */
const file$8 = "src/components/Util/Spacer.svelte";

function create_fragment$8(ctx) {
  let div;
  const block = {
    c: function create() {
      div = element("div");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      children(div).forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "flex-grow");
      add_location(div, file$8, 0, 0, 0);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$8.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$8($$self, $$props) {
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Spacer> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Spacer", $$slots, []);
  return [];
}

class Spacer extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Spacer",
      options,
      id: create_fragment$8.name
    });
  }

}

const Scrim$1 = Scrim;
const Spacer$1 = Spacer;

/* src/components/List/ListItem.svelte generated by Svelte v3.24.0 */
const file$9 = "src/components/List/ListItem.svelte"; // (59:2) {#if icon}

function create_if_block_1$3(ctx) {
  let icon_1;
  let current;
  icon_1 = new Icon({
    props: {
      class: "pr-6",
      small:
      /*dense*/
      ctx[3],
      $$slots: {
        default: [create_default_slot$3]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(icon_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_1_changes = {};
      if (dirty &
      /*dense*/
      8) icon_1_changes.small =
      /*dense*/
      ctx[3];

      if (dirty &
      /*$$scope, icon*/
      4194305) {
        icon_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon_1.$set(icon_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1$3.name,
    type: "if",
    source: "(59:2) {#if icon}",
    ctx
  });
  return block;
} // (60:4) <Icon       class="pr-6"       small={dense}     >


function create_default_slot$3(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*icon*/
      ctx[0]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*icon*/
      ctx[0]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*icon*/
      1) set_data_dev(t,
      /*icon*/
      ctx[0]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$3.name,
    type: "slot",
    source: "(60:4) <Icon       class=\\\"pr-6\\\"       small={dense}     >",
    ctx
  });
  return block;
} // (70:12) {text}


function fallback_block$2(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*text*/
      ctx[1]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*text*/
      ctx[1]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*text*/
      2) set_data_dev(t,
      /*text*/
      ctx[1]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block$2.name,
    type: "fallback",
    source: "(70:12) {text}",
    ctx
  });
  return block;
} // (72:4) {#if subheading}


function create_if_block$3(ctx) {
  let div;
  let t;
  const block = {
    c: function create() {
      div = element("div");
      t = text(
      /*subheading*/
      ctx[2]);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      t = claim_text(div_nodes,
      /*subheading*/
      ctx[2]);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class",
      /*subheadingClasses*/
      ctx[5]);
      add_location(div, file$9, 72, 6, 1808);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, t);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*subheading*/
      4) set_data_dev(t,
      /*subheading*/
      ctx[2]);

      if (dirty &
      /*subheadingClasses*/
      32) {
        attr_dev(div, "class",
        /*subheadingClasses*/
        ctx[5]);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$3.name,
    type: "if",
    source: "(72:4) {#if subheading}",
    ctx
  });
  return block;
}

function create_fragment$9(ctx) {
  let li;
  let t0;
  let div1;
  let div0;
  let div0_class_value;
  let t1;
  let ripple_action;
  let current;
  let mounted;
  let dispose;
  let if_block0 =
  /*icon*/
  ctx[0] && create_if_block_1$3(ctx);
  const default_slot_template =
  /*$$slots*/
  ctx[20].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[22], null);
  const default_slot_or_fallback = default_slot || fallback_block$2(ctx);
  let if_block1 =
  /*subheading*/
  ctx[2] && create_if_block$3(ctx);
  const block = {
    c: function create() {
      li = element("li");
      if (if_block0) if_block0.c();
      t0 = space();
      div1 = element("div");
      div0 = element("div");
      if (default_slot_or_fallback) default_slot_or_fallback.c();
      t1 = space();
      if (if_block1) if_block1.c();
      this.h();
    },
    l: function claim(nodes) {
      li = claim_element(nodes, "LI", {
        class: true,
        tabindex: true
      });
      var li_nodes = children(li);
      if (if_block0) if_block0.l(li_nodes);
      t0 = claim_space(li_nodes);
      div1 = claim_element(li_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      if (default_slot_or_fallback) default_slot_or_fallback.l(div0_nodes);
      div0_nodes.forEach(detach_dev);
      t1 = claim_space(div1_nodes);
      if (if_block1) if_block1.l(div1_nodes);
      div1_nodes.forEach(detach_dev);
      li_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", div0_class_value =
      /*$$props*/
      ctx[9].class);
      add_location(div0, file$9, 68, 4, 1716);
      attr_dev(div1, "class", "flex flex-col p-0");
      add_location(div1, file$9, 67, 2, 1680);
      attr_dev(li, "class",
      /*c*/
      ctx[6]);
      attr_dev(li, "tabindex",
      /*tabindex*/
      ctx[4]);
      add_location(li, file$9, 51, 0, 1479);
    },
    m: function mount(target, anchor) {
      insert_dev(target, li, anchor);
      if (if_block0) if_block0.m(li, null);
      append_dev(li, t0);
      append_dev(li, div1);
      append_dev(div1, div0);

      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(div0, null);
      }

      append_dev(div1, t1);
      if (if_block1) if_block1.m(div1, null);
      current = true;

      if (!mounted) {
        dispose = [action_destroyer(ripple_action =
        /*ripple*/
        ctx[7].call(null, li)), listen_dev(li, "keypress",
        /*change*/
        ctx[8], false, false, false), listen_dev(li, "click",
        /*change*/
        ctx[8], false, false, false), listen_dev(li, "click",
        /*click_handler*/
        ctx[21], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, [dirty]) {
      if (
      /*icon*/
      ctx[0]) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty &
          /*icon*/
          1) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$3(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(li, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        4194304) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[22], dirty, null, null);
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && dirty &
        /*text*/
        2) {
          default_slot_or_fallback.p(ctx, dirty);
        }
      }

      if (!current || dirty &
      /*$$props*/
      512 && div0_class_value !== (div0_class_value =
      /*$$props*/
      ctx[9].class)) {
        attr_dev(div0, "class", div0_class_value);
      }

      if (
      /*subheading*/
      ctx[2]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block$3(ctx);
          if_block1.c();
          if_block1.m(div1, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }

      if (!current || dirty &
      /*c*/
      64) {
        attr_dev(li, "class",
        /*c*/
        ctx[6]);
      }

      if (!current || dirty &
      /*tabindex*/
      16) {
        attr_dev(li, "tabindex",
        /*tabindex*/
        ctx[4]);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block0);
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(li);
      if (if_block0) if_block0.d();
      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
      if (if_block1) if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$9.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$3 = "focus:bg-gray-50 dark-focus:bg-gray-700 hover:bg-gray-transDark relative overflow-hidden duration-100 p-4 cursor-pointer text-gray-700 dark:text-gray-100 flex items-center z-10";
const selectedClassesDefault = "bg-gray-200 dark:bg-primary-transLight";
const subheadingClassesDefault = "text-gray-600 p-0 text-sm";

function instance$9($$self, $$props, $$invalidate) {
  let {
    icon = ""
  } = $$props;
  let {
    id = ""
  } = $$props;
  let {
    value = ""
  } = $$props;
  let {
    text = ""
  } = $$props;
  let {
    subheading = ""
  } = $$props;
  let {
    disabled = false
  } = $$props;
  let {
    dense = false
  } = $$props;
  let {
    selected = false
  } = $$props;
  let {
    tabindex = null
  } = $$props;
  let {
    selectedClasses = selectedClassesDefault
  } = $$props;
  let {
    subheadingClasses = subheadingClassesDefault
  } = $$props;
  let {
    to = ""
  } = $$props;
  const item = null;
  const items = [];
  const level = null;
  const ripple = r();
  const dispatch = createEventDispatcher();

  function change() {
    if (disabled) return;
    $$invalidate(10, value = id);
    dispatch("change", id, to);
  }

  let {
    classes = classesDefault$3
  } = $$props;
  const cb = new ClassBuilder(classes, classesDefault$3);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("ListItem", $$slots, ['default']);

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = $$new_props => {
    $$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("icon" in $$new_props) $$invalidate(0, icon = $$new_props.icon);
    if ("id" in $$new_props) $$invalidate(11, id = $$new_props.id);
    if ("value" in $$new_props) $$invalidate(10, value = $$new_props.value);
    if ("text" in $$new_props) $$invalidate(1, text = $$new_props.text);
    if ("subheading" in $$new_props) $$invalidate(2, subheading = $$new_props.subheading);
    if ("disabled" in $$new_props) $$invalidate(12, disabled = $$new_props.disabled);
    if ("dense" in $$new_props) $$invalidate(3, dense = $$new_props.dense);
    if ("selected" in $$new_props) $$invalidate(13, selected = $$new_props.selected);
    if ("tabindex" in $$new_props) $$invalidate(4, tabindex = $$new_props.tabindex);
    if ("selectedClasses" in $$new_props) $$invalidate(14, selectedClasses = $$new_props.selectedClasses);
    if ("subheadingClasses" in $$new_props) $$invalidate(5, subheadingClasses = $$new_props.subheadingClasses);
    if ("to" in $$new_props) $$invalidate(15, to = $$new_props.to);
    if ("classes" in $$new_props) $$invalidate(19, classes = $$new_props.classes);
    if ("$$scope" in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    ClassBuilder,
    createEventDispatcher,
    Icon,
    createRipple: r,
    classesDefault: classesDefault$3,
    selectedClassesDefault,
    subheadingClassesDefault,
    icon,
    id,
    value,
    text,
    subheading,
    disabled,
    dense,
    selected,
    tabindex,
    selectedClasses,
    subheadingClasses,
    to,
    item,
    items,
    level,
    ripple,
    dispatch,
    change,
    classes,
    cb,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    if ("icon" in $$props) $$invalidate(0, icon = $$new_props.icon);
    if ("id" in $$props) $$invalidate(11, id = $$new_props.id);
    if ("value" in $$props) $$invalidate(10, value = $$new_props.value);
    if ("text" in $$props) $$invalidate(1, text = $$new_props.text);
    if ("subheading" in $$props) $$invalidate(2, subheading = $$new_props.subheading);
    if ("disabled" in $$props) $$invalidate(12, disabled = $$new_props.disabled);
    if ("dense" in $$props) $$invalidate(3, dense = $$new_props.dense);
    if ("selected" in $$props) $$invalidate(13, selected = $$new_props.selected);
    if ("tabindex" in $$props) $$invalidate(4, tabindex = $$new_props.tabindex);
    if ("selectedClasses" in $$props) $$invalidate(14, selectedClasses = $$new_props.selectedClasses);
    if ("subheadingClasses" in $$props) $$invalidate(5, subheadingClasses = $$new_props.subheadingClasses);
    if ("to" in $$props) $$invalidate(15, to = $$new_props.to);
    if ("classes" in $$props) $$invalidate(19, classes = $$new_props.classes);
    if ("c" in $$props) $$invalidate(6, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
     $$invalidate(6, c = cb.flush().add(selectedClasses, selected, selectedClassesDefault).add("py-2", dense).add("text-gray-600", disabled).add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [icon, text, subheading, dense, tabindex, subheadingClasses, c, ripple, change, $$props, value, id, disabled, selected, selectedClasses, to, item, items, level, classes, $$slots, click_handler, $$scope];
}

class ListItem extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {
      icon: 0,
      id: 11,
      value: 10,
      text: 1,
      subheading: 2,
      disabled: 12,
      dense: 3,
      selected: 13,
      tabindex: 4,
      selectedClasses: 14,
      subheadingClasses: 5,
      to: 15,
      item: 16,
      items: 17,
      level: 18,
      classes: 19
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "ListItem",
      options,
      id: create_fragment$9.name
    });
  }

  get icon() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set icon(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get id() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set id(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get value() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set value(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get text() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set text(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get subheading() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set subheading(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get disabled() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set disabled(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get dense() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set dense(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get selected() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set selected(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get tabindex() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set tabindex(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get selectedClasses() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set selectedClasses(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get subheadingClasses() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set subheadingClasses(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get to() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set to(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get item() {
    return this.$$.ctx[16];
  }

  set item(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get items() {
    return this.$$.ctx[17];
  }

  set items(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get level() {
    return this.$$.ctx[18];
  }

  set level(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/List/List.svelte generated by Svelte v3.24.0 */
const file$a = "src/components/List/List.svelte";

const get_item_slot_changes_1 = dirty => ({
  item: dirty &
  /*items*/
  2,
  dense: dirty &
  /*dense*/
  4,
  value: dirty &
  /*value*/
  1
});

const get_item_slot_context_1 = ctx => ({
  item:
  /*item*/
  ctx[6],
  dense:
  /*dense*/
  ctx[2],
  value:
  /*value*/
  ctx[0]
});

const get_item_slot_changes$1 = dirty => ({
  item: dirty &
  /*items*/
  2,
  dense: dirty &
  /*dense*/
  4,
  value: dirty &
  /*value*/
  1
});

const get_item_slot_context$1 = ctx => ({
  item:
  /*item*/
  ctx[6],
  dense:
  /*dense*/
  ctx[2],
  value:
  /*value*/
  ctx[0]
});

function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[6] = list[i];
  child_ctx[22] = i;
  return child_ctx;
} // (55:4) {:else}


function create_else_block$2(ctx) {
  let current;
  const item_slot_template =
  /*$$slots*/
  ctx[12].item;
  const item_slot = create_slot(item_slot_template, ctx,
  /*$$scope*/
  ctx[18], get_item_slot_context_1);
  const item_slot_or_fallback = item_slot || fallback_block_1$1(ctx);
  const block = {
    c: function create() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    l: function claim(nodes) {
      if (item_slot_or_fallback) item_slot_or_fallback.l(nodes);
    },
    m: function mount(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (item_slot) {
        if (item_slot.p && dirty &
        /*$$scope, items, dense, value*/
        262151) {
          update_slot(item_slot, item_slot_template, ctx,
          /*$$scope*/
          ctx[18], dirty, get_item_slot_changes_1, get_item_slot_context_1);
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && dirty &
        /*items, value, dense*/
        7) {
          item_slot_or_fallback.p(ctx, dirty);
        }
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block$2.name,
    type: "else",
    source: "(55:4) {:else}",
    ctx
  });
  return block;
} // (47:4) {#if item.to !== undefined}


function create_if_block$4(ctx) {
  let current;
  const item_slot_template =
  /*$$slots*/
  ctx[12].item;
  const item_slot = create_slot(item_slot_template, ctx,
  /*$$scope*/
  ctx[18], get_item_slot_context$1);
  const item_slot_or_fallback = item_slot || fallback_block$3(ctx);
  const block = {
    c: function create() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    l: function claim(nodes) {
      if (item_slot_or_fallback) item_slot_or_fallback.l(nodes);
    },
    m: function mount(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (item_slot) {
        if (item_slot.p && dirty &
        /*$$scope, items, dense, value*/
        262151) {
          update_slot(item_slot, item_slot_template, ctx,
          /*$$scope*/
          ctx[18], dirty, get_item_slot_changes$1, get_item_slot_context$1);
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && dirty &
        /*items, dense, value*/
        7) {
          item_slot_or_fallback.p(ctx, dirty);
        }
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$4.name,
    type: "if",
    source: "(47:4) {#if item.to !== undefined}",
    ctx
  });
  return block;
} // (57:8) <ListItem           bind:value           {selectedClasses}           {itemClasses}           {...item}           tabindex={i + 1}           id={id(item)}           selected={value === id(item)}           {dense}           on:change           on:click>


function create_default_slot_1$2(ctx) {
  let t_value = getText(
  /*item*/
  ctx[6]) + "";
  let t;
  const block = {
    c: function create() {
      t = text(t_value);
    },
    l: function claim(nodes) {
      t = claim_text(nodes, t_value);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*items*/
      2 && t_value !== (t_value = getText(
      /*item*/
      ctx[6]) + "")) set_data_dev(t, t_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_1$2.name,
    type: "slot",
    source: "(57:8) <ListItem           bind:value           {selectedClasses}           {itemClasses}           {...item}           tabindex={i + 1}           id={id(item)}           selected={value === id(item)}           {dense}           on:change           on:click>",
    ctx
  });
  return block;
} // (56:47)          


function fallback_block_1$1(ctx) {
  let listitem;
  let updating_value;
  let t;
  let current;
  const listitem_spread_levels = [{
    selectedClasses:
    /*selectedClasses*/
    ctx[4]
  }, {
    itemClasses:
    /*itemClasses*/
    ctx[5]
  },
  /*item*/
  ctx[6], {
    tabindex:
    /*i*/
    ctx[22] + 1
  }, {
    id: id(
    /*item*/
    ctx[6])
  }, {
    selected:
    /*value*/
    ctx[0] === id(
    /*item*/
    ctx[6])
  }, {
    dense:
    /*dense*/
    ctx[2]
  }];

  function listitem_value_binding_1(value) {
    /*listitem_value_binding_1*/
    ctx[15].call(null, value);
  }

  let listitem_props = {
    $$slots: {
      default: [create_default_slot_1$2]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < listitem_spread_levels.length; i += 1) {
    listitem_props = assign(listitem_props, listitem_spread_levels[i]);
  }

  if (
  /*value*/
  ctx[0] !== void 0) {
    listitem_props.value =
    /*value*/
    ctx[0];
  }

  listitem = new ListItem({
    props: listitem_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(listitem, "value", listitem_value_binding_1));
  listitem.$on("change",
  /*change_handler_1*/
  ctx[16]);
  listitem.$on("click",
  /*click_handler*/
  ctx[17]);
  const block = {
    c: function create() {
      create_component(listitem.$$.fragment);
      t = space();
    },
    l: function claim(nodes) {
      claim_component(listitem.$$.fragment, nodes);
      t = claim_space(nodes);
    },
    m: function mount(target, anchor) {
      mount_component(listitem, target, anchor);
      insert_dev(target, t, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const listitem_changes = dirty &
      /*selectedClasses, itemClasses, items, id, value, dense*/
      55 ? get_spread_update(listitem_spread_levels, [dirty &
      /*selectedClasses*/
      16 && {
        selectedClasses:
        /*selectedClasses*/
        ctx[4]
      }, dirty &
      /*itemClasses*/
      32 && {
        itemClasses:
        /*itemClasses*/
        ctx[5]
      }, dirty &
      /*items*/
      2 && get_spread_object(
      /*item*/
      ctx[6]), listitem_spread_levels[3], dirty &
      /*id, items*/
      2 && {
        id: id(
        /*item*/
        ctx[6])
      }, dirty &
      /*value, id, items*/
      3 && {
        selected:
        /*value*/
        ctx[0] === id(
        /*item*/
        ctx[6])
      }, dirty &
      /*dense*/
      4 && {
        dense:
        /*dense*/
        ctx[2]
      }]) : {};

      if (dirty &
      /*$$scope, items*/
      262146) {
        listitem_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_value && dirty &
      /*value*/
      1) {
        updating_value = true;
        listitem_changes.value =
        /*value*/
        ctx[0];
        add_flush_callback(() => updating_value = false);
      }

      listitem.$set(listitem_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(listitem.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(listitem.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(listitem, detaching);
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block_1$1.name,
    type: "fallback",
    source: "(56:47)          ",
    ctx
  });
  return block;
} // (50:10) <ListItem bind:value {...item} id={id(item)} {dense} on:change>


function create_default_slot$4(ctx) {
  let t_value =
  /*item*/
  ctx[6].text + "";
  let t;
  const block = {
    c: function create() {
      t = text(t_value);
    },
    l: function claim(nodes) {
      t = claim_text(nodes, t_value);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*items*/
      2 && t_value !== (t_value =
      /*item*/
      ctx[6].text + "")) set_data_dev(t, t_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$4.name,
    type: "slot",
    source: "(50:10) <ListItem bind:value {...item} id={id(item)} {dense} on:change>",
    ctx
  });
  return block;
} // (48:47)          


function fallback_block$3(ctx) {
  let a;
  let listitem;
  let updating_value;
  let a_tabindex_value;
  let a_href_value;
  let t;
  let current;
  const listitem_spread_levels = [
  /*item*/
  ctx[6], {
    id: id(
    /*item*/
    ctx[6])
  }, {
    dense:
    /*dense*/
    ctx[2]
  }];

  function listitem_value_binding(value) {
    /*listitem_value_binding*/
    ctx[13].call(null, value);
  }

  let listitem_props = {
    $$slots: {
      default: [create_default_slot$4]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < listitem_spread_levels.length; i += 1) {
    listitem_props = assign(listitem_props, listitem_spread_levels[i]);
  }

  if (
  /*value*/
  ctx[0] !== void 0) {
    listitem_props.value =
    /*value*/
    ctx[0];
  }

  listitem = new ListItem({
    props: listitem_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(listitem, "value", listitem_value_binding));
  listitem.$on("change",
  /*change_handler*/
  ctx[14]);
  const block = {
    c: function create() {
      a = element("a");
      create_component(listitem.$$.fragment);
      t = space();
      this.h();
    },
    l: function claim(nodes) {
      a = claim_element(nodes, "A", {
        tabindex: true,
        href: true
      });
      var a_nodes = children(a);
      claim_component(listitem.$$.fragment, a_nodes);
      a_nodes.forEach(detach_dev);
      t = claim_space(nodes);
      this.h();
    },
    h: function hydrate() {
      attr_dev(a, "tabindex", a_tabindex_value =
      /*i*/
      ctx[22] + 1);
      attr_dev(a, "href", a_href_value =
      /*item*/
      ctx[6].to);
      add_location(a, file$a, 48, 8, 1154);
    },
    m: function mount(target, anchor) {
      insert_dev(target, a, anchor);
      mount_component(listitem, a, null);
      insert_dev(target, t, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const listitem_changes = dirty &
      /*items, id, dense*/
      6 ? get_spread_update(listitem_spread_levels, [dirty &
      /*items*/
      2 && get_spread_object(
      /*item*/
      ctx[6]), dirty &
      /*id, items*/
      2 && {
        id: id(
        /*item*/
        ctx[6])
      }, dirty &
      /*dense*/
      4 && {
        dense:
        /*dense*/
        ctx[2]
      }]) : {};

      if (dirty &
      /*$$scope, items*/
      262146) {
        listitem_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_value && dirty &
      /*value*/
      1) {
        updating_value = true;
        listitem_changes.value =
        /*value*/
        ctx[0];
        add_flush_callback(() => updating_value = false);
      }

      listitem.$set(listitem_changes);

      if (!current || dirty &
      /*items*/
      2 && a_href_value !== (a_href_value =
      /*item*/
      ctx[6].to)) {
        attr_dev(a, "href", a_href_value);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(listitem.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(listitem.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(a);
      destroy_component(listitem);
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block$3.name,
    type: "fallback",
    source: "(48:47)          ",
    ctx
  });
  return block;
} // (46:2) {#each items as item, i}


function create_each_block$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$4, create_else_block$2];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*item*/
    ctx[6].to !== undefined) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block$1.name,
    type: "each",
    source: "(46:2) {#each items as item, i}",
    ctx
  });
  return block;
}

function create_fragment$a(ctx) {
  let ul;
  let current;
  let each_value =
  /*items*/
  ctx[1];
  validate_each_argument(each_value);
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }

  const out = i => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });

  const block = {
    c: function create() {
      ul = element("ul");

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      this.h();
    },
    l: function claim(nodes) {
      ul = claim_element(nodes, "UL", {
        class: true
      });
      var ul_nodes = children(ul);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(ul_nodes);
      }

      ul_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(ul, "class",
      /*c*/
      ctx[7]);
      toggle_class(ul, "rounded-t-none",
      /*select*/
      ctx[3]);
      add_location(ul, file$a, 44, 0, 994);
    },
    m: function mount(target, anchor) {
      insert_dev(target, ul, anchor);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }

      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*items, id, dense, value, $$scope, undefined, selectedClasses, itemClasses, getText*/
      262199) {
        each_value =
        /*items*/
        ctx[1];
        validate_each_argument(each_value);
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(ul, null);
          }
        }

        group_outros();

        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }

        check_outros();
      }

      if (!current || dirty &
      /*c*/
      128) {
        attr_dev(ul, "class",
        /*c*/
        ctx[7]);
      }

      if (dirty &
      /*c, select*/
      136) {
        toggle_class(ul, "rounded-t-none",
        /*select*/
        ctx[3]);
      }
    },
    i: function intro(local) {
      if (current) return;

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      current = true;
    },
    o: function outro(local) {
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(ul);
      destroy_each(each_blocks, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$a.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$4 = "py-2 rounded";

function id(i) {
  if (i.id !== undefined) return i.id;
  if (i.value !== undefined) return i.value;
  if (i.to !== undefined) return i.to;
  if (i.text !== undefined) return i.text;
  return i;
}

function getText(i) {
  if (i.text !== undefined) return i.text;
  if (i.value !== undefined) return i.value;
  return i;
}

function instance$a($$self, $$props, $$invalidate) {
  let {
    items = []
  } = $$props;
  let {
    value = ""
  } = $$props;
  let {
    dense = false
  } = $$props;
  let {
    select = false
  } = $$props;
  const level = null;
  const text = "";
  const item = {};
  const to = null;

  const selectedClasses = i => i;

  const itemClasses = i => i;

  let {
    classes = classesDefault$4
  } = $$props;
  const cb = new ClassBuilder($$props.class);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("List", $$slots, ['item']);

  function listitem_value_binding(value$1) {
    value = value$1;
    $$invalidate(0, value);
  }

  function change_handler(event) {
    bubble($$self, event);
  }

  function listitem_value_binding_1(value$1) {
    value = value$1;
    $$invalidate(0, value);
  }

  function change_handler_1(event) {
    bubble($$self, event);
  }

  function click_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = $$new_props => {
    $$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("items" in $$new_props) $$invalidate(1, items = $$new_props.items);
    if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
    if ("dense" in $$new_props) $$invalidate(2, dense = $$new_props.dense);
    if ("select" in $$new_props) $$invalidate(3, select = $$new_props.select);
    if ("classes" in $$new_props) $$invalidate(11, classes = $$new_props.classes);
    if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    ClassBuilder,
    ListItem,
    items,
    value,
    dense,
    select,
    level,
    text,
    item,
    to,
    selectedClasses,
    itemClasses,
    classesDefault: classesDefault$4,
    classes,
    id,
    getText,
    cb,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    if ("items" in $$props) $$invalidate(1, items = $$new_props.items);
    if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
    if ("dense" in $$props) $$invalidate(2, dense = $$new_props.dense);
    if ("select" in $$props) $$invalidate(3, select = $$new_props.select);
    if ("classes" in $$props) $$invalidate(11, classes = $$new_props.classes);
    if ("c" in $$props) $$invalidate(7, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
     $$invalidate(7, c = cb.flush().add(classes, true, classesDefault$4).add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [value, items, dense, select, selectedClasses, itemClasses, item, c, level, text, to, classes, $$slots, listitem_value_binding, change_handler, listitem_value_binding_1, change_handler_1, click_handler, $$scope];
}

class List extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
      items: 1,
      value: 0,
      dense: 2,
      select: 3,
      level: 8,
      text: 9,
      item: 6,
      to: 10,
      selectedClasses: 4,
      itemClasses: 5,
      classes: 11
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "List",
      options,
      id: create_fragment$a.name
    });
  }

  get items() {
    throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set items(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get value() {
    throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set value(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get dense() {
    throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set dense(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get select() {
    throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set select(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get level() {
    return this.$$.ctx[8];
  }

  set level(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get text() {
    return this.$$.ctx[9];
  }

  set text(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get item() {
    return this.$$.ctx[6];
  }

  set item(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get to() {
    return this.$$.ctx[10];
  }

  set to(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get selectedClasses() {
    return this.$$.ctx[4];
  }

  set selectedClasses(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get itemClasses() {
    return this.$$.ctx[5];
  }

  set itemClasses(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

function defaultCalc(width) {
  if (width > 1279) {
    return "xl";
  }

  if (width > 1023) {
    return "lg";
  }

  if (width > 767) {
    return "md";
  }

  return "sm";
}

function breakpoint(calcBreakpoint = defaultCalc) {
  if (typeof window === "undefined") return writable("sm");
  const store = writable(calcBreakpoint(window.innerWidth));

  const onResize = ({
    target
  }) => store.set(calcBreakpoint(target.innerWidth));

  window.addEventListener("resize", onResize);
  onDestroy(() => window.removeEventListener("resize", onResize));
  return {
    subscribe: store.subscribe
  };
}

/* src/components/NavigationDrawer/NavigationDrawer.svelte generated by Svelte v3.24.0 */
const file$b = "src/components/NavigationDrawer/NavigationDrawer.svelte";

function add_css$2() {
  var style = element("style");
  style.id = "svelte-6qcjcu-style";
  style.textContent = ".drawer.svelte-6qcjcu{min-width:250px}aside.svelte-6qcjcu{height:100vh}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2aWdhdGlvbkRyYXdlci5zdmVsdGUiLCJzb3VyY2VzIjpbIk5hdmlnYXRpb25EcmF3ZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGZseSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuICBpbXBvcnQgeyBxdWFkSW4gfSBmcm9tIFwic3ZlbHRlL2Vhc2luZ1wiO1xuICBpbXBvcnQgeyBTY3JpbSB9IGZyb20gXCIuLi9VdGlsXCI7XG4gIGltcG9ydCBicmVha3BvaW50cyBmcm9tIFwiLi4vLi4vYnJlYWtwb2ludHNcIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBicCA9IGJyZWFrcG9pbnRzKCk7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcIiBmaXhlZCB0b3AtMCBtZDptdC0xNiB3LWF1dG8gZHJhd2VyIG92ZXJmbG93LWhpZGRlbiBoLWZ1bGxcIjtcbiAgY29uc3QgbmF2Q2xhc3Nlc0RlZmF1bHQgPSBgaC1mdWxsIHctZnVsbCBkYXJrOmJnLWdyYXktOTAwIGRhcms6dGV4dC1ncmF5LTIwMCBhYnNvbHV0ZSBmbGV4IHctYXV0byB6LTIwIGRyYXdlclxuICAgIHBvaW50ZXItZXZlbnRzLWF1dG8gb3ZlcmZsb3cteS1hdXRvYDtcblxuICBleHBvcnQgbGV0IHJpZ2h0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcGVyc2lzdGVudCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGVsZXZhdGlvbiA9IHRydWU7XG4gIGV4cG9ydCBsZXQgc2hvdyA9IHRydWU7XG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IG5hdkNsYXNzZXMgPSBuYXZDbGFzc2VzRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBib3JkZXJDbGFzc2VzID0gYGJvcmRlci1ncmF5LTYwMCAke3JpZ2h0ID8gXCJib3JkZXItbFwiIDogXCJib3JkZXItclwifWA7XG5cblxuXG5cbiAgZXhwb3J0IGxldCB0cmFuc2l0aW9uUHJvcHMgPSB7XG4gICAgZHVyYXRpb246IDIwMCxcbiAgICB4OiAtMzAwLFxuICAgIGVhc2luZzogcXVhZEluLFxuICAgIG9wYWNpdHk6IDEsXG4gIH07XG5cbiAgJDogdHJhbnNpdGlvblByb3BzLnggPSByaWdodCA/IDMwMCA6IC0zMDA7XG5cbiAgLy8gSXMgdGhlIGRyYXdlciBkZWxpYmVyYXRlbHkgaGlkZGVuPyBEb24ndCBsZXQgdGhlICRicCBjaGVjayBtYWtlIGl0IHZpc2libGUgaWYgc28uXG4gIGxldCBoaWRkZW4gPSAhc2hvdztcbiAgJDogaWYgKCFoaWRkZW4pIHBlcnNpc3RlbnQgPSBzaG93ID0gJGJwICE9PSBcInNtXCI7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICBpZiAoJGJwID09PSAnc20nKSBzaG93ID0gZmFsc2U7XG5cbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKGNsYXNzZXMsIHRydWUsIGNsYXNzZXNEZWZhdWx0KVxuICAgIC5hZGQoYm9yZGVyQ2xhc3NlcywgIWVsZXZhdGlvbiAmJiBwZXJzaXN0ZW50KVxuICAgIC5hZGQoJCRwcm9wcy5jbGFzcylcbiAgICAuYWRkKFwicmlnaHQtMFwiLCByaWdodClcbiAgICAuYWRkKFwibGVmdC0wXCIsICFyaWdodClcbiAgICAuYWRkKFwicG9pbnRlci1ldmVudHMtbm9uZVwiLCBwZXJzaXN0ZW50KVxuICAgIC5hZGQoXCJ6LTUwXCIsICFwZXJzaXN0ZW50KVxuICAgIC5hZGQoXCJlbGV2YXRpb24tNFwiLCBlbGV2YXRpb24pXG4gICAgLmFkZChcInotMjBcIiwgcGVyc2lzdGVudClcbiAgICAuZ2V0KCk7XG5cbiAgY29uc3QgbmNiID0gbmV3IENsYXNzQnVpbGRlcihuYXZDbGFzc2VzLCBuYXZDbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogbiA9IG5jYlxuICAgIC5mbHVzaCgpXG4gICAgLmdldCgpO1xuXG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZHJhd2VyIHtcbiAgICBtaW4td2lkdGg6IDI1MHB4O1xuICB9XG5cbiAgYXNpZGUge1xuICAgIGhlaWdodDogMTAwdmg7XG4gIH1cbjwvc3R5bGU+XG5cbnsjaWYgc2hvd31cbiAgPGFzaWRlXG4gICAgY2xhc3M9e2N9XG4gICAgdHJhbnNpdGlvbjpmbHk9e3RyYW5zaXRpb25Qcm9wc31cbiAgPlxuICBcbiAgICB7I2lmICFwZXJzaXN0ZW50fVxuICAgICAgPFNjcmltIG9uOmNsaWNrPXsoKSA9PiBzaG93ID0gZmFsc2V9IC8+XG4gICAgey9pZn1cbiAgICA8bmF2XG4gICAgICByb2xlPVwibmF2aWdhdGlvblwiXG4gICAgICBjbGFzcz17bn1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwidy1mdWxsXCI+XG4gICAgICAgIDxzbG90IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L25hdj5cbiAgPC9hc2lkZT5cbnsvaWZ9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0RFLE9BQU8sY0FBQyxDQUFDLEFBQ1AsU0FBUyxDQUFFLEtBQUssQUFDbEIsQ0FBQyxBQUVELEtBQUssY0FBQyxDQUFDLEFBQ0wsTUFBTSxDQUFFLEtBQUssQUFDZixDQUFDIn0= */";
  append_dev(document.head, style);
} // (73:0) {#if show}


function create_if_block$5(ctx) {
  let aside;
  let t;
  let nav;
  let div;
  let nav_class_value;
  let aside_class_value;
  let aside_transition;
  let current;
  let if_block = !
  /*persistent*/
  ctx[0] && create_if_block_1$4(ctx);
  const default_slot_template =
  /*$$slots*/
  ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[11], null);
  const block = {
    c: function create() {
      aside = element("aside");
      if (if_block) if_block.c();
      t = space();
      nav = element("nav");
      div = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      aside = claim_element(nodes, "ASIDE", {
        class: true
      });
      var aside_nodes = children(aside);
      if (if_block) if_block.l(aside_nodes);
      t = claim_space(aside_nodes);
      nav = claim_element(aside_nodes, "NAV", {
        role: true,
        class: true
      });
      var nav_nodes = children(nav);
      div = claim_element(nav_nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      if (default_slot) default_slot.l(div_nodes);
      div_nodes.forEach(detach_dev);
      nav_nodes.forEach(detach_dev);
      aside_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "w-full");
      add_location(div, file$b, 85, 6, 1966);
      attr_dev(nav, "role", "navigation");
      attr_dev(nav, "class", nav_class_value = "" + (null_to_empty(
      /*n*/
      ctx[4]) + " svelte-6qcjcu"));
      add_location(nav, file$b, 81, 4, 1909);
      attr_dev(aside, "class", aside_class_value = "" + (null_to_empty(
      /*c*/
      ctx[3]) + " svelte-6qcjcu"));
      add_location(aside, file$b, 73, 2, 1762);
    },
    m: function mount(target, anchor) {
      insert_dev(target, aside, anchor);
      if (if_block) if_block.m(aside, null);
      append_dev(aside, t);
      append_dev(aside, nav);
      append_dev(nav, div);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (!
      /*persistent*/
      ctx[0]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*persistent*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1$4(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(aside, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        2048) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[11], dirty, null, null);
        }
      }

      if (!current || dirty &
      /*n*/
      16 && nav_class_value !== (nav_class_value = "" + (null_to_empty(
      /*n*/
      ctx[4]) + " svelte-6qcjcu"))) {
        attr_dev(nav, "class", nav_class_value);
      }

      if (!current || dirty &
      /*c*/
      8 && aside_class_value !== (aside_class_value = "" + (null_to_empty(
      /*c*/
      ctx[3]) + " svelte-6qcjcu"))) {
        attr_dev(aside, "class", aside_class_value);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fly,
        /*transitionProps*/
        ctx[2], true);
        aside_transition.run(1);
      });
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(default_slot, local);
      if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fly,
      /*transitionProps*/
      ctx[2], false);
      aside_transition.run(0);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(aside);
      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);
      if (detaching && aside_transition) aside_transition.end();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$5.name,
    type: "if",
    source: "(73:0) {#if show}",
    ctx
  });
  return block;
} // (79:4) {#if !persistent}


function create_if_block_1$4(ctx) {
  let scrim;
  let current;
  scrim = new Scrim$1({
    $$inline: true
  });
  scrim.$on("click",
  /*click_handler*/
  ctx[13]);
  const block = {
    c: function create() {
      create_component(scrim.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(scrim.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(scrim, target, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(scrim.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(scrim.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(scrim, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1$4.name,
    type: "if",
    source: "(79:4) {#if !persistent}",
    ctx
  });
  return block;
}

function create_fragment$b(ctx) {
  let if_block_anchor;
  let current;
  let if_block =
  /*show*/
  ctx[1] && create_if_block$5(ctx);
  const block = {
    c: function create() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if (if_block) if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (
      /*show*/
      ctx[1]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*show*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$5(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$b.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$5 = " fixed top-0 md:mt-16 w-auto drawer overflow-hidden h-full";

function instance$b($$self, $$props, $$invalidate) {
  let $bp;
  const bp = breakpoint();
  validate_store(bp, "bp");
  component_subscribe($$self, bp, value => $$invalidate(14, $bp = value));
  const navClassesDefault = `h-full w-full dark:bg-gray-900 dark:text-gray-200 absolute flex w-auto z-20 drawer
    pointer-events-auto overflow-y-auto`;
  let {
    right = false
  } = $$props;
  let {
    persistent = false
  } = $$props;
  let {
    elevation = true
  } = $$props;
  let {
    show = true
  } = $$props;
  let {
    classes = classesDefault$5
  } = $$props;
  let {
    navClasses = navClassesDefault
  } = $$props;
  let {
    borderClasses = `border-gray-600 ${right ? "border-l" : "border-r"}`
  } = $$props;
  let {
    transitionProps = {
      duration: 200,
      x: -300,
      easing: quadIn,
      opacity: 1
    }
  } = $$props; // Is the drawer deliberately hidden? Don't let the $bp check make it visible if so.

  let hidden = !show;
  const cb = new ClassBuilder(classes, classesDefault$5);
  if ($bp === "sm") show = false;
  const ncb = new ClassBuilder(navClasses, navClassesDefault);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("NavigationDrawer", $$slots, ['default']);

  const click_handler = () => $$invalidate(1, show = false);

  $$self.$set = $$new_props => {
    $$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("right" in $$new_props) $$invalidate(6, right = $$new_props.right);
    if ("persistent" in $$new_props) $$invalidate(0, persistent = $$new_props.persistent);
    if ("elevation" in $$new_props) $$invalidate(7, elevation = $$new_props.elevation);
    if ("show" in $$new_props) $$invalidate(1, show = $$new_props.show);
    if ("classes" in $$new_props) $$invalidate(8, classes = $$new_props.classes);
    if ("navClasses" in $$new_props) $$invalidate(9, navClasses = $$new_props.navClasses);
    if ("borderClasses" in $$new_props) $$invalidate(10, borderClasses = $$new_props.borderClasses);
    if ("transitionProps" in $$new_props) $$invalidate(2, transitionProps = $$new_props.transitionProps);
    if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    fly,
    quadIn,
    Scrim: Scrim$1,
    breakpoints: breakpoint,
    ClassBuilder,
    bp,
    classesDefault: classesDefault$5,
    navClassesDefault,
    right,
    persistent,
    elevation,
    show,
    classes,
    navClasses,
    borderClasses,
    transitionProps,
    hidden,
    cb,
    ncb,
    $bp,
    c,
    n
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
    if ("right" in $$props) $$invalidate(6, right = $$new_props.right);
    if ("persistent" in $$props) $$invalidate(0, persistent = $$new_props.persistent);
    if ("elevation" in $$props) $$invalidate(7, elevation = $$new_props.elevation);
    if ("show" in $$props) $$invalidate(1, show = $$new_props.show);
    if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
    if ("navClasses" in $$props) $$invalidate(9, navClasses = $$new_props.navClasses);
    if ("borderClasses" in $$props) $$invalidate(10, borderClasses = $$new_props.borderClasses);
    if ("transitionProps" in $$props) $$invalidate(2, transitionProps = $$new_props.transitionProps);
    if ("hidden" in $$props) $$invalidate(16, hidden = $$new_props.hidden);
    if ("c" in $$props) $$invalidate(3, c = $$new_props.c);
    if ("n" in $$props) $$invalidate(4, n = $$new_props.n);
  };

  let c;
  let n;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*right*/
    64) {
       $$invalidate(2, transitionProps.x = right ? 300 : -300, transitionProps);
    }

    if ($$self.$$.dirty &
    /*$bp*/
    16384) {
       if (!hidden) $$invalidate(0, persistent = $$invalidate(1, show = $bp !== "sm"));
    }

     $$invalidate(3, c = cb.flush().add(classes, true, classesDefault$5).add(borderClasses, !elevation && persistent).add($$props.class).add("right-0", right).add("left-0", !right).add("pointer-events-none", persistent).add("z-50", !persistent).add("elevation-4", elevation).add("z-20", persistent).get());
  };

   $$invalidate(4, n = ncb.flush().get());

  $$props = exclude_internal_props($$props);
  return [persistent, show, transitionProps, c, n, bp, right, elevation, classes, navClasses, borderClasses, $$scope, $$slots, click_handler];
}

class NavigationDrawer extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-6qcjcu-style")) add_css$2();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {
      right: 6,
      persistent: 0,
      elevation: 7,
      show: 1,
      classes: 8,
      navClasses: 9,
      borderClasses: 10,
      transitionProps: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "NavigationDrawer",
      options,
      id: create_fragment$b.name
    });
  }

  get right() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set right(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get persistent() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set persistent(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get elevation() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set elevation(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get show() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set show(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get navClasses() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set navClasses(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get borderClasses() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set borderClasses(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get transitionProps() {
    throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set transitionProps(value) {
    throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Tooltip/Tooltip.svelte generated by Svelte v3.24.0 */
const file$c = "src/components/Tooltip/Tooltip.svelte";

function add_css$3() {
  var style = element("style");
  style.id = "svelte-1n6auy7-style";
  style.textContent = ".tooltip.svelte-1n6auy7{left:50%;transform:translateX(-50%)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9vbHRpcC5zdmVsdGUiLCJzb3VyY2VzIjpbIlRvb2x0aXAuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNjYWxlLCBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcInRvb2x0aXAgd2hpdGVzcGFjZS1uby13cmFwIHRleHQteHMgYWJzb2x1dGUgbXQtMiBiZy1ncmF5LTYwMCB0ZXh0LWdyYXktNTAgcm91bmRlZCBtZDpweC0yIG1kOnB5LTIgcHktNCBweC0zIHotMzBcIjtcblxuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcblxuXG4gIGV4cG9ydCBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gIGV4cG9ydCBsZXQgdGltZW91dCA9IG51bGw7XG4gIGV4cG9ydCBsZXQgZGVsYXlIaWRlID0gMTAwO1xuICBleHBvcnQgbGV0IGRlbGF5U2hvdyA9IDEwMDtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoY2xhc3NlcywgdHJ1ZSwgY2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5nZXQoKTtcblxuICBmdW5jdGlvbiBzaG93VG9vbHRpcCgpIHtcbiAgICBpZiAoc2hvdykgcmV0dXJuO1xuXG4gICAgc2hvdyA9IHRydWU7XG5cbiAgICBpZiAoIXRpbWVvdXQpIHJldHVybjtcblxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNob3cgPSBmYWxzZTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuICAgIGlmICghc2hvdykgcmV0dXJuO1xuXG4gICAgc2hvdyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGxldCB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGxldCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9O1xuICAgICAgbGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuLnRvb2x0aXAge1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbn1cbjwvc3R5bGU+XG5cbjxkaXYgY2xhc3M9XCJyZWxhdGl2ZSBpbmxpbmUtYmxvY2tcIj5cbiAgPGRpdlxuICAgIG9uOm1vdXNlZW50ZXI9e2RlYm91bmNlKHNob3dUb29sdGlwLCBkZWxheVNob3cpfVxuICAgIG9uOm1vdXNlbGVhdmU9e2RlYm91bmNlKGhpZGVUb29sdGlwLCBkZWxheUhpZGUpfVxuICAgIG9uOm1vdXNlZW50ZXJcbiAgICBvbjptb3VzZWxlYXZlXG4gICAgb246bW91c2VvdmVyXG4gICAgb246bW91c2VvdXRcbiAgPlxuICAgIDxzbG90IG5hbWU9XCJhY3RpdmF0b3JcIiAvPlxuICA8L2Rpdj5cblxuICB7I2lmIHNob3d9XG4gICAgPGRpdlxuICAgICAgaW46c2NhbGU9e3sgZHVyYXRpb246IDE1MCB9fVxuICAgICAgb3V0OnNjYWxlPXt7IGR1cmF0aW9uOiAxNTAsIGRlbGF5OiAxMDAgfX1cbiAgICAgIGNsYXNzPXtjfVxuICAgID5cbiAgICAgIDxzbG90IC8+XG4gICAgPC9kaXY+XG4gIHsvaWZ9XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEyREEsUUFBUSxlQUFDLENBQUMsQUFDUixJQUFJLENBQUUsR0FBRyxDQUNULFNBQVMsQ0FBRSxXQUFXLElBQUksQ0FBQyxBQUM3QixDQUFDIn0= */";
  append_dev(document.head, style);
}

const get_activator_slot_changes = dirty => ({});

const get_activator_slot_context = ctx => ({}); // (78:2) {#if show}


function create_if_block$6(ctx) {
  let div;
  let div_class_value;
  let div_intro;
  let div_outro;
  let current;
  const default_slot_template =
  /*$$slots*/
  ctx[9].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[8], null);
  const block = {
    c: function create() {
      div = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      if (default_slot) default_slot.l(div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", div_class_value = "" + (null_to_empty(
      /*c*/
      ctx[3]) + " svelte-1n6auy7"));
      add_location(div, file$c, 78, 4, 1636);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        256) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[8], dirty, null, null);
        }
      }

      if (!current || dirty &
      /*c*/
      8 && div_class_value !== (div_class_value = "" + (null_to_empty(
      /*c*/
      ctx[3]) + " svelte-1n6auy7"))) {
        attr_dev(div, "class", div_class_value);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        if (!div_intro) div_intro = create_in_transition(div, scale, {
          duration: 150
        });
        div_intro.start();
      });
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div, scale, {
        duration: 150,
        delay: 100
      });
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      if (default_slot) default_slot.d(detaching);
      if (detaching && div_outro) div_outro.end();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$6.name,
    type: "if",
    source: "(78:2) {#if show}",
    ctx
  });
  return block;
}

function create_fragment$c(ctx) {
  let div1;
  let div0;
  let t;
  let current;
  let mounted;
  let dispose;
  const activator_slot_template =
  /*$$slots*/
  ctx[9].activator;
  const activator_slot = create_slot(activator_slot_template, ctx,
  /*$$scope*/
  ctx[8], get_activator_slot_context);
  let if_block =
  /*show*/
  ctx[0] && create_if_block$6(ctx);
  const block = {
    c: function create() {
      div1 = element("div");
      div0 = element("div");
      if (activator_slot) activator_slot.c();
      t = space();
      if (if_block) if_block.c();
      this.h();
    },
    l: function claim(nodes) {
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", {});
      var div0_nodes = children(div0);
      if (activator_slot) activator_slot.l(div0_nodes);
      div0_nodes.forEach(detach_dev);
      t = claim_space(div1_nodes);
      if (if_block) if_block.l(div1_nodes);
      div1_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(div0, file$c, 66, 2, 1395);
      attr_dev(div1, "class", "relative inline-block");
      add_location(div1, file$c, 65, 0, 1357);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div1, anchor);
      append_dev(div1, div0);

      if (activator_slot) {
        activator_slot.m(div0, null);
      }

      append_dev(div1, t);
      if (if_block) if_block.m(div1, null);
      current = true;

      if (!mounted) {
        dispose = [listen_dev(div0, "mouseenter", function () {
          if (is_function(debounce(
          /*showTooltip*/
          ctx[4],
          /*delayShow*/
          ctx[2]))) debounce(
          /*showTooltip*/
          ctx[4],
          /*delayShow*/
          ctx[2]).apply(this, arguments);
        }, false, false, false), listen_dev(div0, "mouseleave", function () {
          if (is_function(debounce(
          /*hideTooltip*/
          ctx[5],
          /*delayHide*/
          ctx[1]))) debounce(
          /*hideTooltip*/
          ctx[5],
          /*delayHide*/
          ctx[1]).apply(this, arguments);
        }, false, false, false), listen_dev(div0, "mouseenter",
        /*mouseenter_handler*/
        ctx[10], false, false, false), listen_dev(div0, "mouseleave",
        /*mouseleave_handler*/
        ctx[11], false, false, false), listen_dev(div0, "mouseover",
        /*mouseover_handler*/
        ctx[12], false, false, false), listen_dev(div0, "mouseout",
        /*mouseout_handler*/
        ctx[13], false, false, false)];
        mounted = true;
      }
    },
    p: function update(new_ctx, [dirty]) {
      ctx = new_ctx;

      if (activator_slot) {
        if (activator_slot.p && dirty &
        /*$$scope*/
        256) {
          update_slot(activator_slot, activator_slot_template, ctx,
          /*$$scope*/
          ctx[8], dirty, get_activator_slot_changes, get_activator_slot_context);
        }
      }

      if (
      /*show*/
      ctx[0]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*show*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$6(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(activator_slot, local);
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(activator_slot, local);
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div1);
      if (activator_slot) activator_slot.d(detaching);
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$c.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$6 = "tooltip whitespace-no-wrap text-xs absolute mt-2 bg-gray-600 text-gray-50 rounded md:px-2 md:py-2 py-4 px-3 z-30";

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
        args = arguments;

    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function instance$c($$self, $$props, $$invalidate) {
  let {
    classes = classesDefault$6
  } = $$props;
  let {
    show = false
  } = $$props;
  let {
    timeout = null
  } = $$props;
  let {
    delayHide = 100
  } = $$props;
  let {
    delayShow = 100
  } = $$props;
  const cb = new ClassBuilder(classes, classesDefault$6);

  function showTooltip() {
    if (show) return;
    $$invalidate(0, show = true);
    if (!timeout) return;
    $$invalidate(6, timeout = setTimeout(() => {
      $$invalidate(0, show = false);
    }, timeout));
  }

  function hideTooltip() {
    if (!show) return;
    $$invalidate(0, show = false);
    clearTimeout(timeout);
  }

  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Tooltip", $$slots, ['activator', 'default']);

  function mouseenter_handler(event) {
    bubble($$self, event);
  }

  function mouseleave_handler(event) {
    bubble($$self, event);
  }

  function mouseover_handler(event) {
    bubble($$self, event);
  }

  function mouseout_handler(event) {
    bubble($$self, event);
  }

  $$self.$set = $$new_props => {
    $$invalidate(15, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("classes" in $$new_props) $$invalidate(7, classes = $$new_props.classes);
    if ("show" in $$new_props) $$invalidate(0, show = $$new_props.show);
    if ("timeout" in $$new_props) $$invalidate(6, timeout = $$new_props.timeout);
    if ("delayHide" in $$new_props) $$invalidate(1, delayHide = $$new_props.delayHide);
    if ("delayShow" in $$new_props) $$invalidate(2, delayShow = $$new_props.delayShow);
    if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    scale,
    fade,
    ClassBuilder,
    classesDefault: classesDefault$6,
    classes,
    show,
    timeout,
    delayHide,
    delayShow,
    cb,
    showTooltip,
    hideTooltip,
    debounce,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(15, $$props = assign(assign({}, $$props), $$new_props));
    if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    if ("show" in $$props) $$invalidate(0, show = $$new_props.show);
    if ("timeout" in $$props) $$invalidate(6, timeout = $$new_props.timeout);
    if ("delayHide" in $$props) $$invalidate(1, delayHide = $$new_props.delayHide);
    if ("delayShow" in $$props) $$invalidate(2, delayShow = $$new_props.delayShow);
    if ("c" in $$props) $$invalidate(3, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
     $$invalidate(3, c = cb.flush().add(classes, true, classesDefault$6).add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [show, delayHide, delayShow, c, showTooltip, hideTooltip, timeout, classes, $$scope, $$slots, mouseenter_handler, mouseleave_handler, mouseover_handler, mouseout_handler];
}

class Tooltip extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-1n6auy7-style")) add_css$3();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
      classes: 7,
      show: 0,
      timeout: 6,
      delayHide: 1,
      delayShow: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Tooltip",
      options,
      id: create_fragment$c.name
    });
  }

  get classes() {
    throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get show() {
    throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set show(value) {
    throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get timeout() {
    throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set timeout(value) {
    throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get delayHide() {
    throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set delayHide(value) {
    throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get delayShow() {
    throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set delayShow(value) {
    throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

const navMenu = [{
  to: "/",
  text: "NOTICIAS"
}, {
  to: "playroom",
  text: "PLAYROOM"
}, {
  to: "discos",
  text: "DISCOS"
}, {
  to: "press",
  text: "PRENSA"
}, {
  to: "shop",
  text: "TIENDA"
}];
const topMenu = [{
  to: "press",
  text: "PRENSA"
}, {
  to: "shop",
  text: "TIENDA"
}];

const right = writable(false);
const persistent = writable(true);
const elevation = writable(false);
const showNav = writable(true);

let darkMode;

function isDarkTheme() {
  if (!window.matchMedia) {
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return true;
  }
}

function dark(value = true, bodyClasses = "mode-dark") {
  if (typeof window === "undefined") return writable(value);

  if (!darkMode) {
    darkMode = writable(value || isDarkTheme());
  }

  return {
    subscribe: darkMode.subscribe,
    set: v => {
      bodyClasses.split(" ").forEach(c => {
        if (v) {
          document.body.classList.add(c);
        } else {
          document.body.classList.remove(c);
        }
      });
      darkMode.set(v);
    }
  };
}

/* src/routes/_layout.svelte generated by Svelte v3.24.0 */
const file$d = "src/routes/_layout.svelte";

function add_css$4() {
  var style = element("style");
  style.id = "svelte-1d0txue-style";
  style.textContent = ".github.svelte-1d0txue{transition:0.3s ease-out}.github.svelte-1d0txue:hover{transform:rotate(360deg)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2xheW91dC5zdmVsdGUiLCJzb3VyY2VzIjpbIl9sYXlvdXQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBBcHBCYXIgZnJvbSBcImNvbXBvbmVudHMvQXBwQmFyXCI7XG4gIGltcG9ydCBUYWJzIGZyb20gXCJjb21wb25lbnRzL1RhYnNcIjtcbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29tcG9uZW50cy9CdXR0b25cIjtcbiAgaW1wb3J0IHsgU3BhY2VyIH0gZnJvbSBcImNvbXBvbmVudHMvVXRpbFwiO1xuICBpbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gXCJjb21wb25lbnRzL0xpc3RcIjtcbiAgaW1wb3J0IE5hdmlnYXRpb25EcmF3ZXIgZnJvbSBcImNvbXBvbmVudHMvTmF2aWdhdGlvbkRyYXdlclwiO1xuICBpbXBvcnQgUHJvZ3Jlc3NMaW5lYXIgZnJvbSBcImNvbXBvbmVudHMvUHJvZ3Jlc3NMaW5lYXJcIjtcbiAgaW1wb3J0IFRvb2x0aXAgZnJvbSBcImNvbXBvbmVudHMvVG9vbHRpcFwiO1xuICBpbXBvcnQgeyBzdG9yZXMgfSBmcm9tIFwiQHNhcHBlci9hcHBcIjtcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgaW1wb3J0IHsgZmFkZSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuICBpbXBvcnQgeyBuYXZNZW51LCB0b3BNZW51IH0gZnJvbSBcIi4uL3V0aWxzL21lbnUuanNcIjtcbiAgaW1wb3J0IHsgcmlnaHQsIGVsZXZhdGlvbiwgcGVyc2lzdGVudCwgc2hvd05hdiB9IGZyb20gXCJzdG9yZXMuanNcIjtcbiAgaW1wb3J0IGRhcmsgZnJvbSBcIi4uL2RhcmsuanNcIjtcblxuICBjb25zdCB7IHByZWxvYWRpbmcsIHBhZ2UgfSA9IHN0b3JlcygpO1xuXG4gIGxldCBzZWxlY3RlZCA9IFwiXCI7XG5cbiAgY29uc3QgZGFya01vZGUgPSBkYXJrKCk7XG5cbiAgJDogcGF0aCA9ICRwYWdlLnBhdGg7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZ2l0aHViIHtcbiAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2Utb3V0O1xuICB9XG4gIC5naXRodWI6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbjwvc3R5bGU+XG5cbjxzdmVsdGU6aGVhZD5cbiAgPHRpdGxlPkZsb3IgZGUgTW9ub3M8L3RpdGxlPlxuICA8bWV0YSBuYW1lPVwiZGVzY3JpcHRpb25cIiBjb250ZW50PVwiQnJlYWtpbmcgU291bmRzXCIgLz5cbjwvc3ZlbHRlOmhlYWQ+XG5cbnsjaWYgJHByZWxvYWRpbmd9XG4gIDxQcm9ncmVzc0xpbmVhciBhcHAgLz5cbnsvaWZ9XG5cbnsjZWFjaCBuYXZNZW51IGFzIGxpbmt9XG4gIDxhIGhyZWY9e2xpbmsudG99IGNsYXNzPVwiaGlkZGVuXCI+e2xpbmsudGV4dH08L2E+XG57L2VhY2h9XG5cbjxBcHBCYXIgY2xhc3M9eyhpKSA9PiBpLnJlcGxhY2UoJ3ByaW1hcnktMzAwJywgJ2RhcmstNjAwJyl9PlxuICA8YSBocmVmPVwiLlwiIGNsYXNzPVwicHgtMiBtZDpweC04IGZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgPGltZyBzcmM9XCIvZmRtX2xvZ28uc3ZnXCIgYWx0PVwiUm9jayBCYW5kIGxvZ29cIiB3aWR0aD1cIjcwXCIgLz5cbiAgICA8aDYgY2xhc3M9XCJwbC0zIHRleHQtd2hpdGUgdHJhY2tpbmctd2lkZXN0IGZvbnQtdGhpbiB0ZXh0LWxnXCI+RmxvciBkZSBNb25vczwvaDY+XG4gIDwvYT5cbiAgPFNwYWNlciAvPlxuICA8VGFicyBuYXZpZ2F0aW9uIGl0ZW1zPXt0b3BNZW51fSBiaW5kOnNlbGVjdGVkPXtwYXRofSAvPlxuXG4gIDxUb29sdGlwPlxuICAgIDxzcGFuIHNsb3Q9XCJhY3RpdmF0b3JcIj5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgYmluZDp2YWx1ZT17JGRhcmtNb2RlfVxuICAgICAgICBzbWFsbFxuICAgICAgICBmbGF0XG4gICAgICAgIHJlbW92ZT1cInAtMSBoLTQgdy00XCJcbiAgICAgICAgaWNvbkNsYXNzPVwidGV4dC13aGl0ZVwiXG4gICAgICAgIHRleHQgLz5cbiAgICA8L3NwYW4+XG4gICAgeyRkYXJrTW9kZSA/ICdEaXNhYmxlJyA6ICdFbmFibGUnfSBkYXJrIG1vZGVcbiAgPC9Ub29sdGlwPlxuICA8ZGl2IGNsYXNzPVwibWQ6aGlkZGVuXCI+XG4gICAgPEJ1dHRvblxuICAgICAgaWNvbj1cIm1lbnVcIlxuICAgICAgc21hbGxcbiAgICAgIGZsYXRcbiAgICAgIHJlbW92ZT1cInAtMSBoLTQgdy00XCJcbiAgICAgIGljb25DbGFzcz1cInRleHQtd2hpdGVcIlxuICAgICAgdGV4dFxuICAgICAgb246Y2xpY2s9eygpID0+IHNob3dOYXYuc2V0KCEkc2hvd05hdil9IC8+XG4gIDwvZGl2PlxuICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Jlc291cmNlbGRnL3dhbGFkb2NzXCIgY2xhc3M9XCJweC00IGdpdGh1YlwiPlxuICAgIDxpbWcgc3JjPVwiL2luc3RhZ3JhbS5zdmdcIiBhbHQ9XCJpZyByb2NrYmFuZFwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIC8+XG4gIDwvYT5cbiAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yZXNvdXJjZWxkZy93YWxhZG9jc1wiIGNsYXNzPVwicHgtNCBnaXRodWJcIj5cbiAgICA8aW1nIHNyYz1cIi9mYWNlLnN2Z1wiIGFsdD1cImZhY2Ugcm9ja2JhbmRcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiAvPlxuICA8L2E+XG5cbjwvQXBwQmFyPlxuXG48bWFpblxuICBjbGFzcz1cIiBwLTggbGc6bWF4LXctNXhsIG14LWF1dG8gbWItMTAgbXQtMjQgbWQ6bWwtNjQgbWQ6cGwtMTZcbiAgbWQ6bWF4LXctM3hsIG1kOnB4LTNcIlxuICB0cmFuc2l0aW9uOmZhZGU9e3sgZHVyYXRpb246IDMwMCB9fT5cbiAgPE5hdmlnYXRpb25EcmF3ZXJcbiAgICBiaW5kOnNob3c9eyRzaG93TmF2fVxuICAgIHJpZ2h0PXskcmlnaHR9XG4gICAgcGVyc2lzdGVudD17JHBlcnNpc3RlbnR9XG4gICAgZWxldmF0aW9uPXskZWxldmF0aW9ufT5cbiAgICA8aDZcbiAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICBNb25lYW5kb1xuICAgIDwvaDY+XG4gICAgPExpc3QgaXRlbXM9e25hdk1lbnV9PlxuICAgICAgPHNwYW4gc2xvdD1cIml0ZW1cIiBsZXQ6aXRlbSBjbGFzcz1cImN1cnNvci1wb2ludGVyIGJnLW5hdlwiPlxuICAgICAgICBcbiAgICAgICAgeyNpZiBpdGVtLnRvID09PSAnc2hvcCd9XG4gICAgICAgICAgPGhyIGNsYXNzPVwibXQtNFwiIC8+XG4gICAgICAgICAgPGg2XG4gICAgICAgICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgICAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgICAgICAgVGllbmRhXG4gICAgICAgICAgPC9oNj5cbiAgICAgICAgey9pZn1cbiAgICAgICAgeyNpZiBpdGVtLnRvID09PSAncHJlc3MnfVxuICAgICAgICAgIDxociBjbGFzcz1cIm10LTRcIiAvPlxuICAgICAgICAgIDxoNlxuICAgICAgICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICAgICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgICAgICAgQ29udGFjdG9cbiAgICAgICAgICA8L2g2PlxuICAgICAgICB7L2lmfVxuXG4gICAgICAgIDxhIGhyZWY9e2l0ZW0udG99PlxuICAgICAgICAgIDxMaXN0SXRlbVxuICAgICAgICAgICAgaWQ9e2l0ZW0uaWR9XG4gICAgICAgICAgICB0ZXh0PXtpdGVtLnRleHR9XG4gICAgICAgICAgICB0bz17aXRlbS50b31cbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXRoLmluY2x1ZGVzKGl0ZW0udG8pfVxuICAgICAgICAgICAgZGVuc2VcbiAgICAgICAgICAgIHNlbGVjdGVkQ2xhc3Nlcz1cImJnLXByaW1hcnktdHJhbnNEYXJrIGRhcms6YmctcHJpbWFyeS10cmFuc0xpZ2h0XG4gICAgICAgICAgICBob3ZlcjpiZy1ibHVlLWdyYXktdHJhbnNEYXJrIGJsdWUtZ3JheTpiZy1ibHVlLWdyYXktdHJhbnNMaWdodFwiIC8+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L0xpc3Q+XG5cbiAgICA8aHIgLz5cbiAgPC9OYXZpZ2F0aW9uRHJhd2VyPlxuXG4gIDxzbG90IC8+XG48L21haW4+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMEJFLE9BQU8sZUFBQyxDQUFDLEFBQ1AsVUFBVSxDQUFFLElBQUksQ0FBQyxRQUFRLEFBQzNCLENBQUMsQUFDRCxzQkFBTyxNQUFNLEFBQUMsQ0FBQyxBQUNiLFNBQVMsQ0FBRSxPQUFPLE1BQU0sQ0FBQyxBQUMzQixDQUFDIn0= */";
  append_dev(document.head, style);
}

function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[19] = list[i];
  return child_ctx;
} // (40:0) {#if $preloading}


function create_if_block_2$2(ctx) {
  let progresslinear;
  let current;
  progresslinear = new ProgressLinear({
    props: {
      app: true
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(progresslinear.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(progresslinear.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(progresslinear, target, anchor);
      current = true;
    },
    i: function intro(local) {
      if (current) return;
      transition_in(progresslinear.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(progresslinear.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(progresslinear, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_2$2.name,
    type: "if",
    source: "(40:0) {#if $preloading}",
    ctx
  });
  return block;
} // (44:0) {#each navMenu as link}


function create_each_block$2(ctx) {
  let a;
  let t_value =
  /*link*/
  ctx[19].text + "";
  let t;
  let a_href_value;
  const block = {
    c: function create() {
      a = element("a");
      t = text(t_value);
      this.h();
    },
    l: function claim(nodes) {
      a = claim_element(nodes, "A", {
        href: true,
        class: true
      });
      var a_nodes = children(a);
      t = claim_text(a_nodes, t_value);
      a_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(a, "href", a_href_value =
      /*link*/
      ctx[19].to);
      attr_dev(a, "class", "hidden");
      add_location(a, file$d, 44, 2, 1107);
    },
    m: function mount(target, anchor) {
      insert_dev(target, a, anchor);
      append_dev(a, t);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(a);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block$2.name,
    type: "each",
    source: "(44:0) {#each navMenu as link}",
    ctx
  });
  return block;
} // (57:4) <span slot="activator">


function create_activator_slot(ctx) {
  let span;
  let button;
  let updating_value;
  let current;

  function button_value_binding(value) {
    /*button_value_binding*/
    ctx[12].call(null, value);
  }

  let button_props = {
    small: true,
    flat: true,
    remove: "p-1 h-4 w-4",
    iconClass: "text-white",
    text: true
  };

  if (
  /*$darkMode*/
  ctx[2] !== void 0) {
    button_props.value =
    /*$darkMode*/
    ctx[2];
  }

  button = new Button({
    props: button_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(button, "value", button_value_binding));
  const block = {
    c: function create() {
      span = element("span");
      create_component(button.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      span = claim_element(nodes, "SPAN", {
        slot: true
      });
      var span_nodes = children(span);
      claim_component(button.$$.fragment, span_nodes);
      span_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(span, "slot", "activator");
      add_location(span, file$d, 56, 4, 1525);
    },
    m: function mount(target, anchor) {
      insert_dev(target, span, anchor);
      mount_component(button, span, null);
      current = true;
    },
    p: function update(ctx, dirty) {
      const button_changes = {};

      if (!updating_value && dirty &
      /*$darkMode*/
      4) {
        updating_value = true;
        button_changes.value =
        /*$darkMode*/
        ctx[2];
        add_flush_callback(() => updating_value = false);
      }

      button.$set(button_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(span);
      destroy_component(button);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_activator_slot.name,
    type: "slot",
    source: "(57:4) <span slot=\\\"activator\\\">",
    ctx
  });
  return block;
} // (56:2) <Tooltip>


function create_default_slot_3(ctx) {
  let t0;
  let t1_value = (
  /*$darkMode*/
  ctx[2] ? "Disable" : "Enable") + "";
  let t1;
  let t2;
  const block = {
    c: function create() {
      t0 = space();
      t1 = text(t1_value);
      t2 = text(" dark mode");
    },
    l: function claim(nodes) {
      t0 = claim_space(nodes);
      t1 = claim_text(nodes, t1_value);
      t2 = claim_text(nodes, " dark mode");
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, t1, anchor);
      insert_dev(target, t2, anchor);
    },
    p: function update(ctx, dirty) {
      if ( t1_value !== (t1_value = (
      /*$darkMode*/
      ctx[2] ? "Disable" : "Enable") + "")) set_data_dev(t1, t1_value);
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(t2);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_3.name,
    type: "slot",
    source: "(56:2) <Tooltip>",
    ctx
  });
  return block;
} // (48:0) <AppBar class={(i) => i.replace('primary-300', 'dark-600')}>


function create_default_slot_2(ctx) {
  let a0;
  let img0;
  let img0_src_value;
  let t0;
  let h6;
  let t1;
  let t2;
  let spacer;
  let t3;
  let tabs;
  let updating_selected;
  let t4;
  let tooltip;
  let t5;
  let div;
  let button;
  let t6;
  let a1;
  let img1;
  let img1_src_value;
  let t7;
  let a2;
  let img2;
  let img2_src_value;
  let current;
  spacer = new Spacer$1({
    $$inline: true
  });

  function tabs_selected_binding(value) {
    /*tabs_selected_binding*/
    ctx[11].call(null, value);
  }

  let tabs_props = {
    navigation: true,
    items: topMenu
  };

  if (
  /*path*/
  ctx[0] !== void 0) {
    tabs_props.selected =
    /*path*/
    ctx[0];
  }

  tabs = new Tabs({
    props: tabs_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(tabs, "selected", tabs_selected_binding));
  tooltip = new Tooltip({
    props: {
      $$slots: {
        default: [create_default_slot_3],
        activator: [create_activator_slot]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button = new Button({
    props: {
      icon: "menu",
      small: true,
      flat: true,
      remove: "p-1 h-4 w-4",
      iconClass: "text-white",
      text: true
    },
    $$inline: true
  });
  button.$on("click",
  /*click_handler*/
  ctx[13]);
  const block = {
    c: function create() {
      a0 = element("a");
      img0 = element("img");
      t0 = space();
      h6 = element("h6");
      t1 = text("Flor de Monos");
      t2 = space();
      create_component(spacer.$$.fragment);
      t3 = space();
      create_component(tabs.$$.fragment);
      t4 = space();
      create_component(tooltip.$$.fragment);
      t5 = space();
      div = element("div");
      create_component(button.$$.fragment);
      t6 = space();
      a1 = element("a");
      img1 = element("img");
      t7 = space();
      a2 = element("a");
      img2 = element("img");
      this.h();
    },
    l: function claim(nodes) {
      a0 = claim_element(nodes, "A", {
        href: true,
        class: true
      });
      var a0_nodes = children(a0);
      img0 = claim_element(a0_nodes, "IMG", {
        src: true,
        alt: true,
        width: true
      });
      t0 = claim_space(a0_nodes);
      h6 = claim_element(a0_nodes, "H6", {
        class: true
      });
      var h6_nodes = children(h6);
      t1 = claim_text(h6_nodes, "Flor de Monos");
      h6_nodes.forEach(detach_dev);
      a0_nodes.forEach(detach_dev);
      t2 = claim_space(nodes);
      claim_component(spacer.$$.fragment, nodes);
      t3 = claim_space(nodes);
      claim_component(tabs.$$.fragment, nodes);
      t4 = claim_space(nodes);
      claim_component(tooltip.$$.fragment, nodes);
      t5 = claim_space(nodes);
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      claim_component(button.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      t6 = claim_space(nodes);
      a1 = claim_element(nodes, "A", {
        href: true,
        class: true
      });
      var a1_nodes = children(a1);
      img1 = claim_element(a1_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      a1_nodes.forEach(detach_dev);
      t7 = claim_space(nodes);
      a2 = claim_element(nodes, "A", {
        href: true,
        class: true
      });
      var a2_nodes = children(a2);
      img2 = claim_element(a2_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      a2_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      if (img0.src !== (img0_src_value = "/fdm_logo.svg")) attr_dev(img0, "src", img0_src_value);
      attr_dev(img0, "alt", "Rock Band logo");
      attr_dev(img0, "width", "70");
      add_location(img0, file$d, 49, 4, 1284);
      attr_dev(h6, "class", "pl-3 text-white tracking-widest font-thin text-lg");
      add_location(h6, file$d, 50, 4, 1348);
      attr_dev(a0, "href", ".");
      attr_dev(a0, "class", "px-2 md:px-8 flex items-center");
      add_location(a0, file$d, 48, 2, 1228);
      attr_dev(div, "class", "md:hidden");
      add_location(div, file$d, 67, 2, 1773);
      if (img1.src !== (img1_src_value = "/instagram.svg")) attr_dev(img1, "src", img1_src_value);
      attr_dev(img1, "alt", "ig rockband");
      attr_dev(img1, "width", "50");
      attr_dev(img1, "height", "50");
      add_location(img1, file$d, 78, 4, 2052);
      attr_dev(a1, "href", "https://github.com/resourceldg/waladocs");
      attr_dev(a1, "class", "px-4 github svelte-1d0txue");
      add_location(a1, file$d, 77, 2, 1977);
      if (img2.src !== (img2_src_value = "/face.svg")) attr_dev(img2, "src", img2_src_value);
      attr_dev(img2, "alt", "face rockband");
      attr_dev(img2, "width", "50");
      attr_dev(img2, "height", "50");
      add_location(img2, file$d, 81, 4, 2206);
      attr_dev(a2, "href", "https://github.com/resourceldg/waladocs");
      attr_dev(a2, "class", "px-4 github svelte-1d0txue");
      add_location(a2, file$d, 80, 2, 2131);
    },
    m: function mount(target, anchor) {
      insert_dev(target, a0, anchor);
      append_dev(a0, img0);
      append_dev(a0, t0);
      append_dev(a0, h6);
      append_dev(h6, t1);
      insert_dev(target, t2, anchor);
      mount_component(spacer, target, anchor);
      insert_dev(target, t3, anchor);
      mount_component(tabs, target, anchor);
      insert_dev(target, t4, anchor);
      mount_component(tooltip, target, anchor);
      insert_dev(target, t5, anchor);
      insert_dev(target, div, anchor);
      mount_component(button, div, null);
      insert_dev(target, t6, anchor);
      insert_dev(target, a1, anchor);
      append_dev(a1, img1);
      insert_dev(target, t7, anchor);
      insert_dev(target, a2, anchor);
      append_dev(a2, img2);
      current = true;
    },
    p: function update(ctx, dirty) {
      const tabs_changes = {};

      if (!updating_selected && dirty &
      /*path*/
      1) {
        updating_selected = true;
        tabs_changes.selected =
        /*path*/
        ctx[0];
        add_flush_callback(() => updating_selected = false);
      }

      tabs.$set(tabs_changes);
      const tooltip_changes = {};

      if (dirty &
      /*$$scope, $darkMode*/
      32772) {
        tooltip_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tooltip.$set(tooltip_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(spacer.$$.fragment, local);
      transition_in(tabs.$$.fragment, local);
      transition_in(tooltip.$$.fragment, local);
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(spacer.$$.fragment, local);
      transition_out(tabs.$$.fragment, local);
      transition_out(tooltip.$$.fragment, local);
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(a0);
      if (detaching) detach_dev(t2);
      destroy_component(spacer, detaching);
      if (detaching) detach_dev(t3);
      destroy_component(tabs, detaching);
      if (detaching) detach_dev(t4);
      destroy_component(tooltip, detaching);
      if (detaching) detach_dev(t5);
      if (detaching) detach_dev(div);
      destroy_component(button);
      if (detaching) detach_dev(t6);
      if (detaching) detach_dev(a1);
      if (detaching) detach_dev(t7);
      if (detaching) detach_dev(a2);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_2.name,
    type: "slot",
    source: "(48:0) <AppBar class={(i) => i.replace('primary-300', 'dark-600')}>",
    ctx
  });
  return block;
} // (104:8) {#if item.to === 'shop'}


function create_if_block_1$5(ctx) {
  let hr;
  let t0;
  let h6;
  let t1;
  const block = {
    c: function create() {
      hr = element("hr");
      t0 = space();
      h6 = element("h6");
      t1 = text("Tienda");
      this.h();
    },
    l: function claim(nodes) {
      hr = claim_element(nodes, "HR", {
        class: true
      });
      t0 = claim_space(nodes);
      h6 = claim_element(nodes, "H6", {
        class: true
      });
      var h6_nodes = children(h6);
      t1 = claim_text(h6_nodes, "Tienda");
      h6_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(hr, "class", "mt-4");
      add_location(hr, file$d, 104, 10, 2816);
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n            dark:text-gray-100");
      add_location(h6, file$d, 105, 10, 2846);
    },
    m: function mount(target, anchor) {
      insert_dev(target, hr, anchor);
      insert_dev(target, t0, anchor);
      insert_dev(target, h6, anchor);
      append_dev(h6, t1);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(hr);
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(h6);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1$5.name,
    type: "if",
    source: "(104:8) {#if item.to === 'shop'}",
    ctx
  });
  return block;
} // (112:8) {#if item.to === 'press'}


function create_if_block$7(ctx) {
  let hr;
  let t0;
  let h6;
  let t1;
  const block = {
    c: function create() {
      hr = element("hr");
      t0 = space();
      h6 = element("h6");
      t1 = text("Contacto");
      this.h();
    },
    l: function claim(nodes) {
      hr = claim_element(nodes, "HR", {
        class: true
      });
      t0 = claim_space(nodes);
      h6 = claim_element(nodes, "H6", {
        class: true
      });
      var h6_nodes = children(h6);
      t1 = claim_text(h6_nodes, "Contacto");
      h6_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(hr, "class", "mt-4");
      add_location(hr, file$d, 112, 10, 3048);
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n            dark:text-gray-100");
      add_location(h6, file$d, 113, 10, 3078);
    },
    m: function mount(target, anchor) {
      insert_dev(target, hr, anchor);
      insert_dev(target, t0, anchor);
      insert_dev(target, h6, anchor);
      append_dev(h6, t1);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(hr);
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(h6);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$7.name,
    type: "if",
    source: "(112:8) {#if item.to === 'press'}",
    ctx
  });
  return block;
} // (102:6) <span slot="item" let:item class="cursor-pointer bg-nav">


function create_item_slot(ctx) {
  let span;
  let t0;
  let t1;
  let a;
  let listitem;
  let a_href_value;
  let current;
  let if_block0 =
  /*item*/
  ctx[18].to === "shop" && create_if_block_1$5(ctx);
  let if_block1 =
  /*item*/
  ctx[18].to === "press" && create_if_block$7(ctx);
  listitem = new ListItem({
    props: {
      id:
      /*item*/
      ctx[18].id,
      text:
      /*item*/
      ctx[18].text,
      to:
      /*item*/
      ctx[18].to,
      selected:
      /*path*/
      ctx[0].includes(
      /*item*/
      ctx[18].to),
      dense: true,
      selectedClasses: "bg-primary-transDark dark:bg-primary-transLight\n            hover:bg-blue-gray-transDark blue-gray:bg-blue-gray-transLight"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      span = element("span");
      if (if_block0) if_block0.c();
      t0 = space();
      if (if_block1) if_block1.c();
      t1 = space();
      a = element("a");
      create_component(listitem.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      span = claim_element(nodes, "SPAN", {
        slot: true,
        class: true
      });
      var span_nodes = children(span);
      if (if_block0) if_block0.l(span_nodes);
      t0 = claim_space(span_nodes);
      if (if_block1) if_block1.l(span_nodes);
      t1 = claim_space(span_nodes);
      a = claim_element(span_nodes, "A", {
        href: true
      });
      var a_nodes = children(a);
      claim_component(listitem.$$.fragment, a_nodes);
      a_nodes.forEach(detach_dev);
      span_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(a, "href", a_href_value =
      /*item*/
      ctx[18].to);
      add_location(a, file$d, 120, 8, 3246);
      attr_dev(span, "slot", "item");
      attr_dev(span, "class", "cursor-pointer bg-nav");
      add_location(span, file$d, 101, 6, 2706);
    },
    m: function mount(target, anchor) {
      insert_dev(target, span, anchor);
      if (if_block0) if_block0.m(span, null);
      append_dev(span, t0);
      if (if_block1) if_block1.m(span, null);
      append_dev(span, t1);
      append_dev(span, a);
      mount_component(listitem, a, null);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (
      /*item*/
      ctx[18].to === "shop") {
        if (if_block0) ; else {
          if_block0 = create_if_block_1$5(ctx);
          if_block0.c();
          if_block0.m(span, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }

      if (
      /*item*/
      ctx[18].to === "press") {
        if (if_block1) ; else {
          if_block1 = create_if_block$7(ctx);
          if_block1.c();
          if_block1.m(span, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }

      const listitem_changes = {};
      if (dirty &
      /*item*/
      262144) listitem_changes.id =
      /*item*/
      ctx[18].id;
      if (dirty &
      /*item*/
      262144) listitem_changes.text =
      /*item*/
      ctx[18].text;
      if (dirty &
      /*item*/
      262144) listitem_changes.to =
      /*item*/
      ctx[18].to;
      if (dirty &
      /*path, item*/
      262145) listitem_changes.selected =
      /*path*/
      ctx[0].includes(
      /*item*/
      ctx[18].to);
      listitem.$set(listitem_changes);

      if (!current || dirty &
      /*item*/
      262144 && a_href_value !== (a_href_value =
      /*item*/
      ctx[18].to)) {
        attr_dev(a, "href", a_href_value);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(listitem.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(listitem.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(span);
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
      destroy_component(listitem);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_item_slot.name,
    type: "slot",
    source: "(102:6) <span slot=\\\"item\\\" let:item class=\\\"cursor-pointer bg-nav\\\">",
    ctx
  });
  return block;
} // (91:2) <NavigationDrawer     bind:show={$showNav}     right={$right}     persistent={$persistent}     elevation={$elevation}>


function create_default_slot$5(ctx) {
  let h6;
  let t0;
  let t1;
  let list;
  let t2;
  let hr;
  let current;
  list = new List({
    props: {
      items: navMenu,
      $$slots: {
        item: [create_item_slot, ({
          item
        }) => ({
          18: item
        }), ({
          item
        }) => item ? 262144 : 0]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      h6 = element("h6");
      t0 = text("Moneando");
      t1 = space();
      create_component(list.$$.fragment);
      t2 = space();
      hr = element("hr");
      this.h();
    },
    l: function claim(nodes) {
      h6 = claim_element(nodes, "H6", {
        class: true
      });
      var h6_nodes = children(h6);
      t0 = claim_text(h6_nodes, "Moneando");
      h6_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      claim_component(list.$$.fragment, nodes);
      t2 = claim_space(nodes);
      hr = claim_element(nodes, "HR", {});
      this.h();
    },
    h: function hydrate() {
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n      dark:text-gray-100");
      add_location(h6, file$d, 95, 4, 2551);
      add_location(hr, file$d, 133, 4, 3628);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h6, anchor);
      append_dev(h6, t0);
      insert_dev(target, t1, anchor);
      mount_component(list, target, anchor);
      insert_dev(target, t2, anchor);
      insert_dev(target, hr, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const list_changes = {};

      if (dirty &
      /*$$scope, item, path*/
      294913) {
        list_changes.$$scope = {
          dirty,
          ctx
        };
      }

      list.$set(list_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(list.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(list.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(h6);
      if (detaching) detach_dev(t1);
      destroy_component(list, detaching);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(hr);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$5.name,
    type: "slot",
    source: "(91:2) <NavigationDrawer     bind:show={$showNav}     right={$right}     persistent={$persistent}     elevation={$elevation}>",
    ctx
  });
  return block;
}

function create_fragment$d(ctx) {
  let meta;
  let t0;
  let t1;
  let t2;
  let appbar;
  let t3;
  let main;
  let navigationdrawer;
  let updating_show;
  let t4;
  let main_transition;
  let current;
  let if_block =
  /*$preloading*/
  ctx[1] && create_if_block_2$2(ctx);
  let each_value = navMenu;
  validate_each_argument(each_value);
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }

  appbar = new AppBar({
    props: {
      class: func,
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });

  function navigationdrawer_show_binding(value) {
    /*navigationdrawer_show_binding*/
    ctx[14].call(null, value);
  }

  let navigationdrawer_props = {
    right:
    /*$right*/
    ctx[4],
    persistent:
    /*$persistent*/
    ctx[5],
    elevation:
    /*$elevation*/
    ctx[6],
    $$slots: {
      default: [create_default_slot$5]
    },
    $$scope: {
      ctx
    }
  };

  if (
  /*$showNav*/
  ctx[3] !== void 0) {
    navigationdrawer_props.show =
    /*$showNav*/
    ctx[3];
  }

  navigationdrawer = new NavigationDrawer({
    props: navigationdrawer_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(navigationdrawer, "show", navigationdrawer_show_binding));
  const default_slot_template =
  /*$$slots*/
  ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[15], null);
  const block = {
    c: function create() {
      meta = element("meta");
      t0 = space();
      if (if_block) if_block.c();
      t1 = space();

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      t2 = space();
      create_component(appbar.$$.fragment);
      t3 = space();
      main = element("main");
      create_component(navigationdrawer.$$.fragment);
      t4 = space();
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      const head_nodes = query_selector_all("[data-svelte=\"svelte-1cjhoqe\"]", document.head);
      meta = claim_element(head_nodes, "META", {
        name: true,
        content: true
      });
      head_nodes.forEach(detach_dev);
      t0 = claim_space(nodes);
      if (if_block) if_block.l(nodes);
      t1 = claim_space(nodes);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(nodes);
      }

      t2 = claim_space(nodes);
      claim_component(appbar.$$.fragment, nodes);
      t3 = claim_space(nodes);
      main = claim_element(nodes, "MAIN", {
        class: true
      });
      var main_nodes = children(main);
      claim_component(navigationdrawer.$$.fragment, main_nodes);
      t4 = claim_space(main_nodes);
      if (default_slot) default_slot.l(main_nodes);
      main_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      document.title = "Flor de Monos";
      attr_dev(meta, "name", "description");
      attr_dev(meta, "content", "Breaking Sounds");
      add_location(meta, file$d, 36, 2, 961);
      attr_dev(main, "class", " p-8 lg:max-w-5xl mx-auto mb-10 mt-24 md:ml-64 md:pl-16\n  md:max-w-3xl md:px-3");
      add_location(main, file$d, 86, 0, 2292);
    },
    m: function mount(target, anchor) {
      append_dev(document.head, meta);
      insert_dev(target, t0, anchor);
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, t1, anchor);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }

      insert_dev(target, t2, anchor);
      mount_component(appbar, target, anchor);
      insert_dev(target, t3, anchor);
      insert_dev(target, main, anchor);
      mount_component(navigationdrawer, main, null);
      append_dev(main, t4);

      if (default_slot) {
        default_slot.m(main, null);
      }

      current = true;
    },
    p: function update(ctx, [dirty]) {
      if (
      /*$preloading*/
      ctx[1]) {
        if (if_block) {
          if (dirty &
          /*$preloading*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2$2(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(t1.parentNode, t1);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }

      if (dirty &
      /*navMenu*/
      0) {
        each_value = navMenu;
        validate_each_argument(each_value);
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(t2.parentNode, t2);
          }
        }

        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }

        each_blocks.length = each_value.length;
      }

      const appbar_changes = {};

      if (dirty &
      /*$$scope, $showNav, $darkMode, path*/
      32781) {
        appbar_changes.$$scope = {
          dirty,
          ctx
        };
      }

      appbar.$set(appbar_changes);
      const navigationdrawer_changes = {};
      if (dirty &
      /*$right*/
      16) navigationdrawer_changes.right =
      /*$right*/
      ctx[4];
      if (dirty &
      /*$persistent*/
      32) navigationdrawer_changes.persistent =
      /*$persistent*/
      ctx[5];
      if (dirty &
      /*$elevation*/
      64) navigationdrawer_changes.elevation =
      /*$elevation*/
      ctx[6];

      if (dirty &
      /*$$scope, path*/
      32769) {
        navigationdrawer_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_show && dirty &
      /*$showNav*/
      8) {
        updating_show = true;
        navigationdrawer_changes.show =
        /*$showNav*/
        ctx[3];
        add_flush_callback(() => updating_show = false);
      }

      navigationdrawer.$set(navigationdrawer_changes);

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        32768) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[15], dirty, null, null);
        }
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(appbar.$$.fragment, local);
      transition_in(navigationdrawer.$$.fragment, local);
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (!main_transition) main_transition = create_bidirectional_transition(main, fade, {
          duration: 300
        }, true);
        main_transition.run(1);
      });
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(appbar.$$.fragment, local);
      transition_out(navigationdrawer.$$.fragment, local);
      transition_out(default_slot, local);
      if (!main_transition) main_transition = create_bidirectional_transition(main, fade, {
        duration: 300
      }, false);
      main_transition.run(0);
      current = false;
    },
    d: function destroy(detaching) {
      detach_dev(meta);
      if (detaching) detach_dev(t0);
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(t1);
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(t2);
      destroy_component(appbar, detaching);
      if (detaching) detach_dev(t3);
      if (detaching) detach_dev(main);
      destroy_component(navigationdrawer);
      if (default_slot) default_slot.d(detaching);
      if (detaching && main_transition) main_transition.end();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$d.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const func = i => i.replace("primary-300", "dark-600");

function instance$d($$self, $$props, $$invalidate) {
  let $page;
  let $preloading;
  let $darkMode;
  let $showNav;
  let $right;
  let $persistent;
  let $elevation;
  validate_store(showNav, "showNav");
  component_subscribe($$self, showNav, $$value => $$invalidate(3, $showNav = $$value));
  validate_store(right, "right");
  component_subscribe($$self, right, $$value => $$invalidate(4, $right = $$value));
  validate_store(persistent, "persistent");
  component_subscribe($$self, persistent, $$value => $$invalidate(5, $persistent = $$value));
  validate_store(elevation, "elevation");
  component_subscribe($$self, elevation, $$value => $$invalidate(6, $elevation = $$value));
  const {
    preloading,
    page
  } = stores$1();
  validate_store(preloading, "preloading");
  component_subscribe($$self, preloading, value => $$invalidate(1, $preloading = value));
  validate_store(page, "page");
  component_subscribe($$self, page, value => $$invalidate(16, $page = value));
  let selected = "";
  const darkMode = dark();
  validate_store(darkMode, "darkMode");
  component_subscribe($$self, darkMode, value => $$invalidate(2, $darkMode = value));
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Layout", $$slots, ['default']);

  function tabs_selected_binding(value) {
    path = value;
    $$invalidate(0, path), $$invalidate(16, $page);
  }

  function button_value_binding(value) {
    $darkMode = value;
    darkMode.set($darkMode);
  }

  const click_handler = () => showNav.set(!$showNav);

  function navigationdrawer_show_binding(value) {
    $showNav = value;
    showNav.set($showNav);
  }

  $$self.$set = $$props => {
    if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = () => ({
    AppBar,
    Tabs,
    Button,
    Spacer: Spacer$1,
    List,
    ListItem,
    NavigationDrawer,
    ProgressLinear,
    Tooltip,
    stores: stores$1,
    onMount,
    fade,
    navMenu,
    topMenu,
    right,
    elevation,
    persistent,
    showNav,
    dark,
    preloading,
    page,
    selected,
    darkMode,
    path,
    $page,
    $preloading,
    $darkMode,
    $showNav,
    $right,
    $persistent,
    $elevation
  });

  $$self.$inject_state = $$props => {
    if ("selected" in $$props) selected = $$props.selected;
    if ("path" in $$props) $$invalidate(0, path = $$props.path);
  };

  let path;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*$page*/
    65536) {
       $$invalidate(0, path = $page.path);
    }
  };

  return [path, $preloading, $darkMode, $showNav, $right, $persistent, $elevation, preloading, page, darkMode, $$slots, tabs_selected_binding, button_value_binding, click_handler, navigationdrawer_show_binding, $$scope];
}

class Layout extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-1d0txue-style")) add_css$4();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Layout",
      options,
      id: create_fragment$d.name
    });
  }

}

/* src/routes/_error.svelte generated by Svelte v3.24.0 */
const {
  Error: Error_1
} = globals;
const file$e = "src/routes/_error.svelte"; // (16:0) {#if dev && error.stack}

function create_if_block$8(ctx) {
  let pre;
  let t_value =
  /*error*/
  ctx[1].stack + "";
  let t;
  const block = {
    c: function create() {
      pre = element("pre");
      t = text(t_value);
      this.h();
    },
    l: function claim(nodes) {
      pre = claim_element(nodes, "PRE", {});
      var pre_nodes = children(pre);
      t = claim_text(pre_nodes, t_value);
      pre_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(pre, file$e, 16, 2, 235);
    },
    m: function mount(target, anchor) {
      insert_dev(target, pre, anchor);
      append_dev(pre, t);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*error*/
      2 && t_value !== (t_value =
      /*error*/
      ctx[1].stack + "")) set_data_dev(t, t_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(pre);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$8.name,
    type: "if",
    source: "(16:0) {#if dev && error.stack}",
    ctx
  });
  return block;
}

function create_fragment$e(ctx) {
  let title_value;
  let t0;
  let h1;
  let t1;
  let t2;
  let p;
  let t3_value =
  /*error*/
  ctx[1].message + "";
  let t3;
  let t4;
  let if_block_anchor;
  document.title = title_value =
  /*status*/
  ctx[0];
  let if_block =
  /*dev*/
  ctx[2] &&
  /*error*/
  ctx[1].stack && create_if_block$8(ctx);
  const block = {
    c: function create() {
      t0 = space();
      h1 = element("h1");
      t1 = text(
      /*status*/
      ctx[0]);
      t2 = space();
      p = element("p");
      t3 = text(t3_value);
      t4 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      this.h();
    },
    l: function claim(nodes) {
      const head_nodes = query_selector_all("[data-svelte=\"svelte-1moakz\"]", document.head);
      head_nodes.forEach(detach_dev);
      t0 = claim_space(nodes);
      h1 = claim_element(nodes, "H1", {});
      var h1_nodes = children(h1);
      t1 = claim_text(h1_nodes,
      /*status*/
      ctx[0]);
      h1_nodes.forEach(detach_dev);
      t2 = claim_space(nodes);
      p = claim_element(nodes, "P", {});
      var p_nodes = children(p);
      t3 = claim_text(p_nodes, t3_value);
      p_nodes.forEach(detach_dev);
      t4 = claim_space(nodes);
      if (if_block) if_block.l(nodes);
      if_block_anchor = empty();
      this.h();
    },
    h: function hydrate() {
      add_location(h1, file$e, 11, 0, 165);
      add_location(p, file$e, 13, 0, 184);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, h1, anchor);
      append_dev(h1, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, p, anchor);
      append_dev(p, t3);
      insert_dev(target, t4, anchor);
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*status*/
      1 && title_value !== (title_value =
      /*status*/
      ctx[0])) {
        document.title = title_value;
      }

      if (dirty &
      /*status*/
      1) set_data_dev(t1,
      /*status*/
      ctx[0]);
      if (dirty &
      /*error*/
      2 && t3_value !== (t3_value =
      /*error*/
      ctx[1].message + "")) set_data_dev(t3, t3_value);

      if (
      /*dev*/
      ctx[2] &&
      /*error*/
      ctx[1].stack) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block$8(ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(h1);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(p);
      if (detaching) detach_dev(t4);
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$e.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$e($$self, $$props, $$invalidate) {
  let {
    status
  } = $$props;
  let {
    error
  } = $$props;
  const dev = "development" === "development";
  const writable_props = ["status", "error"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Error> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Error", $$slots, []);

  $$self.$set = $$props => {
    if ("status" in $$props) $$invalidate(0, status = $$props.status);
    if ("error" in $$props) $$invalidate(1, error = $$props.error);
  };

  $$self.$capture_state = () => ({
    status,
    error,
    dev
  });

  $$self.$inject_state = $$props => {
    if ("status" in $$props) $$invalidate(0, status = $$props.status);
    if ("error" in $$props) $$invalidate(1, error = $$props.error);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [status, error, dev];
}

class Error$1 extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {
      status: 0,
      error: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Error",
      options,
      id: create_fragment$e.name
    });
    const {
      ctx
    } = this.$$;
    const props = options.props || {};

    if (
    /*status*/
    ctx[0] === undefined && !("status" in props)) {
      console.warn("<Error> was created without expected prop 'status'");
    }

    if (
    /*error*/
    ctx[1] === undefined && !("error" in props)) {
      console.warn("<Error> was created without expected prop 'error'");
    }
  }

  get status() {
    throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set status(value) {
    throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get error() {
    throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set error(value) {
    throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/node_modules/@sapper/internal/App.svelte generated by Svelte v3.24.0 */
const {
  Error: Error_1$1
} = globals;

function create_else_block$3(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
  /*level1*/
  ctx[4].props];
  var switch_value =
  /*level1*/
  ctx[4].component;

  function switch_props(ctx) {
    let switch_instance_props = {};

    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props,
      $$inline: true
    };
  }

  if (switch_value) {
    switch_instance = new switch_value(switch_props());
  }

  const block = {
    c: function create() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l: function claim(nodes) {
      if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert_dev(target, switch_instance_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const switch_instance_changes = dirty &
      /*level1*/
      16 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*level1*/
      ctx[4].props)]) : {};

      if (switch_value !== (switch_value =
      /*level1*/
      ctx[4].component)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i: function intro(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block$3.name,
    type: "else",
    source: "(21:1) {:else}",
    ctx
  });
  return block;
} // (19:1) {#if error}


function create_if_block$9(ctx) {
  let error_1;
  let current;
  error_1 = new Error$1({
    props: {
      error:
      /*error*/
      ctx[0],
      status:
      /*status*/
      ctx[1]
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(error_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(error_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(error_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const error_1_changes = {};
      if (dirty &
      /*error*/
      1) error_1_changes.error =
      /*error*/
      ctx[0];
      if (dirty &
      /*status*/
      2) error_1_changes.status =
      /*status*/
      ctx[1];
      error_1.$set(error_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(error_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(error_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(error_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$9.name,
    type: "if",
    source: "(19:1) {#if error}",
    ctx
  });
  return block;
} // (18:0) <Layout segment="{segments[0]}" {...level0.props}>


function create_default_slot$6(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$9, create_else_block$3];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*error*/
    ctx[0]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$6.name,
    type: "slot",
    source: "(18:0) <Layout segment=\\\"{segments[0]}\\\" {...level0.props}>",
    ctx
  });
  return block;
}

function create_fragment$f(ctx) {
  let layout;
  let current;
  const layout_spread_levels = [{
    segment:
    /*segments*/
    ctx[2][0]
  },
  /*level0*/
  ctx[3].props];
  let layout_props = {
    $$slots: {
      default: [create_default_slot$6]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < layout_spread_levels.length; i += 1) {
    layout_props = assign(layout_props, layout_spread_levels[i]);
  }

  layout = new Layout({
    props: layout_props,
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(layout.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(layout.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(layout, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const layout_changes = dirty &
      /*segments, level0*/
      12 ? get_spread_update(layout_spread_levels, [dirty &
      /*segments*/
      4 && {
        segment:
        /*segments*/
        ctx[2][0]
      }, dirty &
      /*level0*/
      8 && get_spread_object(
      /*level0*/
      ctx[3].props)]) : {};

      if (dirty &
      /*$$scope, error, status, level1*/
      83) {
        layout_changes.$$scope = {
          dirty,
          ctx
        };
      }

      layout.$set(layout_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(layout.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(layout.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(layout, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$f.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$f($$self, $$props, $$invalidate) {
  let {
    stores
  } = $$props;
  let {
    error
  } = $$props;
  let {
    status
  } = $$props;
  let {
    segments
  } = $$props;
  let {
    level0
  } = $$props;
  let {
    level1 = null
  } = $$props;
  setContext(CONTEXT_KEY, stores);
  const writable_props = ["stores", "error", "status", "segments", "level0", "level1"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("App", $$slots, []);

  $$self.$set = $$props => {
    if ("stores" in $$props) $$invalidate(5, stores = $$props.stores);
    if ("error" in $$props) $$invalidate(0, error = $$props.error);
    if ("status" in $$props) $$invalidate(1, status = $$props.status);
    if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
    if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
    if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
  };

  $$self.$capture_state = () => ({
    setContext,
    CONTEXT_KEY,
    Layout,
    Error: Error$1,
    stores,
    error,
    status,
    segments,
    level0,
    level1
  });

  $$self.$inject_state = $$props => {
    if ("stores" in $$props) $$invalidate(5, stores = $$props.stores);
    if ("error" in $$props) $$invalidate(0, error = $$props.error);
    if ("status" in $$props) $$invalidate(1, status = $$props.status);
    if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
    if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
    if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [error, status, segments, level0, level1, stores];
}

class App extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {
      stores: 5,
      error: 0,
      status: 1,
      segments: 2,
      level0: 3,
      level1: 4
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "App",
      options,
      id: create_fragment$f.name
    });
    const {
      ctx
    } = this.$$;
    const props = options.props || {};

    if (
    /*stores*/
    ctx[5] === undefined && !("stores" in props)) {
      console.warn("<App> was created without expected prop 'stores'");
    }

    if (
    /*error*/
    ctx[0] === undefined && !("error" in props)) {
      console.warn("<App> was created without expected prop 'error'");
    }

    if (
    /*status*/
    ctx[1] === undefined && !("status" in props)) {
      console.warn("<App> was created without expected prop 'status'");
    }

    if (
    /*segments*/
    ctx[2] === undefined && !("segments" in props)) {
      console.warn("<App> was created without expected prop 'segments'");
    }

    if (
    /*level0*/
    ctx[3] === undefined && !("level0" in props)) {
      console.warn("<App> was created without expected prop 'level0'");
    }
  }

  get stores() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set stores(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get error() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set error(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get status() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set status(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get segments() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set segments(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get level0() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set level0(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get level1() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set level1(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

// This file is generated by Sapper — do not edit it!
const ignore = [];
const components = [{
  js: () => import('./index.a0fe0d94.js'),
  css: []
}, {
  js: () => import('./playroom.19398463.js'),
  css: []
}, {
  js: () => import('./discos.cd0dfd0d.js'),
  css: []
}, {
  js: () => import('./press.29f9150f.js'),
  css: []
}, {
  js: () => import('./news.4cb49547.js'),
  css: []
}, {
  js: () => import('./shop.11ecba4f.js'),
  css: []
}];
const routes = [{
  // index.svelte
  pattern: /^\/$/,
  parts: [{
    i: 0
  }]
}, {
  // playroom.svelte
  pattern: /^\/playroom\/?$/,
  parts: [{
    i: 1
  }]
}, {
  // discos.svelte
  pattern: /^\/discos\/?$/,
  parts: [{
    i: 2
  }]
}, {
  // press.svelte
  pattern: /^\/press\/?$/,
  parts: [{
    i: 3
  }]
}, {
  // news.svelte
  pattern: /^\/news\/?$/,
  parts: [{
    i: 4
  }]
}, {
  // shop.svelte
  pattern: /^\/shop\/?$/,
  parts: [{
    i: 5
  }]
}];

if (typeof window !== 'undefined') {
  import('./sapper-dev-client.4cd68457.js').then(client => {
    client.connect(10000);
  });
}

function goto(href, opts = {
  replaceState: false
}) {
  const target = select_target(new URL(href, document.baseURI));

  if (target) {
    _history[opts.replaceState ? 'replaceState' : 'pushState']({
      id: cid
    }, '', href);

    return navigate(target, null).then(() => {});
  }

  location.href = href;
  return new Promise(f => {}); // never resolves
}

const initial_data = typeof __SAPPER__ !== 'undefined' && __SAPPER__;
let ready = false;
let root_component;
let current_token;
let root_preloaded;
let current_branch = [];
let current_query = '{}';
const stores = {
  page: writable({}),
  preloading: writable(null),
  session: writable(initial_data && initial_data.session)
};
let $session;
let session_dirty;
stores.session.subscribe(async value => {
  $session = value;
  if (!ready) return;
  session_dirty = true;
  const target = select_target(new URL(location.href));
  const token = current_token = {};
  const {
    redirect,
    props,
    branch
  } = await hydrate_target(target);
  if (token !== current_token) return; // a secondary navigation happened while we were loading

  await render(redirect, branch, props, target.page);
});
let prefetching = null;

function set_prefetching(href, promise) {
  prefetching = {
    href,
    promise
  };
}

let target;

function set_target(element) {
  target = element;
}

let uid = 1;

function set_uid(n) {
  uid = n;
}

let cid;

function set_cid(n) {
  cid = n;
}

const _history = typeof history !== 'undefined' ? history : {
  pushState: (state, title, href) => {},
  replaceState: (state, title, href) => {},
  scrollRestoration: ''
};

const scroll_history = {};

function extract_query(search) {
  const query = Object.create(null);

  if (search.length > 0) {
    search.slice(1).split('&').forEach(searchParam => {
      let [, key, value = ''] = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam.replace(/\+/g, ' ')));
      if (typeof query[key] === 'string') query[key] = [query[key]];
      if (typeof query[key] === 'object') query[key].push(value);else query[key] = value;
    });
  }

  return query;
}

function select_target(url) {
  if (url.origin !== location.origin) return null;
  if (!url.pathname.startsWith(initial_data.baseUrl)) return null;
  let path = url.pathname.slice(initial_data.baseUrl.length);

  if (path === '') {
    path = '/';
  } // avoid accidental clashes between server routes and page routes


  if (ignore.some(pattern => pattern.test(path))) return;

  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const match = route.pattern.exec(path);

    if (match) {
      const query = extract_query(url.search);
      const part = route.parts[route.parts.length - 1];
      const params = part.params ? part.params(match) : {};
      const page = {
        host: location.host,
        path,
        query,
        params
      };
      return {
        href: url.href,
        route,
        match,
        page
      };
    }
  }
}

function handle_error(url) {
  const {
    host,
    pathname,
    search
  } = location;
  const {
    session,
    preloaded,
    status,
    error
  } = initial_data;

  if (!root_preloaded) {
    root_preloaded = preloaded && preloaded[0];
  }

  const props = {
    error,
    status,
    session,
    level0: {
      props: root_preloaded
    },
    level1: {
      props: {
        status,
        error
      },
      component: Error$1
    },
    segments: preloaded
  };
  const query = extract_query(search);
  render(null, [], props, {
    host,
    path: pathname,
    query,
    params: {}
  });
}

function scroll_state() {
  return {
    x: pageXOffset,
    y: pageYOffset
  };
}

async function navigate(target, id, noscroll, hash) {
  if (id) {
    // popstate or initial navigation
    cid = id;
  } else {
    const current_scroll = scroll_state(); // clicked on a link. preserve scroll state

    scroll_history[cid] = current_scroll;
    id = cid = ++uid;
    scroll_history[cid] = noscroll ? current_scroll : {
      x: 0,
      y: 0
    };
  }

  cid = id;
  if (root_component) stores.preloading.set(true);
  const loaded = prefetching && prefetching.href === target.href ? prefetching.promise : hydrate_target(target);
  prefetching = null;
  const token = current_token = {};
  const {
    redirect,
    props,
    branch
  } = await loaded;
  if (token !== current_token) return; // a secondary navigation happened while we were loading

  await render(redirect, branch, props, target.page);
  if (document.activeElement) document.activeElement.blur();

  if (!noscroll) {
    let scroll = scroll_history[id];

    if (hash) {
      // scroll is an element id (from a hash), we need to compute y.
      const deep_linked = document.getElementById(hash.slice(1));

      if (deep_linked) {
        scroll = {
          x: 0,
          y: deep_linked.getBoundingClientRect().top
        };
      }
    }

    scroll_history[cid] = scroll;
    if (scroll) scrollTo(scroll.x, scroll.y);
  }
}

async function render(redirect, branch, props, page) {
  if (redirect) return goto(redirect.location, {
    replaceState: true
  });
  stores.page.set(page);
  stores.preloading.set(false);

  if (root_component) {
    root_component.$set(props);
  } else {
    props.stores = {
      page: {
        subscribe: stores.page.subscribe
      },
      preloading: {
        subscribe: stores.preloading.subscribe
      },
      session: stores.session
    };
    props.level0 = {
      props: await root_preloaded
    }; // first load — remove SSR'd <head> contents

    const start = document.querySelector('#sapper-head-start');
    const end = document.querySelector('#sapper-head-end');

    if (start && end) {
      while (start.nextSibling !== end) detach$1(start.nextSibling);

      detach$1(start);
      detach$1(end);
    }

    root_component = new App({
      target,
      props,
      hydrate: true
    });
  }

  current_branch = branch;
  current_query = JSON.stringify(page.query);
  ready = true;
  session_dirty = false;
}

function part_changed(i, segment, match, stringified_query) {
  // TODO only check query string changes for preload functions
  // that do in fact depend on it (using static analysis or
  // runtime instrumentation)
  if (stringified_query !== current_query) return true;
  const previous = current_branch[i];
  if (!previous) return false;
  if (segment !== previous.segment) return true;

  if (previous.match) {
    if (JSON.stringify(previous.match.slice(1, i + 2)) !== JSON.stringify(match.slice(1, i + 2))) {
      return true;
    }
  }
}

async function hydrate_target(target) {
  const {
    route,
    page
  } = target;
  const segments = page.path.split('/').filter(Boolean);
  let redirect = null;
  const props = {
    error: null,
    status: 200,
    segments: [segments[0]]
  };
  const preload_context = {
    fetch: (url, opts) => fetch(url, opts),
    redirect: (statusCode, location) => {
      if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
        throw new Error(`Conflicting redirects`);
      }

      redirect = {
        statusCode,
        location
      };
    },
    error: (status, error) => {
      props.error = typeof error === 'string' ? new Error(error) : error;
      props.status = status;
    }
  };

  if (!root_preloaded) {
    root_preloaded = initial_data.preloaded[0] || preload.call(preload_context, {
      host: page.host,
      path: page.path,
      query: page.query,
      params: {}
    }, $session);
  }

  let branch;
  let l = 1;

  try {
    const stringified_query = JSON.stringify(page.query);
    const match = route.pattern.exec(page.path);
    let segment_dirty = false;
    branch = await Promise.all(route.parts.map(async (part, i) => {
      const segment = segments[i];
      if (part_changed(i, segment, match, stringified_query)) segment_dirty = true;
      props.segments[l] = segments[i + 1]; // TODO make this less confusing

      if (!part) return {
        segment
      };
      const j = l++;

      if (!session_dirty && !segment_dirty && current_branch[i] && current_branch[i].part === part.i) {
        return current_branch[i];
      }

      segment_dirty = false;
      const {
        default: component,
        preload
      } = await load_component(components[part.i]);
      let preloaded;

      if (ready || !initial_data.preloaded[i + 1]) {
        preloaded = preload ? await preload.call(preload_context, {
          host: page.host,
          path: page.path,
          query: page.query,
          params: part.params ? part.params(target.match) : {}
        }, $session) : {};
      } else {
        preloaded = initial_data.preloaded[i + 1];
      }

      return props[`level${j}`] = {
        component,
        props: preloaded,
        segment,
        match,
        part: part.i
      };
    }));
  } catch (error) {
    props.error = error;
    props.status = 500;
    branch = [];
  }

  return {
    redirect,
    props,
    branch
  };
}

function load_css(chunk) {
  const href = `client/${chunk}`;
  if (document.querySelector(`link[href="${href}"]`)) return;
  return new Promise((fulfil, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = () => fulfil();

    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function load_component(component) {
  // TODO this is temporary — once placeholders are
  // always rewritten, scratch the ternary
  const promises = typeof component.css === 'string' ? [] : component.css.map(load_css);
  promises.unshift(component.js());
  return Promise.all(promises).then(values => values[0]);
}

function detach$1(node) {
  node.parentNode.removeChild(node);
}

function prefetch(href) {
  const target = select_target(new URL(href, document.baseURI));

  if (target) {
    if (!prefetching || href !== prefetching.href) {
      set_prefetching(href, hydrate_target(target));
    }

    return prefetching.promise;
  }
}

function start(opts) {
  if ('scrollRestoration' in _history) {
    _history.scrollRestoration = 'manual';
  }

  set_target(opts.target);
  addEventListener('click', handle_click);
  addEventListener('popstate', handle_popstate); // prefetch

  addEventListener('touchstart', trigger_prefetch);
  addEventListener('mousemove', handle_mousemove);
  return Promise.resolve().then(() => {
    const {
      hash,
      href
    } = location;

    _history.replaceState({
      id: uid
    }, '', href);

    const url = new URL(location.href);
    if (initial_data.error) return handle_error();
    const target = select_target(url);
    if (target) return navigate(target, uid, true, hash);
  });
}

let mousemove_timeout;

function handle_mousemove(event) {
  clearTimeout(mousemove_timeout);
  mousemove_timeout = setTimeout(() => {
    trigger_prefetch(event);
  }, 20);
}

function trigger_prefetch(event) {
  const a = find_anchor(event.target);
  if (!a || a.rel !== 'prefetch') return;
  prefetch(a.href);
}

function handle_click(event) {
  // Adapted from https://github.com/visionmedia/page.js
  // MIT license https://github.com/visionmedia/page.js#license
  if (which(event) !== 1) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
  if (event.defaultPrevented) return;
  const a = find_anchor(event.target);
  if (!a) return;
  if (!a.href) return; // check if link is inside an svg
  // in this case, both href and target are always inside an object

  const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
  const href = String(svg ? a.href.baseVal : a.href);

  if (href === location.href) {
    if (!location.hash) event.preventDefault();
    return;
  } // Ignore if tag has
  // 1. 'download' attribute
  // 2. rel='external' attribute


  if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return; // Ignore if <a> has a target

  if (svg ? a.target.baseVal : a.target) return;
  const url = new URL(href); // Don't handle hash changes

  if (url.pathname === location.pathname && url.search === location.search) return;
  const target = select_target(url);

  if (target) {
    const noscroll = a.hasAttribute('sapper-noscroll');
    navigate(target, null, noscroll, url.hash);
    event.preventDefault();

    _history.pushState({
      id: cid
    }, '', url.href);
  }
}

function which(event) {
  return event.which === null ? event.button : event.which;
}

function find_anchor(node) {
  while (node && node.nodeName.toUpperCase() !== 'A') node = node.parentNode; // SVG <a> elements have a lowercase name


  return node;
}

function handle_popstate(event) {
  scroll_history[cid] = scroll_state();

  if (event.state) {
    const url = new URL(location.href);
    const target = select_target(url);

    if (target) {
      navigate(target, event.state.id);
    } else {
      location.href = location.href;
    }
  } else {
    // hashchange
    set_uid(uid + 1);
    set_cid(uid);

    _history.replaceState({
      id: cid
    }, '', location.href);
  }
}

const stores$1 = () => getContext(CONTEXT_KEY);

start({
  target: document.querySelector("#sapper")
});

export { check_outros as A, binding_callbacks as B, svg_element as C, noop as D, prevent_default as E, globals as F, create_component as G, text as H, claim_component as I, claim_text as J, mount_component as K, destroy_component as L, set_style as M, SvelteComponentDev as S, append_dev as a, createEventDispatcher as b, create_slot as c, dispatch_dev as d, element as e, space as f, claim_element as g, children as h, init as i, detach_dev as j, claim_space as k, attr_dev as l, add_location as m, insert_dev as n, onMount as o, listen_dev as p, transition_out as q, run_all as r, safe_not_equal as s, transition_in as t, update_slot as u, validate_slots as v, validate_each_argument as w, destroy_each as x, null_to_empty as y, group_outros as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LjNjYTcxYzljLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9zcmMvdXRpbHMvY2xhc3Nlcy5qcyIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0FwcEJhci9BcHBCYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvSWNvbi9JY29uLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1JpcHBsZS9yaXBwbGUuanMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJzL1RhYkJ1dHRvbi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2Vhc2luZy9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL3RyYW5zaXRpb24vaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFicy9JbmRpY2F0b3Iuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NMaW5lYXIvUHJvZ3Jlc3NMaW5lYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFicy9UYWJzLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0J1dHRvbi9CdXR0b24uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVXRpbC9TY3JpbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9VdGlsL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTGlzdC9MaXN0SXRlbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9MaXN0L0xpc3Quc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2JyZWFrcG9pbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTmF2aWdhdGlvbkRyYXdlci9OYXZpZ2F0aW9uRHJhd2VyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAvVG9vbHRpcC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvdXRpbHMvbWVudS5qcyIsIi4uLy4uLy4uL3NyYy9zdG9yZXMuanMiLCIuLi8uLi8uLi9zcmMvZGFyay5qcyIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19lcnJvci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvQXBwLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9pbnRlcm5hbC9tYW5pZmVzdC1jbGllbnQubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2FwcC5tanMiLCIuLi8uLi8uLi9zcmMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4O1xuZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZvciAoY29uc3QgayBpbiBzcmMpXG4gICAgICAgIHRhcltrXSA9IHNyY1trXTtcbiAgICByZXR1cm4gdGFyO1xufVxuZnVuY3Rpb24gaXNfcHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYWRkX2xvY2F0aW9uKGVsZW1lbnQsIGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhcikge1xuICAgIGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcbiAgICAgICAgbG9jOiB7IGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhciB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJ1bihmbikge1xuICAgIHJldHVybiBmbigpO1xufVxuZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcbiAgICBmbnMuZm9yRWFjaChydW4pO1xufVxuZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gc2FmZV9ub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90KHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbiwgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGNvbnN0IHNsb3RfY2hhbmdlcyA9IGdldF9zbG90X2NoYW5nZXMoc2xvdF9kZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbik7XG4gICAgaWYgKHNsb3RfY2hhbmdlcykge1xuICAgICAgICBjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbiAgICAgICAgc2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gb25jZShmbikge1xuICAgIGxldCByYW4gPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHJhbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSA9IHJldCkge1xuICAgIHN0b3JlLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5mdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcbiAgICByZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgbm93ID0gaXNfY2xpZW50XG4gICAgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICA6ICgpID0+IERhdGUubm93KCk7XG5sZXQgcmFmID0gaXNfY2xpZW50ID8gY2IgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG4vLyB1c2VkIGludGVybmFsbHkgZm9yIHRlc3RpbmdcbmZ1bmN0aW9uIHNldF9ub3coZm4pIHtcbiAgICBub3cgPSBmbjtcbn1cbmZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcbiAgICByYWYgPSBmbjtcbn1cblxuY29uc3QgdGFza3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrLmMobm93KSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFzay5mKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGFza3Muc2l6ZSAhPT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG59XG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKi9cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIHRhc2tzLmNsZWFyKCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKi9cbmZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcbiAgICBsZXQgdGFzaztcbiAgICBpZiAodGFza3Muc2l6ZSA9PT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IHsgYzogY2FsbGJhY2ssIGY6IGZ1bGZpbGwgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc19wcm9wKG9iaiwgaylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICYmIGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbmFtZSk7XG59XG5mdW5jdGlvbiB0ZXh0KGRhdGEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5mdW5jdGlvbiBzcGFjZSgpIHtcbiAgICByZXR1cm4gdGV4dCgnICcpO1xufVxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRleHQoJycpO1xufVxuZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2VsZihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKVxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgIGVsc2UgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgIT09IHZhbHVlKVxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldF9hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhub2RlLl9fcHJvdG9fXyk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoYXR0cmlidXRlc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmNzc1RleHQgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnX192YWx1ZScpIHtcbiAgICAgICAgICAgIG5vZGUudmFsdWUgPSBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVzY3JpcHRvcnNba2V5XSAmJiBkZXNjcmlwdG9yc1trZXldLnNldCkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHhsaW5rX2F0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlKGdyb3VwLCBfX3ZhbHVlLCBjaGVja2VkKSB7XG4gICAgY29uc3QgdmFsdWUgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLmFkZChncm91cFtpXS5fX3ZhbHVlKTtcbiAgICB9XG4gICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgIHZhbHVlLmRlbGV0ZShfX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20odmFsdWUpO1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2orK107XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZW1vdmUubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShyZW1vdmVba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnID8gc3ZnX2VsZW1lbnQobmFtZSkgOiBlbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dChkYXRhKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgel9pbmRleCA9IChwYXJzZUludChjb21wdXRlZF9zdHlsZS56SW5kZXgpIHx8IDApIC0gMTtcbiAgICBpZiAoY29tcHV0ZWRfc3R5bGUucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBpZnJhbWUgPSBlbGVtZW50KCdpZnJhbWUnKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGAgK1xuICAgICAgICBgb3ZlcmZsb3c6IGhpZGRlbjsgYm9yZGVyOiAwOyBvcGFjaXR5OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogJHt6X2luZGV4fTtgKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgY29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuICAgIGxldCB1bnN1YnNjcmliZTtcbiAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9IGBkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5gO1xuICAgICAgICB1bnN1YnNjcmliZSA9IGxpc3Rlbih3aW5kb3csICdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBpZnJhbWUuY29udGVudFdpbmRvdylcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmcmFtZS5zcmMgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICBpZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4oaWZyYW1lLmNvbnRlbnRXaW5kb3csICdyZXNpemUnLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGFwcGVuZChub2RlLCBpZnJhbWUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1bnN1YnNjcmliZSAmJiBpZnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZXRhY2goaWZyYW1lKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdG9nZ2xlX2NsYXNzKGVsZW1lbnQsIG5hbWUsIHRvZ2dsZSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0W3RvZ2dsZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xufVxuZnVuY3Rpb24gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoYW5jaG9yID0gbnVsbCkge1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxuY29uc3QgYWN0aXZlX2RvY3MgPSBuZXcgU2V0KCk7XG5sZXQgYWN0aXZlID0gMDtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBsZXQgaSA9IHN0ci5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5mdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG4gICAgY29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuICAgIGxldCBrZXlmcmFtZXMgPSAne1xcbic7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG4gICAgICAgIGNvbnN0IHQgPSBhICsgKGIgLSBhKSAqIGVhc2UocCk7XG4gICAgICAgIGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG4gICAgfVxuICAgIGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuICAgIGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuICAgIGNvbnN0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICBhY3RpdmVfZG9jcy5hZGQoZG9jKTtcbiAgICBjb25zdCBzdHlsZXNoZWV0ID0gZG9jLl9fc3ZlbHRlX3N0eWxlc2hlZXQgfHwgKGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0ID0gZG9jLmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3R5bGUnKSkuc2hlZXQpO1xuICAgIGNvbnN0IGN1cnJlbnRfcnVsZXMgPSBkb2MuX19zdmVsdGVfcnVsZXMgfHwgKGRvYy5fX3N2ZWx0ZV9ydWxlcyA9IHt9KTtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgY3VycmVudF9ydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6IGBgfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcbiAgICBjb25zdCBuZXh0ID0gcHJldmlvdXMuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKTtcbiAgICBjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG4gICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG4gICAgICAgIGFjdGl2ZSAtPSBkZWxldGVkO1xuICAgICAgICBpZiAoIWFjdGl2ZSlcbiAgICAgICAgICAgIGNsZWFyX3J1bGVzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYWN0aXZlX2RvY3MuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVzaGVldCA9IGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0O1xuICAgICAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICAgICAgZG9jLl9fc3ZlbHRlX3J1bGVzID0ge307XG4gICAgICAgIH0pO1xuICAgICAgICBhY3RpdmVfZG9jcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uYCk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiBmbihldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxubGV0IGZsdXNoaW5nID0gZmFsc2U7XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGlmIChmbHVzaGluZylcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgID8gd2luZG93XG4gICAgOiB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBnbG9iYWxUaGlzXG4gICAgICAgIDogZ2xvYmFsKTtcblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGRpcnR5LCBnZXRfa2V5LCBkeW5hbWljLCBjdHgsIGxpc3QsIGxvb2t1cCwgbm9kZSwgZGVzdHJveSwgY3JlYXRlX2VhY2hfYmxvY2ssIG5leHQsIGdldF9jb250ZXh0KSB7XG4gICAgbGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbiA9IGxpc3QubGVuZ3RoO1xuICAgIGxldCBpID0gbztcbiAgICBjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIG9sZF9pbmRleGVzW29sZF9ibG9ja3NbaV0ua2V5XSA9IGk7XG4gICAgY29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuICAgIGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZGVsdGFzID0gbmV3IE1hcCgpO1xuICAgIGkgPSBuO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgY2hpbGRfY3R4ID0gZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgYmxvY2sgPSBsb29rdXAuZ2V0KGtleSk7XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgIGJsb2NrID0gY3JlYXRlX2VhY2hfYmxvY2soa2V5LCBjaGlsZF9jdHgpO1xuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWMpIHtcbiAgICAgICAgICAgIGJsb2NrLnAoY2hpbGRfY3R4LCBkaXJ0eSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICByZXR1cm4gbmV3X2Jsb2Nrcztcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfa2V5cyhjdHgsIGxpc3QsIGdldF9jb250ZXh0LCBnZXRfa2V5KSB7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpKTtcbiAgICAgICAgaWYgKGtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhdmUgZHVwbGljYXRlIGtleXMgaW4gYSBrZXllZCBlYWNoYCk7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5hZGQoa2V5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldF9zcHJlYWRfdXBkYXRlKGxldmVscywgdXBkYXRlcykge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHt9O1xuICAgIGNvbnN0IHRvX251bGxfb3V0ID0ge307XG4gICAgY29uc3QgYWNjb3VudGVkX2ZvciA9IHsgJCRzY29wZTogMSB9O1xuICAgIGxldCBpID0gbGV2ZWxzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IG8gPSBsZXZlbHNbaV07XG4gICAgICAgIGNvbnN0IG4gPSB1cGRhdGVzW2ldO1xuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBuKSlcbiAgICAgICAgICAgICAgICAgICAgdG9fbnVsbF9vdXRba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhY2NvdW50ZWRfZm9yW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlW2tleV0gPSBuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWxzW2ldID0gbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRvX251bGxfb3V0KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB1cGRhdGUpKVxuICAgICAgICAgICAgdXBkYXRlW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG59XG5mdW5jdGlvbiBnZXRfc3ByZWFkX29iamVjdChzcHJlYWRfcHJvcHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHNwcmVhZF9wcm9wcyA9PT0gJ29iamVjdCcgJiYgc3ByZWFkX3Byb3BzICE9PSBudWxsID8gc3ByZWFkX3Byb3BzIDoge307XG59XG5cbi8vIHNvdXJjZTogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sXG5jb25zdCBib29sZWFuX2F0dHJpYnV0ZXMgPSBuZXcgU2V0KFtcbiAgICAnYWxsb3dmdWxsc2NyZWVuJyxcbiAgICAnYWxsb3dwYXltZW50cmVxdWVzdCcsXG4gICAgJ2FzeW5jJyxcbiAgICAnYXV0b2ZvY3VzJyxcbiAgICAnYXV0b3BsYXknLFxuICAgICdjaGVja2VkJyxcbiAgICAnY29udHJvbHMnLFxuICAgICdkZWZhdWx0JyxcbiAgICAnZGVmZXInLFxuICAgICdkaXNhYmxlZCcsXG4gICAgJ2Zvcm1ub3ZhbGlkYXRlJyxcbiAgICAnaGlkZGVuJyxcbiAgICAnaXNtYXAnLFxuICAgICdsb29wJyxcbiAgICAnbXVsdGlwbGUnLFxuICAgICdtdXRlZCcsXG4gICAgJ25vbW9kdWxlJyxcbiAgICAnbm92YWxpZGF0ZScsXG4gICAgJ29wZW4nLFxuICAgICdwbGF5c2lubGluZScsXG4gICAgJ3JlYWRvbmx5JyxcbiAgICAncmVxdWlyZWQnLFxuICAgICdyZXZlcnNlZCcsXG4gICAgJ3NlbGVjdGVkJ1xuXSk7XG5cbmNvbnN0IGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyID0gL1tcXHMnXCI+Lz1cXHV7RkREMH0tXFx1e0ZERUZ9XFx1e0ZGRkV9XFx1e0ZGRkZ9XFx1ezFGRkZFfVxcdXsxRkZGRn1cXHV7MkZGRkV9XFx1ezJGRkZGfVxcdXszRkZGRX1cXHV7M0ZGRkZ9XFx1ezRGRkZFfVxcdXs0RkZGRn1cXHV7NUZGRkV9XFx1ezVGRkZGfVxcdXs2RkZGRX1cXHV7NkZGRkZ9XFx1ezdGRkZFfVxcdXs3RkZGRn1cXHV7OEZGRkV9XFx1ezhGRkZGfVxcdXs5RkZGRX1cXHV7OUZGRkZ9XFx1e0FGRkZFfVxcdXtBRkZGRn1cXHV7QkZGRkV9XFx1e0JGRkZGfVxcdXtDRkZGRX1cXHV7Q0ZGRkZ9XFx1e0RGRkZFfVxcdXtERkZGRn1cXHV7RUZGRkV9XFx1e0VGRkZGfVxcdXtGRkZGRX1cXHV7RkZGRkZ9XFx1ezEwRkZGRX1cXHV7MTBGRkZGfV0vdTtcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2F0dHJpYnV0ZXMtMlxuLy8gaHR0cHM6Ly9pbmZyYS5zcGVjLndoYXR3Zy5vcmcvI25vbmNoYXJhY3RlclxuZnVuY3Rpb24gc3ByZWFkKGFyZ3MsIGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5jbGFzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzID0gY2xhc3Nlc190b19hZGQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzICs9ICcgJyArIGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICBlbHNlIGlmIChib29sZWFuX2F0dHJpYnV0ZXMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN0ciArPSBgICR7bmFtZX09XCIke1N0cmluZyh2YWx1ZSkucmVwbGFjZSgvXCIvZywgJyYjMzQ7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgZXNjYXBlZCA9IHtcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0Oydcbn07XG5mdW5jdGlvbiBlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBTdHJpbmcoaHRtbCkucmVwbGFjZSgvW1wiJyY8Pl0vZywgbWF0Y2ggPT4gZXNjYXBlZFttYXRjaF0pO1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cykge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBgICR7bmFtZX0ke3ZhbHVlID09PSB0cnVlID8gJycgOiBgPSR7dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KGVzY2FwZSh2YWx1ZSkpIDogYFwiJHt2YWx1ZX1cImB9YH1gO1xufVxuZnVuY3Rpb24gYWRkX2NsYXNzZXMoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzID8gYCBjbGFzcz1cIiR7Y2xhc3Nlc31cImAgOiBgYDtcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBvbl9tb3VudCwgb25fZGVzdHJveSwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG4gICAgZnJhZ21lbnQgJiYgZnJhZ21lbnQubSh0YXJnZXQsIGFuY2hvcik7XG4gICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdfb25fZGVzdHJveSA9IG9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgIGlmIChvbl9kZXN0cm95KSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG4gICAgICAgICAgICBydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcbiAgICB9KTtcbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCBwcm9wX3ZhbHVlcyA9IG9wdGlvbnMucHJvcHMgfHwge307XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQgPSB7XG4gICAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgICBjdHg6IG51bGwsXG4gICAgICAgIC8vIHN0YXRlXG4gICAgICAgIHByb3BzLFxuICAgICAgICB1cGRhdGU6IG5vb3AsXG4gICAgICAgIG5vdF9lcXVhbCxcbiAgICAgICAgYm91bmQ6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICAvLyBsaWZlY3ljbGVcbiAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICBvbl9kZXN0cm95OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5XG4gICAgfTtcbiAgICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgICAkJC5jdHggPSBpbnN0YW5jZVxuICAgICAgICA/IGluc3RhbmNlKGNvbXBvbmVudCwgcHJvcF92YWx1ZXMsIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5sKG5vZGVzKTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZGV0YWNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4yNC4wJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0RGF0YVwiLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25gKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuJGRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHdhcyBhbHJlYWR5IGRlc3Ryb3llZGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJGNhcHR1cmVfc3RhdGUoKSB7IH1cbiAgICAkaW5qZWN0X3N0YXRlKCkgeyB9XG59XG5mdW5jdGlvbiBsb29wX2d1YXJkKHRpbWVvdXQpIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSBzdGFydCA+IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5maW5pdGUgbG9vcCBkZXRlY3RlZGApO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgSHRtbFRhZywgU3ZlbHRlQ29tcG9uZW50LCBTdmVsdGVDb21wb25lbnREZXYsIFN2ZWx0ZUVsZW1lbnQsIGFjdGlvbl9kZXN0cm95ZXIsIGFkZF9hdHRyaWJ1dGUsIGFkZF9jbGFzc2VzLCBhZGRfZmx1c2hfY2FsbGJhY2ssIGFkZF9sb2NhdGlvbiwgYWRkX3JlbmRlcl9jYWxsYmFjaywgYWRkX3Jlc2l6ZV9saXN0ZW5lciwgYWRkX3RyYW5zZm9ybSwgYWZ0ZXJVcGRhdGUsIGFwcGVuZCwgYXBwZW5kX2RldiwgYXNzaWduLCBhdHRyLCBhdHRyX2RldiwgYmVmb3JlVXBkYXRlLCBiaW5kLCBiaW5kaW5nX2NhbGxiYWNrcywgYmxhbmtfb2JqZWN0LCBidWJibGUsIGNoZWNrX291dHJvcywgY2hpbGRyZW4sIGNsYWltX2NvbXBvbmVudCwgY2xhaW1fZWxlbWVudCwgY2xhaW1fc3BhY2UsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZXNjYXBlLCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldENvbnRleHQsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHQsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNfcHJvcCwgaWRlbnRpdHksIGluaXQsIGluc2VydCwgaW5zZXJ0X2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZnVuY3Rpb24sIGlzX3Byb21pc2UsIGxpc3RlbiwgbGlzdGVuX2RldiwgbG9vcCwgbG9vcF9ndWFyZCwgbWlzc2luZ19jb21wb25lbnQsIG1vdW50X2NvbXBvbmVudCwgbm9vcCwgbm90X2VxdWFsLCBub3csIG51bGxfdG9fZW1wdHksIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMsIG9uRGVzdHJveSwgb25Nb3VudCwgb25jZSwgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIHByZXZlbnRfZGVmYXVsdCwgcHJvcF9kZXYsIHF1ZXJ5X3NlbGVjdG9yX2FsbCwgcmFmLCBydW4sIHJ1bl9hbGwsIHNhZmVfbm90X2VxdWFsLCBzY2hlZHVsZV91cGRhdGUsIHNlbGVjdF9tdWx0aXBsZV92YWx1ZSwgc2VsZWN0X29wdGlvbiwgc2VsZWN0X29wdGlvbnMsIHNlbGVjdF92YWx1ZSwgc2VsZiwgc2V0Q29udGV4dCwgc2V0X2F0dHJpYnV0ZXMsIHNldF9jdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEsIHNldF9kYXRhLCBzZXRfZGF0YV9kZXYsIHNldF9pbnB1dF90eXBlLCBzZXRfaW5wdXRfdmFsdWUsIHNldF9ub3csIHNldF9yYWYsIHNldF9zdG9yZV92YWx1ZSwgc2V0X3N0eWxlLCBzZXRfc3ZnX2F0dHJpYnV0ZXMsIHNwYWNlLCBzcHJlYWQsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3Nsb3RzLCB2YWxpZGF0ZV9zdG9yZSwgeGxpbmtfYXR0ciB9O1xuIiwiaW1wb3J0IHsgbm9vcCwgc2FmZV9ub3RfZXF1YWwsIHN1YnNjcmliZSwgcnVuX2FsbCwgaXNfZnVuY3Rpb24gfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5leHBvcnQgeyBnZXRfc3RvcmVfdmFsdWUgYXMgZ2V0IH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG5jb25zdCBzdWJzY3JpYmVyX3F1ZXVlID0gW107XG4vKipcbiAqIENyZWF0ZXMgYSBgUmVhZGFibGVgIHN0b3JlIHRoYXQgYWxsb3dzIHJlYWRpbmcgYnkgc3Vic2NyaXB0aW9uLlxuICogQHBhcmFtIHZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXJ9c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiByZWFkYWJsZSh2YWx1ZSwgc3RhcnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmU6IHdyaXRhYmxlKHZhbHVlLCBzdGFydCkuc3Vic2NyaWJlLFxuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZSBhIGBXcml0YWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgYm90aCB1cGRhdGluZyBhbmQgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0geyo9fXZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXI9fXN0YXJ0IHN0YXJ0IGFuZCBzdG9wIG5vdGlmaWNhdGlvbnMgZm9yIHN1YnNjcmlwdGlvbnNcbiAqL1xuZnVuY3Rpb24gd3JpdGFibGUodmFsdWUsIHN0YXJ0ID0gbm9vcCkge1xuICAgIGxldCBzdG9wO1xuICAgIGNvbnN0IHN1YnNjcmliZXJzID0gW107XG4gICAgZnVuY3Rpb24gc2V0KG5ld192YWx1ZSkge1xuICAgICAgICBpZiAoc2FmZV9ub3RfZXF1YWwodmFsdWUsIG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICAgICAgaWYgKHN0b3ApIHsgLy8gc3RvcmUgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICBjb25zdCBydW5fcXVldWUgPSAhc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHNbMV0oKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5wdXNoKHMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bl9xdWV1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJfcXVldWUubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWVbaV1bMF0oc3Vic2NyaWJlcl9xdWV1ZVtpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG4gICAgICAgIHNldChmbih2YWx1ZSkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUocnVuLCBpbnZhbGlkYXRlID0gbm9vcCkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gW3J1biwgaW52YWxpZGF0ZV07XG4gICAgICAgIHN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydChzZXQpIHx8IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgcnVuKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaWJlcnMuaW5kZXhPZihzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICBzdG9wID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc2V0LCB1cGRhdGUsIHN1YnNjcmliZSB9O1xufVxuZnVuY3Rpb24gZGVyaXZlZChzdG9yZXMsIGZuLCBpbml0aWFsX3ZhbHVlKSB7XG4gICAgY29uc3Qgc2luZ2xlID0gIUFycmF5LmlzQXJyYXkoc3RvcmVzKTtcbiAgICBjb25zdCBzdG9yZXNfYXJyYXkgPSBzaW5nbGVcbiAgICAgICAgPyBbc3RvcmVzXVxuICAgICAgICA6IHN0b3JlcztcbiAgICBjb25zdCBhdXRvID0gZm4ubGVuZ3RoIDwgMjtcbiAgICByZXR1cm4gcmVhZGFibGUoaW5pdGlhbF92YWx1ZSwgKHNldCkgPT4ge1xuICAgICAgICBsZXQgaW5pdGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgcGVuZGluZyA9IDA7XG4gICAgICAgIGxldCBjbGVhbnVwID0gbm9vcDtcbiAgICAgICAgY29uc3Qgc3luYyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm4oc2luZ2xlID8gdmFsdWVzWzBdIDogdmFsdWVzLCBzZXQpO1xuICAgICAgICAgICAgaWYgKGF1dG8pIHtcbiAgICAgICAgICAgICAgICBzZXQocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFudXAgPSBpc19mdW5jdGlvbihyZXN1bHQpID8gcmVzdWx0IDogbm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdW5zdWJzY3JpYmVycyA9IHN0b3Jlc19hcnJheS5tYXAoKHN0b3JlLCBpKSA9PiBzdWJzY3JpYmUoc3RvcmUsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgICBwZW5kaW5nICY9IH4oMSA8PCBpKTtcbiAgICAgICAgICAgIGlmIChpbml0ZWQpIHtcbiAgICAgICAgICAgICAgICBzeW5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHBlbmRpbmcgfD0gKDEgPDwgaSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgc3luYygpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgICAgIHJ1bl9hbGwodW5zdWJzY3JpYmVycyk7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IGRlcml2ZWQsIHJlYWRhYmxlLCB3cml0YWJsZSB9O1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9LRVkgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHByZWxvYWQgPSAoKSA9PiAoe30pOyIsImNvbnN0IG5vRGVwdGggPSBbXCJ3aGl0ZVwiLCBcImJsYWNrXCIsIFwidHJhbnNwYXJlbnRcIl07XG5cbmZ1bmN0aW9uIGdldENsYXNzKHByb3AsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSB7XG4gIGlmIChub0RlcHRoLmluY2x1ZGVzKGNvbG9yKSkge1xuICAgIHJldHVybiBgJHtwcm9wfS0ke2NvbG9yfWA7XG4gIH1cbiAgcmV0dXJuIGAke3Byb3B9LSR7Y29sb3J9LSR7ZGVwdGggfHwgZGVmYXVsdERlcHRofSBgO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1dGlscyhjb2xvciwgZGVmYXVsdERlcHRoID0gNTAwKSB7XG4gIHJldHVybiB7XG4gICAgYmc6IGRlcHRoID0+IGdldENsYXNzKFwiYmdcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpLFxuICAgIGJvcmRlcjogZGVwdGggPT4gZ2V0Q2xhc3MoXCJib3JkZXJcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpLFxuICAgIHR4dDogZGVwdGggPT4gZ2V0Q2xhc3MoXCJ0ZXh0XCIsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSxcbiAgICBjYXJldDogZGVwdGggPT4gZ2V0Q2xhc3MoXCJjYXJldFwiLCBjb2xvciwgZGVwdGgsIGRlZmF1bHREZXB0aClcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKGNsYXNzZXMsIGRlZmF1bHRDbGFzc2VzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9XG4gICAgICAodHlwZW9mIGNsYXNzZXMgPT09IFwiZnVuY3Rpb25cIiA/IGNsYXNzZXMoZGVmYXVsdENsYXNzZXMpIDogY2xhc3NlcykgfHxcbiAgICAgIGRlZmF1bHRDbGFzc2VzO1xuXG4gICAgdGhpcy5jbGFzc2VzID0gdGhpcy5kZWZhdWx0cztcbiAgfVxuXG4gIGZsdXNoKCkge1xuICAgIHRoaXMuY2xhc3NlcyA9IHRoaXMuZGVmYXVsdHM7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV4dGVuZCguLi5mbnMpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc2VzO1xuICB9XG5cbiAgcmVwbGFjZShjbGFzc2VzLCBjb25kID0gdHJ1ZSkge1xuICAgIGlmIChjb25kICYmIGNsYXNzZXMpIHtcbiAgICAgIHRoaXMuY2xhc3NlcyA9IE9iamVjdC5rZXlzKGNsYXNzZXMpLnJlZHVjZShcbiAgICAgICAgKGFjYywgZnJvbSkgPT4gYWNjLnJlcGxhY2UobmV3IFJlZ0V4cChmcm9tLCBcImdcIiksIGNsYXNzZXNbZnJvbV0pLFxuICAgICAgICB0aGlzLmNsYXNzZXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmUoY2xhc3NlcywgY29uZCA9IHRydWUpIHtcbiAgICBpZiAoY29uZCAmJiBjbGFzc2VzKSB7XG4gICAgICB0aGlzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIC5zcGxpdChcIiBcIilcbiAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXIpID0+IGFjYy5yZXBsYWNlKG5ldyBSZWdFeHAoY3VyLCBcImdcIiksIFwiXCIpLFxuICAgICAgICAgIHRoaXMuY2xhc3Nlc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkKGNsYXNzTmFtZSwgY29uZCA9IHRydWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICghY29uZCB8fCAhY2xhc3NOYW1lKSByZXR1cm4gdGhpcztcblxuICAgIHN3aXRjaCAodHlwZW9mIGNsYXNzTmFtZSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5jbGFzc2VzICs9IGAgJHtjbGFzc05hbWV9IGA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgIHRoaXMuY2xhc3NlcyArPSBgICR7Y2xhc3NOYW1lKGRlZmF1bHRWYWx1ZSB8fCB0aGlzLmNsYXNzZXMpfSBgO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFJlc2VydmVkID0gW1wiY2xhc3NcIiwgXCJhZGRcIiwgXCJyZW1vdmVcIiwgXCJyZXBsYWNlXCIsIFwidmFsdWVcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJQcm9wcyhyZXNlcnZlZCwgcHJvcHMpIHtcbiAgY29uc3QgciA9IFsuLi5yZXNlcnZlZCwgLi4uZGVmYXVsdFJlc2VydmVkXTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShcbiAgICAoYWNjLCBjdXIpID0+XG4gICAgICBjdXIuaW5jbHVkZXMoXCIkJFwiKSB8fCBjdXIuaW5jbHVkZXMoXCJDbGFzc1wiKSB8fCByLmluY2x1ZGVzKGN1cilcbiAgICAgICAgPyBhY2NcbiAgICAgICAgOiB7IC4uLmFjYywgW2N1cl06IHByb3BzW2N1cl0gfSxcbiAgICB7fVxuICApO1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuXG5cblxuICBsZXQgY2xhc3Nlc0RlZmF1bHQgPVxuICAgIFwiZml4ZWQgdG9wLTAgdy1mdWxsIGl0ZW1zLWNlbnRlciBmbGV4IG5vLXdyYXAgZmxleCBsZWZ0LTAgei0zMCBwLTAgaC0xNiBlbGV2YXRpb24tMyBiZy1wcmltYXJ5LTMwMCBkYXJrOmJnLWRhcmstNjAwXCI7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICAkOiBjID0gY2IuZmx1c2goKS5hZGQoJCRwcm9wcy5jbGFzcykuZ2V0KCk7XG48L3NjcmlwdD5cblxuPGhlYWRlciBjbGFzcz17Y30+XG4gIDxzbG90IC8+XG48L2hlYWRlcj5cbiIsIjxzY3JpcHQ+XG5cblxuICBleHBvcnQgbGV0IHNtYWxsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgeHMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCByZXZlcnNlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGlwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcImRlZmF1bHRcIjtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5yZXZlcnNlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICB9XG5cbiAgLnRpcCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuICB9XG48L3N0eWxlPlxuXG48aVxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGljb24gdGV4dC14bCBzZWxlY3Qtbm9uZSB7JCRwcm9wcy5jbGFzc30gZHVyYXRpb24tMjAwIGVhc2UtaW5cIlxuICBjbGFzczpyZXZlcnNlXG4gIGNsYXNzOnRpcFxuICBvbjpjbGlja1xuICBjbGFzczp0ZXh0LWJhc2U9e3NtYWxsfVxuICBjbGFzczp0ZXh0LXhzPXt4c31cbiAgc3R5bGU9e2NvbG9yID8gYGNvbG9yOiAke2NvbG9yfWAgOiAnJ30+XG4gIDxzbG90IC8+XG48L2k+XG4iLCIvLyBUaGFua3MgTGFnZGVuISBodHRwczovL3N2ZWx0ZS5kZXYvcmVwbC82MWQ5MTc4ZDJiOTk0NGYyYWEyYmZlMzE2MTJhYjA5Zj92ZXJzaW9uPTMuNi43XG5mdW5jdGlvbiByaXBwbGUoY29sb3IsIGNlbnRlcmVkKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgY29uc3QgZCA9IE1hdGgubWF4KHRhcmdldC5jbGllbnRXaWR0aCwgdGFyZ2V0LmNsaWVudEhlaWdodCk7XG5cbiAgICBjb25zdCByZW1vdmVDaXJjbGUgPSAoKSA9PiB7XG4gICAgICBjaXJjbGUucmVtb3ZlKCk7XG4gICAgICBjaXJjbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCByZW1vdmVDaXJjbGUpO1xuICAgIH07XG5cbiAgICBjaXJjbGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCByZW1vdmVDaXJjbGUpO1xuICAgIGNpcmNsZS5zdHlsZS53aWR0aCA9IGNpcmNsZS5zdHlsZS5oZWlnaHQgPSBgJHtkfXB4YDtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgaWYgKGNlbnRlcmVkKSB7XG4gICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgXCJhYnNvbHV0ZVwiLFxuICAgICAgICBcInRvcC0wXCIsXG4gICAgICAgIFwibGVmdC0wXCIsXG4gICAgICAgIFwicmlwcGxlLWNlbnRlcmVkXCIsXG4gICAgICAgIGBiZy0ke2NvbG9yfS10cmFuc0RhcmtgXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaXJjbGUuc3R5bGUubGVmdCA9IGAke2V2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBkIC8gMn1weGA7XG4gICAgICBjaXJjbGUuc3R5bGUudG9wID0gYCR7ZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gZCAvIDJ9cHhgO1xuXG4gICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZChcInJpcHBsZS1ub3JtYWxcIiwgYGJnLSR7Y29sb3J9LXRyYW5zYCk7XG4gICAgfVxuXG4gICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJyaXBwbGVcIik7XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcihjb2xvciA9IFwicHJpbWFyeVwiLCBjZW50ZXJlZCA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgY29uc3Qgb25Nb3VzZURvd24gPSByaXBwbGUoY29sb3IsIGNlbnRlcmVkKTtcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Nb3VzZURvd24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9uRGVzdHJveTogKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uTW91c2VEb3duKSxcbiAgICB9O1xuICB9O1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IEljb24gZnJvbSBcIi4uL0ljb25cIjtcbiAgaW1wb3J0IGNyZWF0ZVJpcHBsZSBmcm9tIFwiLi4vUmlwcGxlL3JpcHBsZS5qc1wiO1xuICBpbXBvcnQgdXRpbHMsIHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwiZHVyYXRpb24tMTAwIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiB0ZXh0LWNlbnRlciB3LWZ1bGwgaC1mdWxsIHAtNCBjdXJzb3ItcG9pbnRlciBmbGV4IG14LWF1dG8gaXRlbXMtY2VudGVyIHRleHQtc20gaC1mdWxsXCI7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG5cbiAgZXhwb3J0IGxldCBpY29uID0gXCJcIjtcbiAgZXhwb3J0IGxldCBpZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdGV4dCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdG8gPSBcIlwiO1xuICBleHBvcnQgbGV0IHNlbGVjdGVkID0gXCJcIjtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwicHJpbWFyeVwiO1xuICBleHBvcnQgbGV0IG5vdFNlbGVjdGVkQ29sb3IgPSBcIndoaXRlXCI7XG4gIGV4cG9ydCBsZXQgdGFiQ2xhc3NlcyA9IFwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgY29udGVudC1jZW50ZXIgbXgtYXV0b1wiO1xuXG5cblxuXG4gIGNvbnN0IHJpcHBsZSA9IGNyZWF0ZVJpcHBsZShjb2xvcik7XG5cbiAgY29uc3QgeyB0eHQsIGJnIH0gPSB1dGlscyhjb2xvcik7XG4gIGNvbnN0IG5vdFNlbGVjdGVkID0gdXRpbHMobm90U2VsZWN0ZWRDb2xvcik7XG5cbiAgJDogdGV4dENvbG9yID0gc2VsZWN0ZWQgPT09IGlkID8gdHh0KCkgOiBub3RTZWxlY3RlZC50eHQoKTtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5hZGQoXCJ1cHBlcmNhc2VcIiwgaWNvbilcbiAgICAuYWRkKHRleHRDb2xvcilcbiAgICAuYWRkKGBob3ZlcjpiZy0ke2NvbG9yfS10cmFuc0xpZ2h0IGhvdmVyOiR7dHh0KDkwMCl9YClcbiAgICAuZ2V0KCk7XG48L3NjcmlwdD5cblxueyNpZiB0b31cbiAgPGFcbiAgICB1c2U6cmlwcGxlXG4gICAgaHJlZj17dG99XG4gICAgY2xhc3M9e2N9XG4gICAgb246Y2xpY2tcbiAgPlxuICAgIDxkaXYgY2xhc3M9e3RhYkNsYXNzZXN9PlxuICAgICAgeyNpZiBpY29ufVxuICAgICAgICA8SWNvbiBjbGFzcz1cIm1iLTFcIiBjb2xvcj17dGV4dENvbG9yfT57aWNvbn08L0ljb24+XG4gICAgICB7L2lmfVxuXG4gICAgICA8ZGl2PlxuICAgICAgICA8c2xvdD57dGV4dH08L3Nsb3Q+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9hPlxuezplbHNlfVxuICA8bGlcbiAgICB1c2U6cmlwcGxlXG4gICAgY2xhc3M9e2N9XG4gICAgb246Y2xpY2s9eygpID0+IHNlbGVjdGVkID0gaWQgfVxuICAgIG9uOmNsaWNrXG4gID5cbiAgICA8ZGl2IGNsYXNzPXt0YWJDbGFzc2VzfT5cbiAgICAgIHsjaWYgaWNvbn1cbiAgICAgICAgPEljb24gY2xhc3M9XCJtYi0xXCIgY29sb3I9e3RleHRDb2xvcn0+e2ljb259PC9JY29uPlxuICAgICAgey9pZn1cblxuICAgICAgPGRpdj5cbiAgICAgICAgPHNsb3Q+e3RleHR9PC9zbG90PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvbGk+XG57L2lmfVxuIiwiZXhwb3J0IHsgaWRlbnRpdHkgYXMgbGluZWFyIH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG4vKlxuQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0ZGVzbFxuRGlzdHJpYnV0ZWQgdW5kZXIgTUlUIExpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL21hdHRkZXNsL2Vhc2VzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiovXG5mdW5jdGlvbiBiYWNrSW5PdXQodCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4ICogMS41MjU7XG4gICAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqICh0ICogdCAqICgocyArIDEpICogdCAtIHMpKTtcbiAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqICgocyArIDEpICogdCArIHMpICsgMik7XG59XG5mdW5jdGlvbiBiYWNrSW4odCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4O1xuICAgIHJldHVybiB0ICogdCAqICgocyArIDEpICogdCAtIHMpO1xufVxuZnVuY3Rpb24gYmFja091dCh0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTg7XG4gICAgcmV0dXJuIC0tdCAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDE7XG59XG5mdW5jdGlvbiBib3VuY2VPdXQodCkge1xuICAgIGNvbnN0IGEgPSA0LjAgLyAxMS4wO1xuICAgIGNvbnN0IGIgPSA4LjAgLyAxMS4wO1xuICAgIGNvbnN0IGMgPSA5LjAgLyAxMC4wO1xuICAgIGNvbnN0IGNhID0gNDM1Ni4wIC8gMzYxLjA7XG4gICAgY29uc3QgY2IgPSAzNTQ0Mi4wIC8gMTgwNS4wO1xuICAgIGNvbnN0IGNjID0gMTYwNjEuMCAvIDE4MDUuMDtcbiAgICBjb25zdCB0MiA9IHQgKiB0O1xuICAgIHJldHVybiB0IDwgYVxuICAgICAgICA/IDcuNTYyNSAqIHQyXG4gICAgICAgIDogdCA8IGJcbiAgICAgICAgICAgID8gOS4wNzUgKiB0MiAtIDkuOSAqIHQgKyAzLjRcbiAgICAgICAgICAgIDogdCA8IGNcbiAgICAgICAgICAgICAgICA/IGNhICogdDIgLSBjYiAqIHQgKyBjY1xuICAgICAgICAgICAgICAgIDogMTAuOCAqIHQgKiB0IC0gMjAuNTIgKiB0ICsgMTAuNzI7XG59XG5mdW5jdGlvbiBib3VuY2VJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjVcbiAgICAgICAgPyAwLjUgKiAoMS4wIC0gYm91bmNlT3V0KDEuMCAtIHQgKiAyLjApKVxuICAgICAgICA6IDAuNSAqIGJvdW5jZU91dCh0ICogMi4wIC0gMS4wKSArIDAuNTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUluKHQpIHtcbiAgICByZXR1cm4gMS4wIC0gYm91bmNlT3V0KDEuMCAtIHQpO1xufVxuZnVuY3Rpb24gY2lyY0luT3V0KHQpIHtcbiAgICBpZiAoKHQgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHQgKiB0KSAtIDEpO1xuICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodCAtPSAyKSAqIHQpICsgMSk7XG59XG5mdW5jdGlvbiBjaXJjSW4odCkge1xuICAgIHJldHVybiAxLjAgLSBNYXRoLnNxcnQoMS4wIC0gdCAqIHQpO1xufVxuZnVuY3Rpb24gY2lyY091dCh0KSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCgxIC0gLS10ICogdCk7XG59XG5mdW5jdGlvbiBjdWJpY0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDQuMCAqIHQgKiB0ICogdCA6IDAuNSAqIE1hdGgucG93KDIuMCAqIHQgLSAyLjAsIDMuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBjdWJpY0luKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0O1xufVxuZnVuY3Rpb24gY3ViaWNPdXQodCkge1xuICAgIGNvbnN0IGYgPSB0IC0gMS4wO1xuICAgIHJldHVybiBmICogZiAqIGYgKyAxLjA7XG59XG5mdW5jdGlvbiBlbGFzdGljSW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41XG4gICAgICAgID8gMC41ICpcbiAgICAgICAgICAgIE1hdGguc2luKCgoKzEzLjAgKiBNYXRoLlBJKSAvIDIpICogMi4wICogdCkgKlxuICAgICAgICAgICAgTWF0aC5wb3coMi4wLCAxMC4wICogKDIuMCAqIHQgLSAxLjApKVxuICAgICAgICA6IDAuNSAqXG4gICAgICAgICAgICBNYXRoLnNpbigoKC0xMy4wICogTWF0aC5QSSkgLyAyKSAqICgyLjAgKiB0IC0gMS4wICsgMS4wKSkgKlxuICAgICAgICAgICAgTWF0aC5wb3coMi4wLCAtMTAuMCAqICgyLjAgKiB0IC0gMS4wKSkgK1xuICAgICAgICAgICAgMS4wO1xufVxuZnVuY3Rpb24gZWxhc3RpY0luKHQpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4oKDEzLjAgKiB0ICogTWF0aC5QSSkgLyAyKSAqIE1hdGgucG93KDIuMCwgMTAuMCAqICh0IC0gMS4wKSk7XG59XG5mdW5jdGlvbiBlbGFzdGljT3V0KHQpIHtcbiAgICByZXR1cm4gKE1hdGguc2luKCgtMTMuMCAqICh0ICsgMS4wKSAqIE1hdGguUEkpIC8gMikgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogdCkgKyAxLjApO1xufVxuZnVuY3Rpb24gZXhwb0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMC4wIHx8IHQgPT09IDEuMFxuICAgICAgICA/IHRcbiAgICAgICAgOiB0IDwgMC41XG4gICAgICAgICAgICA/ICswLjUgKiBNYXRoLnBvdygyLjAsIDIwLjAgKiB0IC0gMTAuMClcbiAgICAgICAgICAgIDogLTAuNSAqIE1hdGgucG93KDIuMCwgMTAuMCAtIHQgKiAyMC4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIGV4cG9Jbih0KSB7XG4gICAgcmV0dXJuIHQgPT09IDAuMCA/IHQgOiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpO1xufVxuZnVuY3Rpb24gZXhwb091dCh0KSB7XG4gICAgcmV0dXJuIHQgPT09IDEuMCA/IHQgOiAxLjAgLSBNYXRoLnBvdygyLjAsIC0xMC4wICogdCk7XG59XG5mdW5jdGlvbiBxdWFkSW5PdXQodCkge1xuICAgIHQgLz0gMC41O1xuICAgIGlmICh0IDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0O1xuICAgIHQtLTtcbiAgICByZXR1cm4gLTAuNSAqICh0ICogKHQgLSAyKSAtIDEpO1xufVxuZnVuY3Rpb24gcXVhZEluKHQpIHtcbiAgICByZXR1cm4gdCAqIHQ7XG59XG5mdW5jdGlvbiBxdWFkT3V0KHQpIHtcbiAgICByZXR1cm4gLXQgKiAodCAtIDIuMCk7XG59XG5mdW5jdGlvbiBxdWFydEluT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNVxuICAgICAgICA/ICs4LjAgKiBNYXRoLnBvdyh0LCA0LjApXG4gICAgICAgIDogLTguMCAqIE1hdGgucG93KHQgLSAxLjAsIDQuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBxdWFydEluKHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCwgNC4wKTtcbn1cbmZ1bmN0aW9uIHF1YXJ0T3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCAtIDEuMCwgMy4wKSAqICgxLjAgLSB0KSArIDEuMDtcbn1cbmZ1bmN0aW9uIHF1aW50SW5PdXQodCkge1xuICAgIGlmICgodCAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0ICogdDtcbiAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpO1xufVxuZnVuY3Rpb24gcXVpbnRJbih0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdCAqIHQgKiB0O1xufVxuZnVuY3Rpb24gcXVpbnRPdXQodCkge1xuICAgIHJldHVybiAtLXQgKiB0ICogdCAqIHQgKiB0ICsgMTtcbn1cbmZ1bmN0aW9uIHNpbmVJbk91dCh0KSB7XG4gICAgcmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHQpIC0gMSk7XG59XG5mdW5jdGlvbiBzaW5lSW4odCkge1xuICAgIGNvbnN0IHYgPSBNYXRoLmNvcyh0ICogTWF0aC5QSSAqIDAuNSk7XG4gICAgaWYgKE1hdGguYWJzKHYpIDwgMWUtMTQpXG4gICAgICAgIHJldHVybiAxO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIDEgLSB2O1xufVxuZnVuY3Rpb24gc2luZU91dCh0KSB7XG4gICAgcmV0dXJuIE1hdGguc2luKCh0ICogTWF0aC5QSSkgLyAyKTtcbn1cblxuZXhwb3J0IHsgYmFja0luLCBiYWNrSW5PdXQsIGJhY2tPdXQsIGJvdW5jZUluLCBib3VuY2VJbk91dCwgYm91bmNlT3V0LCBjaXJjSW4sIGNpcmNJbk91dCwgY2lyY091dCwgY3ViaWNJbiwgY3ViaWNJbk91dCwgY3ViaWNPdXQsIGVsYXN0aWNJbiwgZWxhc3RpY0luT3V0LCBlbGFzdGljT3V0LCBleHBvSW4sIGV4cG9Jbk91dCwgZXhwb091dCwgcXVhZEluLCBxdWFkSW5PdXQsIHF1YWRPdXQsIHF1YXJ0SW4sIHF1YXJ0SW5PdXQsIHF1YXJ0T3V0LCBxdWludEluLCBxdWludEluT3V0LCBxdWludE91dCwgc2luZUluLCBzaW5lSW5PdXQsIHNpbmVPdXQgfTtcbiIsImltcG9ydCB7IGN1YmljSW5PdXQsIGxpbmVhciwgY3ViaWNPdXQgfSBmcm9tICcuLi9lYXNpbmcnO1xuaW1wb3J0IHsgaXNfZnVuY3Rpb24sIGFzc2lnbiB9IGZyb20gJy4uL2ludGVybmFsJztcblxuLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbmZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxuXG5mdW5jdGlvbiBibHVyKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNJbk91dCwgYW1vdW50ID0gNSwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IGYgPSBzdHlsZS5maWx0ZXIgPT09ICdub25lJyA/ICcnIDogc3R5bGUuZmlsdGVyO1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfdCwgdSkgPT4gYG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX07IGZpbHRlcjogJHtmfSBibHVyKCR7dSAqIGFtb3VudH1weCk7YFxuICAgIH07XG59XG5mdW5jdGlvbiBmYWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gbGluZWFyIH0pIHtcbiAgICBjb25zdCBvID0gK2dldENvbXB1dGVkU3R5bGUobm9kZSkub3BhY2l0eTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiB0ID0+IGBvcGFjaXR5OiAke3QgKiBvfWBcbiAgICB9O1xufVxuZnVuY3Rpb24gZmx5KG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQsIHggPSAwLCB5ID0gMCwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgY29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgkeygxIC0gdCkgKiB4fXB4LCAkeygxIC0gdCkgKiB5fXB4KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX1gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNsaWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZS5oZWlnaHQpO1xuICAgIGNvbnN0IHBhZGRpbmdfdG9wID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKTtcbiAgICBjb25zdCBwYWRkaW5nX2JvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgY29uc3QgbWFyZ2luX3RvcCA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKTtcbiAgICBjb25zdCBtYXJnaW5fYm90dG9tID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pO1xuICAgIGNvbnN0IGJvcmRlcl90b3Bfd2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKTtcbiAgICBjb25zdCBib3JkZXJfYm90dG9tX3dpZHRoID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiBgb3ZlcmZsb3c6IGhpZGRlbjtgICtcbiAgICAgICAgICAgIGBvcGFjaXR5OiAke01hdGgubWluKHQgKiAyMCwgMSkgKiBvcGFjaXR5fTtgICtcbiAgICAgICAgICAgIGBoZWlnaHQ6ICR7dCAqIGhlaWdodH1weDtgICtcbiAgICAgICAgICAgIGBwYWRkaW5nLXRvcDogJHt0ICogcGFkZGluZ190b3B9cHg7YCArXG4gICAgICAgICAgICBgcGFkZGluZy1ib3R0b206ICR7dCAqIHBhZGRpbmdfYm90dG9tfXB4O2AgK1xuICAgICAgICAgICAgYG1hcmdpbi10b3A6ICR7dCAqIG1hcmdpbl90b3B9cHg7YCArXG4gICAgICAgICAgICBgbWFyZ2luLWJvdHRvbTogJHt0ICogbWFyZ2luX2JvdHRvbX1weDtgICtcbiAgICAgICAgICAgIGBib3JkZXItdG9wLXdpZHRoOiAke3QgKiBib3JkZXJfdG9wX3dpZHRofXB4O2AgK1xuICAgICAgICAgICAgYGJvcmRlci1ib3R0b20td2lkdGg6ICR7dCAqIGJvcmRlcl9ib3R0b21fd2lkdGh9cHg7YFxuICAgIH07XG59XG5mdW5jdGlvbiBzY2FsZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCBzdGFydCA9IDAsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgIGNvbnN0IHNkID0gMSAtIHN0YXJ0O1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfdCwgdSkgPT4gYFxuXHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gc2NhbGUoJHsxIC0gKHNkICogdSl9KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX1cblx0XHRgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRyYXcobm9kZSwgeyBkZWxheSA9IDAsIHNwZWVkLCBkdXJhdGlvbiwgZWFzaW5nID0gY3ViaWNJbk91dCB9KSB7XG4gICAgY29uc3QgbGVuID0gbm9kZS5nZXRUb3RhbExlbmd0aCgpO1xuICAgIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IDgwMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0gbGVuIC8gc3BlZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24obGVuKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBzdHJva2UtZGFzaGFycmF5OiAke3QgKiBsZW59ICR7dSAqIGxlbn1gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyb3NzZmFkZShfYSkge1xuICAgIHZhciB7IGZhbGxiYWNrIH0gPSBfYSwgZGVmYXVsdHMgPSBfX3Jlc3QoX2EsIFtcImZhbGxiYWNrXCJdKTtcbiAgICBjb25zdCB0b19yZWNlaXZlID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHRvX3NlbmQgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb24gY3Jvc3NmYWRlKGZyb20sIG5vZGUsIHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSBkID0+IE1hdGguc3FydChkKSAqIDMwLCBlYXNpbmcgPSBjdWJpY091dCB9ID0gYXNzaWduKGFzc2lnbih7fSwgZGVmYXVsdHMpLCBwYXJhbXMpO1xuICAgICAgICBjb25zdCB0byA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IGR4ID0gZnJvbS5sZWZ0IC0gdG8ubGVmdDtcbiAgICAgICAgY29uc3QgZHkgPSBmcm9tLnRvcCAtIHRvLnRvcDtcbiAgICAgICAgY29uc3QgZHcgPSBmcm9tLndpZHRoIC8gdG8ud2lkdGg7XG4gICAgICAgIGNvbnN0IGRoID0gZnJvbS5oZWlnaHQgLyB0by5oZWlnaHQ7XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlbGF5LFxuICAgICAgICAgICAgZHVyYXRpb246IGlzX2Z1bmN0aW9uKGR1cmF0aW9uKSA/IGR1cmF0aW9uKGQpIDogZHVyYXRpb24sXG4gICAgICAgICAgICBlYXNpbmcsXG4gICAgICAgICAgICBjc3M6ICh0LCB1KSA9PiBgXG5cdFx0XHRcdG9wYWNpdHk6ICR7dCAqIG9wYWNpdHl9O1xuXHRcdFx0XHR0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdDtcblx0XHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7dSAqIGR4fXB4LCR7dSAqIGR5fXB4KSBzY2FsZSgke3QgKyAoMSAtIHQpICogZHd9LCAke3QgKyAoMSAtIHQpICogZGh9KTtcblx0XHRcdGBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbihpdGVtcywgY291bnRlcnBhcnRzLCBpbnRybykge1xuICAgICAgICByZXR1cm4gKG5vZGUsIHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgaXRlbXMuc2V0KHBhcmFtcy5rZXksIHtcbiAgICAgICAgICAgICAgICByZWN0OiBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXJwYXJ0cy5oYXMocGFyYW1zLmtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyByZWN0IH0gPSBjb3VudGVycGFydHMuZ2V0KHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVycGFydHMuZGVsZXRlKHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Jvc3NmYWRlKHJlY3QsIG5vZGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBub2RlIGlzIGRpc2FwcGVhcmluZyBhbHRvZ2V0aGVyXG4gICAgICAgICAgICAgICAgLy8gKGkuZS4gd2Fzbid0IGNsYWltZWQgYnkgdGhlIG90aGVyIGxpc3QpXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBuZWVkIHRvIHN1cHBseSBhbiBvdXRyb1xuICAgICAgICAgICAgICAgIGl0ZW1zLmRlbGV0ZShwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsbGJhY2sgJiYgZmFsbGJhY2sobm9kZSwgcGFyYW1zLCBpbnRybyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgICB0cmFuc2l0aW9uKHRvX3NlbmQsIHRvX3JlY2VpdmUsIGZhbHNlKSxcbiAgICAgICAgdHJhbnNpdGlvbih0b19yZWNlaXZlLCB0b19zZW5kLCB0cnVlKVxuICAgIF07XG59XG5cbmV4cG9ydCB7IGJsdXIsIGNyb3NzZmFkZSwgZHJhdywgZmFkZSwgZmx5LCBzY2FsZSwgc2xpZGUgfTtcbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB1dGlscyBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuXG4gIGV4cG9ydCBsZXQgd2lkdGggPSAwO1xuICBleHBvcnQgbGV0IGxlZnQgPSAwO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG5cbiAgY29uc3QgeyBiZyB9ID0gdXRpbHMoY29sb3IpO1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgdHJhbnNpdGlvbiB7YmcoNzAwKX1cIlxuICBjbGFzczpoaWRkZW49e2xlZnQgPCAwfVxuICBzdHlsZT1cIndpZHRoOiB7d2lkdGh9cHg7IGxlZnQ6IHtsZWZ0fXB4OyBoZWlnaHQ6IDJweDtcIlxuICB0cmFuc2l0aW9uOnNsaWRlIC8+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xuICBpbXBvcnQgeyBzbGlkZSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuXG4gIGV4cG9ydCBsZXQgYXBwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcHJvZ3Jlc3MgPSAwO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG5cbiAgbGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgb25Nb3VudCgoKSA9PiB7XG4gICAgaWYgKCFhcHApIHJldHVybjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgLyoga3Vkb3MgaHR0cHM6Ly9jb2RlcGVuLmlvL3NoYWxpbWFuby9wZW4vd0JtTkdKICovXG4gIC5pbmMge1xuICAgIGFuaW1hdGlvbjogaW5jcmVhc2UgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gIH1cbiAgLmRlYyB7XG4gICAgYW5pbWF0aW9uOiBkZWNyZWFzZSAycyAwLjlzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICB9XG5cbiAgQGtleWZyYW1lcyBpbmNyZWFzZSB7XG4gICAgZnJvbSB7XG4gICAgICBsZWZ0OiAtNSU7XG4gICAgICB3aWR0aDogNSU7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgIGxlZnQ6IDEzMCU7XG4gICAgICB3aWR0aDogMTUwJTtcbiAgICB9XG4gIH1cbiAgQGtleWZyYW1lcyBkZWNyZWFzZSB7XG4gICAgZnJvbSB7XG4gICAgICBsZWZ0OiAtOTAlO1xuICAgICAgd2lkdGg6IDkwJTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgbGVmdDogMTEwJTtcbiAgICAgIHdpZHRoOiAxMCU7XG4gICAgfVxuICB9XG48L3N0eWxlPlxuXG48ZGl2XG4gIGNsYXNzOmZpeGVkPXthcHB9XG4gIGNsYXNzOnotNTA9e2FwcH1cbiAgY2xhc3M9XCJ0b3AtMCBsZWZ0LTAgdy1mdWxsIGgtMSBiZy17Y29sb3J9LTEwMCBvdmVyZmxvdy1oaWRkZW4gcmVsYXRpdmVcIlxuICBjbGFzczpoaWRkZW49e2FwcCAmJiAhaW5pdGlhbGl6ZWR9XG4gIHRyYW5zaXRpb246c2xpZGU9e3sgZHVyYXRpb246IDMwMCB9fT5cbiAgPGRpdlxuICAgIGNsYXNzPVwiYmcte2NvbG9yfS01MDAgaC0xIGFic29sdXRlXCJcbiAgICBjbGFzczppbmM9eyFwcm9ncmVzc31cbiAgICBjbGFzczp0cmFuc2l0aW9uPXtwcm9ncmVzc31cbiAgICBzdHlsZT17cHJvZ3Jlc3MgPyBgd2lkdGg6ICR7cHJvZ3Jlc3N9JWAgOiBcIlwifSAvPlxuICA8ZGl2IGNsYXNzPVwiYmcte2NvbG9yfS01MDAgaC0xIGFic29sdXRlIGRlY1wiIGNsYXNzOmhpZGRlbj17cHJvZ3Jlc3N9IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgaW1wb3J0IEluZGljYXRvciBmcm9tIFwiLi9JbmRpY2F0b3Iuc3ZlbHRlXCI7XG4gIGltcG9ydCBQcm9ncmVzc0xpbmVhciBmcm9tIFwiLi4vUHJvZ3Jlc3NMaW5lYXJcIjtcbiAgaW1wb3J0IFRhYkJ1dHRvbiBmcm9tIFwiLi9UYWJCdXR0b24uc3ZlbHRlXCI7XG5cbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9IG51bGw7XG4gIGV4cG9ydCBsZXQgbmF2aWdhdGlvbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGl0ZW1zID0gW107XG4gIGV4cG9ydCBsZXQgaW5kaWNhdG9yID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwid2hpdGVcIjtcbiAgZXhwb3J0IGxldCBub3RTZWxlY3RlZENvbG9yID0gXCJ3aGl0ZVwiO1xuXG5cbiAgZXhwb3J0IGxldCBsb2FkaW5nID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGFiQnV0dG9uQ2xhc3NlcyA9IGkgPT4gaTtcblxuICBsZXQgbm9kZTtcbiAgbGV0IGluZGljYXRvcldpZHRoID0gMDtcbiAgbGV0IGluZGljYXRvck9mZnNldCA9IDA7XG4gIGxldCBvZmZzZXQgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIGNhbGNJbmRpY2F0b3IoKSB7XG4gICAgaW5kaWNhdG9yV2lkdGggPSBub2RlID8gbm9kZS5vZmZzZXRXaWR0aCAvIGl0ZW1zLmxlbmd0aCA6IDA7XG5cbiAgICBsZXQgbGVmdCA9IDA7XG4gICAgaWYgKHNlbGVjdGVkICYmIGl0ZW1zLmZpbmRJbmRleChpID0+IHNlbGVjdGVkLmluY2x1ZGVzKGkudG8gfHwgaS5pZCkpICE9PSAtMSkge1xuICAgICAgY29uc3QgbG9uZ2VzdE1hdGNoID0gaXRlbXNcbiAgICAgICAgLm1hcCgoaXRlbSwgaW5kZXgpID0+IFtpbmRleCwgaXRlbV0pXG4gICAgICAgIC5maWx0ZXIoKFtpbmRleCwgaXRlbV0pID0+IHNlbGVjdGVkLmluY2x1ZGVzKGl0ZW0udG8gfHwgaXRlbS5pZCkpXG4gICAgICAgIC5zb3J0KFxuICAgICAgICAgIChbaW5kZXgxLCBpdGVtMV0sIFtpbmRleDIsIGl0ZW0yXSkgPT5cbiAgICAgICAgICAgIChpdGVtMi50byB8fCBpdGVtMi5pZCkubGVuZ3RoIC0gKGl0ZW0xLnRvIHx8IGl0ZW0xLmlkKS5sZW5ndGhcbiAgICAgICAgKVswXTtcblxuICAgICAgaWYgKGxvbmdlc3RNYXRjaCkge1xuICAgICAgICBsZWZ0ID0gbG9uZ2VzdE1hdGNoWzBdO1xuICAgICAgICBvZmZzZXQgPSBsZWZ0ICogaW5kaWNhdG9yV2lkdGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VudCgoKSA9PiBjYWxjSW5kaWNhdG9yKHNlbGVjdGVkKSk7XG5cbiAgJDogY2FsY0luZGljYXRvcihzZWxlY3RlZCk7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcInktMCBoLWZ1bGwgaXRlbXMtY2VudGVyIHJlbGF0aXZlIG14LWF1dG8gei0yMFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5hZGQoJ2hpZGRlbiBtZDpmbGV4IHctZnVsbCBtYXgtdy0yeGwnLCBuYXZpZ2F0aW9uKVxuICAgIC5hZGQoJ2ZsZXgnLCAhbmF2aWdhdGlvbilcbiAgICAuZ2V0KCk7XG48L3NjcmlwdD5cblxuPGRpdlxuICBjbGFzcz17Y31cbiAgYmluZDp0aGlzPXtub2RlfT5cbiAgeyNlYWNoIGl0ZW1zIGFzIGl0ZW0sIGl9XG4gICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB7Y29sb3J9IHtpdGVtfT5cbiAgICAgIDxUYWJCdXR0b25cbiAgICAgICAgY2xhc3M9e3RhYkJ1dHRvbkNsYXNzZXN9XG4gICAgICAgIGJpbmQ6c2VsZWN0ZWRcbiAgICAgICAgey4uLml0ZW19XG4gICAgICAgIHtjb2xvcn1cbiAgICAgICAge25vdFNlbGVjdGVkQ29sb3J9XG4gICAgICA+e2l0ZW0udGV4dH08L1RhYkJ1dHRvbj5cbiAgICA8L3Nsb3Q+XG4gIHsvZWFjaH1cbiAgeyNpZiBpbmRpY2F0b3IgJiYgb2Zmc2V0ICE9PSBudWxsfVxuICAgIDxJbmRpY2F0b3Ige2NvbG9yfSB3aWR0aD17aW5kaWNhdG9yV2lkdGh9IGxlZnQ9e29mZnNldH0gLz5cbiAgey9pZn1cbjwvZGl2PlxueyNpZiBsb2FkaW5nfVxuICA8UHJvZ3Jlc3NMaW5lYXIge2NvbG9yfSAvPlxuey9pZn1cblxuPHNsb3Qge3NlbGVjdGVkfSBuYW1lPVwiY29udGVudFwiIC8+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgSWNvbiBmcm9tIFwiLi4vSWNvblwiO1xuICBpbXBvcnQgdXRpbHMsIHsgQ2xhc3NCdWlsZGVyLCBmaWx0ZXJQcm9wcyB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG4gIGltcG9ydCBjcmVhdGVSaXBwbGUgZnJvbSBcIi4uL1JpcHBsZS9yaXBwbGUuanNcIjtcblxuXG5cbiAgZXhwb3J0IGxldCB2YWx1ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG91dGxpbmVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGV4dCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGJsb2NrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpY29uID0gbnVsbDtcbiAgZXhwb3J0IGxldCBzbWFsbCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGxpZ2h0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGFyayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGZsYXQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpY29uQ2xhc3MgPSBcIlwiO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG4gIGV4cG9ydCBsZXQgaHJlZiA9IG51bGw7XG4gIGV4cG9ydCBsZXQgZmFiID0gZmFsc2U7XG5cbiAgZXhwb3J0IGxldCByZW1vdmUgPSBcIlwiO1xuICBleHBvcnQgbGV0IGFkZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgcmVwbGFjZSA9IHt9O1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gJ3otMTAgcHktMiBweC00IHVwcGVyY2FzZSB0ZXh0LXNtIGZvbnQtbWVkaXVtIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbic7XG4gIGNvbnN0IGJhc2ljRGVmYXVsdCA9ICd0ZXh0LXdoaXRlIGR1cmF0aW9uLTIwMCBlYXNlLWluJztcblxuICBjb25zdCBvdXRsaW5lZERlZmF1bHQgPSAnYmctdHJhbnNwYXJlbnQgYm9yZGVyIGJvcmRlci1zb2xpZCc7XG4gIGNvbnN0IHRleHREZWZhdWx0ID0gJ2JnLXRyYW5zcGFyZW50IGJvcmRlci1ub25lIHB4LTQgaG92ZXI6YmctdHJhbnNwYXJlbnQnO1xuICBjb25zdCBpY29uRGVmYXVsdCA9ICdwLTQgZmxleCBpdGVtcy1jZW50ZXIgc2VsZWN0LW5vbmUnO1xuICBjb25zdCBmYWJEZWZhdWx0ID0gJ2hvdmVyOmJnLXRyYW5zcGFyZW50JztcbiAgY29uc3Qgc21hbGxEZWZhdWx0ID0gJ3B0LTEgcGItMSBwbC0yIHByLTIgdGV4dC14cyc7XG4gIGNvbnN0IGRpc2FibGVkRGVmYXVsdCA9ICdiZy1ncmF5LTMwMCB0ZXh0LWdyYXktNTAwIGRhcms6YmctZGFyay00MDAgZWxldmF0aW9uLW5vbmUgcG9pbnRlci1ldmVudHMtbm9uZSBob3ZlcjpiZy1ncmF5LTMwMCBjdXJzb3ItZGVmYXVsdCc7XG4gIGNvbnN0IGVsZXZhdGlvbkRlZmF1bHQgPSAnaG92ZXI6ZWxldmF0aW9uLTUgZWxldmF0aW9uLTMnO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IGJhc2ljQ2xhc3NlcyA9IGJhc2ljRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBvdXRsaW5lZENsYXNzZXMgPSBvdXRsaW5lZERlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgdGV4dENsYXNzZXMgPSB0ZXh0RGVmYXVsdDtcbiAgZXhwb3J0IGxldCBpY29uQ2xhc3NlcyA9IGljb25EZWZhdWx0O1xuICBleHBvcnQgbGV0IGZhYkNsYXNzZXMgPSBmYWJEZWZhdWx0O1xuICBleHBvcnQgbGV0IHNtYWxsQ2xhc3NlcyA9IHNtYWxsRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBkaXNhYmxlZENsYXNzZXMgPSBkaXNhYmxlZERlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgZWxldmF0aW9uQ2xhc3NlcyA9IGVsZXZhdGlvbkRlZmF1bHQ7XG5cbiAgZmFiID0gZmFiIHx8ICh0ZXh0ICYmIGljb24pO1xuICBjb25zdCBiYXNpYyA9ICFvdXRsaW5lZCAmJiAhdGV4dCAmJiAhZmFiO1xuICBjb25zdCBlbGV2YXRpb24gPSAoYmFzaWMgfHwgaWNvbikgJiYgIWRpc2FibGVkICYmICFmbGF0ICYmICF0ZXh0O1xuXG4gIGxldCBDbGFzc2VzID0gaSA9PiBpO1xuICBsZXQgaUNsYXNzZXMgPSBpID0+IGk7XG4gIGxldCBzaGFkZSA9IDA7XG5cbiAgJDoge1xuICAgIHNoYWRlID0gbGlnaHQgPyAyMDAgOiAwO1xuICAgIHNoYWRlID0gZGFyayA/IC00MDAgOiBzaGFkZTtcbiAgfVxuICAkOiBub3JtYWwgPSA1MDAgLSBzaGFkZTtcbiAgJDogbGlnaHRlciA9IDQwMCAtIHNoYWRlO1xuXG4gIGNvbnN0IHtcbiAgICBiZyxcbiAgICBib3JkZXIsXG4gICAgdHh0LFxuICB9ID0gdXRpbHMoY29sb3IpO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gIGxldCBpY29uQ2I7XG5cbiAgaWYgKGljb24pIHtcbiAgICBpY29uQ2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGljb25DbGFzcyk7XG4gIH1cblxuICAkOiBjbGFzc2VzID0gY2JcbiAgICAgIC5mbHVzaCgpXG4gICAgICAuYWRkKGJhc2ljQ2xhc3NlcywgYmFzaWMsIGJhc2ljRGVmYXVsdClcbiAgICAgIC5hZGQoYCR7Ymcobm9ybWFsKX0gaG92ZXI6JHtiZyhsaWdodGVyKX1gLCBiYXNpYylcbiAgICAgIC5hZGQoZWxldmF0aW9uQ2xhc3NlcywgZWxldmF0aW9uLCBlbGV2YXRpb25EZWZhdWx0KVxuICAgICAgLmFkZChvdXRsaW5lZENsYXNzZXMsIG91dGxpbmVkLCBvdXRsaW5lZERlZmF1bHQpXG4gICAgICAuYWRkKFxuICAgICAgICBgJHtib3JkZXIobGlnaHRlcil9ICR7dHh0KG5vcm1hbCl9IGhvdmVyOiR7YmcoXCJ0cmFuc1wiKX0gZGFyay1ob3Zlcjoke2JnKFwidHJhbnNEYXJrXCIpfWAsXG4gICAgICAgIG91dGxpbmVkKVxuICAgICAgLmFkZChgJHt0eHQobGlnaHRlcil9YCwgdGV4dClcbiAgICAgIC5hZGQodGV4dENsYXNzZXMsIHRleHQsIHRleHREZWZhdWx0KVxuICAgICAgLmFkZChpY29uQ2xhc3NlcywgaWNvbiwgaWNvbkRlZmF1bHQpXG4gICAgICAucmVtb3ZlKFwicHktMlwiLCBpY29uKVxuICAgICAgLnJlbW92ZSh0eHQobGlnaHRlciksIGZhYilcbiAgICAgIC5hZGQoZGlzYWJsZWRDbGFzc2VzLCBkaXNhYmxlZCwgZGlzYWJsZWREZWZhdWx0KVxuICAgICAgLmFkZChzbWFsbENsYXNzZXMsIHNtYWxsLCBzbWFsbERlZmF1bHQpXG4gICAgICAuYWRkKFwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgaC04IHctOFwiLCBzbWFsbCAmJiBpY29uKVxuICAgICAgLmFkZChcImJvcmRlci1zb2xpZFwiLCBvdXRsaW5lZClcbiAgICAgIC5hZGQoXCJyb3VuZGVkLWZ1bGxcIiwgaWNvbilcbiAgICAgIC5hZGQoXCJ3LWZ1bGxcIiwgYmxvY2spXG4gICAgICAuYWRkKFwicm91bmRlZFwiLCBiYXNpYyB8fCBvdXRsaW5lZCB8fCB0ZXh0KVxuICAgICAgLmFkZChcImJ1dHRvblwiLCAhaWNvbilcbiAgICAgIC5hZGQoZmFiQ2xhc3NlcywgZmFiLCBmYWJEZWZhdWx0KVxuICAgICAgLmFkZChgaG92ZXI6JHtiZyhcInRyYW5zTGlnaHRcIil9YCwgZmFiKVxuICAgICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgICAgLnJlbW92ZShyZW1vdmUpXG4gICAgICAucmVwbGFjZShyZXBsYWNlKVxuICAgICAgLmFkZChhZGQpXG4gICAgICAuZ2V0KCk7XG5cbiAgJDogaWYgKGljb25DYikge1xuICAgIGlDbGFzc2VzID0gaWNvbkNiLmZsdXNoKCkuYWRkKHR4dCgpLCBmYWIgJiYgIWljb25DbGFzcykuZ2V0KCk7XG4gIH1cblxuICBjb25zdCByaXBwbGUgPSBjcmVhdGVSaXBwbGUoKHRleHQgfHwgZmFiIHx8IG91dGxpbmVkKSA/IGNvbG9yIDogXCJ3aGl0ZVwiKTtcblxuICBjb25zdCBwcm9wcyA9IGZpbHRlclByb3BzKFtcbiAgICAnb3V0bGluZWQnLFxuICAgICd0ZXh0JyxcbiAgICAnY29sb3InLFxuICAgICdibG9jaycsXG4gICAgJ2Rpc2FibGVkJyxcbiAgICAnaWNvbicsXG4gICAgJ3NtYWxsJyxcbiAgICAnbGlnaHQnLFxuICAgICdkYXJrJyxcbiAgICAnZmxhdCcsXG4gICAgJ2FkZCcsXG4gICAgJ3JlbW92ZScsXG4gICAgJ3JlcGxhY2UnLFxuICBdLCAkJHByb3BzKTtcbjwvc2NyaXB0PlxuXG5cbnsjaWYgaHJlZn1cbiAgPGFcbiAgICB7aHJlZn1cbiAgICB7Li4ucHJvcHN9XG4gID5cbiAgICA8YnV0dG9uXG4gICAgICB1c2U6cmlwcGxlXG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIG9uOmNsaWNrPXsoKSA9PiAodmFsdWUgPSAhdmFsdWUpfVxuICAgICAgb246Y2xpY2tcbiAgICAgIG9uOm1vdXNlb3ZlclxuICAgICAgb246KlxuICAgID5cbiAgICAgIHsjaWYgaWNvbn1cbiAgICAgICAgPEljb24gY2xhc3M9e2lDbGFzc2VzfSB7c21hbGx9PntpY29ufTwvSWNvbj5cbiAgICAgIHsvaWZ9XG4gICAgICA8c2xvdCAvPlxuICAgIDwvYnV0dG9uPlxuICA8L2E+XG57OmVsc2V9XG4gIDxidXR0b25cbiAgICB1c2U6cmlwcGxlXG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgey4uLnByb3BzfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGljaz17KCkgPT4gKHZhbHVlID0gIXZhbHVlKX1cbiAgICBvbjpjbGlja1xuICAgIG9uOm1vdXNlb3ZlclxuICAgIG9uOipcbiAgPlxuICAgIHsjaWYgaWNvbn1cbiAgICAgIDxJY29uIGNsYXNzPXtpQ2xhc3Nlc30ge3NtYWxsfT57aWNvbn08L0ljb24+XG4gICAgey9pZn1cbiAgICA8c2xvdCAvPlxuICA8L2J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IHF1YWRPdXQsIHF1YWRJbiB9IGZyb20gXCJzdmVsdGUvZWFzaW5nXCI7XG5cbiAgZXhwb3J0IGxldCBvcGFjaXR5ID0gMC41O1xuICBleHBvcnQgbGV0IGluUHJvcHMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogcXVhZEluIH07XG4gIGV4cG9ydCBsZXQgb3V0UHJvcHMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogcXVhZE91dCB9O1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJiZy1ibGFjayBmaXhlZCB0b3AtMCBsZWZ0LTAgei0xMCB3LWZ1bGwgaC1mdWxsXCJcbiAgc3R5bGU9XCJvcGFjaXR5OiB7b3BhY2l0eX1cIlxuICBpbjpmYWRlPXtpblByb3BzfVxuICBvdXQ6ZmFkZT17b3V0UHJvcHN9XG4gIG9uOmNsaWNrIC8+XG4iLCJpbXBvcnQgc2NyaW0gZnJvbSBcIi4vU2NyaW0uc3ZlbHRlXCI7XG5pbXBvcnQgc3BhY2VyIGZyb20gXCIuL1NwYWNlci5zdmVsdGVcIjtcblxuZXhwb3J0IGNvbnN0IFNjcmltID0gc2NyaW07XG5leHBvcnQgY29uc3QgU3BhY2VyID0gc3BhY2VyO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFNjcmltLFxuICBTcGFjZXJcbn07XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBDbGFzc0J1aWxkZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCBJY29uIGZyb20gXCIuLi9JY29uXCI7XG4gIGltcG9ydCBjcmVhdGVSaXBwbGUgZnJvbSBcIi4uL1JpcHBsZS9yaXBwbGUuanNcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwiZm9jdXM6YmctZ3JheS01MCBkYXJrLWZvY3VzOmJnLWdyYXktNzAwIGhvdmVyOmJnLWdyYXktdHJhbnNEYXJrIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiBkdXJhdGlvbi0xMDAgcC00IGN1cnNvci1wb2ludGVyIHRleHQtZ3JheS03MDAgZGFyazp0ZXh0LWdyYXktMTAwIGZsZXggaXRlbXMtY2VudGVyIHotMTBcIjtcbiAgY29uc3Qgc2VsZWN0ZWRDbGFzc2VzRGVmYXVsdCA9IFwiYmctZ3JheS0yMDAgZGFyazpiZy1wcmltYXJ5LXRyYW5zTGlnaHRcIjtcbiAgY29uc3Qgc3ViaGVhZGluZ0NsYXNzZXNEZWZhdWx0ID0gXCJ0ZXh0LWdyYXktNjAwIHAtMCB0ZXh0LXNtXCI7XG5cbiAgZXhwb3J0IGxldCBpY29uID0gXCJcIjtcbiAgZXhwb3J0IGxldCBpZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdmFsdWUgPSBcIlwiO1xuICBleHBvcnQgbGV0IHRleHQgPSBcIlwiO1xuICBleHBvcnQgbGV0IHN1YmhlYWRpbmcgPSBcIlwiO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGVuc2UgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHRhYmluZGV4ID0gbnVsbDtcbiAgZXhwb3J0IGxldCBzZWxlY3RlZENsYXNzZXMgPSBzZWxlY3RlZENsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IHN1YmhlYWRpbmdDbGFzc2VzID0gc3ViaGVhZGluZ0NsYXNzZXNEZWZhdWx0O1xuXG5cblxuXG4gIGV4cG9ydCBsZXQgdG8gPSBcIlwiO1xuICBleHBvcnQgY29uc3QgaXRlbSA9IG51bGw7XG4gIGV4cG9ydCBjb25zdCBpdGVtcyA9IFtdO1xuICBleHBvcnQgY29uc3QgbGV2ZWwgPSBudWxsO1xuXG4gIGNvbnN0IHJpcHBsZSA9IGNyZWF0ZVJpcHBsZSgpO1xuICBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZSgpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHJldHVybjtcbiAgICB2YWx1ZSA9IGlkO1xuICAgIGRpc3BhdGNoKCdjaGFuZ2UnLCBpZCwgdG8pO1xuICB9XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKHNlbGVjdGVkQ2xhc3Nlcywgc2VsZWN0ZWQsIHNlbGVjdGVkQ2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZChcInB5LTJcIiwgZGVuc2UpXG4gICAgLmFkZChcInRleHQtZ3JheS02MDBcIiwgZGlzYWJsZWQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5nZXQoKTtcbjwvc2NyaXB0PlxuXG48bGlcbiAgdXNlOnJpcHBsZVxuICBjbGFzcz17Y31cbiAge3RhYmluZGV4fVxuICBvbjprZXlwcmVzcz17Y2hhbmdlfVxuICBvbjpjbGljaz17Y2hhbmdlfVxuICBvbjpjbGljaz5cbiAgeyNpZiBpY29ufVxuICAgIDxJY29uXG4gICAgICBjbGFzcz1cInByLTZcIlxuICAgICAgc21hbGw9e2RlbnNlfVxuICAgID5cbiAgICAgIHtpY29ufVxuICAgIDwvSWNvbj5cbiAgey9pZn1cblxuICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbCBwLTBcIj5cbiAgICA8ZGl2IGNsYXNzPXskJHByb3BzLmNsYXNzfT5cbiAgICAgIDxzbG90Pnt0ZXh0fTwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgICB7I2lmIHN1YmhlYWRpbmd9XG4gICAgICA8ZGl2IGNsYXNzPXtzdWJoZWFkaW5nQ2xhc3Nlc30+e3N1YmhlYWRpbmd9PC9kaXY+XG4gICAgey9pZn1cbiAgPC9kaXY+XG48L2xpPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBpbXBvcnQgTGlzdEl0ZW0gZnJvbSBcIi4vTGlzdEl0ZW0uc3ZlbHRlXCI7XG5cbiAgZXhwb3J0IGxldCBpdGVtcyA9IFtdO1xuICBleHBvcnQgbGV0IHZhbHVlID0gXCJcIjtcbiAgZXhwb3J0IGxldCBkZW5zZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNlbGVjdCA9IGZhbHNlO1xuXG4gIGV4cG9ydCBjb25zdCBsZXZlbCA9IG51bGw7XG4gIGV4cG9ydCBjb25zdCB0ZXh0ID0gXCJcIjtcbiAgZXhwb3J0IGNvbnN0IGl0ZW0gPSB7fTtcbiAgZXhwb3J0IGNvbnN0IHRvID0gbnVsbDtcbiAgZXhwb3J0IGNvbnN0IHNlbGVjdGVkQ2xhc3NlcyA9IGkgPT4gaTtcbiAgZXhwb3J0IGNvbnN0IGl0ZW1DbGFzc2VzID0gaSA9PiBpO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJweS0yIHJvdW5kZWRcIjtcblxuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcblxuICBmdW5jdGlvbiBpZChpKSB7XG4gICAgaWYgKGkuaWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkuaWQ7XG4gICAgaWYgKGkudmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkudmFsdWU7XG4gICAgaWYgKGkudG8gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkudG87XG4gICAgaWYgKGkudGV4dCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS50ZXh0O1xuICAgIHJldHVybiBpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGV4dChpKSB7XG4gICAgaWYgKGkudGV4dCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS50ZXh0O1xuICAgIGlmIChpLnZhbHVlICE9PSB1bmRlZmluZWQpIHJldHVybiBpLnZhbHVlO1xuICAgIHJldHVybiBpO1xuICB9XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKCQkcHJvcHMuY2xhc3MpO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuPC9zY3JpcHQ+XG5cbjx1bCBjbGFzcz17Y30gY2xhc3M6cm91bmRlZC10LW5vbmU9e3NlbGVjdH0+XG4gIHsjZWFjaCBpdGVtcyBhcyBpdGVtLCBpfVxuICAgIHsjaWYgaXRlbS50byAhPT0gdW5kZWZpbmVkfVxuICAgICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB7aXRlbX0ge2RlbnNlfSB7dmFsdWV9PlxuICAgICAgICA8YSB0YWJpbmRleD17aSArIDF9IGhyZWY9e2l0ZW0udG99PlxuICAgICAgICAgIDxMaXN0SXRlbSBiaW5kOnZhbHVlIHsuLi5pdGVtfSBpZD17aWQoaXRlbSl9IHtkZW5zZX0gb246Y2hhbmdlPlxuICAgICAgICAgICAge2l0ZW0udGV4dH1cbiAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8L2E+XG4gICAgICA8L3Nsb3Q+XG4gICAgezplbHNlfVxuICAgICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB7aXRlbX0ge2RlbnNlfSB7dmFsdWV9PlxuICAgICAgICA8TGlzdEl0ZW1cbiAgICAgICAgICBiaW5kOnZhbHVlXG4gICAgICAgICAge3NlbGVjdGVkQ2xhc3Nlc31cbiAgICAgICAgICB7aXRlbUNsYXNzZXN9XG4gICAgICAgICAgey4uLml0ZW19XG4gICAgICAgICAgdGFiaW5kZXg9e2kgKyAxfVxuICAgICAgICAgIGlkPXtpZChpdGVtKX1cbiAgICAgICAgICBzZWxlY3RlZD17dmFsdWUgPT09IGlkKGl0ZW0pfVxuICAgICAgICAgIHtkZW5zZX1cbiAgICAgICAgICBvbjpjaGFuZ2VcbiAgICAgICAgICBvbjpjbGljaz5cbiAgICAgICAgICB7Z2V0VGV4dChpdGVtKX1cbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgIDwvc2xvdD5cbiAgICB7L2lmfVxuICB7L2VhY2h9XG48L3VsPlxuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tIFwic3ZlbHRlL3N0b3JlXCI7XG5pbXBvcnQgeyBvbkRlc3Ryb3kgfSBmcm9tIFwic3ZlbHRlXCI7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDYWxjKHdpZHRoKSB7XG4gIGlmICh3aWR0aCA+IDEyNzkpIHtcbiAgICByZXR1cm4gXCJ4bFwiO1xuICB9XG4gIGlmICh3aWR0aCA+IDEwMjMpIHtcbiAgICByZXR1cm4gXCJsZ1wiO1xuICB9XG4gIGlmICh3aWR0aCA+IDc2Nykge1xuICAgIHJldHVybiBcIm1kXCI7XG4gIH1cbiAgcmV0dXJuIFwic21cIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnJlYWtwb2ludChjYWxjQnJlYWtwb2ludCA9IGRlZmF1bHRDYWxjKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gd3JpdGFibGUoXCJzbVwiKTtcblxuICBjb25zdCBzdG9yZSA9IHdyaXRhYmxlKGNhbGNCcmVha3BvaW50KHdpbmRvdy5pbm5lcldpZHRoKSk7XG5cbiAgY29uc3Qgb25SZXNpemUgPSAoeyB0YXJnZXQgfSkgPT4gc3RvcmUuc2V0KGNhbGNCcmVha3BvaW50KHRhcmdldC5pbm5lcldpZHRoKSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpO1xuICBvbkRlc3Ryb3koKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpKTtcblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZTogc3RvcmUuc3Vic2NyaWJlXG4gIH07XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBmbHkgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgcXVhZEluIH0gZnJvbSBcInN2ZWx0ZS9lYXNpbmdcIjtcbiAgaW1wb3J0IHsgU2NyaW0gfSBmcm9tIFwiLi4vVXRpbFwiO1xuICBpbXBvcnQgYnJlYWtwb2ludHMgZnJvbSBcIi4uLy4uL2JyZWFrcG9pbnRzXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgY29uc3QgYnAgPSBicmVha3BvaW50cygpO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCIgZml4ZWQgdG9wLTAgbWQ6bXQtMTYgdy1hdXRvIGRyYXdlciBvdmVyZmxvdy1oaWRkZW4gaC1mdWxsXCI7XG4gIGNvbnN0IG5hdkNsYXNzZXNEZWZhdWx0ID0gYGgtZnVsbCB3LWZ1bGwgZGFyazpiZy1ncmF5LTkwMCBkYXJrOnRleHQtZ3JheS0yMDAgYWJzb2x1dGUgZmxleCB3LWF1dG8gei0yMCBkcmF3ZXJcbiAgICBwb2ludGVyLWV2ZW50cy1hdXRvIG92ZXJmbG93LXktYXV0b2A7XG5cbiAgZXhwb3J0IGxldCByaWdodCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHBlcnNpc3RlbnQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBlbGV2YXRpb24gPSB0cnVlO1xuICBleHBvcnQgbGV0IHNob3cgPSB0cnVlO1xuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBuYXZDbGFzc2VzID0gbmF2Q2xhc3Nlc0RlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgYm9yZGVyQ2xhc3NlcyA9IGBib3JkZXItZ3JheS02MDAgJHtyaWdodCA/IFwiYm9yZGVyLWxcIiA6IFwiYm9yZGVyLXJcIn1gO1xuXG5cblxuXG4gIGV4cG9ydCBsZXQgdHJhbnNpdGlvblByb3BzID0ge1xuICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgeDogLTMwMCxcbiAgICBlYXNpbmc6IHF1YWRJbixcbiAgICBvcGFjaXR5OiAxLFxuICB9O1xuXG4gICQ6IHRyYW5zaXRpb25Qcm9wcy54ID0gcmlnaHQgPyAzMDAgOiAtMzAwO1xuXG4gIC8vIElzIHRoZSBkcmF3ZXIgZGVsaWJlcmF0ZWx5IGhpZGRlbj8gRG9uJ3QgbGV0IHRoZSAkYnAgY2hlY2sgbWFrZSBpdCB2aXNpYmxlIGlmIHNvLlxuICBsZXQgaGlkZGVuID0gIXNob3c7XG4gICQ6IGlmICghaGlkZGVuKSBwZXJzaXN0ZW50ID0gc2hvdyA9ICRicCAhPT0gXCJzbVwiO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG5cbiAgaWYgKCRicCA9PT0gJ3NtJykgc2hvdyA9IGZhbHNlO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKGJvcmRlckNsYXNzZXMsICFlbGV2YXRpb24gJiYgcGVyc2lzdGVudClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmFkZChcInJpZ2h0LTBcIiwgcmlnaHQpXG4gICAgLmFkZChcImxlZnQtMFwiLCAhcmlnaHQpXG4gICAgLmFkZChcInBvaW50ZXItZXZlbnRzLW5vbmVcIiwgcGVyc2lzdGVudClcbiAgICAuYWRkKFwiei01MFwiLCAhcGVyc2lzdGVudClcbiAgICAuYWRkKFwiZWxldmF0aW9uLTRcIiwgZWxldmF0aW9uKVxuICAgIC5hZGQoXCJ6LTIwXCIsIHBlcnNpc3RlbnQpXG4gICAgLmdldCgpO1xuXG4gIGNvbnN0IG5jYiA9IG5ldyBDbGFzc0J1aWxkZXIobmF2Q2xhc3NlcywgbmF2Q2xhc3Nlc0RlZmF1bHQpO1xuXG4gICQ6IG4gPSBuY2JcbiAgICAuZmx1c2goKVxuICAgIC5nZXQoKTtcblxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgLmRyYXdlciB7XG4gICAgbWluLXdpZHRoOiAyNTBweDtcbiAgfVxuXG4gIGFzaWRlIHtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICB9XG48L3N0eWxlPlxuXG57I2lmIHNob3d9XG4gIDxhc2lkZVxuICAgIGNsYXNzPXtjfVxuICAgIHRyYW5zaXRpb246Zmx5PXt0cmFuc2l0aW9uUHJvcHN9XG4gID5cbiAgXG4gICAgeyNpZiAhcGVyc2lzdGVudH1cbiAgICAgIDxTY3JpbSBvbjpjbGljaz17KCkgPT4gc2hvdyA9IGZhbHNlfSAvPlxuICAgIHsvaWZ9XG4gICAgPG5hdlxuICAgICAgcm9sZT1cIm5hdmlnYXRpb25cIlxuICAgICAgY2xhc3M9e259XG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cInctZnVsbFwiPlxuICAgICAgICA8c2xvdCAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9uYXY+XG4gIDwvYXNpZGU+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgc2NhbGUsIGZhZGUgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwidG9vbHRpcCB3aGl0ZXNwYWNlLW5vLXdyYXAgdGV4dC14cyBhYnNvbHV0ZSBtdC0yIGJnLWdyYXktNjAwIHRleHQtZ3JheS01MCByb3VuZGVkIG1kOnB4LTIgbWQ6cHktMiBweS00IHB4LTMgei0zMFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG5cbiAgZXhwb3J0IGxldCBzaG93ID0gZmFsc2U7XG5cbiAgZXhwb3J0IGxldCB0aW1lb3V0ID0gbnVsbDtcbiAgZXhwb3J0IGxldCBkZWxheUhpZGUgPSAxMDA7XG4gIGV4cG9ydCBsZXQgZGVsYXlTaG93ID0gMTAwO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuXG4gIGZ1bmN0aW9uIHNob3dUb29sdGlwKCkge1xuICAgIGlmIChzaG93KSByZXR1cm47XG5cbiAgICBzaG93ID0gdHJ1ZTtcblxuICAgIGlmICghdGltZW91dCkgcmV0dXJuO1xuXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2hvdyA9IGZhbHNlO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG4gICAgaWYgKCFzaG93KSByZXR1cm47XG5cbiAgICBzaG93ID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgbGV0IHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgbGV0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG4gICAgICBsZXQgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gIH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4udG9vbHRpcCB7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xufVxuPC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cInJlbGF0aXZlIGlubGluZS1ibG9ja1wiPlxuICA8ZGl2XG4gICAgb246bW91c2VlbnRlcj17ZGVib3VuY2Uoc2hvd1Rvb2x0aXAsIGRlbGF5U2hvdyl9XG4gICAgb246bW91c2VsZWF2ZT17ZGVib3VuY2UoaGlkZVRvb2x0aXAsIGRlbGF5SGlkZSl9XG4gICAgb246bW91c2VlbnRlclxuICAgIG9uOm1vdXNlbGVhdmVcbiAgICBvbjptb3VzZW92ZXJcbiAgICBvbjptb3VzZW91dFxuICA+XG4gICAgPHNsb3QgbmFtZT1cImFjdGl2YXRvclwiIC8+XG4gIDwvZGl2PlxuXG4gIHsjaWYgc2hvd31cbiAgICA8ZGl2XG4gICAgICBpbjpzY2FsZT17eyBkdXJhdGlvbjogMTUwIH19XG4gICAgICBvdXQ6c2NhbGU9e3sgZHVyYXRpb246IDE1MCwgZGVsYXk6IDEwMCB9fVxuICAgICAgY2xhc3M9e2N9XG4gICAgPlxuICAgICAgPHNsb3QgLz5cbiAgICA8L2Rpdj5cbiAgey9pZn1cbjwvZGl2PlxuIiwiZXhwb3J0IGNvbnN0IG5hdk1lbnUgPSBbXG4gIHsgdG86IFwiL1wiLCB0ZXh0OiBcIk5PVElDSUFTXCIgfSxcbiAgeyB0bzogXCJwbGF5cm9vbVwiLCB0ZXh0OiBcIlBMQVlST09NXCIgfSxcbiAgeyB0bzogXCJkaXNjb3NcIiwgdGV4dDogXCJESVNDT1NcIiB9LFxuICBcbiAgeyB0bzogXCJwcmVzc1wiLCB0ZXh0OiBcIlBSRU5TQVwiIH0sXG4gIHsgdG86IFwic2hvcFwiLCB0ZXh0OiBcIlRJRU5EQVwiIH1cblxuIFxuXTtcblxuZXhwb3J0IGNvbnN0IHRvcE1lbnUgPSBbXG4gIHsgdG86IFwicHJlc3NcIiwgdGV4dDogXCJQUkVOU0FcIiB9LFxuICB7IHRvOiBcInNob3BcIiwgdGV4dDogXCJUSUVOREFcIiB9XG5dO1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tIFwic3ZlbHRlL3N0b3JlXCI7XG5cbmV4cG9ydCBjb25zdCByaWdodCA9IHdyaXRhYmxlKGZhbHNlKTtcbmV4cG9ydCBjb25zdCBwZXJzaXN0ZW50ID0gd3JpdGFibGUodHJ1ZSk7XG5leHBvcnQgY29uc3QgZWxldmF0aW9uID0gd3JpdGFibGUoZmFsc2UpO1xuZXhwb3J0IGNvbnN0IHNob3dOYXYgPSB3cml0YWJsZSh0cnVlKTtcbmV4cG9ydCBjb25zdCBkYXJrID0gd3JpdGFibGUoZmFsc2UpO1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tIFwic3ZlbHRlL3N0b3JlXCI7XG5cbmV4cG9ydCBsZXQgZGFya01vZGU7XG5cbmZ1bmN0aW9uIGlzRGFya1RoZW1lKCkge1xuICBpZiAoIXdpbmRvdy5tYXRjaE1lZGlhKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5tYXRjaGVzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGFyayh2YWx1ZSA9IHRydWUsIGJvZHlDbGFzc2VzID0gXCJtb2RlLWRhcmtcIikge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIHdyaXRhYmxlKHZhbHVlKTtcblxuICBpZiAoIWRhcmtNb2RlKSB7XG4gICAgZGFya01vZGUgPSB3cml0YWJsZSh2YWx1ZSB8fCBpc0RhcmtUaGVtZSgpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBkYXJrTW9kZS5zdWJzY3JpYmUsXG4gICAgc2V0OiB2ID0+IHtcbiAgICAgIGJvZHlDbGFzc2VzLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICBpZiAodikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkYXJrTW9kZS5zZXQodik7XG4gICAgfVxuICB9O1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IEFwcEJhciBmcm9tIFwiY29tcG9uZW50cy9BcHBCYXJcIjtcbiAgaW1wb3J0IFRhYnMgZnJvbSBcImNvbXBvbmVudHMvVGFic1wiO1xuICBpbXBvcnQgQnV0dG9uIGZyb20gXCJjb21wb25lbnRzL0J1dHRvblwiO1xuICBpbXBvcnQgeyBTcGFjZXIgfSBmcm9tIFwiY29tcG9uZW50cy9VdGlsXCI7XG4gIGltcG9ydCBMaXN0LCB7IExpc3RJdGVtIH0gZnJvbSBcImNvbXBvbmVudHMvTGlzdFwiO1xuICBpbXBvcnQgTmF2aWdhdGlvbkRyYXdlciBmcm9tIFwiY29tcG9uZW50cy9OYXZpZ2F0aW9uRHJhd2VyXCI7XG4gIGltcG9ydCBQcm9ncmVzc0xpbmVhciBmcm9tIFwiY29tcG9uZW50cy9Qcm9ncmVzc0xpbmVhclwiO1xuICBpbXBvcnQgVG9vbHRpcCBmcm9tIFwiY29tcG9uZW50cy9Ub29sdGlwXCI7XG4gIGltcG9ydCB7IHN0b3JlcyB9IGZyb20gXCJAc2FwcGVyL2FwcFwiO1xuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xuICBpbXBvcnQgeyBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IG5hdk1lbnUsIHRvcE1lbnUgfSBmcm9tIFwiLi4vdXRpbHMvbWVudS5qc1wiO1xuICBpbXBvcnQgeyByaWdodCwgZWxldmF0aW9uLCBwZXJzaXN0ZW50LCBzaG93TmF2IH0gZnJvbSBcInN0b3Jlcy5qc1wiO1xuICBpbXBvcnQgZGFyayBmcm9tIFwiLi4vZGFyay5qc1wiO1xuXG4gIGNvbnN0IHsgcHJlbG9hZGluZywgcGFnZSB9ID0gc3RvcmVzKCk7XG5cbiAgbGV0IHNlbGVjdGVkID0gXCJcIjtcblxuICBjb25zdCBkYXJrTW9kZSA9IGRhcmsoKTtcblxuICAkOiBwYXRoID0gJHBhZ2UucGF0aDtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5naXRodWIge1xuICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZS1vdXQ7XG4gIH1cbiAgLmdpdGh1Yjpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxuPC9zdHlsZT5cblxuPHN2ZWx0ZTpoZWFkPlxuICA8dGl0bGU+RmxvciBkZSBNb25vczwvdGl0bGU+XG4gIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9XCJCcmVha2luZyBTb3VuZHNcIiAvPlxuPC9zdmVsdGU6aGVhZD5cblxueyNpZiAkcHJlbG9hZGluZ31cbiAgPFByb2dyZXNzTGluZWFyIGFwcCAvPlxuey9pZn1cblxueyNlYWNoIG5hdk1lbnUgYXMgbGlua31cbiAgPGEgaHJlZj17bGluay50b30gY2xhc3M9XCJoaWRkZW5cIj57bGluay50ZXh0fTwvYT5cbnsvZWFjaH1cblxuPEFwcEJhciBjbGFzcz17KGkpID0+IGkucmVwbGFjZSgncHJpbWFyeS0zMDAnLCAnZGFyay02MDAnKX0+XG4gIDxhIGhyZWY9XCIuXCIgY2xhc3M9XCJweC0yIG1kOnB4LTggZmxleCBpdGVtcy1jZW50ZXJcIj5cbiAgICA8aW1nIHNyYz1cIi9mZG1fbG9nby5zdmdcIiBhbHQ9XCJSb2NrIEJhbmQgbG9nb1wiIHdpZHRoPVwiNzBcIiAvPlxuICAgIDxoNiBjbGFzcz1cInBsLTMgdGV4dC13aGl0ZSB0cmFja2luZy13aWRlc3QgZm9udC10aGluIHRleHQtbGdcIj5GbG9yIGRlIE1vbm9zPC9oNj5cbiAgPC9hPlxuICA8U3BhY2VyIC8+XG4gIDxUYWJzIG5hdmlnYXRpb24gaXRlbXM9e3RvcE1lbnV9IGJpbmQ6c2VsZWN0ZWQ9e3BhdGh9IC8+XG5cbiAgPFRvb2x0aXA+XG4gICAgPHNwYW4gc2xvdD1cImFjdGl2YXRvclwiPlxuICAgICAgPEJ1dHRvblxuICAgICAgICBiaW5kOnZhbHVlPXskZGFya01vZGV9XG4gICAgICAgIHNtYWxsXG4gICAgICAgIGZsYXRcbiAgICAgICAgcmVtb3ZlPVwicC0xIGgtNCB3LTRcIlxuICAgICAgICBpY29uQ2xhc3M9XCJ0ZXh0LXdoaXRlXCJcbiAgICAgICAgdGV4dCAvPlxuICAgIDwvc3Bhbj5cbiAgICB7JGRhcmtNb2RlID8gJ0Rpc2FibGUnIDogJ0VuYWJsZSd9IGRhcmsgbW9kZVxuICA8L1Rvb2x0aXA+XG4gIDxkaXYgY2xhc3M9XCJtZDpoaWRkZW5cIj5cbiAgICA8QnV0dG9uXG4gICAgICBpY29uPVwibWVudVwiXG4gICAgICBzbWFsbFxuICAgICAgZmxhdFxuICAgICAgcmVtb3ZlPVwicC0xIGgtNCB3LTRcIlxuICAgICAgaWNvbkNsYXNzPVwidGV4dC13aGl0ZVwiXG4gICAgICB0ZXh0XG4gICAgICBvbjpjbGljaz17KCkgPT4gc2hvd05hdi5zZXQoISRzaG93TmF2KX0gLz5cbiAgPC9kaXY+XG4gIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcmVzb3VyY2VsZGcvd2FsYWRvY3NcIiBjbGFzcz1cInB4LTQgZ2l0aHViXCI+XG4gICAgPGltZyBzcmM9XCIvaW5zdGFncmFtLnN2Z1wiIGFsdD1cImlnIHJvY2tiYW5kXCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgLz5cbiAgPC9hPlxuICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Jlc291cmNlbGRnL3dhbGFkb2NzXCIgY2xhc3M9XCJweC00IGdpdGh1YlwiPlxuICAgIDxpbWcgc3JjPVwiL2ZhY2Uuc3ZnXCIgYWx0PVwiZmFjZSByb2NrYmFuZFwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIC8+XG4gIDwvYT5cblxuPC9BcHBCYXI+XG5cbjxtYWluXG4gIGNsYXNzPVwiIHAtOCBsZzptYXgtdy01eGwgbXgtYXV0byBtYi0xMCBtdC0yNCBtZDptbC02NCBtZDpwbC0xNlxuICBtZDptYXgtdy0zeGwgbWQ6cHgtM1wiXG4gIHRyYW5zaXRpb246ZmFkZT17eyBkdXJhdGlvbjogMzAwIH19PlxuICA8TmF2aWdhdGlvbkRyYXdlclxuICAgIGJpbmQ6c2hvdz17JHNob3dOYXZ9XG4gICAgcmlnaHQ9eyRyaWdodH1cbiAgICBwZXJzaXN0ZW50PXskcGVyc2lzdGVudH1cbiAgICBlbGV2YXRpb249eyRlbGV2YXRpb259PlxuICAgIDxoNlxuICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgIE1vbmVhbmRvXG4gICAgPC9oNj5cbiAgICA8TGlzdCBpdGVtcz17bmF2TWVudX0+XG4gICAgICA8c3BhbiBzbG90PVwiaXRlbVwiIGxldDppdGVtIGNsYXNzPVwiY3Vyc29yLXBvaW50ZXIgYmctbmF2XCI+XG4gICAgICAgIFxuICAgICAgICB7I2lmIGl0ZW0udG8gPT09ICdzaG9wJ31cbiAgICAgICAgICA8aHIgY2xhc3M9XCJtdC00XCIgLz5cbiAgICAgICAgICA8aDZcbiAgICAgICAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICBUaWVuZGFcbiAgICAgICAgICA8L2g2PlxuICAgICAgICB7L2lmfVxuICAgICAgICB7I2lmIGl0ZW0udG8gPT09ICdwcmVzcyd9XG4gICAgICAgICAgPGhyIGNsYXNzPVwibXQtNFwiIC8+XG4gICAgICAgICAgPGg2XG4gICAgICAgICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgICAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgICAgICBDb250YWN0b1xuICAgICAgICAgIDwvaDY+XG4gICAgICAgIHsvaWZ9XG5cbiAgICAgICAgPGEgaHJlZj17aXRlbS50b30+XG4gICAgICAgICAgPExpc3RJdGVtXG4gICAgICAgICAgICBpZD17aXRlbS5pZH1cbiAgICAgICAgICAgIHRleHQ9e2l0ZW0udGV4dH1cbiAgICAgICAgICAgIHRvPXtpdGVtLnRvfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhdGguaW5jbHVkZXMoaXRlbS50byl9XG4gICAgICAgICAgICBkZW5zZVxuICAgICAgICAgICAgc2VsZWN0ZWRDbGFzc2VzPVwiYmctcHJpbWFyeS10cmFuc0RhcmsgZGFyazpiZy1wcmltYXJ5LXRyYW5zTGlnaHRcbiAgICAgICAgICAgIGhvdmVyOmJnLWJsdWUtZ3JheS10cmFuc0RhcmsgYmx1ZS1ncmF5OmJnLWJsdWUtZ3JheS10cmFuc0xpZ2h0XCIgLz5cbiAgICAgICAgPC9hPlxuICAgICAgPC9zcGFuPlxuICAgIDwvTGlzdD5cblxuICAgIDxociAvPlxuICA8L05hdmlnYXRpb25EcmF3ZXI+XG5cbiAgPHNsb3QgLz5cbjwvbWFpbj5cbiIsIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc3RhdHVzO1xuICBleHBvcnQgbGV0IGVycm9yO1xuXG4gIGNvbnN0IGRldiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCI7XG48L3NjcmlwdD5cblxuPHN2ZWx0ZTpoZWFkPlxuICA8dGl0bGU+e3N0YXR1c308L3RpdGxlPlxuPC9zdmVsdGU6aGVhZD5cblxuPGgxPntzdGF0dXN9PC9oMT5cblxuPHA+e2Vycm9yLm1lc3NhZ2V9PC9wPlxuXG57I2lmIGRldiAmJiBlcnJvci5zdGFja31cbiAgPHByZT57ZXJyb3Iuc3RhY2t9PC9wcmU+XG57L2lmfVxuIiwiPCEtLSBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhIC0tPlxuPHNjcmlwdD5cblx0aW1wb3J0IHsgc2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5cdGltcG9ydCB7IENPTlRFWFRfS0VZIH0gZnJvbSAnLi9zaGFyZWQnO1xuXHRpbXBvcnQgTGF5b3V0IGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fbGF5b3V0LnN2ZWx0ZSc7XG5cdGltcG9ydCBFcnJvciBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2Vycm9yLnN2ZWx0ZSc7XG5cblx0ZXhwb3J0IGxldCBzdG9yZXM7XG5cdGV4cG9ydCBsZXQgZXJyb3I7XG5cdGV4cG9ydCBsZXQgc3RhdHVzO1xuXHRleHBvcnQgbGV0IHNlZ21lbnRzO1xuXHRleHBvcnQgbGV0IGxldmVsMDtcblx0ZXhwb3J0IGxldCBsZXZlbDEgPSBudWxsO1xuXG5cdHNldENvbnRleHQoQ09OVEVYVF9LRVksIHN0b3Jlcyk7XG48L3NjcmlwdD5cblxuPExheW91dCBzZWdtZW50PVwie3NlZ21lbnRzWzBdfVwiIHsuLi5sZXZlbDAucHJvcHN9PlxuXHR7I2lmIGVycm9yfVxuXHRcdDxFcnJvciB7ZXJyb3J9IHtzdGF0dXN9Lz5cblx0ezplbHNlfVxuXHRcdDxzdmVsdGU6Y29tcG9uZW50IHRoaXM9XCJ7bGV2ZWwxLmNvbXBvbmVudH1cIiB7Li4ubGV2ZWwxLnByb3BzfS8+XG5cdHsvaWZ9XG48L0xheW91dD4iLCIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgeyBkZWZhdWx0IGFzIFJvb3QgfSBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGUnO1xuZXhwb3J0IHsgcHJlbG9hZCBhcyByb290X3ByZWxvYWQgfSBmcm9tICcuL3NoYXJlZCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGUnO1xuXG5leHBvcnQgY29uc3QgaWdub3JlID0gW107XG5cbmV4cG9ydCBjb25zdCBjb21wb25lbnRzID0gW1xuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9pbmRleC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjppbmRleC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BsYXlyb29tLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBsYXlyb29tLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvZGlzY29zLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmRpc2Nvcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3ByZXNzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnByZXNzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvbmV3cy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpuZXdzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvc2hvcC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpzaG9wLnN2ZWx0ZV9fXCJcblx0fVxuXTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlcyA9IFtcblx0e1xuXHRcdC8vIGluZGV4LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvJC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMCB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBwbGF5cm9vbS5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3BsYXlyb29tXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDEgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gZGlzY29zLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvZGlzY29zXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDIgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcHJlc3Muc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9wcmVzc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIG5ld3Muc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9uZXdzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gc2hvcC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3Nob3BcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogNSB9XG5cdFx0XVxuXHR9XG5dO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0aW1wb3J0KFwiL2hvbWUvbHVjYXMvc29mdHdlZWwvcm9ja2JhbmQvbm9kZV9tb2R1bGVzL3NhcHBlci9zYXBwZXItZGV2LWNsaWVudC5qc1wiKS50aGVuKGNsaWVudCA9PiB7XG5cdFx0Y2xpZW50LmNvbm5lY3QoMTAwMDApO1xuXHR9KTtcbn0iLCJpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbmltcG9ydCB7IENPTlRFWFRfS0VZIH0gZnJvbSAnLi9pbnRlcm5hbC9zaGFyZWQnO1xuaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuaW1wb3J0IEFwcCBmcm9tICcuL2ludGVybmFsL0FwcC5zdmVsdGUnO1xuaW1wb3J0IHsgaWdub3JlLCByb3V0ZXMsIHJvb3RfcHJlbG9hZCwgY29tcG9uZW50cywgRXJyb3JDb21wb25lbnQgfSBmcm9tICcuL2ludGVybmFsL21hbmlmZXN0LWNsaWVudCc7XG5cbmZ1bmN0aW9uIGdvdG8oaHJlZiwgb3B0cyA9IHsgcmVwbGFjZVN0YXRlOiBmYWxzZSB9KSB7XG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQobmV3IFVSTChocmVmLCBkb2N1bWVudC5iYXNlVVJJKSk7XG5cblx0aWYgKHRhcmdldCkge1xuXHRcdF9oaXN0b3J5W29wdHMucmVwbGFjZVN0YXRlID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oeyBpZDogY2lkIH0sICcnLCBocmVmKTtcblx0XHRyZXR1cm4gbmF2aWdhdGUodGFyZ2V0LCBudWxsKS50aGVuKCgpID0+IHt9KTtcblx0fVxuXG5cdGxvY2F0aW9uLmhyZWYgPSBocmVmO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZiA9PiB7fSk7IC8vIG5ldmVyIHJlc29sdmVzXG59XG5cbmNvbnN0IGluaXRpYWxfZGF0YSA9IHR5cGVvZiBfX1NBUFBFUl9fICE9PSAndW5kZWZpbmVkJyAmJiBfX1NBUFBFUl9fO1xuXG5sZXQgcmVhZHkgPSBmYWxzZTtcbmxldCByb290X2NvbXBvbmVudDtcbmxldCBjdXJyZW50X3Rva2VuO1xubGV0IHJvb3RfcHJlbG9hZGVkO1xubGV0IGN1cnJlbnRfYnJhbmNoID0gW107XG5sZXQgY3VycmVudF9xdWVyeSA9ICd7fSc7XG5cbmNvbnN0IHN0b3JlcyA9IHtcblx0cGFnZTogd3JpdGFibGUoe30pLFxuXHRwcmVsb2FkaW5nOiB3cml0YWJsZShudWxsKSxcblx0c2Vzc2lvbjogd3JpdGFibGUoaW5pdGlhbF9kYXRhICYmIGluaXRpYWxfZGF0YS5zZXNzaW9uKVxufTtcblxubGV0ICRzZXNzaW9uO1xubGV0IHNlc3Npb25fZGlydHk7XG5cbnN0b3Jlcy5zZXNzaW9uLnN1YnNjcmliZShhc3luYyB2YWx1ZSA9PiB7XG5cdCRzZXNzaW9uID0gdmFsdWU7XG5cblx0aWYgKCFyZWFkeSkgcmV0dXJuO1xuXHRzZXNzaW9uX2RpcnR5ID0gdHJ1ZTtcblxuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwobG9jYXRpb24uaHJlZikpO1xuXG5cdGNvbnN0IHRva2VuID0gY3VycmVudF90b2tlbiA9IHt9O1xuXHRjb25zdCB7IHJlZGlyZWN0LCBwcm9wcywgYnJhbmNoIH0gPSBhd2FpdCBoeWRyYXRlX3RhcmdldCh0YXJnZXQpO1xuXHRpZiAodG9rZW4gIT09IGN1cnJlbnRfdG9rZW4pIHJldHVybjsgLy8gYSBzZWNvbmRhcnkgbmF2aWdhdGlvbiBoYXBwZW5lZCB3aGlsZSB3ZSB3ZXJlIGxvYWRpbmdcblxuXHRhd2FpdCByZW5kZXIocmVkaXJlY3QsIGJyYW5jaCwgcHJvcHMsIHRhcmdldC5wYWdlKTtcbn0pO1xuXG5sZXQgcHJlZmV0Y2hpbmdcblxuXG4gPSBudWxsO1xuZnVuY3Rpb24gc2V0X3ByZWZldGNoaW5nKGhyZWYsIHByb21pc2UpIHtcblx0cHJlZmV0Y2hpbmcgPSB7IGhyZWYsIHByb21pc2UgfTtcbn1cblxubGV0IHRhcmdldDtcbmZ1bmN0aW9uIHNldF90YXJnZXQoZWxlbWVudCkge1xuXHR0YXJnZXQgPSBlbGVtZW50O1xufVxuXG5sZXQgdWlkID0gMTtcbmZ1bmN0aW9uIHNldF91aWQobikge1xuXHR1aWQgPSBuO1xufVxuXG5sZXQgY2lkO1xuZnVuY3Rpb24gc2V0X2NpZChuKSB7XG5cdGNpZCA9IG47XG59XG5cbmNvbnN0IF9oaXN0b3J5ID0gdHlwZW9mIGhpc3RvcnkgIT09ICd1bmRlZmluZWQnID8gaGlzdG9yeSA6IHtcblx0cHVzaFN0YXRlOiAoc3RhdGUsIHRpdGxlLCBocmVmKSA9PiB7fSxcblx0cmVwbGFjZVN0YXRlOiAoc3RhdGUsIHRpdGxlLCBocmVmKSA9PiB7fSxcblx0c2Nyb2xsUmVzdG9yYXRpb246ICcnXG59O1xuXG5jb25zdCBzY3JvbGxfaGlzdG9yeSA9IHt9O1xuXG5mdW5jdGlvbiBleHRyYWN0X3F1ZXJ5KHNlYXJjaCkge1xuXHRjb25zdCBxdWVyeSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuXHRcdHNlYXJjaC5zbGljZSgxKS5zcGxpdCgnJicpLmZvckVhY2goc2VhcmNoUGFyYW0gPT4ge1xuXHRcdFx0bGV0IFssIGtleSwgdmFsdWUgPSAnJ10gPSAvKFtePV0qKSg/Oj0oLiopKT8vLmV4ZWMoZGVjb2RlVVJJQ29tcG9uZW50KHNlYXJjaFBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpKSk7XG5cdFx0XHRpZiAodHlwZW9mIHF1ZXJ5W2tleV0gPT09ICdzdHJpbmcnKSBxdWVyeVtrZXldID0gW3F1ZXJ5W2tleV1dO1xuXHRcdFx0aWYgKHR5cGVvZiBxdWVyeVtrZXldID09PSAnb2JqZWN0JykgKHF1ZXJ5W2tleV0gKS5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgcXVlcnlba2V5XSA9IHZhbHVlO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0X3RhcmdldCh1cmwpIHtcblx0aWYgKHVybC5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikgcmV0dXJuIG51bGw7XG5cdGlmICghdXJsLnBhdGhuYW1lLnN0YXJ0c1dpdGgoaW5pdGlhbF9kYXRhLmJhc2VVcmwpKSByZXR1cm4gbnVsbDtcblxuXHRsZXQgcGF0aCA9IHVybC5wYXRobmFtZS5zbGljZShpbml0aWFsX2RhdGEuYmFzZVVybC5sZW5ndGgpO1xuXG5cdGlmIChwYXRoID09PSAnJykge1xuXHRcdHBhdGggPSAnLyc7XG5cdH1cblxuXHQvLyBhdm9pZCBhY2NpZGVudGFsIGNsYXNoZXMgYmV0d2VlbiBzZXJ2ZXIgcm91dGVzIGFuZCBwYWdlIHJvdXRlc1xuXHRpZiAoaWdub3JlLnNvbWUocGF0dGVybiA9PiBwYXR0ZXJuLnRlc3QocGF0aCkpKSByZXR1cm47XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCByb3V0ZXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRjb25zdCByb3V0ZSA9IHJvdXRlc1tpXTtcblxuXHRcdGNvbnN0IG1hdGNoID0gcm91dGUucGF0dGVybi5leGVjKHBhdGgpO1xuXG5cdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IGV4dHJhY3RfcXVlcnkodXJsLnNlYXJjaCk7XG5cdFx0XHRjb25zdCBwYXJ0ID0gcm91dGUucGFydHNbcm91dGUucGFydHMubGVuZ3RoIC0gMV07XG5cdFx0XHRjb25zdCBwYXJhbXMgPSBwYXJ0LnBhcmFtcyA/IHBhcnQucGFyYW1zKG1hdGNoKSA6IHt9O1xuXG5cdFx0XHRjb25zdCBwYWdlID0geyBob3N0OiBsb2NhdGlvbi5ob3N0LCBwYXRoLCBxdWVyeSwgcGFyYW1zIH07XG5cblx0XHRcdHJldHVybiB7IGhyZWY6IHVybC5ocmVmLCByb3V0ZSwgbWF0Y2gsIHBhZ2UgfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlX2Vycm9yKHVybCkge1xuXHRjb25zdCB7IGhvc3QsIHBhdGhuYW1lLCBzZWFyY2ggfSA9IGxvY2F0aW9uO1xuXHRjb25zdCB7IHNlc3Npb24sIHByZWxvYWRlZCwgc3RhdHVzLCBlcnJvciB9ID0gaW5pdGlhbF9kYXRhO1xuXG5cdGlmICghcm9vdF9wcmVsb2FkZWQpIHtcblx0XHRyb290X3ByZWxvYWRlZCA9IHByZWxvYWRlZCAmJiBwcmVsb2FkZWRbMF07XG5cdH1cblxuXHRjb25zdCBwcm9wcyA9IHtcblx0XHRlcnJvcixcblx0XHRzdGF0dXMsXG5cdFx0c2Vzc2lvbixcblx0XHRsZXZlbDA6IHtcblx0XHRcdHByb3BzOiByb290X3ByZWxvYWRlZFxuXHRcdH0sXG5cdFx0bGV2ZWwxOiB7XG5cdFx0XHRwcm9wczoge1xuXHRcdFx0XHRzdGF0dXMsXG5cdFx0XHRcdGVycm9yXG5cdFx0XHR9LFxuXHRcdFx0Y29tcG9uZW50OiBFcnJvckNvbXBvbmVudFxuXHRcdH0sXG5cdFx0c2VnbWVudHM6IHByZWxvYWRlZFxuXG5cdH07XG5cdGNvbnN0IHF1ZXJ5ID0gZXh0cmFjdF9xdWVyeShzZWFyY2gpO1xuXHRyZW5kZXIobnVsbCwgW10sIHByb3BzLCB7IGhvc3QsIHBhdGg6IHBhdGhuYW1lLCBxdWVyeSwgcGFyYW1zOiB7fSB9KTtcbn1cblxuZnVuY3Rpb24gc2Nyb2xsX3N0YXRlKCkge1xuXHRyZXR1cm4ge1xuXHRcdHg6IHBhZ2VYT2Zmc2V0LFxuXHRcdHk6IHBhZ2VZT2Zmc2V0XG5cdH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlKHRhcmdldCwgaWQsIG5vc2Nyb2xsLCBoYXNoKSB7XG5cdGlmIChpZCkge1xuXHRcdC8vIHBvcHN0YXRlIG9yIGluaXRpYWwgbmF2aWdhdGlvblxuXHRcdGNpZCA9IGlkO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGN1cnJlbnRfc2Nyb2xsID0gc2Nyb2xsX3N0YXRlKCk7XG5cblx0XHQvLyBjbGlja2VkIG9uIGEgbGluay4gcHJlc2VydmUgc2Nyb2xsIHN0YXRlXG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IGN1cnJlbnRfc2Nyb2xsO1xuXG5cdFx0aWQgPSBjaWQgPSArK3VpZDtcblx0XHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gbm9zY3JvbGwgPyBjdXJyZW50X3Njcm9sbCA6IHsgeDogMCwgeTogMCB9O1xuXHR9XG5cblx0Y2lkID0gaWQ7XG5cblx0aWYgKHJvb3RfY29tcG9uZW50KSBzdG9yZXMucHJlbG9hZGluZy5zZXQodHJ1ZSk7XG5cblx0Y29uc3QgbG9hZGVkID0gcHJlZmV0Y2hpbmcgJiYgcHJlZmV0Y2hpbmcuaHJlZiA9PT0gdGFyZ2V0LmhyZWYgP1xuXHRcdHByZWZldGNoaW5nLnByb21pc2UgOlxuXHRcdGh5ZHJhdGVfdGFyZ2V0KHRhcmdldCk7XG5cblx0cHJlZmV0Y2hpbmcgPSBudWxsO1xuXG5cdGNvbnN0IHRva2VuID0gY3VycmVudF90b2tlbiA9IHt9O1xuXHRjb25zdCB7IHJlZGlyZWN0LCBwcm9wcywgYnJhbmNoIH0gPSBhd2FpdCBsb2FkZWQ7XG5cdGlmICh0b2tlbiAhPT0gY3VycmVudF90b2tlbikgcmV0dXJuOyAvLyBhIHNlY29uZGFyeSBuYXZpZ2F0aW9uIGhhcHBlbmVkIHdoaWxlIHdlIHdlcmUgbG9hZGluZ1xuXG5cdGF3YWl0IHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgdGFyZ2V0LnBhZ2UpO1xuXHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cblx0aWYgKCFub3Njcm9sbCkge1xuXHRcdGxldCBzY3JvbGwgPSBzY3JvbGxfaGlzdG9yeVtpZF07XG5cblx0XHRpZiAoaGFzaCkge1xuXHRcdFx0Ly8gc2Nyb2xsIGlzIGFuIGVsZW1lbnQgaWQgKGZyb20gYSBoYXNoKSwgd2UgbmVlZCB0byBjb21wdXRlIHkuXG5cdFx0XHRjb25zdCBkZWVwX2xpbmtlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2guc2xpY2UoMSkpO1xuXG5cdFx0XHRpZiAoZGVlcF9saW5rZWQpIHtcblx0XHRcdFx0c2Nyb2xsID0ge1xuXHRcdFx0XHRcdHg6IDAsXG5cdFx0XHRcdFx0eTogZGVlcF9saW5rZWQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IHNjcm9sbDtcblx0XHRpZiAoc2Nyb2xsKSBzY3JvbGxUbyhzY3JvbGwueCwgc2Nyb2xsLnkpO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgcGFnZSkge1xuXHRpZiAocmVkaXJlY3QpIHJldHVybiBnb3RvKHJlZGlyZWN0LmxvY2F0aW9uLCB7IHJlcGxhY2VTdGF0ZTogdHJ1ZSB9KTtcblxuXHRzdG9yZXMucGFnZS5zZXQocGFnZSk7XG5cdHN0b3Jlcy5wcmVsb2FkaW5nLnNldChmYWxzZSk7XG5cblx0aWYgKHJvb3RfY29tcG9uZW50KSB7XG5cdFx0cm9vdF9jb21wb25lbnQuJHNldChwcm9wcyk7XG5cdH0gZWxzZSB7XG5cdFx0cHJvcHMuc3RvcmVzID0ge1xuXHRcdFx0cGFnZTogeyBzdWJzY3JpYmU6IHN0b3Jlcy5wYWdlLnN1YnNjcmliZSB9LFxuXHRcdFx0cHJlbG9hZGluZzogeyBzdWJzY3JpYmU6IHN0b3Jlcy5wcmVsb2FkaW5nLnN1YnNjcmliZSB9LFxuXHRcdFx0c2Vzc2lvbjogc3RvcmVzLnNlc3Npb25cblx0XHR9O1xuXHRcdHByb3BzLmxldmVsMCA9IHtcblx0XHRcdHByb3BzOiBhd2FpdCByb290X3ByZWxvYWRlZFxuXHRcdH07XG5cblx0XHQvLyBmaXJzdCBsb2FkIOKAlCByZW1vdmUgU1NSJ2QgPGhlYWQ+IGNvbnRlbnRzXG5cdFx0Y29uc3Qgc3RhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2FwcGVyLWhlYWQtc3RhcnQnKTtcblx0XHRjb25zdCBlbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2FwcGVyLWhlYWQtZW5kJyk7XG5cblx0XHRpZiAoc3RhcnQgJiYgZW5kKSB7XG5cdFx0XHR3aGlsZSAoc3RhcnQubmV4dFNpYmxpbmcgIT09IGVuZCkgZGV0YWNoKHN0YXJ0Lm5leHRTaWJsaW5nKTtcblx0XHRcdGRldGFjaChzdGFydCk7XG5cdFx0XHRkZXRhY2goZW5kKTtcblx0XHR9XG5cblx0XHRyb290X2NvbXBvbmVudCA9IG5ldyBBcHAoe1xuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0cHJvcHMsXG5cdFx0XHRoeWRyYXRlOiB0cnVlXG5cdFx0fSk7XG5cdH1cblxuXHRjdXJyZW50X2JyYW5jaCA9IGJyYW5jaDtcblx0Y3VycmVudF9xdWVyeSA9IEpTT04uc3RyaW5naWZ5KHBhZ2UucXVlcnkpO1xuXHRyZWFkeSA9IHRydWU7XG5cdHNlc3Npb25fZGlydHkgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFydF9jaGFuZ2VkKGksIHNlZ21lbnQsIG1hdGNoLCBzdHJpbmdpZmllZF9xdWVyeSkge1xuXHQvLyBUT0RPIG9ubHkgY2hlY2sgcXVlcnkgc3RyaW5nIGNoYW5nZXMgZm9yIHByZWxvYWQgZnVuY3Rpb25zXG5cdC8vIHRoYXQgZG8gaW4gZmFjdCBkZXBlbmQgb24gaXQgKHVzaW5nIHN0YXRpYyBhbmFseXNpcyBvclxuXHQvLyBydW50aW1lIGluc3RydW1lbnRhdGlvbilcblx0aWYgKHN0cmluZ2lmaWVkX3F1ZXJ5ICE9PSBjdXJyZW50X3F1ZXJ5KSByZXR1cm4gdHJ1ZTtcblxuXHRjb25zdCBwcmV2aW91cyA9IGN1cnJlbnRfYnJhbmNoW2ldO1xuXG5cdGlmICghcHJldmlvdXMpIHJldHVybiBmYWxzZTtcblx0aWYgKHNlZ21lbnQgIT09IHByZXZpb3VzLnNlZ21lbnQpIHJldHVybiB0cnVlO1xuXHRpZiAocHJldmlvdXMubWF0Y2gpIHtcblx0XHRpZiAoSlNPTi5zdHJpbmdpZnkocHJldmlvdXMubWF0Y2guc2xpY2UoMSwgaSArIDIpKSAhPT0gSlNPTi5zdHJpbmdpZnkobWF0Y2guc2xpY2UoMSwgaSArIDIpKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGh5ZHJhdGVfdGFyZ2V0KHRhcmdldClcblxuXG5cbiB7XG5cdGNvbnN0IHsgcm91dGUsIHBhZ2UgfSA9IHRhcmdldDtcblx0Y29uc3Qgc2VnbWVudHMgPSBwYWdlLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoQm9vbGVhbik7XG5cblx0bGV0IHJlZGlyZWN0ID0gbnVsbDtcblxuXHRjb25zdCBwcm9wcyA9IHsgZXJyb3I6IG51bGwsIHN0YXR1czogMjAwLCBzZWdtZW50czogW3NlZ21lbnRzWzBdXSB9O1xuXG5cdGNvbnN0IHByZWxvYWRfY29udGV4dCA9IHtcblx0XHRmZXRjaDogKHVybCwgb3B0cykgPT4gZmV0Y2godXJsLCBvcHRzKSxcblx0XHRyZWRpcmVjdDogKHN0YXR1c0NvZGUsIGxvY2F0aW9uKSA9PiB7XG5cdFx0XHRpZiAocmVkaXJlY3QgJiYgKHJlZGlyZWN0LnN0YXR1c0NvZGUgIT09IHN0YXR1c0NvZGUgfHwgcmVkaXJlY3QubG9jYXRpb24gIT09IGxvY2F0aW9uKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvbmZsaWN0aW5nIHJlZGlyZWN0c2ApO1xuXHRcdFx0fVxuXHRcdFx0cmVkaXJlY3QgPSB7IHN0YXR1c0NvZGUsIGxvY2F0aW9uIH07XG5cdFx0fSxcblx0XHRlcnJvcjogKHN0YXR1cywgZXJyb3IpID0+IHtcblx0XHRcdHByb3BzLmVycm9yID0gdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IG5ldyBFcnJvcihlcnJvcikgOiBlcnJvcjtcblx0XHRcdHByb3BzLnN0YXR1cyA9IHN0YXR1cztcblx0XHR9XG5cdH07XG5cblx0aWYgKCFyb290X3ByZWxvYWRlZCkge1xuXHRcdHJvb3RfcHJlbG9hZGVkID0gaW5pdGlhbF9kYXRhLnByZWxvYWRlZFswXSB8fCByb290X3ByZWxvYWQuY2FsbChwcmVsb2FkX2NvbnRleHQsIHtcblx0XHRcdGhvc3Q6IHBhZ2UuaG9zdCxcblx0XHRcdHBhdGg6IHBhZ2UucGF0aCxcblx0XHRcdHF1ZXJ5OiBwYWdlLnF1ZXJ5LFxuXHRcdFx0cGFyYW1zOiB7fVxuXHRcdH0sICRzZXNzaW9uKTtcblx0fVxuXG5cdGxldCBicmFuY2g7XG5cdGxldCBsID0gMTtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHN0cmluZ2lmaWVkX3F1ZXJ5ID0gSlNPTi5zdHJpbmdpZnkocGFnZS5xdWVyeSk7XG5cdFx0Y29uc3QgbWF0Y2ggPSByb3V0ZS5wYXR0ZXJuLmV4ZWMocGFnZS5wYXRoKTtcblxuXHRcdGxldCBzZWdtZW50X2RpcnR5ID0gZmFsc2U7XG5cblx0XHRicmFuY2ggPSBhd2FpdCBQcm9taXNlLmFsbChyb3V0ZS5wYXJ0cy5tYXAoYXN5bmMgKHBhcnQsIGkpID0+IHtcblx0XHRcdGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcblxuXHRcdFx0aWYgKHBhcnRfY2hhbmdlZChpLCBzZWdtZW50LCBtYXRjaCwgc3RyaW5naWZpZWRfcXVlcnkpKSBzZWdtZW50X2RpcnR5ID0gdHJ1ZTtcblxuXHRcdFx0cHJvcHMuc2VnbWVudHNbbF0gPSBzZWdtZW50c1tpICsgMV07IC8vIFRPRE8gbWFrZSB0aGlzIGxlc3MgY29uZnVzaW5nXG5cdFx0XHRpZiAoIXBhcnQpIHJldHVybiB7IHNlZ21lbnQgfTtcblxuXHRcdFx0Y29uc3QgaiA9IGwrKztcblxuXHRcdFx0aWYgKCFzZXNzaW9uX2RpcnR5ICYmICFzZWdtZW50X2RpcnR5ICYmIGN1cnJlbnRfYnJhbmNoW2ldICYmIGN1cnJlbnRfYnJhbmNoW2ldLnBhcnQgPT09IHBhcnQuaSkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudF9icmFuY2hbaV07XG5cdFx0XHR9XG5cblx0XHRcdHNlZ21lbnRfZGlydHkgPSBmYWxzZTtcblxuXHRcdFx0Y29uc3QgeyBkZWZhdWx0OiBjb21wb25lbnQsIHByZWxvYWQgfSA9IGF3YWl0IGxvYWRfY29tcG9uZW50KGNvbXBvbmVudHNbcGFydC5pXSk7XG5cblx0XHRcdGxldCBwcmVsb2FkZWQ7XG5cdFx0XHRpZiAocmVhZHkgfHwgIWluaXRpYWxfZGF0YS5wcmVsb2FkZWRbaSArIDFdKSB7XG5cdFx0XHRcdHByZWxvYWRlZCA9IHByZWxvYWRcblx0XHRcdFx0XHQ/IGF3YWl0IHByZWxvYWQuY2FsbChwcmVsb2FkX2NvbnRleHQsIHtcblx0XHRcdFx0XHRcdGhvc3Q6IHBhZ2UuaG9zdCxcblx0XHRcdFx0XHRcdHBhdGg6IHBhZ2UucGF0aCxcblx0XHRcdFx0XHRcdHF1ZXJ5OiBwYWdlLnF1ZXJ5LFxuXHRcdFx0XHRcdFx0cGFyYW1zOiBwYXJ0LnBhcmFtcyA/IHBhcnQucGFyYW1zKHRhcmdldC5tYXRjaCkgOiB7fVxuXHRcdFx0XHRcdH0sICRzZXNzaW9uKVxuXHRcdFx0XHRcdDoge307XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmVsb2FkZWQgPSBpbml0aWFsX2RhdGEucHJlbG9hZGVkW2kgKyAxXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChwcm9wc1tgbGV2ZWwke2p9YF0gPSB7IGNvbXBvbmVudCwgcHJvcHM6IHByZWxvYWRlZCwgc2VnbWVudCwgbWF0Y2gsIHBhcnQ6IHBhcnQuaSB9KTtcblx0XHR9KSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cHJvcHMuZXJyb3IgPSBlcnJvcjtcblx0XHRwcm9wcy5zdGF0dXMgPSA1MDA7XG5cdFx0YnJhbmNoID0gW107XG5cdH1cblxuXHRyZXR1cm4geyByZWRpcmVjdCwgcHJvcHMsIGJyYW5jaCB9O1xufVxuXG5mdW5jdGlvbiBsb2FkX2NzcyhjaHVuaykge1xuXHRjb25zdCBocmVmID0gYGNsaWVudC8ke2NodW5rfWA7XG5cdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsaW5rW2hyZWY9XCIke2hyZWZ9XCJdYCkpIHJldHVybjtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoKGZ1bGZpbCwgcmVqZWN0KSA9PiB7XG5cdFx0Y29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblx0XHRsaW5rLnJlbCA9ICdzdHlsZXNoZWV0Jztcblx0XHRsaW5rLmhyZWYgPSBocmVmO1xuXG5cdFx0bGluay5vbmxvYWQgPSAoKSA9PiBmdWxmaWwoKTtcblx0XHRsaW5rLm9uZXJyb3IgPSByZWplY3Q7XG5cblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbG9hZF9jb21wb25lbnQoY29tcG9uZW50KVxuXG5cbiB7XG5cdC8vIFRPRE8gdGhpcyBpcyB0ZW1wb3Jhcnkg4oCUIG9uY2UgcGxhY2Vob2xkZXJzIGFyZVxuXHQvLyBhbHdheXMgcmV3cml0dGVuLCBzY3JhdGNoIHRoZSB0ZXJuYXJ5XG5cdGNvbnN0IHByb21pc2VzID0gKHR5cGVvZiBjb21wb25lbnQuY3NzID09PSAnc3RyaW5nJyA/IFtdIDogY29tcG9uZW50LmNzcy5tYXAobG9hZF9jc3MpKTtcblx0cHJvbWlzZXMudW5zaGlmdChjb21wb25lbnQuanMoKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbih2YWx1ZXMgPT4gdmFsdWVzWzBdKTtcbn1cblxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcblx0bm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBwcmVmZXRjaChocmVmKSB7XG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQobmV3IFVSTChocmVmLCBkb2N1bWVudC5iYXNlVVJJKSk7XG5cblx0aWYgKHRhcmdldCkge1xuXHRcdGlmICghcHJlZmV0Y2hpbmcgfHwgaHJlZiAhPT0gcHJlZmV0Y2hpbmcuaHJlZikge1xuXHRcdFx0c2V0X3ByZWZldGNoaW5nKGhyZWYsIGh5ZHJhdGVfdGFyZ2V0KHRhcmdldCkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcmVmZXRjaGluZy5wcm9taXNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KG9wdHNcblxuKSB7XG5cdGlmICgnc2Nyb2xsUmVzdG9yYXRpb24nIGluIF9oaXN0b3J5KSB7XG5cdFx0X2hpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG5cdHNldF90YXJnZXQob3B0cy50YXJnZXQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlX2NsaWNrKTtcblx0YWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVfcG9wc3RhdGUpO1xuXG5cdC8vIHByZWZldGNoXG5cdGFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0cmlnZ2VyX3ByZWZldGNoKTtcblx0YWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlX21vdXNlbW92ZSk7XG5cblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuXHRcdGNvbnN0IHsgaGFzaCwgaHJlZiB9ID0gbG9jYXRpb247XG5cblx0XHRfaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBpZDogdWlkIH0sICcnLCBocmVmKTtcblxuXHRcdGNvbnN0IHVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cblx0XHRpZiAoaW5pdGlhbF9kYXRhLmVycm9yKSByZXR1cm4gaGFuZGxlX2Vycm9yKCk7XG5cblx0XHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KHVybCk7XG5cdFx0aWYgKHRhcmdldCkgcmV0dXJuIG5hdmlnYXRlKHRhcmdldCwgdWlkLCB0cnVlLCBoYXNoKTtcblx0fSk7XG59XG5cbmxldCBtb3VzZW1vdmVfdGltZW91dDtcblxuZnVuY3Rpb24gaGFuZGxlX21vdXNlbW92ZShldmVudCkge1xuXHRjbGVhclRpbWVvdXQobW91c2Vtb3ZlX3RpbWVvdXQpO1xuXHRtb3VzZW1vdmVfdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHRyaWdnZXJfcHJlZmV0Y2goZXZlbnQpO1xuXHR9LCAyMCk7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXJfcHJlZmV0Y2goZXZlbnQpIHtcblx0Y29uc3QgYSA9IGZpbmRfYW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdGlmICghYSB8fCBhLnJlbCAhPT0gJ3ByZWZldGNoJykgcmV0dXJuO1xuXG5cdHByZWZldGNoKGEuaHJlZik7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9jbGljayhldmVudCkge1xuXHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3BhZ2UuanNcblx0Ly8gTUlUIGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3BhZ2UuanMjbGljZW5zZVxuXHRpZiAod2hpY2goZXZlbnQpICE9PSAxKSByZXR1cm47XG5cdGlmIChldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuc2hpZnRLZXkpIHJldHVybjtcblx0aWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuXHRjb25zdCBhID0gZmluZF9hbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0aWYgKCFhKSByZXR1cm47XG5cblx0aWYgKCFhLmhyZWYpIHJldHVybjtcblxuXHQvLyBjaGVjayBpZiBsaW5rIGlzIGluc2lkZSBhbiBzdmdcblx0Ly8gaW4gdGhpcyBjYXNlLCBib3RoIGhyZWYgYW5kIHRhcmdldCBhcmUgYWx3YXlzIGluc2lkZSBhbiBvYmplY3Rcblx0Y29uc3Qgc3ZnID0gdHlwZW9mIGEuaHJlZiA9PT0gJ29iamVjdCcgJiYgYS5ocmVmLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTVkdBbmltYXRlZFN0cmluZyc7XG5cdGNvbnN0IGhyZWYgPSBTdHJpbmcoc3ZnID8gKGEpLmhyZWYuYmFzZVZhbCA6IGEuaHJlZik7XG5cblx0aWYgKGhyZWYgPT09IGxvY2F0aW9uLmhyZWYpIHtcblx0XHRpZiAoIWxvY2F0aW9uLmhhc2gpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSWdub3JlIGlmIHRhZyBoYXNcblx0Ly8gMS4gJ2Rvd25sb2FkJyBhdHRyaWJ1dGVcblx0Ly8gMi4gcmVsPSdleHRlcm5hbCcgYXR0cmlidXRlXG5cdGlmIChhLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBhLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCcpIHJldHVybjtcblxuXHQvLyBJZ25vcmUgaWYgPGE+IGhhcyBhIHRhcmdldFxuXHRpZiAoc3ZnID8gKGEpLnRhcmdldC5iYXNlVmFsIDogYS50YXJnZXQpIHJldHVybjtcblxuXHRjb25zdCB1cmwgPSBuZXcgVVJMKGhyZWYpO1xuXG5cdC8vIERvbid0IGhhbmRsZSBoYXNoIGNoYW5nZXNcblx0aWYgKHVybC5wYXRobmFtZSA9PT0gbG9jYXRpb24ucGF0aG5hbWUgJiYgdXJsLnNlYXJjaCA9PT0gbG9jYXRpb24uc2VhcmNoKSByZXR1cm47XG5cblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldCh1cmwpO1xuXHRpZiAodGFyZ2V0KSB7XG5cdFx0Y29uc3Qgbm9zY3JvbGwgPSBhLmhhc0F0dHJpYnV0ZSgnc2FwcGVyLW5vc2Nyb2xsJyk7XG5cdFx0bmF2aWdhdGUodGFyZ2V0LCBudWxsLCBub3Njcm9sbCwgdXJsLmhhc2gpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0X2hpc3RvcnkucHVzaFN0YXRlKHsgaWQ6IGNpZCB9LCAnJywgdXJsLmhyZWYpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHdoaWNoKGV2ZW50KSB7XG5cdHJldHVybiBldmVudC53aGljaCA9PT0gbnVsbCA/IGV2ZW50LmJ1dHRvbiA6IGV2ZW50LndoaWNoO1xufVxuXG5mdW5jdGlvbiBmaW5kX2FuY2hvcihub2RlKSB7XG5cdHdoaWxlIChub2RlICYmIG5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPT0gJ0EnKSBub2RlID0gbm9kZS5wYXJlbnROb2RlOyAvLyBTVkcgPGE+IGVsZW1lbnRzIGhhdmUgYSBsb3dlcmNhc2UgbmFtZVxuXHRyZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlX3BvcHN0YXRlKGV2ZW50KSB7XG5cdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBzY3JvbGxfc3RhdGUoKTtcblxuXHRpZiAoZXZlbnQuc3RhdGUpIHtcblx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQodXJsKTtcblx0XHRpZiAodGFyZ2V0KSB7XG5cdFx0XHRuYXZpZ2F0ZSh0YXJnZXQsIGV2ZW50LnN0YXRlLmlkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIGhhc2hjaGFuZ2Vcblx0XHRzZXRfdWlkKHVpZCArIDEpO1xuXHRcdHNldF9jaWQodWlkKTtcblx0XHRfaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBpZDogY2lkIH0sICcnLCBsb2NhdGlvbi5ocmVmKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwcmVmZXRjaFJvdXRlcyhwYXRobmFtZXMpIHtcblx0cmV0dXJuIHJvdXRlc1xuXHRcdC5maWx0ZXIocGF0aG5hbWVzXG5cdFx0XHQ/IHJvdXRlID0+IHBhdGhuYW1lcy5zb21lKHBhdGhuYW1lID0+IHJvdXRlLnBhdHRlcm4udGVzdChwYXRobmFtZSkpXG5cdFx0XHQ6ICgpID0+IHRydWVcblx0XHQpXG5cdFx0LnJlZHVjZSgocHJvbWlzZSwgcm91dGUpID0+IHByb21pc2UudGhlbigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwocm91dGUucGFydHMubWFwKHBhcnQgPT4gcGFydCAmJiBsb2FkX2NvbXBvbmVudChjb21wb25lbnRzW3BhcnQuaV0pKSk7XG5cdFx0fSksIFByb21pc2UucmVzb2x2ZSgpKTtcbn1cblxuY29uc3Qgc3RvcmVzJDEgPSAoKSA9PiBnZXRDb250ZXh0KENPTlRFWFRfS0VZKTtcblxuZXhwb3J0IHsgZ290bywgcHJlZmV0Y2gsIHByZWZldGNoUm91dGVzLCBzdGFydCwgc3RvcmVzJDEgYXMgc3RvcmVzIH07XG4iLCJpbXBvcnQgKiBhcyBzYXBwZXIgZnJvbSBcIkBzYXBwZXIvYXBwXCI7XG5cbnNhcHBlci5zdGFydCh7XG4gIHRhcmdldDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzYXBwZXJcIilcbn0pO1xuIl0sIm5hbWVzIjpbIm5vb3AiLCJpZGVudGl0eSIsIngiLCJhc3NpZ24iLCJ0YXIiLCJzcmMiLCJrIiwiYWRkX2xvY2F0aW9uIiwiZWxlbWVudCIsImZpbGUiLCJsaW5lIiwiY29sdW1uIiwiY2hhciIsIl9fc3ZlbHRlX21ldGEiLCJsb2MiLCJydW4iLCJmbiIsImJsYW5rX29iamVjdCIsIk9iamVjdCIsImNyZWF0ZSIsInJ1bl9hbGwiLCJmbnMiLCJmb3JFYWNoIiwiaXNfZnVuY3Rpb24iLCJ0aGluZyIsInNhZmVfbm90X2VxdWFsIiwiYSIsImIiLCJ2YWxpZGF0ZV9zdG9yZSIsInN0b3JlIiwibmFtZSIsInN1YnNjcmliZSIsIkVycm9yIiwiY2FsbGJhY2tzIiwidW5zdWIiLCJ1bnN1YnNjcmliZSIsImNvbXBvbmVudF9zdWJzY3JpYmUiLCJjb21wb25lbnQiLCJjYWxsYmFjayIsIiQkIiwib25fZGVzdHJveSIsInB1c2giLCJjcmVhdGVfc2xvdCIsImRlZmluaXRpb24iLCJjdHgiLCIkJHNjb3BlIiwic2xvdF9jdHgiLCJnZXRfc2xvdF9jb250ZXh0Iiwic2xpY2UiLCJnZXRfc2xvdF9jaGFuZ2VzIiwiZGlydHkiLCJsZXRzIiwidW5kZWZpbmVkIiwibWVyZ2VkIiwibGVuIiwiTWF0aCIsIm1heCIsImxlbmd0aCIsImkiLCJ1cGRhdGVfc2xvdCIsInNsb3QiLCJzbG90X2RlZmluaXRpb24iLCJnZXRfc2xvdF9jaGFuZ2VzX2ZuIiwiZ2V0X3Nsb3RfY29udGV4dF9mbiIsInNsb3RfY2hhbmdlcyIsInNsb3RfY29udGV4dCIsInAiLCJleGNsdWRlX2ludGVybmFsX3Byb3BzIiwicHJvcHMiLCJyZXN1bHQiLCJudWxsX3RvX2VtcHR5IiwidmFsdWUiLCJhY3Rpb25fZGVzdHJveWVyIiwiYWN0aW9uX3Jlc3VsdCIsImRlc3Ryb3kiLCJpc19jbGllbnQiLCJ3aW5kb3ciLCJub3ciLCJwZXJmb3JtYW5jZSIsIkRhdGUiLCJyYWYiLCJjYiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInRhc2tzIiwiU2V0IiwicnVuX3Rhc2tzIiwidGFzayIsImMiLCJkZWxldGUiLCJmIiwic2l6ZSIsImxvb3AiLCJwcm9taXNlIiwiUHJvbWlzZSIsImZ1bGZpbGwiLCJhZGQiLCJhYm9ydCIsImFwcGVuZCIsInRhcmdldCIsIm5vZGUiLCJhcHBlbmRDaGlsZCIsImluc2VydCIsImFuY2hvciIsImluc2VydEJlZm9yZSIsImRldGFjaCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImRlc3Ryb3lfZWFjaCIsIml0ZXJhdGlvbnMiLCJkZXRhY2hpbmciLCJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ZnX2VsZW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJ0ZXh0IiwiZGF0YSIsImNyZWF0ZVRleHROb2RlIiwic3BhY2UiLCJlbXB0eSIsImxpc3RlbiIsImV2ZW50IiwiaGFuZGxlciIsIm9wdGlvbnMiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInByZXZlbnRfZGVmYXVsdCIsInByZXZlbnREZWZhdWx0IiwiY2FsbCIsImF0dHIiLCJhdHRyaWJ1dGUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJkZXNjcmlwdG9ycyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJfX3Byb3RvX18iLCJrZXkiLCJzdHlsZSIsImNzc1RleHQiLCJzZXQiLCJjaGlsZHJlbiIsIkFycmF5IiwiZnJvbSIsImNoaWxkTm9kZXMiLCJjbGFpbV9lbGVtZW50Iiwibm9kZXMiLCJzdmciLCJub2RlTmFtZSIsImoiLCJyZW1vdmUiLCJzcGxpY2UiLCJjbGFpbV90ZXh0Iiwibm9kZVR5cGUiLCJjbGFpbV9zcGFjZSIsInNldF9zdHlsZSIsImltcG9ydGFudCIsInNldFByb3BlcnR5IiwidG9nZ2xlX2NsYXNzIiwidG9nZ2xlIiwiY2xhc3NMaXN0IiwiY3VzdG9tX2V2ZW50IiwidHlwZSIsImRldGFpbCIsImUiLCJjcmVhdGVFdmVudCIsImluaXRDdXN0b21FdmVudCIsInF1ZXJ5X3NlbGVjdG9yX2FsbCIsInNlbGVjdG9yIiwicGFyZW50IiwiYm9keSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhY3RpdmVfZG9jcyIsImFjdGl2ZSIsImhhc2giLCJzdHIiLCJjaGFyQ29kZUF0IiwiY3JlYXRlX3J1bGUiLCJkdXJhdGlvbiIsImRlbGF5IiwiZWFzZSIsInVpZCIsInN0ZXAiLCJrZXlmcmFtZXMiLCJ0IiwicnVsZSIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJzdHlsZXNoZWV0IiwiX19zdmVsdGVfc3R5bGVzaGVldCIsImhlYWQiLCJzaGVldCIsImN1cnJlbnRfcnVsZXMiLCJfX3N2ZWx0ZV9ydWxlcyIsImluc2VydFJ1bGUiLCJjc3NSdWxlcyIsImFuaW1hdGlvbiIsImRlbGV0ZV9ydWxlIiwicHJldmlvdXMiLCJzcGxpdCIsIm5leHQiLCJmaWx0ZXIiLCJhbmltIiwiaW5kZXhPZiIsImRlbGV0ZWQiLCJqb2luIiwiY2xlYXJfcnVsZXMiLCJkZWxldGVSdWxlIiwiY2xlYXIiLCJjdXJyZW50X2NvbXBvbmVudCIsInNldF9jdXJyZW50X2NvbXBvbmVudCIsImdldF9jdXJyZW50X2NvbXBvbmVudCIsIm9uTW91bnQiLCJvbl9tb3VudCIsIm9uRGVzdHJveSIsImNyZWF0ZUV2ZW50RGlzcGF0Y2hlciIsInNldENvbnRleHQiLCJjb250ZXh0IiwiZ2V0Q29udGV4dCIsImdldCIsImJ1YmJsZSIsImRpcnR5X2NvbXBvbmVudHMiLCJiaW5kaW5nX2NhbGxiYWNrcyIsInJlbmRlcl9jYWxsYmFja3MiLCJmbHVzaF9jYWxsYmFja3MiLCJyZXNvbHZlZF9wcm9taXNlIiwicmVzb2x2ZSIsInVwZGF0ZV9zY2hlZHVsZWQiLCJzY2hlZHVsZV91cGRhdGUiLCJ0aGVuIiwiZmx1c2giLCJhZGRfcmVuZGVyX2NhbGxiYWNrIiwiYWRkX2ZsdXNoX2NhbGxiYWNrIiwiZmx1c2hpbmciLCJzZWVuX2NhbGxiYWNrcyIsInVwZGF0ZSIsInBvcCIsImhhcyIsImZyYWdtZW50IiwiYmVmb3JlX3VwZGF0ZSIsImFmdGVyX3VwZGF0ZSIsIndhaXQiLCJkaXNwYXRjaCIsImRpcmVjdGlvbiIsImtpbmQiLCJkaXNwYXRjaEV2ZW50Iiwib3V0cm9pbmciLCJvdXRyb3MiLCJncm91cF9vdXRyb3MiLCJyIiwiY2hlY2tfb3V0cm9zIiwidHJhbnNpdGlvbl9pbiIsImJsb2NrIiwibG9jYWwiLCJ0cmFuc2l0aW9uX291dCIsIm8iLCJudWxsX3RyYW5zaXRpb24iLCJjcmVhdGVfaW5fdHJhbnNpdGlvbiIsInBhcmFtcyIsImNvbmZpZyIsInJ1bm5pbmciLCJhbmltYXRpb25fbmFtZSIsImNsZWFudXAiLCJnbyIsImVhc2luZyIsInRpY2siLCJjc3MiLCJzdGFydF90aW1lIiwiZW5kX3RpbWUiLCJzdGFydGVkIiwic3RhcnQiLCJpbnZhbGlkYXRlIiwiZW5kIiwiY3JlYXRlX291dF90cmFuc2l0aW9uIiwiZ3JvdXAiLCJyZXNldCIsImNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24iLCJpbnRybyIsInJ1bm5pbmdfcHJvZ3JhbSIsInBlbmRpbmdfcHJvZ3JhbSIsImNsZWFyX2FuaW1hdGlvbiIsImluaXQiLCJwcm9ncmFtIiwiYWJzIiwiZ2xvYmFscyIsImdsb2JhbFRoaXMiLCJnbG9iYWwiLCJnZXRfc3ByZWFkX3VwZGF0ZSIsImxldmVscyIsInVwZGF0ZXMiLCJ0b19udWxsX291dCIsImFjY291bnRlZF9mb3IiLCJuIiwiZ2V0X3NwcmVhZF9vYmplY3QiLCJzcHJlYWRfcHJvcHMiLCJiaW5kIiwiaW5kZXgiLCJib3VuZCIsImNyZWF0ZV9jb21wb25lbnQiLCJjbGFpbV9jb21wb25lbnQiLCJwYXJlbnRfbm9kZXMiLCJsIiwibW91bnRfY29tcG9uZW50IiwibSIsIm5ld19vbl9kZXN0cm95IiwibWFwIiwiZGVzdHJveV9jb21wb25lbnQiLCJtYWtlX2RpcnR5IiwiZmlsbCIsImluc3RhbmNlIiwiY3JlYXRlX2ZyYWdtZW50Iiwibm90X2VxdWFsIiwicGFyZW50X2NvbXBvbmVudCIsInByb3BfdmFsdWVzIiwiTWFwIiwicmVhZHkiLCJyZXQiLCJyZXN0IiwiaHlkcmF0ZSIsIlN2ZWx0ZUNvbXBvbmVudCIsIiRkZXN0cm95IiwiJG9uIiwiJHNldCIsImRpc3BhdGNoX2RldiIsInZlcnNpb24iLCJhcHBlbmRfZGV2IiwiaW5zZXJ0X2RldiIsImRldGFjaF9kZXYiLCJsaXN0ZW5fZGV2IiwiaGFzX3ByZXZlbnRfZGVmYXVsdCIsImhhc19zdG9wX3Byb3BhZ2F0aW9uIiwibW9kaWZpZXJzIiwia2V5cyIsImRpc3Bvc2UiLCJhdHRyX2RldiIsInNldF9kYXRhX2RldiIsIndob2xlVGV4dCIsInZhbGlkYXRlX2VhY2hfYXJndW1lbnQiLCJhcmciLCJtc2ciLCJTeW1ib2wiLCJpdGVyYXRvciIsInZhbGlkYXRlX3Nsb3RzIiwic2xvdF9rZXkiLCJjb25zb2xlIiwid2FybiIsIlN2ZWx0ZUNvbXBvbmVudERldiIsImNvbnN0cnVjdG9yIiwiJCRpbmxpbmUiLCIkY2FwdHVyZV9zdGF0ZSIsIiRpbmplY3Rfc3RhdGUiLCJzdWJzY3JpYmVyX3F1ZXVlIiwid3JpdGFibGUiLCJzdG9wIiwic3Vic2NyaWJlcnMiLCJuZXdfdmFsdWUiLCJydW5fcXVldWUiLCJzIiwic3Vic2NyaWJlciIsIkNPTlRFWFRfS0VZIiwicHJlbG9hZCIsIm5vRGVwdGgiLCJnZXRDbGFzcyIsInByb3AiLCJjb2xvciIsImRlcHRoIiwiZGVmYXVsdERlcHRoIiwiaW5jbHVkZXMiLCJ1dGlscyIsImJnIiwiYm9yZGVyIiwidHh0IiwiY2FyZXQiLCJDbGFzc0J1aWxkZXIiLCJjbGFzc2VzIiwiZGVmYXVsdENsYXNzZXMiLCJkZWZhdWx0cyIsImV4dGVuZCIsInJlcGxhY2UiLCJjb25kIiwicmVkdWNlIiwiYWNjIiwiUmVnRXhwIiwiY3VyIiwiY2xhc3NOYW1lIiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdFJlc2VydmVkIiwiZmlsdGVyUHJvcHMiLCJyZXNlcnZlZCIsImNsYXNzZXNEZWZhdWx0IiwiJCIsIiQkcHJvcHMiLCJjbGFzcyIsInNtYWxsIiwieHMiLCJyZXZlcnNlIiwidGlwIiwicmlwcGxlIiwiY2VudGVyZWQiLCJjdXJyZW50VGFyZ2V0IiwiY2lyY2xlIiwiY2xpZW50V2lkdGgiLCJjbGllbnRIZWlnaHQiLCJyZW1vdmVDaXJjbGUiLCJ3aWR0aCIsImhlaWdodCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0IiwiY2xpZW50WCIsInRvcCIsImNsaWVudFkiLCJvbk1vdXNlRG93biIsImljb24iLCJpZCIsInRvIiwic2VsZWN0ZWQiLCJub3RTZWxlY3RlZENvbG9yIiwidGFiQ2xhc3NlcyIsImNyZWF0ZVJpcHBsZSIsIm5vdFNlbGVjdGVkIiwidGV4dENvbG9yIiwiY3ViaWNPdXQiLCJxdWFkSW4iLCJxdWFkT3V0IiwiZmFkZSIsImxpbmVhciIsImdldENvbXB1dGVkU3R5bGUiLCJvcGFjaXR5IiwiZmx5IiwieSIsInRhcmdldF9vcGFjaXR5IiwidHJhbnNmb3JtIiwib2QiLCJ1Iiwic2xpZGUiLCJwYXJzZUZsb2F0IiwicGFkZGluZ190b3AiLCJwYWRkaW5nVG9wIiwicGFkZGluZ19ib3R0b20iLCJwYWRkaW5nQm90dG9tIiwibWFyZ2luX3RvcCIsIm1hcmdpblRvcCIsIm1hcmdpbl9ib3R0b20iLCJtYXJnaW5Cb3R0b20iLCJib3JkZXJfdG9wX3dpZHRoIiwiYm9yZGVyVG9wV2lkdGgiLCJib3JkZXJfYm90dG9tX3dpZHRoIiwiYm9yZGVyQm90dG9tV2lkdGgiLCJtaW4iLCJzY2FsZSIsInNkIiwiX3QiLCJhcHAiLCJwcm9ncmVzcyIsImluaXRpYWxpemVkIiwic2V0VGltZW91dCIsIm5hdmlnYXRpb24iLCJpdGVtcyIsImluZGljYXRvciIsImxvYWRpbmciLCJ0YWJCdXR0b25DbGFzc2VzIiwiaW5kaWNhdG9yV2lkdGgiLCJpbmRpY2F0b3JPZmZzZXQiLCJvZmZzZXQiLCJjYWxjSW5kaWNhdG9yIiwib2Zmc2V0V2lkdGgiLCJmaW5kSW5kZXgiLCJsb25nZXN0TWF0Y2giLCJpdGVtIiwic29ydCIsImluZGV4MSIsIml0ZW0xIiwiaW5kZXgyIiwiaXRlbTIiLCJiYXNpY0RlZmF1bHQiLCJvdXRsaW5lZERlZmF1bHQiLCJ0ZXh0RGVmYXVsdCIsImljb25EZWZhdWx0IiwiZmFiRGVmYXVsdCIsInNtYWxsRGVmYXVsdCIsImRpc2FibGVkRGVmYXVsdCIsImVsZXZhdGlvbkRlZmF1bHQiLCJvdXRsaW5lZCIsImRpc2FibGVkIiwibGlnaHQiLCJkYXJrIiwiZmxhdCIsImljb25DbGFzcyIsImhyZWYiLCJmYWIiLCJiYXNpY0NsYXNzZXMiLCJvdXRsaW5lZENsYXNzZXMiLCJ0ZXh0Q2xhc3NlcyIsImljb25DbGFzc2VzIiwiZmFiQ2xhc3NlcyIsInNtYWxsQ2xhc3NlcyIsImRpc2FibGVkQ2xhc3NlcyIsImVsZXZhdGlvbkNsYXNzZXMiLCJiYXNpYyIsImVsZXZhdGlvbiIsIkNsYXNzZXMiLCJpQ2xhc3NlcyIsInNoYWRlIiwiaWNvbkNiIiwibm9ybWFsIiwibGlnaHRlciIsImluUHJvcHMiLCJvdXRQcm9wcyIsIlNjcmltIiwic2NyaW0iLCJTcGFjZXIiLCJzcGFjZXIiLCJzZWxlY3RlZENsYXNzZXNEZWZhdWx0Iiwic3ViaGVhZGluZ0NsYXNzZXNEZWZhdWx0Iiwic3ViaGVhZGluZyIsImRlbnNlIiwidGFiaW5kZXgiLCJzZWxlY3RlZENsYXNzZXMiLCJzdWJoZWFkaW5nQ2xhc3NlcyIsImxldmVsIiwiY2hhbmdlIiwiZ2V0VGV4dCIsInNlbGVjdCIsIml0ZW1DbGFzc2VzIiwiZGVmYXVsdENhbGMiLCJicmVha3BvaW50IiwiY2FsY0JyZWFrcG9pbnQiLCJpbm5lcldpZHRoIiwib25SZXNpemUiLCJicCIsImJyZWFrcG9pbnRzIiwibmF2Q2xhc3Nlc0RlZmF1bHQiLCJyaWdodCIsInBlcnNpc3RlbnQiLCJzaG93IiwibmF2Q2xhc3NlcyIsImJvcmRlckNsYXNzZXMiLCJ0cmFuc2l0aW9uUHJvcHMiLCJoaWRkZW4iLCIkYnAiLCJuY2IiLCJkZWJvdW5jZSIsImZ1bmMiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiYXJncyIsImFyZ3VtZW50cyIsImxhdGVyIiwiYXBwbHkiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0IiwiZGVsYXlIaWRlIiwiZGVsYXlTaG93Iiwic2hvd1Rvb2x0aXAiLCJoaWRlVG9vbHRpcCIsIm5hdk1lbnUiLCJ0b3BNZW51Iiwic2hvd05hdiIsImRhcmtNb2RlIiwiaXNEYXJrVGhlbWUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImJvZHlDbGFzc2VzIiwidiIsInByZWxvYWRpbmciLCJwYWdlIiwic3RvcmVzIiwicGF0aCIsIiRkYXJrTW9kZSIsIiRzaG93TmF2IiwiJHBhZ2UiLCJzdGFjayIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJlcnJvciIsImRldiIsInNlZ21lbnRzIiwibGV2ZWwwIiwibGV2ZWwxIiwiaWdub3JlIiwiY29tcG9uZW50cyIsImpzIiwicm91dGVzIiwicGF0dGVybiIsInBhcnRzIiwiY2xpZW50IiwiY29ubmVjdCIsImdvdG8iLCJvcHRzIiwicmVwbGFjZVN0YXRlIiwic2VsZWN0X3RhcmdldCIsIlVSTCIsImJhc2VVUkkiLCJfaGlzdG9yeSIsImNpZCIsIm5hdmlnYXRlIiwibG9jYXRpb24iLCJpbml0aWFsX2RhdGEiLCJfX1NBUFBFUl9fIiwicm9vdF9jb21wb25lbnQiLCJjdXJyZW50X3Rva2VuIiwicm9vdF9wcmVsb2FkZWQiLCJjdXJyZW50X2JyYW5jaCIsImN1cnJlbnRfcXVlcnkiLCJzZXNzaW9uIiwiJHNlc3Npb24iLCJzZXNzaW9uX2RpcnR5IiwidG9rZW4iLCJyZWRpcmVjdCIsImJyYW5jaCIsImh5ZHJhdGVfdGFyZ2V0IiwicmVuZGVyIiwicHJlZmV0Y2hpbmciLCJzZXRfcHJlZmV0Y2hpbmciLCJzZXRfdGFyZ2V0Iiwic2V0X3VpZCIsInNldF9jaWQiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwic3RhdGUiLCJ0aXRsZSIsInNjcm9sbFJlc3RvcmF0aW9uIiwic2Nyb2xsX2hpc3RvcnkiLCJleHRyYWN0X3F1ZXJ5Iiwic2VhcmNoIiwicXVlcnkiLCJzZWFyY2hQYXJhbSIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ1cmwiLCJvcmlnaW4iLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJiYXNlVXJsIiwic29tZSIsInRlc3QiLCJyb3V0ZSIsIm1hdGNoIiwicGFydCIsImhvc3QiLCJoYW5kbGVfZXJyb3IiLCJwcmVsb2FkZWQiLCJFcnJvckNvbXBvbmVudCIsInNjcm9sbF9zdGF0ZSIsInBhZ2VYT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJub3Njcm9sbCIsImN1cnJlbnRfc2Nyb2xsIiwibG9hZGVkIiwiYWN0aXZlRWxlbWVudCIsImJsdXIiLCJzY3JvbGwiLCJkZWVwX2xpbmtlZCIsImdldEVsZW1lbnRCeUlkIiwic2Nyb2xsVG8iLCJxdWVyeVNlbGVjdG9yIiwibmV4dFNpYmxpbmciLCJBcHAiLCJKU09OIiwic3RyaW5naWZ5IiwicGFydF9jaGFuZ2VkIiwic2VnbWVudCIsInN0cmluZ2lmaWVkX3F1ZXJ5IiwiQm9vbGVhbiIsInByZWxvYWRfY29udGV4dCIsImZldGNoIiwic3RhdHVzQ29kZSIsInJvb3RfcHJlbG9hZCIsInNlZ21lbnRfZGlydHkiLCJhbGwiLCJkZWZhdWx0IiwibG9hZF9jb21wb25lbnQiLCJsb2FkX2NzcyIsImNodW5rIiwiZnVsZmlsIiwicmVqZWN0IiwibGluayIsInJlbCIsIm9ubG9hZCIsIm9uZXJyb3IiLCJwcm9taXNlcyIsInVuc2hpZnQiLCJ2YWx1ZXMiLCJwcmVmZXRjaCIsImhhbmRsZV9jbGljayIsImhhbmRsZV9wb3BzdGF0ZSIsInRyaWdnZXJfcHJlZmV0Y2giLCJoYW5kbGVfbW91c2Vtb3ZlIiwibW91c2Vtb3ZlX3RpbWVvdXQiLCJmaW5kX2FuY2hvciIsIndoaWNoIiwibWV0YUtleSIsImN0cmxLZXkiLCJzaGlmdEtleSIsImRlZmF1bHRQcmV2ZW50ZWQiLCJTdHJpbmciLCJiYXNlVmFsIiwiaGFzQXR0cmlidXRlIiwiYnV0dG9uIiwidG9VcHBlckNhc2UiLCJzdG9yZXMkMSIsInNhcHBlciJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsSUFBVCxHQUFnQjs7QUFDaEIsTUFBTUMsUUFBUSxHQUFHQyxDQUFDLElBQUlBLENBQXRCOztBQUNBLFNBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLEVBQXFCQyxHQUFy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O0FBRENBLFFBQUFBLEdBQVUsRUFBQTs7Ozs7Ozs7QUFKZkEsUUFBQUEsR0FBQyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVpEQSxFQUFBQSxHQUFJLEVBQUEsQ0FBSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBREtBLE1BQUFBLEdBQVUsRUFBQTs7OztBQUpoQkEsTUFBQUEsR0FBRSxFQUFBOzs7QUFDREEsTUFBQUEsR0FBQyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSURBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFEQ0EsUUFBQUEsR0FBVSxFQUFBOzs7Ozs7OztBQUpoQkEsUUFBQUEsR0FBRSxFQUFBOzs7Ozs7OztBQUNEQSxRQUFBQSxHQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JzQkEsTUFBQUEsR0FBUyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBVEEsTUFBQUEsR0FBUyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUdBLE1BQUFBLEdBQUksRUFBQTs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7O0FBQUpBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJbkNBLE1BQUFBLEdBQUksRUFBQTs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7O0FBQUpBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXJCZUEsTUFBQUEsR0FBUyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBVEEsTUFBQUEsR0FBUyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUdBLE1BQUFBLEdBQUksRUFB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
