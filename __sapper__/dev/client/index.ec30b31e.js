import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, t as text, k as space, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, f as add_location, g as attr_dev, h as insert_dev, j as append_dev, n as noop } from './client.3e061e1d.js';
import { C as Code } from './Code.dd574f5d.js';

/* src/routes/index.svelte generated by Svelte v3.24.0 */
const file = "src/routes/index.svelte";

function create_fragment(ctx) {
  let h2;
  let t0;
  let t1;
  let p;
  let t2;
  let a;
  let t3;
  let t4;
  let t5;
  let h3;
  let t6;
  let t7;
  let h4;
  let t8;
  const block = {
    c: function create() {
      h2 = element("h2");
      t0 = text("Welcome!");
      t1 = space();
      p = element("p");
      t2 = text("Waladocs is a documentation by Walatic We hope this tool helps you and\n  accompanies you in your work. If you find any error please report it\n  ");
      a = element("a");
      t3 = text("here");
      t4 = text("\n  You can do better if you fork this project and contribute.");
      t5 = space();
      h3 = element("h3");
      t6 = text("Remember");
      t7 = space();
      h4 = element("h4");
      t8 = text("\" You have the potencial to make amazing things. \"");
      this.h();
    },
    l: function claim(nodes) {
      h2 = claim_element(nodes, "H2", {});
      var h2_nodes = children(h2);
      t0 = claim_text(h2_nodes, "Welcome!");
      h2_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      p = claim_element(nodes, "P", {
        class: true
      });
      var p_nodes = children(p);
      t2 = claim_text(p_nodes, "Waladocs is a documentation by Walatic We hope this tool helps you and\n  accompanies you in your work. If you find any error please report it\n  ");
      a = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      t3 = claim_text(a_nodes, "here");
      a_nodes.forEach(detach_dev);
      t4 = claim_text(p_nodes, "\n  You can do better if you fork this project and contribute.");
      p_nodes.forEach(detach_dev);
      t5 = claim_space(nodes);
      h3 = claim_element(nodes, "H3", {});
      var h3_nodes = children(h3);
      t6 = claim_text(h3_nodes, "Remember");
      h3_nodes.forEach(detach_dev);
      t7 = claim_space(nodes);
      h4 = claim_element(nodes, "H4", {});
      var h4_nodes = children(h4);
      t8 = claim_text(h4_nodes, "\" You have the potencial to make amazing things. \"");
      h4_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(h2, file, 4, 0, 59);
      attr_dev(a, "class", "a");
      attr_dev(a, "href", "https://github.com/resourceldg/waladocs/issue");
      add_location(a, file, 8, 2, 240);
      attr_dev(p, "class", "pb-4");
      add_location(p, file, 5, 0, 77);
      add_location(h3, file, 11, 0, 381);
      add_location(h4, file, 12, 0, 399);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h2, anchor);
      append_dev(h2, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, p, anchor);
      append_dev(p, t2);
      append_dev(p, a);
      append_dev(a, t3);
      append_dev(p, t4);
      insert_dev(target, t5, anchor);
      insert_dev(target, h3, anchor);
      append_dev(h3, t6);
      insert_dev(target, t7, anchor);
      insert_dev(target, h4, anchor);
      append_dev(h4, t8);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(h2);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(p);
      if (detaching) detach_dev(t5);
      if (detaching) detach_dev(h3);
      if (detaching) detach_dev(t7);
      if (detaching) detach_dev(h4);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Routes> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Routes", $$slots, []);

  $$self.$capture_state = () => ({
    Code
  });

  return [];
}

class Routes extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Routes",
      options,
      id: create_fragment.name
    });
  }

}

export default Routes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZWMzMGIzMWUuanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
