import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [updatedDetails, setUpdatedDetails] = useState({ name: '', email: '' });
  const [changed, setChanged] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const { token, userName, userEmail, login } = useAppContext();

  useEffect(() => {
    const authToken = token || sessionStorage.getItem("auth-token");
    if (!authToken) {
      navigate("/app/login");
      return;
    }

    const storedName = userName || sessionStorage.getItem('name') || sessionStorage.getItem('user-name') || '';
    const storedEmail = userEmail || sessionStorage.getItem('email') || '';

    const storedUserDetails = {
      name: storedName,
      email: storedEmail,
    };

    setUserDetails(storedUserDetails);
    setUpdatedDetails(storedUserDetails);
  }, [navigate, token, userName, userEmail]);

  const handleEdit = () => {
    setErrorMessage('');
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/app/login");
        return;
      }

      if (!updatedDetails.name || !updatedDetails.name.trim()) {
        setErrorMessage('Name cannot be empty.');
        return;
      }

      const trimmedName = updatedDetails.name.trim();
      const nameParts = trimmedName.split(' ');
      const firstName = nameParts.shift();
      const lastName = nameParts.join(' ');

      const payload = {
        email,
        name: trimmedName,
        firstName,
        lastName,
      };

      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authtoken}`,
          'Content-Type': 'application/json',
          Email: email,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      const fullName = data.user?.name || trimmedName;
      const normalisedEmail = data.user?.email || email;

      login(data.token, fullName, normalisedEmail);

      const refreshedDetails = {
        name: fullName,
        email: normalisedEmail,
      };

      setUserDetails(refreshedDetails);
      setUpdatedDetails(refreshedDetails);
      setEditMode(false);
      setChanged("Name changed successfully!");
      setTimeout(() => {
        setChanged("");
      }, 2000);

    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to update profile');
    }
  };

return (
<div className="profile-container">
  {editMode ? (
<form onSubmit={handleSubmit}>
<label>
  Email
  <input
    type="email"
    name="email"
    value={updatedDetails.email}
    disabled
  />
</label>
<label>
   Name
   <input
     type="text"
     name="name"
     value={updatedDetails.name}
     onChange={handleInputChange}
   />
</label>
{errorMessage && <div className="profile-error">{errorMessage}</div>}
<button type="submit">Save</button>
</form>
) : (
<div className="profile-details">
<h1>Hi, {userDetails.name || 'Friend'}</h1>
<p> <b>Email:</b> {userDetails.email || 'Unknown'}</p>
<button onClick={handleEdit}>Edit</button>
<span style={{color:'green',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{changed}</span>
</div>
)}
</div>
);
};

export default Profile;
