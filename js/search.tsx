import * as React from "react";
import { useModelState } from "@anywidget/react";

export const Search = () => {
  const [_, setQuery] = useModelState<string>("_filter_query");

  let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    var lowerCase = e.target.value.toLowerCase();
    setQuery(lowerCase);
  };

  return (
    <input
      type="text"
      onChange={inputHandler}
      placeholder="Search by dimension..."
    />
  );
};
