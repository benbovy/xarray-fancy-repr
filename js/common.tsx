import * as React from "react";
import { AttrsIcon, DataIcon } from "./icons";
import { Attrs, DimInfo, Index, Variable } from "./types";
import "./styles.css";

export const AttrsSection = ({ attrs }: { attrs: Attrs }) => {
  const items = Object.entries(attrs).map(([key, value]) => (
    <>
      <dt>
        <span>{key} :</span>
      </dt>
      <dd>{value}</dd>
    </>
  ));
  return <dl className="xr-attrs">{items}</dl>;
};

const VariableItem = ({ variable }: { variable: Variable }) => {
  const attrsDisabled = Object.keys(variable.attrs).length == 0;
  const [attrsCollapsed, setAttrsCollapsed] = React.useState<boolean>(true);
  const [dataCollapsed, setDataCollapsed] = React.useState<boolean>(true);

  return (
    <>
      <div className="xr-var-name">
        <span className={variable.hasIndex ? "xr-has-index" : ""}>
          {variable.name}
        </span>
      </div>
      <div className="xr-var-dims">({variable.dims.join(", ")})</div>
      <div className="xr-var-dtype">{variable.dtype}</div>
      <div className="xr-var-preview xr-preview">{variable.inlineRepr}</div>
      <input
        className="xr-var-attrs-in"
        type="checkbox"
        checked={!attrsCollapsed}
        disabled={attrsDisabled}
      />
      <label
        title="Show/Hide attributes"
        onClick={() => {
          if (!attrsDisabled) setAttrsCollapsed(!attrsCollapsed);
        }}
      >
        <AttrsIcon />
      </label>
      <input
        className="xr-var-data-in"
        type="checkbox"
        checked={!dataCollapsed}
      />
      <label
        title="Show/Hide data repr"
        onClick={() => setDataCollapsed(!dataCollapsed)}
      >
        <DataIcon />
      </label>
      <div className="xr-var-attrs">
        <AttrsSection attrs={variable.attrs} />
      </div>
      <div
        className="xr-var-data"
        dangerouslySetInnerHTML={{ __html: variable.dataRepr }}
      ></div>
    </>
  );
};

export const VariableList = ({ variables }: { variables: Variable[] }) => {
  const items = variables.map((v) => (
    <>
      <li className="xr-var-item">
        <VariableItem variable={v} />
      </li>
    </>
  ));

  return <ul className="xr-var-list">{items}</ul>;
};

const IndexItem = ({ index }: { index: Index }) => {
  const [dataCollapsed, setDataCollapsed] = React.useState<boolean>(true);

  const indexName = index.coordNames.map((name) => (
    <>
      {name}
      <br />
    </>
  ));

  return (
    <>
      <div className="xr-index-name">
        <div>{indexName}</div>
      </div>
      <div className="xr-index-preview">{index.inlineRepr}</div>
      <div></div>
      <input
        className="xr-index-data-in"
        type="checkbox"
        checked={!dataCollapsed}
      />
      <label
        title="Show/Hide index repr"
        onClick={() => setDataCollapsed(!dataCollapsed)}
      >
        <DataIcon />
      </label>
      <div
        className="xr-index-data"
        dangerouslySetInnerHTML={{ __html: index.repr }}
      ></div>
    </>
  );
};

export const IndexList = ({ indexes }: { indexes: Index[] }) => {
  const items = indexes.map((index) => (
    <>
      <li className="xr-var-item">
        <IndexItem index={index} />
      </li>
    </>
  ));

  return <ul className="xr-var-list">{items}</ul>;
};

interface MappingSectionProps {
  title: string;
  nitems: number;
  maxItemsCollapse: number;
  children?: React.ReactNode;
}

export const MappingSection = (props: MappingSectionProps) => {
  const initCollapsed =
    props.nitems == 0 || props.nitems > props.maxItemsCollapse;
  const [collapsed, setCollapsed] = React.useState<boolean>(initCollapsed);

  return (
    <>
      <input
        className="xr-section-summary-in"
        type="checkbox"
        checked={!collapsed}
      />
      <label
        className="xr-section-summary"
        onClick={() => setCollapsed(!collapsed)}
        title="Expand/collapse section"
      >
        {props.title}: {collapsed ? <span>({props.nitems})</span> : ""}
      </label>
      <div className="xr-section-inline-details"></div>
      <div className="xr-section-details">{props.children}</div>
    </>
  );
};

export const DimsList = ({ dimInfo }: { dimInfo: DimInfo }) => {
  const items = Object.entries(dimInfo).map(([dim, value]) => (
    <>
      <li>
        <span className={value.hasIndex ? "xr-has-index" : ""}>{dim}</span>:{" "}
        {value.size}
      </li>
    </>
  ));

  return (
    <>
      <ul className="xr-dim-list">{items}</ul>
    </>
  );
};

export const DimsSection = ({ dimInfo }: { dimInfo: DimInfo }) => {
  return (
    <>
      <input
        className="xr-section-summary-in"
        type="checkbox"
        checked={false}
        disabled={true}
      />
      <label className="xr-section-summary">Dimensions:</label>
      <div className="xr-section-inline-details">
        <DimsList dimInfo={dimInfo} />
      </div>
      <div className="xr-section-details"></div>
    </>
  );
};

export const ArraySection = ({variable}: {variable: Variable}) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  return (
    <div className="xr-array-wrap">
      <input
        className="xr-array-in"
        type="checkbox"
        checked={!collapsed}
      />
      <label
        onClick={() => setCollapsed(!collapsed)}
        title="Show/hide data repr"
      >
        <DataIcon />
      </label>
      <div className="xr-array-preview xr-preview">
        <span>{variable.inlineRepr}</span>
      </div>
      <div
        className="xr-array-data"
        dangerouslySetInnerHTML={{ __html: variable.dataRepr }}
      ></div>
    </div>
  )
};
