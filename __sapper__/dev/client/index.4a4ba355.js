import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, e as element, j as append_dev, x as create_slot, v as validate_slots, F as assign, H as exclude_internal_props, V as r, c as claim_element, a as children, b as detach_dev, g as attr_dev, f as add_location, h as insert_dev, W as action_destroyer, B as update_slot, r as transition_in, u as transition_out } from './client.7a6793f2.js';

/* src/components/Ripple/Ripple.svelte generated by Svelte v3.24.0 */
const file = "src/components/Ripple/Ripple.svelte";

function add_css() {
  var style = element("style");
  style.id = "svelte-1o8z87d-style";
  style.textContent = ".ripple.svelte-1o8z87d{position:absolute !important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmlwcGxlLnN2ZWx0ZSIsInNvdXJjZXMiOlsiUmlwcGxlLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IGNvbG9yID0gXCJwcmltYXJ5XCI7XG4gIGV4cG9ydCBsZXQgbm9Ib3ZlciA9IGZhbHNlO1xuICBpbXBvcnQgY3JlYXRlUmlwcGxlIGZyb20gXCIuLi9SaXBwbGUvcmlwcGxlLmpzXCI7XG5cbiAgJDogcmlwcGxlID0gY3JlYXRlUmlwcGxlKGNvbG9yLCB0cnVlKTtcbiAgJDogaG92ZXJDbGFzcyA9IGBob3ZlcjpiZy0ke2NvbG9yfS10cmFuc0xpZ2h0YDtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5yaXBwbGUge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xuICB9XG48L3N0eWxlPlxuXG48c3BhblxuICB1c2U6cmlwcGxlXG4gIGNsYXNzPVwiei00MCB7JCRwcm9wcy5jbGFzc30gcC0yIHJvdW5kZWQtZnVsbCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0b3AtMCBsZWZ0LTAge25vSG92ZXIgPyBcIlwiIDogaG92ZXJDbGFzc31cIj5cbiAgPHNsb3QgLz5cbjwvc3Bhbj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVRSxPQUFPLGVBQUMsQ0FBQyxBQUNQLFFBQVEsQ0FBRSxRQUFRLENBQUMsVUFBVSxBQUMvQixDQUFDIn0= */";
  append_dev(document.head, style);
}

function create_fragment(ctx) {
  let span;
  let span_class_value;
  let ripple_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template =
  /*$$slots*/
  ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[5], null);
  const block = {
    c: function create() {
      span = element("span");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      span = claim_element(nodes, "SPAN", {
        class: true
      });
      var span_nodes = children(span);
      if (default_slot) default_slot.l(span_nodes);
      span_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(span, "class", span_class_value = "z-40 " +
      /*$$props*/
      ctx[3].class + " p-2 rounded-full flex items-center justify-center top-0 left-0 " + (
      /*noHover*/
      ctx[0] ? "" :
      /*hoverClass*/
      ctx[2]) + " svelte-1o8z87d");
      add_location(span, file, 15, 0, 293);
    },
    m: function mount(target, anchor) {
      insert_dev(target, span, anchor);

      if (default_slot) {
        default_slot.m(span, null);
      }

      current = true;

      if (!mounted) {
        dispose = action_destroyer(ripple_action =
        /*ripple*/
        ctx[1].call(null, span));
        mounted = true;
      }
    },
    p: function update(ctx, [dirty]) {
      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        32) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[5], dirty, null, null);
        }
      }

      if (!current || dirty &
      /*$$props, noHover, hoverClass*/
      13 && span_class_value !== (span_class_value = "z-40 " +
      /*$$props*/
      ctx[3].class + " p-2 rounded-full flex items-center justify-center top-0 left-0 " + (
      /*noHover*/
      ctx[0] ? "" :
      /*hoverClass*/
      ctx[2]) + " svelte-1o8z87d")) {
        attr_dev(span, "class", span_class_value);
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
      if (detaching) detach_dev(span);
      if (default_slot) default_slot.d(detaching);
      mounted = false;
      dispose();
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
    color = "primary"
  } = $$props;
  let {
    noHover = false
  } = $$props;
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Ripple", $$slots, ['default']);

  $$self.$set = $$new_props => {
    $$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("color" in $$new_props) $$invalidate(4, color = $$new_props.color);
    if ("noHover" in $$new_props) $$invalidate(0, noHover = $$new_props.noHover);
    if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
  };

  $$self.$capture_state = () => ({
    color,
    noHover,
    createRipple: r,
    ripple,
    hoverClass
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
    if ("color" in $$props) $$invalidate(4, color = $$new_props.color);
    if ("noHover" in $$props) $$invalidate(0, noHover = $$new_props.noHover);
    if ("ripple" in $$props) $$invalidate(1, ripple = $$new_props.ripple);
    if ("hoverClass" in $$props) $$invalidate(2, hoverClass = $$new_props.hoverClass);
  };

  let ripple;
  let hoverClass;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*color*/
    16) {
       $$invalidate(1, ripple = r(color, true));
    }

    if ($$self.$$.dirty &
    /*color*/
    16) {
       $$invalidate(2, hoverClass = `hover:bg-${color}-transLight`);
    }
  };

  $$props = exclude_internal_props($$props);
  return [noHover, ripple, hoverClass, $$props, color, $$scope, $$slots];
}

class Ripple extends SvelteComponentDev {
  constructor(options) {
    super(options);
    if (!document.getElementById("svelte-1o8z87d-style")) add_css();
    init(this, options, instance, create_fragment, safe_not_equal, {
      color: 4,
      noHover: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Ripple",
      options,
      id: create_fragment.name
    });
  }

  get color() {
    throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set color(value) {
    throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get noHover() {
    throw new Error("<Ripple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set noHover(value) {
    throw new Error("<Ripple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

export { Ripple as R };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguNGE0YmEzNTUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1JpcHBsZS9SaXBwbGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcInByaW1hcnlcIjtcbiAgZXhwb3J0IGxldCBub0hvdmVyID0gZmFsc2U7XG4gIGltcG9ydCBjcmVhdGVSaXBwbGUgZnJvbSBcIi4uL1JpcHBsZS9yaXBwbGUuanNcIjtcblxuICAkOiByaXBwbGUgPSBjcmVhdGVSaXBwbGUoY29sb3IsIHRydWUpO1xuICAkOiBob3ZlckNsYXNzID0gYGhvdmVyOmJnLSR7Y29sb3J9LXRyYW5zTGlnaHRgO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgLnJpcHBsZSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlICFpbXBvcnRhbnQ7XG4gIH1cbjwvc3R5bGU+XG5cbjxzcGFuXG4gIHVzZTpyaXBwbGVcbiAgY2xhc3M9XCJ6LTQwIHskJHByb3BzLmNsYXNzfSBwLTIgcm91bmRlZC1mdWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRvcC0wIGxlZnQtMCB7bm9Ib3ZlciA/IFwiXCIgOiBob3ZlckNsYXNzfVwiPlxuICA8c2xvdCAvPlxuPC9zcGFuPlxuIl0sIm5hbWVzIjpbImN0eCIsImNsYXNzIiwiY29sb3IiLCJub0hvdmVyIiwiJCIsInJpcHBsZSIsImNyZWF0ZVJpcHBsZSIsImhvdmVyQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQmVBLE1BQUFBLEdBQU8sRUFBQSxDQUFQLENBQVFDOztBQUF1RUQsTUFBQUEsR0FBTyxFQUFBLENBQVAsR0FBVSxFQUFWOztBQUFlQSxNQUFBQSxHQUFVLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBeEdBLE1BQUFBLEdBQU8sRUFBQSxDQUFQLENBQVFDOztBQUF1RUQsTUFBQUEsR0FBTyxFQUFBLENBQVAsR0FBVSxFQUFWOztBQUFlQSxNQUFBQSxHQUFVLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaEIxR0UsSUFBQUEsS0FBSyxHQUFHOzs7QUFDUkMsSUFBQUEsT0FBTyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHckJDLHVCQUFHQyxNQUFNLEdBQUdDLENBQVksQ0FBQ0osS0FBRCxFQUFRLElBQVI7Ozs7OztBQUN4QkUsdUJBQUdHLFVBQVUsZUFBZUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
