import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, C as Button, v as validate_slots, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, g as attr_dev, f as add_location, h as insert_dev, j as append_dev, q as mount_component, r as transition_in, u as transition_out, w as destroy_component } from './client.4c142522.js';
import { C as Code } from './Code.497e1b62.js';

/* src/routes/components/index.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/index.svelte"; // (21:2) <Button disabled>

function create_default_slot_2(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Disabled button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Disabled button");
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
    source: "(21:2) <Button disabled>",
    ctx
  });
  return block;
} // (35:2) <Button     disabledClasses="bg-gray-100 text-gray-500 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"     disabled>


function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Disabled button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Disabled button");
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
    source: "(35:2) <Button     disabledClasses=\\\"bg-gray-100 text-gray-500 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default\\\"     disabled>",
    ctx
  });
  return block;
} // (52:2) <Button     disabledClasses={i => i.replace(/(3|4)00/g, "100")}     disabled>


function create_default_slot(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Disabled button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Disabled button");
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
    id: create_default_slot.name,
    type: "slot",
    source: "(52:2) <Button     disabledClasses={i => i.replace(/(3|4)00/g, \\\"100\\\")}     disabled>",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let h4;
  let t0;
  let t1;
  let p0;
  let t2;
  let br0;
  let t3;
  let span0;
  let t4;
  let t5;
  let code0;
  let t6;
  let div0;
  let button0;
  let t7;
  let p1;
  let t8;
  let br1;
  let t9;
  let span1;
  let t10;
  let t11;
  let code1;
  let t12;
  let div1;
  let button1;
  let t13;
  let p2;
  let t14;
  let t15;
  let code2;
  let t16;
  let div2;
  let button2;
  let t17;
  let p3;
  let t18;
  let a0;
  let t19;
  let t20;
  let a1;
  let t21;
  let t22;
  let current;
  code0 = new Code({
    props: {
      code: "<Button disabled>Disabled button</Button>"
    },
    $$inline: true
  });
  button0 = new Button({
    props: {
      disabled: true,
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  code1 = new Code({
    props: {
      code: `<Button
  disabledClasses="bg-gray-100 text-gray-500 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default"
  disabled>Disabled button
</Button>`
    },
    $$inline: true
  });
  button1 = new Button({
    props: {
      disabledClasses: "bg-gray-100 text-gray-500 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default",
      disabled: true,
      $$slots: {
        default: [create_default_slot_1]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  code2 = new Code({
    props: {
      code: `<Button
  disabledClasses={i => i.replace(/(3|4)00/g, "100")}
  disabled>Disabled button
</Button>`
    },
    $$inline: true
  });
  button2 = new Button({
    props: {
      disabledClasses: func,
      disabled: true,
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
      h4 = element("h4");
      t0 = text("Smelte components");
      t1 = space();
      p0 = element("p");
      t2 = text("Smelte components are built almost exclusively using Tailwind's utility classes\n  keeping CSS bundle size as minimal as possible. UI frameworks are notorious for\n  being hard to customize and we're still looking for appropriate solution given\n  utility-first nature of Tailwind. So for the most part components expose all of\n  their elements' classes as strings like, for instance, Button component has\n  \"disabledClasses\" prop defaulting to");
      br0 = element("br");
      t3 = space();
      span0 = element("span");
      t4 = text("bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default");
      t5 = space();
      create_component(code0.$$.fragment);
      t6 = space();
      div0 = element("div");
      create_component(button0.$$.fragment);
      t7 = space();
      p1 = element("p");
      t8 = text("Say you need to adjust that background color, you may the \"disabledClasses\" prop");
      br1 = element("br");
      t9 = space();
      span1 = element("span");
      t10 = text("bg-gray-100 text-gray-700 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default");
      t11 = space();
      create_component(code1.$$.fragment);
      t12 = space();
      div1 = element("div");
      create_component(button1.$$.fragment);
      t13 = space();
      p2 = element("p");
      t14 = text("This feels bulky to say the least but may still be the case if you need to modify those classes heavily.\n  Same prop also allows you to pass a function which accepts the same string as argument and returns your modified classes string:");
      t15 = space();
      create_component(code2.$$.fragment);
      t16 = space();
      div2 = element("div");
      create_component(button2.$$.fragment);
      t17 = space();
      p3 = element("p");
      t18 = text("Using this approach Smelte is also able to imply which classes are actually being used\n  even dynamically which helps Purge CSS to get rid of unused classes at build time automatically.\n  Still it feels like this is a rather naive way of customizing components so please create an\n  ");
      a0 = element("a");
      t19 = text("issue");
      t20 = text(" on Github or ");
      a1 = element("a");
      t21 = text("contact me directly");
      t22 = text("\n  if you have an idea how to improve on this.");
      this.h();
    },
    l: function claim(nodes) {
      h4 = claim_element(nodes, "H4", {
        class: true
      });
      var h4_nodes = children(h4);
      t0 = claim_text(h4_nodes, "Smelte components");
      h4_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      p0 = claim_element(nodes, "P", {});
      var p0_nodes = children(p0);
      t2 = claim_text(p0_nodes, "Smelte components are built almost exclusively using Tailwind's utility classes\n  keeping CSS bundle size as minimal as possible. UI frameworks are notorious for\n  being hard to customize and we're still looking for appropriate solution given\n  utility-first nature of Tailwind. So for the most part components expose all of\n  their elements' classes as strings like, for instance, Button component has\n  \"disabledClasses\" prop defaulting to");
      br0 = claim_element(p0_nodes, "BR", {});
      t3 = claim_space(p0_nodes);
      span0 = claim_element(p0_nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      t4 = claim_text(span0_nodes, "bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default");
      span0_nodes.forEach(detach_dev);
      p0_nodes.forEach(detach_dev);
      t5 = claim_space(nodes);
      claim_component(code0.$$.fragment, nodes);
      t6 = claim_space(nodes);
      div0 = claim_element(nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      claim_component(button0.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach_dev);
      t7 = claim_space(nodes);
      p1 = claim_element(nodes, "P", {});
      var p1_nodes = children(p1);
      t8 = claim_text(p1_nodes, "Say you need to adjust that background color, you may the \"disabledClasses\" prop");
      br1 = claim_element(p1_nodes, "BR", {});
      t9 = claim_space(p1_nodes);
      span1 = claim_element(p1_nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t10 = claim_text(span1_nodes, "bg-gray-100 text-gray-700 dark:bg-dark-100 elevation-none pointer-events-none hover:bg-gray-300 cursor-default");
      span1_nodes.forEach(detach_dev);
      p1_nodes.forEach(detach_dev);
      t11 = claim_space(nodes);
      claim_component(code1.$$.fragment, nodes);
      t12 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      claim_component(button1.$$.fragment, div1_nodes);
      div1_nodes.forEach(detach_dev);
      t13 = claim_space(nodes);
      p2 = claim_element(nodes, "P", {});
      var p2_nodes = children(p2);
      t14 = claim_text(p2_nodes, "This feels bulky to say the least but may still be the case if you need to modify those classes heavily.\n  Same prop also allows you to pass a function which accepts the same string as argument and returns your modified classes string:");
      p2_nodes.forEach(detach_dev);
      t15 = claim_space(nodes);
      claim_component(code2.$$.fragment, nodes);
      t16 = claim_space(nodes);
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      claim_component(button2.$$.fragment, div2_nodes);
      div2_nodes.forEach(detach_dev);
      t17 = claim_space(nodes);
      p3 = claim_element(nodes, "P", {});
      var p3_nodes = children(p3);
      t18 = claim_text(p3_nodes, "Using this approach Smelte is also able to imply which classes are actually being used\n  even dynamically which helps Purge CSS to get rid of unused classes at build time automatically.\n  Still it feels like this is a rather naive way of customizing components so please create an\n  ");
      a0 = claim_element(p3_nodes, "A", {
        href: true
      });
      var a0_nodes = children(a0);
      t19 = claim_text(a0_nodes, "issue");
      a0_nodes.forEach(detach_dev);
      t20 = claim_text(p3_nodes, " on Github or ");
      a1 = claim_element(p3_nodes, "A", {
        href: true
      });
      var a1_nodes = children(a1);
      t21 = claim_text(a1_nodes, "contact me directly");
      a1_nodes.forEach(detach_dev);
      t22 = claim_text(p3_nodes, "\n  if you have an idea how to improve on this.");
      p3_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h4, "class", "pb-8");
      add_location(h4, file, 5, 0, 102);
      add_location(br0, file, 13, 38, 590);
      attr_dev(span0, "class", "code-inline");
      add_location(span0, file, 14, 2, 597);
      add_location(p0, file, 7, 0, 143);
      attr_dev(div0, "class", "pt-8 pb-16");
      add_location(div0, file, 19, 0, 806);
      add_location(br1, file, 24, 82, 969);
      attr_dev(span1, "class", "code-inline");
      add_location(span1, file, 25, 2, 976);
      add_location(p1, file, 23, 0, 883);
      attr_dev(div1, "class", "pt-8 pb-16");
      add_location(div1, file, 33, 0, 1321);
      add_location(p2, file, 40, 0, 1538);
      attr_dev(div2, "class", "pt-8 pb-16");
      add_location(div2, file, 50, 0, 1904);
      attr_dev(a0, "href", "https://github.com/matyunya/smelte/issues/new");
      add_location(a0, file, 61, 2, 2333);
      attr_dev(a1, "href", "mailto:matyunya@gmail.com");
      add_location(a1, file, 61, 81, 2412);
      add_location(p3, file, 57, 0, 2044);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h4, anchor);
      append_dev(h4, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, p0, anchor);
      append_dev(p0, t2);
      append_dev(p0, br0);
      append_dev(p0, t3);
      append_dev(p0, span0);
      append_dev(span0, t4);
      insert_dev(target, t5, anchor);
      mount_component(code0, target, anchor);
      insert_dev(target, t6, anchor);
      insert_dev(target, div0, anchor);
      mount_component(button0, div0, null);
      insert_dev(target, t7, anchor);
      insert_dev(target, p1, anchor);
      append_dev(p1, t8);
      append_dev(p1, br1);
      append_dev(p1, t9);
      append_dev(p1, span1);
      append_dev(span1, t10);
      insert_dev(target, t11, anchor);
      mount_component(code1, target, anchor);
      insert_dev(target, t12, anchor);
      insert_dev(target, div1, anchor);
      mount_component(button1, div1, null);
      insert_dev(target, t13, anchor);
      insert_dev(target, p2, anchor);
      append_dev(p2, t14);
      insert_dev(target, t15, anchor);
      mount_component(code2, target, anchor);
      insert_dev(target, t16, anchor);
      insert_dev(target, div2, anchor);
      mount_component(button2, div2, null);
      insert_dev(target, t17, anchor);
      insert_dev(target, p3, anchor);
      append_dev(p3, t18);
      append_dev(p3, a0);
      append_dev(a0, t19);
      append_dev(p3, t20);
      append_dev(p3, a1);
      append_dev(a1, t21);
      append_dev(p3, t22);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const button0_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button0_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button0.$set(button0_changes);
      const button1_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button1.$set(button1_changes);
      const button2_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button2_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button2.$set(button2_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(code0.$$.fragment, local);
      transition_in(button0.$$.fragment, local);
      transition_in(code1.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      transition_in(code2.$$.fragment, local);
      transition_in(button2.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(code0.$$.fragment, local);
      transition_out(button0.$$.fragment, local);
      transition_out(code1.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      transition_out(code2.$$.fragment, local);
      transition_out(button2.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(h4);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(p0);
      if (detaching) detach_dev(t5);
      destroy_component(code0, detaching);
      if (detaching) detach_dev(t6);
      if (detaching) detach_dev(div0);
      destroy_component(button0);
      if (detaching) detach_dev(t7);
      if (detaching) detach_dev(p1);
      if (detaching) detach_dev(t11);
      destroy_component(code1, detaching);
      if (detaching) detach_dev(t12);
      if (detaching) detach_dev(div1);
      destroy_component(button1);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(p2);
      if (detaching) detach_dev(t15);
      destroy_component(code2, detaching);
      if (detaching) detach_dev(t16);
      if (detaching) detach_dev(div2);
      destroy_component(button2);
      if (detaching) detach_dev(t17);
      if (detaching) detach_dev(p3);
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

const func = i => i.replace(/(3|4)00/g, "100");

function instance($$self, $$props, $$invalidate) {
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Components> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Components", $$slots, []);

  $$self.$capture_state = () => ({
    Button,
    Code
  });

  return [];
}

class Components extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Components",
      options,
      id: create_fragment.name
    });
  }

}

export default Components;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYzE2MmFmMDcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29tcG9uZW50cy9pbmRleC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29tcG9uZW50cy9CdXR0b25cIjsgXG4gIGltcG9ydCBDb2RlIGZyb20gXCJkb2NzL0NvZGUuc3ZlbHRlXCI7XG48L3NjcmlwdD5cblxuPGg0IGNsYXNzPVwicGItOFwiPlNtZWx0ZSBjb21wb25lbnRzPC9oND5cblxuPHA+XG4gIFNtZWx0ZSBjb21wb25lbnRzIGFyZSBidWlsdCBhbG1vc3QgZXhjbHVzaXZlbHkgdXNpbmcgVGFpbHdpbmQncyB1dGlsaXR5IGNsYXNzZXNcbiAga2VlcGluZyBDU1MgYnVuZGxlIHNpemUgYXMgbWluaW1hbCBhcyBwb3NzaWJsZS4gVUkgZnJhbWV3b3JrcyBhcmUgbm90b3Jpb3VzIGZvclxuICBiZWluZyBoYXJkIHRvIGN1c3RvbWl6ZSBhbmQgd2UncmUgc3RpbGwgbG9va2luZyBmb3IgYXBwcm9wcmlhdGUgc29sdXRpb24gZ2l2ZW5cbiAgdXRpbGl0eS1maXJzdCBuYXR1cmUgb2YgVGFpbHdpbmQuIFNvIGZvciB0aGUgbW9zdCBwYXJ0IGNvbXBvbmVudHMgZXhwb3NlIGFsbCBvZlxuICB0aGVpciBlbGVtZW50cycgY2xhc3NlcyBhcyBzdHJpbmdzIGxpa2UsIGZvciBpbnN0YW5jZSwgQnV0dG9uIGNvbXBvbmVudCBoYXNcbiAgXCJkaXNhYmxlZENsYXNzZXNcIiBwcm9wIGRlZmF1bHRpbmcgdG88YnI+XG4gIDxzcGFuIGNsYXNzPVwiY29kZS1pbmxpbmVcIj5iZy1ncmF5LTMwMCB0ZXh0LWdyYXktNTAwIGRhcms6YmctZGFyay00MDAgZWxldmF0aW9uLW5vbmUgcG9pbnRlci1ldmVudHMtbm9uZSBob3ZlcjpiZy1ncmF5LTMwMCBjdXJzb3ItZGVmYXVsdDwvc3Bhbj5cbjwvcD5cblxuPENvZGUgY29kZT1cIjxCdXR0b24gZGlzYWJsZWQ+RGlzYWJsZWQgYnV0dG9uPC9CdXR0b24+XCIgLz5cblxuPGRpdiBjbGFzcz1cInB0LTggcGItMTZcIj5cbiAgPEJ1dHRvbiBkaXNhYmxlZD5EaXNhYmxlZCBidXR0b248L0J1dHRvbj5cbjwvZGl2PlxuXG48cD5cbiAgU2F5IHlvdSBuZWVkIHRvIGFkanVzdCB0aGF0IGJhY2tncm91bmQgY29sb3IsIHlvdSBtYXkgdGhlIFwiZGlzYWJsZWRDbGFzc2VzXCIgcHJvcDxicj5cbiAgPHNwYW4gY2xhc3M9XCJjb2RlLWlubGluZVwiPmJnLWdyYXktMTAwIHRleHQtZ3JheS03MDAgZGFyazpiZy1kYXJrLTEwMCBlbGV2YXRpb24tbm9uZSBwb2ludGVyLWV2ZW50cy1ub25lIGhvdmVyOmJnLWdyYXktMzAwIGN1cnNvci1kZWZhdWx0PC9zcGFuPlxuPC9wPlxuXG48Q29kZSBjb2RlPXtgPEJ1dHRvblxuICBkaXNhYmxlZENsYXNzZXM9XCJiZy1ncmF5LTEwMCB0ZXh0LWdyYXktNTAwIGRhcms6YmctZGFyay0xMDAgZWxldmF0aW9uLW5vbmUgcG9pbnRlci1ldmVudHMtbm9uZSBob3ZlcjpiZy1ncmF5LTMwMCBjdXJzb3ItZGVmYXVsdFwiXG4gIGRpc2FibGVkPkRpc2FibGVkIGJ1dHRvblxuPC9CdXR0b24+YH0gLz5cblxuPGRpdiBjbGFzcz1cInB0LTggcGItMTZcIj5cbiAgPEJ1dHRvblxuICAgIGRpc2FibGVkQ2xhc3Nlcz1cImJnLWdyYXktMTAwIHRleHQtZ3JheS01MDAgZGFyazpiZy1kYXJrLTEwMCBlbGV2YXRpb24tbm9uZSBwb2ludGVyLWV2ZW50cy1ub25lIGhvdmVyOmJnLWdyYXktMzAwIGN1cnNvci1kZWZhdWx0XCJcbiAgICBkaXNhYmxlZD5EaXNhYmxlZCBidXR0b25cbiAgPC9CdXR0b24+XG48L2Rpdj5cblxuPHA+XG4gIFRoaXMgZmVlbHMgYnVsa3kgdG8gc2F5IHRoZSBsZWFzdCBidXQgbWF5IHN0aWxsIGJlIHRoZSBjYXNlIGlmIHlvdSBuZWVkIHRvIG1vZGlmeSB0aG9zZSBjbGFzc2VzIGhlYXZpbHkuXG4gIFNhbWUgcHJvcCBhbHNvIGFsbG93cyB5b3UgdG8gcGFzcyBhIGZ1bmN0aW9uIHdoaWNoIGFjY2VwdHMgdGhlIHNhbWUgc3RyaW5nIGFzIGFyZ3VtZW50IGFuZCByZXR1cm5zIHlvdXIgbW9kaWZpZWQgY2xhc3NlcyBzdHJpbmc6XG48L3A+XG5cbjxDb2RlIGNvZGU9e2A8QnV0dG9uXG4gIGRpc2FibGVkQ2xhc3Nlcz17aSA9PiBpLnJlcGxhY2UoLygzfDQpMDAvZywgXCIxMDBcIil9XG4gIGRpc2FibGVkPkRpc2FibGVkIGJ1dHRvblxuPC9CdXR0b24+YH0gLz5cblxuPGRpdiBjbGFzcz1cInB0LTggcGItMTZcIj5cbiAgPEJ1dHRvblxuICAgIGRpc2FibGVkQ2xhc3Nlcz17aSA9PiBpLnJlcGxhY2UoLygzfDQpMDAvZywgXCIxMDBcIil9XG4gICAgZGlzYWJsZWQ+RGlzYWJsZWQgYnV0dG9uXG4gIDwvQnV0dG9uPlxuPC9kaXY+XG5cbjxwPlxuICBVc2luZyB0aGlzIGFwcHJvYWNoIFNtZWx0ZSBpcyBhbHNvIGFibGUgdG8gaW1wbHkgd2hpY2ggY2xhc3NlcyBhcmUgYWN0dWFsbHkgYmVpbmcgdXNlZFxuICBldmVuIGR5bmFtaWNhbGx5IHdoaWNoIGhlbHBzIFB1cmdlIENTUyB0byBnZXQgcmlkIG9mIHVudXNlZCBjbGFzc2VzIGF0IGJ1aWxkIHRpbWUgYXV0b21hdGljYWxseS5cbiAgU3RpbGwgaXQgZmVlbHMgbGlrZSB0aGlzIGlzIGEgcmF0aGVyIG5haXZlIHdheSBvZiBjdXN0b21pemluZyBjb21wb25lbnRzIHNvIHBsZWFzZSBjcmVhdGUgYW5cbiAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYXR5dW55YS9zbWVsdGUvaXNzdWVzL25ld1wiPmlzc3VlPC9hPiBvbiBHaXRodWIgb3IgPGEgaHJlZj1cIm1haWx0bzptYXR5dW55YUBnbWFpbC5jb21cIj5jb250YWN0IG1lIGRpcmVjdGx5PC9hPlxuICBpZiB5b3UgaGF2ZSBhbiBpZGVhIGhvdyB0byBpbXByb3ZlIG9uIHRoaXMuXG48L3A+Il0sIm5hbWVzIjpbImkiLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBb0RxQkEsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxVQUFWLEVBQXNCLEtBQXRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
