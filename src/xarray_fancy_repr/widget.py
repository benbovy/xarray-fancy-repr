import pathlib

import anywidget
import traitlets as tt

from xarray_fancy_repr.utils import (
    encode_attrs,
    encode_dim_info,
    encode_indexes,
    encode_variables,
)
from xarray_fancy_repr.wrap import XarrayObject, XarrayWrapper

DIMS = tt.List(tt.Unicode())
DIM_INFO = tt.Dict(
    value_trait=tt.Dict(per_key_traits={"size": tt.Int(), "hasIndex": tt.Bool()}),
    key_trait=tt.Unicode(),
)
DIMS_HAS_INDEX = tt.Dict(value_trait=tt.Bool(), key_trait=tt.Unicode())
ATTRS = tt.Dict(value_trait=tt.Unicode(), key_trait=tt.Unicode())
VARIABLE = tt.Dict(
    per_key_traits={
        "name": tt.Unicode(),
        "hasIndex": tt.Bool(),
        "dims": DIMS,
        "dtype": tt.Unicode(),
        "inlineRepr": tt.Unicode(),
        "attrs": ATTRS,
        "dataRepr": tt.Unicode(),
        "inMemory": tt.Bool(),
    },
)
INDEX = tt.Dict(
    per_key_traits={
        "coordNames": tt.List(tt.Unicode()),
        "inlineRepr": tt.Unicode(),
        "repr": tt.Unicode(),
    }
)


class XarrayWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"

    _obj_type = tt.Enum(("dataset", "dataarray", "coordinates", "variable")).tag(sync=True)
    _dim_info = DIM_INFO.tag(sync=True)
    _coords = tt.List(VARIABLE).tag(sync=True)
    _data_vars = tt.List(VARIABLE).tag(sync=True)
    _indexes = tt.List(INDEX).tag(sync=True)
    _attrs = ATTRS.tag(sync=True)
    _filter_search = tt.Unicode().tag(sync=True)
    _filter_by = tt.Tuple(("name",)).tag(sync=True)

    def __init__(self, obj: XarrayObject):
        self._obj = obj
        self._wrapped = XarrayWrapper(obj)

        super().__init__(
            _obj_type=self._wrapped.obj_type,
            _dim_info=encode_dim_info(self._wrapped),
            _coords=encode_variables(self._wrapped.coords, self._wrapped.xindexes),
            _data_vars=encode_variables(self._wrapped.data_vars),
            _indexes=encode_indexes(self._wrapped.xindexes),
            _attrs=encode_attrs(self._wrapped.attrs),
        )

    def _filter_clear(self):
        with self.hold_sync():
            self._coords = encode_variables(self._wrapped.coords, self._wrapped.xindexes)
            self._data_vars = encode_variables(self._wrapped.data_vars)
            self._attrs = encode_attrs(self._wrapped.attrs)

    def _filter_vars_and_attrs(self, query, by):
        if query == "" or not len(by):
            self._filter_clear()
            return

        def is_in(value):
            return query in str(value).lower()

        def in_dims(dims):
            return any(is_in(d) for d in dims)

        def in_attrs(attrs):
            return any(is_in(k) or is_in(v) for k, v in attrs.items())

        coord_names = set()
        data_var_names = set()

        if "name" in by:
            coord_names.update({k for k in self._wrapped.coords if is_in(k)})
            data_var_names.update({k for k in self._wrapped.data_vars if is_in(k)})
        if "dim" in by:
            coord_names.update({k for k, v in self._wrapped.coords.items() if in_dims(v.dims)})
            data_var_names.update(
                {k for k, v in self._wrapped.data_vars.items() if in_dims(v.dims)}
            )
        if "attrs" in by:
            coord_names.update({k for k, v in self._wrapped.coords.items() if in_attrs(v.attrs)})
            data_var_names.update(
                {k for k, v in self._wrapped.data_vars.items() if in_attrs(v.attrs)}
            )

        new_coords = {k: v for k, v in self._wrapped.coords.items() if k in coord_names}
        # do not filter data vars for DataArray or Variable (used to store the unique array)
        if self._wrapped.obj_type != "dataset":
            new_data_vars = self._wrapped.data_vars
        else:
            new_data_vars = {
                k: v for k, v in self._wrapped.data_vars.items() if k in data_var_names
            }

        if "attrs" in by:
            new_attrs = {k: v for k, v in self._wrapped.attrs.items() if is_in(k) or is_in(v)}
        else:
            new_attrs = self._wrapped.attrs

        with self.hold_sync():
            self._coords = encode_variables(new_coords, self._wrapped.xindexes)
            self._data_vars = encode_variables(new_data_vars)
            self._attrs = encode_attrs(new_attrs)

    @tt.observe("_filter_search")
    def _handle_filter_search(self, change):
        query = change["new"]
        self._filter_vars_and_attrs(query, self._filter_by)

    @tt.observe("_filter_by")
    def _handle_filter_by(self, change):
        by = change["new"]
        self._filter_vars_and_attrs(self._filter_search, by)
