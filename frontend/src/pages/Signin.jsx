import React, { useState, useRef, useEffect } from 'react';
import Inputbox from '../components/Inputbox';
import Heading from '../components/Heading';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const navigate = useNavigate();

  function validateEmailandPassword  ()  {
    const emailValid = emailInputRef.current && emailInputRef.current.checkValidity();
    const passwordValid = passwordInputRef.current && passwordInputRef.current.checkValidity();
    return emailValid && passwordValid
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmission();
    }
  };

  function isEmpty  ()  {
    return email !== '' && password !== '';
  };

  const handleSubmission = async () => {
    setIsLoading(true);
    if (isEmpty()) {
      if (validateEmailandPassword()) {
        await axios.post('http://localhost:3000/signin', {
          email: email,
          password: password
        }).then((response) => {
          setIsLoading(false);
          localStorage.setItem('userId', email);
          if ((response.data.result)) {
            navigate('/adminDashboard',{replace:true});
          }
          else {
            navigate('/voterDashboard',{replace:true});
          }
        }).catch((error) => {
          console.log(error);
        })
        
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password]);

  return (
    <div className='flex flex-col bg-slate-400 h-screen items-center justify-center'>
      <div className='bg-white w-72 h-fit p-4 rounded-lg items-center shadow-2xl sm:w-96 md:w-[432px]'>
        <Heading payload="Sign In" />
        <p className="text-center text-lg font-medium opacity-50 tra mt-2">
          Enter your credentials to access your account
        </p>
        <Inputbox
          ref={emailInputRef}
          onchange={e => setEmail(e.target.value)}
          type="email"
          title='Email'
          hint='abc@example.com'
          inputId="email"
        />
        <Inputbox
          ref={passwordInputRef}
          onchange={e => setPassword(e.target.value)}
          type='password'
          title='Password'
          hint='******'
          inputId="password"
        />
        {isLoading ? (
          <div className='flex justify-center mt-2'>
            <Loader />
          </div>
        ) : (
          <Button payload='Sign In' onclick={handleSubmission} />
        )}
        {/* <p className='text-center mt-2'>
          Don't have an account? <a href="/signup" className="underline underline-offset-2">Sign Up</a>
        </p> */}
      </div>
    </div>
  );
};

export default Signin;
