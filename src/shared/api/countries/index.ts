export interface Country {
  code: string;
  name: string;
}
export const getCountries = async (): Promise<Country[]> => {
  return [
    { code: 'at', name: 'Austria' },
    { code: 'be', name: 'Belgium' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'hr', name: 'Croatia' },
    { code: 'cy', name: 'Cyprus' },
    { code: 'cz', name: 'Czech Republic' },
    { code: 'dk', name: 'Denmark' },
    { code: 'ee', name: 'Estonia' },
    { code: 'fi', name: 'Finland' },
    { code: 'fr', name: 'France' },
    { code: 'de', name: 'Germany' },
    { code: 'gr', name: 'Greece' },
    { code: 'hu', name: 'Hungary' },
    { code: 'ie', name: 'Ireland' },
    { code: 'it', name: 'Italy' },
    { code: 'lv', name: 'Latvia' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'lu', name: 'Luxembourg' },
    { code: 'mt', name: 'Malta' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'pl', name: 'Poland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'ro', name: 'Romania' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'si', name: 'Slovenia' },
    { code: 'es', name: 'Spain' },
    { code: 'se', name: 'Sweden' },
  ];
};
