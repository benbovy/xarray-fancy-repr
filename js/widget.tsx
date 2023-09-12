import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./styles.css";

type Dims = string[];
type DimsSize = {
    [key: string]: number;
};
type Attrs = {
    [key: string]: string;
};
type TVariable = {
    name: string,
    has_index: boolean,
    dims: Dims,
    dtype: string,
    inlineRepr: string,
    attrs: Attrs,
    dataRepr: string
}

function Variable(variable: TVariable) {
    return (
        <div>Variable</div>
    );
};

const coordinates = () => {
    const [coords, setCoords] = useModelState<TVariable>("_coords");
    return (
        <div>Coordinates</div>
        {coords}
    );
};

export const render = createRender(() => {
    return (
        <div>Dataset</div>
    );
});
