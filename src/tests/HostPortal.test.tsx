import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HostPortal from '../components/HostPortal';

describe('HostPortal Component', () => {
  it('renders the HostPortal form correctly', () => {
    render(<HostPortal />);

    expect(screen.getByPlaceholderText('Form Title')).toBeDefined();
    expect(screen.getByText('Add Question')).toBeDefined();
    expect(screen.getByText('Create Form')).toBeDefined();
  });

  it('adds a new question when "Add Question" is clicked', () => {
    render(<HostPortal />);
    fireEvent.click(screen.getByText('Add Question'));

    const questionInputs = screen.getAllByPlaceholderText(/Question \d+/);
    expect(questionInputs.length).toBe(2);
  });

  it('allows question prompt to be edited', () => {
    render(<HostPortal />);

    const questionInput = screen.getByPlaceholderText('Question 1');
    fireEvent.change(questionInput, { target: { value: 'What is your name?' } });

    expect(questionInput).toContain('What is your name?');
  });

  it('displays a generated form link after form creation', async () => {
    // Mock axios for the test
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.resolve({ data: { formId: '12345' } })),
    }));

    render(<HostPortal />);
    fireEvent.click(screen.getByText('Create Form'));

    // Simulate async
    await screen.findByText(/Form Link:/);
    expect(screen.getByText(/Form Link:/)).toBeDefined();
  });
});
