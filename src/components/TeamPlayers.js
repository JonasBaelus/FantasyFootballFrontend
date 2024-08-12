import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StyledList.css'; // Import the same CSS file for consistent styling

const TeamPlayers = ({ token }) => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Fetch teams from the backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8080/teams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [token]);

  // Fetch players based on selected team ID
  useEffect(() => {
    if (selectedTeamId) {
      const fetchPlayers = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/players/team?teamId=${selectedTeamId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPlayers(response.data);
        } catch (error) {
          console.error('Error fetching players:', error);
        }
      };

      fetchPlayers();
    } else {
      setPlayers([]);
    }
  }, [selectedTeamId, token]);

  return (
    <div className="styled-list-container">
      <h2 className="styled-list-title">Players by Team</h2>
      <div className="dropdown-container">
        <label htmlFor="teamSelect">Select Team:</label>
        <select
          id="teamSelect"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          <option value="">--Select a Team--</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      {selectedTeamId && (
        <ul className="styled-list">
          {players.length > 0 ? (
            players.map(player => (
              <li key={player.id} className="styled-list-item">
                <span className="styled-description">
                  {player.name}
                </span>
              </li>
            ))
          ) : (
            <li>No players found for this team.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TeamPlayers;
