
import { useEffect, useState } from 'react'
import './App.css'
import ConnectionDialog from './components/connectionDialog';
import { fetchData, fetchMoveToNext } from './lib/data';
import { Button } from './components/ui/button';


function App() {
  const [audrinoIP, setAudrinoIP] = useState("");
  const [connectionDialogIsOpen, setConnectionDialogIsOpen] = useState(false);
  const [connectedState, setConnectedState] = useState(false);
  const [showSuccessfulMove, setShowSuccessfulMove] = useState<boolean>(false)
  const [error, setError] = useState("");

  useEffect(() => {
    if (audrinoIP == "") {
      setConnectionDialogIsOpen(true);
    }
  }, []);

  useEffect(() => {
    async function connect() {
      const res = await fetchData(audrinoIP);
      if (res) {
        setConnectedState(true);
        if (connectionDialogIsOpen) { setConnectionDialogIsOpen(false); };
      } else {
        setConnectedState(false);
      }
    };
    connect()
  }, [audrinoIP]);

  function handleOpenChange(open: boolean) {
    setConnectionDialogIsOpen(open);
  }
  async function moveToNextAudioTrack(ip: string) {
    const res = await fetchMoveToNext(ip);
    if (!res) {
      setConnectionDialogIsOpen(true);
      setError("Couldn't connect to that IP.");
      setConnectedState(false);
    } else {
      setShowSuccessfulMove(true);
    }
  }
  async function handleSetAudrinoIp(ip: string) {
    //make an attempt to connect

    const res = await fetchData(audrinoIP);
    if (res) {
      setAudrinoIP(ip);
      setConnectionDialogIsOpen(false);
      setConnectedState(true);
    } else {
      setError("Couldn't connect to that IP.");
      setConnectedState(false);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setShowSuccessfulMove(false);
    }, 2000);
  }, [showSuccessfulMove]);
  return (
    <>
      <Button className='bg-emerald-900' onClick={() => moveToNextAudioTrack}>Move to next</Button>
      <ConnectionDialog setError={setError} error={error} open={connectionDialogIsOpen} onChange={handleOpenChange} callback={handleSetAudrinoIp} />
      <p hidden={!showSuccessfulMove} className='text-green-500'>Done</p>
    </>
  )
}

export default App
