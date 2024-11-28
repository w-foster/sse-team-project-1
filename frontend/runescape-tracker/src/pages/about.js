import React from 'react';
import './styles/about.css'
import NavBar from '../components/common/SearchBar/NavBar';

function About() {
  return (
    <>
    <NavBar active="about" />
    <div className="debug-full-page">
      <h1>About Page</h1>
    </div>
    </>
  );
}

export default About;