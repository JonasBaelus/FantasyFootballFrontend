import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchForm from './MatchForm';
import './StyledList.css';  // Import the CSS file for styling

const MatchList = ({ token }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:8080/matches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const matches = response.data;
        setMatches(matches);
        
        // Fetch all team names by their IDs
        const teamIds = [
          ...new Set(matches.flatMap(match => [match.teamAId, match.teamBId]))
        ];
        const teamsResponse = await Promise.all(
          teamIds.map(id => axios.get(`http://localhost:8080/teams/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }))
        );
        const teamsData = teamsResponse.reduce((acc, response) => {
          acc[response.data.id] = response.data.name;
          return acc;
        }, {});
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching matches or teams:', error);
      }
    };

    fetchMatches();
  }, [token]);

  const handleCreate = () => {
    setSelectedMatch(null);
    setShowForm(true);
  };

  const handleEdit = (match) => {
    setSelectedMatch(match);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/matches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMatches(matches.filter(match => match.id !== id));
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const handleFormSubmit = async (match) => {
    setShowForm(false);
  
    // Update the matches list
    if (selectedMatch) {
      setMatches(matches.map(m => (m.id === match.id ? match : m)));
    } else {
      setMatches([...matches, match]);
    }
  
    // Check if the new teams are already in the teams state
    const newTeams = {};
    const teamIdsToFetch = [];
    
    if (!teams[match.teamAId]) {
      teamIdsToFetch.push(match.teamAId);
    } else {
      newTeams[match.teamAId] = teams[match.teamAId];
    }
    
    if (!teams[match.teamBId]) {
      teamIdsToFetch.push(match.teamBId);
    } else {
      newTeams[match.teamBId] = teams[match.teamBId];
    }
    
    if (teamIdsToFetch.length > 0) {
      try {
        const teamsResponse = await Promise.all(
          teamIdsToFetch.map(id => axios.get(`http://localhost:8080/teams/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }))
        );
        teamsResponse.forEach(response => {
          newTeams[response.data.id] = response.data.name;
        });
  
        // Update the teams state with any new team names
        setTeams(prevTeams => ({
          ...prevTeams,
          ...newTeams
        }));
      } catch (error) {
        console.error('Error fetching updated teams:', error);
      }
    }
  };

  return (
    <div className="styled-list-container">
      <h2 className="styled-list-title">Matches</h2>
      <button className="create-styled-button" onClick={handleCreate}>Create Match</button>
      <ul className="styled-list">
        {matches.map(match => (
          <li key={match.id} className="styled-list-item">
            <span className="styled-description">
              Match: {teams[match.teamAId]} vs {teams[match.teamBId]}
            </span>
            <div className="styled-actions">
              <button className="edit-button" onClick={() => handleEdit(match)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(match.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <MatchForm
          token={token}
          match={selectedMatch}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default MatchList;
