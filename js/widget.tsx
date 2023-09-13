import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./styles.css";


const DataIcon = () => {
    return (
        <svg
            className="icon xr-icon-data"
            style={{position: "absolute", overflow: "hidden"}}
            viewBox="0 0 32 32"
        >
            <path d="M16 0c-8.837 0-16 2.239-16 5v4c0 2.761 7.163 5 16 5s16-2.239 16-5v-4c0-2.761-7.163-5-16-5z" />
            <path d="M16 17c-8.837 0-16-2.239-16-5v6c0 2.761 7.163 5 16 5s16-2.239 16-5v-6c0 2.761-7.163 5-16 5z" />
            <path d="M16 26c-8.837 0-16-2.239-16-5v6c0 2.761 7.163 5 16 5s16-2.239 16-5v-6c0 2.761-7.163 5-16 5z" />
        </svg>
    )
}

const AttrsIcon = () => {
    return (
        <svg
            className="icon xr-icon-attrs"
            style={{position: "absolute", overflow: "hidden"}}
            viewBox="0 0 32 32"
        >
            <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z" />
            <path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z" />
            <path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z" />
            <path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z" />
        </svg>
    )
}

type Dims = string[];
type DimSizes = {
    [key: string]: number;
};
type Attrs = {
    [key: string]: string;
};
type Index = {
    coordNames: string[],
    inlineRepr: string,
    repr: string
}
type Variable = {
    name: string,
    hasIndex: boolean,
    dims: Dims,
    dtype: string,
    inlineRepr: string,
    attrs: Attrs,
    dataRepr: string
};

interface AttrsSectionProps {
    attrs: Attrs;
};

const AttrsSection = (props: AttrsSectionProps) => {
    const items = Object.entries(props.attrs).map(([key, value]) => (
        <><dt><span>{key} :</span></dt><dd>{value}</dd></>
    ));
    return <dl className='xr-attrs'>{items}</dl>
};

interface VariableItemProps {
    variable: Variable;
}

const VariableItem = (props: VariableItemProps) => {
    const variable = props.variable;
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
                onClick={() => {if (!attrsDisabled) setAttrsCollapsed(!attrsCollapsed)}}
            >
                <AttrsIcon />
            </label>
            <input
                className="xr-var-data-in"
                type="checkbox"
                checked={!dataCollapsed}
            />
            <label title="Show/Hide data repr" onClick={() => setDataCollapsed(!dataCollapsed)}>
                <DataIcon />
            </label>
            <div className="xr-var-attrs"><AttrsSection attrs={variable.attrs} /></div>
            <div className="xr-var-data" dangerouslySetInnerHTML={{__html: variable.dataRepr}}></div>
        </>
    );
};

interface VariableListProps {
    vars: Variable[];
}

const VariableList = (props: VariableListProps) => {
    let items = props.vars.map(variable => (
        <>
            <li className="xr-var-item"><VariableItem variable={variable} /></li>
        </>
    ));

    return <ul className="xr-var-list">{items}</ul>;
};

interface IndexItemProps {
    index: Index;
}

const IndexItem = (props: IndexItemProps) => {
    const index = props.index;
    const [dataCollapsed, setDataCollapsed] = React.useState<boolean>(true);

    const indexName = index.coordNames.map(name => (<>{name}<br /></>))

    return (
        <>
            <div className="xr-index-name"><div>{indexName}</div></div>
            <div className="xr-index-preview">{index.inlineRepr}</div>
            <div></div>
            <input
                className="xr-index-data-in"
                type="checkbox"
                checked={!dataCollapsed}
            />
            <label title="Show/Hide index repr" onClick={() => setDataCollapsed(!dataCollapsed)}>
                <DataIcon />
            </label>
            <div className="xr-index-data" dangerouslySetInnerHTML={{__html: index.repr}}></div>
        </>
    );
};

interface IndexListProps {
    indexes: Index[];
}

const IndexList = (props: IndexListProps) => {
    let items = props.indexes.map(index => (
        <>
            <li className="xr-var-item"><IndexItem index={index} /></li>
        </>
    ));

    return <ul className="xr-var-list">{items}</ul>;
};

interface MappingSectionProps {
    enabled: boolean;
    title: string;
    details: any;
    nitems: number;
    maxItemsCollapse: number;
}

const MappingSection = (props: MappingSectionProps) => {
    const initCollapsed = props.nitems == 0 || props.nitems > props.maxItemsCollapse;
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
                title={props.enabled ? "Expand/collapse section" : ""}
            >
                {props.title}: {collapsed ? <span>({props.nitems})</span> : ""}
            </label>
            <div className="xr-section-inline-details"></div>
            <div className="xr-section-details">
                {props.details}
            </div>
        </>
    );
};

interface DimsSectionProps {
    dimSizes: DimSizes
}

const DimsSection = (props: DimsSectionProps) => {
    return (
        <>
            <input className="xr-section-summary-in" type="checkbox" checked={false} disabled={true} />
            <label className="xr-section-summary">Dimensions:</label>
            <div className="xr-section-inline-details">TODO</div>
            <div className="xr-section-details"></div>
        </>
    );
};


const Search = () => {
    const [_, setQuery] = useModelState<string>("_filter_query");

    let inputHandler = (e) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase();
        setQuery(lowerCase);
    };

    return (
        <input
            type="text"
            onChange={inputHandler}
            placeholder="Search by name, dim, attr..."
        />
    )
}

export const render = createRender(() => {
    const [dims, _0] = useModelState<DimSizes>("_dims");
    const [coords, _1] = useModelState<Variable[]>("_coords");
    const [dataVars, _2] = useModelState<Variable[]>("_data_vars");
    const [indexes, _3] = useModelState<Index[]>("_indexes");
    const [attrs, _4] = useModelState<Attrs>("_attrs");

    return (
        <div>
            <div className="xr-wrap">
                <div className="xr-header">
                    <div className="xr-obj-type">xarray.Dataset <Search /></div>
                </div>
                <ul className="xr-sections">
                    <li className="xr-section-item">
                        <DimsSection dimSizes={dims} />
                    </li>
                    <li className="xr-section-item">
                        <MappingSection
                            enabled={true}
                            title="Coordinates"
                            nitems={coords.length}
                            maxItemsCollapse={25}
                            details={<VariableList vars={coords} />}
                        />
                    </li>
                    <li className="xr-section-item">
                        <MappingSection
                            enabled={true}
                            title="Data variables"
                            nitems={dataVars.length}
                            maxItemsCollapse={15}
                            details={<VariableList vars={dataVars} />}
                        />
                    </li>
                    <li className="xr-section-item">
                        <MappingSection
                            enabled={true}
                            title="Indexes"
                            nitems={indexes.length}
                            maxItemsCollapse={0}
                            details={<IndexList indexes={indexes} />}
                        />
                    </li>
                    <li className="xr-section-item">
                        <MappingSection
                            enabled={true}
                            title="Attributes"
                            nitems={Object.keys(attrs).length}
                            maxItemsCollapse={10}
                            details={<AttrsSection attrs={attrs} />}
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
});
