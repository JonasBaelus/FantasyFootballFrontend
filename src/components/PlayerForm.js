import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerForm = ({ token, player, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the list of teams
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
        setError('Failed to fetch teams. Please try again later.');
      }
    };

    fetchTeams();
    
    // If editing an existing player, pre-fill the form
    if (player) {
      setName(player.name);
      setTeamId(player.teamId);
    }
  }, [player, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const playerData = {
      name,
      teamId
    };

    try {
      if (player) {
        // Update existing player
        await axios.put(`http://localhost:8080/players/${player.id}`, playerData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onSubmit({ ...player, ...playerData });
      } else {
        // Create new player and update the team
        const response = await axios.post('http://localhost:8080/players/create-and-update-team', playerData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onSubmit(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving player:', error);
      setError('Failed to save player. Please check your input and try again.');
    }
  };

  return (
    <div>
      <h3>{player ? 'Edit Player' : 'Create Player'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Team:
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="" disabled>Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">{player ? 'Update Player' : 'Create Player'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default PlayerForm;

