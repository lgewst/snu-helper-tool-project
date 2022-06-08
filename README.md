# Sync-helper

## Requirements
- [Backend](https://github.com/lgewst/snu-helper-tool-project/tree/main/backend#requirements)  
- [Frontend](https://github.com/lgewst/snu-helper-tool-project/tree/main/backend#requirements)

## Installation
- [Backend](https://github.com/lgewst/snu-helper-tool-project/tree/main/backend#Installation)
- [Frontend](https://github.com/lgewst/snu-helper-tool-project/tree/main/backend#Installation)

## How to build and run

1. [pre-setting](https://github.com/lgewst/snu-helper-tool-project/blob/main/PRESETTING.md)
2. [run backend](https://github.com/lgewst/snu-helper-tool-project/tree/main/backend#how-to-build-and-run)
3. [run frontend](https://github.com/lgewst/snu-helper-tool-project/tree/main/frontend#how-to-build-and-run)

## Usage

### Initialization
<kbd>
  <img src = "https://user-images.githubusercontent.com/68896140/172613481-4f187f83-38b1-4e8b-8e4f-6cd2be759d6e.png">
</kbd>

- You will encounter initialization page. Enter your own repo of chromium and webosose, current version, version you want to apply, and patch ID.
- If you want to re-enter other information, go to inspection tool > application > local storage and delete the keys.

### Conflict page
<kbd> <img src = "https://user-images.githubusercontent.com/68896140/172613651-4a33fa3a-f6f1-4f66-9891-4749659e910a.png"> </kbd>

- After initialization, you can see folders/files that causes conflicts.
- Traverse through folders, and find file you want to inspect.
- Each file will show the code conflicts, author email, commit date and commit message.
- Click author email to see related commits made by the author.
- Hover over commit message to see more details.
- Hover over `clipboard` to see commit url and review url of that line. You can also get `related commit urls` ordered by modified files and commit message.
- It takes some time to get commit information. Wait for a while, or go to other page while waiting. It would not take as long when visiting the next time.
- Click red functions on the code, and modal will appear. Enter the version you wish to seek for.

### History page
<kbd>
  <img src = "https://user-images.githubusercontent.com/68896140/172613730-dfeee24b-3e8a-4f19-8336-4068b4a05e99.png">
</kbd>
<kbd>
  <img src = "https://user-images.githubusercontent.com/68896140/172613776-95e79a92-a67e-4e7e-a9fe-3850498adfbd.png">
</kbd>

- By entering the version of function, you would be able to see the changes between the two version, and the logs of commits that changed the function.
- Click `Left, Right` buttons to place the code you wish. It will show the difference between the two.
