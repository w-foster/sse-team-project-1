import React, { createContext, useContext, useState } from 'react';

// Create the context -- global favourites state to synchronise sub-components
const FavouritesContext = createContext();

// Custom hook to use the context
export const useFavourites = () => useContext(FavouritesContext);

// FavouritesProvider -- wraps any high-level component within App.js that uses faves
export const FavouritesProvider = ({ children }) => {
    const url = process.env.NODE_ENV === "development"
        ? "http"
        : "https";

    const [favourites, setFavourites] = useState([]);

    // Fetch favourites on app load



}