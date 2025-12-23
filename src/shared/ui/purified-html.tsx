import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

interface PurifiedHtmlProps {
  html?: string | null;
}

export const PurifiedHtml = ({ html }: PurifiedHtmlProps) => {
  if (!html) return null;

  const sanitized = DOMPurify.sanitize(html);

  return <>{parse(sanitized)}</>;
};
