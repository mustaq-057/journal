import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PinLock } from '@/components/pin-lock';
import { InactivityOverlay } from '@/components/inactivity-overlay';
import { Layout } from '@/components/layout';
import { Home } from '@/pages/home';
import { Editor } from '@/pages/editor';
import { Archive } from '@/pages/archive';
import { Kitty } from '@/pages/kitty';
import { Settings } from '@/pages/settings';
import { SharedEntry } from '@/pages/shared-entry';
import { JournalProvider } from '@/hooks/use-journal';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
      <div className="font-heading text-6xl text-primary mb-4">?</div>
      <h2 className="font-heading text-4xl text-foreground mb-4">Oh no!</h2>
      <p className="text-muted-foreground">This page is hiding.</p>
    </div>
  );
}

import { ScrollToTop } from '@/components/scroll-to-top';

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/archive" component={Archive} />
        <Route path="/kitty" component={Kitty} />
        <Route path="/settings" component={Settings} />
        <Route path="/entry/:id" component={Editor} />
        <Route path="/shared/:id" component={SharedEntry} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const isSharedRoute = window.location.pathname.startsWith('/shared/');
  const [isLocked, setIsLocked] = useState(!isSharedRoute);
  const [showInactivity, setShowInactivity] = useState(false);

  // Show inactivity overlay instead of reloading when app returns from background after >5 minutes
  useEffect(() => {
    let hiddenTime = 0;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else {
        // 5 minutes = 300000 ms
        if (hiddenTime && Date.now() - hiddenTime > 300000) {
          setShowInactivity(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <JournalProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AnimatePresence>
            {showInactivity && (
              <InactivityOverlay
                key="inactivity"
                onDismiss={() => setShowInactivity(false)}
              />
            )}
            {isLocked && !showInactivity && <PinLock onUnlock={() => setIsLocked(false)} key="lock" />}
          </AnimatePresence>
          {!isLocked && !showInactivity && <Router />}
        </WouterRouter>
      </JournalProvider>
    </QueryClientProvider>
  );
}

export default App;
