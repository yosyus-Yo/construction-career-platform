import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from '../src/pages/LandingPage';
import { Button } from '../src/components/atoms/Button';

describe('frontend ui', () => {
  it('renders modern landing headline', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText('건설 커리어를 더 빠르고 정교하게 연결하세요')).toBeTruthy();
  });

  it('button component renders label', () => {
    render(<Button>확인</Button>);
    expect(screen.getByRole('button', { name: '확인' })).toBeTruthy();
  });
});
