import importlib.metadata
import pathlib
from typing import Hashable, Mapping

import anywidget
import traitlets as tt
import xarray as xr
from xarray.core.formatting import inline_index_repr, inline_variable_array_repr
from xarray.core.formatting_html import short_data_repr_html, short_index_repr_html
from xarray.core.indexes import Indexes


try:
    __version__ = importlib.metadata.version("xarray_fancy_repr")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


DIMS = tt.List(tt.Unicode())
DIM_INFO = tt.Dict(
    value_trait=tt.Dict(per_key_traits={"size": tt.Int(), "hasIndex": tt.Bool()}),
    key_trait=tt.Unicode()
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


def encode_attrs(attrs: Mapping) -> dict[str, str]:
    return {str(k): str(v) for k, v in attrs.items()}


def _encode_variable(
    name: Hashable,
    var: xr.Variable | xr.DataArray,
    has_index: bool = False
) -> dict:
    variable = var.variable if hasattr(var, "variable") else var

    name = str(name)
    dims = [str(dim) for dim in var.dims]
    dtype = str(var.dtype)
    inline_repr = inline_variable_array_repr(variable, 35)
    attrs = encode_attrs(var.attrs)
    data_repr = short_data_repr_html(variable)

    return {
        "name": name,
        "hasIndex": has_index,
        "dims": dims,
        "dtype": dtype,
        "inlineRepr": inline_repr,
        "attrs": attrs,
        "dataRepr": data_repr,
    }


def encode_variables(
    variables: Mapping[Hashable, xr.Variable | xr.DataArray],
    indexes: Mapping[Hashable, xr.Index] | None = None
) -> list[dict]:
    if indexes is None:
        indexes = {}

    encoded = [
        _encode_variable(k, v, has_index=k in indexes)
        for k, v in variables.items()
    ]

    return encoded


def encode_indexes(indexes: Indexes) -> list[dict]:
    encoded = []
    for idx, index_vars in indexes.group_by_index():
        encoded_idx = {
            "coordNames": list(index_vars),
            "inlineRepr": inline_index_repr(idx),
            "repr": short_index_repr_html(idx),
        }
        encoded.append(encoded_idx)
    return encoded


def encode_dim_info(obj: xr.Dataset | xr.DataArray):
    encoded = {}
    indexed_dims = obj.xindexes.dims
    for dim, size in obj.sizes.items():
        encoded[dim] = {"size": size, "hasIndex": dim in indexed_dims}
    return encoded


class DatasetWidget(anywidget.AnyWidget):
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
