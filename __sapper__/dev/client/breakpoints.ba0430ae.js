import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, g as attr_dev, f as add_location, h as insert_dev, j as append_dev, q as mount_component, n as noop, r as transition_in, u as transition_out, w as destroy_component } from './client.3e061e1d.js';
import { C as Code } from './Code.dd574f5d.js';

/* src/routes/breakpoints.svelte generated by Svelte v3.24.0 */
const file = "src/routes/breakpoints.svelte";

function create_fragment(ctx) {
  let div;
  let h4;
  let t0;
  let t1;
  let p0;
  let t2;
  let t3;
  let p1;
  let t4;
  let t5;
  let code0;
  let t6;
  let p2;
  let span;
  let t7;
  let t8;
  let code1;
  let current;
  code0 = new Code({
    props: {
      code: `
    import breakpoints from "smelte/breakpoints";

    const bp = breakpoints();
    $: show = $bp !== "sm";

    {#if show}
      ...
    {/if}
  `
    },
    $$inline: true
  });
  code1 = new Code({
    props: {
      code: `
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
  }`
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      h4 = element("h4");
      t0 = text("Breakpoints helper store");
      t1 = space();
      p0 = element("p");
      t2 = text("Sometimes it's useful to know about your current window breakpoint size to\n    order to make any adjustments when browser window gets resized. Smelte comes\n    with a helper store just for that.");
      t3 = space();
      p1 = element("p");
      t4 = text("For instance, navigation drawer on this page should hide programmatically\n    after hitting small window size breakpoint.");
      t5 = space();
      create_component(code0.$$.fragment);
      t6 = space();
      p2 = element("p");
      span = element("span");
      t7 = text("breakpoints");
      t8 = text("\n    accepts one function argument which returns breakpoint name.\n    ");
      create_component(code1.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      h4 = claim_element(div_nodes, "H4", {
        class: true
      });
      var h4_nodes = children(h4);
      t0 = claim_text(h4_nodes, "Breakpoints helper store");
      h4_nodes.forEach(detach_dev);
      t1 = claim_space(div_nodes);
      p0 = claim_element(div_nodes, "P", {});
      var p0_nodes = children(p0);
      t2 = claim_text(p0_nodes, "Sometimes it's useful to know about your current window breakpoint size to\n    order to make any adjustments when browser window gets resized. Smelte comes\n    with a helper store just for that.");
      p0_nodes.forEach(detach_dev);
      t3 = claim_space(div_nodes);
      p1 = claim_element(div_nodes, "P", {});
      var p1_nodes = children(p1);
      t4 = claim_text(p1_nodes, "For instance, navigation drawer on this page should hide programmatically\n    after hitting small window size breakpoint.");
      p1_nodes.forEach(detach_dev);
      t5 = claim_space(div_nodes);
      claim_component(code0.$$.fragment, div_nodes);
      t6 = claim_space(div_nodes);
      p2 = claim_element(div_nodes, "P", {});
      var p2_nodes = children(p2);
      span = claim_element(p2_nodes, "SPAN", {
        class: true
      });
      var span_nodes = children(span);
      t7 = claim_text(span_nodes, "breakpoints");
      span_nodes.forEach(detach_dev);
      t8 = claim_text(p2_nodes, "\n    accepts one function argument which returns breakpoint name.\n    ");
      claim_component(code1.$$.fragment, p2_nodes);
      p2_nodes.forEach(detach_dev);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h4, "class", "pb-8");
      add_location(h4, file, 5, 2, 67);
      add_location(p0, file, 7, 2, 117);
      add_location(p1, file, 13, 2, 330);
      attr_dev(span, "class", "code-inline");
      add_location(span, file, 31, 4, 652);
      add_location(p2, file, 30, 2, 644);
      add_location(div, file, 4, 0, 59);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, h4);
      append_dev(h4, t0);
      append_dev(div, t1);
      append_dev(div, p0);
      append_dev(p0, t2);
      append_dev(div, t3);
      append_dev(div, p1);
      append_dev(p1, t4);
      append_dev(div, t5);
      mount_component(code0, div, null);
      append_dev(div, t6);
      append_dev(div, p2);
      append_dev(p2, span);
      append_dev(span, t7);
      append_dev(p2, t8);
      mount_component(code1, p2, null);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(code0.$$.fragment, local);
      transition_in(code1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(code0.$$.fragment, local);
      transition_out(code1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_component(code0);
      destroy_component(code1);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Breakpoints> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Breakpoints", $$slots, []);

  $$self.$capture_state = () => ({
    Code
  });

  return [];
}

class Breakpoints extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Breakpoints",
      options,
      id: create_fragment.name
    });
  }

}

export default Breakpoints;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludHMuYmEwNDMwYWUuanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
