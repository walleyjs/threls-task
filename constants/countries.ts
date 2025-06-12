export interface State {
  name: string;
  code: string;
}

export interface Country {
  name: string;
  code: string;
  states: State[];
}

export const europeanCountries: Country[] = [
  {
    name: "Malta",
    code: "MT",
    states: [
      { name: "Malta", code: "MT" },
      { name: "Gozo", code: "GO" }
    ]
  },
  {
    name: "Italy",
    code: "IT",
    states: [
      { name: "Lombardy", code: "LO" },
      { name: "Lazio", code: "LA" },
      { name: "Campania", code: "CA" },
      { name: "Sicily", code: "SI" },
      { name: "Veneto", code: "VE" },
      { name: "Emilia-Romagna", code: "ER" },
      { name: "Piedmont", code: "PI" },
      { name: "Tuscany", code: "TU" },
      { name: "Calabria", code: "CL" },
      { name: "Sardinia", code: "SA" }
    ]
  },
  {
    name: "France",
    code: "FR",
    states: [
      { name: "Île-de-France", code: "IDF" },
      { name: "Provence-Alpes-Côte d'Azur", code: "PAC" },
      { name: "Auvergne-Rhône-Alpes", code: "ARA" },
      { name: "Hauts-de-France", code: "HDF" },
      { name: "Occitanie", code: "OCC" },
      { name: "Nouvelle-Aquitaine", code: "NAQ" },
      { name: "Grand Est", code: "GES" },
      { name: "Pays de la Loire", code: "PDL" },
      { name: "Normandie", code: "NOR" },
      { name: "Bretagne", code: "BRE" }
    ]
  },
  {
    name: "Germany",
    code: "DE",
    states: [
      { name: "Bavaria", code: "BY" },
      { name: "North Rhine-Westphalia", code: "NW" },
      { name: "Baden-Württemberg", code: "BW" },
      { name: "Lower Saxony", code: "NI" },
      { name: "Hesse", code: "HE" },
      { name: "Saxony", code: "SN" },
      { name: "Rhineland-Palatinate", code: "RP" },
      { name: "Berlin", code: "BE" },
      { name: "Hamburg", code: "HH" },
      { name: "Schleswig-Holstein", code: "SH" }
    ]
  },
  {
    name: "Spain",
    code: "ES",
    states: [
      { name: "Andalusia", code: "AN" },
      { name: "Catalonia", code: "CT" },
      { name: "Madrid", code: "MD" },
      { name: "Valencia", code: "VC" },
      { name: "Galicia", code: "GA" },
      { name: "Castile and León", code: "CL" },
      { name: "Basque Country", code: "PV" },
      { name: "Castilla-La Mancha", code: "CM" },
      { name: "Canary Islands", code: "CN" },
      { name: "Murcia", code: "MC" }
    ]
  },
  {
    name: "Netherlands",
    code: "NL",
    states: [
      { name: "North Holland", code: "NH" },
      { name: "South Holland", code: "ZH" },
      { name: "North Brabant", code: "NB" },
      { name: "Gelderland", code: "GE" },
      { name: "Utrecht", code: "UT" },
      { name: "Friesland", code: "FR" },
      { name: "Overijssel", code: "OV" },
      { name: "Groningen", code: "GR" },
      { name: "Limburg", code: "LI" },
      { name: "Drenthe", code: "DR" }
    ]
  }
]; 