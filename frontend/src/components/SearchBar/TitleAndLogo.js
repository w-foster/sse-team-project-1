import React from 'react';

export default function TitleAndLogo({ className }) {
    return (
        <div 
            className={className} 
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '20vw',  // Fixed width at 20% of viewport width
                justifyContent: 'center'  // Center the content vertically within the div
            }}
        >
            <h2 
                className="font-bold text-slate-900 dark:text-white" 
                style={{
                    fontSize: '4vh',  // Font size relative to the container (which is 20% of vw)
                    margin: 0,        // Remove default margin for the heading
                    width: '100%',    // Ensure the text takes up the full width of the container
                    textAlign: 'center' // Center the text inside the container
                }}
            >
                RuneScape Tracker
            </h2>
        </div>
    );
}
