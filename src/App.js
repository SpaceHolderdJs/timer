import { useState, useCallback, useRef, useEffect } from "react";
import { timer, interval } from "rxjs";

import "./App.scss";

const rxInterval = interval(1000);

function App() {
  const subscribtionRef = useRef();

  const [time, setTime] = useState(new Date(0));
  const [going, setGoing] = useState(false);
  const [clicked, setClicked] = useState(false);

  const timeFixer = useCallback((str) => {
    return str.toString().length < 2 ? "0" + str : str;
  }, []);

  const stopTimer = useCallback(() => {
    subscribtionRef.current.unsubscribe();
    setGoing(false);
  }, []);

  const startTimer = useCallback(() => {
    subscribtionRef.current = rxInterval.subscribe((n) =>
      setTime(new Date(time.setUTCSeconds(time.getUTCSeconds() + 1)))
    );
    setGoing(true);
  }, []);

  const handleTimerStart = useCallback(() => {
    if (!going) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [going]);

  const handleWait = useCallback(() => {
    if (clicked) {
      stopTimer();
    } else {
      setClicked(true);
      timer(300).subscribe((time) => setClicked(false));
    }
  }, [clicked]);

  const handleReset = useCallback(() => {
    try {
      stopTimer();
      setTime(new Date(time.setUTCSeconds(0)));
      startTimer();
    } catch {
      alert("Nothing to reset:)");
    }
  }, []);

  return (
    <div className="App column centered">
      <div className="row sp-btw timer centered">
        <h1>{timeFixer(time.getUTCHours())}</h1>:
        <h1>{timeFixer(time.getUTCMinutes())}</h1>:
        <h1>{timeFixer(time.getUTCSeconds())}</h1>
      </div>
      <div className="row sp-btw btn-wrapper">
        <button onClick={() => handleTimerStart()}>
          {going ? "Stop" : "Start"}
        </button>
        <button onClick={() => handleWait()}>Wait</button>
        <button onClick={() => handleReset()}>Reset</button>
      </div>
    </div>
  );
}

export default App;
