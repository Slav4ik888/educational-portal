import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode
}
const ReactMarkdown: FC<Props> = ({ children }) => <>{children}</>;

export default ReactMarkdown;
