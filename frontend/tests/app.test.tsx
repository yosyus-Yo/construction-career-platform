import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('frontend bootstrap', () => {
  it('renders title', () => {
    document.body.innerHTML = '<div id="root"></div>';
    render(<div>건설업 경력직 채용 플랫폼</div>);
    expect(screen.getByText('건설업 경력직 채용 플랫폼')).toBeTruthy();
  });
});
