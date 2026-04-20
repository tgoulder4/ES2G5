# EpiTrainer

TODO: Augment using Azure from AZ-900 material & send to Bp
EpiTrainer connects a physical Arduino / ESP board to a small web interface that sends a “next track” command over the local network.

The repository is split into two parts:

- `P1_Sketch/` – Arduino sketch / firmware that runs on the board  
- `P1_Button/` – web application (TypeScript / React) that runs on a machine on the same network

In practice, the web app keeps track of the device IP, sends a simple HTTP command when the user clicks “next”, and provides basic success / failure feedback.

---

## Behaviour and structure

On startup the web app checks whether it knows where to find the device:

```ts
// pseudo-code
const [deviceIp, setDeviceIp] = useState<string | null>(null);
const [connected, setConnected] = useState(false);

useEffect(() => {
  if (!deviceIp) {
    // open connection dialog
  } else {
    // ping device and update `connected`
  }
}, [deviceIp]);
```

If no IP address is set, a connection dialog is shown. Once an IP is entered, the app uses it for all subsequent requests to the Arduino / ESP.

The main user-facing behaviour is the “next track” button:

```ts
const handleNextTrack = async () => {
  if (!deviceIp) {
    // prompt for IP and return early
    return;
  }

  try {
    await fetch(`http://${deviceIp}/next`, { method: 'POST' });
    setShowDone(true);
    setTimeout(() => setShowDone(false), 2000);
  } catch (error) {
    setConnected(false);
    // reopen connection dialog
  }
};
```

The UI keeps a simple “connected” state in sync with the device:

```ts
useEffect(() => {
  if (!deviceIp) return;

  const checkConnection = async () => {
    try {
      const res = await fetch(`http://${deviceIp}/health`);
      setConnected(res.ok);
    } catch {
      setConnected(false);
    }
  };

  checkConnection();
  const id = setInterval(checkConnection, 5000);
  return () => clearInterval(id);
}, [deviceIp]);
```

On success, a small green `Done` message is shown for around two seconds; if the request fails, the message is not shown and the user is prompted to adjust the connection details instead. The timing and UI behaviour are handled in `P1_Button/app.tsx` using `useState` and `useEffect`, so changes to the UX are localised to a single file.

The firmware in `P1_Sketch/` exposes a minimal HTTP interface. A typical handler on the device side looks something like:

```cpp
// pseudo-code
void handleNext() {
  // move to next audio track
  server.send(200, "text/plain", "OK");
}
```

That keeps the contract between the web app and the board small and easy to change if the endpoint or behaviour needs to evolve.  
