import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ParticipantForm from '../components/ParticipantForm';
import { MemoryRouter, Route } from 'react-router-dom';

const mockFormData = {
  title: 'Test Form',
  questions: [
    { type: 'text', prompt: 'What is your name?' },
    {
      type: 'multiple-choice',
      prompt: 'Favorite color?',
      options: ['Red', 'Blue', 'Green'],
    },
  ],
};

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockFormData })),
  post: jest.fn(() => Promise.resolve()),
}));

describe('ParticipantForm Component', () => {
  it('renders the form title and questions', async () => {
    render(
      <MemoryRouter initialEntries={['/form/12345']}>
        <Route path="/form/:formId">
          <ParticipantForm />
        </Route>
      </MemoryRouter>
    );

    // Simulate async load
    await screen.findByText(mockFormData.title);

    expect(screen.getByText(mockFormData.title)).toBeDefined();
    expect(screen.getByText('What is your name?')).toBeDefined();
    expect(screen.getByText('Favorite color?')).toBeDefined();
  });

  it('allows text response to be entered', async () => {
    render(
      <MemoryRouter initialEntries={['/form/12345']}>
        <Route path="/form/:formId">
          <ParticipantForm />
        </Route>
      </MemoryRouter>
    );

    await screen.findByText(mockFormData.title);

    const textInput = screen.getByPlaceholderText(/Response/);
    fireEvent.change(textInput, { target: { value: 'John Doe' } });

    expect(textInput).toContain('John Doe');
  });

  it('allows a multiple-choice option to be selected', async () => {
    render(
      <MemoryRouter initialEntries={['/form/12345']}>
        <Route path="/form/:formId">
          <ParticipantForm />
        </Route>
      </MemoryRouter>
    );

    await screen.findByText(mockFormData.title);

    const radioButton = screen.getByLabelText('Red');
    fireEvent.click(radioButton);

    expect(radioButton).toBeTruthy();
  });

  it('submits the responses successfully', async () => {
    render(
      <MemoryRouter initialEntries={['/form/12345']}>
        <Route path="/form/:formId">
          <ParticipantForm />
        </Route>
      </MemoryRouter>
    );

    await screen.findByText(mockFormData.title);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Responses submitted!')).toBeDefined();
  });
});
