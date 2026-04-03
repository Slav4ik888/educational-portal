import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';



type MarkdownProps = {
  content: string
}

const ExternalLinkComponent = ({ node, ...props }: any) => (
  <a target='_blank' rel='noopener noreferrer' {...props}>
    {props.children || 'link'}
  </a>
);

export const MarkdownWithExternalLinks: FC<MarkdownProps> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[gfm]}
    components={{
      a: ExternalLinkComponent,
    }}
  >
    {content}
  </ReactMarkdown>
);
