// @ts-nocheck
import  React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HashTagInputForm } from "./HashTagInputForm";
import "./GenerateHashTag.css";
import { useGetVideo } from "./common/apiHooks";
import { keys } from "./common/keys";
import { HashTagResult } from "./HashTagResult";
import WarningIcon from "./svg/warning.svg";
export const GenerateTitlesAndHashtags = ({ index, videoId, refetchVideos }) =>{
  const { data: video, isLoading } = useGetVideo(
    index,
    videoId,
    Boolean(videoId)
  );

  const [field1, field2, field3] = ["topic", "title", "hashtag"];
  const [types, setTypes] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showVideoTitle, setShowVideoTitle] = useState(false);
  const [showCheckWarning, setShowCheckWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploading, setIsFileUploading] = useState(false);


  const queryClient = useQueryClient();

  const vidTitleRaw = video?.metadata?.video_title;
  console.log(' vidTitleRaw', video)
  const vidTitleClean = decodeAndCleanFilename(vidTitleRaw);

  /** Return clean video file name  */
  function decodeAndCleanFilename(filename) {
    let decodedFilename = filename;
    try {
      decodedFilename = decodeURIComponent(filename);
    } catch (error) {
      console.error("Error decoding filename:", error);
    }
    const cleanedFilename = decodedFilename
      .replace(/%20/g, " ")
      .replace(/\([^)]*\)/g, "");
    return cleanedFilename;
  }

  async function resetTypes() {
    setTypes(new Set());
  }

  useEffect(() => {
    const fetchData = async () => {
      await queryClient.invalidateQueries({
        queryKey: [keys.VIDEOS, index, videoId],
      });
    };
    fetchData();
    resetTypes();
    setIsSubmitted(false);
    setShowVideoTitle(false);
    setShowCheckWarning(false);
    setSelectedFile(null);
    setIsFileUploading(false);
  }, [index, videoId, queryClient]);
  return (
    <div className="GenerateTitlesAndHashtags">
      <h1 className="GenerateTitlesAndHashtags__appTitle">
        Suggest Titles and Hashtags
      </h1>

      {!isFileUploading && (
        <>
          {showCheckWarning && (
            <div className="GenerateTitlesAndHashtags__warningMessageWrapper">
              <img
                className="GenerateTitlesAndHashtags__warningMessageWrapper__warningIcon"
                src={WarningIcon}
                alt="WarningIcon"
              ></img>
              <div className="GenerateTitlesAndHashtags__warningMessageWrapper__warningMessage">
                Please select one of the checkboxes
              </div>
            </div>
          )}
          {video && (
            <HashTagInputForm
              video={video}
              field1={field1}
              field2={field2}
              field3={field3}
              setIsSubmitted={setIsSubmitted}
              setShowVideoTitle={setShowVideoTitle}
              setShowCheckWarning={setShowCheckWarning}
              types={types}
            />
          )}
          {video && (
            <HashTagResult video={video} isSubmitted={isSubmitted} types={types} />
          )}
        </>
      )}
    </div>
  );
}
