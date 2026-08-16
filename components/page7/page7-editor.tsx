'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export function Page7Editor() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'error'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch('/api/dev/page7-content');
        if (!response.ok) {
          throw new Error('Could not load page7.txt');
        }

        const data = (await response.json()) as { content: string };
        if (!cancelled) {
          setContent(data.content);
          setStatus('ready');
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(error instanceof Error ? error.message : 'Load failed');
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async () => {
    setStatus('saving');
    setErrorMessage('');

    try {
      const response = await fetch('/api/dev/page7-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setStatus('saved');
      window.setTimeout(() => setStatus('ready'), 1500);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Save failed');
    }
  }, [content]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        void save();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [save]);

  return (
    <div className="page7-editor">
      <header className="page7-editor__toolbar">
        <div>
          <h1 className="page7-editor__title">Edit Page 7</h1>
          <p className="page7-editor__hint">
            What you type here is what appears on the page — spaces and line breaks are kept.
            Press Cmd+S to save.
          </p>
        </div>
        <div className="page7-editor__actions">
          <Link href="/page7" className="page7-editor__button page7-editor__button--ghost" target="_blank">
            Preview /page7
          </Link>
          <button
            type="button"
            className="page7-editor__button page7-editor__button--save"
            onClick={() => void save()}
            disabled={status === 'loading' || status === 'saving'}
          >
            {status === 'saving' ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {status === 'error' ? <p className="page7-editor__error">{errorMessage}</p> : null}
      {status === 'saved' ? <p className="page7-editor__saved">Saved — refresh /page7 to see changes.</p> : null}

      <textarea
        className="page7-editor__textarea"
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          if (status === 'saved') {
            setStatus('ready');
          }
        }}
        spellCheck={false}
        disabled={status === 'loading'}
        aria-label="Page 7 content"
      />
    </div>
  );
}
