import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/home/home';
import GenerateCreativePage from './components/generateCreative/generateCreative';
import GenerateScriptPage from './components/generateScript/generateScript';
import GenerateStoryBoardPage from './components/generateStoryBoard/generateStoryBoard';
import RenderResultsPage from './components/renderResults/renderResults';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<HomePage />}></Route>
        <Route path='/creative' exact element={<GenerateCreativePage />}></Route>
        <Route path='/script' exact element={<GenerateScriptPage />}></Route>
        <Route path='/story-board' exact element={<GenerateStoryBoardPage />}></Route>
        <Route path='/result' exact element={<RenderResultsPage />}></Route>
      </Routes>
    </Router>
  )
}

export default App;