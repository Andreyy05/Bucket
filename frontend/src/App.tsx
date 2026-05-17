import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './views/Layout';
import { DashboardView } from './views/DashboardView';
import { TargetFormView } from './views/TargetFormView';
import { CategoryCreateView } from './views/CategoryCreateView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardView />} />
          <Route path="goal/create" element={<TargetFormView />} />
          <Route path="category/create" element={<CategoryCreateView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
