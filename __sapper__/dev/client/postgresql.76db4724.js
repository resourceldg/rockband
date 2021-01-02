import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, G as text, g as claim_element, h as children, I as claim_text, j as detach_dev, l as attr_dev, m as add_location, n as insert_dev, a as append_dev, D as noop } from './client.73b46335.js';

/* src/routes/backend/postgresql.svelte generated by Svelte v3.24.0 */
const file = "src/routes/backend/postgresql.svelte";

function create_fragment(ctx) {
  let div;
  let h4;
  let t;
  const block = {
    c: function create() {
      div = element("div");
      h4 = element("h4");
      t = text("Welcome to the jungle!! Backend Engineer!!");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      h4 = claim_element(div_nodes, "H4", {
        class: true
      });
      var h4_nodes = children(h4);
      t = claim_text(h4_nodes, "Welcome to the jungle!! Backend Engineer!!");
      h4_nodes.forEach(detach_dev);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h4, "class", "pb-8");
      add_location(h4, file, 1, 2, 8);
      add_location(div, file, 0, 0, 0);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, h4);
      append_dev(h4, t);
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
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}

function instance($$self, $$props) {
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Postgresql> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Postgresql", $$slots, []);
  return [];
}

class Postgresql extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Postgresql",
      options,
      id: create_fragment.name
    });
  }

}

export default Postgresql;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyZXNxbC43NmRiNDcyNC5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
