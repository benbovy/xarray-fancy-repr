import pathlib

import anywidget
import traitlets as tt

from xarray_fancy_repr.utils import (
    encode_attrs,
    encode_dim_info,
    encode_indexes,
    encode_variables,
)
from xarray_fancy_repr.wrap import XarrayObject, XarrayWrap

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
    _filter_query = tt.Unicode().tag(sync=True)

    def __init__(self, obj: XarrayObject):
        self._obj = obj
        self._wrapped = XarrayWrap(obj)

        super().__init__(
            _obj_type=self._wrapped.obj_type,
            _dim_info=encode_dim_info(self._wrapped),
            _coords=encode_variables(self._wrapped.coords, self._wrapped.xindexes),
            _data_vars=encode_variables(self._wrapped.data_vars),
            _indexes=encode_indexes(self._wrapped.xindexes),
            _attrs=encode_attrs(self._wrapped.attrs),
        )

    @tt.observe("_filter_query")
    def _filter(self, change):
        query = change["new"]

        if query == "":
            new_coords = self._wrapped.coords
        else:
            new_coords = {k: v for k, v in self._wrapped.coords.items() if query in v.dims}

        if query == "" or self._wrapped.obj_type != "dataset":
            new_data_vars = self._wrapped.data_vars
        else:
            new_data_vars = {k: v for k, v in self._wrapped.data_vars.items() if query in v.dims}

        with self.hold_sync():
            self._coords = encode_variables(new_coords, self._wrapped.xindexes)
            self._data_vars = encode_variables(new_data_vars)
