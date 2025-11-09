export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ConversionResult {
  convertedAmount: number;
  rate: number;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ConversionData {
    result: ConversionResult;
    sources: GroundingSource[];
}
