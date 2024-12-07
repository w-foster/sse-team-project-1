import React from 'react';
import { render, screen } from '@testing-library/react';
import TitleBar from '../../../src/components/SearchBar/TitleBar';
import NavBar from '../../../src/components/SearchBar/NavBar';
import SearchBar from '../../../src/components/SearchBar/SearchBar';
import TitleAndLogo from '../../../src/components/SearchBar/TitleAndLogo';

// Mock the child components
jest.mock('../../../src/components/SearchBar/NavBar', () => jest.fn(() => <div>NavBar</div>));
jest.mock('../../../src/components/SearchBar/SearchBar', () => jest.fn(() => <div>SearchBar</div>));
jest.mock('../../../src/components/SearchBar/TitleAndLogo', () => jest.fn(() => <div>TitleAndLogo</div>));

describe('TitleBar', () => {
  it('renders the TitleAndLogo component', () => {
    render(<TitleBar />);
    // Check if the TitleAndLogo component is rendered
    expect(screen.getByText('TitleAndLogo')).toBeInTheDocument();
  });

  it('renders the NavBar component', () => {
    render(<TitleBar />);
    // Check if the NavBar component is rendered
    expect(screen.getByText('NavBar')).toBeInTheDocument();
  });

  it('renders the SearchBar component', () => {
    render(<TitleBar />);
    // Check if the SearchBar component is rendered
    expect(screen.getByText('SearchBar')).toBeInTheDocument();
  });

  it('applies the correct styles', () => {
    render(<TitleBar />);
    const titleBarElement = screen.getByText('TitleAndLogo').closest('div');
    
    // Check if the TitleBar has the right class and inline styles
    expect(titleBarElement).toHaveStyle('background-color: var(--accentLightBackground)');
    expect(titleBarElement).toHaveStyle('color: var(--primaryLight)');
  });
});