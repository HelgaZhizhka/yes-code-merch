import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useMemo } from 'react';

interface PurifiedHtmlProps {
  html?: string | null;
}

export const PurifiedHtml = ({ html }: PurifiedHtmlProps) => {
  const sanitized = useMemo(() => {
    if (!html) return null;
    return parse(DOMPurify.sanitize(html));
  }, [html]);

  if (!sanitized) return null;

  return <>{sanitized}</>;
};
