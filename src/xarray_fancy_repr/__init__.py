import importlib.metadata

from xarray_fancy_repr.widget import XarrayWidget

try:
    __version__ = importlib.metadata.version("xarray_fancy_repr")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"

__all__ = ["XarrayWidget"]
