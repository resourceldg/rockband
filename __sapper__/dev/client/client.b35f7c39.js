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
      add_location(header, file, 16, 0, 356);
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
  let classesDefault = "fixed top-0 w-full items-center flex-wrap  z-30 p-0 h-16 elevation-3 bg-primary-300 dark:bg-dark-600";
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
  js: () => import('./index.955b208a.js'),
  css: []
}, {
  js: () => import('./sre.18d2bba5.js'),
  css: []
}, {
  js: () => import('./breakpoints.63138c76.js'),
  css: []
}, {
  js: () => import('./_layout.f0032ccb.js'),
  css: []
}, {
  js: () => import('./index.700cf022.js'),
  css: []
}, {
  js: () => import('./progress-indicators.209c756d.js'),
  css: []
}, {
  js: () => import('./navigation-drawers.c8d2d886.js'),
  css: []
}, {
  js: () => import('./selection-controls.c45a77e8.js'),
  css: []
}, {
  js: () => import('./date-pickers.4091e085.js'),
  css: []
}, {
  js: () => import('./data-tables.5954f587.js'),
  css: []
}, {
  js: () => import('./text-fields.79009423.js'),
  css: []
}, {
  js: () => import('./snackbars.3856fe4a.js'),
  css: []
}, {
  js: () => import('./treeviews.4ee64a74.js'),
  css: []
}, {
  js: () => import('./tooltips.6e4b1a2f.js'),
  css: []
}, {
  js: () => import('./buttons.221992e9.js'),
  css: []
}, {
  js: () => import('./dialogs.47cbc370.js'),
  css: []
}, {
  js: () => import('./selects.cd72a378.js'),
  css: []
}, {
  js: () => import('./sliders.305876d7.js'),
  css: []
}, {
  js: () => import('./images.6337afaf.js'),
  css: []
}, {
  js: () => import('./cards.646639b0.js'),
  css: []
}, {
  js: () => import('./chips.e72521d0.js'),
  css: []
}, {
  js: () => import('./lists.c308aa59.js'),
  css: []
}, {
  js: () => import('./menus.a9ef25d8.js'),
  css: []
}, {
  js: () => import('./jump.26db169c.js'),
  css: []
}, {
  js: () => import('./tabs.496203e6.js'),
  css: []
}, {
  js: () => import('./typography.c29bf070.js'),
  css: []
}, {
  js: () => import('./dark-mode.e3cd96bd.js'),
  css: []
}, {
  js: () => import('./frontend.69b61a39.js'),
  css: []
}, {
  js: () => import('./postgresql.bf5deb83.js'),
  css: []
}, {
  js: () => import('./color.3c442fa5.js'),
  css: []
}, {
  js: () => import('./api.398bdb01.js'),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmIzNWY3YzM5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9zcmMvdXRpbHMvY2xhc3Nlcy5qcyIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0FwcEJhci9BcHBCYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvSWNvbi9JY29uLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1JpcHBsZS9yaXBwbGUuanMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJzL1RhYkJ1dHRvbi5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJzL1RhYi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2Vhc2luZy9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL3RyYW5zaXRpb24vaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFicy9JbmRpY2F0b3Iuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NMaW5lYXIvUHJvZ3Jlc3NMaW5lYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFicy9UYWJzLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0J1dHRvbi9CdXR0b24uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVXRpbC9TY3JpbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9VdGlsL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTGlzdC9MaXN0SXRlbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9MaXN0L0xpc3Quc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2JyZWFrcG9pbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTmF2aWdhdGlvbkRyYXdlci9OYXZpZ2F0aW9uRHJhd2VyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAvVG9vbHRpcC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvdXRpbHMvbWVudS5qcyIsIi4uLy4uLy4uL3NyYy9zdG9yZXMuanMiLCIuLi8uLi8uLi9zcmMvZGFyay5qcyIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19lcnJvci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvQXBwLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9pbnRlcm5hbC9tYW5pZmVzdC1jbGllbnQubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2FwcC5tanMiLCIuLi8uLi8uLi9zcmMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4O1xuZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZvciAoY29uc3QgayBpbiBzcmMpXG4gICAgICAgIHRhcltrXSA9IHNyY1trXTtcbiAgICByZXR1cm4gdGFyO1xufVxuZnVuY3Rpb24gaXNfcHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYWRkX2xvY2F0aW9uKGVsZW1lbnQsIGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhcikge1xuICAgIGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcbiAgICAgICAgbG9jOiB7IGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhciB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJ1bihmbikge1xuICAgIHJldHVybiBmbigpO1xufVxuZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcbiAgICBmbnMuZm9yRWFjaChydW4pO1xufVxuZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gc2FmZV9ub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90KHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbiwgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGNvbnN0IHNsb3RfY2hhbmdlcyA9IGdldF9zbG90X2NoYW5nZXMoc2xvdF9kZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbik7XG4gICAgaWYgKHNsb3RfY2hhbmdlcykge1xuICAgICAgICBjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbiAgICAgICAgc2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gb25jZShmbikge1xuICAgIGxldCByYW4gPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHJhbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSA9IHJldCkge1xuICAgIHN0b3JlLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5mdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcbiAgICByZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgbm93ID0gaXNfY2xpZW50XG4gICAgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICA6ICgpID0+IERhdGUubm93KCk7XG5sZXQgcmFmID0gaXNfY2xpZW50ID8gY2IgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG4vLyB1c2VkIGludGVybmFsbHkgZm9yIHRlc3RpbmdcbmZ1bmN0aW9uIHNldF9ub3coZm4pIHtcbiAgICBub3cgPSBmbjtcbn1cbmZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcbiAgICByYWYgPSBmbjtcbn1cblxuY29uc3QgdGFza3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrLmMobm93KSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFzay5mKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGFza3Muc2l6ZSAhPT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG59XG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKi9cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIHRhc2tzLmNsZWFyKCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKi9cbmZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcbiAgICBsZXQgdGFzaztcbiAgICBpZiAodGFza3Muc2l6ZSA9PT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IHsgYzogY2FsbGJhY2ssIGY6IGZ1bGZpbGwgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc19wcm9wKG9iaiwgaylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICYmIGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbmFtZSk7XG59XG5mdW5jdGlvbiB0ZXh0KGRhdGEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5mdW5jdGlvbiBzcGFjZSgpIHtcbiAgICByZXR1cm4gdGV4dCgnICcpO1xufVxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRleHQoJycpO1xufVxuZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2VsZihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKVxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgIGVsc2UgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgIT09IHZhbHVlKVxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldF9hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhub2RlLl9fcHJvdG9fXyk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoYXR0cmlidXRlc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmNzc1RleHQgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnX192YWx1ZScpIHtcbiAgICAgICAgICAgIG5vZGUudmFsdWUgPSBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVzY3JpcHRvcnNba2V5XSAmJiBkZXNjcmlwdG9yc1trZXldLnNldCkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHhsaW5rX2F0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlKGdyb3VwLCBfX3ZhbHVlLCBjaGVja2VkKSB7XG4gICAgY29uc3QgdmFsdWUgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLmFkZChncm91cFtpXS5fX3ZhbHVlKTtcbiAgICB9XG4gICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgIHZhbHVlLmRlbGV0ZShfX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20odmFsdWUpO1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2orK107XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZW1vdmUubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShyZW1vdmVba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnID8gc3ZnX2VsZW1lbnQobmFtZSkgOiBlbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dChkYXRhKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgel9pbmRleCA9IChwYXJzZUludChjb21wdXRlZF9zdHlsZS56SW5kZXgpIHx8IDApIC0gMTtcbiAgICBpZiAoY29tcHV0ZWRfc3R5bGUucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBpZnJhbWUgPSBlbGVtZW50KCdpZnJhbWUnKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGAgK1xuICAgICAgICBgb3ZlcmZsb3c6IGhpZGRlbjsgYm9yZGVyOiAwOyBvcGFjaXR5OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogJHt6X2luZGV4fTtgKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgY29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuICAgIGxldCB1bnN1YnNjcmliZTtcbiAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9IGBkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5gO1xuICAgICAgICB1bnN1YnNjcmliZSA9IGxpc3Rlbih3aW5kb3csICdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBpZnJhbWUuY29udGVudFdpbmRvdylcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmcmFtZS5zcmMgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICBpZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4oaWZyYW1lLmNvbnRlbnRXaW5kb3csICdyZXNpemUnLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGFwcGVuZChub2RlLCBpZnJhbWUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1bnN1YnNjcmliZSAmJiBpZnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZXRhY2goaWZyYW1lKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdG9nZ2xlX2NsYXNzKGVsZW1lbnQsIG5hbWUsIHRvZ2dsZSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0W3RvZ2dsZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xufVxuZnVuY3Rpb24gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoYW5jaG9yID0gbnVsbCkge1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxuY29uc3QgYWN0aXZlX2RvY3MgPSBuZXcgU2V0KCk7XG5sZXQgYWN0aXZlID0gMDtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBsZXQgaSA9IHN0ci5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5mdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG4gICAgY29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuICAgIGxldCBrZXlmcmFtZXMgPSAne1xcbic7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG4gICAgICAgIGNvbnN0IHQgPSBhICsgKGIgLSBhKSAqIGVhc2UocCk7XG4gICAgICAgIGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG4gICAgfVxuICAgIGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuICAgIGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuICAgIGNvbnN0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICBhY3RpdmVfZG9jcy5hZGQoZG9jKTtcbiAgICBjb25zdCBzdHlsZXNoZWV0ID0gZG9jLl9fc3ZlbHRlX3N0eWxlc2hlZXQgfHwgKGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0ID0gZG9jLmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3R5bGUnKSkuc2hlZXQpO1xuICAgIGNvbnN0IGN1cnJlbnRfcnVsZXMgPSBkb2MuX19zdmVsdGVfcnVsZXMgfHwgKGRvYy5fX3N2ZWx0ZV9ydWxlcyA9IHt9KTtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgY3VycmVudF9ydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6IGBgfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcbiAgICBjb25zdCBuZXh0ID0gcHJldmlvdXMuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKTtcbiAgICBjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG4gICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG4gICAgICAgIGFjdGl2ZSAtPSBkZWxldGVkO1xuICAgICAgICBpZiAoIWFjdGl2ZSlcbiAgICAgICAgICAgIGNsZWFyX3J1bGVzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYWN0aXZlX2RvY3MuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVzaGVldCA9IGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0O1xuICAgICAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICAgICAgZG9jLl9fc3ZlbHRlX3J1bGVzID0ge307XG4gICAgICAgIH0pO1xuICAgICAgICBhY3RpdmVfZG9jcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uYCk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiBmbihldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxubGV0IGZsdXNoaW5nID0gZmFsc2U7XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGlmIChmbHVzaGluZylcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgID8gd2luZG93XG4gICAgOiB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBnbG9iYWxUaGlzXG4gICAgICAgIDogZ2xvYmFsKTtcblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGRpcnR5LCBnZXRfa2V5LCBkeW5hbWljLCBjdHgsIGxpc3QsIGxvb2t1cCwgbm9kZSwgZGVzdHJveSwgY3JlYXRlX2VhY2hfYmxvY2ssIG5leHQsIGdldF9jb250ZXh0KSB7XG4gICAgbGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbiA9IGxpc3QubGVuZ3RoO1xuICAgIGxldCBpID0gbztcbiAgICBjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIG9sZF9pbmRleGVzW29sZF9ibG9ja3NbaV0ua2V5XSA9IGk7XG4gICAgY29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuICAgIGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZGVsdGFzID0gbmV3IE1hcCgpO1xuICAgIGkgPSBuO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgY2hpbGRfY3R4ID0gZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgYmxvY2sgPSBsb29rdXAuZ2V0KGtleSk7XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgIGJsb2NrID0gY3JlYXRlX2VhY2hfYmxvY2soa2V5LCBjaGlsZF9jdHgpO1xuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWMpIHtcbiAgICAgICAgICAgIGJsb2NrLnAoY2hpbGRfY3R4LCBkaXJ0eSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICByZXR1cm4gbmV3X2Jsb2Nrcztcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfa2V5cyhjdHgsIGxpc3QsIGdldF9jb250ZXh0LCBnZXRfa2V5KSB7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpKTtcbiAgICAgICAgaWYgKGtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhdmUgZHVwbGljYXRlIGtleXMgaW4gYSBrZXllZCBlYWNoYCk7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5hZGQoa2V5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldF9zcHJlYWRfdXBkYXRlKGxldmVscywgdXBkYXRlcykge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHt9O1xuICAgIGNvbnN0IHRvX251bGxfb3V0ID0ge307XG4gICAgY29uc3QgYWNjb3VudGVkX2ZvciA9IHsgJCRzY29wZTogMSB9O1xuICAgIGxldCBpID0gbGV2ZWxzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IG8gPSBsZXZlbHNbaV07XG4gICAgICAgIGNvbnN0IG4gPSB1cGRhdGVzW2ldO1xuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBuKSlcbiAgICAgICAgICAgICAgICAgICAgdG9fbnVsbF9vdXRba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhY2NvdW50ZWRfZm9yW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlW2tleV0gPSBuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWxzW2ldID0gbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRvX251bGxfb3V0KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB1cGRhdGUpKVxuICAgICAgICAgICAgdXBkYXRlW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG59XG5mdW5jdGlvbiBnZXRfc3ByZWFkX29iamVjdChzcHJlYWRfcHJvcHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHNwcmVhZF9wcm9wcyA9PT0gJ29iamVjdCcgJiYgc3ByZWFkX3Byb3BzICE9PSBudWxsID8gc3ByZWFkX3Byb3BzIDoge307XG59XG5cbi8vIHNvdXJjZTogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sXG5jb25zdCBib29sZWFuX2F0dHJpYnV0ZXMgPSBuZXcgU2V0KFtcbiAgICAnYWxsb3dmdWxsc2NyZWVuJyxcbiAgICAnYWxsb3dwYXltZW50cmVxdWVzdCcsXG4gICAgJ2FzeW5jJyxcbiAgICAnYXV0b2ZvY3VzJyxcbiAgICAnYXV0b3BsYXknLFxuICAgICdjaGVja2VkJyxcbiAgICAnY29udHJvbHMnLFxuICAgICdkZWZhdWx0JyxcbiAgICAnZGVmZXInLFxuICAgICdkaXNhYmxlZCcsXG4gICAgJ2Zvcm1ub3ZhbGlkYXRlJyxcbiAgICAnaGlkZGVuJyxcbiAgICAnaXNtYXAnLFxuICAgICdsb29wJyxcbiAgICAnbXVsdGlwbGUnLFxuICAgICdtdXRlZCcsXG4gICAgJ25vbW9kdWxlJyxcbiAgICAnbm92YWxpZGF0ZScsXG4gICAgJ29wZW4nLFxuICAgICdwbGF5c2lubGluZScsXG4gICAgJ3JlYWRvbmx5JyxcbiAgICAncmVxdWlyZWQnLFxuICAgICdyZXZlcnNlZCcsXG4gICAgJ3NlbGVjdGVkJ1xuXSk7XG5cbmNvbnN0IGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyID0gL1tcXHMnXCI+Lz1cXHV7RkREMH0tXFx1e0ZERUZ9XFx1e0ZGRkV9XFx1e0ZGRkZ9XFx1ezFGRkZFfVxcdXsxRkZGRn1cXHV7MkZGRkV9XFx1ezJGRkZGfVxcdXszRkZGRX1cXHV7M0ZGRkZ9XFx1ezRGRkZFfVxcdXs0RkZGRn1cXHV7NUZGRkV9XFx1ezVGRkZGfVxcdXs2RkZGRX1cXHV7NkZGRkZ9XFx1ezdGRkZFfVxcdXs3RkZGRn1cXHV7OEZGRkV9XFx1ezhGRkZGfVxcdXs5RkZGRX1cXHV7OUZGRkZ9XFx1e0FGRkZFfVxcdXtBRkZGRn1cXHV7QkZGRkV9XFx1e0JGRkZGfVxcdXtDRkZGRX1cXHV7Q0ZGRkZ9XFx1e0RGRkZFfVxcdXtERkZGRn1cXHV7RUZGRkV9XFx1e0VGRkZGfVxcdXtGRkZGRX1cXHV7RkZGRkZ9XFx1ezEwRkZGRX1cXHV7MTBGRkZGfV0vdTtcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2F0dHJpYnV0ZXMtMlxuLy8gaHR0cHM6Ly9pbmZyYS5zcGVjLndoYXR3Zy5vcmcvI25vbmNoYXJhY3RlclxuZnVuY3Rpb24gc3ByZWFkKGFyZ3MsIGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5jbGFzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzID0gY2xhc3Nlc190b19hZGQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzICs9ICcgJyArIGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICBlbHNlIGlmIChib29sZWFuX2F0dHJpYnV0ZXMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN0ciArPSBgICR7bmFtZX09XCIke1N0cmluZyh2YWx1ZSkucmVwbGFjZSgvXCIvZywgJyYjMzQ7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgZXNjYXBlZCA9IHtcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0Oydcbn07XG5mdW5jdGlvbiBlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBTdHJpbmcoaHRtbCkucmVwbGFjZSgvW1wiJyY8Pl0vZywgbWF0Y2ggPT4gZXNjYXBlZFttYXRjaF0pO1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cykge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBgICR7bmFtZX0ke3ZhbHVlID09PSB0cnVlID8gJycgOiBgPSR7dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KGVzY2FwZSh2YWx1ZSkpIDogYFwiJHt2YWx1ZX1cImB9YH1gO1xufVxuZnVuY3Rpb24gYWRkX2NsYXNzZXMoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzID8gYCBjbGFzcz1cIiR7Y2xhc3Nlc31cImAgOiBgYDtcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBvbl9tb3VudCwgb25fZGVzdHJveSwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG4gICAgZnJhZ21lbnQgJiYgZnJhZ21lbnQubSh0YXJnZXQsIGFuY2hvcik7XG4gICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdfb25fZGVzdHJveSA9IG9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgIGlmIChvbl9kZXN0cm95KSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG4gICAgICAgICAgICBydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcbiAgICB9KTtcbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCBwcm9wX3ZhbHVlcyA9IG9wdGlvbnMucHJvcHMgfHwge307XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQgPSB7XG4gICAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgICBjdHg6IG51bGwsXG4gICAgICAgIC8vIHN0YXRlXG4gICAgICAgIHByb3BzLFxuICAgICAgICB1cGRhdGU6IG5vb3AsXG4gICAgICAgIG5vdF9lcXVhbCxcbiAgICAgICAgYm91bmQ6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICAvLyBsaWZlY3ljbGVcbiAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICBvbl9kZXN0cm95OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5XG4gICAgfTtcbiAgICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgICAkJC5jdHggPSBpbnN0YW5jZVxuICAgICAgICA/IGluc3RhbmNlKGNvbXBvbmVudCwgcHJvcF92YWx1ZXMsIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5sKG5vZGVzKTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZGV0YWNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4yNC4wJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0RGF0YVwiLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25gKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuJGRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHdhcyBhbHJlYWR5IGRlc3Ryb3llZGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJGNhcHR1cmVfc3RhdGUoKSB7IH1cbiAgICAkaW5qZWN0X3N0YXRlKCkgeyB9XG59XG5mdW5jdGlvbiBsb29wX2d1YXJkKHRpbWVvdXQpIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSBzdGFydCA+IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5maW5pdGUgbG9vcCBkZXRlY3RlZGApO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgSHRtbFRhZywgU3ZlbHRlQ29tcG9uZW50LCBTdmVsdGVDb21wb25lbnREZXYsIFN2ZWx0ZUVsZW1lbnQsIGFjdGlvbl9kZXN0cm95ZXIsIGFkZF9hdHRyaWJ1dGUsIGFkZF9jbGFzc2VzLCBhZGRfZmx1c2hfY2FsbGJhY2ssIGFkZF9sb2NhdGlvbiwgYWRkX3JlbmRlcl9jYWxsYmFjaywgYWRkX3Jlc2l6ZV9saXN0ZW5lciwgYWRkX3RyYW5zZm9ybSwgYWZ0ZXJVcGRhdGUsIGFwcGVuZCwgYXBwZW5kX2RldiwgYXNzaWduLCBhdHRyLCBhdHRyX2RldiwgYmVmb3JlVXBkYXRlLCBiaW5kLCBiaW5kaW5nX2NhbGxiYWNrcywgYmxhbmtfb2JqZWN0LCBidWJibGUsIGNoZWNrX291dHJvcywgY2hpbGRyZW4sIGNsYWltX2NvbXBvbmVudCwgY2xhaW1fZWxlbWVudCwgY2xhaW1fc3BhY2UsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZXNjYXBlLCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldENvbnRleHQsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHQsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNfcHJvcCwgaWRlbnRpdHksIGluaXQsIGluc2VydCwgaW5zZXJ0X2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZnVuY3Rpb24sIGlzX3Byb21pc2UsIGxpc3RlbiwgbGlzdGVuX2RldiwgbG9vcCwgbG9vcF9ndWFyZCwgbWlzc2luZ19jb21wb25lbnQsIG1vdW50X2NvbXBvbmVudCwgbm9vcCwgbm90X2VxdWFsLCBub3csIG51bGxfdG9fZW1wdHksIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMsIG9uRGVzdHJveSwgb25Nb3VudCwgb25jZSwgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIHByZXZlbnRfZGVmYXVsdCwgcHJvcF9kZXYsIHF1ZXJ5X3NlbGVjdG9yX2FsbCwgcmFmLCBydW4sIHJ1bl9hbGwsIHNhZmVfbm90X2VxdWFsLCBzY2hlZHVsZV91cGRhdGUsIHNlbGVjdF9tdWx0aXBsZV92YWx1ZSwgc2VsZWN0X29wdGlvbiwgc2VsZWN0X29wdGlvbnMsIHNlbGVjdF92YWx1ZSwgc2VsZiwgc2V0Q29udGV4dCwgc2V0X2F0dHJpYnV0ZXMsIHNldF9jdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEsIHNldF9kYXRhLCBzZXRfZGF0YV9kZXYsIHNldF9pbnB1dF90eXBlLCBzZXRfaW5wdXRfdmFsdWUsIHNldF9ub3csIHNldF9yYWYsIHNldF9zdG9yZV92YWx1ZSwgc2V0X3N0eWxlLCBzZXRfc3ZnX2F0dHJpYnV0ZXMsIHNwYWNlLCBzcHJlYWQsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3Nsb3RzLCB2YWxpZGF0ZV9zdG9yZSwgeGxpbmtfYXR0ciB9O1xuIiwiaW1wb3J0IHsgbm9vcCwgc2FmZV9ub3RfZXF1YWwsIHN1YnNjcmliZSwgcnVuX2FsbCwgaXNfZnVuY3Rpb24gfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5leHBvcnQgeyBnZXRfc3RvcmVfdmFsdWUgYXMgZ2V0IH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG5jb25zdCBzdWJzY3JpYmVyX3F1ZXVlID0gW107XG4vKipcbiAqIENyZWF0ZXMgYSBgUmVhZGFibGVgIHN0b3JlIHRoYXQgYWxsb3dzIHJlYWRpbmcgYnkgc3Vic2NyaXB0aW9uLlxuICogQHBhcmFtIHZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXJ9c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiByZWFkYWJsZSh2YWx1ZSwgc3RhcnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmU6IHdyaXRhYmxlKHZhbHVlLCBzdGFydCkuc3Vic2NyaWJlLFxuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZSBhIGBXcml0YWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgYm90aCB1cGRhdGluZyBhbmQgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0geyo9fXZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXI9fXN0YXJ0IHN0YXJ0IGFuZCBzdG9wIG5vdGlmaWNhdGlvbnMgZm9yIHN1YnNjcmlwdGlvbnNcbiAqL1xuZnVuY3Rpb24gd3JpdGFibGUodmFsdWUsIHN0YXJ0ID0gbm9vcCkge1xuICAgIGxldCBzdG9wO1xuICAgIGNvbnN0IHN1YnNjcmliZXJzID0gW107XG4gICAgZnVuY3Rpb24gc2V0KG5ld192YWx1ZSkge1xuICAgICAgICBpZiAoc2FmZV9ub3RfZXF1YWwodmFsdWUsIG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICAgICAgaWYgKHN0b3ApIHsgLy8gc3RvcmUgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICBjb25zdCBydW5fcXVldWUgPSAhc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHNbMV0oKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5wdXNoKHMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bl9xdWV1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJfcXVldWUubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWVbaV1bMF0oc3Vic2NyaWJlcl9xdWV1ZVtpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG4gICAgICAgIHNldChmbih2YWx1ZSkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUocnVuLCBpbnZhbGlkYXRlID0gbm9vcCkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gW3J1biwgaW52YWxpZGF0ZV07XG4gICAgICAgIHN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydChzZXQpIHx8IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgcnVuKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaWJlcnMuaW5kZXhPZihzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICBzdG9wID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc2V0LCB1cGRhdGUsIHN1YnNjcmliZSB9O1xufVxuZnVuY3Rpb24gZGVyaXZlZChzdG9yZXMsIGZuLCBpbml0aWFsX3ZhbHVlKSB7XG4gICAgY29uc3Qgc2luZ2xlID0gIUFycmF5LmlzQXJyYXkoc3RvcmVzKTtcbiAgICBjb25zdCBzdG9yZXNfYXJyYXkgPSBzaW5nbGVcbiAgICAgICAgPyBbc3RvcmVzXVxuICAgICAgICA6IHN0b3JlcztcbiAgICBjb25zdCBhdXRvID0gZm4ubGVuZ3RoIDwgMjtcbiAgICByZXR1cm4gcmVhZGFibGUoaW5pdGlhbF92YWx1ZSwgKHNldCkgPT4ge1xuICAgICAgICBsZXQgaW5pdGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgcGVuZGluZyA9IDA7XG4gICAgICAgIGxldCBjbGVhbnVwID0gbm9vcDtcbiAgICAgICAgY29uc3Qgc3luYyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm4oc2luZ2xlID8gdmFsdWVzWzBdIDogdmFsdWVzLCBzZXQpO1xuICAgICAgICAgICAgaWYgKGF1dG8pIHtcbiAgICAgICAgICAgICAgICBzZXQocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFudXAgPSBpc19mdW5jdGlvbihyZXN1bHQpID8gcmVzdWx0IDogbm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdW5zdWJzY3JpYmVycyA9IHN0b3Jlc19hcnJheS5tYXAoKHN0b3JlLCBpKSA9PiBzdWJzY3JpYmUoc3RvcmUsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgICBwZW5kaW5nICY9IH4oMSA8PCBpKTtcbiAgICAgICAgICAgIGlmIChpbml0ZWQpIHtcbiAgICAgICAgICAgICAgICBzeW5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHBlbmRpbmcgfD0gKDEgPDwgaSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgc3luYygpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgICAgIHJ1bl9hbGwodW5zdWJzY3JpYmVycyk7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IGRlcml2ZWQsIHJlYWRhYmxlLCB3cml0YWJsZSB9O1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9LRVkgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHByZWxvYWQgPSAoKSA9PiAoe30pOyIsImNvbnN0IG5vRGVwdGggPSBbXCJ3aGl0ZVwiLCBcImJsYWNrXCIsIFwidHJhbnNwYXJlbnRcIl07XG5cbmZ1bmN0aW9uIGdldENsYXNzKHByb3AsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSB7XG4gIGlmIChub0RlcHRoLmluY2x1ZGVzKGNvbG9yKSkge1xuICAgIHJldHVybiBgJHtwcm9wfS0ke2NvbG9yfWA7XG4gIH1cbiAgcmV0dXJuIGAke3Byb3B9LSR7Y29sb3J9LSR7ZGVwdGggfHwgZGVmYXVsdERlcHRofSBgO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1dGlscyhjb2xvciwgZGVmYXVsdERlcHRoID0gNTAwKSB7XG4gIHJldHVybiB7XG4gICAgYmc6IGRlcHRoID0+IGdldENsYXNzKFwiYmdcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpLFxuICAgIGJvcmRlcjogZGVwdGggPT4gZ2V0Q2xhc3MoXCJib3JkZXJcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpLFxuICAgIHR4dDogZGVwdGggPT4gZ2V0Q2xhc3MoXCJ0ZXh0XCIsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSxcbiAgICBjYXJldDogZGVwdGggPT4gZ2V0Q2xhc3MoXCJjYXJldFwiLCBjb2xvciwgZGVwdGgsIGRlZmF1bHREZXB0aClcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKGNsYXNzZXMsIGRlZmF1bHRDbGFzc2VzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9XG4gICAgICAodHlwZW9mIGNsYXNzZXMgPT09IFwiZnVuY3Rpb25cIiA/IGNsYXNzZXMoZGVmYXVsdENsYXNzZXMpIDogY2xhc3NlcykgfHxcbiAgICAgIGRlZmF1bHRDbGFzc2VzO1xuXG4gICAgdGhpcy5jbGFzc2VzID0gdGhpcy5kZWZhdWx0cztcbiAgfVxuXG4gIGZsdXNoKCkge1xuICAgIHRoaXMuY2xhc3NlcyA9IHRoaXMuZGVmYXVsdHM7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV4dGVuZCguLi5mbnMpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc2VzO1xuICB9XG5cbiAgcmVwbGFjZShjbGFzc2VzLCBjb25kID0gdHJ1ZSkge1xuICAgIGlmIChjb25kICYmIGNsYXNzZXMpIHtcbiAgICAgIHRoaXMuY2xhc3NlcyA9IE9iamVjdC5rZXlzKGNsYXNzZXMpLnJlZHVjZShcbiAgICAgICAgKGFjYywgZnJvbSkgPT4gYWNjLnJlcGxhY2UobmV3IFJlZ0V4cChmcm9tLCBcImdcIiksIGNsYXNzZXNbZnJvbV0pLFxuICAgICAgICB0aGlzLmNsYXNzZXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmUoY2xhc3NlcywgY29uZCA9IHRydWUpIHtcbiAgICBpZiAoY29uZCAmJiBjbGFzc2VzKSB7XG4gICAgICB0aGlzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIC5zcGxpdChcIiBcIilcbiAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXIpID0+IGFjYy5yZXBsYWNlKG5ldyBSZWdFeHAoY3VyLCBcImdcIiksIFwiXCIpLFxuICAgICAgICAgIHRoaXMuY2xhc3Nlc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkKGNsYXNzTmFtZSwgY29uZCA9IHRydWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICghY29uZCB8fCAhY2xhc3NOYW1lKSByZXR1cm4gdGhpcztcblxuICAgIHN3aXRjaCAodHlwZW9mIGNsYXNzTmFtZSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5jbGFzc2VzICs9IGAgJHtjbGFzc05hbWV9IGA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgIHRoaXMuY2xhc3NlcyArPSBgICR7Y2xhc3NOYW1lKGRlZmF1bHRWYWx1ZSB8fCB0aGlzLmNsYXNzZXMpfSBgO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFJlc2VydmVkID0gW1wiY2xhc3NcIiwgXCJhZGRcIiwgXCJyZW1vdmVcIiwgXCJyZXBsYWNlXCIsIFwidmFsdWVcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJQcm9wcyhyZXNlcnZlZCwgcHJvcHMpIHtcbiAgY29uc3QgciA9IFsuLi5yZXNlcnZlZCwgLi4uZGVmYXVsdFJlc2VydmVkXTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShcbiAgICAoYWNjLCBjdXIpID0+XG4gICAgICBjdXIuaW5jbHVkZXMoXCIkJFwiKSB8fCBjdXIuaW5jbHVkZXMoXCJDbGFzc1wiKSB8fCByLmluY2x1ZGVzKGN1cilcbiAgICAgICAgPyBhY2NcbiAgICAgICAgOiB7IC4uLmFjYywgW2N1cl06IHByb3BzW2N1cl0gfSxcbiAgICB7fVxuICApO1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuXG5cblxuICBsZXQgY2xhc3Nlc0RlZmF1bHQgPVxuICAgIFwiZml4ZWQgdG9wLTAgdy1mdWxsIGl0ZW1zLWNlbnRlciBmbGV4LXdyYXAgIHotMzAgcC0wIGgtMTYgZWxldmF0aW9uLTMgYmctcHJpbWFyeS0zMDAgZGFyazpiZy1kYXJrLTYwMFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogYyA9IGNiLmZsdXNoKCkuYWRkKCQkcHJvcHMuY2xhc3MpLmdldCgpO1xuPC9zY3JpcHQ+XG5cbjxoZWFkZXIgY2xhc3M9e2N9PlxuICA8c2xvdCAvPlxuPC9oZWFkZXI+XG4iLCI8c2NyaXB0PlxuXG5cbiAgZXhwb3J0IGxldCBzbWFsbCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHhzID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcmV2ZXJzZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHRpcCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJkZWZhdWx0XCI7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAucmV2ZXJzZSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcbiAgfVxuXG4gIC50aXAge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcbiAgfVxuPC9zdHlsZT5cblxuPGlcbiAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBpY29uIHRleHQteGwgc2VsZWN0LW5vbmUgeyQkcHJvcHMuY2xhc3N9IGR1cmF0aW9uLTIwMCBlYXNlLWluXCJcbiAgY2xhc3M6cmV2ZXJzZVxuICBjbGFzczp0aXBcbiAgb246Y2xpY2tcbiAgY2xhc3M6dGV4dC1iYXNlPXtzbWFsbH1cbiAgY2xhc3M6dGV4dC14cz17eHN9XG4gIHN0eWxlPXtjb2xvciA/IGBjb2xvcjogJHtjb2xvcn1gIDogJyd9PlxuICA8c2xvdCAvPlxuPC9pPlxuIiwiLy8gVGhhbmtzIExhZ2RlbiEgaHR0cHM6Ly9zdmVsdGUuZGV2L3JlcGwvNjFkOTE3OGQyYjk5NDRmMmFhMmJmZTMxNjEyYWIwOWY/dmVyc2lvbj0zLjYuN1xuZnVuY3Rpb24gcmlwcGxlKGNvbG9yLCBjZW50ZXJlZCkge1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGNvbnN0IGQgPSBNYXRoLm1heCh0YXJnZXQuY2xpZW50V2lkdGgsIHRhcmdldC5jbGllbnRIZWlnaHQpO1xuXG4gICAgY29uc3QgcmVtb3ZlQ2lyY2xlID0gKCkgPT4ge1xuICAgICAgY2lyY2xlLnJlbW92ZSgpO1xuICAgICAgY2lyY2xlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgcmVtb3ZlQ2lyY2xlKTtcbiAgICB9O1xuXG4gICAgY2lyY2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgcmVtb3ZlQ2lyY2xlKTtcbiAgICBjaXJjbGUuc3R5bGUud2lkdGggPSBjaXJjbGUuc3R5bGUuaGVpZ2h0ID0gYCR7ZH1weGA7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGlmIChjZW50ZXJlZCkge1xuICAgICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgIFwiYWJzb2x1dGVcIixcbiAgICAgICAgXCJ0b3AtMFwiLFxuICAgICAgICBcImxlZnQtMFwiLFxuICAgICAgICBcInJpcHBsZS1jZW50ZXJlZFwiLFxuICAgICAgICBgYmctJHtjb2xvcn0tdHJhbnNEYXJrYFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2lyY2xlLnN0eWxlLmxlZnQgPSBgJHtldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0IC0gZCAvIDJ9cHhgO1xuICAgICAgY2lyY2xlLnN0eWxlLnRvcCA9IGAke2V2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIGQgLyAyfXB4YDtcblxuICAgICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJyaXBwbGUtbm9ybWFsXCIsIGBiZy0ke2NvbG9yfS10cmFuc2ApO1xuICAgIH1cblxuICAgIGNpcmNsZS5jbGFzc0xpc3QuYWRkKFwicmlwcGxlXCIpO1xuXG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGNpcmNsZSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHIoY29sb3IgPSBcInByaW1hcnlcIiwgY2VudGVyZWQgPSBmYWxzZSkge1xuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIGNvbnN0IG9uTW91c2VEb3duID0gcmlwcGxlKGNvbG9yLCBjZW50ZXJlZCk7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uTW91c2VEb3duKTtcblxuICAgIHJldHVybiB7XG4gICAgICBvbkRlc3Ryb3k6ICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbk1vdXNlRG93biksXG4gICAgfTtcbiAgfTtcbn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBJY29uIGZyb20gXCIuLi9JY29uXCI7XG4gIGltcG9ydCBjcmVhdGVSaXBwbGUgZnJvbSBcIi4uL1JpcHBsZS9yaXBwbGUuanNcIjtcbiAgaW1wb3J0IHV0aWxzLCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcImR1cmF0aW9uLTEwMCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW4gdGV4dC1jZW50ZXIgdy1mdWxsIGgtZnVsbCBwLTQgY3Vyc29yLXBvaW50ZXIgZmxleCBteC1hdXRvIGl0ZW1zLWNlbnRlciB0ZXh0LXNtIGgtZnVsbFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG4gIGV4cG9ydCBsZXQgaWNvbiA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgaWQgPSBcIlwiO1xuICBleHBvcnQgbGV0IHRleHQgPSBcIlwiO1xuICBleHBvcnQgbGV0IHRvID0gXCJcIjtcbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcInByaW1hcnlcIjtcbiAgZXhwb3J0IGxldCBub3RTZWxlY3RlZENvbG9yID0gXCJ3aGl0ZVwiO1xuICBleHBvcnQgbGV0IHRhYkNsYXNzZXMgPSBcImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGNvbnRlbnQtY2VudGVyIG14LWF1dG9cIjtcblxuXG5cblxuICBjb25zdCByaXBwbGUgPSBjcmVhdGVSaXBwbGUoY29sb3IpO1xuXG4gIGNvbnN0IHsgdHh0LCBiZyB9ID0gdXRpbHMoY29sb3IpO1xuICBjb25zdCBub3RTZWxlY3RlZCA9IHV0aWxzKG5vdFNlbGVjdGVkQ29sb3IpO1xuXG4gICQ6IHRleHRDb2xvciA9IHNlbGVjdGVkID09PSBpZCA/IHR4dCgpIDogbm90U2VsZWN0ZWQudHh0KCk7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoJCRwcm9wcy5jbGFzcylcbiAgICAuYWRkKFwidXBwZXJjYXNlXCIsIGljb24pXG4gICAgLmFkZCh0ZXh0Q29sb3IpXG4gICAgLmFkZChgaG92ZXI6YmctJHtjb2xvcn0tdHJhbnNMaWdodCBob3Zlcjoke3R4dCg5MDApfWApXG4gICAgLmdldCgpO1xuPC9zY3JpcHQ+XG5cbnsjaWYgdG99XG4gIDxhXG4gICAgdXNlOnJpcHBsZVxuICAgIGhyZWY9e3RvfVxuICAgIGNsYXNzPXtjfVxuICAgIG9uOmNsaWNrXG4gID5cbiAgICA8ZGl2IGNsYXNzPXt0YWJDbGFzc2VzfT5cbiAgICAgIHsjaWYgaWNvbn1cbiAgICAgICAgPEljb24gY2xhc3M9XCJtYi0xXCIgY29sb3I9e3RleHRDb2xvcn0+e2ljb259PC9JY29uPlxuICAgICAgey9pZn1cblxuICAgICAgPGRpdj5cbiAgICAgICAgPHNsb3Q+e3RleHR9PC9zbG90PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvYT5cbns6ZWxzZX1cbiAgPGxpXG4gICAgdXNlOnJpcHBsZVxuICAgIGNsYXNzPXtjfVxuICAgIG9uOmNsaWNrPXsoKSA9PiBzZWxlY3RlZCA9IGlkIH1cbiAgICBvbjpjbGlja1xuICA+XG4gICAgPGRpdiBjbGFzcz17dGFiQ2xhc3Nlc30+XG4gICAgICB7I2lmIGljb259XG4gICAgICAgIDxJY29uIGNsYXNzPVwibWItMVwiIGNvbG9yPXt0ZXh0Q29sb3J9PntpY29ufTwvSWNvbj5cbiAgICAgIHsvaWZ9XG5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxzbG90Pnt0ZXh0fTwvc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2xpPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpZCA9IG51bGw7XG48L3NjcmlwdD5cblxueyNpZiBzZWxlY3RlZCA9PT0gaWR9XG4gIDxzbG90IC8+XG57L2lmfVxuIiwiZXhwb3J0IHsgaWRlbnRpdHkgYXMgbGluZWFyIH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG4vKlxuQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0ZGVzbFxuRGlzdHJpYnV0ZWQgdW5kZXIgTUlUIExpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL21hdHRkZXNsL2Vhc2VzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiovXG5mdW5jdGlvbiBiYWNrSW5PdXQodCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4ICogMS41MjU7XG4gICAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqICh0ICogdCAqICgocyArIDEpICogdCAtIHMpKTtcbiAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqICgocyArIDEpICogdCArIHMpICsgMik7XG59XG5mdW5jdGlvbiBiYWNrSW4odCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4O1xuICAgIHJldHVybiB0ICogdCAqICgocyArIDEpICogdCAtIHMpO1xufVxuZnVuY3Rpb24gYmFja091dCh0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTg7XG4gICAgcmV0dXJuIC0tdCAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDE7XG59XG5mdW5jdGlvbiBib3VuY2VPdXQodCkge1xuICAgIGNvbnN0IGEgPSA0LjAgLyAxMS4wO1xuICAgIGNvbnN0IGIgPSA4LjAgLyAxMS4wO1xuICAgIGNvbnN0IGMgPSA5LjAgLyAxMC4wO1xuICAgIGNvbnN0IGNhID0gNDM1Ni4wIC8gMzYxLjA7XG4gICAgY29uc3QgY2IgPSAzNTQ0Mi4wIC8gMTgwNS4wO1xuICAgIGNvbnN0IGNjID0gMTYwNjEuMCAvIDE4MDUuMDtcbiAgICBjb25zdCB0MiA9IHQgKiB0O1xuICAgIHJldHVybiB0IDwgYVxuICAgICAgICA/IDcuNTYyNSAqIHQyXG4gICAgICAgIDogdCA8IGJcbiAgICAgICAgICAgID8gOS4wNzUgKiB0MiAtIDkuOSAqIHQgKyAzLjRcbiAgICAgICAgICAgIDogdCA8IGNcbiAgICAgICAgICAgICAgICA/IGNhICogdDIgLSBjYiAqIHQgKyBjY1xuICAgICAgICAgICAgICAgIDogMTAuOCAqIHQgKiB0IC0gMjAuNTIgKiB0ICsgMTAuNzI7XG59XG5mdW5jdGlvbiBib3VuY2VJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjVcbiAgICAgICAgPyAwLjUgKiAoMS4wIC0gYm91bmNlT3V0KDEuMCAtIHQgKiAyLjApKVxuICAgICAgICA6IDAuNSAqIGJvdW5jZU91dCh0ICogMi4wIC0gMS4wKSArIDAuNTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUluKHQpIHtcbiAgICByZXR1cm4gMS4wIC0gYm91bmNlT3V0KDEuMCAtIHQpO1xufVxuZnVuY3Rpb24gY2lyY0luT3V0KHQpIHtcbiAgICBpZiAoKHQgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHQgKiB0KSAtIDEpO1xuICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodCAtPSAyKSAqIHQpICsgMSk7XG59XG5mdW5jdGlvbiBjaXJjSW4odCkge1xuICAgIHJldHVybiAxLjAgLSBNYXRoLnNxcnQoMS4wIC0gdCAqIHQpO1xufVxuZnVuY3Rpb24gY2lyY091dCh0KSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCgxIC0gLS10ICogdCk7XG59XG5mdW5jdGlvbiBjdWJpY0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDQuMCAqIHQgKiB0ICogdCA6IDAuNSAqIE1hdGgucG93KDIuMCAqIHQgLSAyLjAsIDMuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBjdWJpY0luKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0O1xufVxuZnVuY3Rpb24gY3ViaWNPdXQodCkge1xuICAgIGNvbnN0IGYgPSB0IC0gMS4wO1xuICAgIHJldHVybiBmICogZiAqIGYgKyAxLjA7XG59XG5mdW5jdGlvbiBlbGFzdGljSW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41XG4gICAgICAgID8gMC41ICpcbiAgICAgICAgICAgIE1hdGguc2luKCgoKzEzLjAgKiBNYXRoLlBJKSAvIDIpICogMi4wICogdCkgKlxuICAgICAgICAgICAgTWF0aC5wb3coMi4wLCAxMC4wICogKDIuMCAqIHQgLSAxLjApKVxuICAgICAgICA6IDAuNSAqXG4gICAgICAgICAgICBNYXRoLnNpbigoKC0xMy4wICogTWF0aC5QSSkgLyAyKSAqICgyLjAgKiB0IC0gMS4wICsgMS4wKSkgKlxuICAgICAgICAgICAgTWF0aC5wb3coMi4wLCAtMTAuMCAqICgyLjAgKiB0IC0gMS4wKSkgK1xuICAgICAgICAgICAgMS4wO1xufVxuZnVuY3Rpb24gZWxhc3RpY0luKHQpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4oKDEzLjAgKiB0ICogTWF0aC5QSSkgLyAyKSAqIE1hdGgucG93KDIuMCwgMTAuMCAqICh0IC0gMS4wKSk7XG59XG5mdW5jdGlvbiBlbGFzdGljT3V0KHQpIHtcbiAgICByZXR1cm4gKE1hdGguc2luKCgtMTMuMCAqICh0ICsgMS4wKSAqIE1hdGguUEkpIC8gMikgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogdCkgKyAxLjApO1xufVxuZnVuY3Rpb24gZXhwb0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMC4wIHx8IHQgPT09IDEuMFxuICAgICAgICA/IHRcbiAgICAgICAgOiB0IDwgMC41XG4gICAgICAgICAgICA/ICswLjUgKiBNYXRoLnBvdygyLjAsIDIwLjAgKiB0IC0gMTAuMClcbiAgICAgICAgICAgIDogLTAuNSAqIE1hdGgucG93KDIuMCwgMTAuMCAtIHQgKiAyMC4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIGV4cG9Jbih0KSB7XG4gICAgcmV0dXJuIHQgPT09IDAuMCA/IHQgOiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpO1xufVxuZnVuY3Rpb24gZXhwb091dCh0KSB7XG4gICAgcmV0dXJuIHQgPT09IDEuMCA/IHQgOiAxLjAgLSBNYXRoLnBvdygyLjAsIC0xMC4wICogdCk7XG59XG5mdW5jdGlvbiBxdWFkSW5PdXQodCkge1xuICAgIHQgLz0gMC41O1xuICAgIGlmICh0IDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0O1xuICAgIHQtLTtcbiAgICByZXR1cm4gLTAuNSAqICh0ICogKHQgLSAyKSAtIDEpO1xufVxuZnVuY3Rpb24gcXVhZEluKHQpIHtcbiAgICByZXR1cm4gdCAqIHQ7XG59XG5mdW5jdGlvbiBxdWFkT3V0KHQpIHtcbiAgICByZXR1cm4gLXQgKiAodCAtIDIuMCk7XG59XG5mdW5jdGlvbiBxdWFydEluT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNVxuICAgICAgICA/ICs4LjAgKiBNYXRoLnBvdyh0LCA0LjApXG4gICAgICAgIDogLTguMCAqIE1hdGgucG93KHQgLSAxLjAsIDQuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBxdWFydEluKHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCwgNC4wKTtcbn1cbmZ1bmN0aW9uIHF1YXJ0T3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCAtIDEuMCwgMy4wKSAqICgxLjAgLSB0KSArIDEuMDtcbn1cbmZ1bmN0aW9uIHF1aW50SW5PdXQodCkge1xuICAgIGlmICgodCAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0ICogdDtcbiAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpO1xufVxuZnVuY3Rpb24gcXVpbnRJbih0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdCAqIHQgKiB0O1xufVxuZnVuY3Rpb24gcXVpbnRPdXQodCkge1xuICAgIHJldHVybiAtLXQgKiB0ICogdCAqIHQgKiB0ICsgMTtcbn1cbmZ1bmN0aW9uIHNpbmVJbk91dCh0KSB7XG4gICAgcmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHQpIC0gMSk7XG59XG5mdW5jdGlvbiBzaW5lSW4odCkge1xuICAgIGNvbnN0IHYgPSBNYXRoLmNvcyh0ICogTWF0aC5QSSAqIDAuNSk7XG4gICAgaWYgKE1hdGguYWJzKHYpIDwgMWUtMTQpXG4gICAgICAgIHJldHVybiAxO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIDEgLSB2O1xufVxuZnVuY3Rpb24gc2luZU91dCh0KSB7XG4gICAgcmV0dXJuIE1hdGguc2luKCh0ICogTWF0aC5QSSkgLyAyKTtcbn1cblxuZXhwb3J0IHsgYmFja0luLCBiYWNrSW5PdXQsIGJhY2tPdXQsIGJvdW5jZUluLCBib3VuY2VJbk91dCwgYm91bmNlT3V0LCBjaXJjSW4sIGNpcmNJbk91dCwgY2lyY091dCwgY3ViaWNJbiwgY3ViaWNJbk91dCwgY3ViaWNPdXQsIGVsYXN0aWNJbiwgZWxhc3RpY0luT3V0LCBlbGFzdGljT3V0LCBleHBvSW4sIGV4cG9Jbk91dCwgZXhwb091dCwgcXVhZEluLCBxdWFkSW5PdXQsIHF1YWRPdXQsIHF1YXJ0SW4sIHF1YXJ0SW5PdXQsIHF1YXJ0T3V0LCBxdWludEluLCBxdWludEluT3V0LCBxdWludE91dCwgc2luZUluLCBzaW5lSW5PdXQsIHNpbmVPdXQgfTtcbiIsImltcG9ydCB7IGN1YmljSW5PdXQsIGxpbmVhciwgY3ViaWNPdXQgfSBmcm9tICcuLi9lYXNpbmcnO1xuaW1wb3J0IHsgaXNfZnVuY3Rpb24sIGFzc2lnbiB9IGZyb20gJy4uL2ludGVybmFsJztcblxuLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbmZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxuXG5mdW5jdGlvbiBibHVyKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNJbk91dCwgYW1vdW50ID0gNSwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IGYgPSBzdHlsZS5maWx0ZXIgPT09ICdub25lJyA/ICcnIDogc3R5bGUuZmlsdGVyO1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfdCwgdSkgPT4gYG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX07IGZpbHRlcjogJHtmfSBibHVyKCR7dSAqIGFtb3VudH1weCk7YFxuICAgIH07XG59XG5mdW5jdGlvbiBmYWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gbGluZWFyIH0pIHtcbiAgICBjb25zdCBvID0gK2dldENvbXB1dGVkU3R5bGUobm9kZSkub3BhY2l0eTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiB0ID0+IGBvcGFjaXR5OiAke3QgKiBvfWBcbiAgICB9O1xufVxuZnVuY3Rpb24gZmx5KG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQsIHggPSAwLCB5ID0gMCwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgY29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgkeygxIC0gdCkgKiB4fXB4LCAkeygxIC0gdCkgKiB5fXB4KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX1gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNsaWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZS5oZWlnaHQpO1xuICAgIGNvbnN0IHBhZGRpbmdfdG9wID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKTtcbiAgICBjb25zdCBwYWRkaW5nX2JvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgY29uc3QgbWFyZ2luX3RvcCA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKTtcbiAgICBjb25zdCBtYXJnaW5fYm90dG9tID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pO1xuICAgIGNvbnN0IGJvcmRlcl90b3Bfd2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKTtcbiAgICBjb25zdCBib3JkZXJfYm90dG9tX3dpZHRoID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiBgb3ZlcmZsb3c6IGhpZGRlbjtgICtcbiAgICAgICAgICAgIGBvcGFjaXR5OiAke01hdGgubWluKHQgKiAyMCwgMSkgKiBvcGFjaXR5fTtgICtcbiAgICAgICAgICAgIGBoZWlnaHQ6ICR7dCAqIGhlaWdodH1weDtgICtcbiAgICAgICAgICAgIGBwYWRkaW5nLXRvcDogJHt0ICogcGFkZGluZ190b3B9cHg7YCArXG4gICAgICAgICAgICBgcGFkZGluZy1ib3R0b206ICR7dCAqIHBhZGRpbmdfYm90dG9tfXB4O2AgK1xuICAgICAgICAgICAgYG1hcmdpbi10b3A6ICR7dCAqIG1hcmdpbl90b3B9cHg7YCArXG4gICAgICAgICAgICBgbWFyZ2luLWJvdHRvbTogJHt0ICogbWFyZ2luX2JvdHRvbX1weDtgICtcbiAgICAgICAgICAgIGBib3JkZXItdG9wLXdpZHRoOiAke3QgKiBib3JkZXJfdG9wX3dpZHRofXB4O2AgK1xuICAgICAgICAgICAgYGJvcmRlci1ib3R0b20td2lkdGg6ICR7dCAqIGJvcmRlcl9ib3R0b21fd2lkdGh9cHg7YFxuICAgIH07XG59XG5mdW5jdGlvbiBzY2FsZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCBzdGFydCA9IDAsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgIGNvbnN0IHNkID0gMSAtIHN0YXJ0O1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfdCwgdSkgPT4gYFxuXHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gc2NhbGUoJHsxIC0gKHNkICogdSl9KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX1cblx0XHRgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRyYXcobm9kZSwgeyBkZWxheSA9IDAsIHNwZWVkLCBkdXJhdGlvbiwgZWFzaW5nID0gY3ViaWNJbk91dCB9KSB7XG4gICAgY29uc3QgbGVuID0gbm9kZS5nZXRUb3RhbExlbmd0aCgpO1xuICAgIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IDgwMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0gbGVuIC8gc3BlZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24obGVuKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBzdHJva2UtZGFzaGFycmF5OiAke3QgKiBsZW59ICR7dSAqIGxlbn1gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyb3NzZmFkZShfYSkge1xuICAgIHZhciB7IGZhbGxiYWNrIH0gPSBfYSwgZGVmYXVsdHMgPSBfX3Jlc3QoX2EsIFtcImZhbGxiYWNrXCJdKTtcbiAgICBjb25zdCB0b19yZWNlaXZlID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHRvX3NlbmQgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb24gY3Jvc3NmYWRlKGZyb20sIG5vZGUsIHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSBkID0+IE1hdGguc3FydChkKSAqIDMwLCBlYXNpbmcgPSBjdWJpY091dCB9ID0gYXNzaWduKGFzc2lnbih7fSwgZGVmYXVsdHMpLCBwYXJhbXMpO1xuICAgICAgICBjb25zdCB0byA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IGR4ID0gZnJvbS5sZWZ0IC0gdG8ubGVmdDtcbiAgICAgICAgY29uc3QgZHkgPSBmcm9tLnRvcCAtIHRvLnRvcDtcbiAgICAgICAgY29uc3QgZHcgPSBmcm9tLndpZHRoIC8gdG8ud2lkdGg7XG4gICAgICAgIGNvbnN0IGRoID0gZnJvbS5oZWlnaHQgLyB0by5oZWlnaHQ7XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlbGF5LFxuICAgICAgICAgICAgZHVyYXRpb246IGlzX2Z1bmN0aW9uKGR1cmF0aW9uKSA/IGR1cmF0aW9uKGQpIDogZHVyYXRpb24sXG4gICAgICAgICAgICBlYXNpbmcsXG4gICAgICAgICAgICBjc3M6ICh0LCB1KSA9PiBgXG5cdFx0XHRcdG9wYWNpdHk6ICR7dCAqIG9wYWNpdHl9O1xuXHRcdFx0XHR0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdDtcblx0XHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7dSAqIGR4fXB4LCR7dSAqIGR5fXB4KSBzY2FsZSgke3QgKyAoMSAtIHQpICogZHd9LCAke3QgKyAoMSAtIHQpICogZGh9KTtcblx0XHRcdGBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbihpdGVtcywgY291bnRlcnBhcnRzLCBpbnRybykge1xuICAgICAgICByZXR1cm4gKG5vZGUsIHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgaXRlbXMuc2V0KHBhcmFtcy5rZXksIHtcbiAgICAgICAgICAgICAgICByZWN0OiBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXJwYXJ0cy5oYXMocGFyYW1zLmtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyByZWN0IH0gPSBjb3VudGVycGFydHMuZ2V0KHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVycGFydHMuZGVsZXRlKHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Jvc3NmYWRlKHJlY3QsIG5vZGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBub2RlIGlzIGRpc2FwcGVhcmluZyBhbHRvZ2V0aGVyXG4gICAgICAgICAgICAgICAgLy8gKGkuZS4gd2Fzbid0IGNsYWltZWQgYnkgdGhlIG90aGVyIGxpc3QpXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBuZWVkIHRvIHN1cHBseSBhbiBvdXRyb1xuICAgICAgICAgICAgICAgIGl0ZW1zLmRlbGV0ZShwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsbGJhY2sgJiYgZmFsbGJhY2sobm9kZSwgcGFyYW1zLCBpbnRybyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgICB0cmFuc2l0aW9uKHRvX3NlbmQsIHRvX3JlY2VpdmUsIGZhbHNlKSxcbiAgICAgICAgdHJhbnNpdGlvbih0b19yZWNlaXZlLCB0b19zZW5kLCB0cnVlKVxuICAgIF07XG59XG5cbmV4cG9ydCB7IGJsdXIsIGNyb3NzZmFkZSwgZHJhdywgZmFkZSwgZmx5LCBzY2FsZSwgc2xpZGUgfTtcbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB1dGlscyBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuXG4gIGV4cG9ydCBsZXQgd2lkdGggPSAwO1xuICBleHBvcnQgbGV0IGxlZnQgPSAwO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG5cbiAgY29uc3QgeyBiZyB9ID0gdXRpbHMoY29sb3IpO1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgdHJhbnNpdGlvbiB7YmcoNzAwKX1cIlxuICBjbGFzczpoaWRkZW49e2xlZnQgPCAwfVxuICBzdHlsZT1cIndpZHRoOiB7d2lkdGh9cHg7IGxlZnQ6IHtsZWZ0fXB4OyBoZWlnaHQ6IDJweDtcIlxuICB0cmFuc2l0aW9uOnNsaWRlIC8+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xuICBpbXBvcnQgeyBzbGlkZSB9IGZyb20gXCJzdmVsdGUvdHJhbnNpdGlvblwiO1xuXG4gIGV4cG9ydCBsZXQgYXBwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcHJvZ3Jlc3MgPSAwO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG5cbiAgbGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgb25Nb3VudCgoKSA9PiB7XG4gICAgaWYgKCFhcHApIHJldHVybjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgLyoga3Vkb3MgaHR0cHM6Ly9jb2RlcGVuLmlvL3NoYWxpbWFuby9wZW4vd0JtTkdKICovXG4gIC5pbmMge1xuICAgIGFuaW1hdGlvbjogaW5jcmVhc2UgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gIH1cbiAgLmRlYyB7XG4gICAgYW5pbWF0aW9uOiBkZWNyZWFzZSAycyAwLjlzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICB9XG5cbiAgQGtleWZyYW1lcyBpbmNyZWFzZSB7XG4gICAgZnJvbSB7XG4gICAgICBsZWZ0OiAtNSU7XG4gICAgICB3aWR0aDogNSU7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgIGxlZnQ6IDEzMCU7XG4gICAgICB3aWR0aDogMTUwJTtcbiAgICB9XG4gIH1cbiAgQGtleWZyYW1lcyBkZWNyZWFzZSB7XG4gICAgZnJvbSB7XG4gICAgICBsZWZ0OiAtOTAlO1xuICAgICAgd2lkdGg6IDkwJTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgbGVmdDogMTEwJTtcbiAgICAgIHdpZHRoOiAxMCU7XG4gICAgfVxuICB9XG48L3N0eWxlPlxuXG48ZGl2XG4gIGNsYXNzOmZpeGVkPXthcHB9XG4gIGNsYXNzOnotNTA9e2FwcH1cbiAgY2xhc3M9XCJ0b3AtMCBsZWZ0LTAgdy1mdWxsIGgtMSBiZy17Y29sb3J9LTEwMCBvdmVyZmxvdy1oaWRkZW4gcmVsYXRpdmVcIlxuICBjbGFzczpoaWRkZW49e2FwcCAmJiAhaW5pdGlhbGl6ZWR9XG4gIHRyYW5zaXRpb246c2xpZGU9e3sgZHVyYXRpb246IDMwMCB9fT5cbiAgPGRpdlxuICAgIGNsYXNzPVwiYmcte2NvbG9yfS01MDAgaC0xIGFic29sdXRlXCJcbiAgICBjbGFzczppbmM9eyFwcm9ncmVzc31cbiAgICBjbGFzczp0cmFuc2l0aW9uPXtwcm9ncmVzc31cbiAgICBzdHlsZT17cHJvZ3Jlc3MgPyBgd2lkdGg6ICR7cHJvZ3Jlc3N9JWAgOiBcIlwifSAvPlxuICA8ZGl2IGNsYXNzPVwiYmcte2NvbG9yfS01MDAgaC0xIGFic29sdXRlIGRlY1wiIGNsYXNzOmhpZGRlbj17cHJvZ3Jlc3N9IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgaW1wb3J0IEluZGljYXRvciBmcm9tIFwiLi9JbmRpY2F0b3Iuc3ZlbHRlXCI7XG4gIGltcG9ydCBQcm9ncmVzc0xpbmVhciBmcm9tIFwiLi4vUHJvZ3Jlc3NMaW5lYXJcIjtcbiAgaW1wb3J0IFRhYkJ1dHRvbiBmcm9tIFwiLi9UYWJCdXR0b24uc3ZlbHRlXCI7XG5cbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9IG51bGw7XG4gIGV4cG9ydCBsZXQgbmF2aWdhdGlvbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGl0ZW1zID0gW107XG4gIGV4cG9ydCBsZXQgaW5kaWNhdG9yID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwid2hpdGVcIjtcbiAgZXhwb3J0IGxldCBub3RTZWxlY3RlZENvbG9yID0gXCJ3aGl0ZVwiO1xuXG5cbiAgZXhwb3J0IGxldCBsb2FkaW5nID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGFiQnV0dG9uQ2xhc3NlcyA9IGkgPT4gaTtcblxuICBsZXQgbm9kZTtcbiAgbGV0IGluZGljYXRvcldpZHRoID0gMDtcbiAgbGV0IGluZGljYXRvck9mZnNldCA9IDA7XG4gIGxldCBvZmZzZXQgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIGNhbGNJbmRpY2F0b3IoKSB7XG4gICAgaW5kaWNhdG9yV2lkdGggPSBub2RlID8gbm9kZS5vZmZzZXRXaWR0aCAvIGl0ZW1zLmxlbmd0aCA6IDA7XG5cbiAgICBsZXQgbGVmdCA9IDA7XG4gICAgaWYgKHNlbGVjdGVkICYmIGl0ZW1zLmZpbmRJbmRleChpID0+IHNlbGVjdGVkLmluY2x1ZGVzKGkudG8gfHwgaS5pZCkpICE9PSAtMSkge1xuICAgICAgY29uc3QgbG9uZ2VzdE1hdGNoID0gaXRlbXNcbiAgICAgICAgLm1hcCgoaXRlbSwgaW5kZXgpID0+IFtpbmRleCwgaXRlbV0pXG4gICAgICAgIC5maWx0ZXIoKFtpbmRleCwgaXRlbV0pID0+IHNlbGVjdGVkLmluY2x1ZGVzKGl0ZW0udG8gfHwgaXRlbS5pZCkpXG4gICAgICAgIC5zb3J0KFxuICAgICAgICAgIChbaW5kZXgxLCBpdGVtMV0sIFtpbmRleDIsIGl0ZW0yXSkgPT5cbiAgICAgICAgICAgIChpdGVtMi50byB8fCBpdGVtMi5pZCkubGVuZ3RoIC0gKGl0ZW0xLnRvIHx8IGl0ZW0xLmlkKS5sZW5ndGhcbiAgICAgICAgKVswXTtcblxuICAgICAgaWYgKGxvbmdlc3RNYXRjaCkge1xuICAgICAgICBsZWZ0ID0gbG9uZ2VzdE1hdGNoWzBdO1xuICAgICAgICBvZmZzZXQgPSBsZWZ0ICogaW5kaWNhdG9yV2lkdGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VudCgoKSA9PiBjYWxjSW5kaWNhdG9yKHNlbGVjdGVkKSk7XG5cbiAgJDogY2FsY0luZGljYXRvcihzZWxlY3RlZCk7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcInktMCBoLWZ1bGwgaXRlbXMtY2VudGVyIHJlbGF0aXZlIG14LWF1dG8gei0yMFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5hZGQoJ2hpZGRlbiBtZDpmbGV4IHctZnVsbCBtYXgtdy0yeGwnLCBuYXZpZ2F0aW9uKVxuICAgIC5hZGQoJ2ZsZXgnLCAhbmF2aWdhdGlvbilcbiAgICAuZ2V0KCk7XG48L3NjcmlwdD5cblxuPGRpdlxuICBjbGFzcz17Y31cbiAgYmluZDp0aGlzPXtub2RlfT5cbiAgeyNlYWNoIGl0ZW1zIGFzIGl0ZW0sIGl9XG4gICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB7Y29sb3J9IHtpdGVtfT5cbiAgICAgIDxUYWJCdXR0b25cbiAgICAgICAgY2xhc3M9e3RhYkJ1dHRvbkNsYXNzZXN9XG4gICAgICAgIGJpbmQ6c2VsZWN0ZWRcbiAgICAgICAgey4uLml0ZW19XG4gICAgICAgIHtjb2xvcn1cbiAgICAgICAge25vdFNlbGVjdGVkQ29sb3J9XG4gICAgICA+e2l0ZW0udGV4dH08L1RhYkJ1dHRvbj5cbiAgICA8L3Nsb3Q+XG4gIHsvZWFjaH1cbiAgeyNpZiBpbmRpY2F0b3IgJiYgb2Zmc2V0ICE9PSBudWxsfVxuICAgIDxJbmRpY2F0b3Ige2NvbG9yfSB3aWR0aD17aW5kaWNhdG9yV2lkdGh9IGxlZnQ9e29mZnNldH0gLz5cbiAgey9pZn1cbjwvZGl2PlxueyNpZiBsb2FkaW5nfVxuICA8UHJvZ3Jlc3NMaW5lYXIge2NvbG9yfSAvPlxuey9pZn1cblxuPHNsb3Qge3NlbGVjdGVkfSBuYW1lPVwiY29udGVudFwiIC8+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgSWNvbiBmcm9tIFwiLi4vSWNvblwiO1xuICBpbXBvcnQgdXRpbHMsIHsgQ2xhc3NCdWlsZGVyLCBmaWx0ZXJQcm9wcyB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG4gIGltcG9ydCBjcmVhdGVSaXBwbGUgZnJvbSBcIi4uL1JpcHBsZS9yaXBwbGUuanNcIjtcblxuXG5cbiAgZXhwb3J0IGxldCB2YWx1ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG91dGxpbmVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGV4dCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGJsb2NrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpY29uID0gbnVsbDtcbiAgZXhwb3J0IGxldCBzbWFsbCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGxpZ2h0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGFyayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGZsYXQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpY29uQ2xhc3MgPSBcIlwiO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG4gIGV4cG9ydCBsZXQgaHJlZiA9IG51bGw7XG4gIGV4cG9ydCBsZXQgZmFiID0gZmFsc2U7XG5cbiAgZXhwb3J0IGxldCByZW1vdmUgPSBcIlwiO1xuICBleHBvcnQgbGV0IGFkZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgcmVwbGFjZSA9IHt9O1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gJ3otMTAgcHktMiBweC00IHVwcGVyY2FzZSB0ZXh0LXNtIGZvbnQtbWVkaXVtIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbic7XG4gIGNvbnN0IGJhc2ljRGVmYXVsdCA9ICd0ZXh0LXdoaXRlIGR1cmF0aW9uLTIwMCBlYXNlLWluJztcblxuICBjb25zdCBvdXRsaW5lZERlZmF1bHQgPSAnYmctdHJhbnNwYXJlbnQgYm9yZGVyIGJvcmRlci1zb2xpZCc7XG4gIGNvbnN0IHRleHREZWZhdWx0ID0gJ2JnLXRyYW5zcGFyZW50IGJvcmRlci1ub25lIHB4LTQgaG92ZXI6YmctdHJhbnNwYXJlbnQnO1xuICBjb25zdCBpY29uRGVmYXVsdCA9ICdwLTQgZmxleCBpdGVtcy1jZW50ZXIgc2VsZWN0LW5vbmUnO1xuICBjb25zdCBmYWJEZWZhdWx0ID0gJ2hvdmVyOmJnLXRyYW5zcGFyZW50JztcbiAgY29uc3Qgc21hbGxEZWZhdWx0ID0gJ3B0LTEgcGItMSBwbC0yIHByLTIgdGV4dC14cyc7XG4gIGNvbnN0IGRpc2FibGVkRGVmYXVsdCA9ICdiZy1ncmF5LTMwMCB0ZXh0LWdyYXktNTAwIGRhcms6YmctZGFyay00MDAgZWxldmF0aW9uLW5vbmUgcG9pbnRlci1ldmVudHMtbm9uZSBob3ZlcjpiZy1ncmF5LTMwMCBjdXJzb3ItZGVmYXVsdCc7XG4gIGNvbnN0IGVsZXZhdGlvbkRlZmF1bHQgPSAnaG92ZXI6ZWxldmF0aW9uLTUgZWxldmF0aW9uLTMnO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IGJhc2ljQ2xhc3NlcyA9IGJhc2ljRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBvdXRsaW5lZENsYXNzZXMgPSBvdXRsaW5lZERlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgdGV4dENsYXNzZXMgPSB0ZXh0RGVmYXVsdDtcbiAgZXhwb3J0IGxldCBpY29uQ2xhc3NlcyA9IGljb25EZWZhdWx0O1xuICBleHBvcnQgbGV0IGZhYkNsYXNzZXMgPSBmYWJEZWZhdWx0O1xuICBleHBvcnQgbGV0IHNtYWxsQ2xhc3NlcyA9IHNtYWxsRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBkaXNhYmxlZENsYXNzZXMgPSBkaXNhYmxlZERlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgZWxldmF0aW9uQ2xhc3NlcyA9IGVsZXZhdGlvbkRlZmF1bHQ7XG5cbiAgZmFiID0gZmFiIHx8ICh0ZXh0ICYmIGljb24pO1xuICBjb25zdCBiYXNpYyA9ICFvdXRsaW5lZCAmJiAhdGV4dCAmJiAhZmFiO1xuICBjb25zdCBlbGV2YXRpb24gPSAoYmFzaWMgfHwgaWNvbikgJiYgIWRpc2FibGVkICYmICFmbGF0ICYmICF0ZXh0O1xuXG4gIGxldCBDbGFzc2VzID0gaSA9PiBpO1xuICBsZXQgaUNsYXNzZXMgPSBpID0+IGk7XG4gIGxldCBzaGFkZSA9IDA7XG5cbiAgJDoge1xuICAgIHNoYWRlID0gbGlnaHQgPyAyMDAgOiAwO1xuICAgIHNoYWRlID0gZGFyayA/IC00MDAgOiBzaGFkZTtcbiAgfVxuICAkOiBub3JtYWwgPSA1MDAgLSBzaGFkZTtcbiAgJDogbGlnaHRlciA9IDQwMCAtIHNoYWRlO1xuXG4gIGNvbnN0IHtcbiAgICBiZyxcbiAgICBib3JkZXIsXG4gICAgdHh0LFxuICB9ID0gdXRpbHMoY29sb3IpO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gIGxldCBpY29uQ2I7XG5cbiAgaWYgKGljb24pIHtcbiAgICBpY29uQ2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGljb25DbGFzcyk7XG4gIH1cblxuICAkOiBjbGFzc2VzID0gY2JcbiAgICAgIC5mbHVzaCgpXG4gICAgICAuYWRkKGJhc2ljQ2xhc3NlcywgYmFzaWMsIGJhc2ljRGVmYXVsdClcbiAgICAgIC5hZGQoYCR7Ymcobm9ybWFsKX0gaG92ZXI6JHtiZyhsaWdodGVyKX1gLCBiYXNpYylcbiAgICAgIC5hZGQoZWxldmF0aW9uQ2xhc3NlcywgZWxldmF0aW9uLCBlbGV2YXRpb25EZWZhdWx0KVxuICAgICAgLmFkZChvdXRsaW5lZENsYXNzZXMsIG91dGxpbmVkLCBvdXRsaW5lZERlZmF1bHQpXG4gICAgICAuYWRkKFxuICAgICAgICBgJHtib3JkZXIobGlnaHRlcil9ICR7dHh0KG5vcm1hbCl9IGhvdmVyOiR7YmcoXCJ0cmFuc1wiKX0gZGFyay1ob3Zlcjoke2JnKFwidHJhbnNEYXJrXCIpfWAsXG4gICAgICAgIG91dGxpbmVkKVxuICAgICAgLmFkZChgJHt0eHQobGlnaHRlcil9YCwgdGV4dClcbiAgICAgIC5hZGQodGV4dENsYXNzZXMsIHRleHQsIHRleHREZWZhdWx0KVxuICAgICAgLmFkZChpY29uQ2xhc3NlcywgaWNvbiwgaWNvbkRlZmF1bHQpXG4gICAgICAucmVtb3ZlKFwicHktMlwiLCBpY29uKVxuICAgICAgLnJlbW92ZSh0eHQobGlnaHRlciksIGZhYilcbiAgICAgIC5hZGQoZGlzYWJsZWRDbGFzc2VzLCBkaXNhYmxlZCwgZGlzYWJsZWREZWZhdWx0KVxuICAgICAgLmFkZChzbWFsbENsYXNzZXMsIHNtYWxsLCBzbWFsbERlZmF1bHQpXG4gICAgICAuYWRkKFwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgaC04IHctOFwiLCBzbWFsbCAmJiBpY29uKVxuICAgICAgLmFkZChcImJvcmRlci1zb2xpZFwiLCBvdXRsaW5lZClcbiAgICAgIC5hZGQoXCJyb3VuZGVkLWZ1bGxcIiwgaWNvbilcbiAgICAgIC5hZGQoXCJ3LWZ1bGxcIiwgYmxvY2spXG4gICAgICAuYWRkKFwicm91bmRlZFwiLCBiYXNpYyB8fCBvdXRsaW5lZCB8fCB0ZXh0KVxuICAgICAgLmFkZChcImJ1dHRvblwiLCAhaWNvbilcbiAgICAgIC5hZGQoZmFiQ2xhc3NlcywgZmFiLCBmYWJEZWZhdWx0KVxuICAgICAgLmFkZChgaG92ZXI6JHtiZyhcInRyYW5zTGlnaHRcIil9YCwgZmFiKVxuICAgICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgICAgLnJlbW92ZShyZW1vdmUpXG4gICAgICAucmVwbGFjZShyZXBsYWNlKVxuICAgICAgLmFkZChhZGQpXG4gICAgICAuZ2V0KCk7XG5cbiAgJDogaWYgKGljb25DYikge1xuICAgIGlDbGFzc2VzID0gaWNvbkNiLmZsdXNoKCkuYWRkKHR4dCgpLCBmYWIgJiYgIWljb25DbGFzcykuZ2V0KCk7XG4gIH1cblxuICBjb25zdCByaXBwbGUgPSBjcmVhdGVSaXBwbGUoKHRleHQgfHwgZmFiIHx8IG91dGxpbmVkKSA/IGNvbG9yIDogXCJ3aGl0ZVwiKTtcblxuICBjb25zdCBwcm9wcyA9IGZpbHRlclByb3BzKFtcbiAgICAnb3V0bGluZWQnLFxuICAgICd0ZXh0JyxcbiAgICAnY29sb3InLFxuICAgICdibG9jaycsXG4gICAgJ2Rpc2FibGVkJyxcbiAgICAnaWNvbicsXG4gICAgJ3NtYWxsJyxcbiAgICAnbGlnaHQnLFxuICAgICdkYXJrJyxcbiAgICAnZmxhdCcsXG4gICAgJ2FkZCcsXG4gICAgJ3JlbW92ZScsXG4gICAgJ3JlcGxhY2UnLFxuICBdLCAkJHByb3BzKTtcbjwvc2NyaXB0PlxuXG5cbnsjaWYgaHJlZn1cbiAgPGFcbiAgICB7aHJlZn1cbiAgICB7Li4ucHJvcHN9XG4gID5cbiAgICA8YnV0dG9uXG4gICAgICB1c2U6cmlwcGxlXG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIG9uOmNsaWNrPXsoKSA9PiAodmFsdWUgPSAhdmFsdWUpfVxuICAgICAgb246Y2xpY2tcbiAgICAgIG9uOm1vdXNlb3ZlclxuICAgICAgb246KlxuICAgID5cbiAgICAgIHsjaWYgaWNvbn1cbiAgICAgICAgPEljb24gY2xhc3M9e2lDbGFzc2VzfSB7c21hbGx9PntpY29ufTwvSWNvbj5cbiAgICAgIHsvaWZ9XG4gICAgICA8c2xvdCAvPlxuICAgIDwvYnV0dG9uPlxuICA8L2E+XG57OmVsc2V9XG4gIDxidXR0b25cbiAgICB1c2U6cmlwcGxlXG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgey4uLnByb3BzfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGljaz17KCkgPT4gKHZhbHVlID0gIXZhbHVlKX1cbiAgICBvbjpjbGlja1xuICAgIG9uOm1vdXNlb3ZlclxuICAgIG9uOipcbiAgPlxuICAgIHsjaWYgaWNvbn1cbiAgICAgIDxJY29uIGNsYXNzPXtpQ2xhc3Nlc30ge3NtYWxsfT57aWNvbn08L0ljb24+XG4gICAgey9pZn1cbiAgICA8c2xvdCAvPlxuICA8L2J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IHF1YWRPdXQsIHF1YWRJbiB9IGZyb20gXCJzdmVsdGUvZWFzaW5nXCI7XG5cbiAgZXhwb3J0IGxldCBvcGFjaXR5ID0gMC41O1xuICBleHBvcnQgbGV0IGluUHJvcHMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogcXVhZEluIH07XG4gIGV4cG9ydCBsZXQgb3V0UHJvcHMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogcXVhZE91dCB9O1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJiZy1ibGFjayBmaXhlZCB0b3AtMCBsZWZ0LTAgei0xMCB3LWZ1bGwgaC1mdWxsXCJcbiAgc3R5bGU9XCJvcGFjaXR5OiB7b3BhY2l0eX1cIlxuICBpbjpmYWRlPXtpblByb3BzfVxuICBvdXQ6ZmFkZT17b3V0UHJvcHN9XG4gIG9uOmNsaWNrIC8+XG4iLCJpbXBvcnQgc2NyaW0gZnJvbSBcIi4vU2NyaW0uc3ZlbHRlXCI7XG5pbXBvcnQgc3BhY2VyIGZyb20gXCIuL1NwYWNlci5zdmVsdGVcIjtcblxuZXhwb3J0IGNvbnN0IFNjcmltID0gc2NyaW07XG5leHBvcnQgY29uc3QgU3BhY2VyID0gc3BhY2VyO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFNjcmltLFxuICBTcGFjZXJcbn07XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBDbGFzc0J1aWxkZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XG4gIGltcG9ydCBJY29uIGZyb20gXCIuLi9JY29uXCI7XG4gIGltcG9ydCBjcmVhdGVSaXBwbGUgZnJvbSBcIi4uL1JpcHBsZS9yaXBwbGUuanNcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwiZm9jdXM6YmctZ3JheS01MCBkYXJrLWZvY3VzOmJnLWdyYXktNzAwIGhvdmVyOmJnLWdyYXktdHJhbnNEYXJrIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiBkdXJhdGlvbi0xMDAgcC00IGN1cnNvci1wb2ludGVyIHRleHQtZ3JheS03MDAgZGFyazp0ZXh0LWdyYXktMTAwIGZsZXggaXRlbXMtY2VudGVyIHotMTBcIjtcbiAgY29uc3Qgc2VsZWN0ZWRDbGFzc2VzRGVmYXVsdCA9IFwiYmctZ3JheS0yMDAgZGFyazpiZy1wcmltYXJ5LXRyYW5zTGlnaHRcIjtcbiAgY29uc3Qgc3ViaGVhZGluZ0NsYXNzZXNEZWZhdWx0ID0gXCJ0ZXh0LWdyYXktNjAwIHAtMCB0ZXh0LXNtXCI7XG5cbiAgZXhwb3J0IGxldCBpY29uID0gXCJcIjtcbiAgZXhwb3J0IGxldCBpZCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdmFsdWUgPSBcIlwiO1xuICBleHBvcnQgbGV0IHRleHQgPSBcIlwiO1xuICBleHBvcnQgbGV0IHN1YmhlYWRpbmcgPSBcIlwiO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGVuc2UgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZWxlY3RlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHRhYmluZGV4ID0gbnVsbDtcbiAgZXhwb3J0IGxldCBzZWxlY3RlZENsYXNzZXMgPSBzZWxlY3RlZENsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IHN1YmhlYWRpbmdDbGFzc2VzID0gc3ViaGVhZGluZ0NsYXNzZXNEZWZhdWx0O1xuXG5cblxuXG4gIGV4cG9ydCBsZXQgdG8gPSBcIlwiO1xuICBleHBvcnQgY29uc3QgaXRlbSA9IG51bGw7XG4gIGV4cG9ydCBjb25zdCBpdGVtcyA9IFtdO1xuICBleHBvcnQgY29uc3QgbGV2ZWwgPSBudWxsO1xuXG4gIGNvbnN0IHJpcHBsZSA9IGNyZWF0ZVJpcHBsZSgpO1xuICBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZSgpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHJldHVybjtcbiAgICB2YWx1ZSA9IGlkO1xuICAgIGRpc3BhdGNoKCdjaGFuZ2UnLCBpZCwgdG8pO1xuICB9XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKHNlbGVjdGVkQ2xhc3Nlcywgc2VsZWN0ZWQsIHNlbGVjdGVkQ2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZChcInB5LTJcIiwgZGVuc2UpXG4gICAgLmFkZChcInRleHQtZ3JheS02MDBcIiwgZGlzYWJsZWQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5nZXQoKTtcbjwvc2NyaXB0PlxuXG48bGlcbiAgdXNlOnJpcHBsZVxuICBjbGFzcz17Y31cbiAge3RhYmluZGV4fVxuICBvbjprZXlwcmVzcz17Y2hhbmdlfVxuICBvbjpjbGljaz17Y2hhbmdlfVxuICBvbjpjbGljaz5cbiAgeyNpZiBpY29ufVxuICAgIDxJY29uXG4gICAgICBjbGFzcz1cInByLTZcIlxuICAgICAgc21hbGw9e2RlbnNlfVxuICAgID5cbiAgICAgIHtpY29ufVxuICAgIDwvSWNvbj5cbiAgey9pZn1cblxuICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbCBwLTBcIj5cbiAgICA8ZGl2IGNsYXNzPXskJHByb3BzLmNsYXNzfT5cbiAgICAgIDxzbG90Pnt0ZXh0fTwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgICB7I2lmIHN1YmhlYWRpbmd9XG4gICAgICA8ZGl2IGNsYXNzPXtzdWJoZWFkaW5nQ2xhc3Nlc30+e3N1YmhlYWRpbmd9PC9kaXY+XG4gICAgey9pZn1cbiAgPC9kaXY+XG48L2xpPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NsYXNzZXMuanNcIjtcblxuICBpbXBvcnQgTGlzdEl0ZW0gZnJvbSBcIi4vTGlzdEl0ZW0uc3ZlbHRlXCI7XG5cbiAgZXhwb3J0IGxldCBpdGVtcyA9IFtdO1xuICBleHBvcnQgbGV0IHZhbHVlID0gXCJcIjtcbiAgZXhwb3J0IGxldCBkZW5zZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNlbGVjdCA9IGZhbHNlO1xuXG4gIGV4cG9ydCBjb25zdCBsZXZlbCA9IG51bGw7XG4gIGV4cG9ydCBjb25zdCB0ZXh0ID0gXCJcIjtcbiAgZXhwb3J0IGNvbnN0IGl0ZW0gPSB7fTtcbiAgZXhwb3J0IGNvbnN0IHRvID0gbnVsbDtcbiAgZXhwb3J0IGNvbnN0IHNlbGVjdGVkQ2xhc3NlcyA9IGkgPT4gaTtcbiAgZXhwb3J0IGNvbnN0IGl0ZW1DbGFzc2VzID0gaSA9PiBpO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJweS0yIHJvdW5kZWRcIjtcblxuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcblxuICBmdW5jdGlvbiBpZChpKSB7XG4gICAgaWYgKGkuaWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkuaWQ7XG4gICAgaWYgKGkudmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkudmFsdWU7XG4gICAgaWYgKGkudG8gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGkudG87XG4gICAgaWYgKGkudGV4dCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS50ZXh0O1xuICAgIHJldHVybiBpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGV4dChpKSB7XG4gICAgaWYgKGkudGV4dCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaS50ZXh0O1xuICAgIGlmIChpLnZhbHVlICE9PSB1bmRlZmluZWQpIHJldHVybiBpLnZhbHVlO1xuICAgIHJldHVybiBpO1xuICB9XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKCQkcHJvcHMuY2xhc3MpO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuPC9zY3JpcHQ+XG5cbjx1bCBjbGFzcz17Y30gY2xhc3M6cm91bmRlZC10LW5vbmU9e3NlbGVjdH0+XG4gIHsjZWFjaCBpdGVtcyBhcyBpdGVtLCBpfVxuICAgIHsjaWYgaXRlbS50byAhPT0gdW5kZWZpbmVkfVxuICAgICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB7aXRlbX0ge2RlbnNlfSB7dmFsdWV9PlxuICAgICAgICA8YSB0YWJpbmRleD17aSArIDF9IGhyZWY9e2l0ZW0udG99PlxuICAgICAgICAgIDxMaXN0SXRlbSBiaW5kOnZhbHVlIHsuLi5pdGVtfSBpZD17aWQoaXRlbSl9IHtkZW5zZX0gb246Y2hhbmdlPlxuICAgICAgICAgICAge2l0ZW0udGV4dH1cbiAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8L2E+XG4gICAgICA8L3Nsb3Q+XG4gICAgezplbHNlfVxuICAgICAgPHNsb3QgbmFtZT1cIml0ZW1cIiB7aXRlbX0ge2RlbnNlfSB7dmFsdWV9PlxuICAgICAgICA8TGlzdEl0ZW1cbiAgICAgICAgICBiaW5kOnZhbHVlXG4gICAgICAgICAge3NlbGVjdGVkQ2xhc3Nlc31cbiAgICAgICAgICB7aXRlbUNsYXNzZXN9XG4gICAgICAgICAgey4uLml0ZW19XG4gICAgICAgICAgdGFiaW5kZXg9e2kgKyAxfVxuICAgICAgICAgIGlkPXtpZChpdGVtKX1cbiAgICAgICAgICBzZWxlY3RlZD17dmFsdWUgPT09IGlkKGl0ZW0pfVxuICAgICAgICAgIHtkZW5zZX1cbiAgICAgICAgICBvbjpjaGFuZ2VcbiAgICAgICAgICBvbjpjbGljaz5cbiAgICAgICAgICB7Z2V0VGV4dChpdGVtKX1cbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgIDwvc2xvdD5cbiAgICB7L2lmfVxuICB7L2VhY2h9XG48L3VsPlxuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tIFwic3ZlbHRlL3N0b3JlXCI7XG5pbXBvcnQgeyBvbkRlc3Ryb3kgfSBmcm9tIFwic3ZlbHRlXCI7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDYWxjKHdpZHRoKSB7XG4gIGlmICh3aWR0aCA+IDEyNzkpIHtcbiAgICByZXR1cm4gXCJ4bFwiO1xuICB9XG4gIGlmICh3aWR0aCA+IDEwMjMpIHtcbiAgICByZXR1cm4gXCJsZ1wiO1xuICB9XG4gIGlmICh3aWR0aCA+IDc2Nykge1xuICAgIHJldHVybiBcIm1kXCI7XG4gIH1cbiAgcmV0dXJuIFwic21cIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnJlYWtwb2ludChjYWxjQnJlYWtwb2ludCA9IGRlZmF1bHRDYWxjKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gd3JpdGFibGUoXCJzbVwiKTtcblxuICBjb25zdCBzdG9yZSA9IHdyaXRhYmxlKGNhbGNCcmVha3BvaW50KHdpbmRvdy5pbm5lcldpZHRoKSk7XG5cbiAgY29uc3Qgb25SZXNpemUgPSAoeyB0YXJnZXQgfSkgPT4gc3RvcmUuc2V0KGNhbGNCcmVha3BvaW50KHRhcmdldC5pbm5lcldpZHRoKSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpO1xuICBvbkRlc3Ryb3koKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpKTtcblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZTogc3RvcmUuc3Vic2NyaWJlXG4gIH07XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBmbHkgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgcXVhZEluIH0gZnJvbSBcInN2ZWx0ZS9lYXNpbmdcIjtcbiAgaW1wb3J0IHsgU2NyaW0gfSBmcm9tIFwiLi4vVXRpbFwiO1xuICBpbXBvcnQgYnJlYWtwb2ludHMgZnJvbSBcIi4uLy4uL2JyZWFrcG9pbnRzXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgY29uc3QgYnAgPSBicmVha3BvaW50cygpO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJmaXhlZCB0b3AtMCBtZDptdC0xNiB3LWF1dG8gZHJhd2VyIG92ZXJmbG93LWhpZGRlbiBoLWZ1bGxcIjtcbiAgY29uc3QgbmF2Q2xhc3Nlc0RlZmF1bHQgPSBgaC1mdWxsIHctZnVsbCBiZy13aGl0ZSBkYXJrOmJnLWdyYXktOTAwIGRhcms6dGV4dC1ncmF5LTIwMCBhYnNvbHV0ZSBmbGV4IHctYXV0byB6LTIwIGRyYXdlclxuICAgIHBvaW50ZXItZXZlbnRzLWF1dG8gb3ZlcmZsb3cteS1hdXRvYDtcblxuICBleHBvcnQgbGV0IHJpZ2h0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcGVyc2lzdGVudCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGVsZXZhdGlvbiA9IHRydWU7XG4gIGV4cG9ydCBsZXQgc2hvdyA9IHRydWU7XG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IG5hdkNsYXNzZXMgPSBuYXZDbGFzc2VzRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBib3JkZXJDbGFzc2VzID0gYGJvcmRlci1ncmF5LTYwMCAke3JpZ2h0ID8gXCJib3JkZXItbFwiIDogXCJib3JkZXItclwifWA7XG5cblxuXG5cbiAgZXhwb3J0IGxldCB0cmFuc2l0aW9uUHJvcHMgPSB7XG4gICAgZHVyYXRpb246IDIwMCxcbiAgICB4OiAtMzAwLFxuICAgIGVhc2luZzogcXVhZEluLFxuICAgIG9wYWNpdHk6IDEsXG4gIH07XG5cbiAgJDogdHJhbnNpdGlvblByb3BzLnggPSByaWdodCA/IDMwMCA6IC0zMDA7XG5cbiAgLy8gSXMgdGhlIGRyYXdlciBkZWxpYmVyYXRlbHkgaGlkZGVuPyBEb24ndCBsZXQgdGhlICRicCBjaGVjayBtYWtlIGl0IHZpc2libGUgaWYgc28uXG4gIGxldCBoaWRkZW4gPSAhc2hvdztcbiAgJDogaWYgKCFoaWRkZW4pIHBlcnNpc3RlbnQgPSBzaG93ID0gJGJwICE9PSBcInNtXCI7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICBpZiAoJGJwID09PSAnc20nKSBzaG93ID0gZmFsc2U7XG5cbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKGNsYXNzZXMsIHRydWUsIGNsYXNzZXNEZWZhdWx0KVxuICAgIC5hZGQoYm9yZGVyQ2xhc3NlcywgIWVsZXZhdGlvbiAmJiBwZXJzaXN0ZW50KVxuICAgIC5hZGQoJCRwcm9wcy5jbGFzcylcbiAgICAuYWRkKFwicmlnaHQtMFwiLCByaWdodClcbiAgICAuYWRkKFwibGVmdC0wXCIsICFyaWdodClcbiAgICAuYWRkKFwicG9pbnRlci1ldmVudHMtbm9uZVwiLCBwZXJzaXN0ZW50KVxuICAgIC5hZGQoXCJ6LTUwXCIsICFwZXJzaXN0ZW50KVxuICAgIC5hZGQoXCJlbGV2YXRpb24tNFwiLCBlbGV2YXRpb24pXG4gICAgLmFkZChcInotMjBcIiwgcGVyc2lzdGVudClcbiAgICAuZ2V0KCk7XG5cbiAgY29uc3QgbmNiID0gbmV3IENsYXNzQnVpbGRlcihuYXZDbGFzc2VzLCBuYXZDbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogbiA9IG5jYlxuICAgIC5mbHVzaCgpXG4gICAgLmdldCgpO1xuXG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZHJhd2VyIHtcbiAgICBtaW4td2lkdGg6IDI1MHB4O1xuICB9XG5cbiAgYXNpZGUge1xuICAgIGhlaWdodDogMTAwdmg7XG4gIH1cbjwvc3R5bGU+XG5cbnsjaWYgc2hvd31cbiAgPGFzaWRlXG4gICAgY2xhc3M9e2N9XG4gICAgdHJhbnNpdGlvbjpmbHk9e3RyYW5zaXRpb25Qcm9wc31cbiAgPlxuICAgIHsjaWYgIXBlcnNpc3RlbnR9XG4gICAgICA8U2NyaW0gb246Y2xpY2s9eygpID0+IHNob3cgPSBmYWxzZX0gLz5cbiAgICB7L2lmfVxuICAgIDxuYXZcbiAgICAgIHJvbGU9XCJuYXZpZ2F0aW9uXCJcbiAgICAgIGNsYXNzPXtufVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3LWZ1bGxcIj5cbiAgICAgICAgPHNsb3QgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmF2PlxuICA8L2FzaWRlPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNjYWxlLCBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgY29uc3QgY2xhc3Nlc0RlZmF1bHQgPSBcInRvb2x0aXAgd2hpdGVzcGFjZS1uby13cmFwIHRleHQteHMgYWJzb2x1dGUgbXQtMiBiZy1ncmF5LTYwMCB0ZXh0LWdyYXktNTAgcm91bmRlZCBtZDpweC0yIG1kOnB5LTIgcHktNCBweC0zIHotMzBcIjtcblxuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcblxuXG4gIGV4cG9ydCBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gIGV4cG9ydCBsZXQgdGltZW91dCA9IG51bGw7XG4gIGV4cG9ydCBsZXQgZGVsYXlIaWRlID0gMTAwO1xuICBleHBvcnQgbGV0IGRlbGF5U2hvdyA9IDEwMDtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoY2xhc3NlcywgdHJ1ZSwgY2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5nZXQoKTtcblxuICBmdW5jdGlvbiBzaG93VG9vbHRpcCgpIHtcbiAgICBpZiAoc2hvdykgcmV0dXJuO1xuXG4gICAgc2hvdyA9IHRydWU7XG5cbiAgICBpZiAoIXRpbWVvdXQpIHJldHVybjtcblxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNob3cgPSBmYWxzZTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xuICAgIGlmICghc2hvdykgcmV0dXJuO1xuXG4gICAgc2hvdyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGxldCB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGxldCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9O1xuICAgICAgbGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuLnRvb2x0aXAge1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbn1cbjwvc3R5bGU+XG5cbjxkaXYgY2xhc3M9XCJyZWxhdGl2ZSBpbmxpbmUtYmxvY2tcIj5cbiAgPGRpdlxuICAgIG9uOm1vdXNlZW50ZXI9e2RlYm91bmNlKHNob3dUb29sdGlwLCBkZWxheVNob3cpfVxuICAgIG9uOm1vdXNlbGVhdmU9e2RlYm91bmNlKGhpZGVUb29sdGlwLCBkZWxheUhpZGUpfVxuICAgIG9uOm1vdXNlZW50ZXJcbiAgICBvbjptb3VzZWxlYXZlXG4gICAgb246bW91c2VvdmVyXG4gICAgb246bW91c2VvdXRcbiAgPlxuICAgIDxzbG90IG5hbWU9XCJhY3RpdmF0b3JcIiAvPlxuICA8L2Rpdj5cblxuICB7I2lmIHNob3d9XG4gICAgPGRpdlxuICAgICAgaW46c2NhbGU9e3sgZHVyYXRpb246IDE1MCB9fVxuICAgICAgb3V0OnNjYWxlPXt7IGR1cmF0aW9uOiAxNTAsIGRlbGF5OiAxMDAgfX1cbiAgICAgIGNsYXNzPXtjfVxuICAgID5cbiAgICAgIDxzbG90IC8+XG4gICAgPC9kaXY+XG4gIHsvaWZ9XG48L2Rpdj5cbiIsImV4cG9ydCBjb25zdCBuYXZNZW51ID0gW1xuICB7IHRvOiBcIi9jb21wb25lbnRzL2p1bXBcIiwgdGV4dDogXCJBbGwgeW91IG5lZWQgaXMgLi4uXCIgfSxcblxuICB7IHRvOiBcImZyb250ZW5kL2Zyb250ZW5kXCIsIHRleHQ6IFwiRnJvbnRlbmRcIiB9LFxuICB7IHRvOiBcImluZnJlc3RydWN0dXJlL3NyZVwiLCB0ZXh0OiBcIlNSRVwiIH0sXG4gIHsgdG86IFwiYmFja2VuZC9wb3N0Z3Jlc3FsXCIsIHRleHQ6IFwiUG9zdGdyZVNRTFwiIH0sXG4gIHsgdG86IFwiYXBpL2FwaVwiLCB0ZXh0OiBcIkFwaVwiIH1cbl07XG5cbmV4cG9ydCBjb25zdCB0b3BNZW51ID0gW1xuICB7IHRvOiBcIi9jb21wb25lbnRzXCIsIHRleHQ6IFwiQ29tcG9uZW50c1wiIH0sXG4gIHsgdG86IFwiL3R5cG9ncmFwaHlcIiwgdGV4dDogXCJUeXBvZ3JhcGh5XCIgfSwgXG5dO1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tIFwic3ZlbHRlL3N0b3JlXCI7XG5cbmV4cG9ydCBjb25zdCByaWdodCA9IHdyaXRhYmxlKGZhbHNlKTtcbmV4cG9ydCBjb25zdCBwZXJzaXN0ZW50ID0gd3JpdGFibGUodHJ1ZSk7XG5leHBvcnQgY29uc3QgZWxldmF0aW9uID0gd3JpdGFibGUoZmFsc2UpO1xuZXhwb3J0IGNvbnN0IHNob3dOYXYgPSB3cml0YWJsZSh0cnVlKTtcbmV4cG9ydCBjb25zdCBkYXJrID0gd3JpdGFibGUoZmFsc2UpO1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tIFwic3ZlbHRlL3N0b3JlXCI7XG5cbmV4cG9ydCBsZXQgZGFya01vZGU7XG5cbmZ1bmN0aW9uIGlzRGFya1RoZW1lKCkge1xuICBpZiAoIXdpbmRvdy5tYXRjaE1lZGlhKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5tYXRjaGVzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGFyayh2YWx1ZSA9IHRydWUsIGJvZHlDbGFzc2VzID0gXCJtb2RlLWRhcmtcIikge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIHdyaXRhYmxlKHZhbHVlKTtcblxuICBpZiAoIWRhcmtNb2RlKSB7XG4gICAgZGFya01vZGUgPSB3cml0YWJsZSh2YWx1ZSB8fCBpc0RhcmtUaGVtZSgpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBkYXJrTW9kZS5zdWJzY3JpYmUsXG4gICAgc2V0OiB2ID0+IHtcbiAgICAgIGJvZHlDbGFzc2VzLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICBpZiAodikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkYXJrTW9kZS5zZXQodik7XG4gICAgfVxuICB9O1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IEFwcEJhciBmcm9tIFwiY29tcG9uZW50cy9BcHBCYXJcIjtcbiAgaW1wb3J0IFRhYnMgZnJvbSBcImNvbXBvbmVudHMvVGFic1wiO1xuICBpbXBvcnQgQnV0dG9uIGZyb20gXCJjb21wb25lbnRzL0J1dHRvblwiO1xuICBpbXBvcnQgeyBTcGFjZXIgfSBmcm9tIFwiY29tcG9uZW50cy9VdGlsXCI7XG4gIGltcG9ydCBMaXN0LCB7IExpc3RJdGVtIH0gZnJvbSBcImNvbXBvbmVudHMvTGlzdFwiO1xuICBpbXBvcnQgTmF2aWdhdGlvbkRyYXdlciBmcm9tIFwiY29tcG9uZW50cy9OYXZpZ2F0aW9uRHJhd2VyXCI7XG4gIGltcG9ydCBQcm9ncmVzc0xpbmVhciBmcm9tIFwiY29tcG9uZW50cy9Qcm9ncmVzc0xpbmVhclwiO1xuICBpbXBvcnQgVG9vbHRpcCBmcm9tIFwiY29tcG9uZW50cy9Ub29sdGlwXCI7XG4gIGltcG9ydCB7IHN0b3JlcyB9IGZyb20gXCJAc2FwcGVyL2FwcFwiO1xuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xuICBpbXBvcnQgeyBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IG5hdk1lbnUsIHRvcE1lbnUgfSBmcm9tIFwiLi4vdXRpbHMvbWVudS5qc1wiO1xuICBpbXBvcnQgeyByaWdodCwgZWxldmF0aW9uLCBwZXJzaXN0ZW50LCBzaG93TmF2IH0gZnJvbSBcInN0b3Jlcy5qc1wiO1xuICBpbXBvcnQgZGFyayBmcm9tIFwiLi4vZGFyay5qc1wiO1xuXG4gIGNvbnN0IHsgcHJlbG9hZGluZywgcGFnZSB9ID0gc3RvcmVzKCk7XG5cbiAgbGV0IHNlbGVjdGVkID0gXCJcIjtcblxuICBjb25zdCBkYXJrTW9kZSA9IGRhcmsoKTtcblxuICAkOiBwYXRoID0gJHBhZ2UucGF0aDtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5naXRodWIge1xuICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZS1vdXQ7XG4gIH1cbiAgLmdpdGh1Yjpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxuPC9zdHlsZT5cblxuPHN2ZWx0ZTpoZWFkPlxuICA8dGl0bGU+Um9jayBCYW5kPC90aXRsZT5cbiAgPG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIkJyZWFraW5nIFNvdW5kc1wiIC8+XG48L3N2ZWx0ZTpoZWFkPlxuXG57I2lmICRwcmVsb2FkaW5nfVxuICA8UHJvZ3Jlc3NMaW5lYXIgYXBwIC8+XG57L2lmfVxuXG57I2VhY2ggbmF2TWVudSBhcyBsaW5rfVxuICA8YSBocmVmPXtsaW5rLnRvfSBjbGFzcz1cImhpZGRlblwiPntsaW5rLnRleHR9PC9hPlxuey9lYWNofVxuXG48QXBwQmFyIGNsYXNzPXtpID0+IGkucmVwbGFjZSgncHJpbWFyeS0zMDAnLCAnZGFyay02MDAnKX0+XG4gIDxhIGhyZWY9XCIuXCIgY2xhc3M9XCJweC0yIG1kOnB4LTggZmxleCBpdGVtcy1jZW50ZXJcIj5cbiAgICA8aW1nIHNyYz1cIi9sb2dvLnN2Z1wiIGFsdD1cIlJvY2sgQmFuZCBsb2dvXCIgd2lkdGg9XCI1NFwiIC8+XG4gICAgPGg2IGNsYXNzPVwicGwtMyB0ZXh0LXdoaXRlIHRyYWNraW5nLXdpZGVzdCBmb250LXRoaW4gdGV4dC1sZ1wiPlJvY2sgQmFuZDwvaDY+XG4gIDwvYT5cbiAgPFNwYWNlciAvPlxuICA8VGFicyBuYXZpZ2F0aW9uIGl0ZW1zPXt0b3BNZW51fSBiaW5kOnNlbGVjdGVkPXtwYXRofSAvPlxuXG4gIDxUb29sdGlwPlxuICAgIDxzcGFuIHNsb3Q9XCJhY3RpdmF0b3JcIj5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgYmluZDp2YWx1ZT17JGRhcmtNb2RlfVxuICAgICAgICBpY29uPVwid2Jfc3VubnlcIlxuICAgICAgICBzbWFsbFxuICAgICAgICBmbGF0XG4gICAgICAgIHJlbW92ZT1cInAtMSBoLTQgdy00XCJcbiAgICAgICAgaWNvbkNsYXNzPVwidGV4dC13aGl0ZVwiXG4gICAgICAgIHRleHQgLz5cbiAgICA8L3NwYW4+XG4gICAgeyRkYXJrTW9kZSA/ICdEaXNhYmxlJyA6ICdFbmFibGUnfSBkYXJrIG1vZGVcbiAgPC9Ub29sdGlwPlxuICA8ZGl2IGNsYXNzPVwibWQ6aGlkZGVuXCI+XG4gICAgPEJ1dHRvblxuICAgICAgaWNvbj1cIm1lbnVcIlxuICAgICAgc21hbGxcbiAgICAgIGZsYXRcbiAgICAgIHJlbW92ZT1cInAtMSBoLTQgdy00XCJcbiAgICAgIGljb25DbGFzcz1cInRleHQtd2hpdGVcIlxuICAgICAgdGV4dFxuICAgICAgb246Y2xpY2s9eygpID0+IHNob3dOYXYuc2V0KCEkc2hvd05hdil9IC8+XG4gIDwvZGl2PlxuICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Jlc291cmNlbGRnL3dhbGFkb2NzXCIgY2xhc3M9XCJweC00IGdpdGh1YlwiPlxuICAgIDxpbWcgc3JjPVwiL2luc3RhZ3JhbS5zdmdcIiBhbHQ9XCJHaXRodWIgU21lbHRlXCIgd2lkdGg9XCI0MFwiIGhlaWdodD1cIjQwXCIgLz5cbiAgPC9hPlxuICBcbjwvQXBwQmFyPlxuXG48bWFpblxuICBjbGFzcz1cInJlbGF0aXZlIHAtOCBsZzptYXgtdy0zeGwgbXgtYXV0byBtYi0xMCBtdC0yNCBtZDptbC02NCBtZDpwbC0xNlxuICBtZDptYXgtdy1tZCBtZDpweC0zXCJcbiAgdHJhbnNpdGlvbjpmYWRlPXt7IGR1cmF0aW9uOiAzMDAgfX0+XG4gIDxOYXZpZ2F0aW9uRHJhd2VyXG4gICAgYmluZDpzaG93PXskc2hvd05hdn1cbiAgICByaWdodD17JHJpZ2h0fVxuICAgIHBlcnNpc3RlbnQ9eyRwZXJzaXN0ZW50fVxuICAgIGVsZXZhdGlvbj17JGVsZXZhdGlvbn0+XG4gICAgPGg2XG4gICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgRGV2ZWxvcGVyIEdldHRpbmcgU3RhcnRlZCEhXG4gICAgPC9oNj5cbiAgICA8TGlzdCBpdGVtcz17bmF2TWVudX0+XG4gICAgICA8c3BhbiBzbG90PVwiaXRlbVwiIGxldDppdGVtIGNsYXNzPVwiY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgeyNpZiBpdGVtLnRvID09PSAnaW5mcmVzdHJ1Y3R1cmUvc3JlJ31cbiAgICAgICAgICA8aHIgY2xhc3M9XCJtdC00XCIgLz5cbiAgICAgICAgICA8aDZcbiAgICAgICAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICBJbmZyZXN0cnVjdHVyZVxuICAgICAgICAgIDwvaDY+XG4gICAgICAgIHsvaWZ9XG4gICAgICAgIHsjaWYgaXRlbS50byA9PT0gJ2FwaS9hcGknfVxuICAgICAgICAgIDxociBjbGFzcz1cIm10LTRcIiAvPlxuICAgICAgICAgIDxoNlxuICAgICAgICAgICAgY2xhc3M9XCJweC0zIG1sLTEgcGItMiBwdC04IHRleHQtc20gdGV4dC1ncmF5LTkwMCBmb250LWxpZ2h0XG4gICAgICAgICAgICBkYXJrOnRleHQtZ3JheS0xMDBcIj5cbiAgICAgICAgICAgIEFwaVxuICAgICAgICAgIDwvaDY+XG4gICAgICAgIHsvaWZ9XG4gICAgICAgIHsjaWYgaXRlbS50byA9PT0gJ2JhY2tlbmQvcG9zdGdyZXNxbCd9XG4gICAgICAgICAgPGhyIGNsYXNzPVwibXQtNFwiIC8+XG4gICAgICAgICAgPGg2XG4gICAgICAgICAgICBjbGFzcz1cInB4LTMgbWwtMSBwYi0yIHB0LTggdGV4dC1zbSB0ZXh0LWdyYXktOTAwIGZvbnQtbGlnaHRcbiAgICAgICAgICAgIGRhcms6dGV4dC1ncmF5LTEwMFwiPlxuICAgICAgICAgICAgQmFja2VuZFxuICAgICAgICAgIDwvaDY+XG4gICAgICAgIHsvaWZ9XG4gICAgICAgIHsjaWYgaXRlbS50byA9PT0gJ2Zyb250ZW5kL2Zyb250ZW5kJ31cbiAgICAgICAgICA8aHIgY2xhc3M9XCJtdC00XCIgLz5cbiAgICAgICAgICA8aDZcbiAgICAgICAgICAgIGNsYXNzPVwicHgtMyBtbC0xIHBiLTIgcHQtOCB0ZXh0LXNtIHRleHQtZ3JheS05MDAgZm9udC1saWdodFxuICAgICAgICAgICAgZGFyazp0ZXh0LWdyYXktMTAwXCI+XG4gICAgICAgICAgICBGcm9udGVuZFxuICAgICAgICAgIDwvaDY+XG4gICAgICAgIHsvaWZ9XG5cbiAgICAgICAgPGEgaHJlZj17aXRlbS50b30+XG4gICAgICAgICAgPExpc3RJdGVtXG4gICAgICAgICAgICBpZD17aXRlbS5pZH1cbiAgICAgICAgICAgIHRleHQ9e2l0ZW0udGV4dH1cbiAgICAgICAgICAgIHRvPXtpdGVtLnRvfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhdGguaW5jbHVkZXMoaXRlbS50byl9XG4gICAgICAgICAgICBkZW5zZVxuICAgICAgICAgICAgc2VsZWN0ZWRDbGFzc2VzPVwiYmctcHJpbWFyeS10cmFuc0RhcmsgZGFyazpiZy1wcmltYXJ5LXRyYW5zTGlnaHRcbiAgICAgICAgICAgIGhvdmVyOmJnLXByaW1hcnktdHJhbnNEYXJrIGRhcmstaG92ZXI6YmctcHJpbWFyeS10cmFuc0xpZ2h0XCIgLz5cbiAgICAgICAgPC9hPlxuICAgICAgPC9zcGFuPlxuICAgIDwvTGlzdD5cblxuICAgIDxociAvPlxuICA8L05hdmlnYXRpb25EcmF3ZXI+XG5cbiAgPHNsb3QgLz5cbjwvbWFpbj5cbiIsIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc3RhdHVzO1xuICBleHBvcnQgbGV0IGVycm9yO1xuXG4gIGNvbnN0IGRldiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCI7XG48L3NjcmlwdD5cblxuPHN2ZWx0ZTpoZWFkPlxuICA8dGl0bGU+e3N0YXR1c308L3RpdGxlPlxuPC9zdmVsdGU6aGVhZD5cblxuPGgxPntzdGF0dXN9PC9oMT5cblxuPHA+e2Vycm9yLm1lc3NhZ2V9PC9wPlxuXG57I2lmIGRldiAmJiBlcnJvci5zdGFja31cbiAgPHByZT57ZXJyb3Iuc3RhY2t9PC9wcmU+XG57L2lmfVxuIiwiPCEtLSBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhIC0tPlxuPHNjcmlwdD5cblx0aW1wb3J0IHsgc2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5cdGltcG9ydCB7IENPTlRFWFRfS0VZIH0gZnJvbSAnLi9zaGFyZWQnO1xuXHRpbXBvcnQgTGF5b3V0IGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fbGF5b3V0LnN2ZWx0ZSc7XG5cdGltcG9ydCBFcnJvciBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2Vycm9yLnN2ZWx0ZSc7XG5cblx0ZXhwb3J0IGxldCBzdG9yZXM7XG5cdGV4cG9ydCBsZXQgZXJyb3I7XG5cdGV4cG9ydCBsZXQgc3RhdHVzO1xuXHRleHBvcnQgbGV0IHNlZ21lbnRzO1xuXHRleHBvcnQgbGV0IGxldmVsMDtcblx0ZXhwb3J0IGxldCBsZXZlbDEgPSBudWxsO1xuXHRleHBvcnQgbGV0IGxldmVsMiA9IG51bGw7XG5cblx0c2V0Q29udGV4dChDT05URVhUX0tFWSwgc3RvcmVzKTtcbjwvc2NyaXB0PlxuXG48TGF5b3V0IHNlZ21lbnQ9XCJ7c2VnbWVudHNbMF19XCIgey4uLmxldmVsMC5wcm9wc30+XG5cdHsjaWYgZXJyb3J9XG5cdFx0PEVycm9yIHtlcnJvcn0ge3N0YXR1c30vPlxuXHR7OmVsc2V9XG5cdFx0PHN2ZWx0ZTpjb21wb25lbnQgdGhpcz1cIntsZXZlbDEuY29tcG9uZW50fVwiIHNlZ21lbnQ9XCJ7c2VnbWVudHNbMV19XCIgey4uLmxldmVsMS5wcm9wc30+XG5cdFx0XHR7I2lmIGxldmVsMn1cblx0XHRcdFx0PHN2ZWx0ZTpjb21wb25lbnQgdGhpcz1cIntsZXZlbDIuY29tcG9uZW50fVwiIHsuLi5sZXZlbDIucHJvcHN9Lz5cblx0XHRcdHsvaWZ9XG5cdFx0PC9zdmVsdGU6Y29tcG9uZW50PlxuXHR7L2lmfVxuPC9MYXlvdXQ+IiwiLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBTYXBwZXIg4oCUIGRvIG5vdCBlZGl0IGl0IVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBSb290IH0gZnJvbSAnLi4vLi4vLi4vcm91dGVzL19sYXlvdXQuc3ZlbHRlJztcbmV4cG9ydCB7IHByZWxvYWQgYXMgcm9vdF9wcmVsb2FkIH0gZnJvbSAnLi9zaGFyZWQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlJztcblxuZXhwb3J0IGNvbnN0IGlnbm9yZSA9IFtdO1xuXG5leHBvcnQgY29uc3QgY29tcG9uZW50cyA9IFtcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvaW5kZXguc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6aW5kZXguc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9pbmZyZXN0cnVjdHVyZS9zcmUuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6aW5mcmVzdHJ1Y3R1cmUvc3JlLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYnJlYWtwb2ludHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6YnJlYWtwb2ludHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL19sYXlvdXQuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9fbGF5b3V0LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9pbmRleC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL2luZGV4LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9wcm9ncmVzcy1pbmRpY2F0b3JzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvcHJvZ3Jlc3MtaW5kaWNhdG9ycy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi1kcmF3ZXJzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvbmF2aWdhdGlvbi1kcmF3ZXJzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9zZWxlY3Rpb24tY29udHJvbHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9zZWxlY3Rpb24tY29udHJvbHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2RhdGUtcGlja2Vycy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL2RhdGUtcGlja2Vycy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvZGF0YS10YWJsZXMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9kYXRhLXRhYmxlcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvdGV4dC1maWVsZHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy90ZXh0LWZpZWxkcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvc25hY2tiYXJzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvc25hY2tiYXJzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy90cmVldmlld3Muc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy90cmVldmlld3Muc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL3Rvb2x0aXBzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvdG9vbHRpcHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2J1dHRvbnMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9idXR0b25zLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9kaWFsb2dzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvZGlhbG9ncy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NvbXBvbmVudHMvc2VsZWN0cy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb21wb25lbnRzL3NlbGVjdHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL3NsaWRlcnMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9zbGlkZXJzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy9pbWFnZXMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9pbWFnZXMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2NhcmRzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvY2FyZHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2NoaXBzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvY2hpcHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2xpc3RzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvbGlzdHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL21lbnVzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvbWVudXMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb21wb25lbnRzL2p1bXAuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y29tcG9uZW50cy9qdW1wLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvY29tcG9uZW50cy90YWJzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmNvbXBvbmVudHMvdGFicy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3R5cG9ncmFwaHkuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6dHlwb2dyYXBoeS5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2RhcmstbW9kZS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpkYXJrLW1vZGUuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9mcm9udGVuZC9mcm9udGVuZC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpmcm9udGVuZC9mcm9udGVuZC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2JhY2tlbmQvcG9zdGdyZXNxbC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpiYWNrZW5kL3Bvc3RncmVzcWwuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jb2xvci5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjb2xvci5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2FwaS9hcGkuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6YXBpL2FwaS5zdmVsdGVfX1wiXG5cdH1cbl07XG5cbmV4cG9ydCBjb25zdCByb3V0ZXMgPSBbXG5cdHtcblx0XHQvLyBpbmRleC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcLyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gaW5mcmVzdHJ1Y3R1cmUvc3JlLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvaW5mcmVzdHJ1Y3R1cmVcXC9zcmVcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDEgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gYnJlYWtwb2ludHMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9icmVha3BvaW50c1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAyIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvaW5kZXguc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogNCB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL3Byb2dyZXNzLWluZGljYXRvcnMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvcHJvZ3Jlc3MtaW5kaWNhdG9yc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDUgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9uYXZpZ2F0aW9uLWRyYXdlcnMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvbmF2aWdhdGlvbi1kcmF3ZXJzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogNiB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL3NlbGVjdGlvbi1jb250cm9scy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9zZWxlY3Rpb24tY29udHJvbHNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiA3IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvZGF0ZS1waWNrZXJzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL2RhdGUtcGlja2Vyc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDggfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9kYXRhLXRhYmxlcy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9kYXRhLXRhYmxlc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDkgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy90ZXh0LWZpZWxkcy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC90ZXh0LWZpZWxkc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDEwIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvc25hY2tiYXJzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL3NuYWNrYmFyc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDExIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvdHJlZXZpZXdzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL3RyZWV2aWV3c1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDEyIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvdG9vbHRpcHMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvdG9vbHRpcHNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAxMyB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL2J1dHRvbnMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvYnV0dG9uc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDE0IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvZGlhbG9ncy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9kaWFsb2dzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMTUgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9zZWxlY3RzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL3NlbGVjdHNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAxNiB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL3NsaWRlcnMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvc2xpZGVyc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDE3IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvaW1hZ2VzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL2ltYWdlc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDE4IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvY2FyZHMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvY2FyZHNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAxOSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL2NoaXBzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29tcG9uZW50c1xcL2NoaXBzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMjAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY29tcG9uZW50cy9saXN0cy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC9saXN0c1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDIxIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvbWVudXMuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvbWVudXNcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMyB9LFxuXHRcdFx0eyBpOiAyMiB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBjb21wb25lbnRzL2p1bXAuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9jb21wb25lbnRzXFwvanVtcFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH0sXG5cdFx0XHR7IGk6IDIzIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbXBvbmVudHMvdGFicy5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2NvbXBvbmVudHNcXC90YWJzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDMgfSxcblx0XHRcdHsgaTogMjQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gdHlwb2dyYXBoeS5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3R5cG9ncmFwaHlcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMjUgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gZGFyay1tb2RlLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvZGFyay1tb2RlXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDI2IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGZyb250ZW5kL2Zyb250ZW5kLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvZnJvbnRlbmRcXC9mcm9udGVuZFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0bnVsbCxcblx0XHRcdHsgaTogMjcgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gYmFja2VuZC9wb3N0Z3Jlc3FsLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYmFja2VuZFxcL3Bvc3RncmVzcWxcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDI4IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGNvbG9yLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY29sb3JcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMjkgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gYXBpL2FwaS5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2FwaVxcL2FwaVxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0bnVsbCxcblx0XHRcdHsgaTogMzAgfVxuXHRcdF1cblx0fVxuXTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdGltcG9ydChcIi9ob21lL2x1Y2FzL3JvY2tiYW5kL25vZGVfbW9kdWxlcy9zYXBwZXIvc2FwcGVyLWRldi1jbGllbnQuanNcIikudGhlbihjbGllbnQgPT4ge1xuXHRcdGNsaWVudC5jb25uZWN0KDEwMDAwKTtcblx0fSk7XG59IiwiaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5pbXBvcnQgeyBDT05URVhUX0tFWSB9IGZyb20gJy4vaW50ZXJuYWwvc2hhcmVkJztcbmltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCBBcHAgZnJvbSAnLi9pbnRlcm5hbC9BcHAuc3ZlbHRlJztcbmltcG9ydCB7IGlnbm9yZSwgcm91dGVzLCByb290X3ByZWxvYWQsIGNvbXBvbmVudHMsIEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi9pbnRlcm5hbC9tYW5pZmVzdC1jbGllbnQnO1xuXG5mdW5jdGlvbiBnb3RvKGhyZWYsIG9wdHMgPSB7IHJlcGxhY2VTdGF0ZTogZmFsc2UgfSkge1xuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwoaHJlZiwgZG9jdW1lbnQuYmFzZVVSSSkpO1xuXG5cdGlmICh0YXJnZXQpIHtcblx0XHRfaGlzdG9yeVtvcHRzLnJlcGxhY2VTdGF0ZSA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHsgaWQ6IGNpZCB9LCAnJywgaHJlZik7XG5cdFx0cmV0dXJuIG5hdmlnYXRlKHRhcmdldCwgbnVsbCkudGhlbigoKSA9PiB7fSk7XG5cdH1cblxuXHRsb2NhdGlvbi5ocmVmID0gaHJlZjtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGYgPT4ge30pOyAvLyBuZXZlciByZXNvbHZlc1xufVxuXG5jb25zdCBpbml0aWFsX2RhdGEgPSB0eXBlb2YgX19TQVBQRVJfXyAhPT0gJ3VuZGVmaW5lZCcgJiYgX19TQVBQRVJfXztcblxubGV0IHJlYWR5ID0gZmFsc2U7XG5sZXQgcm9vdF9jb21wb25lbnQ7XG5sZXQgY3VycmVudF90b2tlbjtcbmxldCByb290X3ByZWxvYWRlZDtcbmxldCBjdXJyZW50X2JyYW5jaCA9IFtdO1xubGV0IGN1cnJlbnRfcXVlcnkgPSAne30nO1xuXG5jb25zdCBzdG9yZXMgPSB7XG5cdHBhZ2U6IHdyaXRhYmxlKHt9KSxcblx0cHJlbG9hZGluZzogd3JpdGFibGUobnVsbCksXG5cdHNlc3Npb246IHdyaXRhYmxlKGluaXRpYWxfZGF0YSAmJiBpbml0aWFsX2RhdGEuc2Vzc2lvbilcbn07XG5cbmxldCAkc2Vzc2lvbjtcbmxldCBzZXNzaW9uX2RpcnR5O1xuXG5zdG9yZXMuc2Vzc2lvbi5zdWJzY3JpYmUoYXN5bmMgdmFsdWUgPT4ge1xuXHQkc2Vzc2lvbiA9IHZhbHVlO1xuXG5cdGlmICghcmVhZHkpIHJldHVybjtcblx0c2Vzc2lvbl9kaXJ0eSA9IHRydWU7XG5cblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldChuZXcgVVJMKGxvY2F0aW9uLmhyZWYpKTtcblxuXHRjb25zdCB0b2tlbiA9IGN1cnJlbnRfdG9rZW4gPSB7fTtcblx0Y29uc3QgeyByZWRpcmVjdCwgcHJvcHMsIGJyYW5jaCB9ID0gYXdhaXQgaHlkcmF0ZV90YXJnZXQodGFyZ2V0KTtcblx0aWYgKHRva2VuICE9PSBjdXJyZW50X3Rva2VuKSByZXR1cm47IC8vIGEgc2Vjb25kYXJ5IG5hdmlnYXRpb24gaGFwcGVuZWQgd2hpbGUgd2Ugd2VyZSBsb2FkaW5nXG5cblx0YXdhaXQgcmVuZGVyKHJlZGlyZWN0LCBicmFuY2gsIHByb3BzLCB0YXJnZXQucGFnZSk7XG59KTtcblxubGV0IHByZWZldGNoaW5nXG5cblxuID0gbnVsbDtcbmZ1bmN0aW9uIHNldF9wcmVmZXRjaGluZyhocmVmLCBwcm9taXNlKSB7XG5cdHByZWZldGNoaW5nID0geyBocmVmLCBwcm9taXNlIH07XG59XG5cbmxldCB0YXJnZXQ7XG5mdW5jdGlvbiBzZXRfdGFyZ2V0KGVsZW1lbnQpIHtcblx0dGFyZ2V0ID0gZWxlbWVudDtcbn1cblxubGV0IHVpZCA9IDE7XG5mdW5jdGlvbiBzZXRfdWlkKG4pIHtcblx0dWlkID0gbjtcbn1cblxubGV0IGNpZDtcbmZ1bmN0aW9uIHNldF9jaWQobikge1xuXHRjaWQgPSBuO1xufVxuXG5jb25zdCBfaGlzdG9yeSA9IHR5cGVvZiBoaXN0b3J5ICE9PSAndW5kZWZpbmVkJyA/IGhpc3RvcnkgOiB7XG5cdHB1c2hTdGF0ZTogKHN0YXRlLCB0aXRsZSwgaHJlZikgPT4ge30sXG5cdHJlcGxhY2VTdGF0ZTogKHN0YXRlLCB0aXRsZSwgaHJlZikgPT4ge30sXG5cdHNjcm9sbFJlc3RvcmF0aW9uOiAnJ1xufTtcblxuY29uc3Qgc2Nyb2xsX2hpc3RvcnkgPSB7fTtcblxuZnVuY3Rpb24gZXh0cmFjdF9xdWVyeShzZWFyY2gpIHtcblx0Y29uc3QgcXVlcnkgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRpZiAoc2VhcmNoLmxlbmd0aCA+IDApIHtcblx0XHRzZWFyY2guc2xpY2UoMSkuc3BsaXQoJyYnKS5mb3JFYWNoKHNlYXJjaFBhcmFtID0+IHtcblx0XHRcdGxldCBbLCBrZXksIHZhbHVlID0gJyddID0gLyhbXj1dKikoPzo9KC4qKSk/Ly5leGVjKGRlY29kZVVSSUNvbXBvbmVudChzZWFyY2hQYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKSkpO1xuXHRcdFx0aWYgKHR5cGVvZiBxdWVyeVtrZXldID09PSAnc3RyaW5nJykgcXVlcnlba2V5XSA9IFtxdWVyeVtrZXldXTtcblx0XHRcdGlmICh0eXBlb2YgcXVlcnlba2V5XSA9PT0gJ29iamVjdCcpIChxdWVyeVtrZXldICkucHVzaCh2YWx1ZSk7XG5cdFx0XHRlbHNlIHF1ZXJ5W2tleV0gPSB2YWx1ZTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdF90YXJnZXQodXJsKSB7XG5cdGlmICh1cmwub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4pIHJldHVybiBudWxsO1xuXHRpZiAoIXVybC5wYXRobmFtZS5zdGFydHNXaXRoKGluaXRpYWxfZGF0YS5iYXNlVXJsKSkgcmV0dXJuIG51bGw7XG5cblx0bGV0IHBhdGggPSB1cmwucGF0aG5hbWUuc2xpY2UoaW5pdGlhbF9kYXRhLmJhc2VVcmwubGVuZ3RoKTtcblxuXHRpZiAocGF0aCA9PT0gJycpIHtcblx0XHRwYXRoID0gJy8nO1xuXHR9XG5cblx0Ly8gYXZvaWQgYWNjaWRlbnRhbCBjbGFzaGVzIGJldHdlZW4gc2VydmVyIHJvdXRlcyBhbmQgcGFnZSByb3V0ZXNcblx0aWYgKGlnbm9yZS5zb21lKHBhdHRlcm4gPT4gcGF0dGVybi50ZXN0KHBhdGgpKSkgcmV0dXJuO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcm91dGVzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Y29uc3Qgcm91dGUgPSByb3V0ZXNbaV07XG5cblx0XHRjb25zdCBtYXRjaCA9IHJvdXRlLnBhdHRlcm4uZXhlYyhwYXRoKTtcblxuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSBleHRyYWN0X3F1ZXJ5KHVybC5zZWFyY2gpO1xuXHRcdFx0Y29uc3QgcGFydCA9IHJvdXRlLnBhcnRzW3JvdXRlLnBhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gcGFydC5wYXJhbXMgPyBwYXJ0LnBhcmFtcyhtYXRjaCkgOiB7fTtcblxuXHRcdFx0Y29uc3QgcGFnZSA9IHsgaG9zdDogbG9jYXRpb24uaG9zdCwgcGF0aCwgcXVlcnksIHBhcmFtcyB9O1xuXG5cdFx0XHRyZXR1cm4geyBocmVmOiB1cmwuaHJlZiwgcm91dGUsIG1hdGNoLCBwYWdlIH07XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9lcnJvcih1cmwpIHtcblx0Y29uc3QgeyBob3N0LCBwYXRobmFtZSwgc2VhcmNoIH0gPSBsb2NhdGlvbjtcblx0Y29uc3QgeyBzZXNzaW9uLCBwcmVsb2FkZWQsIHN0YXR1cywgZXJyb3IgfSA9IGluaXRpYWxfZGF0YTtcblxuXHRpZiAoIXJvb3RfcHJlbG9hZGVkKSB7XG5cdFx0cm9vdF9wcmVsb2FkZWQgPSBwcmVsb2FkZWQgJiYgcHJlbG9hZGVkWzBdO1xuXHR9XG5cblx0Y29uc3QgcHJvcHMgPSB7XG5cdFx0ZXJyb3IsXG5cdFx0c3RhdHVzLFxuXHRcdHNlc3Npb24sXG5cdFx0bGV2ZWwwOiB7XG5cdFx0XHRwcm9wczogcm9vdF9wcmVsb2FkZWRcblx0XHR9LFxuXHRcdGxldmVsMToge1xuXHRcdFx0cHJvcHM6IHtcblx0XHRcdFx0c3RhdHVzLFxuXHRcdFx0XHRlcnJvclxuXHRcdFx0fSxcblx0XHRcdGNvbXBvbmVudDogRXJyb3JDb21wb25lbnRcblx0XHR9LFxuXHRcdHNlZ21lbnRzOiBwcmVsb2FkZWRcblxuXHR9O1xuXHRjb25zdCBxdWVyeSA9IGV4dHJhY3RfcXVlcnkoc2VhcmNoKTtcblx0cmVuZGVyKG51bGwsIFtdLCBwcm9wcywgeyBob3N0LCBwYXRoOiBwYXRobmFtZSwgcXVlcnksIHBhcmFtczoge30gfSk7XG59XG5cbmZ1bmN0aW9uIHNjcm9sbF9zdGF0ZSgpIHtcblx0cmV0dXJuIHtcblx0XHR4OiBwYWdlWE9mZnNldCxcblx0XHR5OiBwYWdlWU9mZnNldFxuXHR9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBuYXZpZ2F0ZSh0YXJnZXQsIGlkLCBub3Njcm9sbCwgaGFzaCkge1xuXHRpZiAoaWQpIHtcblx0XHQvLyBwb3BzdGF0ZSBvciBpbml0aWFsIG5hdmlnYXRpb25cblx0XHRjaWQgPSBpZDtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBjdXJyZW50X3Njcm9sbCA9IHNjcm9sbF9zdGF0ZSgpO1xuXG5cdFx0Ly8gY2xpY2tlZCBvbiBhIGxpbmsuIHByZXNlcnZlIHNjcm9sbCBzdGF0ZVxuXHRcdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBjdXJyZW50X3Njcm9sbDtcblxuXHRcdGlkID0gY2lkID0gKyt1aWQ7XG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IG5vc2Nyb2xsID8gY3VycmVudF9zY3JvbGwgOiB7IHg6IDAsIHk6IDAgfTtcblx0fVxuXG5cdGNpZCA9IGlkO1xuXG5cdGlmIChyb290X2NvbXBvbmVudCkgc3RvcmVzLnByZWxvYWRpbmcuc2V0KHRydWUpO1xuXG5cdGNvbnN0IGxvYWRlZCA9IHByZWZldGNoaW5nICYmIHByZWZldGNoaW5nLmhyZWYgPT09IHRhcmdldC5ocmVmID9cblx0XHRwcmVmZXRjaGluZy5wcm9taXNlIDpcblx0XHRoeWRyYXRlX3RhcmdldCh0YXJnZXQpO1xuXG5cdHByZWZldGNoaW5nID0gbnVsbDtcblxuXHRjb25zdCB0b2tlbiA9IGN1cnJlbnRfdG9rZW4gPSB7fTtcblx0Y29uc3QgeyByZWRpcmVjdCwgcHJvcHMsIGJyYW5jaCB9ID0gYXdhaXQgbG9hZGVkO1xuXHRpZiAodG9rZW4gIT09IGN1cnJlbnRfdG9rZW4pIHJldHVybjsgLy8gYSBzZWNvbmRhcnkgbmF2aWdhdGlvbiBoYXBwZW5lZCB3aGlsZSB3ZSB3ZXJlIGxvYWRpbmdcblxuXHRhd2FpdCByZW5kZXIocmVkaXJlY3QsIGJyYW5jaCwgcHJvcHMsIHRhcmdldC5wYWdlKTtcblx0aWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXG5cdGlmICghbm9zY3JvbGwpIHtcblx0XHRsZXQgc2Nyb2xsID0gc2Nyb2xsX2hpc3RvcnlbaWRdO1xuXG5cdFx0aWYgKGhhc2gpIHtcblx0XHRcdC8vIHNjcm9sbCBpcyBhbiBlbGVtZW50IGlkIChmcm9tIGEgaGFzaCksIHdlIG5lZWQgdG8gY29tcHV0ZSB5LlxuXHRcdFx0Y29uc3QgZGVlcF9saW5rZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoLnNsaWNlKDEpKTtcblxuXHRcdFx0aWYgKGRlZXBfbGlua2VkKSB7XG5cdFx0XHRcdHNjcm9sbCA9IHtcblx0XHRcdFx0XHR4OiAwLFxuXHRcdFx0XHRcdHk6IGRlZXBfbGlua2VkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBzY3JvbGw7XG5cdFx0aWYgKHNjcm9sbCkgc2Nyb2xsVG8oc2Nyb2xsLngsIHNjcm9sbC55KTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiByZW5kZXIocmVkaXJlY3QsIGJyYW5jaCwgcHJvcHMsIHBhZ2UpIHtcblx0aWYgKHJlZGlyZWN0KSByZXR1cm4gZ290byhyZWRpcmVjdC5sb2NhdGlvbiwgeyByZXBsYWNlU3RhdGU6IHRydWUgfSk7XG5cblx0c3RvcmVzLnBhZ2Uuc2V0KHBhZ2UpO1xuXHRzdG9yZXMucHJlbG9hZGluZy5zZXQoZmFsc2UpO1xuXG5cdGlmIChyb290X2NvbXBvbmVudCkge1xuXHRcdHJvb3RfY29tcG9uZW50LiRzZXQocHJvcHMpO1xuXHR9IGVsc2Uge1xuXHRcdHByb3BzLnN0b3JlcyA9IHtcblx0XHRcdHBhZ2U6IHsgc3Vic2NyaWJlOiBzdG9yZXMucGFnZS5zdWJzY3JpYmUgfSxcblx0XHRcdHByZWxvYWRpbmc6IHsgc3Vic2NyaWJlOiBzdG9yZXMucHJlbG9hZGluZy5zdWJzY3JpYmUgfSxcblx0XHRcdHNlc3Npb246IHN0b3Jlcy5zZXNzaW9uXG5cdFx0fTtcblx0XHRwcm9wcy5sZXZlbDAgPSB7XG5cdFx0XHRwcm9wczogYXdhaXQgcm9vdF9wcmVsb2FkZWRcblx0XHR9O1xuXG5cdFx0Ly8gZmlyc3QgbG9hZCDigJQgcmVtb3ZlIFNTUidkIDxoZWFkPiBjb250ZW50c1xuXHRcdGNvbnN0IHN0YXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlci1oZWFkLXN0YXJ0Jyk7XG5cdFx0Y29uc3QgZW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlci1oZWFkLWVuZCcpO1xuXG5cdFx0aWYgKHN0YXJ0ICYmIGVuZCkge1xuXHRcdFx0d2hpbGUgKHN0YXJ0Lm5leHRTaWJsaW5nICE9PSBlbmQpIGRldGFjaChzdGFydC5uZXh0U2libGluZyk7XG5cdFx0XHRkZXRhY2goc3RhcnQpO1xuXHRcdFx0ZGV0YWNoKGVuZCk7XG5cdFx0fVxuXG5cdFx0cm9vdF9jb21wb25lbnQgPSBuZXcgQXBwKHtcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3BzLFxuXHRcdFx0aHlkcmF0ZTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cblx0Y3VycmVudF9icmFuY2ggPSBicmFuY2g7XG5cdGN1cnJlbnRfcXVlcnkgPSBKU09OLnN0cmluZ2lmeShwYWdlLnF1ZXJ5KTtcblx0cmVhZHkgPSB0cnVlO1xuXHRzZXNzaW9uX2RpcnR5ID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHBhcnRfY2hhbmdlZChpLCBzZWdtZW50LCBtYXRjaCwgc3RyaW5naWZpZWRfcXVlcnkpIHtcblx0Ly8gVE9ETyBvbmx5IGNoZWNrIHF1ZXJ5IHN0cmluZyBjaGFuZ2VzIGZvciBwcmVsb2FkIGZ1bmN0aW9uc1xuXHQvLyB0aGF0IGRvIGluIGZhY3QgZGVwZW5kIG9uIGl0ICh1c2luZyBzdGF0aWMgYW5hbHlzaXMgb3Jcblx0Ly8gcnVudGltZSBpbnN0cnVtZW50YXRpb24pXG5cdGlmIChzdHJpbmdpZmllZF9xdWVyeSAhPT0gY3VycmVudF9xdWVyeSkgcmV0dXJuIHRydWU7XG5cblx0Y29uc3QgcHJldmlvdXMgPSBjdXJyZW50X2JyYW5jaFtpXTtcblxuXHRpZiAoIXByZXZpb3VzKSByZXR1cm4gZmFsc2U7XG5cdGlmIChzZWdtZW50ICE9PSBwcmV2aW91cy5zZWdtZW50KSByZXR1cm4gdHJ1ZTtcblx0aWYgKHByZXZpb3VzLm1hdGNoKSB7XG5cdFx0aWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzLm1hdGNoLnNsaWNlKDEsIGkgKyAyKSkgIT09IEpTT04uc3RyaW5naWZ5KG1hdGNoLnNsaWNlKDEsIGkgKyAyKSkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBoeWRyYXRlX3RhcmdldCh0YXJnZXQpXG5cblxuXG4ge1xuXHRjb25zdCB7IHJvdXRlLCBwYWdlIH0gPSB0YXJnZXQ7XG5cdGNvbnN0IHNlZ21lbnRzID0gcGFnZS5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pO1xuXG5cdGxldCByZWRpcmVjdCA9IG51bGw7XG5cblx0Y29uc3QgcHJvcHMgPSB7IGVycm9yOiBudWxsLCBzdGF0dXM6IDIwMCwgc2VnbWVudHM6IFtzZWdtZW50c1swXV0gfTtcblxuXHRjb25zdCBwcmVsb2FkX2NvbnRleHQgPSB7XG5cdFx0ZmV0Y2g6ICh1cmwsIG9wdHMpID0+IGZldGNoKHVybCwgb3B0cyksXG5cdFx0cmVkaXJlY3Q6IChzdGF0dXNDb2RlLCBsb2NhdGlvbikgPT4ge1xuXHRcdFx0aWYgKHJlZGlyZWN0ICYmIChyZWRpcmVjdC5zdGF0dXNDb2RlICE9PSBzdGF0dXNDb2RlIHx8IHJlZGlyZWN0LmxvY2F0aW9uICE9PSBsb2NhdGlvbikpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb25mbGljdGluZyByZWRpcmVjdHNgKTtcblx0XHRcdH1cblx0XHRcdHJlZGlyZWN0ID0geyBzdGF0dXNDb2RlLCBsb2NhdGlvbiB9O1xuXHRcdH0sXG5cdFx0ZXJyb3I6IChzdGF0dXMsIGVycm9yKSA9PiB7XG5cdFx0XHRwcm9wcy5lcnJvciA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBuZXcgRXJyb3IoZXJyb3IpIDogZXJyb3I7XG5cdFx0XHRwcm9wcy5zdGF0dXMgPSBzdGF0dXM7XG5cdFx0fVxuXHR9O1xuXG5cdGlmICghcm9vdF9wcmVsb2FkZWQpIHtcblx0XHRyb290X3ByZWxvYWRlZCA9IGluaXRpYWxfZGF0YS5wcmVsb2FkZWRbMF0gfHwgcm9vdF9wcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRob3N0OiBwYWdlLmhvc3QsXG5cdFx0XHRwYXRoOiBwYWdlLnBhdGgsXG5cdFx0XHRxdWVyeTogcGFnZS5xdWVyeSxcblx0XHRcdHBhcmFtczoge31cblx0XHR9LCAkc2Vzc2lvbik7XG5cdH1cblxuXHRsZXQgYnJhbmNoO1xuXHRsZXQgbCA9IDE7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBzdHJpbmdpZmllZF9xdWVyeSA9IEpTT04uc3RyaW5naWZ5KHBhZ2UucXVlcnkpO1xuXHRcdGNvbnN0IG1hdGNoID0gcm91dGUucGF0dGVybi5leGVjKHBhZ2UucGF0aCk7XG5cblx0XHRsZXQgc2VnbWVudF9kaXJ0eSA9IGZhbHNlO1xuXG5cdFx0YnJhbmNoID0gYXdhaXQgUHJvbWlzZS5hbGwocm91dGUucGFydHMubWFwKGFzeW5jIChwYXJ0LCBpKSA9PiB7XG5cdFx0XHRjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbaV07XG5cblx0XHRcdGlmIChwYXJ0X2NoYW5nZWQoaSwgc2VnbWVudCwgbWF0Y2gsIHN0cmluZ2lmaWVkX3F1ZXJ5KSkgc2VnbWVudF9kaXJ0eSA9IHRydWU7XG5cblx0XHRcdHByb3BzLnNlZ21lbnRzW2xdID0gc2VnbWVudHNbaSArIDFdOyAvLyBUT0RPIG1ha2UgdGhpcyBsZXNzIGNvbmZ1c2luZ1xuXHRcdFx0aWYgKCFwYXJ0KSByZXR1cm4geyBzZWdtZW50IH07XG5cblx0XHRcdGNvbnN0IGogPSBsKys7XG5cblx0XHRcdGlmICghc2Vzc2lvbl9kaXJ0eSAmJiAhc2VnbWVudF9kaXJ0eSAmJiBjdXJyZW50X2JyYW5jaFtpXSAmJiBjdXJyZW50X2JyYW5jaFtpXS5wYXJ0ID09PSBwYXJ0LmkpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfYnJhbmNoW2ldO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWdtZW50X2RpcnR5ID0gZmFsc2U7XG5cblx0XHRcdGNvbnN0IHsgZGVmYXVsdDogY29tcG9uZW50LCBwcmVsb2FkIH0gPSBhd2FpdCBsb2FkX2NvbXBvbmVudChjb21wb25lbnRzW3BhcnQuaV0pO1xuXG5cdFx0XHRsZXQgcHJlbG9hZGVkO1xuXHRcdFx0aWYgKHJlYWR5IHx8ICFpbml0aWFsX2RhdGEucHJlbG9hZGVkW2kgKyAxXSkge1xuXHRcdFx0XHRwcmVsb2FkZWQgPSBwcmVsb2FkXG5cdFx0XHRcdFx0PyBhd2FpdCBwcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRcdFx0XHRob3N0OiBwYWdlLmhvc3QsXG5cdFx0XHRcdFx0XHRwYXRoOiBwYWdlLnBhdGgsXG5cdFx0XHRcdFx0XHRxdWVyeTogcGFnZS5xdWVyeSxcblx0XHRcdFx0XHRcdHBhcmFtczogcGFydC5wYXJhbXMgPyBwYXJ0LnBhcmFtcyh0YXJnZXQubWF0Y2gpIDoge31cblx0XHRcdFx0XHR9LCAkc2Vzc2lvbilcblx0XHRcdFx0XHQ6IHt9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJlbG9hZGVkID0gaW5pdGlhbF9kYXRhLnByZWxvYWRlZFtpICsgMV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAocHJvcHNbYGxldmVsJHtqfWBdID0geyBjb21wb25lbnQsIHByb3BzOiBwcmVsb2FkZWQsIHNlZ21lbnQsIG1hdGNoLCBwYXJ0OiBwYXJ0LmkgfSk7XG5cdFx0fSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHByb3BzLmVycm9yID0gZXJyb3I7XG5cdFx0cHJvcHMuc3RhdHVzID0gNTAwO1xuXHRcdGJyYW5jaCA9IFtdO1xuXHR9XG5cblx0cmV0dXJuIHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfTtcbn1cblxuZnVuY3Rpb24gbG9hZF9jc3MoY2h1bmspIHtcblx0Y29uc3QgaHJlZiA9IGBjbGllbnQvJHtjaHVua31gO1xuXHRpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGlua1tocmVmPVwiJHtocmVmfVwiXWApKSByZXR1cm47XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKChmdWxmaWwsIHJlamVjdCkgPT4ge1xuXHRcdGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cdFx0bGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cdFx0bGluay5ocmVmID0gaHJlZjtcblxuXHRcdGxpbmsub25sb2FkID0gKCkgPT4gZnVsZmlsKCk7XG5cdFx0bGluay5vbmVycm9yID0gcmVqZWN0O1xuXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRfY29tcG9uZW50KGNvbXBvbmVudClcblxuXG4ge1xuXHQvLyBUT0RPIHRoaXMgaXMgdGVtcG9yYXJ5IOKAlCBvbmNlIHBsYWNlaG9sZGVycyBhcmVcblx0Ly8gYWx3YXlzIHJld3JpdHRlbiwgc2NyYXRjaCB0aGUgdGVybmFyeVxuXHRjb25zdCBwcm9taXNlcyA9ICh0eXBlb2YgY29tcG9uZW50LmNzcyA9PT0gJ3N0cmluZycgPyBbXSA6IGNvbXBvbmVudC5jc3MubWFwKGxvYWRfY3NzKSk7XG5cdHByb21pc2VzLnVuc2hpZnQoY29tcG9uZW50LmpzKCkpO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4odmFsdWVzID0+IHZhbHVlc1swXSk7XG59XG5cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG5cdG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZnVuY3Rpb24gcHJlZmV0Y2goaHJlZikge1xuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwoaHJlZiwgZG9jdW1lbnQuYmFzZVVSSSkpO1xuXG5cdGlmICh0YXJnZXQpIHtcblx0XHRpZiAoIXByZWZldGNoaW5nIHx8IGhyZWYgIT09IHByZWZldGNoaW5nLmhyZWYpIHtcblx0XHRcdHNldF9wcmVmZXRjaGluZyhocmVmLCBoeWRyYXRlX3RhcmdldCh0YXJnZXQpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJlZmV0Y2hpbmcucHJvbWlzZTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdGFydChvcHRzXG5cbikge1xuXHRpZiAoJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBfaGlzdG9yeSkge1xuXHRcdF9oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxuXHRzZXRfdGFyZ2V0KG9wdHMudGFyZ2V0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZV9jbGljayk7XG5cdGFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlX3BvcHN0YXRlKTtcblxuXHQvLyBwcmVmZXRjaFxuXHRhZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdHJpZ2dlcl9wcmVmZXRjaCk7XG5cdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZV9tb3VzZW1vdmUpO1xuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcblx0XHRjb25zdCB7IGhhc2gsIGhyZWYgfSA9IGxvY2F0aW9uO1xuXG5cdFx0X2hpc3RvcnkucmVwbGFjZVN0YXRlKHsgaWQ6IHVpZCB9LCAnJywgaHJlZik7XG5cblx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG5cdFx0aWYgKGluaXRpYWxfZGF0YS5lcnJvcikgcmV0dXJuIGhhbmRsZV9lcnJvcigpO1xuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldCh1cmwpO1xuXHRcdGlmICh0YXJnZXQpIHJldHVybiBuYXZpZ2F0ZSh0YXJnZXQsIHVpZCwgdHJ1ZSwgaGFzaCk7XG5cdH0pO1xufVxuXG5sZXQgbW91c2Vtb3ZlX3RpbWVvdXQ7XG5cbmZ1bmN0aW9uIGhhbmRsZV9tb3VzZW1vdmUoZXZlbnQpIHtcblx0Y2xlYXJUaW1lb3V0KG1vdXNlbW92ZV90aW1lb3V0KTtcblx0bW91c2Vtb3ZlX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHR0cmlnZ2VyX3ByZWZldGNoKGV2ZW50KTtcblx0fSwgMjApO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyX3ByZWZldGNoKGV2ZW50KSB7XG5cdGNvbnN0IGEgPSBmaW5kX2FuY2hvcihldmVudC50YXJnZXQpO1xuXHRpZiAoIWEgfHwgYS5yZWwgIT09ICdwcmVmZXRjaCcpIHJldHVybjtcblxuXHRwcmVmZXRjaChhLmhyZWYpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfY2xpY2soZXZlbnQpIHtcblx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzXG5cdC8vIE1JVCBsaWNlbnNlIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzI2xpY2Vuc2Vcblx0aWYgKHdoaWNoKGV2ZW50KSAhPT0gMSkgcmV0dXJuO1xuXHRpZiAoZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XG5cdGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblx0Y29uc3QgYSA9IGZpbmRfYW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdGlmICghYSkgcmV0dXJuO1xuXG5cdGlmICghYS5ocmVmKSByZXR1cm47XG5cblx0Ly8gY2hlY2sgaWYgbGluayBpcyBpbnNpZGUgYW4gc3ZnXG5cdC8vIGluIHRoaXMgY2FzZSwgYm90aCBocmVmIGFuZCB0YXJnZXQgYXJlIGFsd2F5cyBpbnNpZGUgYW4gb2JqZWN0XG5cdGNvbnN0IHN2ZyA9IHR5cGVvZiBhLmhyZWYgPT09ICdvYmplY3QnICYmIGEuaHJlZi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnU1ZHQW5pbWF0ZWRTdHJpbmcnO1xuXHRjb25zdCBocmVmID0gU3RyaW5nKHN2ZyA/IChhKS5ocmVmLmJhc2VWYWwgOiBhLmhyZWYpO1xuXG5cdGlmIChocmVmID09PSBsb2NhdGlvbi5ocmVmKSB7XG5cdFx0aWYgKCFsb2NhdGlvbi5oYXNoKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIElnbm9yZSBpZiB0YWcgaGFzXG5cdC8vIDEuICdkb3dubG9hZCcgYXR0cmlidXRlXG5cdC8vIDIuIHJlbD0nZXh0ZXJuYWwnIGF0dHJpYnV0ZVxuXHRpZiAoYS5oYXNBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgYS5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cblx0Ly8gSWdub3JlIGlmIDxhPiBoYXMgYSB0YXJnZXRcblx0aWYgKHN2ZyA/IChhKS50YXJnZXQuYmFzZVZhbCA6IGEudGFyZ2V0KSByZXR1cm47XG5cblx0Y29uc3QgdXJsID0gbmV3IFVSTChocmVmKTtcblxuXHQvLyBEb24ndCBoYW5kbGUgaGFzaCBjaGFuZ2VzXG5cdGlmICh1cmwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIHVybC5zZWFyY2ggPT09IGxvY2F0aW9uLnNlYXJjaCkgcmV0dXJuO1xuXG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQodXJsKTtcblx0aWYgKHRhcmdldCkge1xuXHRcdGNvbnN0IG5vc2Nyb2xsID0gYS5oYXNBdHRyaWJ1dGUoJ3NhcHBlci1ub3Njcm9sbCcpO1xuXHRcdG5hdmlnYXRlKHRhcmdldCwgbnVsbCwgbm9zY3JvbGwsIHVybC5oYXNoKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdF9oaXN0b3J5LnB1c2hTdGF0ZSh7IGlkOiBjaWQgfSwgJycsIHVybC5ocmVmKTtcblx0fVxufVxuXG5mdW5jdGlvbiB3aGljaChldmVudCkge1xuXHRyZXR1cm4gZXZlbnQud2hpY2ggPT09IG51bGwgPyBldmVudC5idXR0b24gOiBldmVudC53aGljaDtcbn1cblxuZnVuY3Rpb24gZmluZF9hbmNob3Iobm9kZSkge1xuXHR3aGlsZSAobm9kZSAmJiBub2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09ICdBJykgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTsgLy8gU1ZHIDxhPiBlbGVtZW50cyBoYXZlIGEgbG93ZXJjYXNlIG5hbWVcblx0cmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wb3BzdGF0ZShldmVudCkge1xuXHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gc2Nyb2xsX3N0YXRlKCk7XG5cblx0aWYgKGV2ZW50LnN0YXRlKSB7XG5cdFx0Y29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KHVybCk7XG5cdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0bmF2aWdhdGUodGFyZ2V0LCBldmVudC5zdGF0ZS5pZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBoYXNoY2hhbmdlXG5cdFx0c2V0X3VpZCh1aWQgKyAxKTtcblx0XHRzZXRfY2lkKHVpZCk7XG5cdFx0X2hpc3RvcnkucmVwbGFjZVN0YXRlKHsgaWQ6IGNpZCB9LCAnJywgbG9jYXRpb24uaHJlZik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcHJlZmV0Y2hSb3V0ZXMocGF0aG5hbWVzKSB7XG5cdHJldHVybiByb3V0ZXNcblx0XHQuZmlsdGVyKHBhdGhuYW1lc1xuXHRcdFx0PyByb3V0ZSA9PiBwYXRobmFtZXMuc29tZShwYXRobmFtZSA9PiByb3V0ZS5wYXR0ZXJuLnRlc3QocGF0aG5hbWUpKVxuXHRcdFx0OiAoKSA9PiB0cnVlXG5cdFx0KVxuXHRcdC5yZWR1Y2UoKHByb21pc2UsIHJvdXRlKSA9PiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHJvdXRlLnBhcnRzLm1hcChwYXJ0ID0+IHBhcnQgJiYgbG9hZF9jb21wb25lbnQoY29tcG9uZW50c1twYXJ0LmldKSkpO1xuXHRcdH0pLCBQcm9taXNlLnJlc29sdmUoKSk7XG59XG5cbmNvbnN0IHN0b3JlcyQxID0gKCkgPT4gZ2V0Q29udGV4dChDT05URVhUX0tFWSk7XG5cbmV4cG9ydCB7IGdvdG8sIHByZWZldGNoLCBwcmVmZXRjaFJvdXRlcywgc3RhcnQsIHN0b3JlcyQxIGFzIHN0b3JlcyB9O1xuIiwiaW1wb3J0ICogYXMgc2FwcGVyIGZyb20gXCJAc2FwcGVyL2FwcFwiO1xuXG5zYXBwZXIuc3RhcnQoe1xuICB0YXJnZXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2FwcGVyXCIpXG59KTtcbiJdLCJuYW1lcyI6WyJub29wIiwiaWRlbnRpdHkiLCJ4IiwiYXNzaWduIiwidGFyIiwic3JjIiwiayIsImFkZF9sb2NhdGlvbiIsImVsZW1lbnQiLCJmaWxlIiwibGluZSIsImNvbHVtbiIsImNoYXIiLCJfX3N2ZWx0ZV9tZXRhIiwibG9jIiwicnVuIiwiZm4iLCJibGFua19vYmplY3QiLCJPYmplY3QiLCJjcmVhdGUiLCJydW5fYWxsIiwiZm5zIiwiZm9yRWFjaCIsImlzX2Z1bmN0aW9uIiwidGhpbmciLCJzYWZlX25vdF9lcXVhbCIsImEiLCJiIiwidmFsaWRhdGVfc3RvcmUiLCJzdG9yZSIsIm5hbWUiLCJzdWJzY3JpYmUiLCJFcnJvciIsImNhbGxiYWNrcyIsInVuc3ViIiwidW5zdWJzY3JpYmUiLCJjb21wb25lbnRfc3Vic2NyaWJlIiwiY29tcG9uZW50IiwiY2FsbGJhY2siLCIkJCIsIm9uX2Rlc3Ryb3kiLCJwdXNoIiwiY3JlYXRlX3Nsb3QiLCJkZWZpbml0aW9uIiwiY3R4IiwiJCRzY29wZSIsInNsb3RfY3R4IiwiZ2V0X3Nsb3RfY29udGV4dCIsInNsaWNlIiwiZ2V0X3Nsb3RfY2hhbmdlcyIsImRpcnR5IiwibGV0cyIsInVuZGVmaW5lZCIsIm1lcmdlZCIsImxlbiIsIk1hdGgiLCJtYXgiLCJsZW5ndGgiLCJpIiwidXBkYXRlX3Nsb3QiLCJzbG90Iiwic2xvdF9kZWZpbml0aW9uIiwiZ2V0X3Nsb3RfY2hhbmdlc19mbiIsImdldF9zbG90X2NvbnRleHRfZm4iLCJzbG90X2NoYW5nZXMiLCJzbG90X2NvbnRleHQiLCJwIiwiZXhjbHVkZV9pbnRlcm5hbF9wcm9wcyIsInByb3BzIiwicmVzdWx0IiwibnVsbF90b19lbXB0eSIsInZhbHVlIiwiYWN0aW9uX2Rlc3Ryb3llciIsImFjdGlvbl9yZXN1bHQiLCJkZXN0cm95IiwiaXNfY2xpZW50Iiwid2luZG93Iiwibm93IiwicGVyZm9ybWFuY2UiLCJEYXRlIiwicmFmIiwiY2IiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ0YXNrcyIsIlNldCIsInJ1bl90YXNrcyIsInRhc2siLCJjIiwiZGVsZXRlIiwiZiIsInNpemUiLCJsb29wIiwicHJvbWlzZSIsIlByb21pc2UiLCJmdWxmaWxsIiwiYWRkIiwiYWJvcnQiLCJhcHBlbmQiLCJ0YXJnZXQiLCJub2RlIiwiYXBwZW5kQ2hpbGQiLCJpbnNlcnQiLCJhbmNob3IiLCJpbnNlcnRCZWZvcmUiLCJkZXRhY2giLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJkZXN0cm95X2VhY2giLCJpdGVyYXRpb25zIiwiZGV0YWNoaW5nIiwiZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN2Z19lbGVtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwidGV4dCIsImRhdGEiLCJjcmVhdGVUZXh0Tm9kZSIsInNwYWNlIiwiZW1wdHkiLCJsaXN0ZW4iLCJldmVudCIsImhhbmRsZXIiLCJvcHRpb25zIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzdG9wX3Byb3BhZ2F0aW9uIiwic3RvcFByb3BhZ2F0aW9uIiwiY2FsbCIsImF0dHIiLCJhdHRyaWJ1dGUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJkZXNjcmlwdG9ycyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJfX3Byb3RvX18iLCJrZXkiLCJzdHlsZSIsImNzc1RleHQiLCJzZXQiLCJ0b19udW1iZXIiLCJjaGlsZHJlbiIsIkFycmF5IiwiZnJvbSIsImNoaWxkTm9kZXMiLCJjbGFpbV9lbGVtZW50Iiwibm9kZXMiLCJzdmciLCJub2RlTmFtZSIsImoiLCJyZW1vdmUiLCJzcGxpY2UiLCJjbGFpbV90ZXh0Iiwibm9kZVR5cGUiLCJjbGFpbV9zcGFjZSIsInNldF9pbnB1dF92YWx1ZSIsImlucHV0Iiwic2V0X3N0eWxlIiwiaW1wb3J0YW50Iiwic2V0UHJvcGVydHkiLCJ0b2dnbGVfY2xhc3MiLCJ0b2dnbGUiLCJjbGFzc0xpc3QiLCJjdXN0b21fZXZlbnQiLCJ0eXBlIiwiZGV0YWlsIiwiZSIsImNyZWF0ZUV2ZW50IiwiaW5pdEN1c3RvbUV2ZW50IiwicXVlcnlfc2VsZWN0b3JfYWxsIiwic2VsZWN0b3IiLCJwYXJlbnQiLCJib2R5IiwicXVlcnlTZWxlY3RvckFsbCIsIkh0bWxUYWciLCJjb25zdHJ1Y3RvciIsIm4iLCJtIiwiaHRtbCIsInQiLCJoIiwiaW5uZXJIVE1MIiwiYWN0aXZlX2RvY3MiLCJhY3RpdmUiLCJoYXNoIiwic3RyIiwiY2hhckNvZGVBdCIsImNyZWF0ZV9ydWxlIiwiZHVyYXRpb24iLCJkZWxheSIsImVhc2UiLCJ1aWQiLCJzdGVwIiwia2V5ZnJhbWVzIiwicnVsZSIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJzdHlsZXNoZWV0IiwiX19zdmVsdGVfc3R5bGVzaGVldCIsImhlYWQiLCJzaGVldCIsImN1cnJlbnRfcnVsZXMiLCJfX3N2ZWx0ZV9ydWxlcyIsImluc2VydFJ1bGUiLCJjc3NSdWxlcyIsImFuaW1hdGlvbiIsImRlbGV0ZV9ydWxlIiwicHJldmlvdXMiLCJzcGxpdCIsIm5leHQiLCJmaWx0ZXIiLCJhbmltIiwiaW5kZXhPZiIsImRlbGV0ZWQiLCJqb2luIiwiY2xlYXJfcnVsZXMiLCJkZWxldGVSdWxlIiwiY2xlYXIiLCJjdXJyZW50X2NvbXBvbmVudCIsInNldF9jdXJyZW50X2NvbXBvbmVudCIsImdldF9jdXJyZW50X2NvbXBvbmVudCIsIm9uTW91bnQiLCJvbl9tb3VudCIsIm9uRGVzdHJveSIsImNyZWF0ZUV2ZW50RGlzcGF0Y2hlciIsInNldENvbnRleHQiLCJjb250ZXh0IiwiZ2V0Q29udGV4dCIsImdldCIsImJ1YmJsZSIsImRpcnR5X2NvbXBvbmVudHMiLCJiaW5kaW5nX2NhbGxiYWNrcyIsInJlbmRlcl9jYWxsYmFja3MiLCJmbHVzaF9jYWxsYmFja3MiLCJyZXNvbHZlZF9wcm9taXNlIiwicmVzb2x2ZSIsInVwZGF0ZV9zY2hlZHVsZWQiLCJzY2hlZHVsZV91cGRhdGUiLCJ0aGVuIiwiZmx1c2giLCJhZGRfcmVuZGVyX2NhbGxiYWNrIiwiYWRkX2ZsdXNoX2NhbGxiYWNrIiwiZmx1c2hpbmciLCJzZWVuX2NhbGxiYWNrcyIsInVwZGF0ZSIsInBvcCIsImhhcyIsImZyYWdtZW50IiwiYmVmb3JlX3VwZGF0ZSIsImFmdGVyX3VwZGF0ZSIsIndhaXQiLCJkaXNwYXRjaCIsImRpcmVjdGlvbiIsImtpbmQiLCJkaXNwYXRjaEV2ZW50Iiwib3V0cm9pbmciLCJvdXRyb3MiLCJncm91cF9vdXRyb3MiLCJyIiwiY2hlY2tfb3V0cm9zIiwidHJhbnNpdGlvbl9pbiIsImJsb2NrIiwibG9jYWwiLCJ0cmFuc2l0aW9uX291dCIsIm8iLCJudWxsX3RyYW5zaXRpb24iLCJjcmVhdGVfaW5fdHJhbnNpdGlvbiIsInBhcmFtcyIsImNvbmZpZyIsInJ1bm5pbmciLCJhbmltYXRpb25fbmFtZSIsImNsZWFudXAiLCJnbyIsImVhc2luZyIsInRpY2siLCJjc3MiLCJzdGFydF90aW1lIiwiZW5kX3RpbWUiLCJzdGFydGVkIiwic3RhcnQiLCJpbnZhbGlkYXRlIiwiZW5kIiwiY3JlYXRlX291dF90cmFuc2l0aW9uIiwiZ3JvdXAiLCJyZXNldCIsImNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24iLCJpbnRybyIsInJ1bm5pbmdfcHJvZ3JhbSIsInBlbmRpbmdfcHJvZ3JhbSIsImNsZWFyX2FuaW1hdGlvbiIsImluaXQiLCJwcm9ncmFtIiwiYWJzIiwiZ2xvYmFscyIsImdsb2JhbFRoaXMiLCJnbG9iYWwiLCJnZXRfc3ByZWFkX3VwZGF0ZSIsImxldmVscyIsInVwZGF0ZXMiLCJ0b19udWxsX291dCIsImFjY291bnRlZF9mb3IiLCJnZXRfc3ByZWFkX29iamVjdCIsInNwcmVhZF9wcm9wcyIsImJpbmQiLCJpbmRleCIsImJvdW5kIiwiY3JlYXRlX2NvbXBvbmVudCIsImNsYWltX2NvbXBvbmVudCIsInBhcmVudF9ub2RlcyIsImwiLCJtb3VudF9jb21wb25lbnQiLCJuZXdfb25fZGVzdHJveSIsIm1hcCIsImRlc3Ryb3lfY29tcG9uZW50IiwibWFrZV9kaXJ0eSIsImZpbGwiLCJpbnN0YW5jZSIsImNyZWF0ZV9mcmFnbWVudCIsIm5vdF9lcXVhbCIsInBhcmVudF9jb21wb25lbnQiLCJwcm9wX3ZhbHVlcyIsIk1hcCIsInJlYWR5IiwicmV0IiwicmVzdCIsImh5ZHJhdGUiLCJTdmVsdGVDb21wb25lbnQiLCIkZGVzdHJveSIsIiRvbiIsIiRzZXQiLCJkaXNwYXRjaF9kZXYiLCJ2ZXJzaW9uIiwiYXBwZW5kX2RldiIsImluc2VydF9kZXYiLCJkZXRhY2hfZGV2IiwibGlzdGVuX2RldiIsImhhc19wcmV2ZW50X2RlZmF1bHQiLCJoYXNfc3RvcF9wcm9wYWdhdGlvbiIsIm1vZGlmaWVycyIsImtleXMiLCJkaXNwb3NlIiwiYXR0cl9kZXYiLCJwcm9wX2RldiIsInByb3BlcnR5Iiwic2V0X2RhdGFfZGV2Iiwid2hvbGVUZXh0IiwidmFsaWRhdGVfZWFjaF9hcmd1bWVudCIsImFyZyIsIm1zZyIsIlN5bWJvbCIsIml0ZXJhdG9yIiwidmFsaWRhdGVfc2xvdHMiLCJzbG90X2tleSIsImNvbnNvbGUiLCJ3YXJuIiwiU3ZlbHRlQ29tcG9uZW50RGV2IiwiJCRpbmxpbmUiLCIkY2FwdHVyZV9zdGF0ZSIsIiRpbmplY3Rfc3RhdGUiLCJzdWJzY3JpYmVyX3F1ZXVlIiwid3JpdGFibGUiLCJzdG9wIiwic3Vic2NyaWJlcnMiLCJuZXdfdmFsdWUiLCJydW5fcXVldWUiLCJzIiwic3Vic2NyaWJlciIsIkNPTlRFWFRfS0VZIiwicHJlbG9hZCIsIm5vRGVwdGgiLCJnZXRDbGFzcyIsInByb3AiLCJjb2xvciIsImRlcHRoIiwiZGVmYXVsdERlcHRoIiwiaW5jbHVkZXMiLCJ1dGlscyIsImJnIiwiYm9yZGVyIiwidHh0IiwiY2FyZXQiLCJDbGFzc0J1aWxkZXIiLCJjbGFzc2VzIiwiZGVmYXVsdENsYXNzZXMiLCJkZWZhdWx0cyIsImV4dGVuZCIsInJlcGxhY2UiLCJjb25kIiwicmVkdWNlIiwiYWNjIiwiUmVnRXhwIiwiY3VyIiwiY2xhc3NOYW1lIiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdFJlc2VydmVkIiwiZmlsdGVyUHJvcHMiLCJyZXNlcnZlZCIsImNsYXNzZXNEZWZhdWx0IiwiJCIsIiQkcHJvcHMiLCJjbGFzcyIsInNtYWxsIiwieHMiLCJyZXZlcnNlIiwidGlwIiwicmlwcGxlIiwiY2VudGVyZWQiLCJjdXJyZW50VGFyZ2V0IiwiY2lyY2xlIiwiY2xpZW50V2lkdGgiLCJjbGllbnRIZWlnaHQiLCJyZW1vdmVDaXJjbGUiLCJ3aWR0aCIsImhlaWdodCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0IiwiY2xpZW50WCIsInRvcCIsImNsaWVudFkiLCJvbk1vdXNlRG93biIsImljb24iLCJpZCIsInRvIiwic2VsZWN0ZWQiLCJub3RTZWxlY3RlZENvbG9yIiwidGFiQ2xhc3NlcyIsImNyZWF0ZVJpcHBsZSIsIm5vdFNlbGVjdGVkIiwidGV4dENvbG9yIiwiY3ViaWNPdXQiLCJxdWFkSW4iLCJxdWFkT3V0IiwiZmFkZSIsImxpbmVhciIsImdldENvbXB1dGVkU3R5bGUiLCJvcGFjaXR5IiwiZmx5IiwieSIsInRhcmdldF9vcGFjaXR5IiwidHJhbnNmb3JtIiwib2QiLCJ1Iiwic2xpZGUiLCJwYXJzZUZsb2F0IiwicGFkZGluZ190b3AiLCJwYWRkaW5nVG9wIiwicGFkZGluZ19ib3R0b20iLCJwYWRkaW5nQm90dG9tIiwibWFyZ2luX3RvcCIsIm1hcmdpblRvcCIsIm1hcmdpbl9ib3R0b20iLCJtYXJnaW5Cb3R0b20iLCJib3JkZXJfdG9wX3dpZHRoIiwiYm9yZGVyVG9wV2lkdGgiLCJib3JkZXJfYm90dG9tX3dpZHRoIiwiYm9yZGVyQm90dG9tV2lkdGgiLCJtaW4iLCJzY2FsZSIsInNkIiwiX3QiLCJhcHAiLCJwcm9ncmVzcyIsImluaXRpYWxpemVkIiwic2V0VGltZW91dCIsIm5hdmlnYXRpb24iLCJpdGVtcyIsImluZGljYXRvciIsImxvYWRpbmciLCJ0YWJCdXR0b25DbGFzc2VzIiwiaW5kaWNhdG9yV2lkdGgiLCJpbmRpY2F0b3JPZmZzZXQiLCJvZmZzZXQiLCJjYWxjSW5kaWNhdG9yIiwib2Zmc2V0V2lkdGgiLCJmaW5kSW5kZXgiLCJsb25nZXN0TWF0Y2giLCJpdGVtIiwic29ydCIsImluZGV4MSIsIml0ZW0xIiwiaW5kZXgyIiwiaXRlbTIiLCJiYXNpY0RlZmF1bHQiLCJvdXRsaW5lZERlZmF1bHQiLCJ0ZXh0RGVmYXVsdCIsImljb25EZWZhdWx0IiwiZmFiRGVmYXVsdCIsInNtYWxsRGVmYXVsdCIsImRpc2FibGVkRGVmYXVsdCIsImVsZXZhdGlvbkRlZmF1bHQiLCJvdXRsaW5lZCIsImRpc2FibGVkIiwibGlnaHQiLCJkYXJrIiwiZmxhdCIsImljb25DbGFzcyIsImhyZWYiLCJmYWIiLCJiYXNpY0NsYXNzZXMiLCJvdXRsaW5lZENsYXNzZXMiLCJ0ZXh0Q2xhc3NlcyIsImljb25DbGFzc2VzIiwiZmFiQ2xhc3NlcyIsInNtYWxsQ2xhc3NlcyIsImRpc2FibGVkQ2xhc3NlcyIsImVsZXZhdGlvbkNsYXNzZXMiLCJiYXNpYyIsImVsZXZhdGlvbiIsIkNsYXNzZXMiLCJpQ2xhc3NlcyIsInNoYWRlIiwiaWNvbkNiIiwibm9ybWFsIiwibGlnaHRlciIsImluUHJvcHMiLCJvdXRQcm9wcyIsIlNjcmltIiwic2NyaW0iLCJTcGFjZXIiLCJzcGFjZXIiLCJzZWxlY3RlZENsYXNzZXNEZWZhdWx0Iiwic3ViaGVhZGluZ0NsYXNzZXNEZWZhdWx0Iiwic3ViaGVhZGluZyIsImRlbnNlIiwidGFiaW5kZXgiLCJzZWxlY3RlZENsYXNzZXMiLCJzdWJoZWFkaW5nQ2xhc3NlcyIsImxldmVsIiwiY2hhbmdlIiwiZ2V0VGV4dCIsInNlbGVjdCIsIml0ZW1DbGFzc2VzIiwiZGVmYXVsdENhbGMiLCJicmVha3BvaW50IiwiY2FsY0JyZWFrcG9pbnQiLCJpbm5lcldpZHRoIiwib25SZXNpemUiLCJicCIsImJyZWFrcG9pbnRzIiwibmF2Q2xhc3Nlc0RlZmF1bHQiLCJyaWdodCIsInBlcnNpc3RlbnQiLCJzaG93IiwibmF2Q2xhc3NlcyIsImJvcmRlckNsYXNzZXMiLCJ0cmFuc2l0aW9uUHJvcHMiLCJoaWRkZW4iLCIkYnAiLCJuY2IiLCJkZWJvdW5jZSIsImZ1bmMiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiYXJncyIsImFyZ3VtZW50cyIsImxhdGVyIiwiYXBwbHkiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0IiwiZGVsYXlIaWRlIiwiZGVsYXlTaG93Iiwic2hvd1Rvb2x0aXAiLCJoaWRlVG9vbHRpcCIsIm5hdk1lbnUiLCJ0b3BNZW51Iiwic2hvd05hdiIsImRhcmtNb2RlIiwiaXNEYXJrVGhlbWUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImJvZHlDbGFzc2VzIiwidiIsInByZWxvYWRpbmciLCJwYWdlIiwic3RvcmVzIiwicGF0aCIsIiRkYXJrTW9kZSIsIiRzaG93TmF2IiwiJHBhZ2UiLCJzdGFjayIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJlcnJvciIsImRldiIsInNlZ21lbnRzIiwibGV2ZWwwIiwibGV2ZWwxIiwibGV2ZWwyIiwiaWdub3JlIiwiY29tcG9uZW50cyIsImpzIiwicm91dGVzIiwicGF0dGVybiIsInBhcnRzIiwiY2xpZW50IiwiY29ubmVjdCIsImdvdG8iLCJvcHRzIiwicmVwbGFjZVN0YXRlIiwic2VsZWN0X3RhcmdldCIsIlVSTCIsImJhc2VVUkkiLCJfaGlzdG9yeSIsImNpZCIsIm5hdmlnYXRlIiwibG9jYXRpb24iLCJpbml0aWFsX2RhdGEiLCJfX1NBUFBFUl9fIiwicm9vdF9jb21wb25lbnQiLCJjdXJyZW50X3Rva2VuIiwicm9vdF9wcmVsb2FkZWQiLCJjdXJyZW50X2JyYW5jaCIsImN1cnJlbnRfcXVlcnkiLCJzZXNzaW9uIiwiJHNlc3Npb24iLCJzZXNzaW9uX2RpcnR5IiwidG9rZW4iLCJyZWRpcmVjdCIsImJyYW5jaCIsImh5ZHJhdGVfdGFyZ2V0IiwicmVuZGVyIiwicHJlZmV0Y2hpbmciLCJzZXRfcHJlZmV0Y2hpbmciLCJzZXRfdGFyZ2V0Iiwic2V0X3VpZCIsInNldF9jaWQiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwic3RhdGUiLCJ0aXRsZSIsInNjcm9sbFJlc3RvcmF0aW9uIiwic2Nyb2xsX2hpc3RvcnkiLCJleHRyYWN0X3F1ZXJ5Iiwic2VhcmNoIiwicXVlcnkiLCJzZWFyY2hQYXJhbSIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ1cmwiLCJvcmlnaW4iLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJiYXNlVXJsIiwic29tZSIsInRlc3QiLCJyb3V0ZSIsIm1hdGNoIiwicGFydCIsImhvc3QiLCJoYW5kbGVfZXJyb3IiLCJwcmVsb2FkZWQiLCJFcnJvckNvbXBvbmVudCIsInNjcm9sbF9zdGF0ZSIsInBhZ2VYT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJub3Njcm9sbCIsImN1cnJlbnRfc2Nyb2xsIiwibG9hZGVkIiwiYWN0aXZlRWxlbWVudCIsImJsdXIiLCJzY3JvbGwiLCJkZWVwX2xpbmtlZCIsImdldEVsZW1lbnRCeUlkIiwic2Nyb2xsVG8iLCJxdWVyeVNlbGVjdG9yIiwibmV4dFNpYmxpbmciLCJBcHAiLCJKU09OIiwic3RyaW5naWZ5IiwicGFydF9jaGFuZ2VkIiwic2VnbWVudCIsInN0cmluZ2lmaWVkX3F1ZXJ5IiwiQm9vbGVhbiIsInByZWxvYWRfY29udGV4dCIsImZldGNoIiwic3RhdHVzQ29kZSIsInJvb3RfcHJlbG9hZCIsInNlZ21lbnRfZGlydHkiLCJhbGwiLCJkZWZhdWx0IiwibG9hZF9jb21wb25lbnQiLCJsb2FkX2NzcyIsImNodW5rIiwiZnVsZmlsIiwicmVqZWN0IiwibGluayIsInJlbCIsIm9ubG9hZCIsIm9uZXJyb3IiLCJwcm9taXNlcyIsInVuc2hpZnQiLCJ2YWx1ZXMiLCJwcmVmZXRjaCIsImhhbmRsZV9jbGljayIsImhhbmRsZV9wb3BzdGF0ZSIsInRyaWdnZXJfcHJlZmV0Y2giLCJoYW5kbGVfbW91c2Vtb3ZlIiwibW91c2Vtb3ZlX3RpbWVvdXQiLCJmaW5kX2FuY2hvciIsIndoaWNoIiwibWV0YUtleSIsImN0cmxLZXkiLCJzaGlmdEtleSIsImRlZmF1bHRQcmV2ZW50ZWQiLCJTdHJpbmciLCJiYXNlVmFsIiwicHJldmVudERlZmF1bHQiLCJoYXNBdHRyaWJ1dGUiLCJidXR0b24iLCJ0b1VwcGVyQ2FzZSIsInN0b3JlcyQxIiwic2FwcGVyIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTQSxJQUFULEdBQWdCOztBQUNoQixNQUFNQyxRQUFRLEdBQUdDLENBQUMsSUFBSUEsQ0FBdEI7O0FBQ0EsU0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsRUFBcUJDLEdBQXJCLEVBQTBCO0FBQ3RCO0FBQ0EsT0FBSyxNQUFNQyxDQUFYLElBQWdCRCxHQUFoQixFQUNJRCxHQUFHLENBQUNFLENBQUQsQ0FBSCxHQUFTRCxHQUFHLENBQUNDLENBQUQsQ0FBWjs7QUFDSixTQUFPRixHQUFQO0FBQ0g7O0FBSUQsU0FBU0csWUFBVCxDQUFzQkMsT0FBdEIsRUFBK0JDLElBQS9CLEVBQXFDQyxJQUFyQyxFQUEyQ0MsTUFBM0MsRUFBbURDLElBQW5ELEVBQXlEO0FBQ3JESixFQUFBQSxPQUFPLENBQUNLLGFBQVIsR0FBd0I7QUFDcEJDLElBQUFBLEdBQUcsRUFBRTtBQUFFTCxNQUFBQSxJQUFGO0FBQVFDLE1BQUFBLElBQVI7QUFBY0MsTUFBQUEsTUFBZDtBQUFzQkMsTUFBQUE7QUFBdEI7QUFEZSxHQUF4QjtBQUdIOztBQUNELFNBQVNHLEdBQVQsQ0FBYUMsRUFBYixFQUFpQjtBQUNiLFNBQU9BLEVBQUUsRUFBVDtBQUNIOztBQUNELFNBQVNDLFlBQVQsR0FBd0I7QUFDcEIsU0FBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFQO0FBQ0g7O0FBQ0QsU0FBU0MsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDbEJBLEVBQUFBLEdBQUcsQ0FBQ0MsT0FBSixDQUFZUCxHQUFaO0FBQ0g7O0FBQ0QsU0FBU1EsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDeEIs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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWkRBLEVBQUFBLEdBQUksRUFBQSxDQUFKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFES0EsTUFBQUEsR0FBVSxFQUFBOzs7O0FBSmhCQSxNQUFBQSxHQUFFLEVBQUE7OztBQUNEQSxNQUFBQSxHQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJREEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQURDQSxRQUFBQSxHQUFVLEVBQUE7Ozs7Ozs7O0FBSmhCQSxRQUFBQSxHQUFFLEVBQUE7Ozs7Ozs7O0FBQ0RBLFFBQUFBLEdBQUMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQnNCQSxNQUFBQSxHQUFTLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFUQSxNQUFBQSxHQUFTLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBR0EsTUFBQUEsR0FBSSxFQUFBOzs7OztBQUFKQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUluQ0EsTUFBQUEsR0FBSSxFQUFBOzs7OztBQUFKQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBckJlQSxNQUFBQSxHQUFTLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFUQSxNQUFBQSxHQUFTLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBR0EsTUFBQUEsR0FBSSxFQUFBOzs7OztBQUFKQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFB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LEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFSRkEsUUFBQUEsR0FBTyxFQUFBOzs7QUFDVkEsTUFBQUEsR0FBSyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFWRkEsRUFBQUEsR0FBSSxFQUFBLENBQUo7Ozs7Ozs7Ozs7QUFSRUEsSUFBQUEsR0FBTyxFQUFBOzs7QUFDVkEsRUFBQUEsR0FBSyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUxQQSxFQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlGQSxNQUFBQSxHQUFJLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUkZBLFFBQUFBLEdBQU8sRUFBQTs7O0FBQ1ZBLE1BQUFBLEdBQUssRUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBTFBBLE1BQUFBLEdBQUssRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJNQSxNQUFBQSxHQUFRLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFSQSxNQUFBQSxHQUFRLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVdBLE1BQUFBLEdBQUksRUFBQTs7Ozs7QUFBSkEsTUFBQUEsR0FBSSxFQUFBOzs7Ozs7Ozs7O0FBQUpBLE1BQUFBLEdBQUksRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBakJyQkEsTUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBUkEsTUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFXQSxNQUFBQSxHQUFJLEVBQUE7Ozs7O0FBQUpBLE1BQUFBLEdBQUks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
