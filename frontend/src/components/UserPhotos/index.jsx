import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchModel(`/photo/photosOfUser/${userId}`)
      .then((data) => {
        setPhotos(data);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, [userId]);

  if (!photos || photos.length === 0) {
    return <Typography>No photos found</Typography>;
  }

  return (
    <div style={{ padding: 16 }}>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: 16 }}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt="User photo"
            sx={{ width: '100%', objectFit: 'contain' }}
          />
          <CardContent>
            <Typography>
              Created: {new Date(photo.date_time).toLocaleString()}
            </Typography>
            {photo.comments && photo.comments.length > 0 && (
              <div>
                <Typography variant="h6">Comments:</Typography>
                {photo.comments.map((comment) => (
                  <div key={comment._id} style={{ marginTop: 8 }}>
                    <Typography>
                      <MuiLink
                        component={Link}
                        to={`/users/${comment.user_id}`}
                      >
                        {comment.first_name ?? 'Unknown'} {comment.last_name ?? ''}
                      </MuiLink>{' '}
                      ({new Date(comment.date_time).toLocaleString()}):
                    </Typography>
                    <Typography>{comment.comment}</Typography>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
