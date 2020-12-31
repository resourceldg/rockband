import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, g as attr_dev, f as add_location, h as insert_dev, j as append_dev, q as mount_component, n as noop, r as transition_in, u as transition_out, w as destroy_component } from './client.b0aae0e4.js';
import { C as Code } from './Code.dad4bb45.js';
import { T as TextField } from './index.b8fbded3.js';

/* src/routes/color.svelte generated by Svelte v3.24.0 */
const file = "src/routes/color.svelte";

function create_fragment(ctx) {
  let h40;
  let t0;
  let t1;
  let p;
  let t2;
  let a0;
  let t3;
  let t4;
  let a1;
  let t5;
  let t6;
  let a2;
  let t7;
  let t8;
  let a3;
  let t9;
  let t10;
  let t11;
  let h50;
  let t12;
  let t13;
  let span0;
  let t14;
  let t15_value = "{color}-{variant}" + "";
  let t15;
  let t16;
  let code0;
  let t17;
  let div0;
  let t18;
  let t19;
  let h51;
  let t20;
  let t21;
  let span1;
  let t22;
  let t23_value = "{color}-{variant}" + "";
  let t23;
  let t24;
  let code1;
  let t25;
  let h41;
  let t26;
  let t27;
  let h52;
  let t28;
  let t29;
  let span2;
  let t30;
  let t31_value = "{n}" + "";
  let t31;
  let t32;
  let span3;
  let t33;
  let t34_value = "{solid|dashed|dotted|none}" + "";
  let t34;
  let t35;
  let code2;
  let t36;
  let div1;
  let t37;
  let current;
  code0 = new Code({
    props: {
      code: "<div class=\"bg-deep-purple-500 text-white p-4\">This div is deep purple.</div>"
    },
    $$inline: true
  });
  code1 = new Code({
    props: {
      code: "<h4 class=\"text-error-500\">This header is error</h4>"
    },
    $$inline: true
  });
  code2 = new Code({
    props: {
      code: "<div class=\"border-2 border-secondary-600 p-4\">This div has secondary border</div>"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      h40 = element("h4");
      t0 = text("Color helper classes");
      t1 = space();
      p = element("p");
      t2 = text("Right now Smelte adds very little to what Tailwind\n  ");
      a0 = element("a");
      t3 = text("has");
      t4 = space();
      a1 = element("a");
      t5 = text("to offer");
      t6 = text("\n  dealing with color except for porting the Material design color\n  ");
      a2 = element("a");
      t7 = text("palette");
      t8 = text("\n  and adding a few extra utilities like caret color on inputs or colored ripple\n  animation effect. Colors themselves are configured in\n  ");
      a3 = element("a");
      t9 = text("tailwind.config.js");
      t10 = text("\n  .");
      t11 = space();
      h50 = element("h5");
      t12 = text("Background");
      t13 = space();
      span0 = element("span");
      t14 = text(".bg-");
      t15 = text(t15_value);
      t16 = text("\ngives element appropriate background color:\n");
      create_component(code0.$$.fragment);
      t17 = space();
      div0 = element("div");
      t18 = text("This div is deep purple.");
      t19 = space();
      h51 = element("h5");
      t20 = text("Text");
      t21 = space();
      span1 = element("span");
      t22 = text(".text-");
      t23 = text(t23_value);
      t24 = text("\nchanges text color accordingly:\n");
      create_component(code1.$$.fragment);
      t25 = space();
      h41 = element("h4");
      t26 = text("This header is error color");
      t27 = space();
      h52 = element("h5");
      t28 = text("Border");
      t29 = text("\nSame principle applies to border, but there are also border width\n");
      span2 = element("span");
      t30 = text("border-");
      t31 = text(t31_value);
      t32 = text("\nand type\n");
      span3 = element("span");
      t33 = text("border-");
      t34 = text(t34_value);
      t35 = text("\nhelpers.\n");
      create_component(code2.$$.fragment);
      t36 = space();
      div1 = element("div");
      t37 = text("This div has secondary color border");
      this.h();
    },
    l: function claim(nodes) {
      h40 = claim_element(nodes, "H4", {
        class: true
      });
      var h40_nodes = children(h40);
      t0 = claim_text(h40_nodes, "Color helper classes");
      h40_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      p = claim_element(nodes, "P", {});
      var p_nodes = children(p);
      t2 = claim_text(p_nodes, "Right now Smelte adds very little to what Tailwind\n  ");
      a0 = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a0_nodes = children(a0);
      t3 = claim_text(a0_nodes, "has");
      a0_nodes.forEach(detach_dev);
      t4 = claim_space(p_nodes);
      a1 = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a1_nodes = children(a1);
      t5 = claim_text(a1_nodes, "to offer");
      a1_nodes.forEach(detach_dev);
      t6 = claim_text(p_nodes, "\n  dealing with color except for porting the Material design color\n  ");
      a2 = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a2_nodes = children(a2);
      t7 = claim_text(a2_nodes, "palette");
      a2_nodes.forEach(detach_dev);
      t8 = claim_text(p_nodes, "\n  and adding a few extra utilities like caret color on inputs or colored ripple\n  animation effect. Colors themselves are configured in\n  ");
      a3 = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a3_nodes = children(a3);
      t9 = claim_text(a3_nodes, "tailwind.config.js");
      a3_nodes.forEach(detach_dev);
      t10 = claim_text(p_nodes, "\n  .");
      p_nodes.forEach(detach_dev);
      t11 = claim_space(nodes);
      h50 = claim_element(nodes, "H5", {
        class: true
      });
      var h50_nodes = children(h50);
      t12 = claim_text(h50_nodes, "Background");
      h50_nodes.forEach(detach_dev);
      t13 = claim_space(nodes);
      span0 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      t14 = claim_text(span0_nodes, ".bg-");
      t15 = claim_text(span0_nodes, t15_value);
      span0_nodes.forEach(detach_dev);
      t16 = claim_text(nodes, "\ngives element appropriate background color:\n");
      claim_component(code0.$$.fragment, nodes);
      t17 = claim_space(nodes);
      div0 = claim_element(nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      t18 = claim_text(div0_nodes, "This div is deep purple.");
      div0_nodes.forEach(detach_dev);
      t19 = claim_space(nodes);
      h51 = claim_element(nodes, "H5", {
        class: true
      });
      var h51_nodes = children(h51);
      t20 = claim_text(h51_nodes, "Text");
      h51_nodes.forEach(detach_dev);
      t21 = claim_space(nodes);
      span1 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t22 = claim_text(span1_nodes, ".text-");
      t23 = claim_text(span1_nodes, t23_value);
      span1_nodes.forEach(detach_dev);
      t24 = claim_text(nodes, "\nchanges text color accordingly:\n");
      claim_component(code1.$$.fragment, nodes);
      t25 = claim_space(nodes);
      h41 = claim_element(nodes, "H4", {
        class: true
      });
      var h41_nodes = children(h41);
      t26 = claim_text(h41_nodes, "This header is error color");
      h41_nodes.forEach(detach_dev);
      t27 = claim_space(nodes);
      h52 = claim_element(nodes, "H5", {
        class: true
      });
      var h52_nodes = children(h52);
      t28 = claim_text(h52_nodes, "Border");
      h52_nodes.forEach(detach_dev);
      t29 = claim_text(nodes, "\nSame principle applies to border, but there are also border width\n");
      span2 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span2_nodes = children(span2);
      t30 = claim_text(span2_nodes, "border-");
      t31 = claim_text(span2_nodes, t31_value);
      span2_nodes.forEach(detach_dev);
      t32 = claim_text(nodes, "\nand type\n");
      span3 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span3_nodes = children(span3);
      t33 = claim_text(span3_nodes, "border-");
      t34 = claim_text(span3_nodes, t34_value);
      span3_nodes.forEach(detach_dev);
      t35 = claim_text(nodes, "\nhelpers.\n");
      claim_component(code2.$$.fragment, nodes);
      t36 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t37 = claim_text(div1_nodes, "This div has secondary color border");
      div1_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h40, "class", "pb-8");
      add_location(h40, file, 5, 0, 107);
      attr_dev(a0, "class", "a");
      attr_dev(a0, "href", "https://tailwindcss.com/docs/background-color/");
      add_location(a0, file, 8, 2, 209);
      attr_dev(a1, "class", "a");
      attr_dev(a1, "href", "https://tailwindcss.com/docs/text-color/");
      add_location(a1, file, 9, 2, 286);
      attr_dev(a2, "class", "a");
      attr_dev(a2, "href", "https://material.io/design/color/#tools-for-picking-colors");
      add_location(a2, file, 11, 2, 428);
      attr_dev(a3, "class", "a");
      attr_dev(a3, "href", "https://github.com/matyunya/smelte/blob/master/tailwind.config.js");
      add_location(a3, file, 18, 2, 673);
      add_location(p, file, 6, 0, 150);
      attr_dev(h50, "class", "mt-6 mb-2");
      add_location(h50, file, 26, 0, 808);
      attr_dev(span0, "class", "code-inline");
      add_location(span0, file, 28, 0, 847);
      attr_dev(div0, "class", "bg-deep-purple-500 text-white p-4");
      add_location(div0, file, 32, 0, 1048);
      attr_dev(h51, "class", "mt-6 mb-2");
      add_location(h51, file, 34, 0, 1127);
      attr_dev(span1, "class", "code-inline");
      add_location(span1, file, 36, 0, 1160);
      attr_dev(h41, "class", "text-error-500");
      add_location(h41, file, 39, 0, 1324);
      attr_dev(h52, "class", "mt-6 mb-2");
      add_location(h52, file, 41, 0, 1384);
      attr_dev(span2, "class", "code-inline");
      add_location(span2, file, 43, 0, 1484);
      attr_dev(span3, "class", "code-inline");
      add_location(span3, file, 45, 0, 1541);
      attr_dev(div1, "class", "border-2 border-secondary-600 p-4");
      add_location(div1, file, 50, 0, 1725);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h40, anchor);
      append_dev(h40, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, p, anchor);
      append_dev(p, t2);
      append_dev(p, a0);
      append_dev(a0, t3);
      append_dev(p, t4);
      append_dev(p, a1);
      append_dev(a1, t5);
      append_dev(p, t6);
      append_dev(p, a2);
      append_dev(a2, t7);
      append_dev(p, t8);
      append_dev(p, a3);
      append_dev(a3, t9);
      append_dev(p, t10);
      insert_dev(target, t11, anchor);
      insert_dev(target, h50, anchor);
      append_dev(h50, t12);
      insert_dev(target, t13, anchor);
      insert_dev(target, span0, anchor);
      append_dev(span0, t14);
      append_dev(span0, t15);
      insert_dev(target, t16, anchor);
      mount_component(code0, target, anchor);
      insert_dev(target, t17, anchor);
      insert_dev(target, div0, anchor);
      append_dev(div0, t18);
      insert_dev(target, t19, anchor);
      insert_dev(target, h51, anchor);
      append_dev(h51, t20);
      insert_dev(target, t21, anchor);
      insert_dev(target, span1, anchor);
      append_dev(span1, t22);
      append_dev(span1, t23);
      insert_dev(target, t24, anchor);
      mount_component(code1, target, anchor);
      insert_dev(target, t25, anchor);
      insert_dev(target, h41, anchor);
      append_dev(h41, t26);
      insert_dev(target, t27, anchor);
      insert_dev(target, h52, anchor);
      append_dev(h52, t28);
      insert_dev(target, t29, anchor);
      insert_dev(target, span2, anchor);
      append_dev(span2, t30);
      append_dev(span2, t31);
      insert_dev(target, t32, anchor);
      insert_dev(target, span3, anchor);
      append_dev(span3, t33);
      append_dev(span3, t34);
      insert_dev(target, t35, anchor);
      mount_component(code2, target, anchor);
      insert_dev(target, t36, anchor);
      insert_dev(target, div1, anchor);
      append_dev(div1, t37);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(code0.$$.fragment, local);
      transition_in(code1.$$.fragment, local);
      transition_in(code2.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(code0.$$.fragment, local);
      transition_out(code1.$$.fragment, local);
      transition_out(code2.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(h40);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(p);
      if (detaching) detach_dev(t11);
      if (detaching) detach_dev(h50);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(span0);
      if (detaching) detach_dev(t16);
      destroy_component(code0, detaching);
      if (detaching) detach_dev(t17);
      if (detaching) detach_dev(div0);
      if (detaching) detach_dev(t19);
      if (detaching) detach_dev(h51);
      if (detaching) detach_dev(t21);
      if (detaching) detach_dev(span1);
      if (detaching) detach_dev(t24);
      destroy_component(code1, detaching);
      if (detaching) detach_dev(t25);
      if (detaching) detach_dev(h41);
      if (detaching) detach_dev(t27);
      if (detaching) detach_dev(h52);
      if (detaching) detach_dev(t29);
      if (detaching) detach_dev(span2);
      if (detaching) detach_dev(t32);
      if (detaching) detach_dev(span3);
      if (detaching) detach_dev(t35);
      destroy_component(code2, detaching);
      if (detaching) detach_dev(t36);
      if (detaching) detach_dev(div1);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Color> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Color", $$slots, []);

  $$self.$capture_state = () => ({
    TextField,
    Code
  });

  return [];
}

class Color extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Color",
      options,
      id: create_fragment.name
    });
  }

}

export default Color;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuZjlhMjkwNWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29sb3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBUZXh0RmllbGQgZnJvbSBcImNvbXBvbmVudHMvVGV4dEZpZWxkXCI7XG4gIGltcG9ydCBDb2RlIGZyb20gXCJkb2NzL0NvZGUuc3ZlbHRlXCI7XG48L3NjcmlwdD5cblxuPGg0IGNsYXNzPVwicGItOFwiPkNvbG9yIGhlbHBlciBjbGFzc2VzPC9oND5cbjxwPlxuICBSaWdodCBub3cgU21lbHRlIGFkZHMgdmVyeSBsaXR0bGUgdG8gd2hhdCBUYWlsd2luZFxuICA8YSBjbGFzcz1cImFcIiBocmVmPVwiaHR0cHM6Ly90YWlsd2luZGNzcy5jb20vZG9jcy9iYWNrZ3JvdW5kLWNvbG9yL1wiPmhhczwvYT5cbiAgPGEgY2xhc3M9XCJhXCIgaHJlZj1cImh0dHBzOi8vdGFpbHdpbmRjc3MuY29tL2RvY3MvdGV4dC1jb2xvci9cIj50byBvZmZlcjwvYT5cbiAgZGVhbGluZyB3aXRoIGNvbG9yIGV4Y2VwdCBmb3IgcG9ydGluZyB0aGUgTWF0ZXJpYWwgZGVzaWduIGNvbG9yXG4gIDxhXG4gICAgY2xhc3M9XCJhXCJcbiAgICBocmVmPVwiaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29sb3IvI3Rvb2xzLWZvci1waWNraW5nLWNvbG9yc1wiPlxuICAgIHBhbGV0dGVcbiAgPC9hPlxuICBhbmQgYWRkaW5nIGEgZmV3IGV4dHJhIHV0aWxpdGllcyBsaWtlIGNhcmV0IGNvbG9yIG9uIGlucHV0cyBvciBjb2xvcmVkIHJpcHBsZVxuICBhbmltYXRpb24gZWZmZWN0LiBDb2xvcnMgdGhlbXNlbHZlcyBhcmUgY29uZmlndXJlZCBpblxuICA8YVxuICAgIGNsYXNzPVwiYVwiXG4gICAgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYXR5dW55YS9zbWVsdGUvYmxvYi9tYXN0ZXIvdGFpbHdpbmQuY29uZmlnLmpzXCI+XG4gICAgdGFpbHdpbmQuY29uZmlnLmpzXG4gIDwvYT5cbiAgLlxuPC9wPlxuXG48aDUgY2xhc3M9XCJtdC02IG1iLTJcIj5CYWNrZ3JvdW5kPC9oNT5cblxuPHNwYW4gY2xhc3M9XCJjb2RlLWlubGluZVwiPi5iZy17J3tjb2xvcn0te3ZhcmlhbnR9J308L3NwYW4+XG5naXZlcyBlbGVtZW50IGFwcHJvcHJpYXRlIGJhY2tncm91bmQgY29sb3I6XG48Q29kZVxuICBjb2RlPXsnPGRpdiBjbGFzcz1cImJnLWRlZXAtcHVycGxlLTUwMCB0ZXh0LXdoaXRlIHAtNFwiPlRoaXMgZGl2IGlzIGRlZXAgcHVycGxlLjwvZGl2Pid9IC8+XG48ZGl2IGNsYXNzPVwiYmctZGVlcC1wdXJwbGUtNTAwIHRleHQtd2hpdGUgcC00XCI+VGhpcyBkaXYgaXMgZGVlcCBwdXJwbGUuPC9kaXY+XG5cbjxoNSBjbGFzcz1cIm10LTYgbWItMlwiPlRleHQ8L2g1PlxuXG48c3BhbiBjbGFzcz1cImNvZGUtaW5saW5lXCI+LnRleHQteyd7Y29sb3J9LXt2YXJpYW50fSd9PC9zcGFuPlxuY2hhbmdlcyB0ZXh0IGNvbG9yIGFjY29yZGluZ2x5OlxuPENvZGUgY29kZT17JzxoNCBjbGFzcz1cInRleHQtZXJyb3ItNTAwXCI+VGhpcyBoZWFkZXIgaXMgZXJyb3I8L2g0Pid9IC8+XG48aDQgY2xhc3M9XCJ0ZXh0LWVycm9yLTUwMFwiPlRoaXMgaGVhZGVyIGlzIGVycm9yIGNvbG9yPC9oND5cblxuPGg1IGNsYXNzPVwibXQtNiBtYi0yXCI+Qm9yZGVyPC9oNT5cblNhbWUgcHJpbmNpcGxlIGFwcGxpZXMgdG8gYm9yZGVyLCBidXQgdGhlcmUgYXJlIGFsc28gYm9yZGVyIHdpZHRoXG48c3BhbiBjbGFzcz1cImNvZGUtaW5saW5lXCI+Ym9yZGVyLXsne259J308L3NwYW4+XG5hbmQgdHlwZVxuPHNwYW4gY2xhc3M9XCJjb2RlLWlubGluZVwiPmJvcmRlci17J3tzb2xpZHxkYXNoZWR8ZG90dGVkfG5vbmV9J308L3NwYW4+XG5oZWxwZXJzLlxuPENvZGVcbiAgY29kZT17JzxkaXYgY2xhc3M9XCJib3JkZXItMiBib3JkZXItc2Vjb25kYXJ5LTYwMCBwLTRcIj5UaGlzIGRpdiBoYXMgc2Vjb25kYXJ5IGJvcmRlcjwvZGl2Pid9IC8+XG5cbjxkaXYgY2xhc3M9XCJib3JkZXItMiBib3JkZXItc2Vjb25kYXJ5LTYwMCBwLTRcIj5cbiAgVGhpcyBkaXYgaGFzIHNlY29uZGFyeSBjb2xvciBib3JkZXJcbjwvZGl2PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBNEIrQjs7Ozs7Ozs7Ozs7OztrQkFRRTs7Ozs7Ozs7Ozs7OztrQkFPQzs7Ozs7a0JBRUE7Ozs7Ozs7Ozs7WUFkMUI7Ozs7OztZQU9JOzs7Ozs7WUFVSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
