// @ts-nocheck
import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../common/LoadingSpinner";
import WarningIcon from "../svg/warning.svg";
import Video from "../Video";



export const SearchVideo = ({ indexId }) => {
  const [queryText, setQueryText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCheckWarning, setShowCheckWarning] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [fileIndexId, setFileIndexId] = useState(1)
  const [processedVideo, setProcessedVideo] = useState(null); // State to store processed video URL

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000", // Replace with your backend server's address
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
      const response = await axiosInstance.post(`/video/search`, { queryText });
      setSearchResult(response.data);
      console.log('response data', response.data)
      console.log('fileindexid42', response?.data?.search_pool?.index_id)
      setFileIndexId(response?.data?.search_pool?.index_id)
    } catch (error) {
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTimestamps = (data) => {
    return data.data.map((item) => ({
      start: item.start,
      end: item.end,
    }));
  };

  useEffect(() => {
    if (searchResult) {
      const clippedTimeStamps = extractTimestamps(searchResult)
      processVideo(clippedTimeStamps); // If searchResult is populated, proceed to process the video
    }
  }, [searchResult]);


  const processVideo = async (clippedTimeStamps) => {
    setIsLoading(true);
    setIsError(false);
    console.log('fileIndexId',fileIndexId)
    try {
      const response = await axiosInstance.post(`/videos/${fileIndexId}/processvideo`, {
        timestamps: clippedTimeStamps,
      });
     

      // Assuming your backend returns the processed video file path in response.data.outputFile
      const outputFile = response.data.outputFile;
      setProcessedVideo(outputFile); // Store the processed video URL

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
      {processedVideo && (
        <div>
          <p>Processed Video:</p>
          <video controls>
            <source src={`http://localhost:4000/${processedVideo}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
           <video controls>
            <source src={`/Users/206819985/Desktop/summer_hackathon/generate-social-posts/videos/output/output.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <>
        <Video
                url='/videos/output/output.mp4'
                width={"381px"}
                height={"8084px"}
                tiktok={true}
              />
              </>
    </div>
  );
};
