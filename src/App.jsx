import CustomRoutes from './routes/CustomRoutes'
// import Search from './Search/Search'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <CustomRoutes />
    </div>
  );
}

export default App;