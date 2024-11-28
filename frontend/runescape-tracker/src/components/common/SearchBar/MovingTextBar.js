import React from 'react';
import './styles/MovingTextBar.css'; // Import the CSS for styling

const MovingTextBar = ({ text }) => {
    return (
        <div className="moving-text-bar">
            <span>{text || "Select an item to view its description"}</span>
        </div>
    );
};

export default MovingTextBar;
