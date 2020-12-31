import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, C as Button, v as validate_slots, L as Icon, e as element, t as text, k as space, o as create_component, c as claim_element, a as children, l as claim_text, b as detach_dev, m as claim_space, p as claim_component, f as add_location, g as attr_dev, h as insert_dev, j as append_dev, q as mount_component, r as transition_in, u as transition_out, w as destroy_component } from './client.97066c0b.js';
import { C as Code } from './Code.5fe72bae.js';
import './index.d42fe9b0.js';
import './index.5c24255b.js';
import './index.eb2bd2dd.js';
import { P as PropsTable } from './PropsTable.fe4c538f.js';

var buttons = "<script>\n  import {\n    Button,\n    Icon\n  } from \"smelte\";\n</script>\n\n<h6 class=\"mb-3 mt-6\">Basic</h6>\n<div class=\"py-2\">\n  <Button>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">Light</h6>\n<div class=\"py-2\">\n  <Button light>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">Dark</h6>\n<div class=\"py-2\">\n  <Button dark>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">Block</h6>\n<div class=\"py-2\">\n  <Button color=\"alert\" dark block>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">Outlined</h6>\n<div class=\"py-2\">\n  <Button color=\"secondary\" light block outlined>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">Text</h6>\n<div class=\"py-2\">\n  <Button text>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">Disabled</h6>\n<div class=\"py-2\">\n  <Button block disabled>Button</Button>\n</div>\n\n<h6 class=\"mb-3 mt-6\">FAB <a href=\"https://material.io/components/buttons-floating-action-button/\">(Floating action button)</a></h6>\n<div class=\"py-2\">\n  <Button color=\"alert\" icon=\"change_history\" />\n</div>\n\n<h6 class=\"mb-3 mt-6\">Fab flat</h6>\n<div class=\"py-2\">\n  <Button color=\"error\" icon=\"change_history\" text light flat />\n</div>";

/* src/routes/components/buttons.svelte generated by Svelte v3.24.0 */
const file = "src/routes/components/buttons.svelte"; // (18:2) <Button>

function create_default_slot_7(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    id: create_default_slot_7.name,
    type: "slot",
    source: "(18:2) <Button>",
    ctx
  });
  return block;
} // (23:2) <Button     light   >


function create_default_slot_6(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    id: create_default_slot_6.name,
    type: "slot",
    source: "(23:2) <Button     light   >",
    ctx
  });
  return block;
} // (30:2) <Button dark>


function create_default_slot_5(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    id: create_default_slot_5.name,
    type: "slot",
    source: "(30:2) <Button dark>",
    ctx
  });
  return block;
} // (35:2) <Button color="alert" dark block>


function create_default_slot_4(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    id: create_default_slot_4.name,
    type: "slot",
    source: "(35:2) <Button color=\\\"alert\\\" dark block>",
    ctx
  });
  return block;
} // (61:2) <Button color="secondary" light block outlined>


function create_default_slot_3(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    id: create_default_slot_3.name,
    type: "slot",
    source: "(61:2) <Button color=\\\"secondary\\\" light block outlined>",
    ctx
  });
  return block;
} // (66:2) <Button     color="secondary"     light     block     outlined   >


function create_default_slot_2(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    source: "(66:2) <Button     color=\\\"secondary\\\"     light     block     outlined   >",
    ctx
  });
  return block;
} // (76:2) <Button text>


function create_default_slot_1(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    source: "(76:2) <Button text>",
    ctx
  });
  return block;
} // (81:2) <Button block disabled>


function create_default_slot(ctx) {
  let t;
  const block = {
    c: function create() {
      t = text("Button");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "Button");
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
    source: "(81:2) <Button block disabled>",
    ctx
  });
  return block;
}

function create_fragment(ctx) {
  let blockquote;
  let p;
  let t0;
  let t1;
  let h60;
  let t2;
  let t3;
  let div0;
  let button0;
  let t4;
  let h61;
  let t5;
  let t6;
  let div1;
  let button1;
  let t7;
  let h62;
  let t8;
  let t9;
  let div2;
  let button2;
  let t10;
  let h63;
  let t11;
  let t12;
  let div3;
  let button3;
  let t13;
  let propstable;
  let t14;
  let h64;
  let t15;
  let t16;
  let div4;
  let button4;
  let t17;
  let h65;
  let t18;
  let t19;
  let div5;
  let button5;
  let t20;
  let h66;
  let t21;
  let t22;
  let div6;
  let button6;
  let t23;
  let h67;
  let t24;
  let t25;
  let div7;
  let button7;
  let t26;
  let h68;
  let t27;
  let a;
  let t28;
  let t29;
  let div8;
  let button8;
  let t30;
  let h69;
  let t31;
  let t32;
  let div9;
  let button9;
  let t33;
  let code;
  let current;
  button0 = new Button({
    props: {
      $$slots: {
        default: [create_default_slot_7]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button1 = new Button({
    props: {
      light: true,
      $$slots: {
        default: [create_default_slot_6]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button2 = new Button({
    props: {
      dark: true,
      $$slots: {
        default: [create_default_slot_5]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button3 = new Button({
    props: {
      color: "alert",
      dark: true,
      block: true,
      $$slots: {
        default: [create_default_slot_4]
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
        prop: "value",
        description: "Bound boolean value",
        type: "Boolean",
        default: "false"
      }, {
        prop: "color",
        description: "Color variant, accepts any of the main colors described in Tailwind config",
        type: "String",
        default: "primary"
      }, {
        prop: "outlined",
        description: "Outlined variant",
        type: "Boolean",
        default: "false"
      }, {
        prop: "text",
        description: "Text button variant (transparent background)",
        type: "Boolean",
        default: "false"
      }, {
        prop: "block",
        description: "Full block width button",
        type: "Boolean",
        default: "false"
      }, {
        prop: "disabled",
        description: "Disabled state",
        type: "Boolean",
        default: "false"
      }, {
        prop: "icon",
        description: "Icon button variant",
        type: "String",
        default: "null"
      }, {
        prop: "small",
        description: "Smaller size",
        type: "Boolean",
        default: "false"
      }, {
        prop: "light",
        description: "Lighter variant",
        type: "Boolean",
        default: "false"
      }, {
        prop: "dark",
        description: "Darker variant",
        type: "Boolean",
        default: "false"
      }, {
        prop: "flat",
        description: "Flat variant",
        type: "Boolean",
        default: "false"
      }, {
        prop: "iconClass",
        description: "List of classes to pass down to icon",
        type: "String",
        default: "empty string"
      }, {
        prop: "href",
        description: "Link URL",
        type: "String",
        default: "null"
      }, {
        prop: "add",
        description: "List of classes to add to the component",
        type: "String",
        default: "empty string"
      }, {
        prop: "remove",
        description: "List of classes to remove from the component",
        type: "String",
        default: "empty string"
      }, {
        prop: "replace",
        description: "List of classes to replace in the component",
        type: "Object",
        default: "{}"
      }]
    },
    $$inline: true
  });
  button4 = new Button({
    props: {
      color: "secondary",
      light: true,
      block: true,
      outlined: true,
      $$slots: {
        default: [create_default_slot_3]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button5 = new Button({
    props: {
      color: "secondary",
      light: true,
      block: true,
      outlined: true,
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx
      }
    },
    $$inline: true
  });
  button6 = new Button({
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
  button7 = new Button({
    props: {
      block: true,
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
  button8 = new Button({
    props: {
      color: "alert",
      icon: "change_history"
    },
    $$inline: true
  });
  button9 = new Button({
    props: {
      color: "error",
      icon: "change_history",
      text: true,
      light: true,
      flat: true
    },
    $$inline: true
  });
  code = new Code({
    props: {
      code: buttons
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      blockquote = element("blockquote");
      p = element("p");
      t0 = text("Buttons allow users to take actions, and make choices, with a single tap.");
      t1 = space();
      h60 = element("h6");
      t2 = text("Basic");
      t3 = space();
      div0 = element("div");
      create_component(button0.$$.fragment);
      t4 = space();
      h61 = element("h6");
      t5 = text("Light");
      t6 = space();
      div1 = element("div");
      create_component(button1.$$.fragment);
      t7 = space();
      h62 = element("h6");
      t8 = text("Dark");
      t9 = space();
      div2 = element("div");
      create_component(button2.$$.fragment);
      t10 = space();
      h63 = element("h6");
      t11 = text("Block");
      t12 = space();
      div3 = element("div");
      create_component(button3.$$.fragment);
      t13 = space();
      create_component(propstable.$$.fragment);
      t14 = space();
      h64 = element("h6");
      t15 = text("Outlined");
      t16 = space();
      div4 = element("div");
      create_component(button4.$$.fragment);
      t17 = space();
      h65 = element("h6");
      t18 = text("As anchor");
      t19 = space();
      div5 = element("div");
      create_component(button5.$$.fragment);
      t20 = space();
      h66 = element("h6");
      t21 = text("Text");
      t22 = space();
      div6 = element("div");
      create_component(button6.$$.fragment);
      t23 = space();
      h67 = element("h6");
      t24 = text("Disabled");
      t25 = space();
      div7 = element("div");
      create_component(button7.$$.fragment);
      t26 = space();
      h68 = element("h6");
      t27 = text("FAB ");
      a = element("a");
      t28 = text("(Floating action button)");
      t29 = space();
      div8 = element("div");
      create_component(button8.$$.fragment);
      t30 = space();
      h69 = element("h6");
      t31 = text("Fab flat");
      t32 = space();
      div9 = element("div");
      create_component(button9.$$.fragment);
      t33 = space();
      create_component(code.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      blockquote = claim_element(nodes, "BLOCKQUOTE", {
        class: true,
        cite: true
      });
      var blockquote_nodes = children(blockquote);
      p = claim_element(blockquote_nodes, "P", {});
      var p_nodes = children(p);
      t0 = claim_text(p_nodes, "Buttons allow users to take actions, and make choices, with a single tap.");
      p_nodes.forEach(detach_dev);
      blockquote_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      h60 = claim_element(nodes, "H6", {
        class: true
      });
      var h60_nodes = children(h60);
      t2 = claim_text(h60_nodes, "Basic");
      h60_nodes.forEach(detach_dev);
      t3 = claim_space(nodes);
      div0 = claim_element(nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      claim_component(button0.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach_dev);
      t4 = claim_space(nodes);
      h61 = claim_element(nodes, "H6", {
        class: true
      });
      var h61_nodes = children(h61);
      t5 = claim_text(h61_nodes, "Light");
      h61_nodes.forEach(detach_dev);
      t6 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      claim_component(button1.$$.fragment, div1_nodes);
      div1_nodes.forEach(detach_dev);
      t7 = claim_space(nodes);
      h62 = claim_element(nodes, "H6", {
        class: true
      });
      var h62_nodes = children(h62);
      t8 = claim_text(h62_nodes, "Dark");
      h62_nodes.forEach(detach_dev);
      t9 = claim_space(nodes);
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      claim_component(button2.$$.fragment, div2_nodes);
      div2_nodes.forEach(detach_dev);
      t10 = claim_space(nodes);
      h63 = claim_element(nodes, "H6", {
        class: true
      });
      var h63_nodes = children(h63);
      t11 = claim_text(h63_nodes, "Block");
      h63_nodes.forEach(detach_dev);
      t12 = claim_space(nodes);
      div3 = claim_element(nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      claim_component(button3.$$.fragment, div3_nodes);
      div3_nodes.forEach(detach_dev);
      t13 = claim_space(nodes);
      claim_component(propstable.$$.fragment, nodes);
      t14 = claim_space(nodes);
      h64 = claim_element(nodes, "H6", {
        class: true
      });
      var h64_nodes = children(h64);
      t15 = claim_text(h64_nodes, "Outlined");
      h64_nodes.forEach(detach_dev);
      t16 = claim_space(nodes);
      div4 = claim_element(nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      claim_component(button4.$$.fragment, div4_nodes);
      div4_nodes.forEach(detach_dev);
      t17 = claim_space(nodes);
      h65 = claim_element(nodes, "H6", {
        class: true
      });
      var h65_nodes = children(h65);
      t18 = claim_text(h65_nodes, "As anchor");
      h65_nodes.forEach(detach_dev);
      t19 = claim_space(nodes);
      div5 = claim_element(nodes, "DIV", {
        class: true
      });
      var div5_nodes = children(div5);
      claim_component(button5.$$.fragment, div5_nodes);
      div5_nodes.forEach(detach_dev);
      t20 = claim_space(nodes);
      h66 = claim_element(nodes, "H6", {
        class: true
      });
      var h66_nodes = children(h66);
      t21 = claim_text(h66_nodes, "Text");
      h66_nodes.forEach(detach_dev);
      t22 = claim_space(nodes);
      div6 = claim_element(nodes, "DIV", {
        class: true
      });
      var div6_nodes = children(div6);
      claim_component(button6.$$.fragment, div6_nodes);
      div6_nodes.forEach(detach_dev);
      t23 = claim_space(nodes);
      h67 = claim_element(nodes, "H6", {
        class: true
      });
      var h67_nodes = children(h67);
      t24 = claim_text(h67_nodes, "Disabled");
      h67_nodes.forEach(detach_dev);
      t25 = claim_space(nodes);
      div7 = claim_element(nodes, "DIV", {
        class: true
      });
      var div7_nodes = children(div7);
      claim_component(button7.$$.fragment, div7_nodes);
      div7_nodes.forEach(detach_dev);
      t26 = claim_space(nodes);
      h68 = claim_element(nodes, "H6", {
        class: true
      });
      var h68_nodes = children(h68);
      t27 = claim_text(h68_nodes, "FAB ");
      a = claim_element(h68_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      t28 = claim_text(a_nodes, "(Floating action button)");
      a_nodes.forEach(detach_dev);
      h68_nodes.forEach(detach_dev);
      t29 = claim_space(nodes);
      div8 = claim_element(nodes, "DIV", {
        class: true
      });
      var div8_nodes = children(div8);
      claim_component(button8.$$.fragment, div8_nodes);
      div8_nodes.forEach(detach_dev);
      t30 = claim_space(nodes);
      h69 = claim_element(nodes, "H6", {
        class: true
      });
      var h69_nodes = children(h69);
      t31 = claim_text(h69_nodes, "Fab flat");
      h69_nodes.forEach(detach_dev);
      t32 = claim_space(nodes);
      div9 = claim_element(nodes, "DIV", {
        class: true
      });
      var div9_nodes = children(div9);
      claim_component(button9.$$.fragment, div9_nodes);
      div9_nodes.forEach(detach_dev);
      t33 = claim_space(nodes);
      claim_component(code.$$.fragment, nodes);
      this.h();
    },
    h: function hydrate() {
      add_location(p, file, 12, 2, 365);
      attr_dev(blockquote, "class", "pl-8 mt-2 mb-10 border-l-8 border-primary-300 text-lg");
      attr_dev(blockquote, "cite", "https://material.io/components/buttons/");
      add_location(blockquote, file, 9, 0, 237);
      attr_dev(h60, "class", "mb-3 mt-6");
      add_location(h60, file, 15, 0, 461);
      attr_dev(div0, "class", "py-2");
      add_location(div0, file, 16, 0, 494);
      attr_dev(h61, "class", "mb-3 mt-6");
      add_location(h61, file, 20, 0, 547);
      attr_dev(div1, "class", "py-2");
      add_location(div1, file, 21, 0, 580);
      attr_dev(h62, "class", "mb-3 mt-6");
      add_location(h62, file, 27, 0, 646);
      attr_dev(div2, "class", "py-2");
      add_location(div2, file, 28, 0, 678);
      attr_dev(h63, "class", "mb-3 mt-6");
      add_location(h63, file, 32, 0, 736);
      attr_dev(div3, "class", "py-2");
      add_location(div3, file, 33, 0, 769);
      attr_dev(h64, "class", "mb-3 mt-6");
      add_location(h64, file, 58, 0, 2527);
      attr_dev(div4, "class", "py-2");
      add_location(div4, file, 59, 0, 2563);
      attr_dev(h65, "class", "mb-3 mt-6");
      add_location(h65, file, 63, 0, 2655);
      attr_dev(div5, "class", "py-2");
      add_location(div5, file, 64, 0, 2692);
      attr_dev(h66, "class", "mb-3 mt-6");
      add_location(h66, file, 73, 0, 2803);
      attr_dev(div6, "class", "py-2");
      add_location(div6, file, 74, 0, 2835);
      attr_dev(h67, "class", "mb-3 mt-6");
      add_location(h67, file, 78, 0, 2893);
      attr_dev(div7, "class", "py-2");
      add_location(div7, file, 79, 0, 2929);
      attr_dev(a, "class", "a");
      attr_dev(a, "href", "https://material.io/components/buttons-floating-action-button/");
      add_location(a, file, 83, 26, 3023);
      attr_dev(h68, "class", "mb-3 mt-6");
      add_location(h68, file, 83, 0, 2997);
      attr_dev(div8, "class", "py-2");
      add_location(div8, file, 84, 0, 3140);
      attr_dev(h69, "class", "mb-3 mt-6");
      add_location(h69, file, 88, 0, 3216);
      attr_dev(div9, "class", "py-2");
      add_location(div9, file, 89, 0, 3252);
    },
    m: function mount(target, anchor) {
      insert_dev(target, blockquote, anchor);
      append_dev(blockquote, p);
      append_dev(p, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, h60, anchor);
      append_dev(h60, t2);
      insert_dev(target, t3, anchor);
      insert_dev(target, div0, anchor);
      mount_component(button0, div0, null);
      insert_dev(target, t4, anchor);
      insert_dev(target, h61, anchor);
      append_dev(h61, t5);
      insert_dev(target, t6, anchor);
      insert_dev(target, div1, anchor);
      mount_component(button1, div1, null);
      insert_dev(target, t7, anchor);
      insert_dev(target, h62, anchor);
      append_dev(h62, t8);
      insert_dev(target, t9, anchor);
      insert_dev(target, div2, anchor);
      mount_component(button2, div2, null);
      insert_dev(target, t10, anchor);
      insert_dev(target, h63, anchor);
      append_dev(h63, t11);
      insert_dev(target, t12, anchor);
      insert_dev(target, div3, anchor);
      mount_component(button3, div3, null);
      insert_dev(target, t13, anchor);
      mount_component(propstable, target, anchor);
      insert_dev(target, t14, anchor);
      insert_dev(target, h64, anchor);
      append_dev(h64, t15);
      insert_dev(target, t16, anchor);
      insert_dev(target, div4, anchor);
      mount_component(button4, div4, null);
      insert_dev(target, t17, anchor);
      insert_dev(target, h65, anchor);
      append_dev(h65, t18);
      insert_dev(target, t19, anchor);
      insert_dev(target, div5, anchor);
      mount_component(button5, div5, null);
      insert_dev(target, t20, anchor);
      insert_dev(target, h66, anchor);
      append_dev(h66, t21);
      insert_dev(target, t22, anchor);
      insert_dev(target, div6, anchor);
      mount_component(button6, div6, null);
      insert_dev(target, t23, anchor);
      insert_dev(target, h67, anchor);
      append_dev(h67, t24);
      insert_dev(target, t25, anchor);
      insert_dev(target, div7, anchor);
      mount_component(button7, div7, null);
      insert_dev(target, t26, anchor);
      insert_dev(target, h68, anchor);
      append_dev(h68, t27);
      append_dev(h68, a);
      append_dev(a, t28);
      insert_dev(target, t29, anchor);
      insert_dev(target, div8, anchor);
      mount_component(button8, div8, null);
      insert_dev(target, t30, anchor);
      insert_dev(target, h69, anchor);
      append_dev(h69, t31);
      insert_dev(target, t32, anchor);
      insert_dev(target, div9, anchor);
      mount_component(button9, div9, null);
      insert_dev(target, t33, anchor);
      mount_component(code, target, anchor);
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
      const button3_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button3_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button3.$set(button3_changes);
      const button4_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button4_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button4.$set(button4_changes);
      const button5_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button5_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button5.$set(button5_changes);
      const button6_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button6_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button6.$set(button6_changes);
      const button7_changes = {};

      if (dirty &
      /*$$scope*/
      1) {
        button7_changes.$$scope = {
          dirty,
          ctx
        };
      }

      button7.$set(button7_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      transition_in(button2.$$.fragment, local);
      transition_in(button3.$$.fragment, local);
      transition_in(propstable.$$.fragment, local);
      transition_in(button4.$$.fragment, local);
      transition_in(button5.$$.fragment, local);
      transition_in(button6.$$.fragment, local);
      transition_in(button7.$$.fragment, local);
      transition_in(button8.$$.fragment, local);
      transition_in(button9.$$.fragment, local);
      transition_in(code.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      transition_out(button2.$$.fragment, local);
      transition_out(button3.$$.fragment, local);
      transition_out(propstable.$$.fragment, local);
      transition_out(button4.$$.fragment, local);
      transition_out(button5.$$.fragment, local);
      transition_out(button6.$$.fragment, local);
      transition_out(button7.$$.fragment, local);
      transition_out(button8.$$.fragment, local);
      transition_out(button9.$$.fragment, local);
      transition_out(code.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(blockquote);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(h60);
      if (detaching) detach_dev(t3);
      if (detaching) detach_dev(div0);
      destroy_component(button0);
      if (detaching) detach_dev(t4);
      if (detaching) detach_dev(h61);
      if (detaching) detach_dev(t6);
      if (detaching) detach_dev(div1);
      destroy_component(button1);
      if (detaching) detach_dev(t7);
      if (detaching) detach_dev(h62);
      if (detaching) detach_dev(t9);
      if (detaching) detach_dev(div2);
      destroy_component(button2);
      if (detaching) detach_dev(t10);
      if (detaching) detach_dev(h63);
      if (detaching) detach_dev(t12);
      if (detaching) detach_dev(div3);
      destroy_component(button3);
      if (detaching) detach_dev(t13);
      destroy_component(propstable, detaching);
      if (detaching) detach_dev(t14);
      if (detaching) detach_dev(h64);
      if (detaching) detach_dev(t16);
      if (detaching) detach_dev(div4);
      destroy_component(button4);
      if (detaching) detach_dev(t17);
      if (detaching) detach_dev(h65);
      if (detaching) detach_dev(t19);
      if (detaching) detach_dev(div5);
      destroy_component(button5);
      if (detaching) detach_dev(t20);
      if (detaching) detach_dev(h66);
      if (detaching) detach_dev(t22);
      if (detaching) detach_dev(div6);
      destroy_component(button6);
      if (detaching) detach_dev(t23);
      if (detaching) detach_dev(h67);
      if (detaching) detach_dev(t25);
      if (detaching) detach_dev(div7);
      destroy_component(button7);
      if (detaching) detach_dev(t26);
      if (detaching) detach_dev(h68);
      if (detaching) detach_dev(t29);
      if (detaching) detach_dev(div8);
      destroy_component(button8);
      if (detaching) detach_dev(t30);
      if (detaching) detach_dev(h69);
      if (detaching) detach_dev(t32);
      if (detaching) detach_dev(div9);
      destroy_component(button9);
      if (detaching) detach_dev(t33);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Buttons> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Buttons", $$slots, []);

  $$self.$capture_state = () => ({
    Button,
    Icon,
    Code,
    PropsTable,
    buttons
  });

  return [];
}

class Buttons extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Buttons",
      options,
      id: create_fragment.name
    });
  }

}

export default Buttons;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9ucy5mODVmNTUwOC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9jb21wb25lbnRzL2J1dHRvbnMuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBCdXR0b24gZnJvbSBcImNvbXBvbmVudHMvQnV0dG9uXCI7XG4gIGltcG9ydCBJY29uIGZyb20gXCJjb21wb25lbnRzL0ljb25cIjtcbiAgaW1wb3J0IENvZGUgZnJvbSBcImRvY3MvQ29kZS5zdmVsdGVcIjtcbiAgaW1wb3J0IFByb3BzVGFibGUgZnJvbSBcImRvY3MvUHJvcHNUYWJsZS5zdmVsdGVcIjtcblxuICBpbXBvcnQgYnV0dG9ucyBmcm9tIFwiZXhhbXBsZXMvYnV0dG9ucy50eHRcIjtcbjwvc2NyaXB0PlxuXG48YmxvY2txdW90ZVxuICBjbGFzcz1cInBsLTggbXQtMiBtYi0xMCBib3JkZXItbC04IGJvcmRlci1wcmltYXJ5LTMwMCB0ZXh0LWxnXCJcbiAgY2l0ZT1cImh0dHBzOi8vbWF0ZXJpYWwuaW8vY29tcG9uZW50cy9idXR0b25zL1wiPlxuICA8cD5CdXR0b25zIGFsbG93IHVzZXJzIHRvIHRha2UgYWN0aW9ucywgYW5kIG1ha2UgY2hvaWNlcywgd2l0aCBhIHNpbmdsZSB0YXAuPC9wPlxuPC9ibG9ja3F1b3RlPlxuXG48aDYgY2xhc3M9XCJtYi0zIG10LTZcIj5CYXNpYzwvaDY+XG48ZGl2IGNsYXNzPVwicHktMlwiPlxuICA8QnV0dG9uPkJ1dHRvbjwvQnV0dG9uPlxuPC9kaXY+XG5cbjxoNiBjbGFzcz1cIm1iLTMgbXQtNlwiPkxpZ2h0PC9oNj5cbjxkaXYgY2xhc3M9XCJweS0yXCI+XG4gIDxCdXR0b25cbiAgICBsaWdodFxuICA+QnV0dG9uPC9CdXR0b24+XG48L2Rpdj5cblxuPGg2IGNsYXNzPVwibWItMyBtdC02XCI+RGFyazwvaDY+XG48ZGl2IGNsYXNzPVwicHktMlwiPlxuICA8QnV0dG9uIGRhcms+QnV0dG9uPC9CdXR0b24+XG48L2Rpdj5cblxuPGg2IGNsYXNzPVwibWItMyBtdC02XCI+QmxvY2s8L2g2PlxuPGRpdiBjbGFzcz1cInB5LTJcIj5cbiAgPEJ1dHRvbiBjb2xvcj1cImFsZXJ0XCIgZGFyayBibG9jaz5CdXR0b248L0J1dHRvbj5cbjwvZGl2PlxuXG48UHJvcHNUYWJsZVxuICBkYXRhPXtbXG4gICAgeyBwcm9wOiBcInZhbHVlXCIsIGRlc2NyaXB0aW9uOiBcIkJvdW5kIGJvb2xlYW4gdmFsdWVcIiwgdHlwZTogXCJCb29sZWFuXCIsIGRlZmF1bHQ6IFwiZmFsc2VcIiB9LFxuICAgIHsgcHJvcDogXCJjb2xvclwiLCBkZXNjcmlwdGlvbjogXCJDb2xvciB2YXJpYW50LCBhY2NlcHRzIGFueSBvZiB0aGUgbWFpbiBjb2xvcnMgZGVzY3JpYmVkIGluIFRhaWx3aW5kIGNvbmZpZ1wiLCB0eXBlOiBcIlN0cmluZ1wiLCBkZWZhdWx0OiBcInByaW1hcnlcIiB9LFxuICAgIHsgcHJvcDogXCJvdXRsaW5lZFwiLCBkZXNjcmlwdGlvbjogXCJPdXRsaW5lZCB2YXJpYW50XCIsIHR5cGU6IFwiQm9vbGVhblwiLCBkZWZhdWx0OiBcImZhbHNlXCIgfSxcbiAgICB7IHByb3A6IFwidGV4dFwiLCBkZXNjcmlwdGlvbjogXCJUZXh0IGJ1dHRvbiB2YXJpYW50ICh0cmFuc3BhcmVudCBiYWNrZ3JvdW5kKVwiLCB0eXBlOiBcIkJvb2xlYW5cIiwgZGVmYXVsdDogXCJmYWxzZVwiIH0sXG4gICAgeyBwcm9wOiBcImJsb2NrXCIsIGRlc2NyaXB0aW9uOiBcIkZ1bGwgYmxvY2sgd2lkdGggYnV0dG9uXCIsIHR5cGU6IFwiQm9vbGVhblwiLCBkZWZhdWx0OiBcImZhbHNlXCIgfSxcbiAgICB7IHByb3A6IFwiZGlzYWJsZWRcIiwgZGVzY3JpcHRpb246IFwiRGlzYWJsZWQgc3RhdGVcIiwgdHlwZTogXCJCb29sZWFuXCIsIGRlZmF1bHQ6IFwiZmFsc2VcIiB9LFxuICAgIHsgcHJvcDogXCJpY29uXCIsIGRlc2NyaXB0aW9uOiBcIkljb24gYnV0dG9uIHZhcmlhbnRcIiwgdHlwZTogXCJTdHJpbmdcIiwgZGVmYXVsdDogXCJudWxsXCIgfSxcbiAgICB7IHByb3A6IFwic21hbGxcIiwgZGVzY3JpcHRpb246IFwiU21hbGxlciBzaXplXCIsIHR5cGU6IFwiQm9vbGVhblwiLCBkZWZhdWx0OiBcImZhbHNlXCIgfSxcbiAgICB7IHByb3A6IFwibGlnaHRcIiwgZGVzY3JpcHRpb246IFwiTGlnaHRlciB2YXJpYW50XCIsIHR5cGU6IFwiQm9vbGVhblwiLCBkZWZhdWx0OiBcImZhbHNlXCIgfSxcbiAgICB7IHByb3A6IFwiZGFya1wiLCBkZXNjcmlwdGlvbjogXCJEYXJrZXIgdmFyaWFudFwiLCB0eXBlOiBcIkJvb2xlYW5cIiwgZGVmYXVsdDogXCJmYWxzZVwiIH0sXG4gICAgeyBwcm9wOiBcImZsYXRcIiwgZGVzY3JpcHRpb246IFwiRmxhdCB2YXJpYW50XCIsIHR5cGU6IFwiQm9vbGVhblwiLCBkZWZhdWx0OiBcImZhbHNlXCIgfSxcbiAgICB7IHByb3A6IFwiaWNvbkNsYXNzXCIsIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgY2xhc3NlcyB0byBwYXNzIGRvd24gdG8gaWNvblwiLCB0eXBlOiBcIlN0cmluZ1wiLCBkZWZhdWx0OiBcImVtcHR5IHN0cmluZ1wiIH0sXG4gICAgeyBwcm9wOiBcImhyZWZcIiwgZGVzY3JpcHRpb246IFwiTGluayBVUkxcIiwgdHlwZTogXCJTdHJpbmdcIiwgZGVmYXVsdDogXCJudWxsXCIgfSxcbiAgICB7IHByb3A6IFwiYWRkXCIsIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgY2xhc3NlcyB0byBhZGQgdG8gdGhlIGNvbXBvbmVudFwiLCB0eXBlOiBcIlN0cmluZ1wiLCBkZWZhdWx0OiBcImVtcHR5IHN0cmluZ1wiIH0sXG4gICAgeyBwcm9wOiBcInJlbW92ZVwiLCBkZXNjcmlwdGlvbjogXCJMaXN0IG9mIGNsYXNzZXMgdG8gcmVtb3ZlIGZyb20gdGhlIGNvbXBvbmVudFwiLCB0eXBlOiBcIlN0cmluZ1wiLCBkZWZhdWx0OiBcImVtcHR5IHN0cmluZ1wiIH0sXG4gICAgeyBwcm9wOiBcInJlcGxhY2VcIiwgZGVzY3JpcHRpb246IFwiTGlzdCBvZiBjbGFzc2VzIHRvIHJlcGxhY2UgaW4gdGhlIGNvbXBvbmVudFwiLCB0eXBlOiBcIk9iamVjdFwiLCBkZWZhdWx0OiBcInt9XCIgfSxcbiAgXX1cbi8+XG5cbjxoNiBjbGFzcz1cIm1iLTMgbXQtNlwiPk91dGxpbmVkPC9oNj5cbjxkaXYgY2xhc3M9XCJweS0yXCI+XG4gIDxCdXR0b24gY29sb3I9XCJzZWNvbmRhcnlcIiBsaWdodCBibG9jayBvdXRsaW5lZD5CdXR0b248L0J1dHRvbj5cbjwvZGl2PlxuXG48aDYgY2xhc3M9XCJtYi0zIG10LTZcIj5BcyBhbmNob3I8L2g2PlxuPGRpdiBjbGFzcz1cInB5LTJcIj5cbiAgPEJ1dHRvblxuICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICBsaWdodFxuICAgIGJsb2NrXG4gICAgb3V0bGluZWRcbiAgPkJ1dHRvbjwvQnV0dG9uPlxuPC9kaXY+XG5cbjxoNiBjbGFzcz1cIm1iLTMgbXQtNlwiPlRleHQ8L2g2PlxuPGRpdiBjbGFzcz1cInB5LTJcIj5cbiAgPEJ1dHRvbiB0ZXh0PkJ1dHRvbjwvQnV0dG9uPlxuPC9kaXY+XG5cbjxoNiBjbGFzcz1cIm1iLTMgbXQtNlwiPkRpc2FibGVkPC9oNj5cbjxkaXYgY2xhc3M9XCJweS0yXCI+XG4gIDxCdXR0b24gYmxvY2sgZGlzYWJsZWQ+QnV0dG9uPC9CdXR0b24+XG48L2Rpdj5cblxuPGg2IGNsYXNzPVwibWItMyBtdC02XCI+RkFCIDxhIGNsYXNzPVwiYVwiIGhyZWY9XCJodHRwczovL21hdGVyaWFsLmlvL2NvbXBvbmVudHMvYnV0dG9ucy1mbG9hdGluZy1hY3Rpb24tYnV0dG9uL1wiPihGbG9hdGluZyBhY3Rpb24gYnV0dG9uKTwvYT48L2g2PlxuPGRpdiBjbGFzcz1cInB5LTJcIj5cbiAgPEJ1dHRvbiBjb2xvcj1cImFsZXJ0XCIgaWNvbj1cImNoYW5nZV9oaXN0b3J5XCIgLz5cbjwvZGl2PlxuXG48aDYgY2xhc3M9XCJtYi0zIG10LTZcIj5GYWIgZmxhdDwvaDY+XG48ZGl2IGNsYXNzPVwicHktMlwiPlxuICA8QnV0dG9uIGNvbG9yPVwiZXJyb3JcIiBpY29uPVwiY2hhbmdlX2hpc3RvcnlcIiB0ZXh0IGxpZ2h0IGZsYXQgLz5cbjwvZGl2PlxuXG48Q29kZSBjb2RlPXtidXR0b25zfSAvPiJdLCJuYW1lcyI6WyJwcm9wIiwiZGVzY3JpcHRpb24iLCJ0eXBlIiwiZGVmYXVsdCIsImJ1dHRvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNNQSxRQUFBQSxJQUFJLEVBQUU7QUFBU0MsUUFBQUEsV0FBVyxFQUFFO0FBQXVCQyxRQUFBQSxJQUFJLEVBQUU7QUFBV0MsUUFBQUEsT0FBTyxFQUFFOztBQUM3RUgsUUFBQUEsSUFBSSxFQUFFO0FBQVNDLFFBQUFBLFdBQVcsRUFBRTtBQUE4RUMsUUFBQUEsSUFBSSxFQUFFO0FBQVVDLFFBQUFBLE9BQU8sRUFBRTs7QUFDbklILFFBQUFBLElBQUksRUFBRTtBQUFZQyxRQUFBQSxXQUFXLEVBQUU7QUFBb0JDLFFBQUFBLElBQUksRUFBRTtBQUFXQyxRQUFBQSxPQUFPLEVBQUU7O0FBQzdFSCxRQUFBQSxJQUFJLEVBQUU7QUFBUUMsUUFBQUEsV0FBVyxFQUFFO0FBQWdEQyxRQUFBQSxJQUFJLEVBQUU7QUFBV0MsUUFBQUEsT0FBTyxFQUFFOztBQUNyR0gsUUFBQUEsSUFBSSxFQUFFO0FBQVNDLFFBQUFBLFdBQVcsRUFBRTtBQUEyQkMsUUFBQUEsSUFBSSxFQUFFO0FBQVdDLFFBQUFBLE9BQU8sRUFBRTs7QUFDakZILFFBQUFBLElBQUksRUFBRTtBQUFZQyxRQUFBQSxXQUFXLEVBQUU7QUFBa0JDLFFBQUFBLElBQUksRUFBRTtBQUFXQyxRQUFBQSxPQUFPLEVBQUU7O0FBQzNFSCxRQUFBQSxJQUFJLEVBQUU7QUFBUUMsUUFBQUEsV0FBVyxFQUFFO0FBQXVCQyxRQUFBQSxJQUFJLEVBQUU7QUFBVUMsUUFBQUEsT0FBTyxFQUFFOztBQUMzRUgsUUFBQUEsSUFBSSxFQUFFO0FBQVNDLFFBQUFBLFdBQVcsRUFBRTtBQUFnQkMsUUFBQUEsSUFBSSxFQUFFO0FBQVdDLFFBQUFBLE9BQU8sRUFBRTs7QUFDdEVILFFBQUFBLElBQUksRUFBRTtBQUFTQyxRQUFBQSxXQUFXLEVBQUU7QUFBbUJDLFFBQUFBLElBQUksRUFBRTtBQUFXQyxRQUFBQSxPQUFPLEVBQUU7O0FBQ3pFSCxRQUFBQSxJQUFJLEVBQUU7QUFBUUMsUUFBQUEsV0FBVyxFQUFFO0FBQWtCQyxRQUFBQSxJQUFJLEVBQUU7QUFBV0MsUUFBQUEsT0FBTyxFQUFFOztBQUN2RUgsUUFBQUEsSUFBSSxFQUFFO0FBQVFDLFFBQUFBLFdBQVcsRUFBRTtBQUFnQkMsUUFBQUEsSUFBSSxFQUFFO0FBQVdDLFFBQUFBLE9BQU8sRUFBRTs7QUFDckVILFFBQUFBLElBQUksRUFBRTtBQUFhQyxRQUFBQSxXQUFXLEVBQUU7QUFBd0NDLFFBQUFBLElBQUksRUFBRTtBQUFVQyxRQUFBQSxPQUFPLEVBQUU7O0FBQ2pHSCxRQUFBQSxJQUFJLEVBQUU7QUFBUUMsUUFBQUEsV0FBVyxFQUFFO0FBQVlDLFFBQUFBLElBQUksRUFBRTtBQUFVQyxRQUFBQSxPQUFPLEVBQUU7O0FBQ2hFSCxRQUFBQSxJQUFJLEVBQUU7QUFBT0MsUUFBQUEsV0FBVyxFQUFFO0FBQTJDQyxRQUFBQSxJQUFJLEVBQUU7QUFBVUMsUUFBQUEsT0FBTyxFQUFFOztBQUM5RkgsUUFBQUEsSUFBSSxFQUFFO0FBQVVDLFFBQUFBLFdBQVcsRUFBRTtBQUFnREMsUUFBQUEsSUFBSSxFQUFFO0FBQVVDLFFBQUFBLE9BQU8sRUFBRTs7QUFDdEdILFFBQUFBLElBQUksRUFBRTtBQUFXQyxRQUFBQSxXQUFXLEVBQUU7QUFBK0NDLFFBQUFBLElBQUksRUFBRTtBQUFVQyxRQUFBQSxPQUFPLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUF1Q2hHQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
