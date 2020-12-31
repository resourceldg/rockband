import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, x as create_slot, F as assign, G as ClassBuilder, v as validate_slots, H as exclude_internal_props, t as text, l as claim_text, h as insert_dev, z as set_data_dev, b as detach_dev, e as element, c as claim_element, a as children, I as set_attributes, f as add_location, B as update_slot, J as get_spread_update, r as transition_in, u as transition_out, K as createEventDispatcher, L as Icon, o as create_component, p as claim_component, q as mount_component, w as destroy_component, k as space, m as claim_space, g as attr_dev, j as append_dev, M as listen_dev, N as prop_dev, O as run_all, Q as bubble, R as empty, T as group_outros, U as check_outros } from './client.b0aae0e4.js';
import { R as Ripple } from './index.7763868f.js';

/* src/components/Checkbox/Label.svelte generated by Svelte v3.24.0 */
const file = "src/components/Checkbox/Label.svelte"; // (27:8) {label}

function fallback_block(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text(
      /*label*/
      ctx[0]);
    },
    l: function claim(nodes) {
      t = claim_text(nodes,
      /*label*/
      ctx[0]);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*label*/
      1) set_data_dev(t,
      /*label*/
      ctx[0]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block.name,
    type: "fallback",
    source: "(27:8) {label}",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let label_1;
  let current;
  const default_slot_template =
  /*$$slots*/
  ctx[7].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[6], null);
  const default_slot_or_fallback = default_slot || fallback_block(ctx);
  let label_1_levels = [{
    "aria-hidden": "true"
  },
  /*$$props*/
  ctx[2], {
    class:
    /*c*/
    ctx[1]
  }];
  let label_1_data = {};

  for (let i = 0; i < label_1_levels.length; i += 1) {
    label_1_data = assign(label_1_data, label_1_levels[i]);
  }

  const block = {
    c: function create() {
      label_1 = element("label");
      if (default_slot_or_fallback) default_slot_or_fallback.c();
      this.h();
    },
    l: function claim(nodes) {
      label_1 = claim_element(nodes, "LABEL", {
        "aria-hidden": true,
        class: true
      });
      var label_1_nodes = children(label_1);
      if (default_slot_or_fallback) default_slot_or_fallback.l(label_1_nodes);
      label_1_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      set_attributes(label_1, label_1_data);
      add_location(label_1, file, 21, 0, 520);
    },
    m: function mount(target, anchor) {
      insert_dev(target, label_1, anchor);

      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(label_1, null);
      }

      current = true;
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
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && dirty &
        /*label*/
        1) {
          default_slot_or_fallback.p(ctx, dirty);
        }
      }

      set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [{
        "aria-hidden": "true"
      }, dirty &
      /*$$props*/
      4 &&
      /*$$props*/
      ctx[2], (!current || dirty &
      /*c*/
      2) && {
        class:
        /*c*/
        ctx[1]
      }]));
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(label_1);
      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
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

const classesDefault = "pl-2 cursor-pointer 'text-gray-700 dark:text-gray-300'";

function instance($$self, $$props, $$invalidate) {
  let {
    classes = classesDefault
  } = $$props;
  let {
    label = ""
  } = $$props;
  let {
    disabled = false
  } = $$props;
  let {
    disabledClasses = "text-gray-500 dark:text-gray-600"
  } = $$props;
  const cb = new ClassBuilder(classes, classesDefault);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Label", $$slots, ['default']);

  $$self.$set = $$new_props => {
    $$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("classes" in $$new_props) $$invalidate(3, classes = $$new_props.classes);
    if ("label" in $$new_props) $$invalidate(0, label = $$new_props.label);
    if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    if ("disabledClasses" in $$new_props) $$invalidate(5, disabledClasses = $$new_props.disabledClasses);
    if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    ClassBuilder,
    classesDefault,
    classes,
    label,
    disabled,
    disabledClasses,
    cb,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
    if ("classes" in $$props) $$invalidate(3, classes = $$new_props.classes);
    if ("label" in $$props) $$invalidate(0, label = $$new_props.label);
    if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    if ("disabledClasses" in $$props) $$invalidate(5, disabledClasses = $$new_props.disabledClasses);
    if ("c" in $$props) $$invalidate(1, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
     $$invalidate(1, c = cb.flush().add(classes, true, classesDefault).add(disabledClasses, disabled).add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [label, c, $$props, classes, disabled, disabledClasses, $$scope, $$slots];
}

class Label extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {
      classes: 3,
      label: 0,
      disabled: 4,
      disabledClasses: 5
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Label",
      options,
      id: create_fragment.name
    });
  }

  get classes() {
    throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get label() {
    throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set label(value) {
    throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get disabled() {
    throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set disabled(value) {
    throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get disabledClasses() {
    throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set disabledClasses(value) {
    throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

/* src/components/Checkbox/Checkbox.svelte generated by Svelte v3.24.0 */
const file$1 = "src/components/Checkbox/Checkbox.svelte";

const get_label_slot_changes = dirty => ({});

const get_label_slot_context = ctx => ({}); // (73:8) {:else}


function create_else_block(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: {
      class:
      /*disabled*/
      ctx[4] ? "text-gray-500 dark:text-gray-600" : "text-gray-600 dark:text-gray-300",
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(icon.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_changes = {};
      if (dirty &
      /*disabled*/
      16) icon_changes.class =
      /*disabled*/
      ctx[4] ? "text-gray-500 dark:text-gray-600" : "text-gray-600 dark:text-gray-300";

      if (dirty &
      /*$$scope*/
      32768) {
        icon_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon.$set(icon_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block.name,
    type: "else",
    source: "(73:8) {:else}",
    ctx
  });
  return block;
} // (68:8) {#if checked}


function create_if_block(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: {
      class:
      /*disabled*/
      ctx[4] ? "text-gray-500 dark:text-gray-600" : `text-${
      /*color*/
      ctx[3]}-500 dark:text-${
      /*color*/
      ctx[3]}-100`,
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
      create_component(icon.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const icon_changes = {};
      if (dirty &
      /*disabled, color*/
      24) icon_changes.class =
      /*disabled*/
      ctx[4] ? "text-gray-500 dark:text-gray-600" : `text-${
      /*color*/
      ctx[3]}-500 dark:text-${
      /*color*/
      ctx[3]}-100`;

      if (dirty &
      /*$$scope*/
      32768) {
        icon_changes.$$scope = {
          dirty,
          ctx
        };
      }

      icon.$set(icon_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(icon, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block.name,
    type: "if",
    source: "(68:8) {#if checked}",
    ctx
  });
  return block;
} // (74:10) <Icon             class={disabled ? 'text-gray-500 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}>


function create_default_slot_2(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("check_box_outline_blank");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "check_box_outline_blank");
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_2.name,
    type: "slot",
    source: "(74:10) <Icon             class={disabled ? 'text-gray-500 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}>",
    ctx
  });
  return block;
} // (69:10) <Icon             class={disabled ? 'text-gray-500 dark:text-gray-600' : `text-${color}-500 dark:text-${color}-100`}>


function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("check_box");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "check_box");
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_1.name,
    type: "slot",
    source: "(69:10) <Icon             class={disabled ? 'text-gray-500 dark:text-gray-600' : `text-${color}-500 dark:text-${color}-100`}>",
    ctx
  });
  return block;
} // (67:6) <Ripple color={rippleColor}>


function create_default_slot(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*checked*/
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
    id: create_default_slot.name,
    type: "slot",
    source: "(67:6) <Ripple color={rippleColor}>",
    ctx
  });
  return block;
} // (81:23)        


function fallback_block$1(ctx) {
  let label_1;
  let current;
  label_1 = new Label({
    props: {
      disabled:
      /*disabled*/
      ctx[4],
      label:
      /*label*/
      ctx[2],
      class:
      /*labelClasses*/
      ctx[5]
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(label_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(label_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(label_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      const label_1_changes = {};
      if (dirty &
      /*disabled*/
      16) label_1_changes.disabled =
      /*disabled*/
      ctx[4];
      if (dirty &
      /*label*/
      4) label_1_changes.label =
      /*label*/
      ctx[2];
      if (dirty &
      /*labelClasses*/
      32) label_1_changes.class =
      /*labelClasses*/
      ctx[5];
      label_1.$set(label_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(label_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(label_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(label_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: fallback_block$1.name,
    type: "fallback",
    source: "(81:23)        ",
    ctx
  });
  return block;
}

function create_fragment$1(ctx) {
  let div2;
  let div1;
  let input;
  let t0;
  let div0;
  let ripple;
  let t1;
  let div2_class_value;
  let current;
  let mounted;
  let dispose;
  ripple = new Ripple({
    props: {
      color:
      /*rippleColor*/
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
  const label_slot_template =
  /*$$slots*/
  ctx[12].label;
  const label_slot = create_slot(label_slot_template, ctx,
  /*$$scope*/
  ctx[15], get_label_slot_context);
  const label_slot_or_fallback = label_slot || fallback_block$1(ctx);
  const block = {
    c: function create() {
      div2 = element("div");
      div1 = element("div");
      input = element("input");
      t0 = space();
      div0 = element("div");
      create_component(ripple.$$.fragment);
      t1 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      this.h();
    },
    l: function claim(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      input = claim_element(div1_nodes, "INPUT", {
        class: true,
        type: true,
        value: true
      });
      t0 = claim_space(div1_nodes);
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      claim_component(ripple.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach_dev);
      t1 = claim_space(div1_nodes);
      if (label_slot_or_fallback) label_slot_or_fallback.l(div1_nodes);
      div1_nodes.forEach(detach_dev);
      div2_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(input, "class", "hidden");
      attr_dev(input, "type", "checkbox");
      input.__value =
      /*value*/
      ctx[1];
      input.value = input.__value;
      add_location(input, file$1, 64, 4, 1715);
      attr_dev(div0, "class", "relative w-auto h-auto z-0");
      add_location(div0, file$1, 65, 4, 1791);
      attr_dev(div1, "class",
      /*c*/
      ctx[7]);
      add_location(div1, file$1, 63, 2, 1678);
      attr_dev(div2, "class", div2_class_value =
      /*$$props*/
      ctx[9].class);
      add_location(div2, file$1, 62, 0, 1648);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div1);
      append_dev(div1, input);
      input.checked =
      /*checked*/
      ctx[0];
      append_dev(div1, t0);
      append_dev(div1, div0);
      mount_component(ripple, div0, null);
      append_dev(div1, t1);

      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(div1, null);
      }

      current = true;

      if (!mounted) {
        dispose = [listen_dev(input, "change",
        /*input_change_handler*/
        ctx[14]), listen_dev(input, "change",
        /*change_handler*/
        ctx[13], false, false, false), listen_dev(div1, "click",
        /*check*/
        ctx[8], false, false, false)];
        mounted = true;
      }
    },
    p: function update(ctx, [dirty]) {
      if (!current || dirty &
      /*value*/
      2) {
        prop_dev(input, "__value",
        /*value*/
        ctx[1]);
        input.value = input.__value;
      }

      if (dirty &
      /*checked*/
      1) {
        input.checked =
        /*checked*/
        ctx[0];
      }

      const ripple_changes = {};
      if (dirty &
      /*rippleColor*/
      64) ripple_changes.color =
      /*rippleColor*/
      ctx[6];

      if (dirty &
      /*$$scope, disabled, color, checked*/
      32793) {
        ripple_changes.$$scope = {
          dirty,
          ctx
        };
      }

      ripple.$set(ripple_changes);

      if (label_slot) {
        if (label_slot.p && dirty &
        /*$$scope*/
        32768) {
          update_slot(label_slot, label_slot_template, ctx,
          /*$$scope*/
          ctx[15], dirty, get_label_slot_changes, get_label_slot_context);
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && dirty &
        /*disabled, label, labelClasses*/
        52) {
          label_slot_or_fallback.p(ctx, dirty);
        }
      }

      if (!current || dirty &
      /*c*/
      128) {
        attr_dev(div1, "class",
        /*c*/
        ctx[7]);
      }

      if (!current || dirty &
      /*$$props*/
      512 && div2_class_value !== (div2_class_value =
      /*$$props*/
      ctx[9].class)) {
        attr_dev(div2, "class", div2_class_value);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(ripple.$$.fragment, local);
      transition_in(label_slot_or_fallback, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(ripple.$$.fragment, local);
      transition_out(label_slot_or_fallback, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div2);
      destroy_component(ripple);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      mounted = false;
      run_all(dispose);
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

const classesDefault$1 = "inline-flex items-center mb-2 cursor-pointer z-10";

function instance$1($$self, $$props, $$invalidate) {
  let {
    value = ""
  } = $$props;
  let {
    label = ""
  } = $$props;
  let {
    color = "primary"
  } = $$props;
  let {
    checked = false
  } = $$props;
  let {
    disabled = false
  } = $$props;
  let {
    classes = classesDefault$1
  } = $$props;
  let {
    labelClasses = i => i
  } = $$props;
  let {
    group = []
  } = $$props; // for bind:group
  //keep track of group array state;

  let groupstate = group.includes(value);
  const dispatch = createEventDispatcher();

  function check() {
    if (disabled) return;
    $$invalidate(0, checked = !checked);
    dispatch("change", checked);
  }

  const cb = new ClassBuilder(classes, classesDefault$1);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Checkbox", $$slots, ['label']);

  function change_handler(event) {
    bubble($$self, event);
  }

  function input_change_handler() {
    checked = this.checked;
    $$invalidate(0, checked);
  }

  $$self.$set = $$new_props => {
    $$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
    if ("label" in $$new_props) $$invalidate(2, label = $$new_props.label);
    if ("color" in $$new_props) $$invalidate(3, color = $$new_props.color);
    if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    if ("classes" in $$new_props) $$invalidate(11, classes = $$new_props.classes);
    if ("labelClasses" in $$new_props) $$invalidate(5, labelClasses = $$new_props.labelClasses);
    if ("group" in $$new_props) $$invalidate(10, group = $$new_props.group);
    if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    Label,
    createEventDispatcher,
    ClassBuilder,
    classesDefault: classesDefault$1,
    Icon,
    Ripple,
    value,
    label,
    color,
    checked,
    disabled,
    classes,
    labelClasses,
    group,
    groupstate,
    dispatch,
    check,
    cb,
    rippleColor,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
    if ("label" in $$props) $$invalidate(2, label = $$new_props.label);
    if ("color" in $$props) $$invalidate(3, color = $$new_props.color);
    if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    if ("classes" in $$props) $$invalidate(11, classes = $$new_props.classes);
    if ("labelClasses" in $$props) $$invalidate(5, labelClasses = $$new_props.labelClasses);
    if ("group" in $$props) $$invalidate(10, group = $$new_props.group);
    if ("groupstate" in $$props) $$invalidate(16, groupstate = $$new_props.groupstate);
    if ("rippleColor" in $$props) $$invalidate(6, rippleColor = $$new_props.rippleColor);
    if ("c" in $$props) $$invalidate(7, c = $$new_props.c);
  };

  let rippleColor;
  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*value, disabled, group, groupstate, checked*/
    66579) {
       if (value && !disabled) {
        const groupHasValue = group.includes(value); // check if group array has changed, or something else

        if (groupHasValue === groupstate) {
          // add to group array if checked
          if (checked && !groupHasValue) {
            $$invalidate(10, group = group.concat([value]));
            $$invalidate(16, groupstate = true);
          } else if (!checked && groupHasValue) {
            $$invalidate(10, group = [...group.filter(v => v !== value)]); // remove from group array if unchecked

            $$invalidate(16, groupstate = false);
          }
        } else {
          // group array has changed. Click box
          $$invalidate(16, groupstate = groupHasValue);
          check();
        }
      }
    }

    if ($$self.$$.dirty &
    /*checked, disabled, color*/
    25) {
       $$invalidate(6, rippleColor = checked && !disabled ? color : "gray");
    }

     $$invalidate(7, c = cb.flush().add(classes, true, classesDefault$1).add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [checked, value, label, color, disabled, labelClasses, rippleColor, c, check, $$props, group, classes, $$slots, change_handler, input_change_handler, $$scope];
}

class Checkbox extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      value: 1,
      label: 2,
      color: 3,
      checked: 0,
      disabled: 4,
      classes: 11,
      labelClasses: 5,
      group: 10
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Checkbox",
      options,
      id: create_fragment$1.name
    });
  }

  get value() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set value(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get label() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set label(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get color() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get checked() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set checked(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get disabled() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set disabled(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get labelClasses() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set labelClasses(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get group() {
    throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set group(value) {
    throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

export { Checkbox as C, Label as L };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZjM5NjUxOTEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NoZWNrYm94L0xhYmVsLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NoZWNrYm94L0NoZWNrYm94LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyBDbGFzc0J1aWxkZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJwbC0yIGN1cnNvci1wb2ludGVyICd0ZXh0LWdyYXktNzAwIGRhcms6dGV4dC1ncmF5LTMwMCdcIjtcblxuICBleHBvcnQgbGV0IGNsYXNzZXMgPSBjbGFzc2VzRGVmYXVsdDtcblxuXG4gIGV4cG9ydCBsZXQgbGFiZWwgPSBcIlwiO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWRDbGFzc2VzID0gXCJ0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC1ncmF5LTYwMFwiO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKGRpc2FibGVkQ2xhc3NlcywgZGlzYWJsZWQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5nZXQoKTtcbjwvc2NyaXB0PlxuXG48bGFiZWxcbiAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgey4uLiQkcHJvcHN9XG4gIGNsYXNzPXtjfVxuPlxuICA8c2xvdD57bGFiZWx9PC9zbG90PlxuPC9sYWJlbD5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBMYWJlbCBmcm9tIFwiLi9MYWJlbC5zdmVsdGVcIjtcbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcInN2ZWx0ZVwiO1xuICBpbXBvcnQgeyBDbGFzc0J1aWxkZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgbWItMiBjdXJzb3ItcG9pbnRlciB6LTEwXCI7XG5cbiAgaW1wb3J0IEljb24gZnJvbSBcIi4uL0ljb25cIjtcbiAgaW1wb3J0IFJpcHBsZSBmcm9tIFwiLi4vUmlwcGxlXCI7XG5cbiAgZXhwb3J0IGxldCB2YWx1ZSA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgbGFiZWwgPSBcIlwiO1xuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG4gIGV4cG9ydCBsZXQgY2hlY2tlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IGxhYmVsQ2xhc3NlcyA9IGkgPT4gaTtcbiAgZXhwb3J0IGxldCBncm91cCA9IFtdO1xuXG4gIC8vIGZvciBiaW5kOmdyb3VwXG4gIC8va2VlcCB0cmFjayBvZiBncm91cCBhcnJheSBzdGF0ZTtcbiAgbGV0IGdyb3Vwc3RhdGUgPSBncm91cC5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgJDogaWYgKHZhbHVlICYmICFkaXNhYmxlZCkge1xuICAgIGNvbnN0IGdyb3VwSGFzVmFsdWUgPSBncm91cC5pbmNsdWRlcyh2YWx1ZSk7XG5cbiAgICAvLyBjaGVjayBpZiBncm91cCBhcnJheSBoYXMgY2hhbmdlZCwgb3Igc29tZXRoaW5nIGVsc2VcbiAgICBpZiAoZ3JvdXBIYXNWYWx1ZSA9PT0gZ3JvdXBzdGF0ZSkge1xuICAgICAgLy8gYWRkIHRvIGdyb3VwIGFycmF5IGlmIGNoZWNrZWRcbiAgICAgIGlmIChjaGVja2VkICYmICFncm91cEhhc1ZhbHVlKSB7XG4gICAgICAgIGdyb3VwID0gZ3JvdXAuY29uY2F0KFt2YWx1ZV0pO1xuICAgICAgICBncm91cHN0YXRlID0gdHJ1ZTtcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gZ3JvdXAgYXJyYXkgaWYgdW5jaGVja2VkXG4gICAgICB9IGVsc2UgaWYgKCFjaGVja2VkICYmIGdyb3VwSGFzVmFsdWUpIHtcbiAgICAgICAgZ3JvdXAgPSBbLi4uZ3JvdXAuZmlsdGVyKHYgPT4gdiAhPT0gdmFsdWUpXTtcbiAgICAgICAgZ3JvdXBzdGF0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBncm91cCBhcnJheSBoYXMgY2hhbmdlZC4gQ2xpY2sgYm94XG4gICAgICBncm91cHN0YXRlID0gZ3JvdXBIYXNWYWx1ZTtcbiAgICAgIGNoZWNrKCk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgaWYgKGRpc2FibGVkKSByZXR1cm47XG5cbiAgICBjaGVja2VkID0gIWNoZWNrZWQ7XG4gICAgZGlzcGF0Y2goXCJjaGFuZ2VcIiwgY2hlY2tlZCk7XG4gIH1cblxuICAkOiByaXBwbGVDb2xvciA9IGNoZWNrZWQgJiYgIWRpc2FibGVkID8gY29sb3IgOiBcImdyYXlcIjtcblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuICAkOiBjID0gY2JcbiAgICAuZmx1c2goKVxuICAgIC5hZGQoY2xhc3NlcywgdHJ1ZSwgY2xhc3Nlc0RlZmF1bHQpXG4gICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgIC5nZXQoKTtcbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPXskJHByb3BzLmNsYXNzfT5cbiAgPGRpdiBjbGFzcz17Y30gb246Y2xpY2s9e2NoZWNrfT5cbiAgICA8aW5wdXQgYmluZDpjaGVja2VkIGNsYXNzPVwiaGlkZGVuXCIgdHlwZT1cImNoZWNrYm94XCIgb246Y2hhbmdlIHt2YWx1ZX0gLz5cbiAgICA8ZGl2IGNsYXNzPVwicmVsYXRpdmUgdy1hdXRvIGgtYXV0byB6LTBcIj5cbiAgICAgIDxSaXBwbGUgY29sb3I9e3JpcHBsZUNvbG9yfT5cbiAgICAgICAgeyNpZiBjaGVja2VkfVxuICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICBjbGFzcz17ZGlzYWJsZWQgPyAndGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtZ3JheS02MDAnIDogYHRleHQtJHtjb2xvcn0tNTAwIGRhcms6dGV4dC0ke2NvbG9yfS0xMDBgfT5cbiAgICAgICAgICAgIGNoZWNrX2JveFxuICAgICAgICAgIDwvSWNvbj5cbiAgICAgICAgezplbHNlfVxuICAgICAgICAgIDxJY29uXG4gICAgICAgICAgICBjbGFzcz17ZGlzYWJsZWQgPyAndGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtZ3JheS02MDAnIDogJ3RleHQtZ3JheS02MDAgZGFyazp0ZXh0LWdyYXktMzAwJ30+XG4gICAgICAgICAgICBjaGVja19ib3hfb3V0bGluZV9ibGFua1xuICAgICAgICAgIDwvSWNvbj5cbiAgICAgICAgey9pZn1cbiAgICAgIDwvUmlwcGxlPlxuICAgIDwvZGl2PlxuICAgIDxzbG90IG5hbWU9XCJsYWJlbFwiPlxuICAgICAgPExhYmVsIHtkaXNhYmxlZH0ge2xhYmVsfSBjbGFzcz17bGFiZWxDbGFzc2VzfSAvPlxuICAgIDwvc2xvdD5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdLCJuYW1lcyI6WyJjdHgiLCJjbGFzc2VzRGVmYXVsdCIsImNsYXNzZXMiLCJsYWJlbCIsImRpc2FibGVkIiwiZGlzYWJsZWRDbGFzc2VzIiwiY2IiLCJDbGFzc0J1aWxkZXIiLCIkIiwiYyIsImZsdXNoIiwiYWRkIiwiJCRwcm9wcyIsImNsYXNzIiwiZ2V0IiwidmFsdWUiLCJjb2xvciIsImNoZWNrZWQiLCJsYWJlbENsYXNzZXMiLCJpIiwiZ3JvdXAiLCJncm91cHN0YXRlIiwiaW5jbHVkZXMiLCJkaXNwYXRjaCIsImNyZWF0ZUV2ZW50RGlzcGF0Y2hlciIsImNoZWNrIiwiZ3JvdXBIYXNWYWx1ZSIsImNvbmNhdCIsImZpbHRlciIsInYiLCJyaXBwbGVDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBMEJTQSxNQUFBQSxHQUFLLEVBQUE7Ozs7O0FBQUxBLE1BQUFBLEdBQUssRUFBQTs7Ozs7Ozs7OztBQUFMQSxNQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUhSQSxFQUFBQSxHQUFPLEVBQUE7OztBQUNKQSxJQUFBQSxHQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQURKQSxNQUFBQSxHQUFPLEVBQUE7Ozs7O0FBQ0pBLFFBQUFBLEdBQUMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BckJGQyxjQUFjLEdBQUc7Ozs7QUFFWkMsSUFBQUEsT0FBTyxHQUFHRDs7O0FBR1ZFLElBQUFBLEtBQUssR0FBRzs7O0FBQ1JDLElBQUFBLFFBQVEsR0FBRzs7O0FBQ1hDLElBQUFBLGVBQWUsR0FBRzs7UUFFdkJDLEVBQUUsT0FBT0MsYUFBYUwsU0FBU0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDckNPLHFCQUFHQyxDQUFDLEdBQUdILEVBQUUsQ0FDTkksS0FESSxHQUVKQyxHQUZJLENBRUFULE9BRkEsRUFFUyxJQUZULEVBRWVELGNBRmYsRUFHSlUsR0FISSxDQUdBTixlQUhBLEVBR2lCRCxRQUhqQixFQUlKTyxHQUpJLENBSUFDLE9BQU8sQ0FBQ0MsS0FKUixFQUtKQyxHQUxJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNkRVZCxNQUFBQSxHQUFRLEVBQUEsQ0FBUixHQUFXLGtDQUFYLEdBQWdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBaERBLE1BQUFBLEdBQVEsRUFBQSxDQUFSLEdBQVcsa0NBQVgsR0FB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
