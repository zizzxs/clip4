import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import AuthPage from './components/AuthPage';
import Layout from './components/Layout';

function App() {
  const { user } = useContext(AppContext);

  return (
    <>
      {user ? <Layout /> : <AuthPage />}
    </>
  );
}

export default App;
