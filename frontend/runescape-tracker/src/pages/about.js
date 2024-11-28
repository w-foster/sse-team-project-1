import React from 'react';
import './styles/about.css'
import NavBar from '../components/common/SearchBar/NavBar';

function About() {
  return (
    <div>
      <NavBar active="about" />
      <h1>About Page</h1>
    </div>
  );
}

export default About;