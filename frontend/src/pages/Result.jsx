import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const Result = () => {
    const location = useLocation();
    const { state } = location;
    const election = state?.election; // Extract election data from location.state
    const [electionData, setElectionData] = useState([]);
    const [maxVotes, setMaxVotes] = useState(null);

    if (!election) {
        return <div>No election data found</div>;
    }

    useEffect(() => {
        const fetchElectionData = async () => {
            try {
                // Fetch election data from the server
                const response = await axios.get(`http://localhost:3000/dashboard/user/getResult`, {
                    params: {
                        electionName: election.electionName,
                    }
                });

                // Process the response data
                const data = response.data.data[1];
                setElectionData(data);

                // Find the maximum vote count
                const maxVoteCount = data.reduce((max, candidate) => {
                    return Math.max(max, candidate[4]); // Assuming candidate[4] is the vote count
                }, 0);

                // Set the maxVotes state
                setMaxVotes(maxVoteCount);


            } catch (error) {
                console.error(error);
            }
        };

        fetchElectionData();
    }, [election.electionName]);

    const convertUnixTime = (unixTime) => {
        // Assuming unixTime is already in milliseconds
        const date = new Date(unixTime);
        return date.toLocaleString();
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col gap-2 text-center p-2'>
                <div>
                    <span className='font-bold opacity-60'>elections :  </span>
                    <span className='text-5xl font-semibold'>{election.electionName}</span>
                </div>
                <div className='flex flex-col'>
                    <div>
                        <span className='font-bold opacity-60'>Starting time :  </span>
                        <span className='text-2xl font-semibold'>{convertUnixTime(election.startTime)}</span>
                    </div>
                    <div>
                        <span className='font-bold opacity-60'>Ending time : </span>
                        <span className='text-2xl font-semibold'>{convertUnixTime(election.endTime)}</span>
                    </div>
                </div>
            </div>

            <div className='bg-slate-200 w-full h-screen p-8'>
                {electionData === null ? (
                    <div className='w-8 h-8'><Loader /></div>
                ) : (
                    <div className='flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 '>
                        {electionData.map((candidate, index) => {
                            return (
                                <div key={index} className='flex flex-col w-full bg-white overflow-hidden rounded-lg border border-slate-400'>
                                    <h1 className='text-2xl px-4 pt-2 font-semibold'>{candidate[0]} {candidate[1]} {candidate[2]}</h1>
                                    <h2 className='text-lg px-4'>{candidate[3]}</h2>
                                    <div className='flex justify-end px-4 pb-2 items-end'>
                                        <h2 className='text-lg px-4'>Votes : {candidate[4]}</h2>
                                    </div>
                                    {(candidate[4] === maxVotes) ? <div className='bg-green-800 h-12'></div> : <div className='bg-slate-800 h-12'></div>}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Result;
