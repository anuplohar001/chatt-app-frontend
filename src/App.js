import './App.css';
import Users from './components/Users';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
function App() {

  
  

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          Welcome to Real-time chatt app
          <div className='flex'>
            
            <Routes>
              <Route path='/login' element={<Login/>} />
              <Route path='/' element={<Home/>} />
              <Route path='/chattapp' element={<Users/>} />
            </Routes>
          </div>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
