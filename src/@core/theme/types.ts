declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      main: string; // rgb(...)
      mainChannel: string; // 'r, g, b'
      tableHeaderBg: string;
      primaryGradient: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      main?: string
      tableHeaderBg?: string
      primaryGradient?: string
    }
  }
}

export {}
