import importlib.metadata

import xarray as xr

from xarray_fancy_repr.widget import XarrayWidget

try:
    __version__ = importlib.metadata.version("xarray_fancy_repr")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"

__all__ = ["XarrayWidget"]


# Monkey patch xarray objects
def _patched_repr_mimebundle(self, **kwargs: dict) -> tuple[None | dict, dict]:
    repr_mime, repr_metadata = XarrayWidget(self)._repr_mimebundle_(**kwargs)
    if repr_mime is not None:
        repr_mime["text/plain"] = self.__repr__()
        # TODO: add built-in html repr for xarray.Coordinates
        if hasattr(self, "_repr_html_"):
            repr_mime["text/html"] = self._repr_html_()

    return repr_mime, repr_metadata


xr.Dataset._repr_mimebundle_ = _patched_repr_mimebundle  # type: ignore
xr.DataArray._repr_mimebundle_ = _patched_repr_mimebundle  # type: ignore
xr.Coordinates._repr_mimebundle_ = _patched_repr_mimebundle  # type: ignore
xr.Variable._repr_mimebundle_ = _patched_repr_mimebundle  # type: ignore
