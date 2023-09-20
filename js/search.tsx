import * as React from "react";
import { useModelState } from "@anywidget/react";
import { ClearIcon, FilterIcon } from "./icons";

export const Search = () => {
  const [optionsHidden, setOptionsHidden] = React.useState<boolean>(true);
  const [filterBy, setFilterBy] = useModelState<string[]>("_filter_by");
  const [query, setQuery] = useModelState<string>("_filter_search");

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toLowerCase());
  };

  const onChangeHandler = (key: string) => {
    const filterByCopy = Object.assign([], filterBy);
    const index = filterBy.indexOf(key, 0);
    if (index > -1) {
      filterByCopy.splice(index, 1);
    } else {
      filterByCopy.push(key);
    }
    setFilterBy(filterByCopy);
  };

  const clearHandler = () => {
    setQuery("");
  };

  const isChecked = (key: string): boolean => {
    return filterBy.includes(key);
  };

  return (
    <div className="xr-search">
      <div className={"xr-search-text" + (!!query ? " active" : "")}>
        <input
          type="text"
          onChange={inputHandler}
          placeholder="Search..."
          value={query}
        />
        <button
          className={!!query ? "" : "xr-hidden-alt"}
          onClick={clearHandler}
        >
          <ClearIcon />
        </button>
      </div>
      <button
        title="Filter options"
        onClick={() => setOptionsHidden(!optionsHidden)}
      >
        <FilterIcon />
      </button>
      <div className={optionsHidden ? "xr-hidden" : undefined}>
        <ul>
          <li>
            <label>
              search name
              <input
                type="checkbox"
                checked={isChecked("name")}
                onChange={() => onChangeHandler("name")}
              />
            </label>
          </li>
          <li>
            <label>
              search dimension
              <input
                type="checkbox"
                checked={isChecked("dim")}
                onChange={() => onChangeHandler("dim")}
              />
            </label>
          </li>
          <li>
            <label>
              search attribute
              <input
                type="checkbox"
                checked={isChecked("attrs")}
                onChange={() => onChangeHandler("attrs")}
              />
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};
