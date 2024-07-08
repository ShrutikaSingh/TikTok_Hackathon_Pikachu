// src/App.js
import React, { useState } from 'react';
// @ts-ignore
import * as XLSX from 'xlsx';
import './App.css';
// @ts-ignore
import sceneData from './sceneData.json'
// @ts-ignore
import montageData from "./montageData.json";




// @ts-ignore
const TimelineItem = ({ item }) => {
  const itemWidth = (item.end - item.start) * 100; // Calculate width based on duration
  const itemcenter = item.start * 100; // Calculate center position based on start time

  return React.createElement(
    'div',
    {
      className: `${item.type === "thumbnails" ? "h-40" : "h-15"} bg-gray-700 rounded flex items-center justify-center`,
      style: { width: `${itemWidth}px`, center: `${itemcenter}px`, position: "relative" }
    },
    item.type === "thumbnails" ? React.createElement(
      'div',
      { className: "bg-gray-100 flex justify-center items-center" },
      React.createElement(
        'div',
        { className: "container mx-auto" },
        // React.createElement(
        //   'div',
        //   { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" },
        //   item.thumbnails.map((thumbnail, index) => React.createElement(
        //     'div',
        //     { key: index, className: "bg-white shadow-md m-2" },
        //     React.createElement('img', {
        //       src: thumbnail,
        //       alt: `Thumbnail ${index + 1}`,
        //       className: "w-full h-auto"
        //     })
        //   ))
        // )
      )  
    ) : React.createElement(
      'div',
      { className: "p-2 text-white" },
      item.label
    )
  );
};

// @ts-ignore
const TimelineSection = ({sceneData}) => React.createElement(
  'div',
  { className: "mb-8" },
  React.createElement(
    'div',
    { className: "h-8 bg-gray-800" },
    React.createElement(
      'div',
      { className: "h-full w-full flex justify-between text-gray-400" },
      [...Array(5)].map((_, i) => React.createElement(
        'div',
        { key: i, className: "w-1/5 text-center" },
        i
      ))
    )
  ),
  React.createElement(
    'div',
    { className: "flex overflow-x-auto relative" },
    Object.keys(sceneData).map((sceneKey) => {
      // @ts-ignore
      const sceneThumbnails = sceneData[sceneKey].map(item => item.thumbnail_url);

      return React.createElement(
        'div',
        { key: sceneKey, className: "flex-shrink-0" },
        React.createElement(TimelineItem, {
          item: {
            id: "scene1",
            type: "scene",
            label: sceneKey,
            start: 0,
            end: 4,
          }
        }),
        React.createElement(TimelineItem, {
          item: {
            id: "bucket1",
            type: "bucket",
            label: `Bucket items: ${sceneData[sceneKey].length}`,
            start: 0,
            end: 4,
          }
        }),
        React.createElement(TimelineItem, {
          item: {
            id: "thumbnail1",
            type: "thumbnails",
            label: `Thumbnails for ${sceneKey}`,
            thumbnails: sceneThumbnails,
            start: 0,
            end: 4,
          }
        })
      );
    })
  )
);

// @ts-ignore
const TimelineEditor = ({sceneData}) => {
  return React.createElement(
    'div',
    { className: "container mx-auto my-8 p-4 bg-gray-900 text-white rounded-lg shadow-lg" },
    React.createElement(TimelineSection, { sceneData })
  );
};







// @ts-ignore
const Screen1 = ({ next }) => {
  const [fields, setFields] = useState([{ description: '', file: null }]);

  // @ts-ignore
  const addField = () => {
    setFields([...fields, { description: '', file: null }]);
  };

  // @ts-ignore
  const handleDescriptionChange = (index, event) => {
    const newFields = fields.slice();
    newFields[index].description = event.target.value;
    setFields(newFields);
  };

  // @ts-ignore
  const handleFileChange = (index, event) => {
    const newFields = fields.slice();
    newFields[index].file = event.target.files[0];
    setFields(newFields);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-2">🎬</span>
        <h1 className="text-2xl font-bold">Video Description</h1>
      </div>
      <div className="border-8 border-blue-500 p-8 w-3/4 max-w-screen-md flex flex-col items-center">
        {fields.map((field, index) => (
          <div key={index} className="mb-4 w-full">
            <div className="flex items-center mb-2">
              <span className="mr-2">What are you making? </span>
              <input
                type="text"
                value={field.description}
                onChange={(e) => handleDescriptionChange(index, e)}
                className="p-2 border border-gray-300 rounded flex-1"
              />
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2">Upload Script</span>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                className="p-2 border border-gray-300 rounded flex-1"
              />
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2">Upload Music</span>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                className="p-2 border border-gray-300 rounded flex-1"
              />
            </div>
          </div>
          
        ))}
        <button onClick={next} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
          Generate
        </button>
      </div>
    </div>
  );
};

// @ts-ignore
const Screen2 = ({ next }) => {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('https://docs.google.com/spreadsheets/d/1xnpHgGh9IN7jsEEfo9dA_4GSONtRtf7qC7-ovtd5prg/edit?gid=1556275309#gid=1556275309');
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 20;

  // @ts-ignore
  const fetchExcel = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Filter data to include only columns A to G
      // @ts-ignore
      jsonData = jsonData.map(row => row.slice(0, 11));
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching or parsing Excel file:', error);
    }
  };

  // @ts-ignore
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleFetchClick = () => {
    fetchExcel(url);
  };

  // @ts-ignore
  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => prevPage + direction);
  };

  const startIndex = currentPage * rowsPerPage;
  // @ts-ignore
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-2">📋</span>
        <h1 className="text-2xl font-bold">Organized Script</h1>
      </div>
      <div className="border-8 border-green-500 p-8 w-full max-w-screen-xl flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter Excel file URL"
          value={url}
          onChange={handleUrlChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button onClick={handleFetchClick} className="bg-green-500 text-white py-2 px-4 rounded mb-4">
          Fetch and Display
        </button>
        {paginatedData.length > 0 && (
          <div className="w-full overflow-auto">
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((
// @ts-ignore
                    cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(-1)}
                className="bg-green-500 text-white py-2 px-4 rounded"
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(1)}
                className="bg-green-500 text-white py-2 px-4 rounded"
                disabled={startIndex + rowsPerPage >= data.length}
              >
                Next
              </button>
            </div>
          </div>
        )}
        <button onClick={next} className="bg-green-500 text-white py-2 px-4 rounded mt-4">Next</button>
      </div>
    </div>
  );
};

// @ts-ignore
const Screen3 = ({ next }) => (
  
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="flex items-center mb-4">
      <span className="text-3xl mr-2">🎥</span>
      <h1 className="text-2xl font-bold">Video Editing</h1>
    </div>
    <div>Scene Editing</div>
    <TimelineEditor sceneData={sceneData} />
    <div>Montange Generation</div>
    <TimelineEditor sceneData={montageData} />
    <button onClick={next} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Build</button>
  </div>
);

const Screen4 = ({}) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="flex items-center mb-4">
      <span className="text-3xl mr-2">📽️</span>
      <h1 className="text-2xl font-bold">Final Video</h1>
    </div>
    <iframe
      title="Video Player"
      src="https://player.vimeo.com/video/955585862"
      width="1200" // Increased width
      height="1000" // Increased height
      // @ts-ignore
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
    ></iframe>
  </div>
);

function Editor() {
  const [screen, setScreen] = useState(1);

  const nextScreen = () => setScreen(screen + 1);

  return (
    <div>
      {screen === 1 && <Screen1 next={nextScreen} />}
      {screen === 2 && <Screen2 next={nextScreen} />}
      {screen === 3 && <Screen3 next={nextScreen} />}
      {screen === 4 && <Screen4 />}
    </div>
  );
}

export default Editor;
