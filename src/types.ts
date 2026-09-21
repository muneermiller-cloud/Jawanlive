export interface StremioManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  logo?: string;
  resources: Array<{
    name: string;
    types: string[];
    idPrefixes?: string[];
  }>;
  types: string[];
  catalogs: Array<{
    type: string;
    id: string;
    name: string;
    extra?: Array<{
      name: string;
      isRequired: boolean;
    }>;
    showInHome?: boolean;
  }>;
  idPrefixes?: string[];
  behaviorHints?: {
    adult?: boolean;
    p2p?: boolean;
    configurable?: boolean;
    configurationRequired?: boolean;
  };
}

export interface StreamItemMeta {
  id: string;
  type: string;
  name: string;
  poster?: string;
  posterShape?: string;
  background?: string;
  genres?: string[];
  description?: string;
  releaseInfo?: string;
  runtime?: string;
  category?: string;
}

export interface StreamSource {
  name: string;
  title?: string;
  url: string;
  behaviorHints?: {
    notWebReady?: boolean;
    headers?: Record<string, string>;
  };
}

export interface StreamResponse {
  streams: StreamSource[];
}

export interface VideoQualityLevel {
  id: number;
  height: number;
  width: number;
  bitrate: number;
  label: string;
}

export interface PlayerStats {
  resolution: string;
  bitrateKbps: number;
  bufferLengthSec: number;
  droppedFrames: number;
  decodedFrames: number;
  latencySec?: number;
}
