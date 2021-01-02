import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, G as text, f as space, F as create_component, g as claim_element, h as children, I as claim_text, j as detach_dev, k as claim_space, H as claim_component, l as attr_dev, m as add_location, n as insert_dev, a as append_dev, J as mount_component, D as noop, t as transition_in, q as transition_out, K as destroy_component } from './client.69767a2d.js';
import './_commonjsHelpers.fffabd3b.js';
import { C as Code } from './Code.35fbbfc2.js';

/* src/routes/infrestructure/sre.svelte generated by Svelte v3.24.0 */
const file = "src/routes/infrestructure/sre.svelte";

function create_fragment(ctx) {
  let div;
  let h4;
  let t0;
  let t1;
  let p;
  let t2;
  let t3;
  let code0;
  let t4;
  let code1;
  let current;
  code0 = new Code({
    props: {
      code: `docker network create proxy-net`
    },
    $$inline: true
  });
  code1 = new Code({
    props: {
      code: `docker run -itd -p 1883:1883 -p 8883:8883 --net proxy-net  eclipse-mosquitto `
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      h4 = element("h4");
      t0 = text("Welcome to the jungle!! Site Reliability Engineer!!");
      t1 = space();
      p = element("p");
      t2 = text("Mosquitto independiente del Docker Compose, primero creamos\n        la network, después ejecutamos el coomando docker run");
      t3 = space();
      create_component(code0.$$.fragment);
      t4 = space();
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
      t0 = claim_text(h4_nodes, "Welcome to the jungle!! Site Reliability Engineer!!");
      h4_nodes.forEach(detach_dev);
      t1 = claim_space(div_nodes);
      p = claim_element(div_nodes, "P", {
        class: true
      });
      var p_nodes = children(p);
      t2 = claim_text(p_nodes, "Mosquitto independiente del Docker Compose, primero creamos\n        la network, después ejecutamos el coomando docker run");
      p_nodes.forEach(detach_dev);
      t3 = claim_space(div_nodes);
      claim_component(code0.$$.fragment, div_nodes);
      t4 = claim_space(div_nodes);
      claim_component(code1.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(h4, "class", "pb-8");
      add_location(h4, file, 5, 4, 73);
      attr_dev(p, "class", "pb-4");
      add_location(p, file, 6, 4, 151);
      add_location(div, file, 4, 0, 63);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, h4);
      append_dev(h4, t0);
      append_dev(div, t1);
      append_dev(div, p);
      append_dev(p, t2);
      append_dev(div, t3);
      mount_component(code0, div, null);
      append_dev(div, t4);
      mount_component(code1, div, null);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sre> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Sre", $$slots, []);

  $$self.$capture_state = () => ({
    Code
  });

  return [];
}

class Sre extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Sre",
      options,
      id: create_fragment.name
    });
  }

}

export default Sre;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JlLmVhZDJhMDIzLmpzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
