import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamForm = ({ token, team, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [playerIds, setPlayerIds] = useState('');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setPlayerIds(team.playerIds ? team.playerIds.join(',') : ''); // Handle case where playerIds is null or undefined
    }
  }, [team]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teamData = {
      name,
      playerIds: playerIds ? playerIds.split(',').map(id => id.trim()).filter(id => id) : [] // Handle optional playerIds
    };

    try {
      if (team) {
        // Update existing team
        await axios.put(`http://localhost:8080/teams/${team.id}`, teamData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onSubmit({ ...team, ...teamData });
      } else {
        // Create new team
        const response = await axios.post('http://localhost:8080/teams', teamData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onSubmit(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  return (
    <div>
      <h3>{team ? 'Edit Team' : 'Create Team'}</h3>
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
          Player IDs (comma separated, optional):
          <input
            type="text"
            value={playerIds}
            onChange={(e) => setPlayerIds(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">{team ? 'Update Team' : 'Create Team'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TeamForm;
