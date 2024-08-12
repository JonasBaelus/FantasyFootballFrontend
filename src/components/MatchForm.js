import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MatchForm = ({ token, match, onClose, onSubmit }) => {
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [teams, setTeams] = useState([]);

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
      }
    };

    fetchTeams();

    // If editing an existing match, pre-fill the form
    if (match) {
      setTeamAId(match.teamAId);
      setTeamBId(match.teamBId);
    }
  }, [match, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const matchData = {
      teamAId,
      teamBId
    };

    try {
      if (match) {
        // Update existing match
        await axios.put(`http://localhost:8080/matches/${match.id}`, matchData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onSubmit({ ...match, ...matchData });
      } else {
        // Create new match
        const response = await axios.post('http://localhost:8080/matches', matchData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onSubmit(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  return (
    <div>
      <h3>{match ? 'Edit Match' : 'Create Match'}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Team A:
          <select
            value={teamAId}
            onChange={(e) => setTeamAId(e.target.value)}
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
        <label>
          Team B:
          <select
            value={teamBId}
            onChange={(e) => setTeamBId(e.target.value)}
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
        <button type="submit">{match ? 'Update Match' : 'Create Match'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default MatchForm;
