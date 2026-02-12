export interface Theme {
  background: string;
  surface: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
  };
  accent: string;
  accentText: string;
  error: string;
  // Test comment to trigger real-time update
  // Adding another comment to see diff highlighting
  node: {
    javascript: string;
    typescript: string;
    json: string;
    style: string;
    markup: string;
    markdown: string;
    config: string;
    text: string;
    other: string;
  };
  link: string;
}

export const lightTheme: Theme = {
  background: '#ffffff',
  surface: '#f8f9fa',
  border: '#e5e7eb',
  text: {
    primary: '#1a1a1a',
    secondary: '#6b7280'
  },
  accent: '#3ecf8e',
  accentText: '#1a1a1a',
  error: '#f04438',
  node: {
    javascript: '#f7df1e',
    typescript: '#3178c6',
    json: '#3ecf8e',
    style: '#9966ff',
    markup: '#e34c26',
    markdown: '#3ecf8e',
    config: '#6b7280',
    text: '#6b7280',
    other: '#9ca3af'
  },
  link: 'rgba(62, 207, 142, 0.3)'
};

export const darkTheme: Theme = {
  background: '#0d0d0d',
  surface: '#1a1a1a',
  border: '#2d2d2d',
  text: {
    primary: '#ffffff',
    secondary: '#8b9299'
  },
  accent: '#3ecf8e',
  accentText: '#1a1a1a',
  error: '#f04438',
  node: {
    javascript: '#f7df1e',
    typescript: '#3178c6',
    json: '#3ecf8e',
    style: '#9966ff',
    markup: '#e34c26',
    markdown: '#3ecf8e',
    config: '#8b9299',
    text: '#8b9299',
    other: '#666666'
  },
  link: 'rgba(62, 207, 142, 0.2)'
};
