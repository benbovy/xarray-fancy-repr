from collections.abc import Hashable, Mapping

import xarray as xr
from xarray.core.formatting import inline_index_repr, inline_variable_array_repr
from xarray.core.formatting_html import short_data_repr_html, short_index_repr_html
from xarray.core.indexes import Indexes

from xarray_fancy_repr.wrap import XarrayObject, XarrayWrap


def encode_attrs(attrs: Mapping) -> dict[str, str]:
    return {str(k): str(v) for k, v in attrs.items()}


def _encode_variable(
    name: Hashable, var: xr.Variable | xr.DataArray, has_index: bool = False
) -> dict:
    if isinstance(var, xr.DataArray):
        var = var.variable

    name = str(name)
    dims = [str(dim) for dim in var.dims]
    dtype = str(var.dtype)
    inline_repr = inline_variable_array_repr(var, 35)
    attrs = encode_attrs(var.attrs)
    data_repr = short_data_repr_html(var)

    return {
        "name": name,
        "hasIndex": has_index,
        "dims": dims,
        "dtype": dtype,
        "inlineRepr": inline_repr,
        "attrs": attrs,
        "dataRepr": data_repr,
        "inMemory": var._in_memory,
    }


def encode_variables(
    variables: Mapping[Hashable, xr.Variable | xr.DataArray],
    indexes: Mapping[Hashable, xr.Index] | None = None,
) -> list[dict]:
    if indexes is None:
        indexes = {}

    encoded = [_encode_variable(k, v, has_index=k in indexes) for k, v in variables.items()]

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


def encode_dim_info(obj: XarrayObject | XarrayWrap):
    encoded = {}

    if isinstance(obj, xr.Variable):
        indexed_dims = {}
    else:
        indexed_dims = obj.xindexes.dims

    for dim, size in obj.sizes.items():
        encoded[dim] = {"size": size, "hasIndex": dim in indexed_dims}
    return encoded
