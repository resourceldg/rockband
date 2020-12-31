import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, G as ClassBuilder, v as validate_slots, F as assign, H as exclude_internal_props, e as element, k as space, t as text, c as claim_element, a as children, b as detach_dev, m as claim_space, l as claim_text, g as attr_dev, a9 as toggle_class, f as add_location, h as insert_dev, j as append_dev, z as set_data_dev, n as noop } from './client.380c418c.js';
import { C as Card$1 } from './Card.d27967c8.js';

/* src/components/Card/Title.svelte generated by Svelte v3.24.0 */
const file = "src/components/Card/Title.svelte";

function create_fragment(ctx) {
  let div4;
  let div0;
  let img;
  let img_src_value;
  let t0;
  let div3;
  let div1;
  let t1;
  let t2;
  let div2;
  let t3;
  const block = {
    c: function create() {
      div4 = element("div");
      div0 = element("div");
      img = element("img");
      t0 = space();
      div3 = element("div");
      div1 = element("div");
      t1 = text(
      /*title*/
      ctx[0]);
      t2 = space();
      div2 = element("div");
      t3 = text(
      /*subheader*/
      ctx[1]);
      this.h();
    },
    l: function claim(nodes) {
      div4 = claim_element(nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      div0 = claim_element(div4_nodes, "DIV", {});
      var div0_nodes = children(div0);
      img = claim_element(div0_nodes, "IMG", {
        class: true,
        width: true,
        height: true,
        src: true,
        alt: true
      });
      div0_nodes.forEach(detach_dev);
      t0 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      div1 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t1 = claim_text(div1_nodes,
      /*title*/
      ctx[0]);
      div1_nodes.forEach(detach_dev);
      t2 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      t3 = claim_text(div2_nodes,
      /*subheader*/
      ctx[1]);
      div2_nodes.forEach(detach_dev);
      div3_nodes.forEach(detach_dev);
      div4_nodes.forEach(detach_dev);
      this.h();
    },
    h: function hydrate() {
      attr_dev(img, "class", "rounded-full");
      attr_dev(img, "width", "44");
      attr_dev(img, "height", "44");
      if (img.src !== (img_src_value =
      /*avatar*/
      ctx[2])) attr_dev(img, "src", img_src_value);
      attr_dev(img, "alt", "avatar");
      toggle_class(img, "hidden", !
      /*avatar*/
      ctx[2]);
      add_location(img, file, 24, 4, 472);
      add_location(div0, file, 23, 2, 462);
      attr_dev(div1, "class", "font-medium text-lg");
      toggle_class(div1, "hidden", !
      /*title*/
      ctx[0]);
      add_location(div1, file, 33, 4, 648);
      attr_dev(div2, "class", "text-sm text-gray-600 pt-0");
      toggle_class(div2, "hidden", !
      /*subheader*/
      ctx[1]);
      add_location(div2, file, 34, 4, 721);
      attr_dev(div3, "class", "pl-4 py-2");
      add_location(div3, file, 32, 2, 620);
      attr_dev(div4, "class",
      /*c*/
      ctx[3]);
      add_location(div4, file, 22, 0, 444);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div4, anchor);
      append_dev(div4, div0);
      append_dev(div0, img);
      append_dev(div4, t0);
      append_dev(div4, div3);
      append_dev(div3, div1);
      append_dev(div1, t1);
      append_dev(div3, t2);
      append_dev(div3, div2);
      append_dev(div2, t3);
    },
    p: function update(ctx, [dirty]) {
      if (dirty &
      /*avatar*/
      4 && img.src !== (img_src_value =
      /*avatar*/
      ctx[2])) {
        attr_dev(img, "src", img_src_value);
      }

      if (dirty &
      /*avatar*/
      4) {
        toggle_class(img, "hidden", !
        /*avatar*/
        ctx[2]);
      }

      if (dirty &
      /*title*/
      1) set_data_dev(t1,
      /*title*/
      ctx[0]);

      if (dirty &
      /*title*/
      1) {
        toggle_class(div1, "hidden", !
        /*title*/
        ctx[0]);
      }

      if (dirty &
      /*subheader*/
      2) set_data_dev(t3,
      /*subheader*/
      ctx[1]);

      if (dirty &
      /*subheader*/
      2) {
        toggle_class(div2, "hidden", !
        /*subheader*/
        ctx[1]);
      }

      if (dirty &
      /*c*/
      8) {
        attr_dev(div4, "class",
        /*c*/
        ctx[3]);
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div4);
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

const classesDefault = "flex px-4 py-2 items-center";

function instance($$self, $$props, $$invalidate) {
  const hover = true;
  let {
    title = ""
  } = $$props;
  let {
    subheader = ""
  } = $$props;
  let {
    avatar = ""
  } = $$props;
  let {
    classes = classesDefault
  } = $$props;
  const cb = new ClassBuilder(classes, classesDefault);
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("Title", $$slots, []);

  $$self.$set = $$new_props => {
    $$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("title" in $$new_props) $$invalidate(0, title = $$new_props.title);
    if ("subheader" in $$new_props) $$invalidate(1, subheader = $$new_props.subheader);
    if ("avatar" in $$new_props) $$invalidate(2, avatar = $$new_props.avatar);
    if ("classes" in $$new_props) $$invalidate(5, classes = $$new_props.classes);
  };

  $$self.$capture_state = () => ({
    ClassBuilder,
    hover,
    title,
    subheader,
    avatar,
    classesDefault,
    classes,
    cb,
    c
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    if ("title" in $$props) $$invalidate(0, title = $$new_props.title);
    if ("subheader" in $$props) $$invalidate(1, subheader = $$new_props.subheader);
    if ("avatar" in $$props) $$invalidate(2, avatar = $$new_props.avatar);
    if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
    if ("c" in $$props) $$invalidate(3, c = $$new_props.c);
  };

  let c;

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$self.$$.update = () => {
     $$invalidate(3, c = cb.flush().add(classes, true, classesDefault).add($$props.class).get());
  };

  $$props = exclude_internal_props($$props);
  return [title, subheader, avatar, c, hover, classes];
}

class Title extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {
      hover: 4,
      title: 0,
      subheader: 1,
      avatar: 2,
      classes: 5
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Title",
      options,
      id: create_fragment.name
    });
  }

  get hover() {
    return this.$$.ctx[4];
  }

  set hover(value) {
    throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get title() {
    throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set title(value) {
    throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get subheader() {
    throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set subheader(value) {
    throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get avatar() {
    throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set avatar(value) {
    throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get classes() {
    throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set classes(value) {
    throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

var Card = {
  Card: Card$1,
  Title
};

export { Card as C };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguOWM5ZWYyZmUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NhcmQvVGl0bGUuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQ2FyZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyBDbGFzc0J1aWxkZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuXG4gIGV4cG9ydCBjb25zdCBob3ZlciA9IHRydWU7XG4gIGV4cG9ydCBsZXQgdGl0bGUgPSBcIlwiO1xuICBleHBvcnQgbGV0IHN1YmhlYWRlciA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgYXZhdGFyID0gXCJcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwiZmxleCBweC00IHB5LTIgaXRlbXMtY2VudGVyXCI7XG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG5cblxuICBjb25zdCBjYiA9IG5ldyBDbGFzc0J1aWxkZXIoY2xhc3NlcywgY2xhc3Nlc0RlZmF1bHQpO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9e2N9PlxuICA8ZGl2PlxuICAgIDxpbWdcbiAgICAgIGNsYXNzPVwicm91bmRlZC1mdWxsXCJcbiAgICAgIHdpZHRoPVwiNDRcIlxuICAgICAgaGVpZ2h0PVwiNDRcIlxuICAgICAgc3JjPXthdmF0YXJ9XG4gICAgICBhbHQ9XCJhdmF0YXJcIlxuICAgICAgY2xhc3M6aGlkZGVuPXshYXZhdGFyfSAvPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInBsLTQgcHktMlwiPlxuICAgIDxkaXYgY2xhc3M6aGlkZGVuPXshdGl0bGV9IGNsYXNzPVwiZm9udC1tZWRpdW0gdGV4dC1sZ1wiPnt0aXRsZX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwidGV4dC1zbSB0ZXh0LWdyYXktNjAwIHB0LTBcIiBjbGFzczpoaWRkZW49eyFzdWJoZWFkZXJ9PlxuICAgICAge3N1YmhlYWRlcn1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiIsImltcG9ydCBDYXJkIGZyb20gXCIuL0NhcmQuc3ZlbHRlXCI7XG5pbXBvcnQgVGl0bGUgZnJvbSBcIi4vVGl0bGUuc3ZlbHRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQ2FyZCxcbiAgVGl0bGVcbn07XG4iXSwibmFtZXMiOlsiY3R4IiwiY2xhc3Nlc0RlZmF1bHQiLCJob3ZlciIsInRpdGxlIiwic3ViaGVhZGVyIiwiYXZhdGFyIiwiY2xhc3NlcyIsImNiIiwiQ2xhc3NCdWlsZGVyIiwiJCIsImMiLCJmbHVzaCIsImFkZCIsIiQkcHJvcHMiLCJjbGFzcyIsImdldCIsIkNhcmQiLCJUaXRsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlDNERBLE1BQUFBLEdBQUssRUFBQTs7Ozs7QUFFMURBLE1BQUFBLEdBQVMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGNENBLE1BQUFBLEdBQUssRUFBQTs7Ozs7Ozs7O0FBRTFEQSxNQUFBQSxHQUFTLEVBQUE7Ozs7Ozs7Ozs7OztBQVBMQSxNQUFBQSxHQUFNLEVBQUE7Ozs7QUFFSUEsTUFBQUEsR0FBTSxFQUFBOzs7Ozs7QUFHSEEsTUFBQUEsR0FBSyxFQUFBOzs7OztBQUM4QkEsTUFBQUEsR0FBUyxFQUFBOzs7Ozs7QUFaeERBLE1BQUFBLEdBQUMsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNRkEsTUFBQUEsR0FBTSxFQUFBOzs7Ozs7Ozs7QUFFSUEsUUFBQUEsR0FBTSxFQUFBOzs7Ozs7O0FBR2lDQSxNQUFBQSxHQUFLLEVBQUE7Ozs7Ozs7QUFBekNBLFFBQUFBLEdBQUssRUFBQTs7Ozs7OztBQUV0QkEsTUFBQUEsR0FBUyxFQUFBOzs7Ozs7O0FBRDJDQSxRQUFBQSxHQUFTLEVBQUE7Ozs7Ozs7O0FBWnhEQSxRQUFBQSxHQUFDLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFkTEMsY0FBYyxHQUFHOzs7UUFMVkMsS0FBSyxHQUFHOztBQUNWQyxJQUFBQSxLQUFLLEdBQUc7OztBQUNSQyxJQUFBQSxTQUFTLEdBQUc7OztBQUNaQyxJQUFBQSxNQUFNLEdBQUc7OztBQUdUQyxJQUFBQSxPQUFPLEdBQUdMOztRQUlmTSxFQUFFLE9BQU9DLGFBQWFGLFNBQVNMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRXJDUSxxQkFBR0MsQ0FBQyxHQUFHSCxFQUFFLENBQ05JLEtBREksR0FFSkMsR0FGSSxDQUVBTixPQUZBLEVBRVMsSUFGVCxFQUVlTCxjQUZmLEVBR0pXLEdBSEksQ0FHQUMsT0FBTyxDQUFDQyxLQUhSLEVBSUpDLEdBSkk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaVCxXQUFlO0FBQ2JDLFFBQUFBLE1BRGE7QUFFYkMsRUFBQUE7QUFGYSxDQUFmOzs7OyJ9
