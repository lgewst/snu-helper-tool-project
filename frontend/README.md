## Requirements

Install [Node >= 14.0.0 and npm >= 5.6](https://nodejs.org/en/) on your machine

## Installation

```
> cd frontend
> yarn
> yarn start
```

[localhost](http://localhost:3000) will open in your file. Make sure you have backend running.

## Usage

### Initialization

- You will encounter initialization page. Enter your own repo of chromium and webosose, current version, version you want to apply, and patch ID.
- If you want to re-enter other information, go to inspection tool > application > local storage and delete the keys.

### Conflict page

- After initialization, you can see folders/files that causes conflicts.
- Traverse through folders, and find file you want to inspect.
- Each file will show the code conflicts, author email, commit date and commit message.
- Click author email to see related commits made by the author.
- Hover over commit message to see more details.
- Hover over `clipboard` to see commit url and review url of that line. You can also get `related commit urls` ordered by modified files and commit message.
- It takes some time to get commit information. Wait for a while, or go to other page while waiting. It would not take as long when visiting the next time.
- Click red functions on the code, and modal will appear. Enter the version you wish to seek for.

### History page

- By entering the version of function, you would be able to see the changes between the two version, and the logs of commits that changed the function.
- Click `Left, Right` buttons to place the code you wish. It will show the difference between the two.

### Diff page

- [Diff page](http://localhost:3000/diff) page shows the altered code lines between the current version and the target version.
- You can traverse through the folders to see which folder/file altered a lot.
- It will take some time to render page.

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
