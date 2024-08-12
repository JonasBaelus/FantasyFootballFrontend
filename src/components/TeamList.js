import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamForm from './TeamForm'; // Component for creating and editing teams
import './StyledList.css'; // Import the same CSS file

const TeamList = ({ token }) => {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  // Function to handle adding a new team
  const handleCreate = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  // Function to handle editing a team
  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  // Function to handle deleting a team
  const handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:8080/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeams(teams.filter(team => team.id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  // Function to close the form
  const handleFormClose = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  // Function to handle form submission
  const handleFormSubmit = (team) => {
    // If the team already exists, update it in the list
    if (editingTeam) {
      setTeams(teams.map(t => (t.id === team.id ? team : t)));
    } else {
      // Otherwise, add the new team to the list
      setTeams([...teams, team]);
    }
    setShowForm(false);
    setEditingTeam(null);
  };

  return (
    <div className="styled-list-container">
      <h2 className="styled-list-title">Teams</h2>
      <button className="create-styled-button" onClick={handleCreate}>Create New Team</button>
      {showForm && (
        <TeamForm
          token={token}
          team={editingTeam}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
      <ul className="styled-list">
        {teams.map(team => (
          <li key={team.id} className="styled-list-item">
            <span className="styled-description">
              {team.name}
            </span>
            <div className="styled-actions">
              <button className="edit-button" onClick={() => handleEdit(team)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(team.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;
