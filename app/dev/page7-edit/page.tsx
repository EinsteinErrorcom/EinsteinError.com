import { Page7Editor } from '@/components/page7/page7-editor';
import { redirect } from 'next/navigation';

/** Localhost-only visual editor for content/page7.txt */
export default function DevPage7EditPage() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return (
    <main className="page7-editor-page">
      <Page7Editor />
    </main>
  );
}
