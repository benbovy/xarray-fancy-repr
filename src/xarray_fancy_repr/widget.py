import pathlib

import anywidget
import traitlets as tt
import xarray as xr

from xarray_fancy_repr.utils import (
    encode_attrs,
    encode_dim_info,
    encode_indexes,
    encode_variables,
)

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

    _dim_info = DIM_INFO.tag(sync=True)
    _coords = tt.List(VARIABLE).tag(sync=True)
    _data_vars = tt.List(VARIABLE).tag(sync=True)
    _indexes = tt.List(INDEX).tag(sync=True)
    _attrs = ATTRS.tag(sync=True)
    _filter_query = tt.Unicode().tag(sync=True)

    def __init__(self, dataset: xr.Dataset):
        self._dataset = dataset

        super().__init__(
            _dim_info=encode_dim_info(dataset),
            _coords=encode_variables(dataset.coords, dataset.xindexes),
            _data_vars=encode_variables(dataset.data_vars),
            _indexes=encode_indexes(dataset.xindexes),
            _attrs=encode_attrs(dataset.attrs),
        )

    @tt.observe("_filter_query")
    def _filter(self, change):
        name = change["new"]

        if name == "":
            new_coords = self._dataset.coords
            new_data_vars = self._dataset.data_vars
        else:
            new_coords = {k: v for k, v in self._dataset.coords.items() if name in v.dims}
            new_data_vars = {k: v for k, v in self._dataset.data_vars.items() if name in v.dims}

        with self.hold_sync():
            self._coords = encode_variables(new_coords, self._dataset.xindexes)
            self._data_vars = encode_variables(new_data_vars)
