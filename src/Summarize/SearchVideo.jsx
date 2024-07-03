// @ts-nocheck
import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../common/LoadingSpinner";
import WarningIcon from "../svg/warning.svg";

export const SearchVideo = ({ indexId }) => {
  const [queryText, setQueryText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCheckWarning, setShowCheckWarning] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Debugging log for the search result
  console.log('searchResult', searchResult);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000', // Replace with your backend server's address
  });

  const handleSearch = async () => {
    if (!queryText) {
      setShowCheckWarning(true);
      return;
    }

    setIsSubmitted(true);
    setShowCheckWarning(false);
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await axiosInstance.post(`/test/search`, { queryText });
      setSearchResult(response.data);
    } catch (error) {
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setQueryText(event.target.value);
  };

  useEffect(() => {
    if (indexId) {
      setIsSubmitted(false);
      setSearchResult(null);
    }
  }, [indexId]);

  return (
    <div className="summarizeVideo">
      <h1 className="summarizeVideo__appTitle">Search in a Youtube Video</h1>
      {showCheckWarning && (
        <div className="summarizeVideo__warningMessageWrapper">
          <img
            className="summarizeVideo__warningMessageWrapper__warningIcon"
            src={WarningIcon}
            alt="WarningIcon"
          />
          <div className="summarizeVideo__warningMessageWrapper__warningMessage">
            Please enter a query text
          </div>
        </div>
      )}
      <input
        type="text"
        value={queryText}
        onChange={handleInputChange}
        placeholder="Enter query text"
      />
      <button onClick={handleSearch}>Search</button>
      {isLoading && <LoadingSpinner />}
      {isError && <p>Error: {error.message}</p>}
      {searchResult && <p>{JSON.stringify(searchResult)}</p>}
    </div>
  );
};
