import React from "react";
import ReactPlayer from "react-player";
import "./Video.css";

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
          <button onClick={handleTikTokShare}>Share on TikTok</button>
        </div>
      )}
    </div>
  );
};

export default Video;
