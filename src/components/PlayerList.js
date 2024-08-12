import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerForm from './PlayerForm'; // Component for creating and editing players
import './StyledList.css'; // Import the same CSS file

const PlayerList = ({ token }) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch players and teams from the backend
  useEffect(() => {
    const fetchPlayersAndTeams = async () => {
      try {
        const [playersResponse, teamsResponse] = await Promise.all([
          axios.get('http://localhost:8080/players', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:8080/teams', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        
        setPlayers(playersResponse.data);
        setTeams(teamsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlayersAndTeams();
  }, [token]);

  // Map team ID to team name for display
  const getTeamNameById = (teamId) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  // Function to handle adding a new player
  const handleCreate = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };

  // Function to handle editing a player
  const handleEdit = (player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  // Function to handle deleting a player
  const handleDelete = async (playerId) => {
    try {
      await axios.delete(`http://localhost:8080/players/${playerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlayers(players.filter(player => player.id !== playerId));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  // Function to close the form
  const handleFormClose = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  // Function to handle form submission
  const handleFormSubmit = (player) => {
    // If the player already exists, update it in the list
    if (editingPlayer) {
      setPlayers(players.map(p => (p.id === player.id ? player : p)));
    } else {
      // Otherwise, add the new player to the list
      setPlayers([...players, player]);
    }
    setShowForm(false);
    setEditingPlayer(null);
  };

  return (
    <div className="styled-list-container">
      <h2 className="styled-list-title">Players</h2>
      <button className="create-styled-button" onClick={handleCreate}>Create New Player</button>
      {showForm && (
        <PlayerForm
          token={token}
          player={editingPlayer}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
      <ul className="styled-list">
        {players.map(player => (
          <li key={player.id} className="styled-list-item">
            <span className="styled-description">
              {player.name} (Team: {getTeamNameById(player.teamId)})
            </span>
            <div className="styled-actions">
              <button className="edit-button" onClick={() => handleEdit(player)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(player.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
