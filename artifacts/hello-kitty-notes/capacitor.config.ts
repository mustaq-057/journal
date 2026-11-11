import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hellokitty.journal',
  appName: 'Journal',
  webDir: 'dist',
  server: {
    url: 'https://journal-roan-nine.vercel.app',
    cleartext: true
  }
};

export default config;
