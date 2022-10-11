import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Loading from './components/Loading';
import Navbar from './components/NavBar';
import useTheme from './hooks/useTheme';
import NoMatch from './pages/NoMatch';
import BookContextProvider from './providers/ContextProvider';
import ThemeSwitchProvider from './providers/ThemeSwitchProvider';

const Home = React.lazy(() => import('./pages/Home'));
const Book = React.lazy(() => import('./pages/Book'));
const About = React.lazy(() => import('./pages/About'));
const SuspendedControl = ({ children }) => (
  <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
);

function App() {
  const [theme, setTheme] = useTheme('theme-blue');
  return (
    <BookContextProvider>
      <ThemeSwitchProvider value={{ theme, setTheme }}>
        <div className="dark:bg-slate-600">
          <div className={`${theme} flex flex-col dark:bg-slate-600`}>
            <Navbar setTheme={setTheme} />
            <div className="h-screen py-12 dark:bg-slate-600 lg:py-14">
              <Routes>
                <Route
                  index
                  path="/"
                  element={
                    <SuspendedControl>
                      <Home />
                    </SuspendedControl>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <SuspendedControl>
                      <About />
                    </SuspendedControl>
                  }
                />
                <Route
                  path="/book"
                  element={
                    <SuspendedControl>
                      <Book />
                    </SuspendedControl>
                  }
                />
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
