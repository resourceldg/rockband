import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, C as Button, am as List, L as Icon, a0 as binding_callbacks, a1 as bind, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, f as add_location, h as insert_dev, j as append_dev, q as mount_component, z as set_data_dev, a2 as add_flush_callback, r as transition_in, u as transition_out, w as destroy_component, g as attr_dev } from './client.b0aae0e4.js';
import { C as Code } from './Code.dad4bb45.js';
import './index.7763868f.js';
import { T as TextField } from './index.b8fbded3.js';
import { S as Select } from './index.79b156af.js';
import { M as Menu } from './index.c547c574.js';
import { S as Slider } from './index.4ef06281.js';

var menus = "<script>\n  import {\n    Button,\n    Menu,\n  } from \"smelte\";\n\n  let open = true;\n\tlet selected = \"\";\n\n  const items = [\n\t\t{ value: 1, text: 'One' },\n\t\t{ value: 2, text: 'Two' },\n\t\t{ value: 3, text: 'Three' },\n\t\t{ value: 4, text: 'Four' },\n\t\t{ value: 5, text: 'Five' },\n\t];\n\n</script>\n\n<small>Selected: {selected || 'nothing'}</small>\n\n<Menu bind:open {items} bind:value={selected}>\n\t<div slot=\"activator\">\n\t\t<Button on:click={() => open = !open}>A menu</Button>\n\t</div>\n</Menu>";

/* src/routes/components/menus.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/menus.svelte"; // (30:4) <Button on:click={() => (open = !open)}>

function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("A menu");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "A menu");
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
    source: "(30:4) <Button on:click={() => (open = !open)}>",
    ctx
  });
  return block;
} // (29:2) <div slot="activator">


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
  button.$on("click",
  /*click_handler*/
  ctx[3]);
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
      add_location(div, file, 28, 2, 738);
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
      128) {
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
    source: "(29:2) <div slot=\\\"activator\\\">",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let small;
  let t0;
  let t1_value = (
  /*selected*/
  ctx[1] || "nothing") + "";
  let t1;
  let br;
  let t2;
  let menu;
  let updating_open;
  let updating_value;
  let t3;
  let code;
  let current;

  function menu_open_binding(value) {
    /*menu_open_binding*/
    ctx[4].call(null, value);
  }

  function menu_value_binding(value) {
    /*menu_value_binding*/
    ctx[5].call(null, value);
  }

  let menu_props = {
    items:
    /*items*/
    ctx[2],
    $$slots: {
      activator: [create_activator_slot]
    },
    $$scope: {
      ctx
    }
  };

  if (
  /*open*/
  ctx[0] !== void 0) {
    menu_props.open =
    /*open*/
    ctx[0];
  }

  if (
  /*selected*/
  ctx[1] !== void 0) {
    menu_props.value =
    /*selected*/
    ctx[1];
  }

  menu = new Menu({
    props: menu_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(menu, "open", menu_open_binding));
  binding_callbacks.push(() => bind(menu, "value", menu_value_binding));
  code = new Code({
    props: {
      code: menus
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      small = element("small");
      t0 = text("Selected: ");
      t1 = text(t1_value);
      br = element("br");
      t2 = space();
      create_component(menu.$$.fragment);
      t3 = space();
      create_component(code.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      small = claim_element(nodes, "SMALL", {});
      var small_nodes = children(small);
      t0 = claim_text(small_nodes, "Selected: ");
      t1 = claim_text(small_nodes, t1_value);
      small_nodes.forEach(detach_dev);
      br = claim_element(nodes, "BR", {});
      t2 = claim_space(nodes);
      claim_component(menu.$$.fragment, nodes);
      t3 = claim_space(nodes);
      claim_component(code.$$.fragment, nodes);
      this.h();
    },
    h: function hydrate() {
      add_location(small, file, 25, 0, 635);
      add_location(br, file, 25, 48, 683);
    },
    m: function mount(target, anchor) {
      insert_dev(target, small, anchor);
      append_dev(small, t0);
      append_dev(small, t1);
      insert_dev(target, br, anchor);
      insert_dev(target, t2, anchor);
      mount_component(menu, target, anchor);
      insert_dev(target, t3, anchor);
      mount_component(code, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      if ((!current || dirty &
      /*selected*/
      2) && t1_value !== (t1_value = (
      /*selected*/
      ctx[1] || "nothing") + "")) set_data_dev(t1, t1_value);
      const menu_changes = {};

      if (dirty &
      /*$$scope, open*/
      129) {
        menu_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_open && dirty &
      /*open*/
      1) {
        updating_open = true;
        menu_changes.open =
        /*open*/
        ctx[0];
        add_flush_callback(() => updating_open = false);
      }

      if (!updating_value && dirty &
      /*selected*/
      2) {
        updating_value = true;
        menu_changes.value =
        /*selected*/
        ctx[1];
        add_flush_callback(() => updating_value = false);
      }

      menu.$set(menu_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(menu.$$.fragment, local);
      transition_in(code.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(menu.$$.fragment, local);
      transition_out(code.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(small);
      if (detaching) detach_dev(br);
      if (detaching) detach_dev(t2);
      destroy_component(menu, detaching);
      if (detaching) detach_dev(t3);
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
  let open = false;
  let open2 = false;
  let selected = "";
  const items = [{
    value: 1,
    text: "One"
  }, {
    value: 2,
    text: "Two"
  }, {
    value: 3,
    text: "Three"
  }, {
    value: 4,
    text: "Four"
  }, {
    value: 5,
    text: "Five"
  }];
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menus> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Menus", $$slots, []);

  const click_handler = () => $$invalidate(0, open = !open);

  function menu_open_binding(value) {
    open = value;
    $$invalidate(0, open);
  }

  function menu_value_binding(value) {
    selected = value;
    $$invalidate(1, selected);
  }

  $$self.$capture_state = () => ({
    Button,
    Menu,
    List,
    Select,
    Icon,
    TextField,
    Slider,
    Code,
    menus,
    open,
    open2,
    selected,
    items
  });

  $$self.$inject_state = $$props => {
    if ("open" in $$props) $$invalidate(0, open = $$props.open);
    if ("open2" in $$props) open2 = $$props.open2;
    if ("selected" in $$props) $$invalidate(1, selected = $$props.selected);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [open, selected, items, click_handler, menu_open_binding, menu_value_binding];
}

class Menus extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Menus",
      options,
      id: create_fragment.name
    });
  }

}

export default Menus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudXMuYjUzYTI3NzYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29tcG9uZW50cy9tZW51cy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29tcG9uZW50cy9CdXR0b25cIjtcbiAgaW1wb3J0IE1lbnUgZnJvbSBcImNvbXBvbmVudHMvTWVudVwiO1xuICBpbXBvcnQgTGlzdCBmcm9tIFwiY29tcG9uZW50cy9MaXN0XCI7XG4gIGltcG9ydCBTZWxlY3QgZnJvbSBcImNvbXBvbmVudHMvU2VsZWN0XCI7XG4gIGltcG9ydCBJY29uIGZyb20gXCJjb21wb25lbnRzL0ljb25cIjtcbiAgaW1wb3J0IFRleHRGaWVsZCBmcm9tIFwiY29tcG9uZW50cy9UZXh0RmllbGRcIjtcbiAgaW1wb3J0IFNsaWRlciBmcm9tIFwiY29tcG9uZW50cy9TbGlkZXJcIjtcbiAgaW1wb3J0IENvZGUgZnJvbSBcImRvY3MvQ29kZS5zdmVsdGVcIjtcblxuICBpbXBvcnQgbWVudXMgZnJvbSBcImV4YW1wbGVzL21lbnVzLnR4dFwiO1xuXG4gIGxldCBvcGVuID0gZmFsc2U7XG4gIGxldCBvcGVuMiA9IGZhbHNlO1xuICBsZXQgc2VsZWN0ZWQgPSBcIlwiO1xuXG4gIGNvbnN0IGl0ZW1zID0gW1xuICAgIHsgdmFsdWU6IDEsIHRleHQ6IFwiT25lXCIgfSxcbiAgICB7IHZhbHVlOiAyLCB0ZXh0OiBcIlR3b1wiIH0sXG4gICAgeyB2YWx1ZTogMywgdGV4dDogXCJUaHJlZVwiIH0sXG4gICAgeyB2YWx1ZTogNCwgdGV4dDogXCJGb3VyXCIgfSxcbiAgICB7IHZhbHVlOiA1LCB0ZXh0OiBcIkZpdmVcIiB9XG4gIF07XG48L3NjcmlwdD5cblxuPHNtYWxsPlNlbGVjdGVkOiB7c2VsZWN0ZWQgfHwgJ25vdGhpbmcnfTwvc21hbGw+PGJyPlxuXG48TWVudSBiaW5kOm9wZW4ge2l0ZW1zfSBiaW5kOnZhbHVlPXtzZWxlY3RlZH0+XG4gIDxkaXYgc2xvdD1cImFjdGl2YXRvclwiPlxuICAgIDxCdXR0b24gb246Y2xpY2s9eygpID0+IChvcGVuID0gIW9wZW4pfT5BIG1lbnU8L0J1dHRvbj5cbiAgPC9kaXY+XG48L01lbnU+XG5cbjxDb2RlIGNvZGU9e21lbnVzfSAvPiJdLCJuYW1lcyI6WyJjdHgiLCJtZW51cyIsIm9wZW4iLCJvcGVuMiIsInNlbGVjdGVkIiwiaXRlbXMiLCJ2YWx1ZSIsInRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJrQkEsRUFBQUEsR0FBUSxFQUFBLENBQVIsSUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVNQSxFQUFBQSxHQUFRLEVBQUEsQ0FBUjs7O0FBQUFBLElBQUFBLEdBQVEsRUFBQTs7Ozs7Ozs7Ozs7WUFNaENDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUk1ELE1BQUFBLEdBQVEsRUFBQSxDQUFSLElBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTUEsUUFBQUEsR0FBUSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BZnRDRSxJQUFJLEdBQUc7TUFDUEMsS0FBSyxHQUFHO01BQ1JDLFFBQVEsR0FBRztRQUVUQyxLQUFLO0FBQ1BDLElBQUFBLEtBQUssRUFBRTtBQUFHQyxJQUFBQSxJQUFJLEVBQUU7O0FBQ2hCRCxJQUFBQSxLQUFLLEVBQUU7QUFBR0MsSUFBQUEsSUFBSSxFQUFFOztBQUNoQkQsSUFBQUEsS0FBSyxFQUFFO0FBQUdDLElBQUFBLElBQUksRUFBRTs7QUFDaEJELElBQUFBLEtBQUssRUFBRTtBQUFHQyxJQUFBQSxJQUFJLEVBQUU7O0FBQ2hCRCxJQUFBQSxLQUFLLEVBQUU7QUFBR0MsSUFBQUEsSUFBSSxFQUFFOzs7Ozs7Ozs7Ozs7OENBUU9MLElBQUksSUFBSUE7Ozs7Ozs7O0FBRkRFLElBQUFBLFFBQVEsUUFBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
