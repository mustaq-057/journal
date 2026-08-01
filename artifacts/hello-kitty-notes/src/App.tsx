import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PinLock } from '@/components/pin-lock';
import { Layout } from '@/components/layout';
import { Home } from '@/pages/home';
import { Editor } from '@/pages/editor';
import { Archive } from '@/pages/archive';
import { Kitty } from '@/pages/kitty';
import { Settings } from '@/pages/settings';
import { SharedEntry } from '@/pages/shared-entry';

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

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AnimatePresence>
          {isLocked && <PinLock onUnlock={() => setIsLocked(false)} key="lock" />}
        </AnimatePresence>
        {!isLocked && <Router />}
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
