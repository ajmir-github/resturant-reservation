import { run, test } from "./firebase";
function App() {
  return (
    <div className="App">
      <header className="App-header">Learn React</header>
      <button onClick={run}>Run</button>
      <button onClick={test}>Test</button>
    </div>
  );
}

export default App;
