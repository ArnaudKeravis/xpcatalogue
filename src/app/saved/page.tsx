import type { Metadata } from 'next';
import { SavedClient } from './SavedClient';

export const metadata: Metadata = {
  title: 'Saved',
  description: 'Your saved personas, moments, and solutions.',
};

export default function SavedPage() {
  return <SavedClient />;
}
