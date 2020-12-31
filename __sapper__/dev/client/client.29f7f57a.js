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

function stop_propagation(fn) {
  return function (event) {
    event.stopPropagation(); // @ts-ignore

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

function to_number(value) {
  return value === '' ? undefined : +value;
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

function set_input_value(input, value) {
  input.value = value == null ? '' : value;
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

class HtmlTag {
  constructor(anchor = null) {
    this.a = anchor;
    this.e = this.n = null;
  }

  m(html, target, anchor = null) {
    if (!this.e) {
      this.e = element(target.nodeName);
      this.t = target;
      this.h(html);
    }

    this.i(anchor);
  }

  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(this.e.childNodes);
  }

  i(anchor) {
    for (let i = 0; i < this.n.length; i += 1) {
      insert(this.t, this.n[i], anchor);
    }
  }

  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }

  d() {
    this.n.forEach(detach);
  }

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

function prop_dev(node, property, value) {
  node[property] = value;
  dispatch_dev("SvelteDOMSetProperty", {
    node,
    property,
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
      add_location(header, file, 16, 0, 367);
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
  let classesDefault = "fixed top-0 w-full items-center flex-wrap flex left-0 z-30 p-0 h-16 elevation-3 bg-primary-300 dark:bg-dark-600";
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

/* src/components/Tabs/Tab.svelte generated by Svelte v3.24.0 */

function create_if_block$1(ctx) {
  let current;
  const default_slot_template =
  /*$$slots*/
  ctx[3].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[2], null);
  const block = {
    c: function create() {
      if (default_slot) default_slot.c();
    },
    l: function claim(nodes) {
      if (default_slot) default_slot.l(nodes);
    },
    m: function mount(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        4) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[2], dirty, null, null);
        }
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
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$1.name,
    type: "if",
    source: "(6:0) {#if selected === id}",
    ctx
  });
  return block;
}

function create_fragment$3(ctx) {
  let if_block_anchor;
  let current;
  let if_block =
  /*selected*/
  ctx[0] ===
  /*id*/
  ctx[1] && create_if_block$1(ctx);
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
      /*selected*/
      ctx[0] ===
      /*id*/
      ctx[1]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*selected, id*/
          3) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$1(ctx);
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
    id: create_fragment$3.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$3($$self, $$props, $$invalidate) {
  let {
    selected = false
  } = $$props;
  let {
    id = null
  } = $$props;
  const writable_props = ["selected", "id"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tab> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Tab", $$slots, ['default']);

  $$self.$set = $$props => {
    if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    if ("id" in $$props) $$invalidate(1, id = $$props.id);
    if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = () => ({
    selected,
    id
  });

  $$self.$inject_state = $$props => {
    if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    if ("id" in $$props) $$invalidate(1, id = $$props.id);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [selected, id, $$scope, $$slots];
}

class Tab extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      selected: 0,
      id: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Tab",
      options,
      id: create_fragment$3.name
    });
  }

  get selected() {
    throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set selected(value) {
    throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get id() {
    throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set id(value) {
    throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

function create_fragment$4(ctx) {
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
    id: create_fragment$4.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$4($$self, $$props, $$invalidate) {
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
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {
      width: 0,
      left: 1,
      color: 3
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Indicator",
      options,
      id: create_fragment$4.name
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

function create_fragment$5(ctx) {
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
    id: create_fragment$5.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$5($$self, $$props, $$invalidate) {
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
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      app: 0,
      progress: 1,
      color: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "ProgressLinear",
      options,
      id: create_fragment$5.name
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


function create_if_block$2(ctx) {
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
    id: create_if_block$2.name,
    type: "if",
    source: "(82:0) {#if loading}",
    ctx
  });
  return block;
}

function create_fragment$6(ctx) {
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
  ctx[5] && create_if_block$2(ctx);
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
          if_block1 = create_if_block$2(ctx);
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
    id: create_fragment$6.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$1 = "y-0 h-full items-center relative mx-auto z-20";

function instance$6($$self, $$props, $$invalidate) {
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
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {
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
      id: create_fragment$6.name
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


function create_if_block$3(ctx) {
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
    id: create_if_block$3.name,
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

function create_fragment$7(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$3, create_else_block$1];
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
    id: create_fragment$7.name,
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

function instance$7($$self, $$props, $$invalidate) {
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
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
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
      id: create_fragment$7.name
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

function create_fragment$8(ctx) {
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
    id: create_fragment$8.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$8($$self, $$props, $$invalidate) {
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
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {
      opacity: 0,
      inProps: 1,
      outProps: 2
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Scrim",
      options,
      id: create_fragment$8.name
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

function create_fragment$9(ctx) {
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
    id: create_fragment$9.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$9($$self, $$props) {
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
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Spacer",
      options,
      id: create_fragment$9.name
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


function create_if_block$4(ctx) {
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
    id: create_if_block$4.name,
    type: "if",
    source: "(72:4) {#if subheading}",
    ctx
  });
  return block;
}

function create_fragment$a(ctx) {
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
  ctx[2] && create_if_block$4(ctx);
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
          if_block1 = create_if_block$4(ctx);
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
    id: create_fragment$a.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$3 = "focus:bg-gray-50 dark-focus:bg-gray-700 hover:bg-gray-transDark relative overflow-hidden duration-100 p-4 cursor-pointer text-gray-700 dark:text-gray-100 flex items-center z-10";
const selectedClassesDefault = "bg-gray-200 dark:bg-primary-transLight";
const subheadingClassesDefault = "text-gray-600 p-0 text-sm";

function instance$a($$self, $$props, $$invalidate) {
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
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
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
      id: create_fragment$a.name
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


function create_if_block$5(ctx) {
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
    id: create_if_block$5.name,
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
  const if_block_creators = [create_if_block$5, create_else_block$2];
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

function create_fragment$b(ctx) {
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
    id: create_fragment$b.name,
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

function instance$b($$self, $$props, $$invalidate) {
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
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {
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
      id: create_fragment$b.name
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
  style.textContent = ".drawer.svelte-6qcjcu{min-width:250px}aside.svelte-6qcjcu{height:100vh}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2aWdhdGlvbkRyYXdlci5zdmVsdGUiLCJzb3VyY2VzIjpbIk5hdmlnYXRpb25EcmF3ZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGZseSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuICBpbXBvcnQgeyBxdWFkSW4gfSBmcm9tIFwic3ZlbHRlL2Vhc2luZ1wiO1xuICBpbXBvcnQgeyBTY3JpbSB9IGZyb20gXCIuLi9VdGlsXCI7XG4gIGltcG9ydCBicmVha3BvaW50cyBmcm9tIFwiLi4vLi4vYnJlYWtwb2ludHNcIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBicCA9IGJyZWFrcG9pbnRzKCk7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcImZpeGVkIHRvcC0wIG1kOm10LTE2IHctYXV0byBkcmF3ZXIgb3ZlcmZsb3ctaGlkZGVuIGgtZnVsbFwiO1xuICBjb25zdCBuYXZDbGFzc2VzRGVmYXVsdCA9IGBoLWZ1bGwgdy1mdWxsIGJnLXdoaXRlIGRhcms6YmctZ3JheS05MDAgZGFyazp0ZXh0LWdyYXktMjAwIGFic29sdXRlIGZsZXggdy1hdXRvIHotMjAgZHJhd2VyXG4gICAgcG9pbnRlci1ldmVudHMtYXV0byBvdmVyZmxvdy15LWF1dG9gO1xuXG4gIGV4cG9ydCBsZXQgcmlnaHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwZXJzaXN0ZW50ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZWxldmF0aW9uID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBzaG93ID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgbmF2Q2xhc3NlcyA9IG5hdkNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IGJvcmRlckNsYXNzZXMgPSBgYm9yZGVyLWdyYXktNjAwICR7cmlnaHQgPyBcImJvcmRlci1sXCIgOiBcImJvcmRlci1yXCJ9YDtcblxuXG5cblxuICBleHBvcnQgbGV0IHRyYW5zaXRpb25Qcm9wcyA9IHtcbiAgICBkdXJhdGlvbjogMjAwLFxuICAgIHg6IC0zMDAsXG4gICAgZWFzaW5nOiBxdWFkSW4sXG4gICAgb3BhY2l0eTogMSxcbiAgfTtcblxuICAkOiB0cmFuc2l0aW9uUHJvcHMueCA9IHJpZ2h0ID8gMzAwIDogLTMwMDtcblxuICAvLyBJcyB0aGUgZHJhd2VyIGRlbGliZXJhdGVseSBoaWRkZW4/IERvbid0IGxldCB0aGUgJGJwIGNoZWNrIG1ha2UgaXQgdmlzaWJsZSBpZiBzby5cbiAgbGV0IGhpZGRlbiA9ICFzaG93O1xuICAkOiBpZiAoIWhpZGRlbikgcGVyc2lzdGVudCA9IHNob3cgPSAkYnAgIT09IFwic21cIjtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuXG4gIGlmICgkYnAgPT09ICdzbScpIHNob3cgPSBmYWxzZTtcblxuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoY2xhc3NlcywgdHJ1ZSwgY2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZChib3JkZXJDbGFzc2VzLCAhZWxldmF0aW9uICYmIHBlcnNpc3RlbnQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5hZGQoXCJyaWdodC0wXCIsIHJpZ2h0KVxuICAgIC5hZGQoXCJsZWZ0LTBcIiwgIXJpZ2h0KVxuICAgIC5hZGQoXCJwb2ludGVyLWV2ZW50cy1ub25lXCIsIHBlcnNpc3RlbnQpXG4gICAgLmFkZChcInotNTBcIiwgIXBlcnNpc3RlbnQpXG4gICAgLmFkZChcImVsZXZhdGlvbi00XCIsIGVsZXZhdGlvbilcbiAgICAuYWRkKFwiei0yMFwiLCBwZXJzaXN0ZW50KVxuICAgIC5nZXQoKTtcblxuICBjb25zdCBuY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKG5hdkNsYXNzZXMsIG5hdkNsYXNzZXNEZWZhdWx0KTtcblxuICAkOiBuID0gbmNiXG4gICAgLmZsdXNoKClcbiAgICAuZ2V0KCk7XG5cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5kcmF3ZXIge1xuICAgIG1pbi13aWR0aDogMjUwcHg7XG4gIH1cblxuICBhc2lkZSB7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgfVxuPC9zdHlsZT5cblxueyNpZiBzaG93fVxuICA8YXNpZGVcbiAgICBjbGFzcz17Y31cbiAgICB0cmFuc2l0aW9uOmZseT17dHJhbnNpdGlvblByb3BzfVxuICA+XG4gICAgeyNpZiAhcGVyc2lzdGVudH1cbiAgICAgIDxTY3JpbSBvbjpjbGljaz17KCkgPT4gc2hvdyA9IGZhbHNlfSAvPlxuICAgIHsvaWZ9XG4gICAgPG5hdlxuICAgICAgcm9sZT1cIm5hdmlnYXRpb25cIlxuICAgICAgY2xhc3M9e259XG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cInctZnVsbFwiPlxuICAgICAgICA8c2xvdCAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9uYXY+XG4gIDwvYXNpZGU+XG57L2lmfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQStERSxPQUFPLGNBQUMsQ0FBQyxBQUNQLFNBQVMsQ0FBRSxLQUFLLEFBQ2xCLENBQUMsQUFFRCxLQUFLLGNBQUMsQ0FBQyxBQUNMLE1BQU0sQ0FBRSxLQUFLLEFBQ2YsQ0FBQyJ9 */";
  append_dev(document.head, style);
} // (73:0) {#if show}


function create_if_block$6(ctx) {
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
      add_location(div, file$b, 84, 6, 1971);
      attr_dev(nav, "role", "navigation");
      attr_dev(nav, "class", nav_class_value = "" + (null_to_empty(
      /*n*/
      ctx[4]) + " svelte-6qcjcu"));
      add_location(nav, file$b, 80, 4, 1914);
      attr_dev(aside, "class", aside_class_value = "" + (null_to_empty(
      /*c*/
      ctx[3]) + " svelte-6qcjcu"));
      add_location(aside, file$b, 73, 2, 1770);
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
    id: create_if_block$6.name,
    type: "if",
    source: "(73:0) {#if show}",
    ctx
  });
  return block;
} // (78:4) {#if !persistent}


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
    source: "(78:4) {#if !persistent}",
    ctx
  });
  return block;
}

function create_fragment$c(ctx) {
  let if_block_anchor;
  let current;
  let if_block =
  /*show*/
  ctx[1] && create_if_block$6(ctx);
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
          if_block = create_if_block$6(ctx);
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
    id: create_fragment$c.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const classesDefault$5 = "fixed top-0 md:mt-16 w-auto drawer overflow-hidden h-full";

function instance$c($$self, $$props, $$invalidate) {
  let $bp;
  const bp = breakpoint();
  validate_store(bp, "bp");
  component_subscribe($$self, bp, value => $$invalidate(14, $bp = value));
  const navClassesDefault = `h-full w-full bg-white dark:bg-gray-900 dark:text-gray-200 absolute flex w-auto z-20 drawer
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
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
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
      id: create_fragment$c.name
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


function create_if_block$7(ctx) {
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
    id: create_if_block$7.name,
    type: "if",
    source: "(78:2) {#if show}",
    ctx
  });
  return block;
}

function create_fragment$d(ctx) {
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
  ctx[0] && create_if_block$7(ctx);
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
          if_block = create_if_block$7(ctx);
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
    id: create_fragment$d.name,
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

function instance$d($$self, $$props, $$invalidate) {
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
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {
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
      id: create_fragment$d.name
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
  to: "/components/jump",
  text: "All you need is ..."
}, {
  to: "frontend/frontend",
  text: "Frontend"
}, {
  to: "infrestructure/sre",
  text: "SRE"
}, {
  to: "backend/postgresql",
  text: "PostgreSQL"
}, {
  to: "api/api",
  text: "Api"
}];
const topMenu = [{
  to: "/components",
  text: "Components"
}, {
  to: "/typography",
  text: "Typography"
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
  style.textContent = ".github.svelte-1d0txue{transition:0.3s ease-out}.github.svelte-1d0txue:hover{transform:rotate(360deg)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2xheW91dC5zdmVsdGUiLCJzb3VyY2VzIjpbIl9sYXlvdXQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBBcHBCYXIgZnJvbSBcImNvbXBvbmVudHMvQXBwQmFyXCI7XG4gIGltcG9ydCBUYWJzIGZyb20gXCJjb21wb25lbnRzL1RhYnNcIjtcbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29tcG9uZW50cy9CdXR0b25cIjtcbiAgaW1wb3J0IHsgU3BhY2VyIH0gZnJvbSBcImNvbXBvbmVudHMvVXRpbFwiO1xuICBpbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gXCJjb21wb25lbnRzL0xpc3RcIjtcbiAgaW1wb3J0IE5hdmlnYXRpb25EcmF3ZXIgZnJvbSBcImNvbXBvbmVudHMvTmF2aWdhdGlvbkRyYXdlclwiO1xuICBpbXBvcnQgUHJvZ3Jlc3NMaW5lYXIgZnJvbSBcImNvbXBvbmVudHMvUHJvZ3Jlc3NMaW5lYXJcIjtcbiAgaW1wb3J0IFRvb2x0aXAgZnJvbSBcImNvbXBvbmVudHMvVG9vbHRpcFwiO1xuICBpbXBvcnQgeyBzdG9yZXMgfSBmcm9tIFwiQHNhcHBlci9hcHBcIjtcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgaW1wb3J0IHsgZmFkZSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuICBpbXBvcnQgeyBuYXZNZW51LCB0b3BNZW51IH0gZnJvbSBcIi4uL3V0aWxzL21lbnUuanNcIjtcbiAgaW1wb3J0IHsgcmlnaHQsIGVsZXZhdGlvbiwgcGVyc2lzdGVudCwgc2hvd05hdiB9IGZyb20gXCJzdG9yZXMuanNcIjtcbiAgaW1wb3J0IGRhcmsgZnJvbSBcIi4uL2RhcmsuanNcIjtcblxuICBjb25zdCB7IHByZWxvYWRpbmcsIHBhZ2UgfSA9IHN0b3JlcygpO1xuXG4gIGxldCBzZWxlY3RlZCA9IFwiXCI7XG5cbiAgY29uc3QgZGFya01vZGUgPSBkYXJrKCk7XG5cbiAgJDogcGF0aCA9ICRwYWdlLnBhdGg7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZ2l0aHViIHtcbiAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2Utb3V0O1xuICB9XG4gIC5naXRodWI6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbjwvc3R5bGU+XG5cbjxzdmVsdGU6aGVhZD5cbiAgPHRpdGxlPlJvY2sgQmFuZDwvdGl0bGU+XG4gIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9XCJCcmVha2luZyBTb3VuZHNcIiAvPlxuPC9zdmVsdGU6aGVhZD5cblxueyNpZiAkcHJlbG9hZGluZ31cbiAgPFByb2dyZXNzTGluZWFyIGFwcCAvPlxuey9pZn1cblxueyNlYWNoIG5hdk1lbnUgYXMgbGlua31cbiAgPGEgaHJlZj17bGluay50b30gY2xhc3M9XCJoaWRkZW5cIj57bGluay50ZXh0fTwvYT5cbnsvZWFjaH1cblxuPEFwcEJhciBjbGFzcz17aSA9PiBpLnJlcGxhY2UoJ3ByaW1hcnktMzAwJywgJ2RhcmstNjAwJyl9PlxuICA8YSBocmVmPVwiLlwiIGNsYXNzPVwicHgtMiBtZDpweC04IGZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgPGltZyBzcmM9XCIvbG9nby5zdmdcIiBhbHQ9XCJSb2NrIEJhbmQgbG9nb1wiIHdpZHRoPVwiNTRcIiAvPlxuICAgIDxoNiBjbGFzcz1cInBsLTMgdGV4dC13aGl0ZSB0cmFja2luZy13aWRlc3QgZm9udC10aGluIHRleHQtbGdcIj5Sb2NrIEJhbmQ8L2g2PlxuICA8L2E+XG4gIDxTcGFjZXIgLz5cbiAgPFRhYnMgbmF2aWdhdGlvbiBpdGVtcz17dG9wTWVudX0gYmluZDpzZWxlY3RlZD17cGF0aH0gLz5cblxuICA8VG9vbHRpcD5cbiAgICA8c3BhbiBzbG90PVwiYWN0aXZhdG9yXCI+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIGJpbmQ6dmFsdWU9eyRkYXJrTW9kZX1cbiAgICAgICAgaWNvbj1cIndiX3N1bm55XCJcbiAgICAgICAgc21hbGxcbiAgICAgICAgZmxhdFxuICAgICAgICByZW1vdmU9XCJwLTEgaC00IHctNFwiXG4gICAgICAgIGljb25DbGFzcz1cInRleHQtd2hpdGVcIlxuICAgICAgICB0ZXh0IC8+XG4gICAgPC9zcGFuPlxuICAgIHskZGFya01vZGUgPyAnRGlzYWJsZScgOiAnRW5hYmxlJ30gZGFyayBtb2RlXG4gIDwvVG9vbHRpcD5cbiAgPGRpdiBjbGFzcz1cIm1kOmhpZGRlblwiPlxuICAgIDxCdXR0b25cbiAgICAgIGljb249XCJtZW51XCJcbiAgICAgIHNtYWxsXG4gICAgICBmbGF0XG4gICAgICByZW1vdmU9XCJwLTEgaC00IHctNFwiXG4gICAgICBpY29uQ2xhc3M9XCJ0ZXh0LXdoaXRlXCJcbiAgICAgIHRleHRcbiAgICAgIG9uOmNsaWNrPXsoKSA9PiBzaG93TmF2LnNldCghJHNob3dOYXYpfSAvPlxuICA8L2Rpdj5cbiAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yZXNvdXJjZWxkZy93YWxhZG9jc1wiIGNsYXNzPVwicHgtNCBnaXRodWJcIj5cbiAgICA8aW1nIHNyYz1cIi9pbnN0YWdyYW0uc3ZnXCIgYWx0PVwiR2l0aHViIFNtZWx0ZVwiIHdpZHRoPVwiNDBcIiBoZWlnaHQ9XCI0MFwiIC8+XG4gIDwvYT5cbiAgXG48L0FwcEJhcj5cblxuPG1haW5cbiAgY2xhc3M9XCJyZWxhdGl2ZSBwLTggbGc6bWF4LXctM3hsIG14LWF1dG8gbWItMTAgbXQtMjQgbWQ6bWwtNjQgbWQ6cGwtMTZcbiAgbWQ6bWF4LXctbWQgbWQ6cHgtM1wiXG4gIHRyYW5zaXRpb246ZmFkZT17eyBkdXJhdGlvbjogMzAwIH19PlxuICA8TmF2aWdhdGlvbkRyYXdlclxuICAgIGJpbmQ6c2hvdz17JHNob3dOYXZ9XG4gICAgcmlnaHQ9eyRyaWdodH1cbiAgICBwZXJzaXN0ZW50PXskcGVyc2lzdGVudH1cbiAgICBlbGV2YXRpb249eyRlbGV2YXRpb259PlxuICAgIDxoNlxuICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgIERldmVsb3BlciBHZXR0aW5nIFN0YXJ0ZWQhIVxuICAgIDwvaDY+XG4gICAgPExpc3QgaXRlbXM9e25hdk1lbnV9PlxuICAgICAgPHNwYW4gc2xvdD1cIml0ZW1cIiBsZXQ6aXRlbSBjbGFzcz1cImN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgIHsjaWYgaXRlbS50byA9PT0gJ2luZnJlc3RydWN0dXJlL3NyZSd9XG4gICAgICAgICAgPGhyIGNsYXNzPVwibXQtNFwiIC8+XG4gICAgICAgICAgPGg2XG4gICAgICAgICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgICAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgICAgICAgSW5mcmVzdHJ1Y3R1cmVcbiAgICAgICAgICA8L2g2PlxuICAgICAgICB7L2lmfVxuICAgICAgICB7I2lmIGl0ZW0udG8gPT09ICdhcGkvYXBpJ31cbiAgICAgICAgICA8aHIgY2xhc3M9XCJtdC00XCIgLz5cbiAgICAgICAgICA8aDZcbiAgICAgICAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICBBcGlcbiAgICAgICAgICA8L2g2PlxuICAgICAgICB7L2lmfVxuICAgICAgICB7I2lmIGl0ZW0udG8gPT09ICdiYWNrZW5kL3Bvc3RncmVzcWwnfVxuICAgICAgICAgIDxociBjbGFzcz1cIm10LTRcIiAvPlxuICAgICAgICAgIDxoNlxuICAgICAgICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICAgICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgICAgICAgIEJhY2tlbmRcbiAgICAgICAgICA8L2g2PlxuICAgICAgICB7L2lmfVxuICAgICAgICB7I2lmIGl0ZW0udG8gPT09ICdmcm9udGVuZC9mcm9udGVuZCd9XG4gICAgICAgICAgPGhyIGNsYXNzPVwibXQtNFwiIC8+XG4gICAgICAgICAgPGg2XG4gICAgICAgICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgICAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgICAgICAgRnJvbnRlbmRcbiAgICAgICAgICA8L2g2PlxuICAgICAgICB7L2lmfVxuXG4gICAgICAgIDxhIGhyZWY9e2l0ZW0udG99PlxuICAgICAgICAgIDxMaXN0SXRlbVxuICAgICAgICAgICAgaWQ9e2l0ZW0uaWR9XG4gICAgICAgICAgICB0ZXh0PXtpdGVtLnRleHR9XG4gICAgICAgICAgICB0bz17aXRlbS50b31cbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXRoLmluY2x1ZGVzKGl0ZW0udG8pfVxuICAgICAgICAgICAgZGVuc2VcbiAgICAgICAgICAgIHNlbGVjdGVkQ2xhc3Nlcz1cImJnLXByaW1hcnktdHJhbnNEYXJrIGRhcms6YmctcHJpbWFyeS10cmFuc0xpZ2h0XG4gICAgICAgICAgICBob3ZlcjpiZy1wcmltYXJ5LXRyYW5zRGFyayBkYXJrLWhvdmVyOmJnLXByaW1hcnktdHJhbnNMaWdodFwiIC8+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L0xpc3Q+XG5cbiAgICA8aHIgLz5cbiAgPC9OYXZpZ2F0aW9uRHJhd2VyPlxuXG4gIDxzbG90IC8+XG48L21haW4+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMEJFLE9BQU8sZUFBQyxDQUFDLEFBQ1AsVUFBVSxDQUFFLElBQUksQ0FBQyxRQUFRLEFBQzNCLENBQUMsQUFDRCxzQkFBTyxNQUFNLEFBQUMsQ0FBQyxBQUNiLFNBQVMsQ0FBRSxPQUFPLE1BQU0sQ0FBQyxBQUMzQixDQUFDIn0= */";
  append_dev(document.head, style);
}

function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[19] = list[i];
  return child_ctx;
} // (40:0) {#if $preloading}


function create_if_block_4(ctx) {
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
    id: create_if_block_4.name,
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
      add_location(a, file$d, 44, 2, 1103);
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
    icon: "wb_sunny",
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
      add_location(span, file$d, 56, 4, 1511);
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
} // (48:0) <AppBar class={i => i.replace('primary-300', 'dark-600')}>


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
      t1 = text("Rock Band");
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
      t1 = claim_text(h6_nodes, "Rock Band");
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
      this.h();
    },
    h: function hydrate() {
      if (img0.src !== (img0_src_value = "/logo.svg")) attr_dev(img0, "src", img0_src_value);
      attr_dev(img0, "alt", "Rock Band logo");
      attr_dev(img0, "width", "54");
      add_location(img0, file$d, 49, 4, 1278);
      attr_dev(h6, "class", "pl-3 text-white tracking-widest font-thin text-lg");
      add_location(h6, file$d, 50, 4, 1338);
      attr_dev(a0, "href", ".");
      attr_dev(a0, "class", "px-2 md:px-8 flex items-center");
      add_location(a0, file$d, 48, 2, 1222);
      attr_dev(div, "class", "md:hidden");
      add_location(div, file$d, 68, 2, 1783);
      if (img1.src !== (img1_src_value = "/instagram.svg")) attr_dev(img1, "src", img1_src_value);
      attr_dev(img1, "alt", "Github Smelte");
      attr_dev(img1, "width", "40");
      attr_dev(img1, "height", "40");
      add_location(img1, file$d, 79, 4, 2062);
      attr_dev(a1, "href", "https://github.com/resourceldg/waladocs");
      attr_dev(a1, "class", "px-4 github svelte-1d0txue");
      add_location(a1, file$d, 78, 2, 1987);
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
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_2.name,
    type: "slot",
    source: "(48:0) <AppBar class={i => i.replace('primary-300', 'dark-600')}>",
    ctx
  });
  return block;
} // (101:8) {#if item.to === 'infrestructure/sre'}


function create_if_block_3(ctx) {
  let hr;
  let t0;
  let h6;
  let t1;
  const block = {
    c: function create() {
      hr = element("hr");
      t0 = space();
      h6 = element("h6");
      t1 = text("Infrestructure");
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
      t1 = claim_text(h6_nodes, "Infrestructure");
      h6_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(hr, "class", "mt-4");
      add_location(hr, file$d, 101, 10, 2703);
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n            dark:text-gray-100");
      add_location(h6, file$d, 102, 10, 2733);
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
    id: create_if_block_3.name,
    type: "if",
    source: "(101:8) {#if item.to === 'infrestructure/sre'}",
    ctx
  });
  return block;
} // (109:8) {#if item.to === 'api/api'}


function create_if_block_2$2(ctx) {
  let hr;
  let t0;
  let h6;
  let t1;
  const block = {
    c: function create() {
      hr = element("hr");
      t0 = space();
      h6 = element("h6");
      t1 = text("Api");
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
      t1 = claim_text(h6_nodes, "Api");
      h6_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(hr, "class", "mt-4");
      add_location(hr, file$d, 109, 10, 2945);
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n            dark:text-gray-100");
      add_location(h6, file$d, 110, 10, 2975);
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
    id: create_if_block_2$2.name,
    type: "if",
    source: "(109:8) {#if item.to === 'api/api'}",
    ctx
  });
  return block;
} // (117:8) {#if item.to === 'backend/postgresql'}


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
      t1 = text("Backend");
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
      t1 = claim_text(h6_nodes, "Backend");
      h6_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(hr, "class", "mt-4");
      add_location(hr, file$d, 117, 10, 3187);
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n            dark:text-gray-100");
      add_location(h6, file$d, 118, 10, 3217);
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
    source: "(117:8) {#if item.to === 'backend/postgresql'}",
    ctx
  });
  return block;
} // (125:8) {#if item.to === 'frontend/frontend'}


function create_if_block$8(ctx) {
  let hr;
  let t0;
  let h6;
  let t1;
  const block = {
    c: function create() {
      hr = element("hr");
      t0 = space();
      h6 = element("h6");
      t1 = text("Frontend");
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
      t1 = claim_text(h6_nodes, "Frontend");
      h6_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(hr, "class", "mt-4");
      add_location(hr, file$d, 125, 10, 3432);
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n            dark:text-gray-100");
      add_location(h6, file$d, 126, 10, 3462);
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
    id: create_if_block$8.name,
    type: "if",
    source: "(125:8) {#if item.to === 'frontend/frontend'}",
    ctx
  });
  return block;
} // (100:6) <span slot="item" let:item class="cursor-pointer">


function create_item_slot(ctx) {
  let span;
  let t0;
  let t1;
  let t2;
  let t3;
  let a;
  let listitem;
  let a_href_value;
  let current;
  let if_block0 =
  /*item*/
  ctx[18].to === "infrestructure/sre" && create_if_block_3(ctx);
  let if_block1 =
  /*item*/
  ctx[18].to === "api/api" && create_if_block_2$2(ctx);
  let if_block2 =
  /*item*/
  ctx[18].to === "backend/postgresql" && create_if_block_1$5(ctx);
  let if_block3 =
  /*item*/
  ctx[18].to === "frontend/frontend" && create_if_block$8(ctx);
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
      selectedClasses: "bg-primary-transDark dark:bg-primary-transLight\n            hover:bg-primary-transDark dark-hover:bg-primary-transLight"
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
      if (if_block2) if_block2.c();
      t2 = space();
      if (if_block3) if_block3.c();
      t3 = space();
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
      if (if_block2) if_block2.l(span_nodes);
      t2 = claim_space(span_nodes);
      if (if_block3) if_block3.l(span_nodes);
      t3 = claim_space(span_nodes);
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
      add_location(a, file$d, 133, 8, 3631);
      attr_dev(span, "slot", "item");
      attr_dev(span, "class", "cursor-pointer");
      add_location(span, file$d, 99, 6, 2595);
    },
    m: function mount(target, anchor) {
      insert_dev(target, span, anchor);
      if (if_block0) if_block0.m(span, null);
      append_dev(span, t0);
      if (if_block1) if_block1.m(span, null);
      append_dev(span, t1);
      if (if_block2) if_block2.m(span, null);
      append_dev(span, t2);
      if (if_block3) if_block3.m(span, null);
      append_dev(span, t3);
      append_dev(span, a);
      mount_component(listitem, a, null);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (
      /*item*/
      ctx[18].to === "infrestructure/sre") {
        if (if_block0) ; else {
          if_block0 = create_if_block_3(ctx);
          if_block0.c();
          if_block0.m(span, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }

      if (
      /*item*/
      ctx[18].to === "api/api") {
        if (if_block1) ; else {
          if_block1 = create_if_block_2$2(ctx);
          if_block1.c();
          if_block1.m(span, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }

      if (
      /*item*/
      ctx[18].to === "backend/postgresql") {
        if (if_block2) ; else {
          if_block2 = create_if_block_1$5(ctx);
          if_block2.c();
          if_block2.m(span, t2);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }

      if (
      /*item*/
      ctx[18].to === "frontend/frontend") {
        if (if_block3) ; else {
          if_block3 = create_if_block$8(ctx);
          if_block3.c();
          if_block3.m(span, t3);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
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
      if (if_block2) if_block2.d();
      if (if_block3) if_block3.d();
      destroy_component(listitem);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_item_slot.name,
    type: "slot",
    source: "(100:6) <span slot=\\\"item\\\" let:item class=\\\"cursor-pointer\\\">",
    ctx
  });
  return block;
} // (89:2) <NavigationDrawer     bind:show={$showNav}     right={$right}     persistent={$persistent}     elevation={$elevation}>


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
      t0 = text("Developer Getting Started!!");
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
      t0 = claim_text(h6_nodes, "Developer Getting Started!!");
      h6_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      claim_component(list.$$.fragment, nodes);
      t2 = claim_space(nodes);
      hr = claim_element(nodes, "HR", {});
      this.h();
    },
    h: function hydrate() {
      attr_dev(h6, "class", "px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light\n      dark:text-gray-100");
      add_location(h6, file$d, 93, 4, 2421);
      add_location(hr, file$d, 146, 4, 4010);
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
    source: "(89:2) <NavigationDrawer     bind:show={$showNav}     right={$right}     persistent={$persistent}     elevation={$elevation}>",
    ctx
  });
  return block;
}

function create_fragment$e(ctx) {
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
  ctx[1] && create_if_block_4(ctx);
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
      const head_nodes = query_selector_all("[data-svelte=\"svelte-3a582s\"]", document.head);
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
      document.title = "Rock Band";
      attr_dev(meta, "name", "description");
      attr_dev(meta, "content", "Breaking Sounds");
      add_location(meta, file$d, 36, 2, 957);
      attr_dev(main, "class", "relative p-8 lg:max-w-3xl mx-auto mb-10 mt-24 md:ml-64 md:pl-16\n  md:max-w-md md:px-3");
      add_location(main, file$d, 84, 0, 2155);
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
          if_block = create_if_block_4(ctx);
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
    id: create_fragment$e.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

const func = i => i.replace("primary-300", "dark-600");

function instance$e($$self, $$props, $$invalidate) {
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
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Layout",
      options,
      id: create_fragment$e.name
    });
  }

}

/* src/routes/_error.svelte generated by Svelte v3.24.0 */
const {
  Error: Error_1
} = globals;
const file$e = "src/routes/_error.svelte"; // (16:0) {#if dev && error.stack}

function create_if_block$9(ctx) {
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
    id: create_if_block$9.name,
    type: "if",
    source: "(16:0) {#if dev && error.stack}",
    ctx
  });
  return block;
}

function create_fragment$f(ctx) {
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
  ctx[1].stack && create_if_block$9(ctx);
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
          if_block = create_if_block$9(ctx);
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
    id: create_fragment$f.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$f($$self, $$props, $$invalidate) {
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
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {
      status: 0,
      error: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Error",
      options,
      id: create_fragment$f.name
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
  const switch_instance_spread_levels = [{
    segment:
    /*segments*/
    ctx[2][1]
  },
  /*level1*/
  ctx[4].props];
  var switch_value =
  /*level1*/
  ctx[4].component;

  function switch_props(ctx) {
    let switch_instance_props = {
      $$slots: {
        default: [create_default_slot_1$3]
      },
      $$scope: {
        ctx
      }
    };

    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props,
      $$inline: true
    };
  }

  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
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
      /*segments, level1*/
      20 ? get_spread_update(switch_instance_spread_levels, [dirty &
      /*segments*/
      4 && {
        segment:
        /*segments*/
        ctx[2][1]
      }, dirty &
      /*level1*/
      16 && get_spread_object(
      /*level1*/
      ctx[4].props)]) : {};

      if (dirty &
      /*$$scope, level2*/
      160) {
        switch_instance_changes.$$scope = {
          dirty,
          ctx
        };
      }

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
          switch_instance = new switch_value(switch_props(ctx));
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
    source: "(22:1) {:else}",
    ctx
  });
  return block;
} // (20:1) {#if error}


function create_if_block$a(ctx) {
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
    id: create_if_block$a.name,
    type: "if",
    source: "(20:1) {#if error}",
    ctx
  });
  return block;
} // (24:3) {#if level2}


function create_if_block_1$6(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
  /*level2*/
  ctx[5].props];
  var switch_value =
  /*level2*/
  ctx[5].component;

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
      /*level2*/
      32 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*level2*/
      ctx[5].props)]) : {};

      if (switch_value !== (switch_value =
      /*level2*/
      ctx[5].component)) {
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
    id: create_if_block_1$6.name,
    type: "if",
    source: "(24:3) {#if level2}",
    ctx
  });
  return block;
} // (23:2) <svelte:component this="{level1.component}" segment="{segments[1]}" {...level1.props}>


function create_default_slot_1$3(ctx) {
  let if_block_anchor;
  let current;
  let if_block =
  /*level2*/
  ctx[5] && create_if_block_1$6(ctx);
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
    p: function update(ctx, dirty) {
      if (
      /*level2*/
      ctx[5]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*level2*/
          32) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1$6(ctx);
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
    id: create_default_slot_1$3.name,
    type: "slot",
    source: "(23:2) <svelte:component this=\\\"{level1.component}\\\" segment=\\\"{segments[1]}\\\" {...level1.props}>",
    ctx
  });
  return block;
} // (19:0) <Layout segment="{segments[0]}" {...level0.props}>


function create_default_slot$6(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$a, create_else_block$3];
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
    source: "(19:0) <Layout segment=\\\"{segments[0]}\\\" {...level0.props}>",
    ctx
  });
  return block;
}

function create_fragment$g(ctx) {
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
      /*$$scope, error, status, level1, segments, level2*/
      183) {
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
    id: create_fragment$g.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance$g($$self, $$props, $$invalidate) {
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
  let {
    level2 = null
  } = $$props;
  setContext(CONTEXT_KEY, stores);
  const writable_props = ["stores", "error", "status", "segments", "level0", "level1", "level2"];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("App", $$slots, []);

  $$self.$set = $$props => {
    if ("stores" in $$props) $$invalidate(6, stores = $$props.stores);
    if ("error" in $$props) $$invalidate(0, error = $$props.error);
    if ("status" in $$props) $$invalidate(1, status = $$props.status);
    if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
    if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
    if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
    if ("level2" in $$props) $$invalidate(5, level2 = $$props.level2);
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
    level1,
    level2
  });

  $$self.$inject_state = $$props => {
    if ("stores" in $$props) $$invalidate(6, stores = $$props.stores);
    if ("error" in $$props) $$invalidate(0, error = $$props.error);
    if ("status" in $$props) $$invalidate(1, status = $$props.status);
    if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
    if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
    if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
    if ("level2" in $$props) $$invalidate(5, level2 = $$props.level2);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [error, status, segments, level0, level1, level2, stores];
}

class App extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$g, create_fragment$g, safe_not_equal, {
      stores: 6,
      error: 0,
      status: 1,
      segments: 2,
      level0: 3,
      level1: 4,
      level2: 5
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "App",
      options,
      id: create_fragment$g.name
    });
    const {
      ctx
    } = this.$$;
    const props = options.props || {};

    if (
    /*stores*/
    ctx[6] === undefined && !("stores" in props)) {
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

  get level2() {
    throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set level2(value) {
    throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

// This file is generated by Sapper — do not edit it!
const ignore = [];
const components = [{
  js: () => import('./index.6fef2000.js'),
  css: []
}, {
  js: () => import('./sre.41b1aeeb.js'),
  css: []
}, {
  js: () => import('./breakpoints.898bab42.js'),
  css: []
}, {
  js: () => import('./_layout.2a478ceb.js'),
  css: []
}, {
  js: () => import('./index.9f7f6a09.js'),
  css: []
}, {
  js: () => import('./progress-indicators.5c3d0aba.js'),
  css: []
}, {
  js: () => import('./navigation-drawers.38ace52e.js'),
  css: []
}, {
  js: () => import('./selection-controls.3080c3af.js'),
  css: []
}, {
  js: () => import('./date-pickers.11cbefb1.js'),
  css: []
}, {
  js: () => import('./data-tables.97f85256.js'),
  css: []
}, {
  js: () => import('./text-fields.2469f53a.js'),
  css: []
}, {
  js: () => import('./snackbars.13a23a28.js'),
  css: []
}, {
  js: () => import('./treeviews.9d7d5d5f.js'),
  css: []
}, {
  js: () => import('./tooltips.2047ce64.js'),
  css: []
}, {
  js: () => import('./buttons.735ee491.js'),
  css: []
}, {
  js: () => import('./dialogs.eca0a13f.js'),
  css: []
}, {
  js: () => import('./selects.fe087433.js'),
  css: []
}, {
  js: () => import('./sliders.fe1ffb3c.js'),
  css: []
}, {
  js: () => import('./images.039b4dd6.js'),
  css: []
}, {
  js: () => import('./cards.d12535ae.js'),
  css: []
}, {
  js: () => import('./chips.f5392e15.js'),
  css: []
}, {
  js: () => import('./lists.76020e85.js'),
  css: []
}, {
  js: () => import('./menus.1c671ff8.js'),
  css: []
}, {
  js: () => import('./jump.202a7332.js'),
  css: []
}, {
  js: () => import('./tabs.8510275d.js'),
  css: []
}, {
  js: () => import('./typography.7862350a.js'),
  css: []
}, {
  js: () => import('./dark-mode.2e841210.js'),
  css: []
}, {
  js: () => import('./frontend.81d89c0e.js'),
  css: []
}, {
  js: () => import('./postgresql.67f512b4.js'),
  css: []
}, {
  js: () => import('./color.16602004.js'),
  css: []
}, {
  js: () => import('./api.3b0d2281.js'),
  css: []
}];
const routes = [{
  // index.svelte
  pattern: /^\/$/,
  parts: [{
    i: 0
  }]
}, {
  // infrestructure/sre.svelte
  pattern: /^\/infrestructure\/sre\/?$/,
  parts: [null, {
    i: 1
  }]
}, {
  // breakpoints.svelte
  pattern: /^\/breakpoints\/?$/,
  parts: [{
    i: 2
  }]
}, {
  // components/index.svelte
  pattern: /^\/components\/?$/,
  parts: [{
    i: 3
  }, {
    i: 4
  }]
}, {
  // components/progress-indicators.svelte
  pattern: /^\/components\/progress-indicators\/?$/,
  parts: [{
    i: 3
  }, {
    i: 5
  }]
}, {
  // components/navigation-drawers.svelte
  pattern: /^\/components\/navigation-drawers\/?$/,
  parts: [{
    i: 3
  }, {
    i: 6
  }]
}, {
  // components/selection-controls.svelte
  pattern: /^\/components\/selection-controls\/?$/,
  parts: [{
    i: 3
  }, {
    i: 7
  }]
}, {
  // components/date-pickers.svelte
  pattern: /^\/components\/date-pickers\/?$/,
  parts: [{
    i: 3
  }, {
    i: 8
  }]
}, {
  // components/data-tables.svelte
  pattern: /^\/components\/data-tables\/?$/,
  parts: [{
    i: 3
  }, {
    i: 9
  }]
}, {
  // components/text-fields.svelte
  pattern: /^\/components\/text-fields\/?$/,
  parts: [{
    i: 3
  }, {
    i: 10
  }]
}, {
  // components/snackbars.svelte
  pattern: /^\/components\/snackbars\/?$/,
  parts: [{
    i: 3
  }, {
    i: 11
  }]
}, {
  // components/treeviews.svelte
  pattern: /^\/components\/treeviews\/?$/,
  parts: [{
    i: 3
  }, {
    i: 12
  }]
}, {
  // components/tooltips.svelte
  pattern: /^\/components\/tooltips\/?$/,
  parts: [{
    i: 3
  }, {
    i: 13
  }]
}, {
  // components/buttons.svelte
  pattern: /^\/components\/buttons\/?$/,
  parts: [{
    i: 3
  }, {
    i: 14
  }]
}, {
  // components/dialogs.svelte
  pattern: /^\/components\/dialogs\/?$/,
  parts: [{
    i: 3
  }, {
    i: 15
  }]
}, {
  // components/selects.svelte
  pattern: /^\/components\/selects\/?$/,
  parts: [{
    i: 3
  }, {
    i: 16
  }]
}, {
  // components/sliders.svelte
  pattern: /^\/components\/sliders\/?$/,
  parts: [{
    i: 3
  }, {
    i: 17
  }]
}, {
  // components/images.svelte
  pattern: /^\/components\/images\/?$/,
  parts: [{
    i: 3
  }, {
    i: 18
  }]
}, {
  // components/cards.svelte
  pattern: /^\/components\/cards\/?$/,
  parts: [{
    i: 3
  }, {
    i: 19
  }]
}, {
  // components/chips.svelte
  pattern: /^\/components\/chips\/?$/,
  parts: [{
    i: 3
  }, {
    i: 20
  }]
}, {
  // components/lists.svelte
  pattern: /^\/components\/lists\/?$/,
  parts: [{
    i: 3
  }, {
    i: 21
  }]
}, {
  // components/menus.svelte
  pattern: /^\/components\/menus\/?$/,
  parts: [{
    i: 3
  }, {
    i: 22
  }]
}, {
  // components/jump.svelte
  pattern: /^\/components\/jump\/?$/,
  parts: [{
    i: 3
  }, {
    i: 23
  }]
}, {
  // components/tabs.svelte
  pattern: /^\/components\/tabs\/?$/,
  parts: [{
    i: 3
  }, {
    i: 24
  }]
}, {
  // typography.svelte
  pattern: /^\/typography\/?$/,
  parts: [{
    i: 25
  }]
}, {
  // dark-mode.svelte
  pattern: /^\/dark-mode\/?$/,
  parts: [{
    i: 26
  }]
}, {
  // frontend/frontend.svelte
  pattern: /^\/frontend\/frontend\/?$/,
  parts: [null, {
    i: 27
  }]
}, {
  // backend/postgresql.svelte
  pattern: /^\/backend\/postgresql\/?$/,
  parts: [null, {
    i: 28
  }]
}, {
  // color.svelte
  pattern: /^\/color\/?$/,
  parts: [{
    i: 29
  }]
}, {
  // api/api.svelte
  pattern: /^\/api\/api\/?$/,
  parts: [null, {
    i: 30
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

export { persistent as $, query_selector_all as A, update_slot as B, Button as C, svg_element as D, set_style as E, assign as F, ClassBuilder as G, exclude_internal_props as H, set_attributes as I, get_spread_update as J, createEventDispatcher as K, Icon as L, listen_dev as M, prop_dev as N, run_all as O, ProgressLinear as P, bubble as Q, empty as R, SvelteComponentDev as S, group_outros as T, check_outros as U, r as V, action_destroyer as W, validate_store as X, component_subscribe as Y, right as Z, elevation as _, children as a, binding_callbacks as a0, bind as a1, add_flush_callback as a2, validate_each_argument as a3, destroy_each as a4, get_spread_object as a5, set_input_value as a6, filterProps as a7, utils as a8, toggle_class as a9, Tab as aA, darkMode as aB, Tabs as aC, fly as aa, quadOut as ab, add_render_callback as ac, create_bidirectional_transition as ad, null_to_empty as ae, Spacer$1 as af, HtmlTag as ag, slide as ah, onMount as ai, quadIn as aj, List as ak, fade as al, List as am, stop_propagation as an, create_in_transition as ao, create_out_transition as ap, writable as aq, scale as ar, subscribe as as, ListItem as at, Tooltip as au, Scrim$1 as av, to_number as aw, globals as ax, onDestroy as ay, Tabs as az, detach_dev as b, claim_element as c, dispatch_dev as d, element as e, add_location as f, attr_dev as g, insert_dev as h, init as i, append_dev as j, space as k, claim_text as l, claim_space as m, noop as n, create_component as o, claim_component as p, mount_component as q, transition_in as r, safe_not_equal as s, text as t, transition_out as u, validate_slots as v, destroy_component as w, create_slot as x, showNav as y, set_data_dev as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LjI5ZjdmNTdhLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9zcmMvdXRpbHMvY2xhc3Nlcy5qcyIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0FwcEJhci9BcHBCYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvSWNvbi9JY29uLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1JpcHBsZS9yaXBwbGUuanMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJzL1RhYkJ1dHRvbi5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJzL1RhYi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2Vhc2luZy9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL3RyYW5zaXRpb24vaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFicy9JbmRpY2F0b3Iuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NMaW5lYXIvUHJvZ3Jlc3NMaW5lYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFicy9UYWJzLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0J1dHRvbi9CdXR0b24uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVXRpbC9TY3JpbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9VdGlsL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTGlzdC9MaXN0SXRlbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9MaXN0L0xpc3Quc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2JyZWFrcG9pbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTmF2aWdhdGlvbkRyYXdlci9OYXZpZ2F0aW9uRHJhd2VyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAvVG9vbHRpcC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvdXRpbHMvbWVudS5qcyIsIi4uLy4uLy4uL3NyYy9zdG9yZXMuanMiLCIuLi8uLi8uLi9zcmMvZGFyay5qcyIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19lcnJvci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvQXBwLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9pbnRlcm5hbC9tYW5pZmVzdC1jbGllbnQubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2FwcC5tanMiLCIuLi8uLi8uLi9zcmMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4O1xuZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZvciAoY29uc3QgayBpbiBzcmMpXG4gICAgICAgIHRhcltrXSA9IHNyY1trXTtcbiAgICByZXR1cm4gdGFyO1xufVxuZnVuY3Rpb24gaXNfcHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYWRkX2xvY2F0aW9uKGVsZW1lbnQsIGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhcikge1xuICAgIGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcbiAgICAgICAgbG9jOiB7IGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhciB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJ1bihmbikge1xuICAgIHJldHVybiBmbigpO1xufVxuZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcbiAgICBmbnMuZm9yRWFjaChydW4pO1xufVxuZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gc2FmZV9ub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90KHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbiwgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGNvbnN0IHNsb3RfY2hhbmdlcyA9IGdldF9zbG90X2NoYW5nZXMoc2xvdF9kZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbik7XG4gICAgaWYgKHNsb3RfY2hhbmdlcykge1xuICAgICAgICBjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbiAgICAgICAgc2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gb25jZShmbikge1xuICAgIGxldCByYW4gPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHJhbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSA9IHJldCkge1xuICAgIHN0b3JlLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5mdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcbiAgICByZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgbm93ID0gaXNfY2xpZW50XG4gICAgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICA6ICgpID0+IERhdGUubm93KCk7XG5sZXQgcmFmID0gaXNfY2xpZW50ID8gY2IgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG4vLyB1c2VkIGludGVybmFsbHkgZm9yIHRlc3RpbmdcbmZ1bmN0aW9uIHNldF9ub3coZm4pIHtcbiAgICBub3cgPSBmbjtcbn1cbmZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcbiAgICByYWYgPSBmbjtcbn1cblxuY29uc3QgdGFza3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrLmMobm93KSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFzay5mKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGFza3Muc2l6ZSAhPT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG59XG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKi9cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIHRhc2tzLmNsZWFyKCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKi9cbmZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcbiAgICBsZXQgdGFzaztcbiAgICBpZiAodGFza3Muc2l6ZSA9PT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IHsgYzogY2FsbGJhY2ssIGY6IGZ1bGZpbGwgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc19wcm9wKG9iaiwgaylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICYmIGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbmFtZSk7XG59XG5mdW5jdGlvbiB0ZXh0KGRhdGEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5mdW5jdGlvbiBzcGFjZSgpIHtcbiAgICByZXR1cm4gdGV4dCgnICcpO1xufVxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRleHQoJycpO1xufVxuZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2VsZihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKVxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgIGVsc2UgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgIT09IHZhbHVlKVxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldF9hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhub2RlLl9fcHJvdG9fXyk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoYXR0cmlidXRlc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmNzc1RleHQgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnX192YWx1ZScpIHtcbiAgICAgICAgICAgIG5vZGUudmFsdWUgPSBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVzY3JpcHRvcnNba2V5XSAmJiBkZXNjcmlwdG9yc1trZXldLnNldCkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHhsaW5rX2F0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlKGdyb3VwLCBfX3ZhbHVlLCBjaGVja2VkKSB7XG4gICAgY29uc3QgdmFsdWUgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLmFkZChncm91cFtpXS5fX3ZhbHVlKTtcbiAgICB9XG4gICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgIHZhbHVlLmRlbGV0ZShfX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20odmFsdWUpO1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2orK107XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZW1vdmUubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShyZW1vdmVba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnID8gc3ZnX2VsZW1lbnQobmFtZSkgOiBlbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dChkYXRhKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgel9pbmRleCA9IChwYXJzZUludChjb21wdXRlZF9zdHlsZS56SW5kZXgpIHx8IDApIC0gMTtcbiAgICBpZiAoY29tcHV0ZWRfc3R5bGUucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBpZnJhbWUgPSBlbGVtZW50KCdpZnJhbWUnKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGAgK1xuICAgICAgICBgb3ZlcmZsb3c6IGhpZGRlbjsgYm9yZGVyOiAwOyBvcGFjaXR5OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogJHt6X2luZGV4fTtgKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgY29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuICAgIGxldCB1bnN1YnNjcmliZTtcbiAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9IGBkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5gO1xuICAgICAgICB1bnN1YnNjcmliZSA9IGxpc3Rlbih3aW5kb3csICdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBpZnJhbWUuY29udGVudFdpbmRvdylcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmcmFtZS5zcmMgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICBpZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4oaWZyYW1lLmNvbnRlbnRXaW5kb3csICdyZXNpemUnLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGFwcGVuZChub2RlLCBpZnJhbWUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1bnN1YnNjcmliZSAmJiBpZnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZXRhY2goaWZyYW1lKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdG9nZ2xlX2NsYXNzKGVsZW1lbnQsIG5hbWUsIHRvZ2dsZSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0W3RvZ2dsZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xufVxuZnVuY3Rpb24gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoYW5jaG9yID0gbnVsbCkge1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxuY29uc3QgYWN0aXZlX2RvY3MgPSBuZXcgU2V0KCk7XG5sZXQgYWN0aXZlID0gMDtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBsZXQgaSA9IHN0ci5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5mdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG4gICAgY29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuICAgIGxldCBrZXlmcmFtZXMgPSAne1xcbic7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG4gICAgICAgIGNvbnN0IHQgPSBhICsgKGIgLSBhKSAqIGVhc2UocCk7XG4gICAgICAgIGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG4gICAgfVxuICAgIGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuICAgIGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuICAgIGNvbnN0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICBhY3RpdmVfZG9jcy5hZGQoZG9jKTtcbiAgICBjb25zdCBzdHlsZXNoZWV0ID0gZG9jLl9fc3ZlbHRlX3N0eWxlc2hlZXQgfHwgKGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0ID0gZG9jLmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3R5bGUnKSkuc2hlZXQpO1xuICAgIGNvbnN0IGN1cnJlbnRfcnVsZXMgPSBkb2MuX19zdmVsdGVfcnVsZXMgfHwgKGRvYy5fX3N2ZWx0ZV9ydWxlcyA9IHt9KTtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgY3VycmVudF9ydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6IGBgfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcbiAgICBjb25zdCBuZXh0ID0gcHJldmlvdXMuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKTtcbiAgICBjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG4gICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG4gICAgICAgIGFjdGl2ZSAtPSBkZWxldGVkO1xuICAgICAgICBpZiAoIWFjdGl2ZSlcbiAgICAgICAgICAgIGNsZWFyX3J1bGVzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYWN0aXZlX2RvY3MuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVzaGVldCA9IGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0O1xuICAgICAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICAgICAgZG9jLl9fc3ZlbHRlX3J1bGVzID0ge307XG4gICAgICAgIH0pO1xuICAgICAgICBhY3RpdmVfZG9jcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uYCk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiBmbihldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxubGV0IGZsdXNoaW5nID0gZmFsc2U7XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGlmIChmbHVzaGluZylcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgID8gd2luZG93XG4gICAgOiB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBnbG9iYWxUaGlzXG4gICAgICAgIDogZ2xvYmFsKTtcblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGRpcnR5LCBnZXRfa2V5LCBkeW5hbWljLCBjdHgsIGxpc3QsIGxvb2t1cCwgbm9kZSwgZGVzdHJveSwgY3JlYXRlX2VhY2hfYmxvY2ssIG5leHQsIGdldF9jb250ZXh0KSB7XG4gICAgbGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbiA9IGxpc3QubGVuZ3RoO1xuICAgIGxldCBpID0gbztcbiAgICBjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIG9sZF9pbmRleGVzW29sZF9ibG9ja3NbaV0ua2V5XSA9IGk7XG4gICAgY29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuICAgIGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZGVsdGFzID0gbmV3IE1hcCgpO1xuICAgIGkgPSBuO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgY2hpbGRfY3R4ID0gZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgYmxvY2sgPSBsb29rdXAuZ2V0KGtleSk7XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgIGJsb2NrID0gY3JlYXRlX2VhY2hfYmxvY2soa2V5LCBjaGlsZF9jdHgpO1xuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWMpIHtcbiAgICAgICAgICAgIGJsb2NrLnAoY2hpbGRfY3R4LCBkaXJ0eSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICByZXR1cm4gbmV3X2Jsb2Nrcztcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfa2V5cyhjdHgsIGxpc3QsIGdldF9jb250ZXh0LCBnZXRfa2V5KSB7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpKTtcbiAgICAgICAgaWYgKGtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhdmUgZHVwbGljYXRlIGtleXMgaW4gYSBrZXllZCBlYWNoYCk7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5hZGQoa2V5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldF9zcHJlYWRfdXBkYXRlKGxldmVscywgdXBkYXRlcykge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHt9O1xuICAgIGNvbnN0IHRvX251bGxfb3V0ID0ge307XG4gICAgY29uc3QgYWNjb3VudGVkX2ZvciA9IHsgJCRzY29wZTogMSB9O1xuICAgIGxldCBpID0gbGV2ZWxzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IG8gPSBsZXZlbHNbaV07XG4gICAgICAgIGNvbnN0IG4gPSB1cGRhdGVzW2ldO1xuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBuKSlcbiAgICAgICAgICAgICAgICAgICAgdG9fbnVsbF9vdXRba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhY2NvdW50ZWRfZm9yW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlW2tleV0gPSBuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWxzW2ldID0gbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRvX251bGxfb3V0KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB1cGRhdGUpKVxuICAgICAgICAgICAgdXBkYXRlW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG59XG5mdW5jdGlvbiBnZXRfc3ByZWFkX29iamVjdChzcHJlYWRfcHJvcHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHNwcmVhZF9wcm9wcyA9PT0gJ29iamVjdCcgJiYgc3ByZWFkX3Byb3BzICE9PSBudWxsID8gc3ByZWFkX3Byb3BzIDoge307XG59XG5cbi8vIHNvdXJjZTogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sXG5jb25zdCBib29sZWFuX2F0dHJpYnV0ZXMgPSBuZXcgU2V0KFtcbiAgICAnYWxsb3dmdWxsc2NyZWVuJyxcbiAgICAnYWxsb3dwYXltZW50cmVxdWVzdCcsXG4gICAgJ2FzeW5jJyxcbiAgICAnYXV0b2ZvY3VzJyxcbiAgICAnYXV0b3BsYXknLFxuICAgICdjaGVja2VkJyxcbiAgICAnY29udHJvbHMnLFxuICAgICdkZWZhdWx0JyxcbiAgICAnZGVmZXInLFxuICAgICdkaXNhYmxlZCcsXG4gICAgJ2Zvcm1ub3ZhbGlkYXRlJyxcbiAgICAnaGlkZGVuJyxcbiAgICAnaXNtYXAnLFxuICAgICdsb29wJyxcbiAgICAnbXVsdGlwbGUnLFxuICAgICdtdXRlZCcsXG4gICAgJ25vbW9kdWxlJyxcbiAgICAnbm92YWxpZGF0ZScsXG4gICAgJ29wZW4nLFxuICAgICdwbGF5c2lubGluZScsXG4gICAgJ3JlYWRvbmx5JyxcbiAgICAncmVxdWlyZWQnLFxuICAgICdyZXZlcnNlZCcsXG4gICAgJ3NlbGVjdGVkJ1xuXSk7XG5cbmNvbnN0IGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyID0gL1tcXHMnXCI+Lz1cXHV7RkREMH0tXFx1e0ZERUZ9XFx1e0ZGRkV9XFx1e0ZGRkZ9XFx1ezFGRkZFfVxcdXsxRkZGRn1cXHV7MkZGRkV9XFx1ezJGRkZGfVxcdXszRkZGRX1cXHV7M0ZGRkZ9XFx1ezRGRkZFfVxcdXs0RkZGRn1cXHV7NUZGRkV9XFx1ezVGRkZGfVxcdXs2RkZGRX1cXHV7NkZGRkZ9XFx1ezdGRkZFfVxcdXs3RkZGRn1cXHV7OEZGRkV9XFx1ezhGRkZGfVxcdXs5RkZGRX1cXHV7OUZGRkZ9XFx1e0FGRkZFfVxcdXtBRkZGRn1cXHV7QkZGRkV9XFx1e0JGRkZGfVxcdXtDRkZGRX1cXHV7Q0ZGRkZ9XFx1e0RGRkZFfVxcdXtERkZGRn1cXHV7RUZGRkV9XFx1e0VGRkZGfVxcdXtGRkZGRX1cXHV7RkZGRkZ9XFx1ezEwRkZGRX1cXHV7MTBGRkZGfV0vdTtcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2F0dHJpYnV0ZXMtMlxuLy8gaHR0cHM6Ly9pbmZyYS5zcGVjLndoYXR3Zy5vcmcvI25vbmNoYXJhY3RlclxuZnVuY3Rpb24gc3ByZWFkKGFyZ3MsIGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5jbGFzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzID0gY2xhc3Nlc190b19hZGQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzICs9ICcgJyArIGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICBlbHNlIGlmIChib29sZWFuX2F0dHJpYnV0ZXMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN0ciArPSBgICR7bmFtZX09XCIke1N0cmluZyh2YWx1ZSkucmVwbGFjZSgvXCIvZywgJyYjMzQ7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgZXNjYXBlZCA9IHtcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0Oydcbn07XG5mdW5jdGlvbiBlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBTdHJpbmcoaHRtbCkucmVwbGFjZSgvW1wiJyY8Pl0vZywgbWF0Y2ggPT4gZXNjYXBlZFttYXRjaF0pO1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cykge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBgICR7bmFtZX0ke3ZhbHVlID09PSB0cnVlID8gJycgOiBgPSR7dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KGVzY2FwZSh2YWx1ZSkpIDogYFwiJHt2YWx1ZX1cImB9YH1gO1xufVxuZnVuY3Rpb24gYWRkX2NsYXNzZXMoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzID8gYCBjbGFzcz1cIiR7Y2xhc3Nlc31cImAgOiBgYDtcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBvbl9tb3VudCwgb25fZGVzdHJveSwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG4gICAgZnJhZ21lbnQgJiYgZnJhZ21lbnQubSh0YXJnZXQsIGFuY2hvcik7XG4gICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdfb25fZGVzdHJveSA9IG9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgIGlmIChvbl9kZXN0cm95KSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG4gICAgICAgICAgICBydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcbiAgICB9KTtcbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCBwcm9wX3ZhbHVlcyA9IG9wdGlvbnMucHJvcHMgfHwge307XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQgPSB7XG4gICAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgICBjdHg6IG51bGwsXG4gICAgICAgIC8vIHN0YXRlXG4gICAgICAgIHByb3BzLFxuICAgICAgICB1cGRhdGU6IG5vb3AsXG4gICAgICAgIG5vdF9lcXVhbCxcbiAgICAgICAgYm91bmQ6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICAvLyBsaWZlY3ljbGVcbiAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICBvbl9kZXN0cm95OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5XG4gICAgfTtcbiAgICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgICAkJC5jdHggPSBpbnN0YW5jZVxuICAgICAgICA/IGluc3RhbmNlKGNvbXBvbmVudCwgcHJvcF92YWx1ZXMsIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5sKG5vZGVzKTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZGV0YWNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4yNC4wJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0RGF0YVwiLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25gKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuJGRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHdhcyBhbHJlYWR5IGRlc3Ryb3llZGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJGNhcHR1cmVfc3RhdGUoKSB7IH1cbiAgICAkaW5qZWN0X3N0YXRlKCkgeyB9XG59XG5mdW5jdGlvbiBsb29wX2d1YXJkKHRpbWVvdXQpIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSBzdGFydCA+IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5maW5pdGUgbG9vcCBkZXRlY3RlZGApO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgSHRtbFRhZywgU3ZlbHRlQ29tcG9uZW50LCBTdmVsdGVDb21wb25lbnREZXYsIFN2ZWx0ZUVsZW1lbnQsIGFjdGlvbl9kZXN0cm95ZXIsIGFkZF9hdHRyaWJ1dGUsIGFkZF9jbGFzc2VzLCBhZGRfZmx1c2hfY2FsbGJhY2ssIGFkZF9sb2NhdGlvbiwgYWRkX3JlbmRlcl9jYWxsYmFjaywgYWRkX3Jlc2l6ZV9saXN0ZW5lciwgYWRkX3RyYW5zZm9ybSwgYWZ0ZXJVcGRhdGUsIGFwcGVuZCwgYXBwZW5kX2RldiwgYXNzaWduLCBhdHRyLCBhdHRyX2RldiwgYmVmb3JlVXBkYXRlLCBiaW5kLCBiaW5kaW5nX2NhbGxiYWNrcywgYmxhbmtfb2JqZWN0LCBidWJibGUsIGNoZWNrX291dHJvcywgY2hpbGRyZW4sIGNsYWltX2NvbXBvbmVudCwgY2xhaW1fZWxlbWVudCwgY2xhaW1fc3BhY2UsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZXNjYXBlLCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldENvbnRleHQsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHQsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNfcHJvcCwgaWRlbnRpdHksIGluaXQsIGluc2VydCwgaW5zZXJ0X2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZnVuY3Rpb24sIGlzX3Byb21pc2UsIGxpc3RlbiwgbGlzdGVuX2RldiwgbG9vcCwgbG9vcF9ndWFyZCwgbWlzc2luZ19jb21wb25lbnQsIG1vdW50X2NvbXBvbmVudCwgbm9vcCwgbm90X2VxdWFsLCBub3csIG51bGxfdG9fZW1wdHksIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMsIG9uRGVzdHJveSwgb25Nb3VudCwgb25jZSwgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIHByZXZlbnRfZGVmYXVsdCwgcHJvcF9kZXYsIHF1ZXJ5X3NlbGVjdG9yX2FsbCwgcmFmLCBydW4sIHJ1bl9hbGwsIHNhZmVfbm90X2VxdWFsLCBzY2hlZHVsZV91cGRhdGUsIHNlbGVjdF9tdWx0aXBsZV92YWx1ZSwgc2VsZWN0X29wdGlvbiwgc2VsZWN0X29wdGlvbnMsIHNlbGVjdF92YWx1ZSwgc2VsZiwgc2V0Q29udGV4dCwgc2V0X2F0dHJpYnV0ZXMsIHNldF9jdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEsIHNldF9kYXRhLCBzZXRfZGF0YV9kZXYsIHNldF9pbnB1dF90eXBlLCBzZXRfaW5wdXRfdmFsdWUsIHNldF9ub3csIHNldF9yYWYsIHNldF9zdG9yZV92YWx1ZSwgc2V0X3N0eWxlLCBzZXRfc3ZnX2F0dHJpYnV0ZXMsIHNwYWNlLCBzcHJlYWQsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3Nsb3RzLCB2YWxpZGF0ZV9zdG9yZSwgeGxpbmtfYXR0ciB9O1xuIiwiaW1wb3J0IHsgbm9vcCwgc2FmZV9ub3RfZXF1YWwsIHN1YnNjcmliZSwgcnVuX2FsbCwgaXNfZnVuY3Rpb24gfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5leHBvcnQgeyBnZXRfc3RvcmVfdmFsdWUgYXMgZ2V0IH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG5jb25zdCBzdWJzY3JpYmVyX3F1ZXVlID0gW107XG4vKipcbiAqIENyZWF0ZXMgYSBgUmVhZGFibGVgIHN0b3JlIHRoYXQgYWxsb3dzIHJlYWRpbmcgYnkgc3Vic2NyaXB0aW9uLlxuICogQHBhcmFtIHZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXJ9c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiByZWFkYWJsZSh2YWx1ZSwgc3RhcnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmU6IHdyaXRhYmxlKHZhbHVlLCBzdGFydCkuc3Vic2NyaWJlLFxuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZSBhIGBXcml0YWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgYm90aCB1cGRhdGluZyBhbmQgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0geyo9fXZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXI9fXN0YXJ0IHN0YXJ0IGFuZCBzdG9wIG5vdGlmaWNhdGlvbnMgZm9yIHN1YnNjcmlwdGlvbnNcbiAqL1xuZnVuY3Rpb24gd3JpdGFibGUodmFsdWUsIHN0YXJ0ID0gbm9vcCkge1xuICAgIGxldCBzdG9wO1xuICAgIGNvbnN0IHN1YnNjcmliZXJzID0gW107XG4gICAgZnVuY3Rpb24gc2V0KG5ld192YWx1ZSkge1xuICAgICAgICBpZiAoc2FmZV9ub3RfZXF1YWwodmFsdWUsIG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICAgICAgaWYgKHN0b3ApIHsgLy8gc3RvcmUgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICBjb25zdCBydW5fcXVldWUgPSAhc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHNbMV0oKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5wdXNoKHMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bl9xdWV1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJfcXVldWUubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWVbaV1bMF0oc3Vic2NyaWJlcl9xdWV1ZVtpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG4gICAgICAgIHNldChmbih2YWx1ZSkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUocnVuLCBpbnZhbGlkYXRlID0gbm9vcCkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gW3J1biwgaW52YWxpZGF0ZV07XG4gICAgICAgIHN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydChzZXQpIHx8IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgcnVuKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaWJlcnMuaW5kZXhPZihzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICBzdG9wID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc2V0LCB1cGRhdGUsIHN1YnNjcmliZSB9O1xufVxuZnVuY3Rpb24gZGVyaXZlZChzdG9yZXMsIGZuLCBpbml0aWFsX3ZhbHVlKSB7XG4gICAgY29uc3Qgc2luZ2xlID0gIUFycmF5LmlzQXJyYXkoc3RvcmVzKTtcbiAgICBjb25zdCBzdG9yZXNfYXJyYXkgPSBzaW5nbGVcbiAgICAgICAgPyBbc3RvcmVzXVxuICAgICAgICA6IHN0b3JlcztcbiAgICBjb25zdCBhdXRvID0gZm4ubGVuZ3RoIDwgMjtcbiAgICByZXR1cm4gcmVhZGFibGUoaW5pdGlhbF92YWx1ZSwgKHNldCkgPT4ge1xuICAgICAgICBsZXQgaW5pdGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgcGVuZGluZyA9IDA7XG4gICAgICAgIGxldCBjbGVhbnVwID0gbm9vcDtcbiAgICAgICAgY29uc3Qgc3luYyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm4oc2luZ2xlID8gdmFsdWVzWzBdIDogdmFsdWVzLCBzZXQpO1xuICAgICAgICAgICAgaWYgKGF1dG8pIHtcbiAgICAgICAgICAgICAgICBzZXQocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFudXAgPSBpc19mdW5jdGlvbihyZXN1bHQpID8gcmVzdWx0IDogbm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdW5zdWJzY3JpYmVycyA9IHN0b3Jlc19hcnJheS5tYXAoKHN0b3JlLCBpKSA9PiBzdWJzY3JpYmUoc3RvcmUsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgICBwZW5kaW5nICY9IH4oMSA8PCBpKTtcbiAgICAgICAgICAgIGlmIChpbml0ZWQpIHtcbiAgICAgICAgICAgICAgICBzeW5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHBlbmRpbmcgfD0gKDEgPDwgaSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgc3luYygpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgICAgIHJ1bl9hbGwodW5zdWJzY3JpYmVycyk7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IGRlcml2ZWQsIHJlYWRhYmxlLCB3cml0YWJsZSB9O1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9LRVkgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHByZWxvYWQgPSAoKSA9PiAoe30pOyIsImNvbnN0IG5vRGVwdGggPSBbXCJ3aGl0ZVwiLCBcImJsYWNrXCIsIFwidHJhbnNwYXJlbnRcIl07XG5cbmZ1bmN0aW9uIGdldENsYXNzKHByb3AsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSB7XG4gIGlmIChub0RlcHRoLmluY2x1ZGVzKGNvbG9yKSkge1xuICAgIHJldHVybiBgJHtwcm9wfS0ke2NvbG9yfWA7XG4gIH1cbiAgcmV0dXJuIGAke3Byb3B9LSR7Y29sb3J9LSR7ZGVwdGggfHwgZGVmYXVsdERlcHRofSBgO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1dGlscyhjb2xvciwgZGVmYXVsdERlcHRoID0gNTAwKSB7XG4gIHJldHVybiB7XG4gICAgYmc6IGRlcHRoID0+IGdldENsYXNzKFwiYmdcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpLFxuICAgIGJvcmRlcjogZGVwdGggPT4gZ2V0Q2xhc3MoXCJib3JkZXJcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpLFxuICAgIHR4dDogZGVwdGggPT4gZ2V0Q2xhc3MoXCJ0ZXh0XCIsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSxcbiAgICBjYXJldDogZGVwdGggPT4gZ2V0Q2xhc3MoXCJjYXJldFwiLCBjb2xvciwgZGVwdGgsIGRlZmF1bHREZXB0aClcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKGNsYXNzZXMsIGRlZmF1bHRDbGFzc2VzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9XG4gICAgICAodHlwZW9mIGNsYXNzZXMgPT09IFwiZnVuY3Rpb25cIiA/IGNsYXNzZXMoZGVmYXVsdENsYXNzZXMpIDogY2xhc3NlcykgfHxcbiAgICAgIGRlZmF1bHRDbGFzc2VzO1xuXG4gICAgdGhpcy5jbGFzc2VzID0gdGhpcy5kZWZhdWx0cztcbiAgfVxuXG4gIGZsdXNoKCkge1xuICAgIHRoaXMuY2xhc3NlcyA9IHRoaXMuZGVmYXVsdHM7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV4dGVuZCguLi5mbnMpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc2VzO1xuICB9XG5cbiAgcmVwbGFjZShjbGFzc2VzLCBjb25kID0gdHJ1ZSkge1xuICAgIGlmIChjb25kICYmIGNsYXNzZXMpIHtcbiAgICAgIHRoaXMuY2xhc3NlcyA9IE9iamVjdC5rZXlzKGNsYXNzZXMpLnJlZHVjZShcbiAgICAgICAgKGFjYywgZnJvbSkgPT4gYWNjLnJlcGxhY2UobmV3IFJlZ0V4cChmcm9tLCBcImdcIiksIGNsYXNzZXNbZnJvbV0pLFxuICAgICAgICB0aGlzLmNsYXNzZXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmUoY2xhc3NlcywgY29uZCA9IHRydWUpIHtcbiAgICBpZiAoY29uZCAmJiBjbGFzc2VzKSB7XG4gICAgICB0aGlzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIC5zcGxpdChcIiBcIilcbiAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXIpID0+IGFjYy5yZXBsYWNlKG5ldyBSZWdFeHAoY3VyLCBcImdcIiksIFwiXCIpLFxuICAgICAgICAgIHRoaXMuY2xhc3Nlc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkKGNsYXNzTmFtZSwgY29uZCA9IHRydWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICghY29uZCB8fCAhY2xhc3NOYW1lKSByZXR1cm4gdGhpcztcblxuICAgIHN3aXRjaCAodHlwZW9mIGNsYXNzTmFtZSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5jbGFzc2VzICs9IGAgJHtjbGFzc05hbWV9IGA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgIHRoaXMuY2xhc3NlcyArPSBgICR7Y2xhc3NOYW1lKGRlZmF1bHRWYWx1ZSB8fCB0aGlzLmNsYXNzZXMpfSBgO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFJlc2VydmVkID0gW1wiY2xhc3NcIiwgXCJhZGRcIiwgXCJyZW1vdmVcIiwgXCJyZXBsYWNlXCIsIFwidmFsdWVcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJQcm9wcyhyZXNlcnZlZCwgcHJvcHMpIHtcbiAgY29uc3QgciA9IFsuLi5yZXNlcnZlZCwgLi4uZGVmYXVsdFJlc2VydmVkXTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShcbiAgICAoYWNjLCBjdXIpID0+XG4gICAgICBjdXIuaW5jbHVkZXMoXCIkJFwiKSB8fCBjdXIuaW5jbHVkZXMoXCJDbGFzc1wiKSB8fCByLmluY2x1ZGVzKGN1cilcbiAgICAgICAgPyBhY2NcbiAgICAgICAgOiB7IC4uLmFjYywgW2N1cl06IHByb3BzW2N1cl0gfSxcbiAgICB7fVxuICApO1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuXG5cblxuICBsZXQgY2xhc3Nlc0RlZmF1bHQgPVxuICAgIFwiZml4ZWQgdG9wLTAgdy1mdWxsIGl0ZW1zLWNlbnRlciBmbGV4LXdyYXAgZmxleCBsZWZ0LTAgei0zMCBwLTAgaC0xNiBlbGV2YXRpb24tMyBiZy1wcmltYXJ5LTMwMCBkYXJrOmJnLWRhcmstNjAwXCI7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICAkOiBjID0gY2IuZmx1c2goKS5hZGQoJCRwcm9wcy5jbGFzcykuZ2V0KCk7XG48L3NjcmlwdD5cblxuPGhlYWRlciBjbGFzcz17Y30+XG4gIDxzbG90IC8+XG48L2hlYWRlcj5cbiIsIjxzY3JpcHQ+XG5cblxuICBleHBvcnQgbGV0IHNtYWxsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgeHMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCByZXZlcnNlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGlwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcImRlZmF1bHRcIjtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5yZXZlcnNlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICB9XG5cbiAgLnRpcCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuICB9XG48L3N0eWxlPlxuXG48aVxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGljb24gdGV4dC14bCBzZWxlY3Qtbm9uZSB7JCRwcm9wcy5jbGFzc30gZHVyYXRpb24tMjAwIGVhc2UtaW5cIlxuICBjbGFzczpyZXZlcnNlXG4gIGNsYXNzOnRpcFxuICBvbjpjbGlja1xuICBjbGFzczp0ZXh0LWJhc2U9e3NtYWxsfVxuICBjbGFzczp0ZXh0LXhzPXt4c31cbiAgc3R5bGU9e2NvbG9yID8gYGNvbG9yOiAke2NvbG9yfWAgOiAnJ30+XG4gIDxzbG90IC8+XG48L2k+XG4iLCIvLyBUaGFua3MgTGFnZGVuISBodHRwczovL3N2ZWx0ZS5kZXYvcmVwbC82MWQ5MTc4ZDJiOTk0NGYyYWEyYmZlMzE2MTJhYjA5Zj92ZXJzaW9uPTMuNi43XG5mdW5jdGlvbiByaXBwbGUoY29sb3IsIGNlbnRlcmVkKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgY29uc3QgZCA9IE1hdGgubWF4KHRhcmdldC5jbGllbnRXaWR0aCwgdGFyZ2V0LmNsaWVudEhlaWdodCk7XG5cbiAgICBjb25zdCByZW1vdmVDaXJjbGUgPSAoKSA9PiB7XG4gICAgICBjaXJjbGUucmVtb3ZlKCk7XG4gICAgICBjaXJjbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCByZW1vdmVDaXJjbGUpO1xuICAgIH07XG5cbiAgICBjaXJjbGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCByZW1vdmVDaXJjbGUpO1xuICAgIGNpcmNsZS5zdHlsZS53aWR0aCA9IGNpcmNsZS5zdHlsZS5oZWlnaHQgPSBgJHtkfXB4YDtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgaWYgKGNlbnRlcmVkKSB7XG4gICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgXCJhYnNvbHV0ZVwiLFxuICAgICAgICBcInRvcC0wXCIsXG4gICAgICAgIFwibGVmdC0wXCIsXG4gICAgICAgIFwicmlwcGxlLWNlbnRlcmVkXCIsXG4gICAgICAgIGBiZy0ke2NvbG9yfS10cmFuc0RhcmtgXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaXJjbGUuc3R5bGUubGVmdCA9IGAke2V2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBkIC8gMn1weGA7XG4gICAgICBjaXJjbGUuc3R5bGUudG9wID0gYCR7ZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gZCAvIDJ9cHhgO1xuXG4gICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZChcInJpcHBsZS1ub3JtYWxcIiwgYGJnLSR7Y29sb3J9LXRyYW5zYCk7XG4gICAgfVxuXG4gICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJyaXBwbGVcIik7XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcihjb2xvciA9IFwicHJpbWFyeVwiLCBjZW50ZXJlZCA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgY29uc3Qgb25Nb3VzZURvd24gPSByaXBwbGUoY29sb3IsIGNlbnRlcmVkKTtcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Nb3VzZURvd24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9uRGVzdHJveTogKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uTW91c2VEb3duKSxcbiAgICB9O1xuICB9O1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IEljb24gZnJvbSBcIi4uL0ljb25cIjtcbiAgaW1wb3J0IGNyZWF0ZVJpcHBsZSBmcm9tIFwiLi4vUmlwcGxlL3JpcHBsZS5qc1wiO1xuICBpbXBvcnQgdXRpbHMsIHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwiZHVyYXRpb24tMTAwIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiB0ZXh0LWNlbnRlciB3LWZ1bGwgaC1mdWxsIHAtNCBjdXJzb3ItcG9pbnRlciBmbGV4IG14LWF1dG8gaXRlbXMtY2VudGVyIHRleHQtc20gaC1mdWxsXCI7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG5cbiAgZXhwb3J0IGxldCBpY29uID0gXCJcIjtcbiAgZXhwb3J0IGxldCBpZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdGV4dCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdG8gPSBcIlwiO1xuICBleHBvcnQgbGV0IHNlbGVjdGVkID0gXCJcIjtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwicHJpbWFyeVwiO1xuICBleHBvcnQgbGV0IG5vdFNlbGVjdGVkQ29sb3IgPSBcIndoaXRlXCI7XG4gIGV4cG9ydCBsZXQgdGFiQ2xhc3NlcyA9IFwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgY29udGVudC1jZW50ZXIgbXgtYXV0b1wiO1xuXG5cblxuXG4gIGNvbnN0IHJpcHBsZSA9IGNyZWF0ZVJpcHBsZShjb2xvcik7XG5cbiAgY29uc3QgeyB0eHQsIGJnIH0gPSB1dGlscyhjb2xvcik7XG4gIGNvbnN0IG5vdFNlbGVjdGVkID0gdXRpbHMobm90U2VsZWN0ZWRDb2xvcik7XG5cbiAgJDogdGV4dENvbG9yID0gc2VsZWN0ZWQgPT09IGlkID8gdHh0KCkgOiBub3RTZWxlY3RlZC50eHQoKTtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5hZGQoXCJ1cHBlcmNhc2VcIiwgaWNvbilcbiAgICAuYWRkKHRleHRDb2xvcilcbiAgICAuYWRkKGBob3ZlcjpiZy0ke2NvbG9yfS10cmFuc0xpZ2h0IGhvdmVyOiR7dHh0KDkwMCl9YClcbiAgICAuZ2V0KCk7XG48L3NjcmlwdD5cblxueyNpZiB0b31cbiAgPGFcbiAgICB1c2U6cmlwcGxlXG4gICAgaHJlZj17dG99XG4gICAgY2xhc3M9e2N9XG4gICAgb246Y2xpY2tcbiAgPlxuICAgIDxkaXYgY2xhc3M9e3RhYkNsYXNzZXN9PlxuICAgICAgeyNpZiBpY29ufVxuICAgICAgICA8SWNvbiBjbGFzcz1cIm1iLTFcIiBjb2xvcj17dGV4dENvbG9yfT57aWNvbn08L0ljb24+XG4gICAgICB7L2lmfVxuXG4gICAgICA8ZGl2PlxuICAgICAgICA8c2xvdD57dGV4dH08L3Nsb3Q+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9hPlxuezplbHNlfVxuICA8bGlcbiAgICB1c2U6cmlwcGxlXG4gICAgY2xhc3M9e2N9XG4gICAgb246Y2xpY2s9eygpID0+IHNlbGVjdGVkID0gaWQgfVxuICAgIG9uOmNsaWNrXG4gID5cbiAgICA8ZGl2IGNsYXNzPXt0YWJDbGFzc2VzfT5cbiAgICAgIHsjaWYgaWNvbn1cbiAgICAgICAgPEljb24gY2xhc3M9XCJtYi0xXCIgY29sb3I9e3RleHRDb2xvcn0+e2ljb259PC9JY29uPlxuICAgICAgey9pZn1cblxuICAgICAgPGRpdj5cbiAgICAgICAgPHNsb3Q+e3RleHR9PC9zbG90PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvbGk+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlkID0gbnVsbDtcbjwvc2NyaXB0PlxuXG57I2lmIHNlbGVjdGVkID09PSBpZH1cbiAgPHNsb3QgLz5cbnsvaWZ9XG4iLCJleHBvcnQgeyBpZGVudGl0eSBhcyBsaW5lYXIgfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbi8qXG5BZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdHRkZXNsXG5EaXN0cmlidXRlZCB1bmRlciBNSVQgTGljZW5zZSBodHRwczovL2dpdGh1Yi5jb20vbWF0dGRlc2wvZWFzZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuKi9cbmZ1bmN0aW9uIGJhY2tJbk91dCh0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTggKiAxLjUyNTtcbiAgICBpZiAoKHQgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gMC41ICogKHQgKiB0ICogKChzICsgMSkgKiB0IC0gcykpO1xuICAgIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAyKTtcbn1cbmZ1bmN0aW9uIGJhY2tJbih0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTg7XG4gICAgcmV0dXJuIHQgKiB0ICogKChzICsgMSkgKiB0IC0gcyk7XG59XG5mdW5jdGlvbiBiYWNrT3V0KHQpIHtcbiAgICBjb25zdCBzID0gMS43MDE1ODtcbiAgICByZXR1cm4gLS10ICogdCAqICgocyArIDEpICogdCArIHMpICsgMTtcbn1cbmZ1bmN0aW9uIGJvdW5jZU91dCh0KSB7XG4gICAgY29uc3QgYSA9IDQuMCAvIDExLjA7XG4gICAgY29uc3QgYiA9IDguMCAvIDExLjA7XG4gICAgY29uc3QgYyA9IDkuMCAvIDEwLjA7XG4gICAgY29uc3QgY2EgPSA0MzU2LjAgLyAzNjEuMDtcbiAgICBjb25zdCBjYiA9IDM1NDQyLjAgLyAxODA1LjA7XG4gICAgY29uc3QgY2MgPSAxNjA2MS4wIC8gMTgwNS4wO1xuICAgIGNvbnN0IHQyID0gdCAqIHQ7XG4gICAgcmV0dXJuIHQgPCBhXG4gICAgICAgID8gNy41NjI1ICogdDJcbiAgICAgICAgOiB0IDwgYlxuICAgICAgICAgICAgPyA5LjA3NSAqIHQyIC0gOS45ICogdCArIDMuNFxuICAgICAgICAgICAgOiB0IDwgY1xuICAgICAgICAgICAgICAgID8gY2EgKiB0MiAtIGNiICogdCArIGNjXG4gICAgICAgICAgICAgICAgOiAxMC44ICogdCAqIHQgLSAyMC41MiAqIHQgKyAxMC43Mjtcbn1cbmZ1bmN0aW9uIGJvdW5jZUluT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNVxuICAgICAgICA/IDAuNSAqICgxLjAgLSBib3VuY2VPdXQoMS4wIC0gdCAqIDIuMCkpXG4gICAgICAgIDogMC41ICogYm91bmNlT3V0KHQgKiAyLjAgLSAxLjApICsgMC41O1xufVxuZnVuY3Rpb24gYm91bmNlSW4odCkge1xuICAgIHJldHVybiAxLjAgLSBib3VuY2VPdXQoMS4wIC0gdCk7XG59XG5mdW5jdGlvbiBjaXJjSW5PdXQodCkge1xuICAgIGlmICgodCAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gdCAqIHQpIC0gMSk7XG4gICAgcmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtICh0IC09IDIpICogdCkgKyAxKTtcbn1cbmZ1bmN0aW9uIGNpcmNJbih0KSB7XG4gICAgcmV0dXJuIDEuMCAtIE1hdGguc3FydCgxLjAgLSB0ICogdCk7XG59XG5mdW5jdGlvbiBjaXJjT3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSAtLXQgKiB0KTtcbn1cbmZ1bmN0aW9uIGN1YmljSW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41ID8gNC4wICogdCAqIHQgKiB0IDogMC41ICogTWF0aC5wb3coMi4wICogdCAtIDIuMCwgMy4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIGN1YmljSW4odCkge1xuICAgIHJldHVybiB0ICogdCAqIHQ7XG59XG5mdW5jdGlvbiBjdWJpY091dCh0KSB7XG4gICAgY29uc3QgZiA9IHQgLSAxLjA7XG4gICAgcmV0dXJuIGYgKiBmICogZiArIDEuMDtcbn1cbmZ1bmN0aW9uIGVsYXN0aWNJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjVcbiAgICAgICAgPyAwLjUgKlxuICAgICAgICAgICAgTWF0aC5zaW4oKCgrMTMuMCAqIE1hdGguUEkpIC8gMikgKiAyLjAgKiB0KSAqXG4gICAgICAgICAgICBNYXRoLnBvdygyLjAsIDEwLjAgKiAoMi4wICogdCAtIDEuMCkpXG4gICAgICAgIDogMC41ICpcbiAgICAgICAgICAgIE1hdGguc2luKCgoLTEzLjAgKiBNYXRoLlBJKSAvIDIpICogKDIuMCAqIHQgLSAxLjAgKyAxLjApKSAqXG4gICAgICAgICAgICBNYXRoLnBvdygyLjAsIC0xMC4wICogKDIuMCAqIHQgLSAxLjApKSArXG4gICAgICAgICAgICAxLjA7XG59XG5mdW5jdGlvbiBlbGFzdGljSW4odCkge1xuICAgIHJldHVybiBNYXRoLnNpbigoMTMuMCAqIHQgKiBNYXRoLlBJKSAvIDIpICogTWF0aC5wb3coMi4wLCAxMC4wICogKHQgLSAxLjApKTtcbn1cbmZ1bmN0aW9uIGVsYXN0aWNPdXQodCkge1xuICAgIHJldHVybiAoTWF0aC5zaW4oKC0xMy4wICogKHQgKyAxLjApICogTWF0aC5QSSkgLyAyKSAqIE1hdGgucG93KDIuMCwgLTEwLjAgKiB0KSArIDEuMCk7XG59XG5mdW5jdGlvbiBleHBvSW5PdXQodCkge1xuICAgIHJldHVybiB0ID09PSAwLjAgfHwgdCA9PT0gMS4wXG4gICAgICAgID8gdFxuICAgICAgICA6IHQgPCAwLjVcbiAgICAgICAgICAgID8gKzAuNSAqIE1hdGgucG93KDIuMCwgMjAuMCAqIHQgLSAxMC4wKVxuICAgICAgICAgICAgOiAtMC41ICogTWF0aC5wb3coMi4wLCAxMC4wIC0gdCAqIDIwLjApICsgMS4wO1xufVxuZnVuY3Rpb24gZXhwb0luKHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMC4wID8gdCA6IE1hdGgucG93KDIuMCwgMTAuMCAqICh0IC0gMS4wKSk7XG59XG5mdW5jdGlvbiBleHBvT3V0KHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMS4wID8gdCA6IDEuMCAtIE1hdGgucG93KDIuMCwgLTEwLjAgKiB0KTtcbn1cbmZ1bmN0aW9uIHF1YWRJbk91dCh0KSB7XG4gICAgdCAvPSAwLjU7XG4gICAgaWYgKHQgPCAxKVxuICAgICAgICByZXR1cm4gMC41ICogdCAqIHQ7XG4gICAgdC0tO1xuICAgIHJldHVybiAtMC41ICogKHQgKiAodCAtIDIpIC0gMSk7XG59XG5mdW5jdGlvbiBxdWFkSW4odCkge1xuICAgIHJldHVybiB0ICogdDtcbn1cbmZ1bmN0aW9uIHF1YWRPdXQodCkge1xuICAgIHJldHVybiAtdCAqICh0IC0gMi4wKTtcbn1cbmZ1bmN0aW9uIHF1YXJ0SW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41XG4gICAgICAgID8gKzguMCAqIE1hdGgucG93KHQsIDQuMClcbiAgICAgICAgOiAtOC4wICogTWF0aC5wb3codCAtIDEuMCwgNC4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIHF1YXJ0SW4odCkge1xuICAgIHJldHVybiBNYXRoLnBvdyh0LCA0LjApO1xufVxuZnVuY3Rpb24gcXVhcnRPdXQodCkge1xuICAgIHJldHVybiBNYXRoLnBvdyh0IC0gMS4wLCAzLjApICogKDEuMCAtIHQpICsgMS4wO1xufVxuZnVuY3Rpb24gcXVpbnRJbk91dCh0KSB7XG4gICAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0ICogdCAqIHQgKiB0O1xuICAgIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgKiB0ICsgMik7XG59XG5mdW5jdGlvbiBxdWludEluKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogdCAqIHQ7XG59XG5mdW5jdGlvbiBxdWludE91dCh0KSB7XG4gICAgcmV0dXJuIC0tdCAqIHQgKiB0ICogdCAqIHQgKyAxO1xufVxuZnVuY3Rpb24gc2luZUluT3V0KHQpIHtcbiAgICByZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogdCkgLSAxKTtcbn1cbmZ1bmN0aW9uIHNpbmVJbih0KSB7XG4gICAgY29uc3QgdiA9IE1hdGguY29zKHQgKiBNYXRoLlBJICogMC41KTtcbiAgICBpZiAoTWF0aC5hYnModikgPCAxZS0xNClcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gMSAtIHY7XG59XG5mdW5jdGlvbiBzaW5lT3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4oKHQgKiBNYXRoLlBJKSAvIDIpO1xufVxuXG5leHBvcnQgeyBiYWNrSW4sIGJhY2tJbk91dCwgYmFja091dCwgYm91bmNlSW4sIGJvdW5jZUluT3V0LCBib3VuY2VPdXQsIGNpcmNJbiwgY2lyY0luT3V0LCBjaXJjT3V0LCBjdWJpY0luLCBjdWJpY0luT3V0LCBjdWJpY091dCwgZWxhc3RpY0luLCBlbGFzdGljSW5PdXQsIGVsYXN0aWNPdXQsIGV4cG9JbiwgZXhwb0luT3V0LCBleHBvT3V0LCBxdWFkSW4sIHF1YWRJbk91dCwgcXVhZE91dCwgcXVhcnRJbiwgcXVhcnRJbk91dCwgcXVhcnRPdXQsIHF1aW50SW4sIHF1aW50SW5PdXQsIHF1aW50T3V0LCBzaW5lSW4sIHNpbmVJbk91dCwgc2luZU91dCB9O1xuIiwiaW1wb3J0IHsgY3ViaWNJbk91dCwgbGluZWFyLCBjdWJpY091dCB9IGZyb20gJy4uL2Vhc2luZyc7XG5pbXBvcnQgeyBpc19mdW5jdGlvbiwgYXNzaWduIH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XG5cbmZ1bmN0aW9uIGJsdXIobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY0luT3V0LCBhbW91bnQgPSA1LCBvcGFjaXR5ID0gMCB9KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgZiA9IHN0eWxlLmZpbHRlciA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS5maWx0ZXI7XG4gICAgY29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKF90LCB1KSA9PiBgb3BhY2l0eTogJHt0YXJnZXRfb3BhY2l0eSAtIChvZCAqIHUpfTsgZmlsdGVyOiAke2Z9IGJsdXIoJHt1ICogYW1vdW50fXB4KTtgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZhZGUobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBsaW5lYXIgfSkge1xuICAgIGNvbnN0IG8gPSArZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5vcGFjaXR5O1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IHQgPT4gYG9wYWNpdHk6ICR7dCAqIG99YFxuICAgIH07XG59XG5mdW5jdGlvbiBmbHkobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCwgeCA9IDAsIHkgPSAwLCBvcGFjaXR5ID0gMCB9KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAodCwgdSkgPT4gYFxuXHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7KDEgLSB0KSAqIHh9cHgsICR7KDEgLSB0KSAqIHl9cHgpO1xuXHRcdFx0b3BhY2l0eTogJHt0YXJnZXRfb3BhY2l0eSAtIChvZCAqIHUpfWBcbiAgICB9O1xufVxuZnVuY3Rpb24gc2xpZGUobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCB9KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGNvbnN0IG9wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLmhlaWdodCk7XG4gICAgY29uc3QgcGFkZGluZ190b3AgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdUb3ApO1xuICAgIGNvbnN0IHBhZGRpbmdfYm90dG9tID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nQm90dG9tKTtcbiAgICBjb25zdCBtYXJnaW5fdG9wID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Ub3ApO1xuICAgIGNvbnN0IG1hcmdpbl9ib3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkJvdHRvbSk7XG4gICAgY29uc3QgYm9yZGVyX3RvcF93aWR0aCA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyVG9wV2lkdGgpO1xuICAgIGNvbnN0IGJvcmRlcl9ib3R0b21fd2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiB0ID0+IGBvdmVyZmxvdzogaGlkZGVuO2AgK1xuICAgICAgICAgICAgYG9wYWNpdHk6ICR7TWF0aC5taW4odCAqIDIwLCAxKSAqIG9wYWNpdHl9O2AgK1xuICAgICAgICAgICAgYGhlaWdodDogJHt0ICogaGVpZ2h0fXB4O2AgK1xuICAgICAgICAgICAgYHBhZGRpbmctdG9wOiAke3QgKiBwYWRkaW5nX3RvcH1weDtgICtcbiAgICAgICAgICAgIGBwYWRkaW5nLWJvdHRvbTogJHt0ICogcGFkZGluZ19ib3R0b219cHg7YCArXG4gICAgICAgICAgICBgbWFyZ2luLXRvcDogJHt0ICogbWFyZ2luX3RvcH1weDtgICtcbiAgICAgICAgICAgIGBtYXJnaW4tYm90dG9tOiAke3QgKiBtYXJnaW5fYm90dG9tfXB4O2AgK1xuICAgICAgICAgICAgYGJvcmRlci10b3Atd2lkdGg6ICR7dCAqIGJvcmRlcl90b3Bfd2lkdGh9cHg7YCArXG4gICAgICAgICAgICBgYm9yZGVyLWJvdHRvbS13aWR0aDogJHt0ICogYm9yZGVyX2JvdHRvbV93aWR0aH1weDtgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNjYWxlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQsIHN0YXJ0ID0gMCwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgY29uc3Qgc2QgPSAxIC0gc3RhcnQ7XG4gICAgY29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKF90LCB1KSA9PiBgXG5cdFx0XHR0cmFuc2Zvcm06ICR7dHJhbnNmb3JtfSBzY2FsZSgkezEgLSAoc2QgKiB1KX0pO1xuXHRcdFx0b3BhY2l0eTogJHt0YXJnZXRfb3BhY2l0eSAtIChvZCAqIHUpfVxuXHRcdGBcbiAgICB9O1xufVxuZnVuY3Rpb24gZHJhdyhub2RlLCB7IGRlbGF5ID0gMCwgc3BlZWQsIGR1cmF0aW9uLCBlYXNpbmcgPSBjdWJpY0luT3V0IH0pIHtcbiAgICBjb25zdCBsZW4gPSBub2RlLmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgaWYgKGR1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0gODAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZHVyYXRpb24gPSBsZW4gLyBzcGVlZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbihsZW4pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAodCwgdSkgPT4gYHN0cm9rZS1kYXNoYXJyYXk6ICR7dCAqIGxlbn0gJHt1ICogbGVufWBcbiAgICB9O1xufVxuZnVuY3Rpb24gY3Jvc3NmYWRlKF9hKSB7XG4gICAgdmFyIHsgZmFsbGJhY2sgfSA9IF9hLCBkZWZhdWx0cyA9IF9fcmVzdChfYSwgW1wiZmFsbGJhY2tcIl0pO1xuICAgIGNvbnN0IHRvX3JlY2VpdmUgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgdG9fc2VuZCA9IG5ldyBNYXAoKTtcbiAgICBmdW5jdGlvbiBjcm9zc2ZhZGUoZnJvbSwgbm9kZSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IGQgPT4gTWF0aC5zcXJ0KGQpICogMzAsIGVhc2luZyA9IGN1YmljT3V0IH0gPSBhc3NpZ24oYXNzaWduKHt9LCBkZWZhdWx0cyksIHBhcmFtcyk7XG4gICAgICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgZHggPSBmcm9tLmxlZnQgLSB0by5sZWZ0O1xuICAgICAgICBjb25zdCBkeSA9IGZyb20udG9wIC0gdG8udG9wO1xuICAgICAgICBjb25zdCBkdyA9IGZyb20ud2lkdGggLyB0by53aWR0aDtcbiAgICAgICAgY29uc3QgZGggPSBmcm9tLmhlaWdodCAvIHRvLmhlaWdodDtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgY29uc3Qgb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVsYXksXG4gICAgICAgICAgICBkdXJhdGlvbjogaXNfZnVuY3Rpb24oZHVyYXRpb24pID8gZHVyYXRpb24oZCkgOiBkdXJhdGlvbixcbiAgICAgICAgICAgIGVhc2luZyxcbiAgICAgICAgICAgIGNzczogKHQsIHUpID0+IGBcblx0XHRcdFx0b3BhY2l0eTogJHt0ICogb3BhY2l0eX07XG5cdFx0XHRcdHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0O1xuXHRcdFx0XHR0cmFuc2Zvcm06ICR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHt1ICogZHh9cHgsJHt1ICogZHl9cHgpIHNjYWxlKCR7dCArICgxIC0gdCkgKiBkd30sICR7dCArICgxIC0gdCkgKiBkaH0pO1xuXHRcdFx0YFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiB0cmFuc2l0aW9uKGl0ZW1zLCBjb3VudGVycGFydHMsIGludHJvKSB7XG4gICAgICAgIHJldHVybiAobm9kZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBpdGVtcy5zZXQocGFyYW1zLmtleSwge1xuICAgICAgICAgICAgICAgIHJlY3Q6IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRlcnBhcnRzLmhhcyhwYXJhbXMua2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHJlY3QgfSA9IGNvdW50ZXJwYXJ0cy5nZXQocGFyYW1zLmtleSk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXJwYXJ0cy5kZWxldGUocGFyYW1zLmtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcm9zc2ZhZGUocmVjdCwgbm9kZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIG5vZGUgaXMgZGlzYXBwZWFyaW5nIGFsdG9nZXRoZXJcbiAgICAgICAgICAgICAgICAvLyAoaS5lLiB3YXNuJ3QgY2xhaW1lZCBieSB0aGUgb3RoZXIgbGlzdClcbiAgICAgICAgICAgICAgICAvLyB0aGVuIHdlIG5lZWQgdG8gc3VwcGx5IGFuIG91dHJvXG4gICAgICAgICAgICAgICAgaXRlbXMuZGVsZXRlKHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxsYmFjayAmJiBmYWxsYmFjayhub2RlLCBwYXJhbXMsIGludHJvKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAgIHRyYW5zaXRpb24odG9fc2VuZCwgdG9fcmVjZWl2ZSwgZmFsc2UpLFxuICAgICAgICB0cmFuc2l0aW9uKHRvX3JlY2VpdmUsIHRvX3NlbmQsIHRydWUpXG4gICAgXTtcbn1cblxuZXhwb3J0IHsgYmx1ciwgY3Jvc3NmYWRlLCBkcmF3LCBmYWRlLCBmbHksIHNjYWxlLCBzbGlkZSB9O1xuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgc2xpZGUgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHV0aWxzIGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgZXhwb3J0IGxldCB3aWR0aCA9IDA7XG4gIGV4cG9ydCBsZXQgbGVmdCA9IDA7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcInByaW1hcnlcIjtcblxuICBjb25zdCB7IGJnIH0gPSB1dGlscyhjb2xvcik7XG48L3NjcmlwdD5cblxuPGRpdlxuICBjbGFzcz1cImFic29sdXRlIGJvdHRvbS0wIGxlZnQtMCB0cmFuc2l0aW9uIHtiZyg3MDApfVwiXG4gIGNsYXNzOmhpZGRlbj17bGVmdCA8IDB9XG4gIHN0eWxlPVwid2lkdGg6IHt3aWR0aH1weDsgbGVmdDoge2xlZnR9cHg7IGhlaWdodDogMnB4O1wiXG4gIHRyYW5zaXRpb246c2xpZGUgLz5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG5cbiAgZXhwb3J0IGxldCBhcHAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwcm9ncmVzcyA9IDA7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcInByaW1hcnlcIjtcblxuICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICBvbk1vdW50KCgpID0+IHtcbiAgICBpZiAoIWFwcCkgcmV0dXJuO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAvKiBrdWRvcyBodHRwczovL2NvZGVwZW4uaW8vc2hhbGltYW5vL3Blbi93Qm1OR0ogKi9cbiAgLmluYyB7XG4gICAgYW5pbWF0aW9uOiBpbmNyZWFzZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgfVxuICAuZGVjIHtcbiAgICBhbmltYXRpb246IGRlY3JlYXNlIDJzIDAuOXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gIH1cblxuICBAa2V5ZnJhbWVzIGluY3JlYXNlIHtcbiAgICBmcm9tIHtcbiAgICAgIGxlZnQ6IC01JTtcbiAgICAgIHdpZHRoOiA1JTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgbGVmdDogMTMwJTtcbiAgICAgIHdpZHRoOiAxNTAlO1xuICAgIH1cbiAgfVxuICBAa2V5ZnJhbWVzIGRlY3JlYXNlIHtcbiAgICBmcm9tIHtcbiAgICAgIGxlZnQ6IC05MCU7XG4gICAgICB3aWR0aDogOTAlO1xuICAgIH1cbiAgICB0byB7XG4gICAgICBsZWZ0OiAxMTAlO1xuICAgICAgd2lkdGg6IDEwJTtcbiAgICB9XG4gIH1cbjwvc3R5bGU+XG5cbjxkaXZcbiAgY2xhc3M6Zml4ZWQ9e2FwcH1cbiAgY2xhc3M6ei01MD17YXBwfVxuICBjbGFzcz1cInRvcC0wIGxlZnQtMCB3LWZ1bGwgaC0xIGJnLXtjb2xvcn0tMTAwIG92ZXJmbG93LWhpZGRlbiByZWxhdGl2ZVwiXG4gIGNsYXNzOmhpZGRlbj17YXBwICYmICFpbml0aWFsaXplZH1cbiAgdHJhbnNpdGlvbjpzbGlkZT17eyBkdXJhdGlvbjogMzAwIH19PlxuICA8ZGl2XG4gICAgY2xhc3M9XCJiZy17Y29sb3J9LTUwMCBoLTEgYWJzb2x1dGVcIlxuICAgIGNsYXNzOmluYz17IXByb2dyZXNzfVxuICAgIGNsYXNzOnRyYW5zaXRpb249e3Byb2dyZXNzfVxuICAgIHN0eWxlPXtwcm9ncmVzcyA/IGB3aWR0aDogJHtwcm9ncmVzc30lYCA6IFwiXCJ9IC8+XG4gIDxkaXYgY2xhc3M9XCJiZy17Y29sb3J9LTUwMCBoLTEgYWJzb2x1dGUgZGVjXCIgY2xhc3M6aGlkZGVuPXtwcm9ncmVzc30gLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBpbXBvcnQgSW5kaWNhdG9yIGZyb20gXCIuL0luZGljYXRvci5zdmVsdGVcIjtcbiAgaW1wb3J0IFByb2dyZXNzTGluZWFyIGZyb20gXCIuLi9Qcm9ncmVzc0xpbmVhclwiO1xuICBpbXBvcnQgVGFiQnV0dG9uIGZyb20gXCIuL1RhYkJ1dHRvbi5zdmVsdGVcIjtcblxuICBleHBvcnQgbGV0IHNlbGVjdGVkID0gbnVsbDtcbiAgZXhwb3J0IGxldCBuYXZpZ2F0aW9uID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaXRlbXMgPSBbXTtcbiAgZXhwb3J0IGxldCBpbmRpY2F0b3IgPSB0cnVlO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJ3aGl0ZVwiO1xuICBleHBvcnQgbGV0IG5vdFNlbGVjdGVkQ29sb3IgPSBcIndoaXRlXCI7XG5cblxuICBleHBvcnQgbGV0IGxvYWRpbmcgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB0YWJCdXR0b25DbGFzc2VzID0gaSA9PiBpO1xuXG4gIGxldCBub2RlO1xuICBsZXQgaW5kaWNhdG9yV2lkdGggPSAwO1xuICBsZXQgaW5kaWNhdG9yT2Zmc2V0ID0gMDtcbiAgbGV0IG9mZnNldCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gY2FsY0luZGljYXRvcigpIHtcbiAgICBpbmRpY2F0b3JXaWR0aCA9IG5vZGUgPyBub2RlLm9mZnNldFdpZHRoIC8gaXRlbXMubGVuZ3RoIDogMDtcblxuICAgIGxldCBsZWZ0ID0gMDtcbiAgICBpZiAoc2VsZWN0ZWQgJiYgaXRlbXMuZmluZEluZGV4KGkgPT4gc2VsZWN0ZWQuaW5jbHVkZXMoaS50byB8fCBpLmlkKSkgIT09IC0xKSB7XG4gICAgICBjb25zdCBsb25nZXN0TWF0Y2ggPSBpdGVtc1xuICAgICAgICAubWFwKChpdGVtLCBpbmRleCkgPT4gW2luZGV4LCBpdGVtXSlcbiAgICAgICAgLmZpbHRlcigoW2luZGV4LCBpdGVtXSkgPT4gc2VsZWN0ZWQuaW5jbHVkZXMoaXRlbS50byB8fCBpdGVtLmlkKSlcbiAgICAgICAgLnNvcnQoXG4gICAgICAgICAgKFtpbmRleDEsIGl0ZW0xXSwgW2luZGV4MiwgaXRlbTJdKSA9PlxuICAgICAgICAgICAgKGl0ZW0yLnRvIHx8IGl0ZW0yLmlkKS5sZW5ndGggLSAoaXRlbTEudG8gfHwgaXRlbTEuaWQpLmxlbmd0aFxuICAgICAgICApWzBdO1xuXG4gICAgICBpZiAobG9uZ2VzdE1hdGNoKSB7XG4gICAgICAgIGxlZnQgPSBsb25nZXN0TWF0Y2hbMF07XG4gICAgICAgIG9mZnNldCA9IGxlZnQgKiBpbmRpY2F0b3JXaWR0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbk1vdW50KCgpID0+IGNhbGNJbmRpY2F0b3Ioc2VsZWN0ZWQpKTtcblxuICAkOiBjYWxjSW5kaWNhdG9yKHNlbGVjdGVkKTtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwieS0wIGgtZnVsbCBpdGVtcy1jZW50ZXIgcmVsYXRpdmUgbXgtYXV0byB6LTIwXCI7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmFkZCgnaGlkZGVuIG1kOmZsZXggdy1mdWxsIG1heC13LTJ4bCcsIG5hdmlnYXRpb24pXG4gICAgLmFkZCgnZmxleCcsICFuYXZpZ2F0aW9uKVxuICAgIC5nZXQoKTtcbjwvc2NyaXB0PlxuXG48ZGl2XG4gIGNsYXNzPXtjfVxuICBiaW5kOnRoaXM9e25vZGV9PlxuICB7I2VhY2ggaXRlbXMgYXMgaXRlbSwgaX1cbiAgICA8c2xvdCBuYW1lPVwiaXRlbVwiIHtjb2xvcn0ge2l0ZW19PlxuICAgICAgPFRhYkJ1dHRvblxuICAgICAgICBjbGFzcz17dGFiQnV0dG9uQ2xhc3Nlc31cbiAgICAgICAgYmluZDpzZWxlY3RlZFxuICAgICAgICB7Li4uaXRlbX1cbiAgICAgICAge2NvbG9yfVxuICAgICAgICB7bm90U2VsZWN0ZWRDb2xvcn1cbiAgICAgID57aXRlbS50ZXh0fTwvVGFiQnV0dG9uPlxuICAgIDwvc2xvdD5cbiAgey9lYWNofVxuICB7I2lmIGluZGljYXRvciAmJiBvZmZzZXQgIT09IG51bGx9XG4gICAgPEluZGljYXRvciB7Y29sb3J9IHdpZHRoPXtpbmRpY2F0b3JXaWR0aH0gbGVmdD17b2Zmc2V0fSAvPlxuICB7L2lmfVxuPC9kaXY+XG57I2lmIGxvYWRpbmd9XG4gIDxQcm9ncmVzc0xpbmVhciB7Y29sb3J9IC8+XG57L2lmfVxuXG48c2xvdCB7c2VsZWN0ZWR9IG5hbWU9XCJjb250ZW50XCIgLz5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBJY29uIGZyb20gXCIuLi9JY29uXCI7XG4gIGltcG9ydCB1dGlscywgeyBDbGFzc0J1aWxkZXIsIGZpbHRlclByb3BzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcbiAgaW1wb3J0IGNyZWF0ZVJpcHBsZSBmcm9tIFwiLi4vUmlwcGxlL3JpcHBsZS5qc1wiO1xuXG5cblxuICBleHBvcnQgbGV0IHZhbHVlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgb3V0bGluZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB0ZXh0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYmxvY2sgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGljb24gPSBudWxsO1xuICBleHBvcnQgbGV0IHNtYWxsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgbGlnaHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkYXJrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZmxhdCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGljb25DbGFzcyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcInByaW1hcnlcIjtcbiAgZXhwb3J0IGxldCBocmVmID0gbnVsbDtcbiAgZXhwb3J0IGxldCBmYWIgPSBmYWxzZTtcblxuICBleHBvcnQgbGV0IHJlbW92ZSA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgYWRkID0gXCJcIjtcbiAgZXhwb3J0IGxldCByZXBsYWNlID0ge307XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSAnei0xMCBweS0yIHB4LTQgdXBwZXJjYXNlIHRleHQtc20gZm9udC1tZWRpdW0gcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuJztcbiAgY29uc3QgYmFzaWNEZWZhdWx0ID0gJ3RleHQtd2hpdGUgZHVyYXRpb24tMjAwIGVhc2UtaW4nO1xuXG4gIGNvbnN0IG91dGxpbmVkRGVmYXVsdCA9ICdiZy10cmFuc3BhcmVudCBib3JkZXIgYm9yZGVyLXNvbGlkJztcbiAgY29uc3QgdGV4dERlZmF1bHQgPSAnYmctdHJhbnNwYXJlbnQgYm9yZGVyLW5vbmUgcHgtNCBob3ZlcjpiZy10cmFuc3BhcmVudCc7XG4gIGNvbnN0IGljb25EZWZhdWx0ID0gJ3AtNCBmbGV4IGl0ZW1zLWNlbnRlciBzZWxlY3Qtbm9uZSc7XG4gIGNvbnN0IGZhYkRlZmF1bHQgPSAnaG92ZXI6YmctdHJhbnNwYXJlbnQnO1xuICBjb25zdCBzbWFsbERlZmF1bHQgPSAncHQtMSBwYi0xIHBsLTIgcHItMiB0ZXh0LXhzJztcbiAgY29uc3QgZGlzYWJsZWREZWZhdWx0ID0gJ2JnLWdyYXktMzAwIHRleHQtZ3JheS01MDAgZGFyazpiZy1kYXJrLTQwMCBlbGV2YXRpb24tbm9uZSBwb2ludGVyLWV2ZW50cy1ub25lIGhvdmVyOmJnLWdyYXktMzAwIGN1cnNvci1kZWZhdWx0JztcbiAgY29uc3QgZWxldmF0aW9uRGVmYXVsdCA9ICdob3ZlcjplbGV2YXRpb24tNSBlbGV2YXRpb24tMyc7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgYmFzaWNDbGFzc2VzID0gYmFzaWNEZWZhdWx0O1xuICBleHBvcnQgbGV0IG91dGxpbmVkQ2xhc3NlcyA9IG91dGxpbmVkRGVmYXVsdDtcbiAgZXhwb3J0IGxldCB0ZXh0Q2xhc3NlcyA9IHRleHREZWZhdWx0O1xuICBleHBvcnQgbGV0IGljb25DbGFzc2VzID0gaWNvbkRlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgZmFiQ2xhc3NlcyA9IGZhYkRlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgc21hbGxDbGFzc2VzID0gc21hbGxEZWZhdWx0O1xuICBleHBvcnQgbGV0IGRpc2FibGVkQ2xhc3NlcyA9IGRpc2FibGVkRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBlbGV2YXRpb25DbGFzc2VzID0gZWxldmF0aW9uRGVmYXVsdDtcblxuICBmYWIgPSBmYWIgfHwgKHRleHQgJiYgaWNvbik7XG4gIGNvbnN0IGJhc2ljID0gIW91dGxpbmVkICYmICF0ZXh0ICYmICFmYWI7XG4gIGNvbnN0IGVsZXZhdGlvbiA9IChiYXNpYyB8fCBpY29uKSAmJiAhZGlzYWJsZWQgJiYgIWZsYXQgJiYgIXRleHQ7XG5cbiAgbGV0IENsYXNzZXMgPSBpID0+IGk7XG4gIGxldCBpQ2xhc3NlcyA9IGkgPT4gaTtcbiAgbGV0IHNoYWRlID0gMDtcblxuICAkOiB7XG4gICAgc2hhZGUgPSBsaWdodCA/IDIwMCA6IDA7XG4gICAgc2hhZGUgPSBkYXJrID8gLTQwMCA6IHNoYWRlO1xuICB9XG4gICQ6IG5vcm1hbCA9IDUwMCAtIHNoYWRlO1xuICAkOiBsaWdodGVyID0gNDAwIC0gc2hhZGU7XG5cbiAgY29uc3Qge1xuICAgIGJnLFxuICAgIGJvcmRlcixcbiAgICB0eHQsXG4gIH0gPSB1dGlscyhjb2xvcik7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcbiAgbGV0IGljb25DYjtcblxuICBpZiAoaWNvbikge1xuICAgIGljb25DYiA9IG5ldyBDbGFzc0J1aWxkZXIoaWNvbkNsYXNzKTtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjYlxuICAgICAgLmZsdXNoKClcbiAgICAgIC5hZGQoYmFzaWNDbGFzc2VzLCBiYXNpYywgYmFzaWNEZWZhdWx0KVxuICAgICAgLmFkZChgJHtiZyhub3JtYWwpfSBob3Zlcjoke2JnKGxpZ2h0ZXIpfWAsIGJhc2ljKVxuICAgICAgLmFkZChlbGV2YXRpb25DbGFzc2VzLCBlbGV2YXRpb24sIGVsZXZhdGlvbkRlZmF1bHQpXG4gICAgICAuYWRkKG91dGxpbmVkQ2xhc3Nlcywgb3V0bGluZWQsIG91dGxpbmVkRGVmYXVsdClcbiAgICAgIC5hZGQoXG4gICAgICAgIGAke2JvcmRlcihsaWdodGVyKX0gJHt0eHQobm9ybWFsKX0gaG92ZXI6JHtiZyhcInRyYW5zXCIpfSBkYXJrLWhvdmVyOiR7YmcoXCJ0cmFuc0RhcmtcIil9YCxcbiAgICAgICAgb3V0bGluZWQpXG4gICAgICAuYWRkKGAke3R4dChsaWdodGVyKX1gLCB0ZXh0KVxuICAgICAgLmFkZCh0ZXh0Q2xhc3NlcywgdGV4dCwgdGV4dERlZmF1bHQpXG4gICAgICAuYWRkKGljb25DbGFzc2VzLCBpY29uLCBpY29uRGVmYXVsdClcbiAgICAgIC5yZW1vdmUoXCJweS0yXCIsIGljb24pXG4gICAgICAucmVtb3ZlKHR4dChsaWdodGVyKSwgZmFiKVxuICAgICAgLmFkZChkaXNhYmxlZENsYXNzZXMsIGRpc2FibGVkLCBkaXNhYmxlZERlZmF1bHQpXG4gICAgICAuYWRkKHNtYWxsQ2xhc3Nlcywgc21hbGwsIHNtYWxsRGVmYXVsdClcbiAgICAgIC5hZGQoXCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBoLTggdy04XCIsIHNtYWxsICYmIGljb24pXG4gICAgICAuYWRkKFwiYm9yZGVyLXNvbGlkXCIsIG91dGxpbmVkKVxuICAgICAgLmFkZChcInJvdW5kZWQtZnVsbFwiLCBpY29uKVxuICAgICAgLmFkZChcInctZnVsbFwiLCBibG9jaylcbiAgICAgIC5hZGQoXCJyb3VuZGVkXCIsIGJhc2ljIHx8IG91dGxpbmVkIHx8IHRleHQpXG4gICAgICAuYWRkKFwiYnV0dG9uXCIsICFpY29uKVxuICAgICAgLmFkZChmYWJDbGFzc2VzLCBmYWIsIGZhYkRlZmF1bHQpXG4gICAgICAuYWRkKGBob3Zlcjoke2JnKFwidHJhbnNMaWdodFwiKX1gLCBmYWIpXG4gICAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgICAucmVtb3ZlKHJlbW92ZSlcbiAgICAgIC5yZXBsYWNlKHJlcGxhY2UpXG4gICAgICAuYWRkKGFkZClcbiAgICAgIC5nZXQoKTtcblxuICAkOiBpZiAoaWNvbkNiKSB7XG4gICAgaUNsYXNzZXMgPSBpY29uQ2IuZmx1c2goKS5hZGQodHh0KCksIGZhYiAmJiAhaWNvbkNsYXNzKS5nZXQoKTtcbiAgfVxuXG4gIGNvbnN0IHJpcHBsZSA9IGNyZWF0ZVJpcHBsZSgodGV4dCB8fCBmYWIgfHwgb3V0bGluZWQpID8gY29sb3IgOiBcIndoaXRlXCIpO1xuXG4gIGNvbnN0IHByb3BzID0gZmlsdGVyUHJvcHMoW1xuICAgICdvdXRsaW5lZCcsXG4gICAgJ3RleHQnLFxuICAgICdjb2xvcicsXG4gICAgJ2Jsb2NrJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdpY29uJyxcbiAgICAnc21hbGwnLFxuICAgICdsaWdodCcsXG4gICAgJ2RhcmsnLFxuICAgICdmbGF0JyxcbiAgICAnYWRkJyxcbiAgICAncmVtb3ZlJyxcbiAgICAncmVwbGFjZScsXG4gIF0sICQkcHJvcHMpO1xuPC9zY3JpcHQ+XG5cblxueyNpZiBocmVmfVxuICA8YVxuICAgIHtocmVmfVxuICAgIHsuLi5wcm9wc31cbiAgPlxuICAgIDxidXR0b25cbiAgICAgIHVzZTpyaXBwbGVcbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAgey4uLnByb3BzfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAgb246Y2xpY2s9eygpID0+ICh2YWx1ZSA9ICF2YWx1ZSl9XG4gICAgICBvbjpjbGlja1xuICAgICAgb246bW91c2VvdmVyXG4gICAgICBvbjoqXG4gICAgPlxuICAgICAgeyNpZiBpY29ufVxuICAgICAgICA8SWNvbiBjbGFzcz17aUNsYXNzZXN9IHtzbWFsbH0+e2ljb259PC9JY29uPlxuICAgICAgey9pZn1cbiAgICAgIDxzbG90IC8+XG4gICAgPC9idXR0b24+XG4gIDwvYT5cbns6ZWxzZX1cbiAgPGJ1dHRvblxuICAgIHVzZTpyaXBwbGVcbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7Li4ucHJvcHN9XG4gICAge2Rpc2FibGVkfVxuICAgIG9uOmNsaWNrPXsoKSA9PiAodmFsdWUgPSAhdmFsdWUpfVxuICAgIG9uOmNsaWNrXG4gICAgb246bW91c2VvdmVyXG4gICAgb246KlxuICA+XG4gICAgeyNpZiBpY29ufVxuICAgICAgPEljb24gY2xhc3M9e2lDbGFzc2VzfSB7c21hbGx9PntpY29ufTwvSWNvbj5cbiAgICB7L2lmfVxuICAgIDxzbG90IC8+XG4gIDwvYnV0dG9uPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGZhZGUgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgcXVhZE91dCwgcXVhZEluIH0gZnJvbSBcInN2ZWx0ZS9lYXNpbmdcIjtcblxuICBleHBvcnQgbGV0IG9wYWNpdHkgPSAwLjU7XG4gIGV4cG9ydCBsZXQgaW5Qcm9wcyA9IHsgZHVyYXRpb246IDIwMCwgZWFzaW5nOiBxdWFkSW4gfTtcbiAgZXhwb3J0IGxldCBvdXRQcm9wcyA9IHsgZHVyYXRpb246IDIwMCwgZWFzaW5nOiBxdWFkT3V0IH07XG48L3NjcmlwdD5cblxuPGRpdlxuICBjbGFzcz1cImJnLWJsYWNrIGZpeGVkIHRvcC0wIGxlZnQtMCB6LTEwIHctZnVsbCBoLWZ1bGxcIlxuICBzdHlsZT1cIm9wYWNpdHk6IHtvcGFjaXR5fVwiXG4gIGluOmZhZGU9e2luUHJvcHN9XG4gIG91dDpmYWRlPXtvdXRQcm9wc31cbiAgb246Y2xpY2sgLz5cbiIsImltcG9ydCBzY3JpbSBmcm9tIFwiLi9TY3JpbS5zdmVsdGVcIjtcbmltcG9ydCBzcGFjZXIgZnJvbSBcIi4vU3BhY2VyLnN2ZWx0ZVwiO1xuXG5leHBvcnQgY29uc3QgU2NyaW0gPSBzY3JpbTtcbmV4cG9ydCBjb25zdCBTcGFjZXIgPSBzcGFjZXI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgU2NyaW0sXG4gIFNwYWNlclxufTtcbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcbiAgaW1wb3J0IEljb24gZnJvbSBcIi4uL0ljb25cIjtcbiAgaW1wb3J0IGNyZWF0ZVJpcHBsZSBmcm9tIFwiLi4vUmlwcGxlL3JpcHBsZS5qc1wiO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJmb2N1czpiZy1ncmF5LTUwIGRhcmstZm9jdXM6YmctZ3JheS03MDAgaG92ZXI6YmctZ3JheS10cmFuc0RhcmsgcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuIGR1cmF0aW9uLTEwMCBwLTQgY3Vyc29yLXBvaW50ZXIgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtZ3JheS0xMDAgZmxleCBpdGVtcy1jZW50ZXIgei0xMFwiO1xuICBjb25zdCBzZWxlY3RlZENsYXNzZXNEZWZhdWx0ID0gXCJiZy1ncmF5LTIwMCBkYXJrOmJnLXByaW1hcnktdHJhbnNMaWdodFwiO1xuICBjb25zdCBzdWJoZWFkaW5nQ2xhc3Nlc0RlZmF1bHQgPSBcInRleHQtZ3JheS02MDAgcC0wIHRleHQtc21cIjtcblxuICBleHBvcnQgbGV0IGljb24gPSBcIlwiO1xuICBleHBvcnQgbGV0IGlkID0gXCJcIjtcbiAgZXhwb3J0IGxldCB2YWx1ZSA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdGV4dCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgc3ViaGVhZGluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkZW5zZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNlbGVjdGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGFiaW5kZXggPSBudWxsO1xuICBleHBvcnQgbGV0IHNlbGVjdGVkQ2xhc3NlcyA9IHNlbGVjdGVkQ2xhc3Nlc0RlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgc3ViaGVhZGluZ0NsYXNzZXMgPSBzdWJoZWFkaW5nQ2xhc3Nlc0RlZmF1bHQ7XG5cblxuXG5cbiAgZXhwb3J0IGxldCB0byA9IFwiXCI7XG4gIGV4cG9ydCBjb25zdCBpdGVtID0gbnVsbDtcbiAgZXhwb3J0IGNvbnN0IGl0ZW1zID0gW107XG4gIGV4cG9ydCBjb25zdCBsZXZlbCA9IG51bGw7XG5cbiAgY29uc3QgcmlwcGxlID0gY3JlYXRlUmlwcGxlKCk7XG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlKCkge1xuICAgIGlmIChkaXNhYmxlZCkgcmV0dXJuO1xuICAgIHZhbHVlID0gaWQ7XG4gICAgZGlzcGF0Y2goJ2NoYW5nZScsIGlkLCB0byk7XG4gIH1cblxuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoc2VsZWN0ZWRDbGFzc2VzLCBzZWxlY3RlZCwgc2VsZWN0ZWRDbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKFwicHktMlwiLCBkZW5zZSlcbiAgICAuYWRkKFwidGV4dC1ncmF5LTYwMFwiLCBkaXNhYmxlZClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuPC9zY3JpcHQ+XG5cbjxsaVxuICB1c2U6cmlwcGxlXG4gIGNsYXNzPXtjfVxuICB7dGFiaW5kZXh9XG4gIG9uOmtleXByZXNzPXtjaGFuZ2V9XG4gIG9uOmNsaWNrPXtjaGFuZ2V9XG4gIG9uOmNsaWNrPlxuICB7I2lmIGljb259XG4gICAgPEljb25cbiAgICAgIGNsYXNzPVwicHItNlwiXG4gICAgICBzbWFsbD17ZGVuc2V9XG4gICAgPlxuICAgICAge2ljb259XG4gICAgPC9JY29uPlxuICB7L2lmfVxuXG4gIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29sIHAtMFwiPlxuICAgIDxkaXYgY2xhc3M9eyQkcHJvcHMuY2xhc3N9PlxuICAgICAgPHNsb3Q+e3RleHR9PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIHsjaWYgc3ViaGVhZGluZ31cbiAgICAgIDxkaXYgY2xhc3M9e3N1YmhlYWRpbmdDbGFzc2VzfT57c3ViaGVhZGluZ308L2Rpdj5cbiAgICB7L2lmfVxuICA8L2Rpdj5cbjwvbGk+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBDbGFzc0J1aWxkZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuXG4gIGltcG9ydCBMaXN0SXRlbSBmcm9tIFwiLi9MaXN0SXRlbS5zdmVsdGVcIjtcblxuICBleHBvcnQgbGV0IGl0ZW1zID0gW107XG4gIGV4cG9ydCBsZXQgdmFsdWUgPSBcIlwiO1xuICBleHBvcnQgbGV0IGRlbnNlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2VsZWN0ID0gZmFsc2U7XG5cbiAgZXhwb3J0IGNvbnN0IGxldmVsID0gbnVsbDtcbiAgZXhwb3J0IGNvbnN0IHRleHQgPSBcIlwiO1xuICBleHBvcnQgY29uc3QgaXRlbSA9IHt9O1xuICBleHBvcnQgY29uc3QgdG8gPSBudWxsO1xuICBleHBvcnQgY29uc3Qgc2VsZWN0ZWRDbGFzc2VzID0gaSA9PiBpO1xuICBleHBvcnQgY29uc3QgaXRlbUNsYXNzZXMgPSBpID0+IGk7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcInB5LTIgcm91bmRlZFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG4gIGZ1bmN0aW9uIGlkKGkpIHtcbiAgICBpZiAoaS5pZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS5pZDtcbiAgICBpZiAoaS52YWx1ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS52YWx1ZTtcbiAgICBpZiAoaS50byAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS50bztcbiAgICBpZiAoaS50ZXh0ICE9PSB1bmRlZmluZWQpIHJldHVybiBpLnRleHQ7XG4gICAgcmV0dXJuIGk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUZXh0KGkpIHtcbiAgICBpZiAoaS50ZXh0ICE9PSB1bmRlZmluZWQpIHJldHVybiBpLnRleHQ7XG4gICAgaWYgKGkudmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkudmFsdWU7XG4gICAgcmV0dXJuIGk7XG4gIH1cblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoJCRwcm9wcy5jbGFzcyk7XG5cbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKGNsYXNzZXMsIHRydWUsIGNsYXNzZXNEZWZhdWx0KVxuICAgIC5hZGQoJCRwcm9wcy5jbGFzcylcbiAgICAuZ2V0KCk7XG48L3NjcmlwdD5cblxuPHVsIGNsYXNzPXtjfSBjbGFzczpyb3VuZGVkLXQtbm9uZT17c2VsZWN0fT5cbiAgeyNlYWNoIGl0ZW1zIGFzIGl0ZW0sIGl9XG4gICAgeyNpZiBpdGVtLnRvICE9PSB1bmRlZmluZWR9XG4gICAgICA8c2xvdCBuYW1lPVwiaXRlbVwiIHtpdGVtfSB7ZGVuc2V9IHt2YWx1ZX0+XG4gICAgICAgIDxhIHRhYmluZGV4PXtpICsgMX0gaHJlZj17aXRlbS50b30+XG4gICAgICAgICAgPExpc3RJdGVtIGJpbmQ6dmFsdWUgey4uLml0ZW19IGlkPXtpZChpdGVtKX0ge2RlbnNlfSBvbjpjaGFuZ2U+XG4gICAgICAgICAgICB7aXRlbS50ZXh0fVxuICAgICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvc2xvdD5cbiAgICB7OmVsc2V9XG4gICAgICA8c2xvdCBuYW1lPVwiaXRlbVwiIHtpdGVtfSB7ZGVuc2V9IHt2YWx1ZX0+XG4gICAgICAgIDxMaXN0SXRlbVxuICAgICAgICAgIGJpbmQ6dmFsdWVcbiAgICAgICAgICB7c2VsZWN0ZWRDbGFzc2VzfVxuICAgICAgICAgIHtpdGVtQ2xhc3Nlc31cbiAgICAgICAgICB7Li4uaXRlbX1cbiAgICAgICAgICB0YWJpbmRleD17aSArIDF9XG4gICAgICAgICAgaWQ9e2lkKGl0ZW0pfVxuICAgICAgICAgIHNlbGVjdGVkPXt2YWx1ZSA9PT0gaWQoaXRlbSl9XG4gICAgICAgICAge2RlbnNlfVxuICAgICAgICAgIG9uOmNoYW5nZVxuICAgICAgICAgIG9uOmNsaWNrPlxuICAgICAgICAgIHtnZXRUZXh0KGl0ZW0pfVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgPC9zbG90PlxuICAgIHsvaWZ9XG4gIHsvZWFjaH1cbjwvdWw+XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gXCJzdmVsdGUvc3RvcmVcIjtcbmltcG9ydCB7IG9uRGVzdHJveSB9IGZyb20gXCJzdmVsdGVcIjtcblxuZnVuY3Rpb24gZGVmYXVsdENhbGMod2lkdGgpIHtcbiAgaWYgKHdpZHRoID4gMTI3OSkge1xuICAgIHJldHVybiBcInhsXCI7XG4gIH1cbiAgaWYgKHdpZHRoID4gMTAyMykge1xuICAgIHJldHVybiBcImxnXCI7XG4gIH1cbiAgaWYgKHdpZHRoID4gNzY3KSB7XG4gICAgcmV0dXJuIFwibWRcIjtcbiAgfVxuICByZXR1cm4gXCJzbVwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBicmVha3BvaW50KGNhbGNCcmVha3BvaW50ID0gZGVmYXVsdENhbGMpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiB3cml0YWJsZShcInNtXCIpO1xuXG4gIGNvbnN0IHN0b3JlID0gd3JpdGFibGUoY2FsY0JyZWFrcG9pbnQod2luZG93LmlubmVyV2lkdGgpKTtcblxuICBjb25zdCBvblJlc2l6ZSA9ICh7IHRhcmdldCB9KSA9PiBzdG9yZS5zZXQoY2FsY0JyZWFrcG9pbnQodGFyZ2V0LmlubmVyV2lkdGgpKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSk7XG4gIG9uRGVzdHJveSgoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSkpO1xuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBzdG9yZS5zdWJzY3JpYmVcbiAgfTtcbn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGZseSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuICBpbXBvcnQgeyBxdWFkSW4gfSBmcm9tIFwic3ZlbHRlL2Vhc2luZ1wiO1xuICBpbXBvcnQgeyBTY3JpbSB9IGZyb20gXCIuLi9VdGlsXCI7XG4gIGltcG9ydCBicmVha3BvaW50cyBmcm9tIFwiLi4vLi4vYnJlYWtwb2ludHNcIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBicCA9IGJyZWFrcG9pbnRzKCk7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcImZpeGVkIHRvcC0wIG1kOm10LTE2IHctYXV0byBkcmF3ZXIgb3ZlcmZsb3ctaGlkZGVuIGgtZnVsbFwiO1xuICBjb25zdCBuYXZDbGFzc2VzRGVmYXVsdCA9IGBoLWZ1bGwgdy1mdWxsIGJnLXdoaXRlIGRhcms6YmctZ3JheS05MDAgZGFyazp0ZXh0LWdyYXktMjAwIGFic29sdXRlIGZsZXggdy1hdXRvIHotMjAgZHJhd2VyXG4gICAgcG9pbnRlci1ldmVudHMtYXV0byBvdmVyZmxvdy15LWF1dG9gO1xuXG4gIGV4cG9ydCBsZXQgcmlnaHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwZXJzaXN0ZW50ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZWxldmF0aW9uID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBzaG93ID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgbmF2Q2xhc3NlcyA9IG5hdkNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IGJvcmRlckNsYXNzZXMgPSBgYm9yZGVyLWdyYXktNjAwICR7cmlnaHQgPyBcImJvcmRlci1sXCIgOiBcImJvcmRlci1yXCJ9YDtcblxuXG5cblxuICBleHBvcnQgbGV0IHRyYW5zaXRpb25Qcm9wcyA9IHtcbiAgICBkdXJhdGlvbjogMjAwLFxuICAgIHg6IC0zMDAsXG4gICAgZWFzaW5nOiBxdWFkSW4sXG4gICAgb3BhY2l0eTogMSxcbiAgfTtcblxuICAkOiB0cmFuc2l0aW9uUHJvcHMueCA9IHJpZ2h0ID8gMzAwIDogLTMwMDtcblxuICAvLyBJcyB0aGUgZHJhd2VyIGRlbGliZXJhdGVseSBoaWRkZW4/IERvbid0IGxldCB0aGUgJGJwIGNoZWNrIG1ha2UgaXQgdmlzaWJsZSBpZiBzby5cbiAgbGV0IGhpZGRlbiA9ICFzaG93O1xuICAkOiBpZiAoIWhpZGRlbikgcGVyc2lzdGVudCA9IHNob3cgPSAkYnAgIT09IFwic21cIjtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuXG4gIGlmICgkYnAgPT09ICdzbScpIHNob3cgPSBmYWxzZTtcblxuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoY2xhc3NlcywgdHJ1ZSwgY2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZChib3JkZXJDbGFzc2VzLCAhZWxldmF0aW9uICYmIHBlcnNpc3RlbnQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5hZGQoXCJyaWdodC0wXCIsIHJpZ2h0KVxuICAgIC5hZGQoXCJsZWZ0LTBcIiwgIXJpZ2h0KVxuICAgIC5hZGQoXCJwb2ludGVyLWV2ZW50cy1ub25lXCIsIHBlcnNpc3RlbnQpXG4gICAgLmFkZChcInotNTBcIiwgIXBlcnNpc3RlbnQpXG4gICAgLmFkZChcImVsZXZhdGlvbi00XCIsIGVsZXZhdGlvbilcbiAgICAuYWRkKFwiei0yMFwiLCBwZXJzaXN0ZW50KVxuICAgIC5nZXQoKTtcblxuICBjb25zdCBuY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKG5hdkNsYXNzZXMsIG5hdkNsYXNzZXNEZWZhdWx0KTtcblxuICAkOiBuID0gbmNiXG4gICAgLmZsdXNoKClcbiAgICAuZ2V0KCk7XG5cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5kcmF3ZXIge1xuICAgIG1pbi13aWR0aDogMjUwcHg7XG4gIH1cblxuICBhc2lkZSB7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgfVxuPC9zdHlsZT5cblxueyNpZiBzaG93fVxuICA8YXNpZGVcbiAgICBjbGFzcz17Y31cbiAgICB0cmFuc2l0aW9uOmZseT17dHJhbnNpdGlvblByb3BzfVxuICA+XG4gICAgeyNpZiAhcGVyc2lzdGVudH1cbiAgICAgIDxTY3JpbSBvbjpjbGljaz17KCkgPT4gc2hvdyA9IGZhbHNlfSAvPlxuICAgIHsvaWZ9XG4gICAgPG5hdlxuICAgICAgcm9sZT1cIm5hdmlnYXRpb25cIlxuICAgICAgY2xhc3M9e259XG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cInctZnVsbFwiPlxuICAgICAgICA8c2xvdCAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9uYXY+XG4gIDwvYXNpZGU+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgc2NhbGUsIGZhZGUgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwidG9vbHRpcCB3aGl0ZXNwYWNlLW5vLXdyYXAgdGV4dC14cyBhYnNvbHV0ZSBtdC0yIGJnLWdyYXktNjAwIHRleHQtZ3JheS01MCByb3VuZGVkIG1kOnB4LTIgbWQ6cHktMiBweS00IHB4LTMgei0zMFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG5cbiAgZXhwb3J0IGxldCBzaG93ID0gZmFsc2U7XG5cbiAgZXhwb3J0IGxldCB0aW1lb3V0ID0gbnVsbDtcbiAgZXhwb3J0IGxldCBkZWxheUhpZGUgPSAxMDA7XG4gIGV4cG9ydCBsZXQgZGVsYXlTaG93ID0gMTAwO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuXG4gIGZ1bmN0aW9uIHNob3dUb29sdGlwKCkge1xuICAgIGlmIChzaG93KSByZXR1cm47XG5cbiAgICBzaG93ID0gdHJ1ZTtcblxuICAgIGlmICghdGltZW91dCkgcmV0dXJuO1xuXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2hvdyA9IGZhbHNlO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlkZVRvb2x0aXAoKSB7XG4gICAgaWYgKCFzaG93KSByZXR1cm47XG5cbiAgICBzaG93ID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgbGV0IHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgbGV0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG4gICAgICBsZXQgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gIH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4udG9vbHRpcCB7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xufVxuPC9zdHlsZT5cblxuPGRpdiBjbGFzcz1cInJlbGF0aXZlIGlubGluZS1ibG9ja1wiPlxuICA8ZGl2XG4gICAgb246bW91c2VlbnRlcj17ZGVib3VuY2Uoc2hvd1Rvb2x0aXAsIGRlbGF5U2hvdyl9XG4gICAgb246bW91c2VsZWF2ZT17ZGVib3VuY2UoaGlkZVRvb2x0aXAsIGRlbGF5SGlkZSl9XG4gICAgb246bW91c2VlbnRlclxuICAgIG9uOm1vdXNlbGVhdmVcbiAgICBvbjptb3VzZW92ZXJcbiAgICBvbjptb3VzZW91dFxuICA+XG4gICAgPHNsb3QgbmFtZT1cImFjdGl2YXRvclwiIC8+XG4gIDwvZGl2PlxuXG4gIHsjaWYgc2hvd31cbiAgICA8ZGl2XG4gICAgICBpbjpzY2FsZT17eyBkdXJhdGlvbjogMTUwIH19XG4gICAgICBvdXQ6c2NhbGU9e3sgZHVyYXRpb246IDE1MCwgZGVsYXk6IDEwMCB9fVxuICAgICAgY2xhc3M9e2N9XG4gICAgPlxuICAgICAgPHNsb3QgLz5cbiAgICA8L2Rpdj5cbiAgey9pZn1cbjwvZGl2PlxuIiwiZXhwb3J0IGNvbnN0IG5hdk1lbnUgPSBbXG4gIHsgdG86IFwiL2NvbXBvbmVudHMvanVtcFwiLCB0ZXh0OiBcIkFsbCB5b3UgbmVlZCBpcyAuLi5cIiB9LFxuXG4gIHsgdG86IFwiZnJvbnRlbmQvZnJvbnRlbmRcIiwgdGV4dDogXCJGcm9udGVuZFwiIH0sXG4gIHsgdG86IFwiaW5mcmVzdHJ1Y3R1cmUvc3JlXCIsIHRleHQ6IFwiU1JFXCIgfSxcbiAgeyB0bzogXCJiYWNrZW5kL3Bvc3RncmVzcWxcIiwgdGV4dDogXCJQb3N0Z3JlU1FMXCIgfSxcbiAgeyB0bzogXCJhcGkvYXBpXCIsIHRleHQ6IFwiQXBpXCIgfVxuXTtcblxuZXhwb3J0IGNvbnN0IHRvcE1lbnUgPSBbXG4gIHsgdG86IFwiL2NvbXBvbmVudHNcIiwgdGV4dDogXCJDb21wb25lbnRzXCIgfSxcbiAgeyB0bzogXCIvdHlwb2dyYXBoeVwiLCB0ZXh0OiBcIlR5cG9ncmFwaHlcIiB9LCBcbl07XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gXCJzdmVsdGUvc3RvcmVcIjtcblxuZXhwb3J0IGNvbnN0IHJpZ2h0ID0gd3JpdGFibGUoZmFsc2UpO1xuZXhwb3J0IGNvbnN0IHBlcnNpc3RlbnQgPSB3cml0YWJsZSh0cnVlKTtcbmV4cG9ydCBjb25zdCBlbGV2YXRpb24gPSB3cml0YWJsZShmYWxzZSk7XG5leHBvcnQgY29uc3Qgc2hvd05hdiA9IHdyaXRhYmxlKHRydWUpO1xuZXhwb3J0IGNvbnN0IGRhcmsgPSB3cml0YWJsZShmYWxzZSk7XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gXCJzdmVsdGUvc3RvcmVcIjtcblxuZXhwb3J0IGxldCBkYXJrTW9kZTtcblxuZnVuY3Rpb24gaXNEYXJrVGhlbWUoKSB7XG4gIGlmICghd2luZG93Lm1hdGNoTWVkaWEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpLm1hdGNoZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXJrKHZhbHVlID0gdHJ1ZSwgYm9keUNsYXNzZXMgPSBcIm1vZGUtZGFya1wiKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gd3JpdGFibGUodmFsdWUpO1xuXG4gIGlmICghZGFya01vZGUpIHtcbiAgICBkYXJrTW9kZSA9IHdyaXRhYmxlKHZhbHVlIHx8IGlzRGFya1RoZW1lKCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IGRhcmtNb2RlLnN1YnNjcmliZSxcbiAgICBzZXQ6IHYgPT4ge1xuICAgICAgYm9keUNsYXNzZXMuc3BsaXQoXCIgXCIpLmZvckVhY2goYyA9PiB7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRhcmtNb2RlLnNldCh2KTtcbiAgICB9XG4gIH07XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgQXBwQmFyIGZyb20gXCJjb21wb25lbnRzL0FwcEJhclwiO1xuICBpbXBvcnQgVGFicyBmcm9tIFwiY29tcG9uZW50cy9UYWJzXCI7XG4gIGltcG9ydCBCdXR0b24gZnJvbSBcImNvbXBvbmVudHMvQnV0dG9uXCI7XG4gIGltcG9ydCB7IFNwYWNlciB9IGZyb20gXCJjb21wb25lbnRzL1V0aWxcIjtcbiAgaW1wb3J0IExpc3QsIHsgTGlzdEl0ZW0gfSBmcm9tIFwiY29tcG9uZW50cy9MaXN0XCI7XG4gIGltcG9ydCBOYXZpZ2F0aW9uRHJhd2VyIGZyb20gXCJjb21wb25lbnRzL05hdmlnYXRpb25EcmF3ZXJcIjtcbiAgaW1wb3J0IFByb2dyZXNzTGluZWFyIGZyb20gXCJjb21wb25lbnRzL1Byb2dyZXNzTGluZWFyXCI7XG4gIGltcG9ydCBUb29sdGlwIGZyb20gXCJjb21wb25lbnRzL1Rvb2x0aXBcIjtcbiAgaW1wb3J0IHsgc3RvcmVzIH0gZnJvbSBcIkBzYXBwZXIvYXBwXCI7XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCB7IGZhZGUgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgbmF2TWVudSwgdG9wTWVudSB9IGZyb20gXCIuLi91dGlscy9tZW51LmpzXCI7XG4gIGltcG9ydCB7IHJpZ2h0LCBlbGV2YXRpb24sIHBlcnNpc3RlbnQsIHNob3dOYXYgfSBmcm9tIFwic3RvcmVzLmpzXCI7XG4gIGltcG9ydCBkYXJrIGZyb20gXCIuLi9kYXJrLmpzXCI7XG5cbiAgY29uc3QgeyBwcmVsb2FkaW5nLCBwYWdlIH0gPSBzdG9yZXMoKTtcblxuICBsZXQgc2VsZWN0ZWQgPSBcIlwiO1xuXG4gIGNvbnN0IGRhcmtNb2RlID0gZGFyaygpO1xuXG4gICQ6IHBhdGggPSAkcGFnZS5wYXRoO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgLmdpdGh1YiB7XG4gICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dDtcbiAgfVxuICAuZ2l0aHViOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG48L3N0eWxlPlxuXG48c3ZlbHRlOmhlYWQ+XG4gIDx0aXRsZT5Sb2NrIEJhbmQ8L3RpdGxlPlxuICA8bWV0YSBuYW1lPVwiZGVzY3JpcHRpb25cIiBjb250ZW50PVwiQnJlYWtpbmcgU291bmRzXCIgLz5cbjwvc3ZlbHRlOmhlYWQ+XG5cbnsjaWYgJHByZWxvYWRpbmd9XG4gIDxQcm9ncmVzc0xpbmVhciBhcHAgLz5cbnsvaWZ9XG5cbnsjZWFjaCBuYXZNZW51IGFzIGxpbmt9XG4gIDxhIGhyZWY9e2xpbmsudG99IGNsYXNzPVwiaGlkZGVuXCI+e2xpbmsudGV4dH08L2E+XG57L2VhY2h9XG5cbjxBcHBCYXIgY2xhc3M9e2kgPT4gaS5yZXBsYWNlKCdwcmltYXJ5LTMwMCcsICdkYXJrLTYwMCcpfT5cbiAgPGEgaHJlZj1cIi5cIiBjbGFzcz1cInB4LTIgbWQ6cHgtOCBmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgIDxpbWcgc3JjPVwiL2xvZ28uc3ZnXCIgYWx0PVwiUm9jayBCYW5kIGxvZ29cIiB3aWR0aD1cIjU0XCIgLz5cbiAgICA8aDYgY2xhc3M9XCJwbC0zIHRleHQtd2hpdGUgdHJhY2tpbmctd2lkZXN0IGZvbnQtdGhpbiB0ZXh0LWxnXCI+Um9jayBCYW5kPC9oNj5cbiAgPC9hPlxuICA8U3BhY2VyIC8+XG4gIDxUYWJzIG5hdmlnYXRpb24gaXRlbXM9e3RvcE1lbnV9IGJpbmQ6c2VsZWN0ZWQ9e3BhdGh9IC8+XG5cbiAgPFRvb2x0aXA+XG4gICAgPHNwYW4gc2xvdD1cImFjdGl2YXRvclwiPlxuICAgICAgPEJ1dHRvblxuICAgICAgICBiaW5kOnZhbHVlPXskZGFya01vZGV9XG4gICAgICAgIGljb249XCJ3Yl9zdW5ueVwiXG4gICAgICAgIHNtYWxsXG4gICAgICAgIGZsYXRcbiAgICAgICAgcmVtb3ZlPVwicC0xIGgtNCB3LTRcIlxuICAgICAgICBpY29uQ2xhc3M9XCJ0ZXh0LXdoaXRlXCJcbiAgICAgICAgdGV4dCAvPlxuICAgIDwvc3Bhbj5cbiAgICB7JGRhcmtNb2RlID8gJ0Rpc2FibGUnIDogJ0VuYWJsZSd9IGRhcmsgbW9kZVxuICA8L1Rvb2x0aXA+XG4gIDxkaXYgY2xhc3M9XCJtZDpoaWRkZW5cIj5cbiAgICA8QnV0dG9uXG4gICAgICBpY29uPVwibWVudVwiXG4gICAgICBzbWFsbFxuICAgICAgZmxhdFxuICAgICAgcmVtb3ZlPVwicC0xIGgtNCB3LTRcIlxuICAgICAgaWNvbkNsYXNzPVwidGV4dC13aGl0ZVwiXG4gICAgICB0ZXh0XG4gICAgICBvbjpjbGljaz17KCkgPT4gc2hvd05hdi5zZXQoISRzaG93TmF2KX0gLz5cbiAgPC9kaXY+XG4gIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcmVzb3VyY2VsZGcvd2FsYWRvY3NcIiBjbGFzcz1cInB4LTQgZ2l0aHViXCI+XG4gICAgPGltZyBzcmM9XCIvaW5zdGFncmFtLnN2Z1wiIGFsdD1cIkdpdGh1YiBTbWVsdGVcIiB3aWR0aD1cIjQwXCIgaGVpZ2h0PVwiNDBcIiAvPlxuICA8L2E+XG4gIFxuPC9BcHBCYXI+XG5cbjxtYWluXG4gIGNsYXNzPVwicmVsYXRpdmUgcC04IGxnOm1heC13LTN4bCBteC1hdXRvIG1iLTEwIG10LTI0IG1kOm1sLTY0IG1kOnBsLTE2XG4gIG1kOm1heC13LW1kIG1kOnB4LTNcIlxuICB0cmFuc2l0aW9uOmZhZGU9e3sgZHVyYXRpb246IDMwMCB9fT5cbiAgPE5hdmlnYXRpb25EcmF3ZXJcbiAgICBiaW5kOnNob3c9eyRzaG93TmF2fVxuICAgIHJpZ2h0PXskcmlnaHR9XG4gICAgcGVyc2lzdGVudD17JHBlcnNpc3RlbnR9XG4gICAgZWxldmF0aW9uPXskZWxldmF0aW9ufT5cbiAgICA8aDZcbiAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICBEZXZlbG9wZXIgR2V0dGluZyBTdGFydGVkISFcbiAgICA8L2g2PlxuICAgIDxMaXN0IGl0ZW1zPXtuYXZNZW51fT5cbiAgICAgIDxzcGFuIHNsb3Q9XCJpdGVtXCIgbGV0Oml0ZW0gY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICB7I2lmIGl0ZW0udG8gPT09ICdpbmZyZXN0cnVjdHVyZS9zcmUnfVxuICAgICAgICAgIDxociBjbGFzcz1cIm10LTRcIiAvPlxuICAgICAgICAgIDxoNlxuICAgICAgICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICAgICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgICAgICAgIEluZnJlc3RydWN0dXJlXG4gICAgICAgICAgPC9oNj5cbiAgICAgICAgey9pZn1cbiAgICAgICAgeyNpZiBpdGVtLnRvID09PSAnYXBpL2FwaSd9XG4gICAgICAgICAgPGhyIGNsYXNzPVwibXQtNFwiIC8+XG4gICAgICAgICAgPGg2XG4gICAgICAgICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgICAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgICAgICAgQXBpXG4gICAgICAgICAgPC9oNj5cbiAgICAgICAgey9pZn1cbiAgICAgICAgeyNpZiBpdGVtLnRvID09PSAnYmFja2VuZC9wb3N0Z3Jlc3FsJ31cbiAgICAgICAgICA8aHIgY2xhc3M9XCJtdC00XCIgLz5cbiAgICAgICAgICA8aDZcbiAgICAgICAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICBCYWNrZW5kXG4gICAgICAgICAgPC9oNj5cbiAgICAgICAgey9pZn1cbiAgICAgICAgeyNpZiBpdGVtLnRvID09PSAnZnJvbnRlbmQvZnJvbnRlbmQnfVxuICAgICAgICAgIDxociBjbGFzcz1cIm10LTRcIiAvPlxuICAgICAgICAgIDxoNlxuICAgICAgICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICAgICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgICAgICAgIEZyb250ZW5kXG4gICAgICAgICAgPC9oNj5cbiAgICAgICAgey9pZn1cblxuICAgICAgICA8YSBocmVmPXtpdGVtLnRvfT5cbiAgICAgICAgICA8TGlzdEl0ZW1cbiAgICAgICAgICAgIGlkPXtpdGVtLmlkfVxuICAgICAgICAgICAgdGV4dD17aXRlbS50ZXh0fVxuICAgICAgICAgICAgdG89e2l0ZW0udG99XG4gICAgICAgICAgICBzZWxlY3RlZD17cGF0aC5pbmNsdWRlcyhpdGVtLnRvKX1cbiAgICAgICAgICAgIGRlbnNlXG4gICAgICAgICAgICBzZWxlY3RlZENsYXNzZXM9XCJiZy1wcmltYXJ5LXRyYW5zRGFyayBkYXJrOmJnLXByaW1hcnktdHJhbnNMaWdodFxuICAgICAgICAgICAgaG92ZXI6YmctcHJpbWFyeS10cmFuc0RhcmsgZGFyay1ob3ZlcjpiZy1wcmltYXJ5LXRyYW5zTGlnaHRcIiAvPlxuICAgICAgICA8L2E+XG4gICAgICA8L3NwYW4+XG4gICAgPC9MaXN0PlxuXG4gICAgPGhyIC8+XG4gIDwvTmF2aWdhdGlvbkRyYXdlcj5cblxuICA8c2xvdCAvPlxuPC9tYWluPlxuIiwiPHNjcmlwdD5cbiAgZXhwb3J0IGxldCBzdGF0dXM7XG4gIGV4cG9ydCBsZXQgZXJyb3I7XG5cbiAgY29uc3QgZGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIjtcbjwvc2NyaXB0PlxuXG48c3ZlbHRlOmhlYWQ+XG4gIDx0aXRsZT57c3RhdHVzfTwvdGl0bGU+XG48L3N2ZWx0ZTpoZWFkPlxuXG48aDE+e3N0YXR1c308L2gxPlxuXG48cD57ZXJyb3IubWVzc2FnZX08L3A+XG5cbnsjaWYgZGV2ICYmIGVycm9yLnN0YWNrfVxuICA8cHJlPntlcnJvci5zdGFja308L3ByZT5cbnsvaWZ9XG4iLCI8IS0tIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYnkgU2FwcGVyIOKAlCBkbyBub3QgZWRpdCBpdCEgLS0+XG48c2NyaXB0PlxuXHRpbXBvcnQgeyBzZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IHsgQ09OVEVYVF9LRVkgfSBmcm9tICcuL3NoYXJlZCc7XG5cdGltcG9ydCBMYXlvdXQgZnJvbSAnLi4vLi4vLi4vcm91dGVzL19sYXlvdXQuc3ZlbHRlJztcblx0aW1wb3J0IEVycm9yIGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlJztcblxuXHRleHBvcnQgbGV0IHN0b3Jlcztcblx0ZXhwb3J0IGxldCBlcnJvcjtcblx0ZXhwb3J0IGxldCBzdGF0dXM7XG5cdGV4cG9ydCBsZXQgc2VnbWVudHM7XG5cdGV4cG9ydCBsZXQgbGV2ZWwwO1xuXHRleHBvcnQgbGV0IGxldmVsMSA9IG51bGw7XG5cdGV4cG9ydCBsZXQgbGV2ZWwyID0gbnVsbDtcblxuXHRzZXRDb250ZXh0KENPTlRFWFRfS0VZLCBzdG9yZXMpO1xuPC9zY3JpcHQ+XG5cbjxMYXlvdXQgc2VnbWVudD1cIntzZWdtZW50c1swXX1cIiB7Li4ubGV2ZWwwLnByb3BzfT5cblx0eyNpZiBlcnJvcn1cblx0XHQ8RXJyb3Ige2Vycm9yfSB7c3RhdHVzfS8+XG5cdHs6ZWxzZX1cblx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMS5jb21wb25lbnR9XCIgc2VnbWVudD1cIntzZWdtZW50c1sxXX1cIiB7Li4ubGV2ZWwxLnByb3BzfT5cblx0XHRcdHsjaWYgbGV2ZWwyfVxuXHRcdFx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMi5jb21wb25lbnR9XCIgey4uLmxldmVsMi5wcm9wc30vPlxuXHRcdFx0ey9pZn1cblx0XHQ8L3N2ZWx0ZTpjb21wb25lbnQ+XG5cdHsvaWZ9XG48L0xheW91dD4iLCIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgeyBkZWZhdWx0IGFzIFJvb3QgfSBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGUnO1xuZXhwb3J0IHsgcHJlbG9hZCBhcyByb290X3ByZWxvYWQgfSBmcm9tICcuL3NoYXJlZCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGUnO1xuXG5leHBvcnQgY29uc3QgaWdub3JlID0gW107XG5cbmV4cG9ydCBjb25zdCBjb21wb25lbnRzID0gW1xuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9pbmRleC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjppbmRleC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2luZnJlc3RydWN0dXJlL3NyZS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjppbmZyZXN0cnVjdHVyZS9zcmUuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9icmVha3BvaW50cy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpicmVha3BvaW50cy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvX2xheW91dC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL19sYXlvdXQuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2luZGV4LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvaW5kZXguc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL3Byb2dyZXNzLWluZGljYXRvcnMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9wcm9ncmVzcy1pbmRpY2F0b3JzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLWRyYXdlcnMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9uYXZpZ2F0aW9uLWRyYXdlcnMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL3NlbGVjdGlvbi1jb250cm9scy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL3NlbGVjdGlvbi1jb250cm9scy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvZGF0ZS1waWNrZXJzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvZGF0ZS1waWNrZXJzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9kYXRhLXRhYmxlcy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL2RhdGEtdGFibGVzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy90ZXh0LWZpZWxkcy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL3RleHQtZmllbGRzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9zbmFja2JhcnMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9zbmFja2JhcnMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL3RyZWV2aWV3cy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL3RyZWV2aWV3cy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvdG9vbHRpcHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy90b29sdGlwcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvYnV0dG9ucy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL2J1dHRvbnMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2RpYWxvZ3Muc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9kaWFsb2dzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9zZWxlY3RzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvc2VsZWN0cy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvc2xpZGVycy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL3NsaWRlcnMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2ltYWdlcy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL2ltYWdlcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvY2FyZHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9jYXJkcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvY2hpcHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9jaGlwcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvbGlzdHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9saXN0cy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvbWVudXMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9tZW51cy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvanVtcC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL2p1bXAuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL3RhYnMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy90YWJzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvdHlwb2dyYXBoeS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjp0eXBvZ3JhcGh5LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvZGFyay1tb2RlLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmRhcmstbW9kZS5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2Zyb250ZW5kL2Zyb250ZW5kLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmZyb250ZW5kL2Zyb250ZW5kLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYmFja2VuZC9wb3N0Z3Jlc3FsLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmJhY2tlbmQvcG9zdGdyZXNxbC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbG9yLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbG9yLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYXBpL2FwaS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjphcGkvYXBpLnN2ZWx0ZV9fXCJcblx0fVxuXTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlcyA9IFtcblx0e1xuXHRcdC8vIGluZGV4LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvJC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMCB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBpbmZyZXN0cnVjdHVyZS9zcmUuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9pbmZyZXN0cnVjdHVyZVxcL3NyZVxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0bnVsbCxcblx0XHRcdHsgaTogMSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBicmVha3BvaW50cy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2JyZWFrcG9pbnRzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDIgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9pbmRleC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiA0IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvcHJvZ3Jlc3MtaW5kaWNhdG9ycy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9wcm9ncmVzcy1pbmRpY2F0b3JzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogNSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL25hdmlnYXRpb24tZHJhd2Vycy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9uYXZpZ2F0aW9uLWRyYXdlcnNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiA2IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvc2VsZWN0aW9uLWNvbnRyb2xzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL3NlbGVjdGlvbi1jb250cm9sc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDcgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9kYXRlLXBpY2tlcnMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvZGF0ZS1waWNrZXJzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogOCB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL2RhdGEtdGFibGVzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL2RhdGEtdGFibGVzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogOSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL3RleHQtZmllbGRzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL3RleHQtZmllbGRzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9zbmFja2JhcnMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvc25hY2tiYXJzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTEgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy90cmVldmlld3Muc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvdHJlZXZpZXdzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTIgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy90b29sdGlwcy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC90b29sdGlwc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDEzIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvYnV0dG9ucy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9idXR0b25zXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9kaWFsb2dzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL2RpYWxvZ3NcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAxNSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL3NlbGVjdHMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvc2VsZWN0c1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDE2IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvc2xpZGVycy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9zbGlkZXJzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTcgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9pbWFnZXMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvaW1hZ2VzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTggfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9jYXJkcy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9jYXJkc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDE5IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvY2hpcHMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvY2hpcHNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAyMCB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL2xpc3RzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL2xpc3RzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMjEgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9tZW51cy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9tZW51c1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDIyIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvanVtcC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9qdW1wXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMjMgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy90YWJzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL3RhYnNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAyNCB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyB0eXBvZ3JhcGh5LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvdHlwb2dyYXBoeVxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAyNSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBkYXJrLW1vZGUuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9kYXJrLW1vZGVcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMjYgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gZnJvbnRlbmQvZnJvbnRlbmQuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9mcm9udGVuZFxcL2Zyb250ZW5kXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHRudWxsLFxuXHRcdFx0eyBpOiAyNyB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBiYWNrZW5kL3Bvc3RncmVzcWwuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9iYWNrZW5kXFwvcG9zdGdyZXNxbFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0bnVsbCxcblx0XHRcdHsgaTogMjggfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29sb3Iuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb2xvclxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAyOSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBhcGkvYXBpLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYXBpXFwvYXBpXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHRudWxsLFxuXHRcdFx0eyBpOiAzMCB9XG5cdFx0XVxuXHR9XG5dO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0aW1wb3J0KFwiL2hvbWUvbHVjYXMvcm9ja2JhbmQvbm9kZV9tb2R1bGVzL3NhcHBlci9zYXBwZXItZGV2LWNsaWVudC5qc1wiKS50aGVuKGNsaWVudCA9PiB7XG5cdFx0Y2xpZW50LmNvbm5lY3QoMTAwMDApO1xuXHR9KTtcbn0iLCJpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbmltcG9ydCB7IENPTlRFWFRfS0VZIH0gZnJvbSAnLi9pbnRlcm5hbC9zaGFyZWQnO1xuaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuaW1wb3J0IEFwcCBmcm9tICcuL2ludGVybmFsL0FwcC5zdmVsdGUnO1xuaW1wb3J0IHsgaWdub3JlLCByb3V0ZXMsIHJvb3RfcHJlbG9hZCwgY29tcG9uZW50cywgRXJyb3JDb21wb25lbnQgfSBmcm9tICcuL2ludGVybmFsL21hbmlmZXN0LWNsaWVudCc7XG5cbmZ1bmN0aW9uIGdvdG8oaHJlZiwgb3B0cyA9IHsgcmVwbGFjZVN0YXRlOiBmYWxzZSB9KSB7XG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQobmV3IFVSTChocmVmLCBkb2N1bWVudC5iYXNlVVJJKSk7XG5cblx0aWYgKHRhcmdldCkge1xuXHRcdF9oaXN0b3J5W29wdHMucmVwbGFjZVN0YXRlID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oeyBpZDogY2lkIH0sICcnLCBocmVmKTtcblx0XHRyZXR1cm4gbmF2aWdhdGUodGFyZ2V0LCBudWxsKS50aGVuKCgpID0+IHt9KTtcblx0fVxuXG5cdGxvY2F0aW9uLmhyZWYgPSBocmVmO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZiA9PiB7fSk7IC8vIG5ldmVyIHJlc29sdmVzXG59XG5cbmNvbnN0IGluaXRpYWxfZGF0YSA9IHR5cGVvZiBfX1NBUFBFUl9fICE9PSAndW5kZWZpbmVkJyAmJiBfX1NBUFBFUl9fO1xuXG5sZXQgcmVhZHkgPSBmYWxzZTtcbmxldCByb290X2NvbXBvbmVudDtcbmxldCBjdXJyZW50X3Rva2VuO1xubGV0IHJvb3RfcHJlbG9hZGVkO1xubGV0IGN1cnJlbnRfYnJhbmNoID0gW107XG5sZXQgY3VycmVudF9xdWVyeSA9ICd7fSc7XG5cbmNvbnN0IHN0b3JlcyA9IHtcblx0cGFnZTogd3JpdGFibGUoe30pLFxuXHRwcmVsb2FkaW5nOiB3cml0YWJsZShudWxsKSxcblx0c2Vzc2lvbjogd3JpdGFibGUoaW5pdGlhbF9kYXRhICYmIGluaXRpYWxfZGF0YS5zZXNzaW9uKVxufTtcblxubGV0ICRzZXNzaW9uO1xubGV0IHNlc3Npb25fZGlydHk7XG5cbnN0b3Jlcy5zZXNzaW9uLnN1YnNjcmliZShhc3luYyB2YWx1ZSA9PiB7XG5cdCRzZXNzaW9uID0gdmFsdWU7XG5cblx0aWYgKCFyZWFkeSkgcmV0dXJuO1xuXHRzZXNzaW9uX2RpcnR5ID0gdHJ1ZTtcblxuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwobG9jYXRpb24uaHJlZikpO1xuXG5cdGNvbnN0IHRva2VuID0gY3VycmVudF90b2tlbiA9IHt9O1xuXHRjb25zdCB7IHJlZGlyZWN0LCBwcm9wcywgYnJhbmNoIH0gPSBhd2FpdCBoeWRyYXRlX3RhcmdldCh0YXJnZXQpO1xuXHRpZiAodG9rZW4gIT09IGN1cnJlbnRfdG9rZW4pIHJldHVybjsgLy8gYSBzZWNvbmRhcnkgbmF2aWdhdGlvbiBoYXBwZW5lZCB3aGlsZSB3ZSB3ZXJlIGxvYWRpbmdcblxuXHRhd2FpdCByZW5kZXIocmVkaXJlY3QsIGJyYW5jaCwgcHJvcHMsIHRhcmdldC5wYWdlKTtcbn0pO1xuXG5sZXQgcHJlZmV0Y2hpbmdcblxuXG4gPSBudWxsO1xuZnVuY3Rpb24gc2V0X3ByZWZldGNoaW5nKGhyZWYsIHByb21pc2UpIHtcblx0cHJlZmV0Y2hpbmcgPSB7IGhyZWYsIHByb21pc2UgfTtcbn1cblxubGV0IHRhcmdldDtcbmZ1bmN0aW9uIHNldF90YXJnZXQoZWxlbWVudCkge1xuXHR0YXJnZXQgPSBlbGVtZW50O1xufVxuXG5sZXQgdWlkID0gMTtcbmZ1bmN0aW9uIHNldF91aWQobikge1xuXHR1aWQgPSBuO1xufVxuXG5sZXQgY2lkO1xuZnVuY3Rpb24gc2V0X2NpZChuKSB7XG5cdGNpZCA9IG47XG59XG5cbmNvbnN0IF9oaXN0b3J5ID0gdHlwZW9mIGhpc3RvcnkgIT09ICd1bmRlZmluZWQnID8gaGlzdG9yeSA6IHtcblx0cHVzaFN0YXRlOiAoc3RhdGUsIHRpdGxlLCBocmVmKSA9PiB7fSxcblx0cmVwbGFjZVN0YXRlOiAoc3RhdGUsIHRpdGxlLCBocmVmKSA9PiB7fSxcblx0c2Nyb2xsUmVzdG9yYXRpb246ICcnXG59O1xuXG5jb25zdCBzY3JvbGxfaGlzdG9yeSA9IHt9O1xuXG5mdW5jdGlvbiBleHRyYWN0X3F1ZXJ5KHNlYXJjaCkge1xuXHRjb25zdCBxdWVyeSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuXHRcdHNlYXJjaC5zbGljZSgxKS5zcGxpdCgnJicpLmZvckVhY2goc2VhcmNoUGFyYW0gPT4ge1xuXHRcdFx0bGV0IFssIGtleSwgdmFsdWUgPSAnJ10gPSAvKFtePV0qKSg/Oj0oLiopKT8vLmV4ZWMoZGVjb2RlVVJJQ29tcG9uZW50KHNlYXJjaFBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpKSk7XG5cdFx0XHRpZiAodHlwZW9mIHF1ZXJ5W2tleV0gPT09ICdzdHJpbmcnKSBxdWVyeVtrZXldID0gW3F1ZXJ5W2tleV1dO1xuXHRcdFx0aWYgKHR5cGVvZiBxdWVyeVtrZXldID09PSAnb2JqZWN0JykgKHF1ZXJ5W2tleV0gKS5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgcXVlcnlba2V5XSA9IHZhbHVlO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0X3RhcmdldCh1cmwpIHtcblx0aWYgKHVybC5vcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbikgcmV0dXJuIG51bGw7XG5cdGlmICghdXJsLnBhdGhuYW1lLnN0YXJ0c1dpdGgoaW5pdGlhbF9kYXRhLmJhc2VVcmwpKSByZXR1cm4gbnVsbDtcblxuXHRsZXQgcGF0aCA9IHVybC5wYXRobmFtZS5zbGljZShpbml0aWFsX2RhdGEuYmFzZVVybC5sZW5ndGgpO1xuXG5cdGlmIChwYXRoID09PSAnJykge1xuXHRcdHBhdGggPSAnLyc7XG5cdH1cblxuXHQvLyBhdm9pZCBhY2NpZGVudGFsIGNsYXNoZXMgYmV0d2VlbiBzZXJ2ZXIgcm91dGVzIGFuZCBwYWdlIHJvdXRlc1xuXHRpZiAoaWdub3JlLnNvbWUocGF0dGVybiA9PiBwYXR0ZXJuLnRlc3QocGF0aCkpKSByZXR1cm47XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCByb3V0ZXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRjb25zdCByb3V0ZSA9IHJvdXRlc1tpXTtcblxuXHRcdGNvbnN0IG1hdGNoID0gcm91dGUucGF0dGVybi5leGVjKHBhdGgpO1xuXG5cdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IGV4dHJhY3RfcXVlcnkodXJsLnNlYXJjaCk7XG5cdFx0XHRjb25zdCBwYXJ0ID0gcm91dGUucGFydHNbcm91dGUucGFydHMubGVuZ3RoIC0gMV07XG5cdFx0XHRjb25zdCBwYXJhbXMgPSBwYXJ0LnBhcmFtcyA/IHBhcnQucGFyYW1zKG1hdGNoKSA6IHt9O1xuXG5cdFx0XHRjb25zdCBwYWdlID0geyBob3N0OiBsb2NhdGlvbi5ob3N0LCBwYXRoLCBxdWVyeSwgcGFyYW1zIH07XG5cblx0XHRcdHJldHVybiB7IGhyZWY6IHVybC5ocmVmLCByb3V0ZSwgbWF0Y2gsIHBhZ2UgfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlX2Vycm9yKHVybCkge1xuXHRjb25zdCB7IGhvc3QsIHBhdGhuYW1lLCBzZWFyY2ggfSA9IGxvY2F0aW9uO1xuXHRjb25zdCB7IHNlc3Npb24sIHByZWxvYWRlZCwgc3RhdHVzLCBlcnJvciB9ID0gaW5pdGlhbF9kYXRhO1xuXG5cdGlmICghcm9vdF9wcmVsb2FkZWQpIHtcblx0XHRyb290X3ByZWxvYWRlZCA9IHByZWxvYWRlZCAmJiBwcmVsb2FkZWRbMF07XG5cdH1cblxuXHRjb25zdCBwcm9wcyA9IHtcblx0XHRlcnJvcixcblx0XHRzdGF0dXMsXG5cdFx0c2Vzc2lvbixcblx0XHRsZXZlbDA6IHtcblx0XHRcdHByb3BzOiByb290X3ByZWxvYWRlZFxuXHRcdH0sXG5cdFx0bGV2ZWwxOiB7XG5cdFx0XHRwcm9wczoge1xuXHRcdFx0XHRzdGF0dXMsXG5cdFx0XHRcdGVycm9yXG5cdFx0XHR9LFxuXHRcdFx0Y29tcG9uZW50OiBFcnJvckNvbXBvbmVudFxuXHRcdH0sXG5cdFx0c2VnbWVudHM6IHByZWxvYWRlZFxuXG5cdH07XG5cdGNvbnN0IHF1ZXJ5ID0gZXh0cmFjdF9xdWVyeShzZWFyY2gpO1xuXHRyZW5kZXIobnVsbCwgW10sIHByb3BzLCB7IGhvc3QsIHBhdGg6IHBhdGhuYW1lLCBxdWVyeSwgcGFyYW1zOiB7fSB9KTtcbn1cblxuZnVuY3Rpb24gc2Nyb2xsX3N0YXRlKCkge1xuXHRyZXR1cm4ge1xuXHRcdHg6IHBhZ2VYT2Zmc2V0LFxuXHRcdHk6IHBhZ2VZT2Zmc2V0XG5cdH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlKHRhcmdldCwgaWQsIG5vc2Nyb2xsLCBoYXNoKSB7XG5cdGlmIChpZCkge1xuXHRcdC8vIHBvcHN0YXRlIG9yIGluaXRpYWwgbmF2aWdhdGlvblxuXHRcdGNpZCA9IGlkO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGN1cnJlbnRfc2Nyb2xsID0gc2Nyb2xsX3N0YXRlKCk7XG5cblx0XHQvLyBjbGlja2VkIG9uIGEgbGluay4gcHJlc2VydmUgc2Nyb2xsIHN0YXRlXG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IGN1cnJlbnRfc2Nyb2xsO1xuXG5cdFx0aWQgPSBjaWQgPSArK3VpZDtcblx0XHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gbm9zY3JvbGwgPyBjdXJyZW50X3Njcm9sbCA6IHsgeDogMCwgeTogMCB9O1xuXHR9XG5cblx0Y2lkID0gaWQ7XG5cblx0aWYgKHJvb3RfY29tcG9uZW50KSBzdG9yZXMucHJlbG9hZGluZy5zZXQodHJ1ZSk7XG5cblx0Y29uc3QgbG9hZGVkID0gcHJlZmV0Y2hpbmcgJiYgcHJlZmV0Y2hpbmcuaHJlZiA9PT0gdGFyZ2V0LmhyZWYgP1xuXHRcdHByZWZldGNoaW5nLnByb21pc2UgOlxuXHRcdGh5ZHJhdGVfdGFyZ2V0KHRhcmdldCk7XG5cblx0cHJlZmV0Y2hpbmcgPSBudWxsO1xuXG5cdGNvbnN0IHRva2VuID0gY3VycmVudF90b2tlbiA9IHt9O1xuXHRjb25zdCB7IHJlZGlyZWN0LCBwcm9wcywgYnJhbmNoIH0gPSBhd2FpdCBsb2FkZWQ7XG5cdGlmICh0b2tlbiAhPT0gY3VycmVudF90b2tlbikgcmV0dXJuOyAvLyBhIHNlY29uZGFyeSBuYXZpZ2F0aW9uIGhhcHBlbmVkIHdoaWxlIHdlIHdlcmUgbG9hZGluZ1xuXG5cdGF3YWl0IHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgdGFyZ2V0LnBhZ2UpO1xuXHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cblx0aWYgKCFub3Njcm9sbCkge1xuXHRcdGxldCBzY3JvbGwgPSBzY3JvbGxfaGlzdG9yeVtpZF07XG5cblx0XHRpZiAoaGFzaCkge1xuXHRcdFx0Ly8gc2Nyb2xsIGlzIGFuIGVsZW1lbnQgaWQgKGZyb20gYSBoYXNoKSwgd2UgbmVlZCB0byBjb21wdXRlIHkuXG5cdFx0XHRjb25zdCBkZWVwX2xpbmtlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2guc2xpY2UoMSkpO1xuXG5cdFx0XHRpZiAoZGVlcF9saW5rZWQpIHtcblx0XHRcdFx0c2Nyb2xsID0ge1xuXHRcdFx0XHRcdHg6IDAsXG5cdFx0XHRcdFx0eTogZGVlcF9saW5rZWQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IHNjcm9sbDtcblx0XHRpZiAoc2Nyb2xsKSBzY3JvbGxUbyhzY3JvbGwueCwgc2Nyb2xsLnkpO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgcGFnZSkge1xuXHRpZiAocmVkaXJlY3QpIHJldHVybiBnb3RvKHJlZGlyZWN0LmxvY2F0aW9uLCB7IHJlcGxhY2VTdGF0ZTogdHJ1ZSB9KTtcblxuXHRzdG9yZXMucGFnZS5zZXQocGFnZSk7XG5cdHN0b3Jlcy5wcmVsb2FkaW5nLnNldChmYWxzZSk7XG5cblx0aWYgKHJvb3RfY29tcG9uZW50KSB7XG5cdFx0cm9vdF9jb21wb25lbnQuJHNldChwcm9wcyk7XG5cdH0gZWxzZSB7XG5cdFx0cHJvcHMuc3RvcmVzID0ge1xuXHRcdFx0cGFnZTogeyBzdWJzY3JpYmU6IHN0b3Jlcy5wYWdlLnN1YnNjcmliZSB9LFxuXHRcdFx0cHJlbG9hZGluZzogeyBzdWJzY3JpYmU6IHN0b3Jlcy5wcmVsb2FkaW5nLnN1YnNjcmliZSB9LFxuXHRcdFx0c2Vzc2lvbjogc3RvcmVzLnNlc3Npb25cblx0XHR9O1xuXHRcdHByb3BzLmxldmVsMCA9IHtcblx0XHRcdHByb3BzOiBhd2FpdCByb290X3ByZWxvYWRlZFxuXHRcdH07XG5cblx0XHQvLyBmaXJzdCBsb2FkIOKAlCByZW1vdmUgU1NSJ2QgPGhlYWQ+IGNvbnRlbnRzXG5cdFx0Y29uc3Qgc3RhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2FwcGVyLWhlYWQtc3RhcnQnKTtcblx0XHRjb25zdCBlbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2FwcGVyLWhlYWQtZW5kJyk7XG5cblx0XHRpZiAoc3RhcnQgJiYgZW5kKSB7XG5cdFx0XHR3aGlsZSAoc3RhcnQubmV4dFNpYmxpbmcgIT09IGVuZCkgZGV0YWNoKHN0YXJ0Lm5leHRTaWJsaW5nKTtcblx0XHRcdGRldGFjaChzdGFydCk7XG5cdFx0XHRkZXRhY2goZW5kKTtcblx0XHR9XG5cblx0XHRyb290X2NvbXBvbmVudCA9IG5ldyBBcHAoe1xuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0cHJvcHMsXG5cdFx0XHRoeWRyYXRlOiB0cnVlXG5cdFx0fSk7XG5cdH1cblxuXHRjdXJyZW50X2JyYW5jaCA9IGJyYW5jaDtcblx0Y3VycmVudF9xdWVyeSA9IEpTT04uc3RyaW5naWZ5KHBhZ2UucXVlcnkpO1xuXHRyZWFkeSA9IHRydWU7XG5cdHNlc3Npb25fZGlydHkgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFydF9jaGFuZ2VkKGksIHNlZ21lbnQsIG1hdGNoLCBzdHJpbmdpZmllZF9xdWVyeSkge1xuXHQvLyBUT0RPIG9ubHkgY2hlY2sgcXVlcnkgc3RyaW5nIGNoYW5nZXMgZm9yIHByZWxvYWQgZnVuY3Rpb25zXG5cdC8vIHRoYXQgZG8gaW4gZmFjdCBkZXBlbmQgb24gaXQgKHVzaW5nIHN0YXRpYyBhbmFseXNpcyBvclxuXHQvLyBydW50aW1lIGluc3RydW1lbnRhdGlvbilcblx0aWYgKHN0cmluZ2lmaWVkX3F1ZXJ5ICE9PSBjdXJyZW50X3F1ZXJ5KSByZXR1cm4gdHJ1ZTtcblxuXHRjb25zdCBwcmV2aW91cyA9IGN1cnJlbnRfYnJhbmNoW2ldO1xuXG5cdGlmICghcHJldmlvdXMpIHJldHVybiBmYWxzZTtcblx0aWYgKHNlZ21lbnQgIT09IHByZXZpb3VzLnNlZ21lbnQpIHJldHVybiB0cnVlO1xuXHRpZiAocHJldmlvdXMubWF0Y2gpIHtcblx0XHRpZiAoSlNPTi5zdHJpbmdpZnkocHJldmlvdXMubWF0Y2guc2xpY2UoMSwgaSArIDIpKSAhPT0gSlNPTi5zdHJpbmdpZnkobWF0Y2guc2xpY2UoMSwgaSArIDIpKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGh5ZHJhdGVfdGFyZ2V0KHRhcmdldClcblxuXG5cbiB7XG5cdGNvbnN0IHsgcm91dGUsIHBhZ2UgfSA9IHRhcmdldDtcblx0Y29uc3Qgc2VnbWVudHMgPSBwYWdlLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoQm9vbGVhbik7XG5cblx0bGV0IHJlZGlyZWN0ID0gbnVsbDtcblxuXHRjb25zdCBwcm9wcyA9IHsgZXJyb3I6IG51bGwsIHN0YXR1czogMjAwLCBzZWdtZW50czogW3NlZ21lbnRzWzBdXSB9O1xuXG5cdGNvbnN0IHByZWxvYWRfY29udGV4dCA9IHtcblx0XHRmZXRjaDogKHVybCwgb3B0cykgPT4gZmV0Y2godXJsLCBvcHRzKSxcblx0XHRyZWRpcmVjdDogKHN0YXR1c0NvZGUsIGxvY2F0aW9uKSA9PiB7XG5cdFx0XHRpZiAocmVkaXJlY3QgJiYgKHJlZGlyZWN0LnN0YXR1c0NvZGUgIT09IHN0YXR1c0NvZGUgfHwgcmVkaXJlY3QubG9jYXRpb24gIT09IGxvY2F0aW9uKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvbmZsaWN0aW5nIHJlZGlyZWN0c2ApO1xuXHRcdFx0fVxuXHRcdFx0cmVkaXJlY3QgPSB7IHN0YXR1c0NvZGUsIGxvY2F0aW9uIH07XG5cdFx0fSxcblx0XHRlcnJvcjogKHN0YXR1cywgZXJyb3IpID0+IHtcblx0XHRcdHByb3BzLmVycm9yID0gdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IG5ldyBFcnJvcihlcnJvcikgOiBlcnJvcjtcblx0XHRcdHByb3BzLnN0YXR1cyA9IHN0YXR1cztcblx0XHR9XG5cdH07XG5cblx0aWYgKCFyb290X3ByZWxvYWRlZCkge1xuXHRcdHJvb3RfcHJlbG9hZGVkID0gaW5pdGlhbF9kYXRhLnByZWxvYWRlZFswXSB8fCByb290X3ByZWxvYWQuY2FsbChwcmVsb2FkX2NvbnRleHQsIHtcblx0XHRcdGhvc3Q6IHBhZ2UuaG9zdCxcblx0XHRcdHBhdGg6IHBhZ2UucGF0aCxcblx0XHRcdHF1ZXJ5OiBwYWdlLnF1ZXJ5LFxuXHRcdFx0cGFyYW1zOiB7fVxuXHRcdH0sICRzZXNzaW9uKTtcblx0fVxuXG5cdGxldCBicmFuY2g7XG5cdGxldCBsID0gMTtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHN0cmluZ2lmaWVkX3F1ZXJ5ID0gSlNPTi5zdHJpbmdpZnkocGFnZS5xdWVyeSk7XG5cdFx0Y29uc3QgbWF0Y2ggPSByb3V0ZS5wYXR0ZXJuLmV4ZWMocGFnZS5wYXRoKTtcblxuXHRcdGxldCBzZWdtZW50X2RpcnR5ID0gZmFsc2U7XG5cblx0XHRicmFuY2ggPSBhd2FpdCBQcm9taXNlLmFsbChyb3V0ZS5wYXJ0cy5tYXAoYXN5bmMgKHBhcnQsIGkpID0+IHtcblx0XHRcdGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcblxuXHRcdFx0aWYgKHBhcnRfY2hhbmdlZChpLCBzZWdtZW50LCBtYXRjaCwgc3RyaW5naWZpZWRfcXVlcnkpKSBzZWdtZW50X2RpcnR5ID0gdHJ1ZTtcblxuXHRcdFx0cHJvcHMuc2VnbWVudHNbbF0gPSBzZWdtZW50c1tpICsgMV07IC8vIFRPRE8gbWFrZSB0aGlzIGxlc3MgY29uZnVzaW5nXG5cdFx0XHRpZiAoIXBhcnQpIHJldHVybiB7IHNlZ21lbnQgfTtcblxuXHRcdFx0Y29uc3QgaiA9IGwrKztcblxuXHRcdFx0aWYgKCFzZXNzaW9uX2RpcnR5ICYmICFzZWdtZW50X2RpcnR5ICYmIGN1cnJlbnRfYnJhbmNoW2ldICYmIGN1cnJlbnRfYnJhbmNoW2ldLnBhcnQgPT09IHBhcnQuaSkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudF9icmFuY2hbaV07XG5cdFx0XHR9XG5cblx0XHRcdHNlZ21lbnRfZGlydHkgPSBmYWxzZTtcblxuXHRcdFx0Y29uc3QgeyBkZWZhdWx0OiBjb21wb25lbnQsIHByZWxvYWQgfSA9IGF3YWl0IGxvYWRfY29tcG9uZW50KGNvbXBvbmVudHNbcGFydC5pXSk7XG5cblx0XHRcdGxldCBwcmVsb2FkZWQ7XG5cdFx0XHRpZiAocmVhZHkgfHwgIWluaXRpYWxfZGF0YS5wcmVsb2FkZWRbaSArIDFdKSB7XG5cdFx0XHRcdHByZWxvYWRlZCA9IHByZWxvYWRcblx0XHRcdFx0XHQ/IGF3YWl0IHByZWxvYWQuY2FsbChwcmVsb2FkX2NvbnRleHQsIHtcblx0XHRcdFx0XHRcdGhvc3Q6IHBhZ2UuaG9zdCxcblx0XHRcdFx0XHRcdHBhdGg6IHBhZ2UucGF0aCxcblx0XHRcdFx0XHRcdHF1ZXJ5OiBwYWdlLnF1ZXJ5LFxuXHRcdFx0XHRcdFx0cGFyYW1zOiBwYXJ0LnBhcmFtcyA/IHBhcnQucGFyYW1zKHRhcmdldC5tYXRjaCkgOiB7fVxuXHRcdFx0XHRcdH0sICRzZXNzaW9uKVxuXHRcdFx0XHRcdDoge307XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmVsb2FkZWQgPSBpbml0aWFsX2RhdGEucHJlbG9hZGVkW2kgKyAxXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChwcm9wc1tgbGV2ZWwke2p9YF0gPSB7IGNvbXBvbmVudCwgcHJvcHM6IHByZWxvYWRlZCwgc2VnbWVudCwgbWF0Y2gsIHBhcnQ6IHBhcnQuaSB9KTtcblx0XHR9KSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cHJvcHMuZXJyb3IgPSBlcnJvcjtcblx0XHRwcm9wcy5zdGF0dXMgPSA1MDA7XG5cdFx0YnJhbmNoID0gW107XG5cdH1cblxuXHRyZXR1cm4geyByZWRpcmVjdCwgcHJvcHMsIGJyYW5jaCB9O1xufVxuXG5mdW5jdGlvbiBsb2FkX2NzcyhjaHVuaykge1xuXHRjb25zdCBocmVmID0gYGNsaWVudC8ke2NodW5rfWA7XG5cdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsaW5rW2hyZWY9XCIke2hyZWZ9XCJdYCkpIHJldHVybjtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoKGZ1bGZpbCwgcmVqZWN0KSA9PiB7XG5cdFx0Y29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblx0XHRsaW5rLnJlbCA9ICdzdHlsZXNoZWV0Jztcblx0XHRsaW5rLmhyZWYgPSBocmVmO1xuXG5cdFx0bGluay5vbmxvYWQgPSAoKSA9PiBmdWxmaWwoKTtcblx0XHRsaW5rLm9uZXJyb3IgPSByZWplY3Q7XG5cblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbG9hZF9jb21wb25lbnQoY29tcG9uZW50KVxuXG5cbiB7XG5cdC8vIFRPRE8gdGhpcyBpcyB0ZW1wb3Jhcnkg4oCUIG9uY2UgcGxhY2Vob2xkZXJzIGFyZVxuXHQvLyBhbHdheXMgcmV3cml0dGVuLCBzY3JhdGNoIHRoZSB0ZXJuYXJ5XG5cdGNvbnN0IHByb21pc2VzID0gKHR5cGVvZiBjb21wb25lbnQuY3NzID09PSAnc3RyaW5nJyA/IFtdIDogY29tcG9uZW50LmNzcy5tYXAobG9hZF9jc3MpKTtcblx0cHJvbWlzZXMudW5zaGlmdChjb21wb25lbnQuanMoKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbih2YWx1ZXMgPT4gdmFsdWVzWzBdKTtcbn1cblxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcblx0bm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBwcmVmZXRjaChocmVmKSB7XG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQobmV3IFVSTChocmVmLCBkb2N1bWVudC5iYXNlVVJJKSk7XG5cblx0aWYgKHRhcmdldCkge1xuXHRcdGlmICghcHJlZmV0Y2hpbmcgfHwgaHJlZiAhPT0gcHJlZmV0Y2hpbmcuaHJlZikge1xuXHRcdFx0c2V0X3ByZWZldGNoaW5nKGhyZWYsIGh5ZHJhdGVfdGFyZ2V0KHRhcmdldCkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcmVmZXRjaGluZy5wcm9taXNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KG9wdHNcblxuKSB7XG5cdGlmICgnc2Nyb2xsUmVzdG9yYXRpb24nIGluIF9oaXN0b3J5KSB7XG5cdFx0X2hpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG5cdHNldF90YXJnZXQob3B0cy50YXJnZXQpO1xuXG5cdGFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlX2NsaWNrKTtcblx0YWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVfcG9wc3RhdGUpO1xuXG5cdC8vIHByZWZldGNoXG5cdGFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0cmlnZ2VyX3ByZWZldGNoKTtcblx0YWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlX21vdXNlbW92ZSk7XG5cblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuXHRcdGNvbnN0IHsgaGFzaCwgaHJlZiB9ID0gbG9jYXRpb247XG5cblx0XHRfaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBpZDogdWlkIH0sICcnLCBocmVmKTtcblxuXHRcdGNvbnN0IHVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cblx0XHRpZiAoaW5pdGlhbF9kYXRhLmVycm9yKSByZXR1cm4gaGFuZGxlX2Vycm9yKCk7XG5cblx0XHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KHVybCk7XG5cdFx0aWYgKHRhcmdldCkgcmV0dXJuIG5hdmlnYXRlKHRhcmdldCwgdWlkLCB0cnVlLCBoYXNoKTtcblx0fSk7XG59XG5cbmxldCBtb3VzZW1vdmVfdGltZW91dDtcblxuZnVuY3Rpb24gaGFuZGxlX21vdXNlbW92ZShldmVudCkge1xuXHRjbGVhclRpbWVvdXQobW91c2Vtb3ZlX3RpbWVvdXQpO1xuXHRtb3VzZW1vdmVfdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHRyaWdnZXJfcHJlZmV0Y2goZXZlbnQpO1xuXHR9LCAyMCk7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXJfcHJlZmV0Y2goZXZlbnQpIHtcblx0Y29uc3QgYSA9IGZpbmRfYW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdGlmICghYSB8fCBhLnJlbCAhPT0gJ3ByZWZldGNoJykgcmV0dXJuO1xuXG5cdHByZWZldGNoKGEuaHJlZik7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9jbGljayhldmVudCkge1xuXHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3BhZ2UuanNcblx0Ly8gTUlUIGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3BhZ2UuanMjbGljZW5zZVxuXHRpZiAod2hpY2goZXZlbnQpICE9PSAxKSByZXR1cm47XG5cdGlmIChldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuc2hpZnRLZXkpIHJldHVybjtcblx0aWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuXHRjb25zdCBhID0gZmluZF9hbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0aWYgKCFhKSByZXR1cm47XG5cblx0aWYgKCFhLmhyZWYpIHJldHVybjtcblxuXHQvLyBjaGVjayBpZiBsaW5rIGlzIGluc2lkZSBhbiBzdmdcblx0Ly8gaW4gdGhpcyBjYXNlLCBib3RoIGhyZWYgYW5kIHRhcmdldCBhcmUgYWx3YXlzIGluc2lkZSBhbiBvYmplY3Rcblx0Y29uc3Qgc3ZnID0gdHlwZW9mIGEuaHJlZiA9PT0gJ29iamVjdCcgJiYgYS5ocmVmLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTVkdBbmltYXRlZFN0cmluZyc7XG5cdGNvbnN0IGhyZWYgPSBTdHJpbmcoc3ZnID8gKGEpLmhyZWYuYmFzZVZhbCA6IGEuaHJlZik7XG5cblx0aWYgKGhyZWYgPT09IGxvY2F0aW9uLmhyZWYpIHtcblx0XHRpZiAoIWxvY2F0aW9uLmhhc2gpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSWdub3JlIGlmIHRhZyBoYXNcblx0Ly8gMS4gJ2Rvd25sb2FkJyBhdHRyaWJ1dGVcblx0Ly8gMi4gcmVsPSdleHRlcm5hbCcgYXR0cmlidXRlXG5cdGlmIChhLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBhLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCcpIHJldHVybjtcblxuXHQvLyBJZ25vcmUgaWYgPGE+IGhhcyBhIHRhcmdldFxuXHRpZiAoc3ZnID8gKGEpLnRhcmdldC5iYXNlVmFsIDogYS50YXJnZXQpIHJldHVybjtcblxuXHRjb25zdCB1cmwgPSBuZXcgVVJMKGhyZWYpO1xuXG5cdC8vIERvbid0IGhhbmRsZSBoYXNoIGNoYW5nZXNcblx0aWYgKHVybC5wYXRobmFtZSA9PT0gbG9jYXRpb24ucGF0aG5hbWUgJiYgdXJsLnNlYXJjaCA9PT0gbG9jYXRpb24uc2VhcmNoKSByZXR1cm47XG5cblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldCh1cmwpO1xuXHRpZiAodGFyZ2V0KSB7XG5cdFx0Y29uc3Qgbm9zY3JvbGwgPSBhLmhhc0F0dHJpYnV0ZSgnc2FwcGVyLW5vc2Nyb2xsJyk7XG5cdFx0bmF2aWdhdGUodGFyZ2V0LCBudWxsLCBub3Njcm9sbCwgdXJsLmhhc2gpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0X2hpc3RvcnkucHVzaFN0YXRlKHsgaWQ6IGNpZCB9LCAnJywgdXJsLmhyZWYpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHdoaWNoKGV2ZW50KSB7XG5cdHJldHVybiBldmVudC53aGljaCA9PT0gbnVsbCA/IGV2ZW50LmJ1dHRvbiA6IGV2ZW50LndoaWNoO1xufVxuXG5mdW5jdGlvbiBmaW5kX2FuY2hvcihub2RlKSB7XG5cdHdoaWxlIChub2RlICYmIG5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPT0gJ0EnKSBub2RlID0gbm9kZS5wYXJlbnROb2RlOyAvLyBTVkcgPGE+IGVsZW1lbnRzIGhhdmUgYSBsb3dlcmNhc2UgbmFtZVxuXHRyZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlX3BvcHN0YXRlKGV2ZW50KSB7XG5cdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBzY3JvbGxfc3RhdGUoKTtcblxuXHRpZiAoZXZlbnQuc3RhdGUpIHtcblx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQodXJsKTtcblx0XHRpZiAodGFyZ2V0KSB7XG5cdFx0XHRuYXZpZ2F0ZSh0YXJnZXQsIGV2ZW50LnN0YXRlLmlkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIGhhc2hjaGFuZ2Vcblx0XHRzZXRfdWlkKHVpZCArIDEpO1xuXHRcdHNldF9jaWQodWlkKTtcblx0XHRfaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBpZDogY2lkIH0sICcnLCBsb2NhdGlvbi5ocmVmKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwcmVmZXRjaFJvdXRlcyhwYXRobmFtZXMpIHtcblx0cmV0dXJuIHJvdXRlc1xuXHRcdC5maWx0ZXIocGF0aG5hbWVzXG5cdFx0XHQ/IHJvdXRlID0+IHBhdGhuYW1lcy5zb21lKHBhdGhuYW1lID0+IHJvdXRlLnBhdHRlcm4udGVzdChwYXRobmFtZSkpXG5cdFx0XHQ6ICgpID0+IHRydWVcblx0XHQpXG5cdFx0LnJlZHVjZSgocHJvbWlzZSwgcm91dGUpID0+IHByb21pc2UudGhlbigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwocm91dGUucGFydHMubWFwKHBhcnQgPT4gcGFydCAmJiBsb2FkX2NvbXBvbmVudChjb21wb25lbnRzW3BhcnQuaV0pKSk7XG5cdFx0fSksIFByb21pc2UucmVzb2x2ZSgpKTtcbn1cblxuY29uc3Qgc3RvcmVzJDEgPSAoKSA9PiBnZXRDb250ZXh0KENPTlRFWFRfS0VZKTtcblxuZXhwb3J0IHsgZ290bywgcHJlZmV0Y2gsIHByZWZldGNoUm91dGVzLCBzdGFydCwgc3RvcmVzJDEgYXMgc3RvcmVzIH07XG4iLCJpbXBvcnQgKiBhcyBzYXBwZXIgZnJvbSBcIkBzYXBwZXIvYXBwXCI7XG5cbnNhcHBlci5zdGFydCh7XG4gIHRhcmdldDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzYXBwZXJcIilcbn0pO1xuIl0sIm5hbWVzIjpbIm5vb3AiLCJpZGVudGl0eSIsIngiLCJhc3NpZ24iLCJ0YXIiLCJzcmMiLCJrIiwiYWRkX2xvY2F0aW9uIiwiZWxlbWVudCIsImZpbGUiLCJsaW5lIiwiY29sdW1uIiwiY2hhciIsIl9fc3ZlbHRlX21ldGEiLCJsb2MiLCJydW4iLCJmbiIsImJsYW5rX29iamVjdCIsIk9iamVjdCIsImNyZWF0ZSIsInJ1bl9hbGwiLCJmbnMiLCJmb3JFYWNoIiwiaXNfZnVuY3Rpb24iLCJ0aGluZyIsInNhZmVfbm90X2VxdWFsIiwiYSIsImIiLCJ2YWxpZGF0ZV9zdG9yZSIsInN0b3JlIiwibmFtZSIsInN1YnNjcmliZSIsIkVycm9yIiwiY2FsbGJhY2tzIiwidW5zdWIiLCJ1bnN1YnNjcmliZSIsImNvbXBvbmVudF9zdWJzY3JpYmUiLCJjb21wb25lbnQiLCJjYWxsYmFjayIsIiQkIiwib25fZGVzdHJveSIsInB1c2giLCJjcmVhdGVfc2xvdCIsImRlZmluaXRpb24iLCJjdHgiLCIkJHNjb3BlIiwic2xvdF9jdHgiLCJnZXRfc2xvdF9jb250ZXh0Iiwic2xpY2UiLCJnZXRfc2xvdF9jaGFuZ2VzIiwiZGlydHkiLCJsZXRzIiwidW5kZWZpbmVkIiwibWVyZ2VkIiwibGVuIiwiTWF0aCIsIm1heCIsImxlbmd0aCIsImkiLCJ1cGRhdGVfc2xvdCIsInNsb3QiLCJzbG90X2RlZmluaXRpb24iLCJnZXRfc2xvdF9jaGFuZ2VzX2ZuIiwiZ2V0X3Nsb3RfY29udGV4dF9mbiIsInNsb3RfY2hhbmdlcyIsInNsb3RfY29udGV4dCIsInAiLCJleGNsdWRlX2ludGVybmFsX3Byb3BzIiwicHJvcHMiLCJyZXN1bHQiLCJudWxsX3RvX2VtcHR5IiwidmFsdWUiLCJhY3Rpb25fZGVzdHJveWVyIiwiYWN0aW9uX3Jlc3VsdCIsImRlc3Ryb3kiLCJpc19jbGllbnQiLCJ3aW5kb3ciLCJub3ciLCJwZXJmb3JtYW5jZSIsIkRhdGUiLCJyYWYiLCJjYiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInRhc2tzIiwiU2V0IiwicnVuX3Rhc2tzIiwidGFzayIsImMiLCJkZWxldGUiLCJmIiwic2l6ZSIsImxvb3AiLCJwcm9taXNlIiwiUHJvbWlzZSIsImZ1bGZpbGwiLCJhZGQiLCJhYm9ydCIsImFwcGVuZCIsInRhcmdldCIsIm5vZGUiLCJhcHBlbmRDaGlsZCIsImluc2VydCIsImFuY2hvciIsImluc2VydEJlZm9yZSIsImRldGFjaCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImRlc3Ryb3lfZWFjaCIsIml0ZXJhdGlvbnMiLCJkZXRhY2hpbmciLCJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ZnX2VsZW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJ0ZXh0IiwiZGF0YSIsImNyZWF0ZVRleHROb2RlIiwic3BhY2UiLCJlbXB0eSIsImxpc3RlbiIsImV2ZW50IiwiaGFuZGxlciIsIm9wdGlvbnMiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInN0b3BfcHJvcGFnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJjYWxsIiwiYXR0ciIsImF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInNldF9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImRlc2NyaXB0b3JzIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsIl9fcHJvdG9fXyIsImtleSIsInN0eWxlIiwiY3NzVGV4dCIsInNldCIsInRvX251bWJlciIsImNoaWxkcmVuIiwiQXJyYXkiLCJmcm9tIiwiY2hpbGROb2RlcyIsImNsYWltX2VsZW1lbnQiLCJub2RlcyIsInN2ZyIsIm5vZGVOYW1lIiwiaiIsInJlbW92ZSIsInNwbGljZSIsImNsYWltX3RleHQiLCJub2RlVHlwZSIsImNsYWltX3NwYWNlIiwic2V0X2lucHV0X3ZhbHVlIiwiaW5wdXQiLCJzZXRfc3R5bGUiLCJpbXBvcnRhbnQiLCJzZXRQcm9wZXJ0eSIsInRvZ2dsZV9jbGFzcyIsInRvZ2dsZSIsImNsYXNzTGlzdCIsImN1c3RvbV9ldmVudCIsInR5cGUiLCJkZXRhaWwiLCJlIiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJxdWVyeV9zZWxlY3Rvcl9hbGwiLCJzZWxlY3RvciIsInBhcmVudCIsImJvZHkiLCJxdWVyeVNlbGVjdG9yQWxsIiwiSHRtbFRhZyIsImNvbnN0cnVjdG9yIiwibiIsIm0iLCJodG1sIiwidCIsImgiLCJpbm5lckhUTUwiLCJhY3RpdmVfZG9jcyIsImFjdGl2ZSIsImhhc2giLCJzdHIiLCJjaGFyQ29kZUF0IiwiY3JlYXRlX3J1bGUiLCJkdXJhdGlvbiIsImRlbGF5IiwiZWFzZSIsInVpZCIsInN0ZXAiLCJrZXlmcmFtZXMiLCJydWxlIiwiZG9jIiwib3duZXJEb2N1bWVudCIsInN0eWxlc2hlZXQiLCJfX3N2ZWx0ZV9zdHlsZXNoZWV0IiwiaGVhZCIsInNoZWV0IiwiY3VycmVudF9ydWxlcyIsIl9fc3ZlbHRlX3J1bGVzIiwiaW5zZXJ0UnVsZSIsImNzc1J1bGVzIiwiYW5pbWF0aW9uIiwiZGVsZXRlX3J1bGUiLCJwcmV2aW91cyIsInNwbGl0IiwibmV4dCIsImZpbHRlciIsImFuaW0iLCJpbmRleE9mIiwiZGVsZXRlZCIsImpvaW4iLCJjbGVhcl9ydWxlcyIsImRlbGV0ZVJ1bGUiLCJjbGVhciIsImN1cnJlbnRfY29tcG9uZW50Iiwic2V0X2N1cnJlbnRfY29tcG9uZW50IiwiZ2V0X2N1cnJlbnRfY29tcG9uZW50Iiwib25Nb3VudCIsIm9uX21vdW50Iiwib25EZXN0cm95IiwiY3JlYXRlRXZlbnREaXNwYXRjaGVyIiwic2V0Q29udGV4dCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwiZ2V0IiwiYnViYmxlIiwiZGlydHlfY29tcG9uZW50cyIsImJpbmRpbmdfY2FsbGJhY2tzIiwicmVuZGVyX2NhbGxiYWNrcyIsImZsdXNoX2NhbGxiYWNrcyIsInJlc29sdmVkX3Byb21pc2UiLCJyZXNvbHZlIiwidXBkYXRlX3NjaGVkdWxlZCIsInNjaGVkdWxlX3VwZGF0ZSIsInRoZW4iLCJmbHVzaCIsImFkZF9yZW5kZXJfY2FsbGJhY2siLCJhZGRfZmx1c2hfY2FsbGJhY2siLCJmbHVzaGluZyIsInNlZW5fY2FsbGJhY2tzIiwidXBkYXRlIiwicG9wIiwiaGFzIiwiZnJhZ21lbnQiLCJiZWZvcmVfdXBkYXRlIiwiYWZ0ZXJfdXBkYXRlIiwid2FpdCIsImRpc3BhdGNoIiwiZGlyZWN0aW9uIiwia2luZCIsImRpc3BhdGNoRXZlbnQiLCJvdXRyb2luZyIsIm91dHJvcyIsImdyb3VwX291dHJvcyIsInIiLCJjaGVja19vdXRyb3MiLCJ0cmFuc2l0aW9uX2luIiwiYmxvY2siLCJsb2NhbCIsInRyYW5zaXRpb25fb3V0IiwibyIsIm51bGxfdHJhbnNpdGlvbiIsImNyZWF0ZV9pbl90cmFuc2l0aW9uIiwicGFyYW1zIiwiY29uZmlnIiwicnVubmluZyIsImFuaW1hdGlvbl9uYW1lIiwiY2xlYW51cCIsImdvIiwiZWFzaW5nIiwidGljayIsImNzcyIsInN0YXJ0X3RpbWUiLCJlbmRfdGltZSIsInN0YXJ0ZWQiLCJzdGFydCIsImludmFsaWRhdGUiLCJlbmQiLCJjcmVhdGVfb3V0X3RyYW5zaXRpb24iLCJncm91cCIsInJlc2V0IiwiY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiIsImludHJvIiwicnVubmluZ19wcm9ncmFtIiwicGVuZGluZ19wcm9ncmFtIiwiY2xlYXJfYW5pbWF0aW9uIiwiaW5pdCIsInByb2dyYW0iLCJhYnMiLCJnbG9iYWxzIiwiZ2xvYmFsVGhpcyIsImdsb2JhbCIsImdldF9zcHJlYWRfdXBkYXRlIiwibGV2ZWxzIiwidXBkYXRlcyIsInRvX251bGxfb3V0IiwiYWNjb3VudGVkX2ZvciIsImdldF9zcHJlYWRfb2JqZWN0Iiwic3ByZWFkX3Byb3BzIiwiYmluZCIsImluZGV4IiwiYm91bmQiLCJjcmVhdGVfY29tcG9uZW50IiwiY2xhaW1fY29tcG9uZW50IiwicGFyZW50X25vZGVzIiwibCIsIm1vdW50X2NvbXBvbmVudCIsIm5ld19vbl9kZXN0cm95IiwibWFwIiwiZGVzdHJveV9jb21wb25lbnQiLCJtYWtlX2RpcnR5IiwiZmlsbCIsImluc3RhbmNlIiwiY3JlYXRlX2ZyYWdtZW50Iiwibm90X2VxdWFsIiwicGFyZW50X2NvbXBvbmVudCIsInByb3BfdmFsdWVzIiwiTWFwIiwicmVhZHkiLCJyZXQiLCJyZXN0IiwiaHlkcmF0ZSIsIlN2ZWx0ZUNvbXBvbmVudCIsIiRkZXN0cm95IiwiJG9uIiwiJHNldCIsImRpc3BhdGNoX2RldiIsInZlcnNpb24iLCJhcHBlbmRfZGV2IiwiaW5zZXJ0X2RldiIsImRldGFjaF9kZXYiLCJsaXN0ZW5fZGV2IiwiaGFzX3ByZXZlbnRfZGVmYXVsdCIsImhhc19zdG9wX3Byb3BhZ2F0aW9uIiwibW9kaWZpZXJzIiwia2V5cyIsImRpc3Bvc2UiLCJhdHRyX2RldiIsInByb3BfZGV2IiwicHJvcGVydHkiLCJzZXRfZGF0YV9kZXYiLCJ3aG9sZVRleHQiLCJ2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50IiwiYXJnIiwibXNnIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJ2YWxpZGF0ZV9zbG90cyIsInNsb3Rfa2V5IiwiY29uc29sZSIsIndhcm4iLCJTdmVsdGVDb21wb25lbnREZXYiLCIkJGlubGluZSIsIiRjYXB0dXJlX3N0YXRlIiwiJGluamVjdF9zdGF0ZSIsInN1YnNjcmliZXJfcXVldWUiLCJ3cml0YWJsZSIsInN0b3AiLCJzdWJzY3JpYmVycyIsIm5ld192YWx1ZSIsInJ1bl9xdWV1ZSIsInMiLCJzdWJzY3JpYmVyIiwiQ09OVEVYVF9LRVkiLCJwcmVsb2FkIiwibm9EZXB0aCIsImdldENsYXNzIiwicHJvcCIsImNvbG9yIiwiZGVwdGgiLCJkZWZhdWx0RGVwdGgiLCJpbmNsdWRlcyIsInV0aWxzIiwiYmciLCJib3JkZXIiLCJ0eHQiLCJjYXJldCIsIkNsYXNzQnVpbGRlciIsImNsYXNzZXMiLCJkZWZhdWx0Q2xhc3NlcyIsImRlZmF1bHRzIiwiZXh0ZW5kIiwicmVwbGFjZSIsImNvbmQiLCJyZWR1Y2UiLCJhY2MiLCJSZWdFeHAiLCJjdXIiLCJjbGFzc05hbWUiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0UmVzZXJ2ZWQiLCJmaWx0ZXJQcm9wcyIsInJlc2VydmVkIiwiY2xhc3Nlc0RlZmF1bHQiLCIkIiwiJCRwcm9wcyIsImNsYXNzIiwic21hbGwiLCJ4cyIsInJldmVyc2UiLCJ0aXAiLCJyaXBwbGUiLCJjZW50ZXJlZCIsImN1cnJlbnRUYXJnZXQiLCJjaXJjbGUiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsInJlbW92ZUNpcmNsZSIsIndpZHRoIiwiaGVpZ2h0IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJjbGllbnRYIiwidG9wIiwiY2xpZW50WSIsIm9uTW91c2VEb3duIiwiaWNvbiIsImlkIiwidG8iLCJzZWxlY3RlZCIsIm5vdFNlbGVjdGVkQ29sb3IiLCJ0YWJDbGFzc2VzIiwiY3JlYXRlUmlwcGxlIiwibm90U2VsZWN0ZWQiLCJ0ZXh0Q29sb3IiLCJjdWJpY091dCIsInF1YWRJbiIsInF1YWRPdXQiLCJmYWRlIiwibGluZWFyIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIm9wYWNpdHkiLCJmbHkiLCJ5IiwidGFyZ2V0X29wYWNpdHkiLCJ0cmFuc2Zvcm0iLCJvZCIsInUiLCJzbGlkZSIsInBhcnNlRmxvYXQiLCJwYWRkaW5nX3RvcCIsInBhZGRpbmdUb3AiLCJwYWRkaW5nX2JvdHRvbSIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5fdG9wIiwibWFyZ2luVG9wIiwibWFyZ2luX2JvdHRvbSIsIm1hcmdpbkJvdHRvbSIsImJvcmRlcl90b3Bfd2lkdGgiLCJib3JkZXJUb3BXaWR0aCIsImJvcmRlcl9ib3R0b21fd2lkdGgiLCJib3JkZXJCb3R0b21XaWR0aCIsIm1pbiIsInNjYWxlIiwic2QiLCJfdCIsImFwcCIsInByb2dyZXNzIiwiaW5pdGlhbGl6ZWQiLCJzZXRUaW1lb3V0IiwibmF2aWdhdGlvbiIsIml0ZW1zIiwiaW5kaWNhdG9yIiwibG9hZGluZyIsInRhYkJ1dHRvbkNsYXNzZXMiLCJpbmRpY2F0b3JXaWR0aCIsImluZGljYXRvck9mZnNldCIsIm9mZnNldCIsImNhbGNJbmRpY2F0b3IiLCJvZmZzZXRXaWR0aCIsImZpbmRJbmRleCIsImxvbmdlc3RNYXRjaCIsIml0ZW0iLCJzb3J0IiwiaW5kZXgxIiwiaXRlbTEiLCJpbmRleDIiLCJpdGVtMiIsImJhc2ljRGVmYXVsdCIsIm91dGxpbmVkRGVmYXVsdCIsInRleHREZWZhdWx0IiwiaWNvbkRlZmF1bHQiLCJmYWJEZWZhdWx0Iiwic21hbGxEZWZhdWx0IiwiZGlzYWJsZWREZWZhdWx0IiwiZWxldmF0aW9uRGVmYXVsdCIsIm91dGxpbmVkIiwiZGlzYWJsZWQiLCJsaWdodCIsImRhcmsiLCJmbGF0IiwiaWNvbkNsYXNzIiwiaHJlZiIsImZhYiIsImJhc2ljQ2xhc3NlcyIsIm91dGxpbmVkQ2xhc3NlcyIsInRleHRDbGFzc2VzIiwiaWNvbkNsYXNzZXMiLCJmYWJDbGFzc2VzIiwic21hbGxDbGFzc2VzIiwiZGlzYWJsZWRDbGFzc2VzIiwiZWxldmF0aW9uQ2xhc3NlcyIsImJhc2ljIiwiZWxldmF0aW9uIiwiQ2xhc3NlcyIsImlDbGFzc2VzIiwic2hhZGUiLCJpY29uQ2IiLCJub3JtYWwiLCJsaWdodGVyIiwiaW5Qcm9wcyIsIm91dFByb3BzIiwiU2NyaW0iLCJzY3JpbSIsIlNwYWNlciIsInNwYWNlciIsInNlbGVjdGVkQ2xhc3Nlc0RlZmF1bHQiLCJzdWJoZWFkaW5nQ2xhc3Nlc0RlZmF1bHQiLCJzdWJoZWFkaW5nIiwiZGVuc2UiLCJ0YWJpbmRleCIsInNlbGVjdGVkQ2xhc3NlcyIsInN1YmhlYWRpbmdDbGFzc2VzIiwibGV2ZWwiLCJjaGFuZ2UiLCJnZXRUZXh0Iiwic2VsZWN0IiwiaXRlbUNsYXNzZXMiLCJkZWZhdWx0Q2FsYyIsImJyZWFrcG9pbnQiLCJjYWxjQnJlYWtwb2ludCIsImlubmVyV2lkdGgiLCJvblJlc2l6ZSIsImJwIiwiYnJlYWtwb2ludHMiLCJuYXZDbGFzc2VzRGVmYXVsdCIsInJpZ2h0IiwicGVyc2lzdGVudCIsInNob3ciLCJuYXZDbGFzc2VzIiwiYm9yZGVyQ2xhc3NlcyIsInRyYW5zaXRpb25Qcm9wcyIsImhpZGRlbiIsIiRicCIsIm5jYiIsImRlYm91bmNlIiwiZnVuYyIsImltbWVkaWF0ZSIsInRpbWVvdXQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJjbGVhclRpbWVvdXQiLCJkZWxheUhpZGUiLCJkZWxheVNob3ciLCJzaG93VG9vbHRpcCIsImhpZGVUb29sdGlwIiwibmF2TWVudSIsInRvcE1lbnUiLCJzaG93TmF2IiwiZGFya01vZGUiLCJpc0RhcmtUaGVtZSIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiYm9keUNsYXNzZXMiLCJ2IiwicHJlbG9hZGluZyIsInBhZ2UiLCJzdG9yZXMiLCJwYXRoIiwiJGRhcmtNb2RlIiwiJHNob3dOYXYiLCIkcGFnZSIsInN0YWNrIiwibWVzc2FnZSIsInN0YXR1cyIsImVycm9yIiwiZGV2Iiwic2VnbWVudHMiLCJsZXZlbDAiLCJsZXZlbDEiLCJsZXZlbDIiLCJpZ25vcmUiLCJjb21wb25lbnRzIiwianMiLCJyb3V0ZXMiLCJwYXR0ZXJuIiwicGFydHMiLCJjbGllbnQiLCJjb25uZWN0IiwiZ290byIsIm9wdHMiLCJyZXBsYWNlU3RhdGUiLCJzZWxlY3RfdGFyZ2V0IiwiVVJMIiwiYmFzZVVSSSIsIl9oaXN0b3J5IiwiY2lkIiwibmF2aWdhdGUiLCJsb2NhdGlvbiIsImluaXRpYWxfZGF0YSIsIl9fU0FQUEVSX18iLCJyb290X2NvbXBvbmVudCIsImN1cnJlbnRfdG9rZW4iLCJyb290X3ByZWxvYWRlZCIsImN1cnJlbnRfYnJhbmNoIiwiY3VycmVudF9xdWVyeSIsInNlc3Npb24iLCIkc2Vzc2lvbiIsInNlc3Npb25fZGlydHkiLCJ0b2tlbiIsInJlZGlyZWN0IiwiYnJhbmNoIiwiaHlkcmF0ZV90YXJnZXQiLCJyZW5kZXIiLCJwcmVmZXRjaGluZyIsInNldF9wcmVmZXRjaGluZyIsInNldF90YXJnZXQiLCJzZXRfdWlkIiwic2V0X2NpZCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJzdGF0ZSIsInRpdGxlIiwic2Nyb2xsUmVzdG9yYXRpb24iLCJzY3JvbGxfaGlzdG9yeSIsImV4dHJhY3RfcXVlcnkiLCJzZWFyY2giLCJxdWVyeSIsInNlYXJjaFBhcmFtIiwiZXhlYyIsImRlY29kZVVSSUNvbXBvbmVudCIsInVybCIsIm9yaWdpbiIsInBhdGhuYW1lIiwic3RhcnRzV2l0aCIsImJhc2VVcmwiLCJzb21lIiwidGVzdCIsInJvdXRlIiwibWF0Y2giLCJwYXJ0IiwiaG9zdCIsImhhbmRsZV9lcnJvciIsInByZWxvYWRlZCIsIkVycm9yQ29tcG9uZW50Iiwic2Nyb2xsX3N0YXRlIiwicGFnZVhPZmZzZXQiLCJwYWdlWU9mZnNldCIsIm5vc2Nyb2xsIiwiY3VycmVudF9zY3JvbGwiLCJsb2FkZWQiLCJhY3RpdmVFbGVtZW50IiwiYmx1ciIsInNjcm9sbCIsImRlZXBfbGlua2VkIiwiZ2V0RWxlbWVudEJ5SWQiLCJzY3JvbGxUbyIsInF1ZXJ5U2VsZWN0b3IiLCJuZXh0U2libGluZyIsIkFwcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJ0X2NoYW5nZWQiLCJzZWdtZW50Iiwic3RyaW5naWZpZWRfcXVlcnkiLCJCb29sZWFuIiwicHJlbG9hZF9jb250ZXh0IiwiZmV0Y2giLCJzdGF0dXNDb2RlIiwicm9vdF9wcmVsb2FkIiwic2VnbWVudF9kaXJ0eSIsImFsbCIsImRlZmF1bHQiLCJsb2FkX2NvbXBvbmVudCIsImxvYWRfY3NzIiwiY2h1bmsiLCJmdWxmaWwiLCJyZWplY3QiLCJsaW5rIiwicmVsIiwib25sb2FkIiwib25lcnJvciIsInByb21pc2VzIiwidW5zaGlmdCIsInZhbHVlcyIsInByZWZldGNoIiwiaGFuZGxlX2NsaWNrIiwiaGFuZGxlX3BvcHN0YXRlIiwidHJpZ2dlcl9wcmVmZXRjaCIsImhhbmRsZV9tb3VzZW1vdmUiLCJtb3VzZW1vdmVfdGltZW91dCIsImZpbmRfYW5jaG9yIiwid2hpY2giLCJtZXRhS2V5IiwiY3RybEtleSIsInNoaWZ0S2V5IiwiZGVmYXVsdFByZXZlbnRlZCIsIlN0cmluZyIsImJhc2VWYWwiLCJwcmV2ZW50RGVmYXVsdCIsImhhc0F0dHJpYnV0ZSIsImJ1dHRvbiIsInRvVXBwZXJDYXNlIiwic3RvcmVzJDEiLCJzYXBwZXIiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLElBQVQsR0FBZ0I7O0FBQ2hCLE1BQU1DLFFBQVEsR0FBR0MsQ0FBQyxJQUFJQSxDQUF0Qjs7QUFDQSxTQUFTQyxNQUFULENBQWdCQyxHQUFoQixFQUFxQkMsR0FBckIsRUFBMEI7QUFDdEI7QUFDQSxPQUFLLE1BQU1DLENBQVgsSUFBZ0JELEdBQWhCLEVBQ0lELEdBQUcsQ0FBQ0UsQ0FBRCxDQUFILEdBQVNELEdBQUcsQ0FBQ0MsQ0FBRCxDQUFaOztBQUNKLFNBQU9GLEdBQVA7QUFDSDs7QUFJRCxTQUFTRyxZQUFULENBQXNCQyxPQUF0QixFQUErQkMsSUFBL0IsRUFBcUNDLElBQXJDLEVBQTJDQyxNQUEzQyxFQUFtREMsSUFBbkQsRUFBeUQ7QUFDckRKLEVBQUFBLE9BQU8sQ0FBQ0ssYUFBUixHQUF3QjtBQUNwQkMsSUFBQUEsR0FBRyxFQUFFO0FBQUVMLE1BQUFBLElBQUY7QUFBUUMsTUFBQUEsSUFBUjtBQUFjQyxNQUFBQSxNQUFkO0FBQXNCQyxNQUFBQTtBQUF0QjtBQURlLEdBQXhCO0FBR0g7O0FBQ0QsU0FBU0csR0FBVCxDQUFhQyxFQUFiLEVBQWlCO0FBQ2IsU0FBT0EsRUFBRSxFQUFUO0FBQ0g7O0FBQ0QsU0FBU0MsWUFBVCxHQUF3QjtBQUNwQixTQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQVA7QUFDSDs7QUFDRCxTQUFTQyxPQUFULENBQWlCQyxHQUFqQixFQUFzQjtBQUNsQkEsRUFBQUEsR0FBRyxDQUFDQyxPQUFKLENBQVlQLEdBQVo7QUFDSDs7QUFDRCxTQUFTUSxXQUFULENBQXFCQyxLQUFyQixF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RUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFaREEsRUFBQUEsR0FBSSxFQUFBLENBQUo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQURLQSxNQUFBQSxHQUFVLEVBQUE7Ozs7QUFKaEJBLE1BQUFBLEdBQUUsRUFBQTs7O0FBQ0RBLE1BQUFBLEdBQUMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlEQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRENBLFFBQUFBLEdBQVUsRUFBQTs7Ozs7Ozs7QUFKaEJBLFFBQUFBLEdBQUUsRUFBQTs7Ozs7Ozs7QUFDREEsUUFBQUEsR0FBQyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCc0JBLE1BQUFBLEdBQVMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVRBLE1BQUFBLEdBQVMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFHQSxNQUFBQSxHQUFJLEVBQUE7Ozs7O0FBQUpBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7OztBQUFKQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSW5DQSxNQUFBQSxHQUFJLEVBQUE7Ozs7O0FBQUpBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7OztBQUFKQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFyQmVBLE1BQUFBLEdBQVMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVRBLE1BQUFBLEdBQVMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFHQSxNQUFBQSxHQUFJLEVBQUE7Ozs7O0FBQUpBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7OztBQUFKQSxNQUFB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QUFPSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVJGQSxRQUFBQSxHQUFPLEVBQUE7OztBQUNWQSxNQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVZGQSxFQUFBQSxHQUFJLEVBQUEsQ0FBSjs7Ozs7Ozs7OztBQVJFQSxJQUFBQSxHQUFPLEVBQUE7OztBQUNWQSxFQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTFBBLEVBQUFBLEdBQUssRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUZBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFSRkEsUUFBQUEsR0FBTyxFQUFBOzs7QUFDVkEsTUFBQUEsR0FBSyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFMUEEsTUFBQUEsR0FBSyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Qk1BLE1BQUFBLEdBQVEsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVJBLE1BQUFBLEdBQVEsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBV0EsTUFBQUEsR0FBSSxFQUFBOzs7OztBQUFKQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFqQnJCQSxNQUFBQSxHQUFRLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFSQSxNQUFBQSxHQUFRLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVdBLE1BQUFBLEdBQUksRUFBQTs7Ozs7QUFBSkEs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
