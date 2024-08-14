import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/Heading';
import Inputbox from '../components/Inputbox';
import Button from '../components/Button';
import axios from 'axios';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const rePasswordInputRef = useRef(null);

  const validateForm = () => {
    const emailValid = emailInputRef.current && emailInputRef.current.checkValidity();
    const passwordValid = passwordInputRef.current && passwordInputRef.current.checkValidity();
    const rePasswordValid = rePasswordInputRef.current && rePasswordInputRef.current.checkValidity();
    const passwordsMatch = password === rePassword;

    setPasswordsMatch(passwordsMatch);

    return emailValid && passwordValid && rePasswordValid && passwordsMatch;
  };

  const isEmpty = () => {
    return firstName !== '' && lastName !== '' && email !== '' && password !== '' && rePassword !== '';
  };

  const handleSubmission = async () => {
    if (isEmpty()) {

      if (validateForm()) {
        await axios.post('http://localhost:3000/signup', {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        }).then((response) => {
          navigate('/signin',{replace:true});
        }).catch((error) => {
          console.log(error);
        });
      } 
      else {
        alert('Incorrect values');
      }}

    else {
      alert('Please fill all the fields');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmission();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [firstName, lastName, email, password, rePassword]);

  useEffect(() => {
    validateForm();
  }, [password, rePassword]);

  return (
    <div className='flex flex-col bg-slate-400 h-screen items-center justify-center'>
      <div className="bg-white w-72 h-fit p-4 rounded-lg items-center shadow-2xl sm:w-96 md:w-[432px]">
        <Heading payload="Sign Up" />
        <p className="text-center text-lg font-medium opacity-50 tra mt-2">Enter your information to create an account</p>
        <Inputbox
          onchange={e => setFirstName(e.target.value)}
          title='First Name'
          hint='John'
        />
        <Inputbox
          onchange={e => setLastName(e.target.value)}
          title='Last Name'
          hint='Doe'
        />
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
        <Inputbox
          ref={rePasswordInputRef}
          onchange={e => setRePassword(e.target.value)}
          type='password'
          title='Re-enter Password'
          hint='******'
          inputId="rePassword"
        />
        {!passwordsMatch && (
          <p className='text-red-500 text-center mt-2'>Passwords do not match!</p>
        )}
        <Button
          id='signup'
          onclick={handleSubmission}
          payload='Sign Up'
        />
        <p className='text-center mt-2'>
          Already have an account? <a href="/" className="underline underline-offset-2">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
