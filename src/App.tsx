import React from 'react';
import './App.css';
import { Main } from './components/Main';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Particle Swarm Optimalization Algorithm (PSO)
        </p>
      </header>
      <Main />
    </div>
  );
}

export default App;
