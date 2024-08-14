import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const ElectionPage = () => {
    const location = useLocation();
    const { election } = location.state || {};
    const [ableToVote, setAbleToVote] = useState(null);
    const [voted, setVoted] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const navigator = useNavigate();
    if (!election) {
        return <div>No election data found</div>;
    }

    const convertUnixTime = (unixTime) => {
        const date = new Date(unixTime);
        return date.toLocaleString();
    };

    useEffect(() => {
        if (voted.length > 0) {

            setAbleToVote(!voted.includes(localStorage.getItem('userId')));
            console.log(ableToVote);
            
        }
        else{
            setAbleToVote(true);
        }

    }, [voted]);

    useEffect(() => {
        const fetchElectionData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/dashboard/user/getElectionDetails`, {
                    params: { electionName: election.electionName, }
                });

                setVoted(response.data.electionDetails[4]);
                console.log('flag 1');
                
                
            } catch (error) {
                console.error(error);
            }
        };

        fetchElectionData();
    }, [])

    const handleVote = async (candidateFullName) => {
        setIsVoting(true);
        await axios.post('http://localhost:3000/dashboard/user/vote', {
            electionName: election.electionName,
            candidateName: candidateFullName,
            userId: localStorage.getItem('userId')
        }).then((response) => {
            setIsVoting(false);
            setAbleToVote(false);
            alert('Voted Successfully');
            navigator('/voterDashboard',{replace:true});
        }).catch((error) => {
            console.log(error);
            setIsVoting(false);
        }
        );
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col gap-2 text-center p-2'>
                <div>
                    <span className='font-bold opacity-60'>elections :  </span>
                    <span className='text-5xl font-semibold'>{election.electionName}</span>
                </div>
                <div>
                    <span className='font-bold opacity-60'>Starting time :  </span>
                    <span className='text-2xl font-semibold'>{convertUnixTime(election.startTime)}</span>
                </div>
                <div>
                    <span className='font-bold opacity-60'>Ending time : </span>
                    <span className='text-2xl font-semibold'>{convertUnixTime(election.endTime)}</span>
                </div>
            </div>
            <div className='bg-slate-200 w-full h-screen'>
                {
                    (ableToVote === null) ? <div className='w-screen h-screen flex items-center justify-center '><Loader /></div> :
                        <div className='flex flex-col p-3 gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 '>
                            {election.candidates.map(candidate => {
                                const candidateFullName = `${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`;
                                return (
                                    <div key={candidateFullName} className='flex flex-col bg-white w-full overflow-hidden rounded-lg border border-slate-400'>
                                        <h1 className='text-2xl px-4 pt-2 font-semibold'>{candidate.firstName} {candidate.middleName} {candidate.lastName}</h1>
                                        <h2 className='text-lg px-4'>{candidate.partyName}</h2>
                                        <div className='flex justify-end px-4 pb-2 items-end'>
                                            {!ableToVote ? <h1>Already Voted</h1> :
                                             !isVoting ? (
                                                <button onClick={() => handleVote(candidateFullName)}>
                                                    <img src='/icons8-voting-64.png' alt='vote logo' className='h-10 w-10'></img>
                                                </button>
                                            ) : (
                                                <Loader />
                                            )}
                                        </div>
                                        <div className='bg-slate-800 h-12'></div>
                                    </div>
                                );
                            })}
                        </div>

                }
            </div>
        </div>
    );
};

export default ElectionPage;
