import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';
import { Home } from '@/pages/home';
import { Editor } from '@/pages/editor';
import { Archive } from '@/pages/archive';

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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/archive" component={Archive} />
        <Route path="/entry/:id" component={Editor} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
