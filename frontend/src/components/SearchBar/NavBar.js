import React from "react";
import { Link, useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './styles/NavBar.css';


export default function NavBar({ className }) {
  
  const location = useLocation(); // GET THE CURRENT URL (ROUTE)

  // Make random item ID for fun button!!
  const maximum = 5000;
  const minimum = 10;
  const randomItemId = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  const navItems = [
    { label: 'Dashboard', path: '/items' },
    { label: 'About', path: '/about' },
    { label: 'Popular', path: '/items/popular' },
    { label: 'Alchemy', path: '/items/alchemy' },
    { label: 'Curious?', path: `/items/${randomItemId}` },
  ]

  return (
    <div className={className}>
        <div className="nav-container">
            <Stack direction='row' spacing={2} className='nav-list'>
                {navItems.map((button) => (
                    <Button
                        key={button.path}
                        variant={location.pathname === button.path ? 'disabled' : 'outlined'}  // disable buttons for current page
                        component={Link}
                        to={button.path}
                    >
                        {button.label}
                    </Button>
                ))}
            </Stack>
        </div>
    </div>
  );

};

