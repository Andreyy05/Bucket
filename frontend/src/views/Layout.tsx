import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutGrid, PlusCircle, FolderPlus } from 'lucide-react';

const BucketIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 8V6a5 5 0 0 1 10 0v2" />
    <line x1="3" y1="8" x2="21" y2="8" />
    <path d="M5.5 8l1.5 12h10l1.5-12" />
  </svg>
);

export const Layout = () => {
  return (
    <div className="container">
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'var(--bg-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BucketIcon size={28} color="var(--primary-color)" />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Bucket</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>
            <LayoutGrid size={20} />
            Dashboard
          </Link>
          <Link to="/goal/create" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>
            <PlusCircle size={20} />
            Nový Cíl
          </Link>
          <Link to="/category/create" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>
            <FolderPlus size={20} />
            Nová kategorie
          </Link>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};
