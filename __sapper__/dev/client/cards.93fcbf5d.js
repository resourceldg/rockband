import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, C as Button, o as create_component, k as space, p as claim_component, m as claim_space, q as mount_component, h as insert_dev, r as transition_in, u as transition_out, w as destroy_component, b as detach_dev, e as element, c as claim_element, a as children, g as attr_dev, f as add_location, n as noop, t as text, l as claim_text, j as append_dev } from './client.819ca0c7.js';
import { C as Code } from './Code.5193b852.js';
import './index.3e56671e.js';
import './index.24cf38ff.js';
import './index.4c392ccf.js';
import { P as PropsTable } from './PropsTable.4c337839.js';
import './Card.9df91b78.js';
import { C as Card } from './index.f2aa2dd8.js';
import { I as Image } from './index.b980d131.js';

var card = "<script>\n\timport {\n\t\tCard,\n\t\tButton,\n\t\tImage\n\t} from \"smelte\";\n</script>\n\n<Card.Card>\n\t<div slot=\"title\">\n\t\t<Card.Title\n\t\t\ttitle=\"The three little kittens\"\n\t\t\tsubheader=\"A kitten poem\"\n\t\t\tavatar=\"https://placekitten.com/64/64\"\n\t\t/>\n\t</div>\n\t<div slot=\"media\">\n\t\t<Image\n\t\t\tclass=\"w-full\"\n\t\t\tsrc=\"https://placekitten.com/300/200\"\n\t\t\talt=\"kitty\"\n\t\t/>\n\t</div>\n\t<div slot=\"text\" class=\"p-5 pb-0 pt-3 text-gray-700 body-2\">\n\t\tThe three little kittens, they lost their mittens,<br>\n\t\tAnd they began to cry,<br>\n\t\t\"Oh, mother dear, we sadly fear,<br>\n\t\tThat we have lost our mittens.\"\n\t</div>\n\t<div slot=\"actions\">\n\t\t<div class=\"p-2\">\n\t\t\t<Button text>OK</Button>\n\t\t\t<Button text>Meow</Button>\n\t\t</div>\n\t</div>\n</Card.Card>";

/* src/routes/components/cards.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/cards.svelte"; // (13:2) <div slot="title">

function create_title_slot(ctx) {
  let div;
  let card_title;
  let current;
  card_title = new Card.Title({
    props: {
      class: "dark:text-black",
      title: "The three little kittens",
      subheader: "A kitten poem",
      avatar: "https://placekitten.com/64/64"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      create_component(card_title.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        slot: true
      });
      var div_nodes = children(div);
      claim_component(card_title.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "slot", "title");
      add_location(div, file, 12, 2, 329);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(card_title, div, null);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(card_title.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(card_title.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_component(card_title);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_title_slot.name,
    type: "slot",
    source: "(13:2) <div slot=\\\"title\\\">",
    ctx
  });
  return block;
} // (20:2) <div slot="media">


function create_media_slot(ctx) {
  let div;
  let image;
  let current;
  image = new Image({
    props: {
      class: "w-full",
      src: "https://placekitten.com/300/200",
      alt: "kitty"
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      create_component(image.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        slot: true
      });
      var div_nodes = children(div);
      claim_component(image.$$.fragment, div_nodes);
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "slot", "media");
      add_location(div, file, 19, 2, 524);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(image, div, null);
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
      if (detaching) detach_dev(div);
      destroy_component(image);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_media_slot.name,
    type: "slot",
    source: "(20:2) <div slot=\\\"media\\\">",
    ctx
  });
  return block;
} // (23:2) <div slot="text" class="p-5 pb-0 pt-3 text-gray-700 body-2">


function create_text_slot(ctx) {
  let div;
  let t0;
  let br0;
  let t1;
  let br1;
  let t2;
  let br2;
  let t3;
  const block = {
    c: function create() {
      div = element("div");
      t0 = text("The three little kittens, they lost their mittens,\n    ");
      br0 = element("br");
      t1 = text("\n    And they began to cry,\n    ");
      br1 = element("br");
      t2 = text("\n    \"Oh, mother dear, we sadly fear,\n    ");
      br2 = element("br");
      t3 = text("\n    That we have lost our mittens.\"");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        slot: true,
        class: true
      });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, "The three little kittens, they lost their mittens,\n    ");
      br0 = claim_element(div_nodes, "BR", {});
      t1 = claim_text(div_nodes, "\n    And they began to cry,\n    ");
      br1 = claim_element(div_nodes, "BR", {});
      t2 = claim_text(div_nodes, "\n    \"Oh, mother dear, we sadly fear,\n    ");
      br2 = claim_element(div_nodes, "BR", {});
      t3 = claim_text(div_nodes, "\n    That we have lost our mittens.\"");
      div_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(br0, file, 24, 4, 753);
      add_location(br1, file, 26, 4, 791);
      add_location(br2, file, 28, 4, 839);
      attr_dev(div, "slot", "text");
      attr_dev(div, "class", "p-5 pb-0 pt-3 text-gray-700 body-2");
      add_location(div, file, 22, 2, 633);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, t0);
      append_dev(div, br0);
      append_dev(div, t1);
      append_dev(div, br1);
      append_dev(div, t2);
      append_dev(div, br2);
      append_dev(div, t3);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_text_slot.name,
    type: "slot",
    source: "(23:2) <div slot=\\\"text\\\" class=\\\"p-5 pb-0 pt-3 text-gray-700 body-2\\\">",
    ctx
  });
  return block;
} // (34:6) <Button text>


function create_default_slot_2(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("OK");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "OK");
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
    source: "(34:6) <Button text>",
    ctx
  });
  return block;
} // (35:6) <Button text>


function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Meow");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Meow");
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
    source: "(35:6) <Button text>",
    ctx
  });
  return block;
} // (32:2) <div slot="actions">


function create_actions_slot(ctx) {
  let div0;
  let div1;
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      text: true,
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button1 = new Button({
    props: {
      text: true,
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
      div0 = element("div");
      div1 = element("div");
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div0 = claim_element(nodes, "DIV", {
        slot: true
      });
      var div0_nodes = children(div0);
      div1 = claim_element(div0_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      claim_component(button0.$$.fragment, div1_nodes);
      t = claim_space(div1_nodes);
      claim_component(button1.$$.fragment, div1_nodes);
      div1_nodes.forEach(detach_dev);
      div0_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(div1, "class", "p-2");
      add_location(div1, file, 32, 4, 918);
      attr_dev(div0, "slot", "actions");
      add_location(div0, file, 31, 2, 893);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div0, anchor);
      append_dev(div0, div1);
      mount_component(button0, div1, null);
      append_dev(div1, t);
      mount_component(button1, div1, null);
      current = true;
    },
    p: function update(ctx, dirty) {
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
    },
    i: function intro(local) {
      if (current) return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div0);
      destroy_component(button0);
      destroy_component(button1);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_actions_slot.name,
    type: "slot",
    source: "(32:2) <div slot=\\\"actions\\\">",
    ctx
  });
  return block;
} // (12:0) <Card.Card class="dark:bg-gray-200">


function create_default_slot(ctx) {
  let t0;
  let t1;
  let t2;
  const block = {
    c: function create() {
      t0 = space();
      t1 = space();
      t2 = space();
    },
    l: function claim(nodes) {
      t0 = claim_space(nodes);
      t1 = claim_space(nodes);
      t2 = claim_space(nodes);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, t1, anchor);
      insert_dev(target, t2, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(t2);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: "(12:0) <Card.Card class=\\\"dark:bg-gray-200\\\">",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let card_card;
  let t0;
  let propstable;
  let t1;
  let code;
  let current;
  card_card = new Card.Card({
    props: {
      class: "dark:bg-gray-200",
      $$slots: {
        default: [create_default_slot],
        actions: [create_actions_slot],
        text: [create_text_slot],
        media: [create_media_slot],
        title: [create_title_slot]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  propstable = new PropsTable({
    props: {
      data: [{
        prop: "hover",
        default: "true",
        description: "Enable hover elevation",
        type: "Boolean"
      }, {
        prop: "elevation",
        default: "1",
        description: "Default elevation value",
        type: "Number"
      }, {
        prop: "hoverElevation",
        default: "8",
        description: "Hover elevation value",
        type: "Number"
      }, {
        prop: "classes",
        default: `rounded inline-flex flex-col overflow-hidden duration-200 ease-in`,
        description: "String of root element classes",
        type: "String"
      }]
    },
    $$inline: true
  });
  code = new Code({
    props: {
      code: card
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(card_card.$$.fragment);
      t0 = space();
      create_component(propstable.$$.fragment);
      t1 = space();
      create_component(code.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(card_card.$$.fragment, nodes);
      t0 = claim_space(nodes);
      claim_component(propstable.$$.fragment, nodes);
      t1 = claim_space(nodes);
      claim_component(code.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(card_card, target, anchor);
      insert_dev(target, t0, anchor);
      mount_component(propstable, target, anchor);
      insert_dev(target, t1, anchor);
      mount_component(code, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const card_card_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        card_card_changes.$$scope = {
          dirty,
          ctx
        };
      }

      card_card.$set(card_card_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(card_card.$$.fragment, local);
      transition_in(propstable.$$.fragment, local);
      transition_in(code.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(card_card.$$.fragment, local);
      transition_out(propstable.$$.fragment, local);
      transition_out(code.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(card_card, detaching);
      if (detaching) detach_dev(t0);
      destroy_component(propstable, detaching);
      if (detaching) detach_dev(t1);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cards> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Cards", $$slots, []);

  $$self.$capture_state = () => ({
    Card,
    Button,
    Image,
    Code,
    PropsTable,
    card
  });

  return [];
}

class Cards extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Cards",
      options,
      id: create_fragment.name
    });
  }

}

export default Cards;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZHMuOTNmY2JmNWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY29tcG9uZW50cy9jYXJkcy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IENhcmQgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvQ2FyZFwiO1xuICBpbXBvcnQgQnV0dG9uIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL0J1dHRvblwiO1xuICBpbXBvcnQgSW1hZ2UgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvSW1hZ2VcIjtcblxuICBpbXBvcnQgQ29kZSBmcm9tIFwiZG9jcy9Db2RlLnN2ZWx0ZVwiO1xuICBpbXBvcnQgUHJvcHNUYWJsZSBmcm9tIFwiZG9jcy9Qcm9wc1RhYmxlLnN2ZWx0ZVwiO1xuXG4gIGltcG9ydCBjYXJkIGZyb20gXCJleGFtcGxlcy9jYXJkLnR4dFwiO1xuPC9zY3JpcHQ+XG5cbjxDYXJkLkNhcmQgY2xhc3M9XCJkYXJrOmJnLWdyYXktMjAwXCI+XG4gIDxkaXYgc2xvdD1cInRpdGxlXCI+XG4gICAgPENhcmQuVGl0bGVcbiAgICAgIGNsYXNzPVwiZGFyazp0ZXh0LWJsYWNrXCJcbiAgICAgIHRpdGxlPVwiVGhlIHRocmVlIGxpdHRsZSBraXR0ZW5zXCJcbiAgICAgIHN1YmhlYWRlcj1cIkEga2l0dGVuIHBvZW1cIlxuICAgICAgYXZhdGFyPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNjQvNjRcIiAvPlxuICA8L2Rpdj5cbiAgPGRpdiBzbG90PVwibWVkaWFcIj5cbiAgICA8SW1hZ2UgY2xhc3M9XCJ3LWZ1bGxcIiBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS8zMDAvMjAwXCIgYWx0PVwia2l0dHlcIiAvPlxuICA8L2Rpdj5cbiAgPGRpdiBzbG90PVwidGV4dFwiIGNsYXNzPVwicC01IHBiLTAgcHQtMyB0ZXh0LWdyYXktNzAwIGJvZHktMlwiPlxuICAgIFRoZSB0aHJlZSBsaXR0bGUga2l0dGVucywgdGhleSBsb3N0IHRoZWlyIG1pdHRlbnMsXG4gICAgPGJyIC8+XG4gICAgQW5kIHRoZXkgYmVnYW4gdG8gY3J5LFxuICAgIDxiciAvPlxuICAgIFwiT2gsIG1vdGhlciBkZWFyLCB3ZSBzYWRseSBmZWFyLFxuICAgIDxiciAvPlxuICAgIFRoYXQgd2UgaGF2ZSBsb3N0IG91ciBtaXR0ZW5zLlwiXG4gIDwvZGl2PlxuICA8ZGl2IHNsb3Q9XCJhY3Rpb25zXCI+XG4gICAgPGRpdiBjbGFzcz1cInAtMlwiPlxuICAgICAgPEJ1dHRvbiB0ZXh0Pk9LPC9CdXR0b24+XG4gICAgICA8QnV0dG9uIHRleHQ+TWVvdzwvQnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvQ2FyZC5DYXJkPlxuXG48UHJvcHNUYWJsZVxuICBkYXRhPXtbXG4gICAgeyBwcm9wOiBcImhvdmVyXCIsIGRlZmF1bHQ6IFwidHJ1ZVwiLCBkZXNjcmlwdGlvbjogXCJFbmFibGUgaG92ZXIgZWxldmF0aW9uXCIsIHR5cGU6IFwiQm9vbGVhblwiIH0sXG4gICAgeyBwcm9wOiBcImVsZXZhdGlvblwiLCBkZWZhdWx0OiBcIjFcIiwgZGVzY3JpcHRpb246IFwiRGVmYXVsdCBlbGV2YXRpb24gdmFsdWVcIiwgdHlwZTogXCJOdW1iZXJcIiB9LFxuICAgIHsgcHJvcDogXCJob3ZlckVsZXZhdGlvblwiLCBkZWZhdWx0OiBcIjhcIiwgZGVzY3JpcHRpb246IFwiSG92ZXIgZWxldmF0aW9uIHZhbHVlXCIsIHR5cGU6IFwiTnVtYmVyXCIgfSxcbiAgICB7IHByb3A6IFwiY2xhc3Nlc1wiLCBkZWZhdWx0OiBgcm91bmRlZCBpbmxpbmUtZmxleCBmbGV4LWNvbCBvdmVyZmxvdy1oaWRkZW4gZHVyYXRpb24tMjAwIGVhc2UtaW5gLCBkZXNjcmlwdGlvbjogXCJTdHJpbmcgb2Ygcm9vdCBlbGVtZW50IGNsYXNzZXNcIiwgdHlwZTogXCJTdHJpbmdcIiB9LFxuICBdfVxuLz5cblxuPENvZGUgY29kZT17Y2FyZH0gLz5cbiJdLCJuYW1lcyI6WyJwcm9wIiwiZGVmYXVsdCIsImRlc2NyaXB0aW9uIiwidHlwZSIsImNhcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDTUEsUUFBQUEsSUFBSSxFQUFFO0FBQVNDLFFBQUFBLE9BQU8sRUFBRTtBQUFRQyxRQUFBQSxXQUFXLEVBQUU7QUFBMEJDLFFBQUFBLElBQUksRUFBRTs7QUFDN0VILFFBQUFBLElBQUksRUFBRTtBQUFhQyxRQUFBQSxPQUFPLEVBQUU7QUFBS0MsUUFBQUEsV0FBVyxFQUFFO0FBQTJCQyxRQUFBQSxJQUFJLEVBQUU7O0FBQy9FSCxRQUFBQSxJQUFJLEVBQUU7QUFBa0JDLFFBQUFBLE9BQU8sRUFBRTtBQUFLQyxRQUFBQSxXQUFXLEVBQUU7QUFBeUJDLFFBQUFBLElBQUksRUFBRTs7QUFDbEZILFFBQUFBLElBQUksRUFBRTtBQUFXQyxRQUFBQSxPQUFPO0FBQXVFQyxRQUFBQSxXQUFXLEVBQUU7QUFBa0NDLFFBQUFBLElBQUksRUFBRTs7Ozs7OztZQUk5SUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
