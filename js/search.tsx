import * as React from "react";
import { useModelState } from "@anywidget/react";

export const Search = () => {
  const [_, setQuery] = useModelState<string>("_filter_query");
  const [active, setActive] = React.useState<boolean>(false);

  let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    var lowerCase = e.target.value.toLowerCase();
    setActive(!!lowerCase);
    setQuery(lowerCase);
  };

  return (
    <input
      type="text"
      className={active ? "active" : ""}
      onChange={inputHandler}
      placeholder="Search by dimension..."
    />
  );
};
