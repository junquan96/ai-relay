import { getAllProviders } from '@/lib/providers';
import Homepage, { type HomepageProvider } from './Homepage';

export default async function Home() {
  const allProviders = await getAllProviders();
  const providers: HomepageProvider[] = Object.entries(allProviders).map(([id, config]) => ({
    id,
    name: config.displayName,
    prefixes: config.modelPrefixes,
    models: config.models || [],
  }));

  return <Homepage providers={providers} />;
}
