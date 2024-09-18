import React from "react";
import { IoIosSearch } from "react-icons/io";
import { SearchBarProps } from "../interfaces";

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  query,
  setQuery,
  placeholder = "Search...",
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form
      className="d-flex align-items-center search_bar position-relative justify-content-center my-5"
      onSubmit={handleSubmit}
    >
      <input
        style={{
          padding: "10px 40px",
          width: "100%",
          maxWidth: "500px",
          border: "none",
          borderBottom: "1px solid var(--primary-color)",
          outline: "none",
        }}
        id="search"
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <IoIosSearch
        className="searchIcon position-absolute"
        style={{
          right: "420px",
          fontSize: "22px",
          color: "var(--primary-color)",
        }}
      />
    </form>
  );
};

export default SearchBar;
