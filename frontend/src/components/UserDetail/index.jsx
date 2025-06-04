import React, { useEffect, useState } from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  if (!user) {
    return <Typography>Loading or user not found...</Typography>;
  }

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography>Location: {user.location}</Typography>
      <Typography>Description: {user.description}</Typography>
      <Typography>Occupation: {user.occupation}</Typography>
      <MuiLink component={Link} to={`/photos/${userId}`}>
        View {user.first_name}'s Photos
      </MuiLink>
    </div>
  );
}

export default UserDetail;
