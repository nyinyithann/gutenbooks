import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/NavBar';
import useTheme from './hooks/useTheme';
import About from './pages/about';
import Book from './pages/book';
import Home from './pages/home';
import NoMatch from './pages/nomatch';
import BookContextProvider from './providers/ContextProvider';
import ThemeSwitchProvider from './providers/ThemeSwitchProvider';

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
                <Route path="/about" element={<About />} />
                <Route path="/book" element={<Book />} />
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
