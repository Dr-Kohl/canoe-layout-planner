import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/globals.css';
import './app/canoe.css';
import Home from './app/page';
import LayoutPlanner from './app/layout-planner/page';

const showPlanner = !window.location.pathname.includes('/float-lab');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{showPlanner ? <LayoutPlanner /> : <Home />}</StrictMode>,
);
