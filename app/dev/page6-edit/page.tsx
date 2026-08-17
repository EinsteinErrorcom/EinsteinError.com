import { Page6Editor } from '@/components/page6/page6-editor';
import { redirect } from 'next/navigation';

/** Localhost-only visual editor for content/page6.txt */
export default function DevPage6EditPage() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return (
    <main className="page6-editor-page">
      <Page6Editor />
    </main>
  );
}
