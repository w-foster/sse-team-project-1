import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; // Provides matchers like "toBeInTheDocument"
import AlchemyTable from '../../../src/components/alchemy/AlchemyTable';

global.fetch = jest.fn(); // Mock global fetch API

describe('AlchemyTable Component', () => {
  const mockAddFavourite = jest.fn();
  const mockRemoveFavourite = jest.fn();

  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockReset();
  });

  const mockFavourites = [1, 3]; // Mock favorite item IDs

  const mockPriceData = [
    { id: 1, name: 'Item 1', high: 200, low: 150, icon: 'icon1.png' },
    { id: 2, name: 'Item 2', high: 300, low: 250, icon: 'icon2.png' },
  ];

  const mockHighAlchData = [
    { id: 1, highalch: 400 },
    { id: 2, highalch: 500 },
  ];

  it('renders the DataGrid with data', async () => {
    // Mock fetch responses
    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockPriceData),
      }) // Mock /api/items
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockHighAlchData),
      }); // Mock /api/high-alch

    // Render component with necessary props
    render(
      <BrowserRouter>
        <AlchemyTable
          favourites={mockFavourites}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </BrowserRouter>
    );

    // Wait for the fetch to resolve and rows to populate
    expect(await screen.findByText('Item 1')).toBeInTheDocument();
    expect(await screen.findByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('High Margin')).toBeInTheDocument();
  });

  it('handles adding a favorite', async () => {
    render(
      <BrowserRouter>
        <AlchemyTable
          favourites={mockFavourites}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </BrowserRouter>
    );

    // Wait for the rows to render
    const favoriteButton = await screen.findAllByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteButton[1]); // Simulate clicking the favorite button on the second item

    // Verify addFavourite was called with the correct ID
    expect(mockAddFavourite).toHaveBeenCalledWith(2);
  });

  it('handles removing a favorite', async () => {
    render(
      <BrowserRouter>
        <AlchemyTable
          favourites={mockFavourites}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </BrowserRouter>
    );

    // Wait for the rows to render
    const favoriteButton = await screen.findAllByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteButton[0]); // Simulate clicking the favorite button on the first item

    // Verify removeFavourite was called with the correct ID
    expect(mockRemoveFavourite).toHaveBeenCalledWith(1);
  });

  it('navigates to item detail page on row click', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <AlchemyTable
          favourites={mockFavourites}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </BrowserRouter>
    );

    // Wait for the rows to render
    const row = await screen.findByText('Item 1');
    fireEvent.click(row); // Simulate clicking the row

    // Verify navigate was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith('/items/1');
  });
});
