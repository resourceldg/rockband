import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, au as Tooltip, v as validate_slots, C as Button, o as create_component, k as space, p as claim_component, m as claim_space, q as mount_component, h as insert_dev, r as transition_in, u as transition_out, w as destroy_component, b as detach_dev, e as element, c as claim_element, a as children, g as attr_dev, f as add_location, t as text, l as claim_text, n as noop } from './client.798c10e3.js';
import { C as Code } from './Code.91923bdf.js';

var tooltip = "<script>\n  import { Tooltip, Button } from \"smelte\";\n</script>\n\n<Tooltip>\n  <div slot=\"activator\">\n    <Button>Hover me</Button>\n  </div>\n  How are you doing?\n</Tooltip>";

/* src/routes/components/tooltips.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/tooltips.svelte"; // (10:4) <Button>

function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Hover me");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Hover me");
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
    source: "(10:4) <Button>",
    ctx
  });
  return block;
} // (9:2) <div slot="activator">


function create_activator_slot(ctx) {
  let div;
  let button;
  let current;
  button = new Button({
    props: {
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
      div = element("div");
      create_component(button.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        slot: true
      });
      var div_nodes = children(div);
      claim_component(button.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "slot", "activator");
      add_location(div, file, 8, 2, 203);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p: function update(ctx, dirty) {
      const button_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button_changes.$$scope = {
          dirty,
          ctx
        };
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
      if (detaching) detach_dev(div);
      destroy_component(button);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_activator_slot.name,
    type: "slot",
    source: "(9:2) <div slot=\\\"activator\\\">",
    ctx
  });
  return block;
} // (8:0) <Tooltip>


function create_default_slot(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("\n  How are you doing?");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "\n  How are you doing?");
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: "(8:0) <Tooltip>",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let tooltip_1;
  let t;
  let code;
  let current;
  tooltip_1 = new Tooltip({
    props: {
      $$slots: {
        default: [create_default_slot],
        activator: [create_activator_slot]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  code = new Code({
    props: {
      code: tooltip
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(tooltip_1.$$.fragment);
      t = space();
      create_component(code.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(tooltip_1.$$.fragment, nodes);
      t = claim_space(nodes);
      claim_component(code.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(tooltip_1, target, anchor);
      insert_dev(target, t, anchor);
      mount_component(code, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const tooltip_1_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        tooltip_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tooltip_1.$set(tooltip_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(tooltip_1.$$.fragment, local);
      transition_in(code.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(tooltip_1.$$.fragment, local);
      transition_out(code.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(tooltip_1, detaching);
      if (detaching) detach_dev(t);
      destroy_component(code, detaching);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tooltips> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Tooltips", $$slots, []);

  $$self.$capture_state = () => ({
    Tooltip,
    Button,
    Code,
    tooltip
  });

  return [];
}

class Tooltips extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Tooltips",
      options,
      id: create_fragment.name
    });
  }

}

export default Tooltips;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcHMuNWVkMTRkNmMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29tcG9uZW50cy90b29sdGlwcy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IFRvb2x0aXAgZnJvbSBcImNvbXBvbmVudHMvVG9vbHRpcFwiO1xuICBpbXBvcnQgQnV0dG9uIGZyb20gXCJjb21wb25lbnRzL0J1dHRvblwiO1xuICBpbXBvcnQgQ29kZSBmcm9tIFwiZG9jcy9Db2RlLnN2ZWx0ZVwiO1xuICBpbXBvcnQgdG9vbHRpcCBmcm9tIFwiZXhhbXBsZXMvdG9vbHRpcC50eHRcIjtcbjwvc2NyaXB0PlxuXG48VG9vbHRpcD5cbiAgPGRpdiBzbG90PVwiYWN0aXZhdG9yXCI+XG4gICAgPEJ1dHRvbj5Ib3ZlciBtZTwvQnV0dG9uPlxuICA8L2Rpdj5cbiAgSG93IGFyZSB5b3UgZG9pbmc/XG48L1Rvb2x0aXA+XG5cbjxDb2RlIGNvZGU9e3Rvb2x0aXB9IC8+Il0sIm5hbWVzIjpbInRvb2x0aXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBY1lBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
