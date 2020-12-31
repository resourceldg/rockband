import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, aC as Tabs, v as validate_slots, aA as Tab, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, f as add_location, g as attr_dev, E as set_style, h as insert_dev, j as append_dev, q as mount_component, r as transition_in, u as transition_out, w as destroy_component, n as noop } from './client.7a6793f2.js';
import { C as Code } from './Code.129a7a7f.js';
import { I as Image } from './index.1bd1e0a4.js';

var tabs = "<script>\n  import { Tabs } from \"smelte\";\n  import { stores } from '@sapper/app';\n  const { page } = stores();\n\n  const topMenu = [\n      { to: '/components', text: 'Components' },\n      { to: '/typography', text: 'Typography' },\n      { to: '/color', text: 'Color' },\n    ];\n\n  // Or simply use document.location.pathname\n  // if your app isn't sapper.\n  $: path = $page.path;\n</script>\n\n<Tabs items={topMenu} bind:selected={path} />";

var tabsWithContent = "<script>\n\timport {\n    Tabs,\n    Tab,\n    Image,\n    TextField\n\t} from \"smelte\";\n\n  let loading = false;\n</script>\n\n<div style=\"max-width: 400px\">\n  <Tabs\n    selected=\"1\"\n    class=\"bg-black elevation-10 mt-6 text-white rounded-t-lg\"\n    color=\"yellow-a200\"\n    let:selected={selected}\n    {loading}\n    items={[\n      { id: \"1\", text: 'Cats', icon: 'alarm_on' },\n      { id: \"2\", text: 'Kittens', icon: 'bug_report' },\n      { id: \"3\", text: 'Kitties', icon: 'eject' },\n    ]}>\n    <div\n      slot=\"content\"\n      class=\"flex items-center content-center overflow-hidden w-full bg-gray-900 h-full\"\n      style=\"height: 250px\"\n    >\n      <Tab id=\"1\" {selected}>\n        <Image\n          alt=\"kitten 1\"\n          class=\"w-full\"\n          src=\"https://placekitten.com/400/250\"\n          width=\"400\"\n          height=\"250\"\n        />\n      </Tab>\n      <Tab id=\"2\" {selected}>\n        <Image\n          alt=\"kitten 1\"\n          class=\"w-full\"\n          src=\"https://placekitten.com/400/251\"\n          width=\"400\"\n          height=\"250\"\n        />\n      </Tab>\n      <Tab id=\"3\" {selected}>\n        <Image\n          alt=\"kitten 3\"\n          class=\"w-full\"\n          src=\"https://placekitten.com/400/253\"\n          width=\"400\"\n          height=\"250\"\n        />\n      </Tab>\n    </div>\n  </Tabs>\n</div>\n";

/* src/routes/components/tabs.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/tabs.svelte"; // (43:6) <Tab id="1" {selected}>

function create_default_slot_3(ctx) {
  let image;
  let current;
  image = new Image({
    props: {
      alt: "kitten 1",
      class: "w-full",
      src: "https://placekitten.com/400/250",
      width: "400",
      height: "250"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(image.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(image.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(image, target, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(image.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(image.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(image, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_3.name,
    type: "slot",
    source: "(43:6) <Tab id=\\\"1\\\" {selected}>",
    ctx
  });
  return block;
} // (51:6) <Tab id="2" {selected}>


function create_default_slot_2(ctx) {
  let image;
  let current;
  image = new Image({
    props: {
      alt: "kitten 1",
      class: "w-full",
      src: "https://placekitten.com/400/251",
      width: "400",
      height: "250"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(image.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(image.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(image, target, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(image.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(image.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(image, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_2.name,
    type: "slot",
    source: "(51:6) <Tab id=\\\"2\\\" {selected}>",
    ctx
  });
  return block;
} // (59:6) <Tab id="3" {selected}>


function create_default_slot_1(ctx) {
  let image;
  let current;
  image = new Image({
    props: {
      alt: "kitten 3",
      class: "w-full",
      src: "https://placekitten.com/400/253",
      width: "400",
      height: "250"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(image.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(image.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(image, target, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(image.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(image.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(image, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_1.name,
    type: "slot",
    source: "(59:6) <Tab id=\\\"3\\\" {selected}>",
    ctx
  });
  return block;
} // (39:4) <div       slot="content"       class="flex items-center content-center overflow-hidden w-full bg-gray-900 elevation-3 h-full"       style="height: 250px">


function create_content_slot(ctx) {
  let div;
  let tab0;
  let t0;
  let tab1;
  let t1;
  let tab2;
  let current;
  tab0 = new Tab({
    props: {
      id: "1",
      selected:
      /*selected*/
      ctx[1],
      $$slots: {
        default: [create_default_slot_3]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  tab1 = new Tab({
    props: {
      id: "2",
      selected:
      /*selected*/
      ctx[1],
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  tab2 = new Tab({
    props: {
      id: "3",
      selected:
      /*selected*/
      ctx[1],
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
      create_component(tab0.$$.fragment);
      t0 = space();
      create_component(tab1.$$.fragment);
      t1 = space();
      create_component(tab2.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        slot: true,
        class: true,
        style: true
      });
      var div_nodes = children(div);
      claim_component(tab0.$$.fragment, div_nodes);
      t0 = claim_space(div_nodes);
      claim_component(tab1.$$.fragment, div_nodes);
      t1 = claim_space(div_nodes);
      claim_component(tab2.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "slot", "content");
      attr_dev(div, "class", "flex items-center content-center overflow-hidden w-full bg-gray-900 elevation-3 h-full");
      set_style(div, "height", "250px");
      add_location(div, file, 38, 4, 1096);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(tab0, div, null);
      append_dev(div, t0);
      mount_component(tab1, div, null);
      append_dev(div, t1);
      mount_component(tab2, div, null);
      current = true;
    },
    p: function update(ctx, dirty) {
      const tab0_changes = {};
      if (dirty &
      /*selected*/
      2) tab0_changes.selected =
      /*selected*/
      ctx[1];

      if (dirty &
      /*$$scope*/
      4) {
        tab0_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tab0.$set(tab0_changes);
      const tab1_changes = {};
      if (dirty &
      /*selected*/
      2) tab1_changes.selected =
      /*selected*/
      ctx[1];

      if (dirty &
      /*$$scope*/
      4) {
        tab1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tab1.$set(tab1_changes);
      const tab2_changes = {};
      if (dirty &
      /*selected*/
      2) tab2_changes.selected =
      /*selected*/
      ctx[1];

      if (dirty &
      /*$$scope*/
      4) {
        tab2_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tab2.$set(tab2_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(tab0.$$.fragment, local);
      transition_in(tab1.$$.fragment, local);
      transition_in(tab2.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(tab0.$$.fragment, local);
      transition_out(tab1.$$.fragment, local);
      transition_out(tab2.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_component(tab0);
      destroy_component(tab1);
      destroy_component(tab2);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_content_slot.name,
    type: "slot",
    source: "(39:4) <div       slot=\\\"content\\\"       class=\\\"flex items-center content-center overflow-hidden w-full bg-gray-900 elevation-3 h-full\\\"       style=\\\"height: 250px\\\">",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let p;
  let t0;
  let t1;
  let code0;
  let t2;
  let blockquote;
  let t3;
  let t4;
  let div;
  let tabs_1;
  let t5;
  let code1;
  let current;
  code0 = new Code({
    props: {
      code: tabs
    },
    $$inline: true
  });
  tabs_1 = new Tabs({
    props: {
      selected: "1",
      class: "bg-black elevation-10 mt-6 text-white",
      color: "secondary",
      loading:
      /*loading*/
      ctx[0],
      items: [{
        id: "1",
        text: "Cats",
        icon: "alarm_on"
      }, {
        id: "2",
        text: "Kittens",
        icon: "bug_report"
      }, {
        id: "3",
        text: "Kitties",
        icon: "eject"
      }],
      $$slots: {
        content: [create_content_slot, ({
          selected
        }) => ({
          1: selected
        }), ({
          selected
        }) => selected ? 2 : 0]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  code1 = new Code({
    props: {
      code: tabsWithContent
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      p = element("p");
      t0 = text("Tabs can be used as navigation elements like the ones you see on the top\n  right. You need to bind current pathname as value prop for active indicator to\n  work correctly.");
      t1 = space();
      create_component(code0.$$.fragment);
      t2 = space();
      blockquote = element("blockquote");
      t3 = text("Tabs organize and allow navigation between groups of content that are related\n  and at the same level of hierarchy.");
      t4 = space();
      div = element("div");
      create_component(tabs_1.$$.fragment);
      t5 = space();
      create_component(code1.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      p = claim_element(nodes, "P", {});
      var p_nodes = children(p);
      t0 = claim_text(p_nodes, "Tabs can be used as navigation elements like the ones you see on the top\n  right. You need to bind current pathname as value prop for active indicator to\n  work correctly.");
      p_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      claim_component(code0.$$.fragment, nodes);
      t2 = claim_space(nodes);
      blockquote = claim_element(nodes, "BLOCKQUOTE", {
        class: true,
        cite: true
      });
      var blockquote_nodes = children(blockquote);
      t3 = claim_text(blockquote_nodes, "Tabs organize and allow navigation between groups of content that are related\n  and at the same level of hierarchy.");
      blockquote_nodes.forEach(detach_dev);
      t4 = claim_space(nodes);
      div = claim_element(nodes, "DIV", {
        style: true
      });
      var div_nodes = children(div);
      claim_component(tabs_1.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      t5 = claim_space(nodes);
      claim_component(code1.$$.fragment, nodes);
      this.h();
    },
    h: function hydrate() {
      add_location(p, file, 11, 0, 275);
      attr_dev(blockquote, "class", "pl-8 mt-16 mb-10 border-l-8 border-primary-300 text-lg");
      attr_dev(blockquote, "cite", "https://material.io/design/components/tabs.html#usage");
      add_location(blockquote, file, 19, 0, 481);
      set_style(div, "max-width", "400px");
      add_location(div, file, 26, 0, 755);
    },
    m: function mount(target, anchor) {
      insert_dev(target, p, anchor);
      append_dev(p, t0);
      insert_dev(target, t1, anchor);
      mount_component(code0, target, anchor);
      insert_dev(target, t2, anchor);
      insert_dev(target, blockquote, anchor);
      append_dev(blockquote, t3);
      insert_dev(target, t4, anchor);
      insert_dev(target, div, anchor);
      mount_component(tabs_1, div, null);
      insert_dev(target, t5, anchor);
      mount_component(code1, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const tabs_1_changes = {};

      if (dirty &
      /*$$scope, selected*/
      6) {
        tabs_1_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tabs_1.$set(tabs_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(code0.$$.fragment, local);
      transition_in(tabs_1.$$.fragment, local);
      transition_in(code1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(code0.$$.fragment, local);
      transition_out(tabs_1.$$.fragment, local);
      transition_out(code1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(p);
      if (detaching) detach_dev(t1);
      destroy_component(code0, detaching);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(blockquote);
      if (detaching) detach_dev(t4);
      if (detaching) detach_dev(div);
      destroy_component(tabs_1);
      if (detaching) detach_dev(t5);
      destroy_component(code1, detaching);
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
  let loading = false;
  const writable_props = [];
  Object.keys($$props).forEach(key => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tabs> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Tabs", $$slots, []);

  $$self.$capture_state = () => ({
    Tab,
    Tabs,
    Image,
    Code,
    tabs,
    tabsWithContent,
    loading
  });

  $$self.$inject_state = $$props => {
    if ("loading" in $$props) $$invalidate(0, loading = $$props.loading);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  return [loading];
}

class Tabs_1 extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Tabs_1",
      options,
      id: create_fragment.name
    });
  }

}

export default Tabs_1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy4wNGI2MjNkNi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9jb21wb25lbnRzL3RhYnMuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IFRhYiwgVGFicyB9IGZyb20gXCJjb21wb25lbnRzL1RhYnNcIjtcbiAgaW1wb3J0IEltYWdlIGZyb20gXCJjb21wb25lbnRzL0ltYWdlXCI7XG5cbiAgaW1wb3J0IENvZGUgZnJvbSBcImRvY3MvQ29kZS5zdmVsdGVcIjtcbiAgaW1wb3J0IHRhYnMgZnJvbSBcImV4YW1wbGVzL3RhYnMudHh0XCI7XG4gIGltcG9ydCB0YWJzV2l0aENvbnRlbnQgZnJvbSBcImV4YW1wbGVzL3RhYnMtd2l0aC1jb250ZW50LnR4dFwiO1xuXG4gIGxldCBsb2FkaW5nID0gZmFsc2U7XG48L3NjcmlwdD5cblxuPHA+XG4gIFRhYnMgY2FuIGJlIHVzZWQgYXMgbmF2aWdhdGlvbiBlbGVtZW50cyBsaWtlIHRoZSBvbmVzIHlvdSBzZWUgb24gdGhlIHRvcFxuICByaWdodC4gWW91IG5lZWQgdG8gYmluZCBjdXJyZW50IHBhdGhuYW1lIGFzIHZhbHVlIHByb3AgZm9yIGFjdGl2ZSBpbmRpY2F0b3IgdG9cbiAgd29yayBjb3JyZWN0bHkuXG48L3A+XG5cbjxDb2RlIGNvZGU9e3RhYnN9IC8+XG5cbjxibG9ja3F1b3RlXG4gIGNsYXNzPVwicGwtOCBtdC0xNiBtYi0xMCBib3JkZXItbC04IGJvcmRlci1wcmltYXJ5LTMwMCB0ZXh0LWxnXCJcbiAgY2l0ZT1cImh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdGFicy5odG1sI3VzYWdlXCI+XG4gIFRhYnMgb3JnYW5pemUgYW5kIGFsbG93IG5hdmlnYXRpb24gYmV0d2VlbiBncm91cHMgb2YgY29udGVudCB0aGF0IGFyZSByZWxhdGVkXG4gIGFuZCBhdCB0aGUgc2FtZSBsZXZlbCBvZiBoaWVyYXJjaHkuXG48L2Jsb2NrcXVvdGU+XG5cbjxkaXYgc3R5bGU9XCJtYXgtd2lkdGg6IDQwMHB4XCI+XG4gIDxUYWJzXG4gICAgc2VsZWN0ZWQ9XCIxXCJcbiAgICBjbGFzcz1cImJnLWJsYWNrIGVsZXZhdGlvbi0xMCBtdC02IHRleHQtd2hpdGVcIlxuICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICBsZXQ6c2VsZWN0ZWRcbiAgICB7bG9hZGluZ31cbiAgICBpdGVtcz17W1xuICAgICAgeyBpZDogJzEnLCB0ZXh0OiAnQ2F0cycsIGljb246ICdhbGFybV9vbicgfSxcbiAgICAgIHsgaWQ6ICcyJywgdGV4dDogJ0tpdHRlbnMnLCBpY29uOiAnYnVnX3JlcG9ydCcgfSxcbiAgICAgIHsgaWQ6ICczJywgdGV4dDogJ0tpdHRpZXMnLCBpY29uOiAnZWplY3QnIH1cbiAgICBdfT5cbiAgICA8ZGl2XG4gICAgICBzbG90PVwiY29udGVudFwiXG4gICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGNvbnRlbnQtY2VudGVyIG92ZXJmbG93LWhpZGRlbiB3LWZ1bGwgYmctZ3JheS05MDAgZWxldmF0aW9uLTMgaC1mdWxsXCJcbiAgICAgIHN0eWxlPVwiaGVpZ2h0OiAyNTBweFwiPlxuICAgICAgPFRhYiBpZD1cIjFcIiB7c2VsZWN0ZWR9PlxuICAgICAgICA8SW1hZ2VcbiAgICAgICAgICBhbHQ9XCJraXR0ZW4gMVwiXG4gICAgICAgICAgY2xhc3M9XCJ3LWZ1bGxcIlxuICAgICAgICAgIHNyYz1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzQwMC8yNTBcIlxuICAgICAgICAgIHdpZHRoPVwiNDAwXCJcbiAgICAgICAgICBoZWlnaHQ9XCIyNTBcIiAvPlxuICAgICAgPC9UYWI+XG4gICAgICA8VGFiIGlkPVwiMlwiIHtzZWxlY3RlZH0+XG4gICAgICAgIDxJbWFnZVxuICAgICAgICAgIGFsdD1cImtpdHRlbiAxXCJcbiAgICAgICAgICBjbGFzcz1cInctZnVsbFwiXG4gICAgICAgICAgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDAwLzI1MVwiXG4gICAgICAgICAgd2lkdGg9XCI0MDBcIlxuICAgICAgICAgIGhlaWdodD1cIjI1MFwiIC8+XG4gICAgICA8L1RhYj5cbiAgICAgIDxUYWIgaWQ9XCIzXCIge3NlbGVjdGVkfT5cbiAgICAgICAgPEltYWdlXG4gICAgICAgICAgYWx0PVwia2l0dGVuIDNcIlxuICAgICAgICAgIGNsYXNzPVwidy1mdWxsXCJcbiAgICAgICAgICBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MDAvMjUzXCJcbiAgICAgICAgICB3aWR0aD1cIjQwMFwiXG4gICAgICAgICAgaGVpZ2h0PVwiMjUwXCIgLz5cbiAgICAgIDwvVGFiPlxuICAgIDwvZGl2PlxuICA8L1RhYnM+XG48L2Rpdj5cblxuPENvZGUgY29kZT17dGFic1dpdGhDb250ZW50fSAvPlxuIl0sIm5hbWVzIjpbInRhYnMiLCJpZCIsInRleHQiLCJpY29uIiwidGFic1dpdGhDb250ZW50IiwibG9hZGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFpQllBOzs7Ozs7Ozs7Ozs7O0FBaUJKQyxRQUFBQSxFQUFFLEVBQUU7QUFBS0MsUUFBQUEsSUFBSSxFQUFFO0FBQVFDLFFBQUFBLElBQUksRUFBRTs7QUFDN0JGLFFBQUFBLEVBQUUsRUFBRTtBQUFLQyxRQUFBQSxJQUFJLEVBQUU7QUFBV0MsUUFBQUEsSUFBSSxFQUFFOztBQUNoQ0YsUUFBQUEsRUFBRSxFQUFFO0FBQUtDLFFBQUFBLElBQUksRUFBRTtBQUFXQyxRQUFBQSxJQUFJLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFrQzVCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BOUROQyxPQUFPLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
