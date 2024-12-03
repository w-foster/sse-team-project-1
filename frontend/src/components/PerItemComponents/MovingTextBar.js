import React, { useEffect, useState } from 'react';

const MovingTextBar = ({ itemId }) => {
    const [description, setDescription] = useState('');
    const url = process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:5000/'
        : 'https://runescape-tracker.impaas.uk/';

    // Fetch item description
    useEffect(() => {
        const fetchItemDescription = async () => {
            try {
                const response = await fetch(`${url}/api/item-description/${itemId}`);
                if (!response.ok) throw new Error('Failed to fetch item description');
                const data = await response.json();
                setDescription(data.description || 'No description available.');
            } catch (err) {
                console.error('Error fetching item description:', err);
                setDescription('Error fetching description.');
            }
        };

        if (itemId) {
            fetchItemDescription();
        }
    }, [itemId]);

    return (
            <div class="relative overflow-hidden w-full h-[40px] border border-[#ddd] flex items-center justify-start box-border
                bg-primaryLightBackground dark:bg-primaryDarkBackground
                text-primaryLight dark:text-primaryDark">
                <span class="inline-block whitespace-nowrap animate-scroll-left">
                    {description || 'Select an item to view its description'}
                </span>
            </div>
    );
};

export default MovingTextBar;

