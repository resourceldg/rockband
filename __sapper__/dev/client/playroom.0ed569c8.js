import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, v as validate_slots, e as element, H as text, f as space, g as claim_element, h as children, J as claim_text, j as detach_dev, k as claim_space, m as add_location, l as attr_dev, n as insert_dev, a as append_dev, D as noop } from './client.ed6385ef.js';

/* src/routes/playroom.svelte generated by Svelte v3.24.0 */
const file = "src/routes/playroom.svelte";

function create_fragment(ctx) {
  let h3;
  let t0;
  let t1;
  let div3;
  let div0;
  let img0;
  let img0_src_value;
  let t2;
  let div1;
  let t3;
  let t4;
  let div2;
  let img1;
  let img1_src_value;
  let t5;
  let div7;
  let div4;
  let img2;
  let img2_src_value;
  let t6;
  let div5;
  let t7;
  let t8;
  let div6;
  let img3;
  let img3_src_value;
  let t9;
  let div11;
  let div8;
  let img4;
  let img4_src_value;
  let t10;
  let div9;
  let t11;
  let t12;
  let div10;
  let img5;
  let img5_src_value;
  let t13;
  let div15;
  let div12;
  let img6;
  let img6_src_value;
  let t14;
  let div13;
  let t15;
  let t16;
  let div14;
  let img7;
  let img7_src_value;
  let t17;
  let div19;
  let div16;
  let img8;
  let img8_src_value;
  let t18;
  let div17;
  let t19;
  let t20;
  let div18;
  let img9;
  let img9_src_value;
  const block = {
    c: function create() {
      h3 = element("h3");
      t0 = text("Escuchar trucks...");
      t1 = space();
      div3 = element("div");
      div0 = element("div");
      img0 = element("img");
      t2 = space();
      div1 = element("div");
      t3 = text("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      t4 = space();
      div2 = element("div");
      img1 = element("img");
      t5 = space();
      div7 = element("div");
      div4 = element("div");
      img2 = element("img");
      t6 = space();
      div5 = element("div");
      t7 = text("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      t8 = space();
      div6 = element("div");
      img3 = element("img");
      t9 = space();
      div11 = element("div");
      div8 = element("div");
      img4 = element("img");
      t10 = space();
      div9 = element("div");
      t11 = text("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      t12 = space();
      div10 = element("div");
      img5 = element("img");
      t13 = space();
      div15 = element("div");
      div12 = element("div");
      img6 = element("img");
      t14 = space();
      div13 = element("div");
      t15 = text("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      t16 = space();
      div14 = element("div");
      img7 = element("img");
      t17 = space();
      div19 = element("div");
      div16 = element("div");
      img8 = element("img");
      t18 = space();
      div17 = element("div");
      t19 = text("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      t20 = space();
      div18 = element("div");
      img9 = element("img");
      this.h();
    },
    l: function claim(nodes) {
      h3 = claim_element(nodes, "H3", {});
      var h3_nodes = children(h3);
      t0 = claim_text(h3_nodes, "Escuchar trucks...");
      h3_nodes.forEach(detach_dev);
      t1 = claim_space(nodes);
      div3 = claim_element(nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      div0 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      img0 = claim_element(div0_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div0_nodes.forEach(detach_dev);
      t2 = claim_space(div3_nodes);
      div1 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t3 = claim_text(div1_nodes, "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      div1_nodes.forEach(detach_dev);
      t4 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      img1 = claim_element(div2_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div2_nodes.forEach(detach_dev);
      div3_nodes.forEach(detach_dev);
      t5 = claim_space(nodes);
      div7 = claim_element(nodes, "DIV", {
        class: true
      });
      var div7_nodes = children(div7);
      div4 = claim_element(div7_nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      img2 = claim_element(div4_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div4_nodes.forEach(detach_dev);
      t6 = claim_space(div7_nodes);
      div5 = claim_element(div7_nodes, "DIV", {
        class: true
      });
      var div5_nodes = children(div5);
      t7 = claim_text(div5_nodes, "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      div5_nodes.forEach(detach_dev);
      t8 = claim_space(div7_nodes);
      div6 = claim_element(div7_nodes, "DIV", {
        class: true
      });
      var div6_nodes = children(div6);
      img3 = claim_element(div6_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div6_nodes.forEach(detach_dev);
      div7_nodes.forEach(detach_dev);
      t9 = claim_space(nodes);
      div11 = claim_element(nodes, "DIV", {
        class: true
      });
      var div11_nodes = children(div11);
      div8 = claim_element(div11_nodes, "DIV", {
        class: true
      });
      var div8_nodes = children(div8);
      img4 = claim_element(div8_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div8_nodes.forEach(detach_dev);
      t10 = claim_space(div11_nodes);
      div9 = claim_element(div11_nodes, "DIV", {
        class: true
      });
      var div9_nodes = children(div9);
      t11 = claim_text(div9_nodes, "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      div9_nodes.forEach(detach_dev);
      t12 = claim_space(div11_nodes);
      div10 = claim_element(div11_nodes, "DIV", {
        class: true
      });
      var div10_nodes = children(div10);
      img5 = claim_element(div10_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div10_nodes.forEach(detach_dev);
      div11_nodes.forEach(detach_dev);
      t13 = claim_space(nodes);
      div15 = claim_element(nodes, "DIV", {
        class: true
      });
      var div15_nodes = children(div15);
      div12 = claim_element(div15_nodes, "DIV", {
        class: true
      });
      var div12_nodes = children(div12);
      img6 = claim_element(div12_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div12_nodes.forEach(detach_dev);
      t14 = claim_space(div15_nodes);
      div13 = claim_element(div15_nodes, "DIV", {
        class: true
      });
      var div13_nodes = children(div13);
      t15 = claim_text(div13_nodes, "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      div13_nodes.forEach(detach_dev);
      t16 = claim_space(div15_nodes);
      div14 = claim_element(div15_nodes, "DIV", {
        class: true
      });
      var div14_nodes = children(div14);
      img7 = claim_element(div14_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div14_nodes.forEach(detach_dev);
      div15_nodes.forEach(detach_dev);
      t17 = claim_space(nodes);
      div19 = claim_element(nodes, "DIV", {
        class: true
      });
      var div19_nodes = children(div19);
      div16 = claim_element(div19_nodes, "DIV", {
        class: true
      });
      var div16_nodes = children(div16);
      img8 = claim_element(div16_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div16_nodes.forEach(detach_dev);
      t18 = claim_space(div19_nodes);
      div17 = claim_element(div19_nodes, "DIV", {
        class: true
      });
      var div17_nodes = children(div17);
      t19 = claim_text(div17_nodes, "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum");
      div17_nodes.forEach(detach_dev);
      t20 = claim_space(div19_nodes);
      div18 = claim_element(div19_nodes, "DIV", {
        class: true
      });
      var div18_nodes = children(div18);
      img9 = claim_element(div18_nodes, "IMG", {
        src: true,
        alt: true,
        width: true,
        height: true
      });
      div18_nodes.forEach(detach_dev);
      div19_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      add_location(h3, file, 3, 0, 22);
      if (img0.src !== (img0_src_value = "disc.jpg ")) attr_dev(img0, "src", img0_src_value);
      attr_dev(img0, "alt", "disc");
      attr_dev(img0, "width", "70");
      attr_dev(img0, "height", "70");
      add_location(img0, file, 6, 42, 190);
      attr_dev(div0, "class", "grid justify-self-start");
      add_location(div0, file, 6, 4, 152);
      attr_dev(div1, "class", "grid col-span-2 justify-self-center");
      add_location(div1, file, 7, 4, 256);
      if (img1.src !== (img1_src_value = "icon.svg")) attr_dev(img1, "src", img1_src_value);
      attr_dev(img1, "alt", "play icon");
      attr_dev(img1, "width", "30");
      attr_dev(img1, "height", "30");
      add_location(img1, file, 8, 42, 421);
      attr_dev(div2, "class", "grid sm:justify-self-end");
      add_location(div2, file, 8, 4, 383);
      attr_dev(div3, "class", "grid md:grid-cols-4 gap-4 rounded-bl place-items-center  shadow-lg p-4 mt-10 mb-10");
      add_location(div3, file, 5, 0, 51);
      if (img2.src !== (img2_src_value = "disc.jpg ")) attr_dev(img2, "src", img2_src_value);
      attr_dev(img2, "alt", "disc");
      attr_dev(img2, "width", "70");
      attr_dev(img2, "height", "70");
      add_location(img2, file, 11, 42, 633);
      attr_dev(div4, "class", "grid justify-self-start");
      add_location(div4, file, 11, 4, 595);
      attr_dev(div5, "class", "grid col-span-2 justify-self-center");
      add_location(div5, file, 12, 4, 699);
      if (img3.src !== (img3_src_value = "icon.svg")) attr_dev(img3, "src", img3_src_value);
      attr_dev(img3, "alt", "play icon");
      attr_dev(img3, "width", "30");
      attr_dev(img3, "height", "30");
      add_location(img3, file, 13, 42, 864);
      attr_dev(div6, "class", "grid sm:justify-self-end");
      add_location(div6, file, 13, 4, 826);
      attr_dev(div7, "class", "grid md:grid-cols-4 gap-4 rounded-bl place-items-center  shadow-lg p-4 mt-10 mb-10");
      add_location(div7, file, 10, 0, 494);
      if (img4.src !== (img4_src_value = "disc.jpg ")) attr_dev(img4, "src", img4_src_value);
      attr_dev(img4, "alt", "disc");
      attr_dev(img4, "width", "70");
      attr_dev(img4, "height", "70");
      add_location(img4, file, 16, 42, 1076);
      attr_dev(div8, "class", "grid justify-self-start");
      add_location(div8, file, 16, 4, 1038);
      attr_dev(div9, "class", "grid col-span-2 justify-self-center");
      add_location(div9, file, 17, 4, 1142);
      if (img5.src !== (img5_src_value = "icon.svg")) attr_dev(img5, "src", img5_src_value);
      attr_dev(img5, "alt", "play icon");
      attr_dev(img5, "width", "30");
      attr_dev(img5, "height", "30");
      add_location(img5, file, 18, 39, 1304);
      attr_dev(div10, "class", "grid justify-self-end");
      add_location(div10, file, 18, 4, 1269);
      attr_dev(div11, "class", "grid md:grid-cols-4 gap-4 rounded-bl place-items-center  shadow-lg p-4 mt-10 mb-10");
      add_location(div11, file, 15, 0, 937);
      if (img6.src !== (img6_src_value = "disc.jpg ")) attr_dev(img6, "src", img6_src_value);
      attr_dev(img6, "alt", "disc");
      attr_dev(img6, "width", "70");
      attr_dev(img6, "height", "70");
      add_location(img6, file, 21, 42, 1516);
      attr_dev(div12, "class", "grid justify-self-start");
      add_location(div12, file, 21, 4, 1478);
      attr_dev(div13, "class", "grid col-span-2 justify-self-center");
      add_location(div13, file, 22, 4, 1582);
      if (img7.src !== (img7_src_value = "icon.svg")) attr_dev(img7, "src", img7_src_value);
      attr_dev(img7, "alt", "play icon");
      attr_dev(img7, "width", "30");
      attr_dev(img7, "height", "30");
      add_location(img7, file, 23, 39, 1744);
      attr_dev(div14, "class", "grid justify-self-end");
      add_location(div14, file, 23, 4, 1709);
      attr_dev(div15, "class", "grid md:grid-cols-4 gap-4 rounded-bl place-items-center  shadow-lg p-4 mt-10 mb-10");
      add_location(div15, file, 20, 0, 1377);
      if (img8.src !== (img8_src_value = "disc.jpg ")) attr_dev(img8, "src", img8_src_value);
      attr_dev(img8, "alt", "disc");
      attr_dev(img8, "width", "70");
      attr_dev(img8, "height", "70");
      add_location(img8, file, 26, 42, 1956);
      attr_dev(div16, "class", "grid justify-self-start");
      add_location(div16, file, 26, 4, 1918);
      attr_dev(div17, "class", "grid col-span-2 justify-self-center");
      add_location(div17, file, 27, 4, 2022);
      if (img9.src !== (img9_src_value = "icon.svg")) attr_dev(img9, "src", img9_src_value);
      attr_dev(img9, "alt", "play icon");
      attr_dev(img9, "width", "30");
      attr_dev(img9, "height", "30");
      add_location(img9, file, 28, 39, 2184);
      attr_dev(div18, "class", "grid justify-self-end");
      add_location(div18, file, 28, 4, 2149);
      attr_dev(div19, "class", "grid md:grid-cols-4 gap-4 rounded-bl place-items-center  shadow-lg p-4 mt-10 mb-10");
      add_location(div19, file, 25, 0, 1817);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h3, anchor);
      append_dev(h3, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, div3, anchor);
      append_dev(div3, div0);
      append_dev(div0, img0);
      append_dev(div3, t2);
      append_dev(div3, div1);
      append_dev(div1, t3);
      append_dev(div3, t4);
      append_dev(div3, div2);
      append_dev(div2, img1);
      insert_dev(target, t5, anchor);
      insert_dev(target, div7, anchor);
      append_dev(div7, div4);
      append_dev(div4, img2);
      append_dev(div7, t6);
      append_dev(div7, div5);
      append_dev(div5, t7);
      append_dev(div7, t8);
      append_dev(div7, div6);
      append_dev(div6, img3);
      insert_dev(target, t9, anchor);
      insert_dev(target, div11, anchor);
      append_dev(div11, div8);
      append_dev(div8, img4);
      append_dev(div11, t10);
      append_dev(div11, div9);
      append_dev(div9, t11);
      append_dev(div11, t12);
      append_dev(div11, div10);
      append_dev(div10, img5);
      insert_dev(target, t13, anchor);
      insert_dev(target, div15, anchor);
      append_dev(div15, div12);
      append_dev(div12, img6);
      append_dev(div15, t14);
      append_dev(div15, div13);
      append_dev(div13, t15);
      append_dev(div15, t16);
      append_dev(div15, div14);
      append_dev(div14, img7);
      insert_dev(target, t17, anchor);
      insert_dev(target, div19, anchor);
      append_dev(div19, div16);
      append_dev(div16, img8);
      append_dev(div19, t18);
      append_dev(div19, div17);
      append_dev(div17, t19);
      append_dev(div19, t20);
      append_dev(div19, div18);
      append_dev(div18, img9);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(h3);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(div3);
      if (detaching) detach_dev(t5);
      if (detaching) detach_dev(div7);
      if (detaching) detach_dev(t9);
      if (detaching) detach_dev(div11);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(div15);
      if (detaching) detach_dev(t17);
      if (detaching) detach_dev(div19);
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
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Playroom> was created with unknown prop '${key}'`);
  });
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Playroom", $$slots, []);
  return [];
}

class Playroom extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Playroom",
      options,
      id: create_fragment.name
    });
  }

}

export default Playroom;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheXJvb20uMGVkNTY5YzguanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
