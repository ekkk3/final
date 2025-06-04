import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import models from '../../modelData/models';

function TopBar() {
  const { userId } = useParams();
  let context = '';

  if (userId) {
    const user = models.userModel(userId);
    if (user) {
      if (window.location.pathname.includes('/photos')) {
        context = `Photos of ${user.first_name} ${user.last_name}`;
      } else {
        context = `${user.first_name} ${user.last_name}`;
      }
    }
  } else if (window.location.pathname === '/users') {
    context = 'User List';
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Lu Thi Kieu Trang
        </Typography>
        <Typography variant="h6">{context}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;