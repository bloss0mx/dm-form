import React from 'react';
import logo from './logo.svg';
import './App.css';
import DmForm from './dm-form';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header"></header>
      <h1>Owl-Form</h1>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <DmForm />
    </div>
  );
};

export default App;
