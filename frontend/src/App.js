import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Grid } from '@mui/material';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserPhotos from './components/UserPhotos';
import TopBar from './components/TopBar';

function App() {
  return (
    <Router>
      <TopBar />
      <Grid container sx={{ height: 'calc(100vh - 64px)' }}> {/* 64px là chiều cao của TopBar */}
        <Grid item xs={3} sx={{ height: '100%', overflowY: 'auto' }}>
          <UserList />
        </Grid>
        <Grid
          item
          xs={9}
          sx={{ height: '100%', overflowY: 'auto', padding: 2 }}
        >
          <Routes>
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/photos/:userId" element={<UserPhotos />} />
          </Routes>
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;