# 🌟 Bucket (Full-Stack Bucket List App)

**Bucket** je moderní full-stack webová aplikace navržená pro zaznamenávání, správu a vizualizaci vašich životních snů a cílů (Bucket List). Pomůže vám udržet si přehled o tom, co chcete zažít, a motivuje vás pomocí vizuálních ukazatelů vašeho pokroku.

![Bucket App Screenshot](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/compass.svg) <!-- Zde můžete později vložit reálný screenshot z aplikace -->

## 🚀 Hlavní Funkce

*   **Správa cílů (CRUD):** Přidávejte, odškrtávejte a mazejte své životní cíle. Všechna data jsou bezpečně uložena na vlastním backendu v databázi.
*   **Vlastní Kategorie:** Roztřiďte si své sny. Můžete si vytvářet vlastní, plně dynamické kategorie. Každé kategorii můžete přiřadit specifický název, unikátní barvu a odpovídající ikonku pro snadnou vizuální orientaci.
*   **Motivační Dashboard:** Hlavní obrazovka obsahuje krásný interaktivní a plynule animovaný **kruhový graf (Donut Chart)**. Tento graf okamžitě počítá a vizualizuje celkový poměr mezi aktivními a splněnými úkoly, čímž vás pohání k dalším zážitkům.
*   **Rychlé Filtrování:** Přepínejte si zobrazení svých cílů pomocí filtračních tlačítek podle zvolených kategorií jedním kliknutím.

## 🛠 Technologie

Aplikace je rozdělena na dvě úzce spolupracující části:

### Frontend
*   **React 18** (UI Knihovna)
*   **TypeScript** (Bezpečnost typů a robustnost)
*   **Vite** (Bleskově rychlý build nástroj a vývojový server)
*   **Vanilla CSS** s CSS proměnnými (Moderní, čistý a konzistentní design s důrazem na hover efekty a plynulé animace)
*   **Lucide React** (Sada moderních a čistých ikon pro UI)

### Backend
*   **Node.js** & **Express.js** (Server a RESTful API)
*   **SQLite3** (Lehká databáze bez nutnosti instalace pro uchování cílů a kategorií)

## 📦 Lokální spuštění a vývoj

Pro spuštění celého "Full-Stack" ekosystému je potřeba stáhnout závislosti a spustit současně backendový i frontendový server.

### 1. Instalace
Ujistěte se, že máte nainstalovaný [Node.js](https://nodejs.org/). Naklonujte si tento repozitář a nainstalujte závislosti:

```bash
git clone <url-repozitare>
cd Bucket
npm install
```

### 2. Spuštění Backend Serveru (API + Databáze)
Express API server běží odděleně (standardně na portu 3000) a stará se o SQLite databázi (`server/data/database.sqlite`). Při prvním spuštění se databáze sama vytvoří a naplní výchozími kategoriemi.
Otevřete si první okno terminálu a spusťte:

```bash
node server/index.js
```
*(Server by měl vypsat: "Server running on port 3000" a "Connected to SQLite database.")*

### 3. Spuštění Frontend Serveru (React + Vite)
Otevřete si **nové (druhé) okno terminálu** ve složce projektu a spusťte Vite vývojový server. Vite obsahuje nakonfigurovanou proxy, která se automaticky postará o směrování požadavků (začínající `/api/*`) na náš backend.

```bash
npm run dev
```

Aplikace bude následně dostupná ve vašem prohlížeči na adrese: **http://localhost:5173/**

## 📁 Struktura Projektu

```text
Bucket/
├── server/
│   ├── data/
│   │   └── database.sqlite   # Vaše data
│   ├── db.js                 # Inicializace databáze a schémat (Goals, Categories)
│   └── index.js              # Express.js server a REST API endpointy
├── src/
│   ├── components/           # UI Komponenty (AddGoalForm, ProgressChart, ManageCategories...)
│   ├── App.tsx               # Hlavní kontejner aplikace
│   ├── index.css             # Centrální Design Systém a stylování
│   ├── main.tsx              # React entry point
│   └── types.ts              # TypeScript interface definice (Goal, Category)
├── vite.config.ts            # Nastavení bundleru a API proxy
└── package.json              # Závislosti projektu
```

---
*Vytvořeno s radostí pro všechny, kteří chtějí proměnit své sny ve skutečnost.*
