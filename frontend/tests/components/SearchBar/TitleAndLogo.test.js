import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides matchers like toBeInTheDocument
import TitleAndLogo from '../../../src/components/TitleAndLogo'; // Adjust the path as necessary

describe('TitleAndLogo Component', () => {
  it('renders with the correct className', () => {
    const testClassName = 'test-class';
    render(<TitleAndLogo className={testClassName} />);
    
    const container = screen.getByRole('heading').parentElement; // Get the parent div
    expect(container).toHaveClass(testClassName);
  });

  it('displays the correct text', () => {
    render(<TitleAndLogo className="test-class" />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('RuneScape Tracker');
  });

  it('applies inline styles correctly', () => {
    render(<TitleAndLogo className="test-class" />);
    
    const container = screen.getByRole('heading').parentElement; // Get the parent div
    expect(container).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '20vw',
      justifyContent: 'center',
    });
  });
});
