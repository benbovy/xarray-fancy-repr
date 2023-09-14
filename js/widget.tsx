import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import { AttrsSection, DimsSection, IndexList, MappingSection, VariableList } from "./common"
import { XarrayIcon } from "./icons"
import { Search } from "./search"
import { Attrs, DimInfo, Index, Variable } from "./types"

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
                    <div><XarrayIcon /></div>
                    <div className="xr-obj-type">xarray.Dataset</div>
                    <div className="xr-search"><Search /></div>
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

export const render = createRender(() => {
    return <DatasetWidget />
});
