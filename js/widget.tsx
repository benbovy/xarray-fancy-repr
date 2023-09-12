import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./styles.css";

type Dims = string[];
/* type DimsSize = {
*     [key: string]: number;
* }; */
type Attrs = {
    [key: string]: string;
};
type Variable = {
    name: string,
    has_index: boolean,
    dims: Dims,
    dtype: string,
    inlineRepr: string,
    attrs: Attrs,
    dataRepr: string
}


interface AttrsSectionProps {
    attrs: Attrs;
};

const AttrsSection = (props: AttrsSectionProps) => {
    console.log(props.attrs);
    /* const items = Object.entries(props.attrs).map(([key, value]) => (
*     <><dt><span>{key} :</span></dt><dd>{value}</dd></>
* ));
* return <dl className='xr-attrs'>{items}</dl> */
    return <dl className='xr-attrs'></dl>
};

interface VariableItemProps {
    variable: Variable;
}

const VariableItem = (props: VariableItemProps) => {
    const variable = props.variable;
    console.log(variable);
    return (
        <>
            <div className="xr-var-name"><span>{variable.name}</span></div>
            <div className="xr-var-dims">{variable.dims}</div>
            <div className="xr-var-dtype">{variable.dtype}</div>
            <div className="xr-var-preview xr-preview">{variable.inlineRepr}</div>
            <div className="xr-var-attrs"><AttrsSection attrs={variable.attrs} /></div>
            <div className="xr-var-data">{variable.dataRepr}</div>
        </>
    );
};

const CoordinatesSection = () => {
    const [coords, _] = useModelState<Variable[]>("_coords");
    let items = coords.map(variable => (
        <>
            <li className="xr-var-item"><VariableItem variable={variable} /></li>
        </>
    ));
    return (
        <ul className="xr-var-list">{items}</ul>
    );
};

export const render = createRender(() => {
    return (
        <div>
            <div className="xr-wrap">
                <div className="xr-header">
                    <div className="xr-obj-type">xarray.Dataset</div>
                </div>
                <ul className="xr-sections">
                    <li className="xr-section-items">
                        <label className="xr-section-summary">Coordinates</label>
                        <div className="xr-section-inline-details"></div>
                        <div className="xr-section-details">
                            <CoordinatesSection />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
});
