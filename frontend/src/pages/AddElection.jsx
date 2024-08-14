import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import Inputbox from '../components/Inputbox'
import CandidateCard from '../components/CandidateCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AddElection = () => {

  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const Navigate = useNavigate();


  const handleAddCandidate = () => {

    if (firstName === '' || middleName === '' || lastName === '' || partyName === '') {
      // Display an error message or perform some other action
      alert('Please fill all the fields');

      return;
    }

    const candidate = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      partyName: partyName
    }
    setCandidates([...candidates, candidate]);
  }

  const handleUpload = async () => {
    setIsUploading(true);
    // Check if any data is empty
    if (
      electionName === '' ||
      startTime === '' ||
      endTime === '' ||
      candidates.length === 0
    ) {
      alert('Please fill all the fields');
      isUploading(false);
      return;
    }

    // Check if start time is smaller than end time
    if (new Date(startTime) >= new Date(endTime)) {
      alert('Start time should be smaller than end time');
      isUploading(false);
      return;
    }

    // Check if start and end time are bigger than current time
    const currentTime = new Date();
    if (new Date(startTime) <= currentTime || new Date(endTime) <= currentTime) {
      alert('Start and end time should be bigger than current time');
      isUploading(false);
      return;
    }

    // Create an object with all the data
    const electionData = {
      electionName: electionName,
      startTime: startTime,
      endTime: endTime,
      candidates: candidates
    };


    const response = await axios.post('http://localhost:3000/dashboard/admin/addElection', electionData);
    
    setIsUploading(false);

    if (response.status === 200) {
      alert('Election added successfully');
      Navigate('/adminDashboard',{replace:true});
    } else {
      console.log('Error in adding election');
    }

  }

  return (
    <div className='flex flex-col '>
      <div className='py-3'>
        <Heading payload='Add Election' />
      </div>
      <div className='flex flex-col gap-8 justify-evenly h-screen  w-screen bg-slate-200 p-8  '>

        {/* inputs */}
        <div className='flex flex-col gap-8 md:flex-row'>

          {/* Election Details */}
          <div className='flex flex-col gap-2 bg-white rounded-lg p-4 shadow-2xl md:flex-grow'>
            <p className="flex flex-col text-center text-lg font-medium mt-2">
              <span className='opacity-50'>
                Enter the details about
              </span>
              <span className='text-3xl'>
                The Election 
              </span>
            </p>
            <Inputbox title='Election Name' hint='World - 2024' onchange={e => setElectionName(e.target.value)} />
            <Inputbox title='Start Time' type='datetime-local' onchange={e => setStartTime(e.target.value)} />
            <Inputbox title='End Time' type='datetime-local' onchange={e => setEndTime(e.target.value)} />
          </div>

          {/* Candidates Details */}
          <div className='flex flex-col gap-2 bg-white rounded-lg p-4 shadow-2xl md:flex-grow'>
            <p className="flex flex-col text-center text-lg font-medium mt-2">
              <span className='opacity-50'>
                Enter the details about
              </span>
              <span className='text-3xl'>
                Candidates
              </span>
            </p>
            <div>
              <Inputbox title='First Name' hint='Joe' onchange={e => { setFirstName(e.target.value) }} />
              <Inputbox title='Middle Name' hint='Albert' onchange={e => setMiddleName(e.target.value)} />
              <Inputbox title='Last Name' hint='Stark' onchange={e => setLastName(e.target.value)} />
              <Inputbox title='Party Name' hint='Universe' onchange={e => setPartyName(e.target.value)} />
            </div>
            <div className='flex justify-between px-6'>
              {isUploading ? <Loader /> :
              <button onClick={handleUpload}>
              <img src='/icons8-upload-52.png' className='h-10 w-10' alt='upload logo'></img>
            </button>
              }
              <button onClick={handleAddCandidate}>
                <img src='/icons8-add-64.png' alt='add logo'></img>
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 shadow-2xl h-fit'>
          <p className="flex flex-col text-center text-lg font-medium mt-2">
            <span className='opacity-50'>
              List of
            </span>
            <span className='text-3xl'>
              Candidates
            </span>
          </p>
          <div className='mt-4 flex flex-wrap gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
            {/* List of candidates will be displayed here */}
            {candidates.map((candidate, index) => (
              <CandidateCard
                key={index}
                firstName={candidate.firstName}
                middleName={candidate.middleName}
                lastName={candidate.lastName}
                partyName={candidate.partyName}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default AddElection
