// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchClip } from "../common/apiHooks"; // Assuming you've defined useSearchClip in apiHooks
import { keys } from "../common/keys";
import LoadingSpinner from "../common/LoadingSpinner";
import WarningIcon from "../svg/warning.svg";

export const SearchVideo = ({ index, videoId, refetchVideos }) => {
  const queryClient = useQueryClient();

  const [queryText, setQueryText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCheckWarning, setShowCheckWarning] = useState(false);

  const { data: searchResult, isLoading, isError, error } = useSearchClip(
    { queryText },
    videoId,
    isSubmitted
  );

  console.log('searchResult', index)
  const handleSearch = () => {
    if (!queryText) {
      setShowCheckWarning(true);
      return;
    }
    setIsSubmitted(true);
    setShowCheckWarning(false);
  };

  const handleInputChange = (event) => {
    setQueryText(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
        console.log('here11 at trying to hit api')
      await queryClient.invalidateQueries({
        queryKey: [keys.VIDEOS, 'search', videoId],
      });
    };
    fetchData();


  }, [ videoId, queryClient]);

  return (
    <div className="summarizeVideo">
      <h1 className="summarizeVideo__appTitle">Summarize a Youtube Video</h1>
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
      {searchResult && (
        <p>{JSON.stringify(searchResult)}</p> 
      )}
    </div>
  );
};
