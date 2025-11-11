# Patterns Discovered

## Purpose

This file documents reusable code patterns, best practices, and anti-patterns discovered during development. These patterns help maintain consistency across the codebase and enable AI assistants to make better suggestions.

**Note**: This file is committed to git. Add a pattern when you've seen it at least twice or when it represents a significant architectural decision.

---

## Pattern Template

Copy this template for each new pattern:

```markdown
### Pattern: [Pattern Name]

**Context**: When/where this pattern applies

**Problem**: What issue does this solve?

**Solution**: How to implement this pattern

**Example**:
```javascript
// Code example showing the pattern
```

**Related Files**: 
- `path/to/file1.js`
- `path/to/file2.js`

**Notes**: Additional considerations or variations
```

---

## Discovered Patterns

### Pattern: Initialize Arrays as Empty Array, Not Null

**Context**: Service initialization, data structure setup, any time you need a collection

**Problem**: 
- Initializing arrays as `null` causes "Cannot read property 'push' of null" errors
- Requires defensive null checks before every array operation
- Inconsistent with JavaScript best practices

**Solution**: 
Always initialize arrays as empty `[]` instead of `null`. This allows immediate use of array methods without null checks.

**Example**:
```javascript
// ❌ DON'T: Initialize as null
let todos = null;

// ✅ DO: Initialize as empty array
let todos = [];

// ✅ DO: This works immediately without checks
todos.push(newItem);

// ❌ DON'T: This requires null check first
if (todos !== null) {
  todos.push(newItem);
}
```

**Related Files**: 
- `packages/backend/src/app.js` - todos array initialization

**Notes**: 
- Use `null` only when absence of value is semantically meaningful (e.g., optional reference)
- For collections that will be populated, start with `[]`
- For objects that will be populated, start with `{}`

---

### Pattern: RESTful API Status Codes

**Context**: Express.js API endpoints, HTTP response handling

**Problem**: 
- Inconsistent status codes make API behavior unpredictable
- Clients need to know what happened with their request

**Solution**: 
Follow RESTful conventions for HTTP status codes:

**Example**:
```javascript
// ✅ 200 OK - Successful GET, PUT, PATCH, DELETE
app.get('/api/todos', (req, res) => {
  res.status(200).json(todos);
});

// ✅ 201 Created - Successful POST (resource created)
app.post('/api/todos', (req, res) => {
  const newTodo = { id: nextId++, ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ✅ 400 Bad Request - Invalid input/validation error
app.post('/api/todos', (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  // ... create todo
});

// ✅ 404 Not Found - Resource doesn't exist
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
});

// ✅ 500 Internal Server Error - Unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

**Related Files**: 
- `packages/backend/src/app.js` - All API endpoints

**Notes**: 
- Always include descriptive error messages in 4xx/5xx responses
- Use 204 No Content for DELETE operations that don't return data (optional)
- Consistent status codes make testing easier (tests can check exact status)

---

### Pattern: Express Request Validation

**Context**: API endpoints that accept user input

**Problem**: 
- Invalid input can crash the server or create bad data
- Need to validate before processing

**Solution**: 
Validate required fields at the start of route handlers and return 400 with descriptive errors

**Example**:
```javascript
// ✅ Validate required fields
app.post('/api/todos', (req, res) => {
  // Check required fields
  if (!req.body.title || req.body.title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  // Validation passed - proceed with business logic
  const newTodo = {
    id: nextId++,
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ✅ Validate ID format for update/delete
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  // Continue with deletion logic...
});
```

**Related Files**: 
- `packages/backend/src/app.js` - POST, PUT, PATCH endpoints

**Notes**: 
- Validate early, return early
- Provide specific error messages (not just "Invalid input")
- Use `trim()` to handle whitespace-only strings
- Consider using validation libraries (express-validator, Joi) for complex validation

---

### Pattern: ESLint Console Statement Exceptions

**Context**: Server startup, critical logging, debugging in development

**Problem**: 
- ESLint `no-console` rule flags all console statements as warnings
- Some console usage is legitimate (server startup, critical errors)
- Need to distinguish between debugging console.log (remove) vs operational logging (keep)

**Solution**: 
Use `eslint-disable-next-line no-console` for legitimate console usage, but remove debugging console statements

**Example**:
```javascript
// ✅ DO: Allow console for server startup (operational logging)
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

// ✅ DO: Allow console for critical errors
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// ❌ DON'T: Leave debugging console.log statements
app.get('/api/todos', (req, res) => {
  console.log('Getting todos...'); // Remove this
  res.json(todos);
});

// ✅ DO: Use proper error handling instead
app.get('/api/todos', (req, res) => {
  try {
    res.json(todos);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

**Related Files**: 
- `packages/backend/src/index.js` - Server startup logging
- `packages/backend/src/app.js` - API endpoints

**Notes**: 
- In production, consider using a proper logging library (winston, pino, bunyan)
- Reserve console.log/console.error for operational events (startup, shutdown, critical errors)
- Remove all debugging console statements before committing
- The eslint-disable comment documents that console usage is intentional
- For this exercise, the intentional console warning in index.js is acceptable for server startup

---

### Pattern: React Query Error Handling

**Context**: React Query hooks (useQuery, useMutation) for API calls

**Problem**: 
- API calls can fail for many reasons (network, server errors, invalid data)
- Users need feedback when things go wrong
- Must check response.ok to properly detect HTTP errors

**Solution**: 
Throw errors in queryFn for failed requests, use error state in components for user feedback

**Example**:
```javascript
// ✅ DO: Throw errors for failed requests
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      return response.json();
    },
  });
};

// ✅ DO: Use error state in component
function App() {
  const { data: todos = [], isLoading, error } = useTodos();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // ... rest of component
}

// ❌ DON'T: Ignore errors
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos');
      return response.json(); // May fail silently
    },
  });
};
```

**Related Files**: 
- `packages/frontend/src/App.js` - React Query hooks with error handling

**Notes**: 
- React Query automatically retries failed queries (can disable with retry: false)
- Always check response.ok for fetch requests
- Provide user-friendly error messages, not technical details
- Consider different error states: network errors, 404s, 500s, etc.

---

### Pattern: Relative API URLs in Frontend

**Context**: Frontend applications that call backend APIs

**Problem**: 
- Hardcoded URLs (http://localhost:3001) don't work in production
- Need different URLs for development, staging, production
- Difficult to maintain environment-specific configurations

**Solution**: 
Use relative URLs (/api/todos) and configure proxy in development

**Example**:
```javascript
// ✅ DO: Use relative URL
const API_URL = '/api/todos';

fetch(API_URL) // Works in dev (proxy) and production

// ❌ DON'T: Hardcode localhost
const API_URL = 'http://localhost:3001/api/todos'; // Breaks in production

// ✅ DO: Or use environment variable for flexibility
const API_URL = process.env.REACT_APP_API_URL || '/api/todos';
```

**Related Files**: 
- `packages/frontend/src/App.js` - API_URL constant
- `packages/frontend/package.json` - Proxy configuration (if needed)

**Notes**: 
- In development, create-react-app proxy handles /api routes to backend
- In production, deploy frontend and backend together or use CORS
- Relative URLs make code portable across environments
- Environment variables provide flexibility when needed

---

### Pattern: React Conditional Rendering for Loading/Error/Empty States

**Context**: React components that fetch data

**Problem**: 
- Need to show different UI for loading, error, empty, and data states
- Poor UX to show empty list while loading
- Users need feedback when errors occur

**Solution**: 
Check loading, error, and data length states to render appropriate UI

**Example**:
```javascript
function App() {
  const { data: todos = [], isLoading, error } = useTodos();

  // ✅ Show loading state first
  if (isLoading) {
    return <CircularProgress />;
  }

  // ✅ Show error state if fetch failed
  if (error) {
    return <Typography color="error">Error loading todos</Typography>;
  }

  // ✅ Show empty state if no data
  if (todos.length === 0) {
    return <Typography>No todos yet. Add one to get started!</Typography>;
  }

  // ✅ Show data when available
  return (
    <List>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </List>
  );
}

// ❌ DON'T: Render list while loading (flashes empty state)
function BadApp() {
  const { data: todos = [] } = useTodos();
  return <List>{todos.map(...)}</List>; // Shows empty list while loading
}
```

**Related Files**: 
- `packages/frontend/src/App.js` - Conditional rendering for different states

**Notes**: 
- Check states in order: loading → error → empty → data
- Use meaningful empty state messages (not just "No data")
- Provide actionable error messages when possible
- Consider skeleton screens for better perceived performance

---

### Pattern: React Testing Library with Material-UI

**Context**: Testing React components that use Material-UI (MUI)

**Problem**: 
- Need to test component behavior without testing MUI internals
- Must query elements in an accessible way
- IconButtons need labels for accessibility and testing

**Solution**: 
Use semantic queries (getByRole, getByText) and add aria-labels to interactive elements

**Example**:
```javascript
// ✅ DO: Add aria-labels to icon buttons
<IconButton
  onClick={handleDelete}
  aria-label="delete"
>
  <DeleteIcon />
</IconButton>

// ✅ DO: Query by role and name in tests
const deleteButton = screen.getByRole('button', { name: /delete/i });
fireEvent.click(deleteButton);

// ✅ DO: Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => [{ id: 1, title: 'Test' }],
  })
);

// ❌ DON'T: Query by className or test IDs unnecessarily
const deleteButton = screen.getByTestId('delete-button'); // Less maintainable

// ❌ DON'T: Skip QueryClientProvider wrapper
render(<App />); // React Query will fail

// ✅ DO: Wrap in QueryClientProvider for tests
const testQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

render(
  <QueryClientProvider client={testQueryClient}>
    <App />
  </QueryClientProvider>
);
```

**Related Files**: 
- `packages/frontend/src/__tests__/App.test.js` - React Testing Library tests
- `packages/frontend/src/App.js` - MUI components with aria-labels

**Notes**: 
- Disable retry in test QueryClient for faster failures
- Use waitFor for async operations
- Avoid multiple assertions in waitFor (lint rule)
- Mock fetch globally or per test
- Query by accessibility features, not implementation details
- Add aria-labels to icon buttons for better a11y and testing
