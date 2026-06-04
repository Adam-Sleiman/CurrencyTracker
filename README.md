# CurrencyTracker

I början av utvecklingen av applikationen satt vi tillsammans på Discord och byggde grunden för projektet. Adam stod för committerna i Git, men han glömde att lägga till oss andra som co-authors på dessa commits, trots att arbetet utfördes gemensamt.

En webbaserad valutaapplikation byggd med React och Vite. Applikationen riktar sig till användare som snabbt vill konvertera valutor, följa aktuella kurser och analysera historiska växelkurser.

---

## Funktioner

- **Valutakonvertering** – Konvertera mellan valfria valutor i realtid med aktuella kurser.
- **Konverteringshistorik** – De senaste tio konverteringarna sparas lokalt och visas i sessionen.
- **Valutaöversikt** – Lista alla tillgängliga valutor med aktuell kurs mot SEK, med filtreringsfunktion.
- **Favoritpar** – Spara valutapar som favoriter för snabb åtkomst vid konvertering.
- **Historisk simulering** – Ange ett datum upp till 30 år tillbaka, välj valutapar och belopp för att se vad konverteringen hade gett vid det tillfället.
- **Kursgraf** – Visualisera hur ett valutapars växelkurs har utvecklats över tid med valbara tidsintervall (1M, 3M, 6M, 1Y, 2Y).

---

## Teknikstack

| Teknik | Användning |
|---|---|
| React 19 | UI-komponenter och tillståndshantering |
| Vite 8 | Byggverktyg och utvecklingsserver |
| React Router v7 | Klientbaserad routing |
| Chart.js + react-chartjs-2 | Visualisering av historiska kurser |
| ExchangeRate-API v6 | Aktuella växelkurser och valutalisor |
| Frankfurter API v2 | Historiska växelkurser (ingen API-nyckel krävs) |
| localStorage | Lokal lagring av historik och favoriter |

---

## Ramverksval – varför React?

Vi valde React framför Vue och Angular av följande skäl.

**React vs Vue**
React har ett större ekosystem, fler tillgängliga paket och en bredare community. Hooks-modellen (`useState`, `useEffect`) ger ett konsekvent mönster för tillståndshantering utan extra syntax. Vue är enklare att komma igång med men React är mer etablerat i industrin och gav oss bättre tillgång till relevant dokumentation och paket som `react-chartjs-2`.

**React vs Angular**
Angular är ett fullständigt ramverk med inbyggt beroendeinjektionssystem, TypeScript som standard och en striktare projektstruktur. Det passar bra för stora enterprise-applikationer men medför onödig komplexitet för ett projekt av denna storlek. React är ett bibliotek snarare än ett ramverk, vilket ger frihet att välja egna lösningar för routing och datahämtning utan att behöva följa ett fast mönster.

**Slutsats:** Reacts komponentbaserade modell, breda paketutbud och välkända hooks-mönster gjorde det till det mest pragmatiska valet för detta projekt.


Referenser
React Officiell Dokumentation: react.dev
Angular Officiell Dokumentation: angular.dev
Vue.js Officiell Dokumentation: vuejs.org
Stack Overflow Developer Survey: stackoverflow.co


---

## API-användning

### ExchangeRate-API v6
Används för realtidsdata på startsidan och i valutaöversikten.

- Hämta senaste kurser: `GET /v6/{api_key}/latest/{base}`
- Konvertera par: `GET /v6/{api_key}/pair/{from}/{to}/{amount}`
- Hämta valutakoder: `GET /v6/{api_key}/codes`

Kräver API-nyckel via miljövariabeln `VITE_EXCHANGE_RATE_API_KEY`.

### Frankfurter API v2
Används för historiska kurser på historik-sidan. Kräver ingen API-nyckel och har inga CORS-begränsningar.

- Enskilt datum: `GET /v2/rates?date=YYYY-MM-DD&base=USD&quotes=EUR`
- Datumintervall: `GET /v2/rates?from=YYYY-MM-DD&to=YYYY-MM-DD&base=USD&quotes=EUR`

Frankfurter baseras på ECB:s (Europeiska centralbanken) dagliga publicerade kurser och täcker 31 valutor från 1999 och framåt.

---

## Projektstruktur

```
src/
├── components/
│   ├── Navbar.jsx                # Navigationsfält med länkar till alla sidor
│   ├── CurrencyConverter.jsx     # Konverteringsformulär med resultatvisning
│   ├── ConversionHistory.jsx     # Lista över senaste konverteringar
│   ├── CurrencyOverview.jsx      # Filtrerbar lista med kurser mot SEK
│   ├── FavoritePairs.jsx         # Hantering av sparade valutapar
│   ├── HistoricalSimulator.jsx   # Historisk konvertering via datumval
│   └── HistoricalRateChart.jsx   # Linjediagram med tidsintervallsval
├── pages/
│   ├── HomePage.jsx              # Konvertering, favoriter och historik
│   ├── OverviewPage.jsx          # Valutaöversikt
│   ├── FavoritesPage.jsx         # Favoritpar
│   └── HistorySimulationPage.jsx # Historisk simulering och graf
├── services/
│   ├── api.js                    # ExchangeRate-API (aktuella kurser)
│   └── freecurrencyApi.js        # Frankfurter API (historiska kurser)
├── utils/
│   ├── localStorage.js           # Konverteringshistorik (läs/skriv/rensa)
│   └── favorites.js              # Favoritpar (läs/spara/ta bort)
├── App.jsx                       # Rotkomponent med routing
├── App.css                       # Global layout och komponentstil
├── index.css                     # CSS-variabler och grundstil
└── main.jsx                      # Ingångspunkt
```

---

## Kom igång

### Krav

- Node.js 18 eller senare
- Ett konto och API-nyckel från [exchangerate-api.com](https://www.exchangerate-api.com)

### Installation

1. Klona repot:
   ```bash
   git clone https://github.com/Adam-Sleiman/CurrencyTracker.git
   cd CurrencyTracker
   ```

2. Installera beroenden:
   ```bash
   npm install
   ```

3. Skapa en `.env`-fil i projektets rot med följande innehåll:
   ```
   VITE_EXCHANGE_RATE_API_KEY=din_nyckel_här
   ```

4. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

Applikationen körs på `http://localhost:5173`.

> Frankfurter API kräver ingen nyckel och konfigureras inte i `.env`.

---

## Bidragsgivare

| Namn | Ansvarsomrade |
|---|---|
| **Adam** | Valutakonvertering, konverteringshistorik, routing, grundläggande appstruktur |
| **Sleiman** | Valutaöversikt, favorithantering, API-integration för aktuella kurser |
| **Karam** | Historisk simulering, kursgraf (Chart.js), responsiv design, tillgänglighet |
