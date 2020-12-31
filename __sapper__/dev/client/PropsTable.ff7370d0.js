import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, F as assign, H as exclude_internal_props, o as create_component, p as claim_component, q as mount_component, r as transition_in, u as transition_out, w as destroy_component } from './client.b35f7c39.js';
import { D as DataTable } from './index.c7ecc63c.js';

/* src/docs/PropsTable.svelte generated by Svelte v3.24.0 */

function create_fragment(ctx) {
  let datatable;
  let current;
  datatable = new DataTable({
    props: {
      class:
      /*$$props*/
      ctx[2].class || classesDefault,
      editable: false,
      pagination: false,
      sortable: false,
      data:
      /*data*/
      ctx[0],
      columns:
      /*columns*/
      ctx[1]
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(datatable.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(datatable.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(datatable, target, anchor);
      current = true;
    },
    p: function update(ctx, [dirty]) {
      const datatable_changes = {};
      if (dirty &
      /*$$props*/
      4) datatable_changes.class =
      /*$$props*/
      ctx[2].class || classesDefault;
      if (dirty &
      /*data*/
      1) datatable_changes.data =
      /*data*/
      ctx[0];
      if (dirty &
      /*columns*/
      2) datatable_changes.columns =
      /*columns*/
      ctx[1];
      datatable.$set(datatable_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(datatable.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(datatable.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(datatable, detaching);
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

const classesDefault = "my-10 w-full";

function instance($$self, $$props, $$invalidate) {
  let {
    data = []
  } = $$props;
  let {
    columns = [{
      field: "prop"
    }, {
      field: "description"
    }, {
      field: "type",
      class: "text-xs text-gray-700 nowrap"
    }, {
      field: "default",
      label: "Default value",
      class: "text-xs text-gray-700"
    }]
  } = $$props;
  let {
    $$slots = {},
    $$scope
  } = $$props;
  validate_slots("PropsTable", $$slots, []);

  $$self.$set = $$new_props => {
    $$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("data" in $$new_props) $$invalidate(0, data = $$new_props.data);
    if ("columns" in $$new_props) $$invalidate(1, columns = $$new_props.columns);
  };

  $$self.$capture_state = () => ({
    DataTable,
    classesDefault,
    data,
    columns
  });

  $$self.$inject_state = $$new_props => {
    $$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
    if ("data" in $$props) $$invalidate(0, data = $$new_props.data);
    if ("columns" in $$props) $$invalidate(1, columns = $$new_props.columns);
  };

  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }

  $$props = exclude_internal_props($$props);
  return [data, columns, $$props];
}

class PropsTable extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {
      data: 0,
      columns: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "PropsTable",
      options,
      id: create_fragment.name
    });
  }

  get data() {
    throw new Error("<PropsTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set data(value) {
    throw new Error("<PropsTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  get columns() {
    throw new Error("<PropsTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

  set columns(value) {
    throw new Error("<PropsTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }

}

export { PropsTable as P };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvcHNUYWJsZS5mZjczNzBkMC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RvY3MvUHJvcHNUYWJsZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IERhdGFUYWJsZSBmcm9tIFwiLi4vY29tcG9uZW50cy9EYXRhVGFibGVcIjtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwibXktMTAgdy1mdWxsXCI7XG4gIGV4cG9ydCBsZXQgZGF0YSA9IFtdO1xuICBleHBvcnQgbGV0IGNvbHVtbnMgPSBbXG4gICAgeyBmaWVsZDogXCJwcm9wXCIgfSxcbiAgICB7IGZpZWxkOiBcImRlc2NyaXB0aW9uXCIgfSxcbiAgICB7IGZpZWxkOiBcInR5cGVcIiwgY2xhc3M6IFwidGV4dC14cyB0ZXh0LWdyYXktNzAwIG5vd3JhcFwiIH0sXG4gICAgeyBmaWVsZDogXCJkZWZhdWx0XCIsIGxhYmVsOiBcIkRlZmF1bHQgdmFsdWVcIiwgY2xhc3M6IFwidGV4dC14cyB0ZXh0LWdyYXktNzAwXCIgfVxuICBdO1xuPC9zY3JpcHQ+XG5cbjxEYXRhVGFibGVcbiAgY2xhc3M9eyQkcHJvcHMuY2xhc3MgfHwgY2xhc3Nlc0RlZmF1bHR9XG4gIGVkaXRhYmxlPXtmYWxzZX1cbiAgcGFnaW5hdGlvbj17ZmFsc2V9XG4gIHNvcnRhYmxlPXtmYWxzZX1cbiAge2RhdGF9XG4gIHtjb2x1bW5zfSAvPlxuIl0sIm5hbWVzIjpbImN0eCIsImNsYXNzIiwiY2xhc3Nlc0RlZmF1bHQiLCJkYXRhIiwiY29sdW1ucyIsImZpZWxkIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQWNTQSxNQUFBQSxHQUFPLEVBQUEsQ0FBUCxDQUFRQyxLQUFSLElBQWlCQztnQkFDZDtrQkFDRTtnQkFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSEhGLE1BQUFBLEdBQU8sRUFBQSxDQUFQLENBQVFDLEtBQVIsSUFBaUJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFYbEJBLGNBQWMsR0FBRzs7OztBQUNaQyxJQUFBQSxJQUFJOzs7QUFDSkMsSUFBQUEsT0FBTztBQUNkQyxNQUFBQSxLQUFLLEVBQUU7O0FBQ1BBLE1BQUFBLEtBQUssRUFBRTs7QUFDUEEsTUFBQUEsS0FBSyxFQUFFO0FBQVFKLE1BQUFBLEtBQUssRUFBRTs7QUFDdEJJLE1BQUFBLEtBQUssRUFBRTtBQUFXQyxNQUFBQSxLQUFLLEVBQUU7QUFBaUJMLE1BQUFBLEtBQUssRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
