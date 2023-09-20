from collections.abc import Hashable, Mapping

import xarray as xr
from xarray.core.indexes import Indexes

XarrayObject = xr.Dataset | xr.DataArray | xr.Coordinates | xr.Variable


class XarrayWrapper:
    """Lightweight wrapper around Xarray objects providing a common
    interface consumed by the widget representation.

    """

    obj_type: str
    coords: Mapping[Hashable, xr.DataArray | xr.Variable]
    data_vars: Mapping[Hashable, xr.DataArray | xr.Variable]
    xindexes: Indexes
    sizes: Mapping[Hashable, int]
    attrs: Mapping

    def __init__(self, obj: XarrayObject):
        self._obj = obj

        if isinstance(obj, xr.Dataset):
            self.obj_type = "dataset"
        elif isinstance(obj, xr.DataArray):
            self.obj_type = "dataarray"
        elif isinstance(obj, xr.Coordinates):
            self.obj_type = "coordinates"
        elif isinstance(obj, xr.Variable):
            self.obj_type = "variable"
        else:
            raise TypeError(
                "XarrayWidget only accepts xarray.Dataset, xarray.DataArray, "
                "xarray.Coordinates or xarray.Variable"
            )

        if isinstance(obj, xr.Coordinates):
            self.coords = obj
        else:
            self.coords = getattr(obj, "coords", {})

        if isinstance(obj, xr.Dataset):
            self.data_vars = obj.data_vars
        elif isinstance(obj, xr.Coordinates):
            self.data_vars = {}
        elif isinstance(obj, xr.DataArray):
            self.data_vars = {obj.name or "": obj.variable}
        else:
            self.data_vars = {"": obj}

        self.xindexes = getattr(obj, "xindexes", Indexes())
        self.sizes = obj.sizes
        self.attrs = getattr(obj, "attrs", {})
