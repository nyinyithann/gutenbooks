import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from '../src/components/NavBar';
import BookContextProvider from '../src/providers/ContextProvider';
import ThemeSwitchProvider from '../src/providers/ThemeSwitchProvider';
import useTheme from '../src/hooks/useTheme';
import About from './pages/about';
import Book from './pages/book';
import Home from './pages/home';
import NoMatch from './pages/nomatch';

function App() {
  const [theme, setTheme] = useTheme('theme-blue');
  return (
    <BookContextProvider>
      <ThemeSwitchProvider value={{ theme, setTheme }}>
        <div>
          <div className={`${theme} flex flex-col bg-white`}>
            <Navbar setTheme={setTheme} />
            <div className="py-12 md:py-14 h-screen">
              <Routes>
                <Route index path="/" element={<Home />} />
                <Route path="/book/:id" element={<Book />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </div>
          </div>
        </div>
      </ThemeSwitchProvider>
    </BookContextProvider>
  );
}

export default App;
