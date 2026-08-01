import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    // We target the main scrollable area, which is likely the `<main>` tag or window
    const mainArea = document.querySelector('main');
    if (mainArea) {
      mainArea.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
