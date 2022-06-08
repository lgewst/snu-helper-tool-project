## Requirements
- Node >= 14.0.0
- npm >= 5.6

## Installation
[nodejs.org](https://nodejs.org/en/)

## How to build and run

```
> cd frontend
> yarn
> yarn start
```

[localhost](http://localhost:3000) will open in your file. Make sure you have backend running.

## UI

- [MUI:](https://mui.com/) install anything you want for frontend design
- toast: alert users for some information(usually for getting info from backend)

## Structure

```
src
├── Components                       # Subcomponent of each page
│   ├── ConflictInfo                 # Get conflict info for file page
│   └── PathInfo                     # Make breadcrumb
├── Contexts
│   └── initContext.tsx              # Uses context & local storage for the initializing information
├── Pages
│   ├── DiffPage                     # Shows the lines altered by each folder
│   ├── FilePage                     # Shows code & related information
│   ├── FolderPage                   # Traverse conflict-made folders
│   ├── HistoryPage                  # Shows function history
│   └── InitPage                     # For initializing
├── Utils
│   ├── Interface.ts                 # For storing interface types
│   └── storageKey.ts
├── Index.js
└── App.tsx                          # Root page
```

Use React and typescript
-eslint
-prettier
