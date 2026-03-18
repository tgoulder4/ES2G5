# EpiTrainer Code

this repository contains the code for the physical arduino hardware and the web interface used to control it.

## repo layout

the project is split into two main sections:

* **sketch folder**: look for the folder ending in `Sketch`. this contains the arduino sketch (the code that runs on the actual hardware).
* **button folder**: look for the folder ending in `Button`. this contains the web app (the button interface that runs on the web server).

---

## app walkthrough (for group members)

if you are a member of the group looking to edit the application logic in `app.tsx`, here is a non-technical breakdown of how the logic flows:

### 1. the connection (ip address)
when the app first opens, it checks if it knows where the arduino is on the network. if it doesn't have an address (ip), it will automatically pop up a connection dialog. the app needs this address to "talk" to the board.

### 2. keeping the link alive
the app doesn't just connect once; it constantly monitors the status. if you change the address or if the board goes offline, the app updates its "connected state." if the connection is lost while you are trying to use it, the app will bring back the connection window so you can fix the address.

### 3. moving to the next track
the main purpose of the web app is the "move to next" button. when clicked, the app sends a specific command to the arduino's address. 

### 4. success feedback
to make sure the user knows the command worked, a green "done" message appears on the screen for exactly 2 seconds after a successful skip before disappearing. if the command fails, the "done" message won't show, and you'll be prompted to check the connection instead.

> **note for editors**: if you want to change how the button looks or how the timing works, most of that logic is handled in the `useEffect` and `useState` sections of the `app.tsx` file inside the `Button` folder.

---
