# Bucket

Bucket je moderní full-stack webová aplikace, která vám pomůže udržet si přehled o vašich životních snech a cílech. Slouží jako digitální "bucket list", kde si můžete zapisovat své touhy, řadit je do kategorií a vizuálně sledovat svůj pokrok pomocí interaktivních grafů.

Aplikace prošla kompletním refaktoringem a nyní využívá robustní backendovou architekturu založenou na vrstvách **DAO** (Data Access Object) a **ABL** (Application Business Logic).

## Použité technologie

Projekt je rozdělen na čistě oddělený frontend a backend.

**Frontend:**
- **React 18**: Uživatelské rozhraní.
- **TypeScript**: Typová bezpečnost.
- **Vite**: Rychlý vývojový server a build systém.
- **Vanilla CSS**: Moderní design (dark mode, skleněný efekt, animace).
- **Lucide React**: Sada ikon.

**Backend:**
- **Node.js & Express.js**: REST API server.
- **SQLite3**: Souborová databáze pro ukládání dat.
- **DAO & ABL Architektura**: Oddělení datového přístupu a byznys logiky.
- **Validator**: Striktní kontrola vstupních dat (dtoIn) a strukturované chybové hlášky.

## Architektura a Datový model

Projekt je organizován jako monorepo:
- `/frontend`: Obsahuje veškerý kód pro webové rozhraní.
- `/backend`: Obsahuje serverovou část, logiku a databázi.

### Datové entity
1. **Kategorie (Category)**: Seskupení cílů (`id`, `name`, `icon`, `color`).
2. **Cíl (Goal)**: Konkrétní záznam (`id`, `title`, `state`, `categoryId`, `createdAt`).
   - Atribut `state` nabývá hodnot `active` nebo `completed`.

### Vztahy
- Vazba **1:N** mezi kategorií a cílem (každý cíl patří do jedné kategorie).

## Jak aplikaci spustit

Pro spuštění aplikace potřebujete mít nainstalovaný **Node.js**.

1. **Instalace závislostí:**
   V kořenovém adresáři spusťte:
   ```bash
   npm install
   ```

2. **Spuštění backendu:**
   V novém terminálu spusťte server:
   ```bash
   npm run server
   ```
   *Server poběží na portu 3000.*

3. **Spuštění frontendu:**
   V dalším terminálu spusťte vývojový server pro web:
   ```bash
   npm run dev
   ```
   *Frontend bude dostupný na http://localhost:5173/.*

## API Standardy
Aplikace využívá standardizované odpovědi pro veškeré operace:
- Úspěšné seznamy jsou vraceny v objektu `itemList`.
- V případě chyb (např. neexistující ID, duplicita názvu kategorie) server vrací přehledné chybové kódy (`invalidDtoIn`, `goalDoesNotExist`, atd.).
- Případná varování o nepodporovaných datech jsou zasílána v objektu `uuAppErrorMap`.
