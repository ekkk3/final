import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';
import './styles.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    fetchModel('/user/list')
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <List>
      {users.map((user, index) => {
        const isSelected = user._id.toString() === userId;

        return (
          <React.Fragment key={user._id}>
            <ListItem
              component={Link}
              to={`/users/${user._id}`}
              button
              selected={isSelected}
              className="user-list-item"
            >
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItem>
            {index < users.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default UserList;
