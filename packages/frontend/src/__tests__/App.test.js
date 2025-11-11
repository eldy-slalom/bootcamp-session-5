import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn();

test('renders TODO App heading', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays empty state message when no todos', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const emptyMessage = await screen.findByText(/no todos yet/i);
  expect(emptyMessage).toBeInTheDocument();
});

test('displays todos from API', async () => {
  const mockTodos = [
    { id: 1, title: 'Test Todo 1', completed: false },
    { id: 2, title: 'Test Todo 2', completed: true },
  ];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos,
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const todo1 = await screen.findByText('Test Todo 1');
  const todo2 = await screen.findByText('Test Todo 2');
  
  expect(todo1).toBeInTheDocument();
  expect(todo2).toBeInTheDocument();
});

test('calculates and displays correct stats', async () => {
  const mockTodos = [
    { id: 1, title: 'Todo 1', completed: false },
    { id: 2, title: 'Todo 2', completed: false },
    { id: 3, title: 'Todo 3', completed: true },
  ];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos,
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });
  
  expect(screen.getByText('1 completed')).toBeInTheDocument();
});

test('calls delete API when delete button clicked', async () => {
  const mockTodos = [
    { id: 1, title: 'Test Todo', completed: false },
  ];

  // Mock initial fetch
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos,
  });

  // Mock delete request
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Todo deleted' }),
  });

  // Mock refetch after delete
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const todoText = await screen.findByText('Test Todo');
  expect(todoText).toBeInTheDocument();

  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  fireEvent.click(deleteButtons[0]);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

test('displays error message when API fails', async () => {
  fetch.mockRejectedValueOnce(new Error('API Error'));

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const errorMessage = await screen.findByText(/error loading todos/i);
  expect(errorMessage).toBeInTheDocument();
});

afterEach(() => {
  jest.clearAllMocks();
});
