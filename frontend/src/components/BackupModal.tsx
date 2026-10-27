import React, { useState, useRef } from 'react';
import { Download, Upload, X, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface BackupModalProps {
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ onClose, onDataRestored }) => {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const res = await fetch('/api/backup/export');
      if (!res.ok) throw new Error('Chyba při exportu dat.');
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `bucket-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Záloha byla úspěšně stažena do vašeho počítače.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Export selhal.' });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.categories || !backupData.goals) {
        throw new Error('Neplatný formát souboru se zálohou.');
      }

      const res = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: backupData.categories,
          goals: backupData.goals,
          mode: importMode
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Import se nezdařil.');
      }

      const result = await res.json();
      setMessage({
        type: 'success',
        text: `Úspěšně importováno: ${result.importedGoals} cílů a ${result.importedCategories} kategorií.`
      });
      onDataRestored();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Import selhal. Zkontrolujte formát souboru.' });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Zálohování & Obnova dat</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Zavřít">
            <X size={20} />
          </button>
        </div>

        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: message.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Export Section */}
        <div style={{
          padding: '1.25rem',
          backgroundColor: 'var(--bg-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} color="var(--primary-color)" /> Exportovat zálohu
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
            Stáhněte si kompletní data všech vašich cílů a kategorií v přenosném formátu JSON.
          </p>
          <button className="btn btn-primary" onClick={handleExport} style={{ width: '100%' }}>
            <Download size={16} /> Stáhnout zálohu (.json)
          </button>
        </div>

        {/* Import Section */}
        <div style={{
          padding: '1.25rem',
          backgroundColor: 'var(--bg-color)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="var(--primary-color)" /> Obnovit / Importovat zálohu
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
            Nahrajte dříve uložený soubor se zálohou do aplikace.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem', display: 'block' }}>
              Režim importu:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                Nahradit stávající data
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                Sloučit s existujícími
              </label>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <button
            className="btn"
            style={{
              width: '100%',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)'
            }}
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? <RefreshCw className="spin" size={16} /> : <Upload size={16} />}
            {importing ? 'Importuji data…' : 'Vybrat soubor se zálohou…'}
          </button>
        </div>
      </div>
    </div>
  );
};
