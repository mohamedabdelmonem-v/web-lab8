# web-lab8
build a first back-end: a small Node.js and Express server with several routes, a front-end page served by the same server, and a request-logging middleware
# Study Programme Information Server (Assignment 8)

## How to Install and Run
1. Clone the repository and navigate into the project directory.
2. Run `npm install` to install Express 5.
3. Start the server in production mode with `npm start` or development auto-reload mode with `npm run dev`.
4. Open `http://localhost:3000` in your browser.

## File Organization
- `server.js`: Main Express 5 server defining constants, custom logging/counting middlewares, API routes, static file serving, and 404 fallbacks.
- `public/index.html`: Semantic HTML dashboard introducing the study programme and providing interactive buttons for every API endpoint.
- `public/styles.css`: External stylesheet providing clean layout and terminal-style output formatting.
- `public/app.js`: Client-side JavaScript using the Fetch API to call endpoints and format status codes and responses.
- `package.json` & `package-lock.json`: Project metadata, ES module configuration (`"type": "module"`), scripts, and exact dependency tree.
- `.gitignore`: Excludes `node_modules/` and `.env` from version control.

## Middleware Placement & Counting Rules
- Both `requestLogger` and `requestCounter` are registered at the very top of `server.js` **before** `express.static` and route handlers.
- Because Express executes middleware sequentially in registration order, placing them first ensures **every incoming HTTP request**—including static assets (`index.html`, `styles.css`, `app.js`), valid API routes, redirects, and 404 misses—is logged and counted.

## curl Testing Evidence
 curl.exe --include http://localhost:3000/api/courses
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 181
ETag: W/"b5-LPXD3MX6ql4+p/ZROXDL+bH1v0M"
Date: Mon, 16 Nov 2026 20:38:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":101,"title":"Web Architecture & HTTP","credits":6},{"id":102,"title":"Modern Frontend Development","credits":6},{"id":103,"title":"Backend Systems with Node.js","credits":6}]

curl.exe --include -X POST http://localhost:3000/api/subscribe
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 20:39:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}


curl.exe --include http://localhost:3000/api/admin
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Mon, 16 Nov 2026 20:39:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}



curl.exe --include http://localhost:3000/old-page
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Mon, 16 Nov 2026 20:39:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello



 curl.exe --include http://localhost:3000/api/unknown
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 20:39:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}


 curl.exe --include http://localhost:3000/unknown-page
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 20
ETag: W/"14-IjpWptXxNNmy9uyakQZfBTjB+5M"
Date: Mon, 16 Nov 2026 20:40:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

404 - Page Not Found



## Reasoning Questions (Section 8)
1. **Route Order**: Moving the 404 fallback middleware to the top of `server.js` causes every single request (including `/` and `/api/courses`) to immediately return a `404 Not Found` response. Express matches middleware and routes from top to bottom, so an early catch-all intercepts requests before real routes are ever reached.
2. **Middleware `next()`**: Removing `next()` from the logger middleware causes the server to print the request timestamp and URL in the terminal, while the browser hangs indefinitely waiting for a response until it times out. Without `next()`, Express never passes control to subsequent routes to close the HTTP response cycle.
3. **Status Codes**: `POST /api/subscribe` returns `201 Created` rather than `200 OK` because it semantically informs the client that a new subscription resource/state was created. Returning `404 Not Found` instead of `200 OK` with an error text is essential so automated clients, browsers, and `fetch()` checks (`response.ok`) programmatically recognize that the resource does not exist.
4. **Configuration (`process.env.PORT`)**: Cloud hosting providers dynamically assign available ports via environment variables at runtime rather than allowing apps to hard-code port `3000`. Reading `process.env.PORT || 3000` ensures the server runs seamlessly both in production environments and locally on a developer's machine.
5. **Dependencies (`node_modules`)**: `node_modules` contains thousands of third-party files that bloat repository size and slow down Git operations, while `package-lock.json` already locks exact dependency versions. After cloning the repo, a teammate simply runs `npm install` to reconstruct the identical `node_modules` folder locally.
6. **Same Origin**: Opening `index.html` directly from disk (`file://`) breaks relative URLs like `/api/courses` because the browser resolves them against the local filesystem instead of `http://localhost:3000`. Even if full URLs were used, browsers enforce the **Same-Origin Policy (SOP)** and block cross-origin requests unless the server explicitly enables CORS headers.

## Self-Study Notes
- **Process Diagnostics**: Researched the Node.js global `process` object documentation and used `process.version` to retrieve the active Node runtime version and `process.uptime()` (rounded with `Math.floor`) to report server uptime in seconds.
- **Explicit Content Types**: Learned how Express sets MIME types via `res.type('text/plain')` before calling `.send()`, ensuring browsers and `curl` interpret `/robots.txt` and `/hello` strictly as plain text rather than HTML.
- **Pretty-Printing JSON in Browser**: Used `JSON.stringify(parsedJson, null, 2)` inside a `try/catch` block in `app.js` to indent JSON payloads by 2 spaces inside a `<pre>` tag while gracefully falling back to plain text for non-JSON routes.

## Challenges Faced
1. **Express 5 Wildcard Compatibility**: Express 5 drops support for legacy `app.get('*')` syntax; resolved this by using a parameterless `app.use((req, res) => ...)` fallback at the bottom of the middleware stack.
2. **Working Directory Independence**: Ensuring `public/` loads correctly regardless of the folder from which `node` is invoked by deriving `__dirname` via `fileURLToPath(import.meta.url)` and `path.join`.