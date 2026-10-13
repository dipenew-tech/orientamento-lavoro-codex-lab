export interface Cooperative {
  name: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  email?: string;
  translatedName?: string;
  translatedDescription?: string;
}

export interface PublicOffice {
  type: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  email?: string;
  translatedType?: string;
  translatedName?: string;
  translatedDescription?: string;
}

export interface ItalianSchool {
  name: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  email?: string;
  translatedName?: string;
  translatedDescription?: string;
}

export interface LetterSection {
  greeting: string;
  intro: string;
  cooperativesIntro: string;
  publicOfficesIntro: string;
  schoolsIntro?: string;
  conclusion: string;
}

export interface GeneratedLetter {
  letterTitle: string;
  subject: string;
  recipientName: string;
  italianLetter: LetterSection;
  hasTranslation: boolean;
  translationLanguage: string;
  translatedLetter?: LetterSection;
  cooperatives: Cooperative[];
  publicOffices: PublicOffice[];
  italianSchools?: ItalianSchool[];
  officinaOpportunity?: boolean;
  isLocalFallback?: boolean;
  fallbackReason?: string;
  municipiResults?: MunicipioSearchResult[];
  isAltroFailed?: boolean;
  unsupportedJob?: string;
}

export interface MunicipioSearchResult {
  municipio: string;
  results: {
    name: string;
    address: string;
    phone: string;
    website?: string;
    description: string;
  }[];
}

export interface UserFormInputs {
  recipientName: string;
  gender: string;
  nationality: string;
  italianLevel: string;
  jobSought: string;
  zoneResident: string;
  zoneJobSought: string;
  officinaOpportunity?: boolean;
}

export interface LetterStatRecord {
  id: string;
  timestamp: string;
  recipientName: string;
  gender: string;
  nationality: string;
  italianLevel: string;
  jobSought: string;
  zoneResident: string;
  zoneJobSought: string;
  translationLanguage: string;
  officinaOpportunity: boolean;
  cooperativesCount: number;
  publicOfficesCount: number;
  schoolsCount: number;
  isLocalFallback?: boolean;
}

