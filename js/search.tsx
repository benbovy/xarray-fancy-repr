import * as React from "react";
import { useModelState } from "@anywidget/react";
import { FilterIcon } from "./icons";

export const Search = () => {
  const [active, setActive] = React.useState<boolean>(false);
  const [optionsHidden, setOptionsHidden] = React.useState<boolean>(true);
  const [filterBy, setFilterBy] = useModelState<string[]>("_filter_by");
  const [_, setQuery] = useModelState<string>("_filter_search");

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    var lowerCase = e.target.value.toLowerCase();
    setActive(!!lowerCase);
    setQuery(lowerCase);
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

  const isChecked = (key: string): boolean => {
    return filterBy.includes(key);
  };

  return (
    <div className="xr-search">
      <input
        type="text"
        className={active ? "active" : ""}
        onChange={inputHandler}
        placeholder="Search..."
      />
      <button
        title="Filter options"
        onClick={() => setOptionsHidden(!optionsHidden)}
      >
        <FilterIcon />
      </button>
      <div className={optionsHidden ? "hidden" : undefined}>
        <ul>
          <li>
            <label>
              by name
              <input
                type="checkbox"
                checked={isChecked("name")}
                onChange={() => onChangeHandler("name")}
              />
            </label>
          </li>
          <li>
            <label>
              by dimension
              <input
                type="checkbox"
                checked={isChecked("dim")}
                onChange={() => onChangeHandler("dim")}
              />
            </label>
          </li>
          <li>
            <label>
              by attributes
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
