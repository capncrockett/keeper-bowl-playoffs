import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

type RouterTestOptions = {
  route?: string;
  routerProps?: Omit<MemoryRouterProps, 'children'>;
  renderOptions?: Omit<RenderOptions, 'wrapper'>;
};

/**
 * Helper to render components that expect a router context.
 * Defaults to a single-entry history at `/`.
 */
export function renderWithRouter(ui: ReactElement, options?: RouterTestOptions) {
  const { route = '/', routerProps, renderOptions } = options ?? {};
  const initialEntries = routerProps?.initialEntries ?? [route];

  return render(
    <MemoryRouter initialEntries={initialEntries} {...routerProps}>
      {ui}
    </MemoryRouter>,
    renderOptions,
  );
}
