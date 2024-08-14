import React from "react";

const Running = ({ data }) => {


  if (!data.length) {
    return (<div className="flex justify-center h-full font-medium opacity-70 text-xl">No running Elections yet</div>);
  }


  const convertUnixTime = (unixTime) => {
    // Assuming unixTime is already in milliseconds
    const date = new Date(unixTime);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
      {data.map((item, index) => (
        <div
          className="flex px-2 min-w-[300px] gap-6"
          key={item.electionName || index}
          style={{ cursor: 'pointer' }}  // Optional: add cursor pointer to indicate clickable items
        >
          <div className="flex flex-col flex-grow rounded-lg overflow-hidden border border-slate-400">
            <div className="flex flex-col flex-grow p-3">
              <h1 className="text-3xl font-semibold">{item.electionName}</h1>
              <h1 className="font-bold opacity-50">Starting time:</h1>
              <h1 className="text-xl font-medium">{convertUnixTime(item.startTime)}</h1>
              <h1 className="font-bold opacity-50">Ending time:</h1>
              <h1 className="text-xl font-medium">{convertUnixTime(item.endTime)}</h1>
              <h1 className="font-bold opacity-50">Total Candidates:</h1>
              <h1 className="text-xl font-medium">{item.candidates.length}</h1>
            </div>
            <div className="h-12 bg-slate-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Running;