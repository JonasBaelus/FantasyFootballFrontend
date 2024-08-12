import React, { useState } from 'react';
import TeamList from './components/TeamList';
import PlayerList from './components/PlayerList';
import MatchList from './components/MatchList';
import TeamPlayers from './components/TeamPlayers';
import LoginScreen from './components/LoginScreen';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('matches'); // Default tab

  const responseMessage = (response) => {
    setToken(response.credential); // Save the token
  };


  return (
    <div>
      {!token ? (
        <LoginScreen onLogin={responseMessage} />
      ) : (
        <>
          <nav className="navbar">
            <ul>
              <li className={activeTab === 'matches' ? 'active' : ''}>
                <button onClick={() => setActiveTab('matches')}>Matches</button>
              </li>
              <li className={activeTab === 'players' ? 'active' : ''}>
                <button onClick={() => setActiveTab('players')}>Players</button>
              </li>
              <li className={activeTab === 'teams' ? 'active' : ''}>
                <button onClick={() => setActiveTab('teams')}>Teams</button>
              </li>
              <li className={activeTab === 'teamPlayers' ? 'active' : ''}>
                <button onClick={() => setActiveTab('teamPlayers')}>Team Players</button>
              </li>
            </ul>
          </nav>

          <div className="content">
            {activeTab === 'matches' && <MatchList token={token} />}
            {activeTab === 'players' && <PlayerList token={token} />}
            {activeTab === 'teams' && <TeamList token={token} />}
            {activeTab === 'teamPlayers' && <TeamPlayers token={token} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
