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
