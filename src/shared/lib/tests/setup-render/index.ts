import userEvent from '@testing-library/user-event';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { UserEvent } from '@testing-library/user-event/dist/types/index'


type SetupRender = { user: UserEvent } & RenderResult;

// setup render function with userEvent
export function setupRender(jsx: ReactElement): SetupRender {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}
