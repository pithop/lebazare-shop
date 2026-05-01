export type RegionCode = string;
export type CountryCode = string;

export interface Country {
  code: CountryCode;
  name: string;
  region: RegionCode; // Used for fallback calculation
}

export const REGIONS = [
  { code: 'EU', name: 'Union Européenne' },
  { code: 'ROW', name: 'Reste du Monde' },
];

export const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', region: 'EU' },
  { code: 'BE', name: 'Belgique', region: 'EU' },
  { code: 'CH', name: 'Suisse', region: 'ROW' }, // Switzerland is ROW for shipping customs
  { code: 'DE', name: 'Allemagne', region: 'EU' },
  { code: 'IT', name: 'Italie', region: 'EU' },
  { code: 'ES', name: 'Espagne', region: 'EU' },
  { code: 'NL', name: 'Pays-Bas', region: 'EU' },
  { code: 'LU', name: 'Luxembourg', region: 'EU' },
  { code: 'PT', name: 'Portugal', region: 'EU' },
  { code: 'IE', name: 'Irlande', region: 'EU' },
  { code: 'SE', name: 'Suède', region: 'EU' },
  { code: 'DK', name: 'Danemark', region: 'EU' },
  { code: 'FI', name: 'Finlande', region: 'EU' },
  { code: 'AT', name: 'Autriche', region: 'EU' },
  { code: 'GR', name: 'Grèce', region: 'EU' },
  { code: 'PL', name: 'Pologne', region: 'EU' },
  { code: 'CZ', name: 'Tchéquie', region: 'EU' },
  { code: 'HR', name: 'Croatie', region: 'EU' },
  { code: 'RO', name: 'Roumanie', region: 'EU' },
  { code: 'BG', name: 'Bulgarie', region: 'EU' },
  { code: 'SK', name: 'Slovaquie', region: 'EU' },
  { code: 'HU', name: 'Hongrie', region: 'EU' },
  { code: 'SI', name: 'Slovénie', region: 'EU' },
  { code: 'EE', name: 'Estonie', region: 'EU' },
  { code: 'LV', name: 'Lettonie', region: 'EU' },
  { code: 'LT', name: 'Lituanie', region: 'EU' },
  { code: 'CY', name: 'Chypre', region: 'EU' },
  { code: 'MT', name: 'Malte', region: 'EU' },
  // Non-EU / ROW
  { code: 'GB', name: 'Royaume-Uni', region: 'ROW' },
  { code: 'US', name: 'États-Unis', region: 'ROW' },
  { code: 'CA', name: 'Canada', region: 'ROW' },
  { code: 'MA', name: 'Maroc', region: 'ROW' },
  { code: 'AE', name: 'Émirats arabes unis', region: 'ROW' },
  { code: 'SA', name: 'Arabie saoudite', region: 'ROW' },
  { code: 'QA', name: 'Qatar', region: 'ROW' },
  { code: 'AU', name: 'Australie', region: 'ROW' },
  { code: 'JP', name: 'Japon', region: 'ROW' },
  { code: 'SG', name: 'Singapour', region: 'ROW' },
  { code: 'NZ', name: 'Nouvelle-Zélande', region: 'ROW' },
  { code: 'BR', name: 'Brésil', region: 'ROW' },
  { code: 'MX', name: 'Mexique', region: 'ROW' },
  { code: 'ZA', name: 'Afrique du Sud', region: 'ROW' },
  { code: 'IN', name: 'Inde', region: 'ROW' },
  { code: 'CN', name: 'Chine', region: 'ROW' },
  { code: 'KR', name: 'Corée du Sud', region: 'ROW' },
  { code: 'DZ', name: 'Algérie', region: 'ROW' },
  { code: 'TN', name: 'Tunisie', region: 'ROW' },
  { code: 'SN', name: 'Sénégal', region: 'ROW' },
  { code: 'CI', name: 'Côte d\'Ivoire', region: 'ROW' },
  { code: 'IL', name: 'Israël', region: 'ROW' },
  { code: 'TR', name: 'Turquie', region: 'ROW' },
  { code: 'NO', name: 'Norvège', region: 'ROW' },
  { code: 'IS', name: 'Islande', region: 'ROW' },
].sort((a, b) => a.name.localeCompare(b.name));

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}
