import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, t as text, k as space, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, g as attr_dev, f as add_location, h as insert_dev, j as append_dev, n as noop } from './client.4c142522.js';

/* src/routes/typography.svelte generated by Svelte v3.24.0 */
const file = "src/routes/typography.svelte";

function create_fragment(ctx) {
  let div5;
  let h40;
  let t0;
  let t1;
  let p;
  let t2;
  let a;
  let t3;
  let t4;
  let div4;
  let h1;
  let t5;
  let t6;
  let h2;
  let t7;
  let t8;
  let h3;
  let t9;
  let t10;
  let h41;
  let t11;
  let t12;
  let h5;
  let t13;
  let t14;
  let h6;
  let t15;
  let t16;
  let div0;
  let t17;
  let t18;
  let div1;
  let t19;
  let t20;
  let div2;
  let t21;
  let t22;
  let div3;
  let t23;
  let t24;
  let small;
  let t25;
  const block = {
    c: function create() {
      div5 = element("div");
      h40 = element("h4");
      t0 = text("Typography defaults and helper classes");
      t1 = space();
      p = element("p");
      t2 = text("H1-h6, subtitle, body and caption as well as their respected classes (.h1,\n    .h2...) use Material design\n    ");
      a = element("a");
      t3 = text("type scale");
      t4 = space();
      div4 = element("div");
      h1 = element("h1");
      t5 = text(".h1 header 1");
      t6 = space();
      h2 = element("h2");
      t7 = text(".h2 header 2");
      t8 = space();
      h3 = element("h3");
      t9 = text(".h3 header 3");
      t10 = space();
      h41 = element("h4");
      t11 = text(".h4 header 4");
      t12 = space();
      h5 = element("h5");
      t13 = text(".h5 header 5");
      t14 = space();
      h6 = element("h6");
      t15 = text(".h6 header 6");
      t16 = space();
      div0 = element("div");
      t17 = text(".subtitle-1");
      t18 = space();
      div1 = element("div");
      t19 = text(".subtitle-2");
      t20 = space();
      div2 = element("div");
      t21 = text(".body-1");
      t22 = space();
      div3 = element("div");
      t23 = text(".body-2");
      t24 = space();
      small = element("small");
      t25 = text(".caption");
      this.h();
    },
    l: function claim(nodes) {
      div5 = claim_element(nodes, "DIV", {});
      var div5_nodes = children(div5);
      h40 = claim_element(div5_nodes, "H4", {
        class: true
      });
      var h40_nodes = children(h40);
      t0 = claim_text(h40_nodes, "Typography defaults and helper classes");
      h40_nodes.forEach(detach_dev);
      t1 = claim_space(div5_nodes);
      p = claim_element(div5_nodes, "P", {});
      var p_nodes = children(p);
      t2 = claim_text(p_nodes, "H1-h6, subtitle, body and caption as well as their respected classes (.h1,\n    .h2...) use Material design\n    ");
      a = claim_element(p_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      t3 = claim_text(a_nodes, "type scale");
      a_nodes.forEach(detach_dev);
      p_nodes.forEach(detach_dev);
      t4 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      h1 = claim_element(div4_nodes, "H1", {});
      var h1_nodes = children(h1);
      t5 = claim_text(h1_nodes, ".h1 header 1");
      h1_nodes.forEach(detach_dev);
      t6 = claim_space(div4_nodes);
      h2 = claim_element(div4_nodes, "H2", {});
      var h2_nodes = children(h2);
      t7 = claim_text(h2_nodes, ".h2 header 2");
      h2_nodes.forEach(detach_dev);
      t8 = claim_space(div4_nodes);
      h3 = claim_element(div4_nodes, "H3", {});
      var h3_nodes = children(h3);
      t9 = claim_text(h3_nodes, ".h3 header 3");
      h3_nodes.forEach(detach_dev);
      t10 = claim_space(div4_nodes);
      h41 = claim_element(div4_nodes, "H4", {});
      var h41_nodes = children(h41);
      t11 = claim_text(h41_nodes, ".h4 header 4");
      h41_nodes.forEach(detach_dev);
      t12 = claim_space(div4_nodes);
      h5 = claim_element(div4_nodes, "H5", {});
      var h5_nodes = children(h5);
      t13 = claim_text(h5_nodes, ".h5 header 5");
      h5_nodes.forEach(detach_dev);
      t14 = claim_space(div4_nodes);
      h6 = claim_element(div4_nodes, "H6", {
        class: true
      });
      var h6_nodes = children(h6);
      t15 = claim_text(h6_nodes, ".h6 header 6");
      h6_nodes.forEach(detach_dev);
      t16 = claim_space(div4_nodes);
      div0 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      t17 = claim_text(div0_nodes, ".subtitle-1");
      div0_nodes.forEach(detach_dev);
      t18 = claim_space(div4_nodes);
      div1 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t19 = claim_text(div1_nodes, ".subtitle-2");
      div1_nodes.forEach(detach_dev);
      t20 = claim_space(div4_nodes);
      div2 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      t21 = claim_text(div2_nodes, ".body-1");
      div2_nodes.forEach(detach_dev);
      t22 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      t23 = claim_text(div3_nodes, ".body-2");
      div3_nodes.forEach(detach_dev);
      t24 = claim_space(div4_nodes);
      small = claim_element(div4_nodes, "SMALL", {});
      var small_nodes = children(small);
      t25 = claim_text(small_nodes, ".caption");
      small_nodes.forEach(detach_dev);
      div4_nodes.forEach(detach_dev);
      div5_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h40, "class", "pb-8");
      add_location(h40, file, 1, 2, 8);
      attr_dev(a, "class", "a");
      attr_dev(a, "href", "https://material.io/design/typography/the-type-system.html#type-scale");
      add_location(a, file, 5, 4, 190);
      add_location(p, file, 2, 2, 71);
      add_location(h1, file, 12, 4, 384);
      add_location(h2, file, 13, 4, 410);
      add_location(h3, file, 14, 4, 436);
      add_location(h41, file, 15, 4, 462);
      add_location(h5, file, 16, 4, 488);
      attr_dev(h6, "class", "mb-3 mt-6");
      add_location(h6, file, 17, 4, 514);
      attr_dev(div0, "class", "subtitle-1");
      add_location(div0, file, 18, 4, 558);
      attr_dev(div1, "class", "subtitle-2");
      add_location(div1, file, 19, 4, 604);
      attr_dev(div2, "class", "body-1");
      add_location(div2, file, 20, 4, 650);
      attr_dev(div3, "class", "body-2");
      add_location(div3, file, 21, 4, 688);
      add_location(small, file, 22, 4, 726);
      attr_dev(div4, "class", "bg-gray-200 dark:bg-dark-700 p-4 my-4");
      add_location(div4, file, 11, 2, 328);
      add_location(div5, file, 0, 0, 0);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div5, anchor);
      append_dev(div5, h40);
      append_dev(h40, t0);
      append_dev(div5, t1);
      append_dev(div5, p);
      append_dev(p, t2);
      append_dev(p, a);
      append_dev(a, t3);
      append_dev(div5, t4);
      append_dev(div5, div4);
      append_dev(div4, h1);
      append_dev(h1, t5);
      append_dev(div4, t6);
      append_dev(div4, h2);
      append_dev(h2, t7);
      append_dev(div4, t8);
      append_dev(div4, h3);
      append_dev(h3, t9);
      append_dev(div4, t10);
      append_dev(div4, h41);
      append_dev(h41, t11);
      append_dev(div4, t12);
      append_dev(div4, h5);
      append_dev(h5, t13);
      append_dev(div4, t14);
      append_dev(div4, h6);
      append_dev(h6, t15);
      append_dev(div4, t16);
      append_dev(div4, div0);
      append_dev(div0, t17);
      append_dev(div4, t18);
      append_dev(div4, div1);
      append_dev(div1, t19);
      append_dev(div4, t20);
      append_dev(div4, div2);
      append_dev(div2, t21);
      append_dev(div4, t22);
      append_dev(div4, div3);
      append_dev(div3, t23);
      append_dev(div4, t24);
      append_dev(div4, small);
      append_dev(small, t25);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div5);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Typography> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Typography", $$slots, []);
  return [];
}

class Typography extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Typography",
      options,
      id: create_fragment.name
    });
  }

}

export default Typography;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwb2dyYXBoeS40MjdiNzFhMC5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
