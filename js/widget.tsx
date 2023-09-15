import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import {
  ArraySection,
  AttrsSection,
  DimsList,
  DimsSection,
  IndexList,
  MappingSection,
  VariableList,
} from "./common";
import { XarrayIcon } from "./icons";
import { Search } from "./search";
import { Attrs, DimInfo, Index, Variable } from "./types";

const DatasetWidget = () => {
  const [dimInfo, _0] = useModelState<DimInfo>("_dim_info");
  const [coords, _1] = useModelState<Variable[]>("_coords");
  const [dataVars, _2] = useModelState<Variable[]>("_data_vars");
  const [indexes, _3] = useModelState<Index[]>("_indexes");
  const [attrs, _4] = useModelState<Attrs>("_attrs");

  return (
    <div>
      <div className="xr-wrap">
        <div className="xr-header">
          <div>
            <XarrayIcon />
          </div>
          <div className="xr-obj-type">xarray.Dataset</div>
          <div className="xr-search">
            <Search />
          </div>
        </div>
        <ul className="xr-sections">
          <li className="xr-section-item">
            <DimsSection dimInfo={dimInfo} />
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Coordinates"
              nitems={coords.length}
              maxItemsCollapse={25}
            >
              <VariableList variables={coords} />
            </MappingSection>
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Data variables"
              nitems={dataVars.length}
              maxItemsCollapse={15}
            >
              <VariableList variables={dataVars} />
            </MappingSection>
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Indexes"
              nitems={indexes.length}
              maxItemsCollapse={0}
            >
              <IndexList indexes={indexes} />
            </MappingSection>
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Attributes"
              nitems={Object.keys(attrs).length}
              maxItemsCollapse={10}
            >
              <AttrsSection attrs={attrs} />
            </MappingSection>
          </li>
        </ul>
      </div>
    </div>
  );
};

const DataArrayWidget = () => {
  const [dimInfo, _0] = useModelState<DimInfo>("_dim_info");
  const [coords, _1] = useModelState<Variable[]>("_coords");
  const [dataVars, _2] = useModelState<Variable[]>("_data_vars");
  const [indexes, _3] = useModelState<Index[]>("_indexes");
  const [attrs, _4] = useModelState<Attrs>("_attrs");

  const variable = Object(dataVars).values().next().value;
  const name = variable.name ? "'" + variable.name + "'" : "";

  return (
    <div>
      <div className="xr-wrap">
        <div className="xr-header">
          <div>
            <XarrayIcon />
          </div>
          <div className="xr-obj-type">xarray.DataArray</div>
          <div className="xr-array-name">{name}</div>
          <DimsList dimInfo={dimInfo} />
          <div className="xr-search">
            <Search />
          </div>
        </div>
        <ul className="xr-sections">
          <li className="xr-section-item">
            <ArraySection variable={variable} />
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Coordinates"
              nitems={coords.length}
              maxItemsCollapse={25}
            >
              <VariableList variables={coords} />
            </MappingSection>
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Indexes"
              nitems={indexes.length}
              maxItemsCollapse={0}
            >
              <IndexList indexes={indexes} />
            </MappingSection>
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Attributes"
              nitems={Object.keys(attrs).length}
              maxItemsCollapse={10}
            >
              <AttrsSection attrs={attrs} />
            </MappingSection>
          </li>
        </ul>
      </div>
    </div>
  );
};

const CoordinatesWidget = () => {
  const [dimInfo, _0] = useModelState<DimInfo>("_dim_info");
  const [coords, _1] = useModelState<Variable[]>("_coords");
  const [indexes, _3] = useModelState<Index[]>("_indexes");

  return (
    <div>
      <div className="xr-wrap">
        <div className="xr-header">
          <div>
            <XarrayIcon />
          </div>
          <div className="xr-obj-type">xarray.Coordinates</div>
          <div className="xr-search">
            <Search />
          </div>
        </div>
        <ul className="xr-sections">
          <li className="xr-section-item">
            <DimsSection dimInfo={dimInfo} />
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Coordinates"
              nitems={coords.length}
              maxItemsCollapse={25}
            >
              <VariableList variables={coords} />
            </MappingSection>
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Indexes"
              nitems={indexes.length}
              maxItemsCollapse={0}
            >
              <IndexList indexes={indexes} />
            </MappingSection>
          </li>
        </ul>
      </div>
    </div>
  );
};

const VariableWidget = () => {
  const [dimInfo, _0] = useModelState<DimInfo>("_dim_info");
  const [dataVars, _2] = useModelState<Variable[]>("_data_vars");
  const [attrs, _4] = useModelState<Attrs>("_attrs");

  const variable = Object(dataVars).values().next().value;

  return (
    <div>
      <div className="xr-wrap">
        <div className="xr-header">
          <div>
            <XarrayIcon />
          </div>
          <div className="xr-obj-type">xarray.Variable</div>
          <div className="xr-array-name"></div>
          <DimsList dimInfo={dimInfo} />
        </div>
        <ul className="xr-sections">
          <li className="xr-section-item">
            <ArraySection variable={variable} />
          </li>
          <li className="xr-section-item">
            <MappingSection
              title="Attributes"
              nitems={Object.keys(attrs).length}
              maxItemsCollapse={10}
            >
              <AttrsSection attrs={attrs} />
            </MappingSection>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const render = createRender(() => {
  const [objType, _1] = useModelState<string>("_obj_type");

  if (objType == "dataset") {
    return <DatasetWidget />;
  } else if (objType == "dataarray") {
    return <DataArrayWidget />;
  } else if (objType == "coordinates") {
    return <CoordinatesWidget />;
  } else if (objType == "variable") {
    return <VariableWidget />;
  } else {
    return <div></div>;
  }
});
