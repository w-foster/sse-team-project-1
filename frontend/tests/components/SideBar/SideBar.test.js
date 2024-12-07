import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useSessionInfo } from '../../../src/SessionInfoContext';
import SideBar from '../../../src/components/SideBar/SideBar'; // Adjust the import based on your project structure

// Mock useNavigate and useSessionInfo hooks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/SessionInfoContext', () => ({
  useSessionInfo: jest.fn(),
}));

describe('SideBar', () => {
  const mockItemList = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  const mockFavourites = [{ id: 1, name: 'Item 1' }];
  const mockRemoveFavourite = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders SignInButton when userId is not present', () => {
    useSessionInfo.mockReturnValue({ userId: null }); // Mock no userId

    render(
      <SideBar 
        itemList={mockItemList}
        favourites={mockFavourites}
        removeFavourite={mockRemoveFavourite}
      />
    );

    // Check if SignInButton is rendered
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('navigates to /signin when SignInButton is clicked', () => {
    useSessionInfo.mockReturnValue({ userId: null }); // Mock no userId
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <SideBar 
        itemList={mockItemList}
        favourites={mockFavourites}
        removeFavourite={mockRemoveFavourite}
      />
    );

    // Find and click SignInButton
    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    // Check if navigate was called with the correct argument
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });
});
