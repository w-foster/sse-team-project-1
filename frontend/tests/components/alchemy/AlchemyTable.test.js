import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Mocking the router for navigation
import AlchemyTable from './AlchemyTable'; // Adjust the import path as necessary
import * as reactRouterDom from 'react-router-dom'; // Mocking useNavigate
import '@testing-library/jest-dom'; // For the "toBeInTheDocument" matcher

// Mocking the dependencies
jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, columns, onRowClick }) => (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.field}>{col.headerName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} onClick={() => onRowClick({ row })}>
            {columns.map((col) => (
              <td key={col.field}>{row[col.field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

// Mocking fetch
global.fetch = jest.fn();

// Mocking the useNavigate hook
const mockNavigate = jest.fn();
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => mockNavigate);

describe('AlchemyTable', () => {
  const mockAddFavourite = jest.fn();
  const mockRemoveFavourite = jest.fn();

  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockReset();
  });

  it('renders the table with data from API', async () => {
    // Mock the API responses
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, name: 'Item 1', highalch: 100, high: 90, low: 50, icon: 'item1.png' }]),
    }); // Mock /api/items response
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, highalch: 120 }]),
    }); // Mock /api/high-alch response

    // Render the component inside a Router to handle navigation
    render(
      <Router>
        <AlchemyTable
          favourites={[]}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </Router>
    );

    // Wait for data to load and check if it's rendered
    await waitFor(() => screen.getByText('Item 1'));

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('calls addFavourite when the star icon is clicked', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, name: 'Item 1', highalch: 100, high: 90, low: 50, icon: 'item1.png' }]),
    });
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, highalch: 120 }]),
    });

    render(
      <Router>
        <AlchemyTable
          favourites={[]}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </Router>
    );

    await waitFor(() => screen.getByText('Item 1'));

    const starButton = screen.getByRole('button');
    fireEvent.click(starButton);

    // Check if the addFavourite function was called
    expect(mockAddFavourite).toHaveBeenCalledTimes(1);
  });

  it('calls removeFavourite when the star icon is clicked again', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, name: 'Item 1', highalch: 100, high: 90, low: 50, icon: 'item1.png' }]),
    });
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, highalch: 120 }]),
    });

    render(
      <Router>
        <AlchemyTable
          favourites={[1]} // Pass in this item as a favourite
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </Router>
    );

    await waitFor(() => screen.getByText('Item 1'));

    const starButton = screen.getByRole('button');
    fireEvent.click(starButton);

    // Check if the removeFavourite function was called
    expect(mockRemoveFavourite).toHaveBeenCalledTimes(1);
  });

  it('navigates to the correct page when a row is clicked', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, name: 'Item 1', highalch: 100, high: 90, low: 50, icon: 'item1.png' }]),
    });
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, highalch: 120 }]),
    });

    render(
      <Router>
        <AlchemyTable
          favourites={[]}
          addFavourite={mockAddFavourite}
          removeFavourite={mockRemoveFavourite}
        />
      </Router>
    );

    await waitFor(() => screen.getByText('Item 1'));

    const row = screen.getByText('Item 1').closest('tr');
    fireEvent.click(row);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/items/1');
  });
});
