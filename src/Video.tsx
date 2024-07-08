import React from "react";
import ReactPlayer from "react-player";
import "./Video.css";
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
interface Props {
  url: string;
  start?: number;
  end?: number;
  width: string;
  height: string;
  tiktok?: boolean; // Optional prop to enable TikTok share button
}

const Video: React.FC<Props> = ({ url, start, end, width, height, tiktok }) => {
  const handleTikTokShare = () => {
    const tikTokUrl = `https://www.tiktok.com/upload?video=${encodeURIComponent(url)}`;
    window.open(tikTokUrl, "_blank");
  };

  return (
    <div className="video" style={{ width: width, height: height }}>
      <ReactPlayer
        key={url}
        className="video__reactPlayer"
        data-cy="data-cy-video"
        url={start || end ? `${url}?start=${start}&end=${end}` : url}
        controls
      />
      {tiktok && (
        <div className="video__actions">
          <button onClick={handleTikTokShare}>
          <FontAwesomeIcon icon={faTiktok} style={{ color: "#2ce2d9" }} /> 
          <span style={{ color: "#2ce2d9" }}>Share</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default Video;
