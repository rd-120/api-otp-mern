import React from 'react';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import NotFound from './components/NotFound';
import { Route, Routes } from 'react-router-dom';
import EmailVerification from './components/auth/EmailVerification';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/verification" element={<EmailVerification />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
