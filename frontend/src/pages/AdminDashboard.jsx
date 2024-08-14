import React, { useState, useEffect } from 'react';
import Heading from '../components/Heading';
import Button from '../components/Button';
import FocusedButton from '../components/FocusedButton';
import Loader from '../components/Loader';
import Schedualed from './Schedualed';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EndedElections from './EndedElections';
import Running from './Running';

const AdminDashboard = () => {
  const [focus, setFocus] = useState(1);
  const navigate = useNavigate();
  const [finishedElections, setFinishedElections] = useState([]);
  const [runningElections, setRunningElections] = useState([]);
  const [scheduledElections, setScheduledElections] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard/admin/getElections');
        const elections = response.data.elections;

        // Validate the data structure
        if (!Array.isArray(elections)) {
          console.error('Expected an array of elections but received:', elections);
          return;
        }

        const currentTime = new Date().getTime();

        // Convert times to milliseconds if they are in seconds
        const formattedElections = elections.map(election => ({
          ...election,
          startTime: parseInt(election.startTime, 10) * 1000, // Convert to milliseconds
          endTime: parseInt(election.endTime, 10) * 1000    // Convert to milliseconds
        }));

        setFinishedElections(formattedElections.filter(election => currentTime > election.endTime));
        setRunningElections(formattedElections.filter(election => currentTime >= election.startTime && currentTime <= election.endTime));
        setScheduledElections(formattedElections.filter(election => currentTime < election.startTime));

        setIsFetching(false);

      } catch (error) {
        console.log(error);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='flex flex-col py-6 px-5'>
      <div className='flex flex-row gap-4 px-4 justify-center'>
        <div className='flex flex-grow justify-center'><Heading payload='Admin Dashboard' /></div>
        <div className='flex gap-4'>
          <button onClick={() => navigate('/addElection')}>
            <img src='/icons8-schedule-100.png' className='w-8 h-8' alt='Schedule Logo' />
          </button>
          <button onClick={() =>
            {localStorage.removeItem('userId');
            navigate('/',{replace:true})}}>
            <img src='/icons8-logout-96.png' className='w-8 h-8' alt='logout Logo' />
          </button>
        </div>
      </div>
      <hr />
      <div className='flex flex-row justify-around gap-2'>
        {(focus === 0) ? <FocusedButton payload="Results" onclick={() => setFocus(0)} /> :
          <Button payload="Results" onclick={() => setFocus(0)} />}

        {(focus === 1) ? <FocusedButton payload="Running" onclick={() => setFocus(1)} /> :
          <Button payload="Running" onclick={() => setFocus(1)} />}

        {(focus === 2) ? <FocusedButton payload="Scheduled" onclick={() => setFocus(2)} /> :
          <Button payload="Scheduled" onclick={() => setFocus(2)} />}

      </div>
      {(isFetching) ? <div className='w-screen h-screen flex items-center justify-center '><Loader /></div> :
        <div className='py-4'>
          {focus === 0 && <EndedElections data={finishedElections} />}
          {focus === 1 && <Running data={runningElections} />}
          {focus === 2 && <Schedualed data={scheduledElections} />}
        </div>}
    </div>
  );
};

export default AdminDashboard;
