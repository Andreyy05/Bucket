# Bucket

Bucket je jednoduchá full-stack webová aplikace, která vám pomůže udržet si přehled o vašich životních snech a cílech. Slouží jako takový digitální "bucket list". Můžete si sem zapisovat věci, které chcete zažít, řadit si je do vlastních kategorií a vizuálně sledovat svůj celkový pokrok.

## Použité technologie

Aplikace je plně oddělená na frontendovou a backendovou část.

**Frontend:**
- **React 18**: Uživatelské rozhraní
- **TypeScript**: Typová bezpečnost kódu
- **Vite**: Rychlé sestavení a vývojový server
- **Vanilla CSS**: Stylování s důrazem na čistý design a plynulé animace
- **Lucide React**: Vektorové ikony

**Backend a Databáze:**
- **Node.js**: Běhové prostředí serveru
- **Express.js**: Backendový framework pro tvorbu REST API
- **SQLite3**: Souborová databáze pro bezpečné uložení všech dat

## Datový model (Entity a Vztahy)

Aplikace pracuje se dvěma hlavními datovými entitami, které jsou uloženy v SQLite databázi.

### 1. Entita: Kategorie (Category)
Reprezentuje seskupení cílů podle určitých témat.
- `id` (Text): Unikátní identifikátor kategorie.
- `name` (Text): Název kategorie (např. Sport, Cestování).
- `icon` (Text): Textový identifikátor vizuální ikony.
- `color` (Text): Hexadecimální kód barvy pro zobrazení v aplikaci.

### 2. Entita: Cíl (Goal)
Hlavní entita uschovávající informace o konkrétním přání uživatele.
- `id` (Text): Unikátní identifikátor cíle.
- `title` (Text): Samotný název nebo popis cíle (např. Vylézt na Sněžku).
- `completed` (Boolean/Integer): Stav splnění (0 = aktivní, 1 = splněno).
- `categoryId` (Text): Cizí klíč s vazbou na konkrétní kategorii.
- `createdAt` (Integer): Časová stopa vytvoření pro správné řazení.

### Vztahy mezi entitami
- **1:N (Jeden k mnoha)**: Každá *Kategorie* může obsahovat libovolné množství *Cílů*. Každý *Cíl* musí být povinně zařazen právě do jedné *Kategorie* (pomocí atributu `categoryId`).

## Jak aplikaci spustit u sebe

Pokud si chcete aplikaci spustit na svém počítači, stačí dodržet pár kroků. Budete k tomu potřebovat nainstalovaný Node.js.

1. Nejprve si stáhněte repozitář a nainstalujte závislosti. Otevřete terminál ve složce s projektem a napište:
   ```bash
   npm install
   ```

2. Spusťte backendový server, který se stará o práci s databází a API. Zůstane běžet v tomto terminálu:
   ```bash
   node server/index.js
   ```

3. Spusťte frontend. Otevřete si druhé (nové) okno terminálu ve stejné složce a spusťte webovou část:
   ```bash
   npm run dev
   ```

Poté už jen otevřete webový prohlížeč a jděte na adresu http://localhost:5173/. Aplikace je připravena k použití a databáze se při prvním spuštění sama inicializuje.
