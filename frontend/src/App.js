import marsLogo from './logo512.png';


import Container from './components/Container/Container';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={marsLogo} className="App-logo" alt="marsLogo" />
        <h1><span style={{ color: '#d61d33'}}>MARS </span>Rover Photos</h1>
      </header>
      <div className='App-body'>
        <p style={{ color: '#fff' }}>Each rover has its own set of photos stored in the database, which can be selected separately. 
        Photos are organized by the sol (Martian rotation or day) on which they were taken, counting up from the rover's landing date. A photo taken on Curiosity's 1000th Martian sol exploring Mars, 
        for example, will have a sol attribute of 1000. If instead you prefer to search by the Earth date on which a photo was taken, you can do that, too.</p>
      </div>
      <Container />
    </div>
  );
}

export default App;
