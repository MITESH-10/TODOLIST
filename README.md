# Daymark

A lightweight, dependency-free to-do list for keeping daily work visible and manageable.

## Features

- Add tasks with a priority and optional due date
- Mark tasks complete or remove them
- Filter by all tasks, today, upcoming, or completed
- Search tasks by title
- View open-task, due-today, and completion totals
- Persist tasks in the browser with `localStorage`
- Responsive layout for desktop and mobile screens

## Run locally

No build step or package installation is required.

1. Open `index.html` directly in a browser, or serve the folder with a local web server:

   ```powershell
   python -m http.server 8000
   ```

2. Visit [http://localhost:8000](http://localhost:8000).

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and accessible controls |
| `style.css` | Responsive visual design and layout |
| `app.js` | Task state, filtering, search, and local persistence |

## Data storage

Tasks are saved under the `daymark-tasks` key in the browser's local storage. They remain available after refreshing the page, but are specific to the browser and device being used.

## Browser support

Daymark uses standard HTML, CSS, and modern JavaScript APIs. A current version of Chrome, Edge, Firefox, or Safari is recommended.