import importlib.metadata
import pathlib
from html import escape
from typing import Hashable, Mapping

import anywidget
import traitlets as tt
import xarray as xr
from xarray.core.formatting import inline_variable_array_repr
from xarray.core.formatting_html import short_data_repr_html


try:
    __version__ = importlib.metadata.version("xarray_fancy_repr")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


NAME = tt.Unicode()
HAS_INDEX = tt.Bool()
DIMS = tt.List(tt.Unicode())
DIMS_SIZES = tt.Dict(value_trait=tt.Int(), key_trait=tt.Unicode())
DTYPE = tt.Unicode()
INLINE_REPR = tt.Unicode()
ATTRS = tt.Dict(value_trait=tt.Unicode(), key_trait=tt.Unicode())
DATA_REPR = tt.Unicode()
VARIABLE = tt.Tuple(NAME, HAS_INDEX, DIMS, DTYPE, INLINE_REPR, ATTRS, DATA_REPR)


def encode_attrs(attrs: Mapping):
    return {escape(str(k)): escape(str(v)) for k, v in attrs.items()}


def _encode_variable(
    name: Hashable,
    var: xr.Variable | xr.DataArray,
    has_index: bool = False
):
    variable = var.variable if hasattr(var, "variable") else var

    name = escape(str(name))
    dims = [escape(dim) for dim in var.dims]
    dtype = escape(str(var.dtype))
    inline_repr = escape(inline_variable_array_repr(variable, 35))
    attrs = encode_attrs(var.attrs)
    data_repr = short_data_repr_html(variable)

    return (
        name, has_index, dims, dtype, inline_repr, attrs, data_repr
    )


def encode_variables(
    variables: Mapping[Hashable, xr.Variable | xr.DataArray],
    indexes: Mapping[Hashable, xr.Index] | None = None
) -> list[tuple]:
    if indexes is None:
        indexes = {}

    encoded = [
        _encode_variable(k, v, has_index=k in indexes)
        for k, v in variables.items()
    ]

    return encoded


class DatasetWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"

    _dims = DIMS_SIZES.tag(sync=True)
    _coords = tt.List(VARIABLE).tag(sync=True)
    _data_vars = tt.List(VARIABLE).tag(sync=True)
    _attrs = ATTRS.tag(sync=True)

    def __init__(self, dataset: xr.Dataset):
        self._dataset = dataset

        super().__init__(
            _dims=dict(dataset.dims),
            _coords=encode_variables(dataset.coords),
            _data_vars=encode_variables(dataset.data_vars),
            _attrs=encode_attrs(dataset.attrs),
        )
