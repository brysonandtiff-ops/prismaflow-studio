export interface Region {
  id: string;
  name: string;
  description: string;
  fill: string;
}

export interface ColoringPage {
  id: string;
  title: string;
  image?: string;
  description: string;
  difficulty: 'calm' | 'medium' | 'detailed';
  svgViewBox: string;
  regions: Region[];
}

export interface ProjectState {
  pageId: string;
  fills: Record<string, string>;
  brushData?: string; // Data URL of the canvas
  lastModified: number;
}
