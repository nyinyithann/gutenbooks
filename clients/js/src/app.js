import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/NavBar';
import BookContextProvider from './context/ContextProvider';
import useLocalStorage from './hooks/useLocalStorage';
import About from './pages/about';
import Book from './pages/book';
import Home from './pages/home';
import NoMatch from './pages/nomatch';

function App() {
  const [theme, setTheme] = useLocalStorage('gutenboks_theme', 'theme-slate');
  return (
    <BookContextProvider>
      <div>
        <div className={`${theme} flex flex-col bg-white`}>
          <Navbar setTheme={setTheme} />
          <div className="py-12 md:py-16 h-screen">
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path="/book/:id" element={<Book />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
        </div>
      </div>
    </BookContextProvider>
  );
}

export default App;
