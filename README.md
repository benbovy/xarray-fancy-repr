# Xarray Fancy Repr

This package provides enhanced representations of Xarray objects (Dataset,
DataArray) for a better and more interactive user experience within Jupyter
notebooks.

## Installation

```sh
pip install xarray_fancy_repr
```

## How Does it Work?

After importing this package:

``` python
import xarray_fancy_repr
```

Xarray objects are patched so that they are displayed in the following fallback
order:

1. Interactive widget: should work in most notebook environments (JupyterLab,
   Jupyter Notebook <7,7+, Google Colab, VSCode, etc.), based on
   [anywidget](https://anywidget.dev/)
2. Static HTML: should work in any web browser
3. Plain text
