import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Wizard from '../components/Wizard/Wizard';
import type { WizardStepContentProps } from '../components/Wizard/Wizard';

const setHash = (hash: string) => {
  const normalizedHash = hash === '' || hash.startsWith('#') ? hash : `#${hash}`;
  const nextUrl = `${window.location.pathname}${window.location.search}${normalizedHash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
};

describe('Wizard', () => {
  beforeEach(() => {
    setHash('');
  });

  afterEach(() => {
    setHash('');
  });

  it('switches to the next step', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(
      <Wizard
        state={{ canContinue: true }}
        onStepChange={onStepChange}
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" canEnter={({ state }) => state.canContinue} />
      </Wizard>,
    );

    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Контент 2')).toBeInTheDocument();
    expect(onStepChange).toHaveBeenCalledWith('step-2', expect.objectContaining({
      previousStepId: 'step-1',
      previousIndex: 0,
      nextIndex: 1,
      direction: 'next',
      progress: expect.any(Object),
    }));
  });

  it('blocks transition when guard fails', async () => {
    const user = userEvent.setup();
    const onBlockedTransition = vi.fn();

    render(
      <Wizard
        state={{ canContinue: false }}
        onBlockedTransition={onBlockedTransition}
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" canEnter={({ state }) => state.canContinue} />
      </Wizard>,
    );

    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Контент 1')).toBeInTheDocument();
    expect(onBlockedTransition).toHaveBeenCalled();
  });

  it('supports step component content', () => {
    const StepComponent = ({ state }: WizardStepContentProps<{ value: string }>) => (
      <div>Компонент: {state.value}</div>
    );

    render(
      <Wizard
        state={{ value: 'ok' }}
      >
        <Wizard.Step id="step-1" title="Шаг 1" component={StepComponent} />
      </Wizard>,
    );

    expect(screen.getByText('Компонент: ok')).toBeInTheDocument();
  });

  it('allows moving back even if canEnter for that step is false', async () => {
    const user = userEvent.setup();

    render(
      <Wizard
        state={{ allowMiddle: false }}
        defaultStepId="step-3"
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" canEnter={({ state }) => state.allowMiddle} />
        <Wizard.Step id="step-3" title="Шаг 3" content="Контент 3" />
      </Wizard>,
    );

    expect(screen.getByText('Контент 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Назад' }));
    expect(screen.getByText('Контент 2')).toBeInTheDocument();
  });

  it('can render previous button on first step', () => {
    render(
      <Wizard
        state={{}}
        showPrevOnFirstStep
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" />
      </Wizard>,
    );

    expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
  });

  it('applies configurable step variants', () => {
    render(
      <Wizard
        state={{}}
        stepVariants={{ active: 'warning', upcoming: 'dark' }}
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" />
      </Wizard>,
    );

    expect(screen.getByRole('tab', { name: /Шаг 1/ })).toHaveStyle({
      '--wizard-step-bg': 'var(--variant-warning-soft)',
    });
    expect(screen.getByRole('tab', { name: /Шаг 2/ })).toHaveStyle({
      '--wizard-step-bg': 'var(--variant-dark-soft)',
    });
  });

  it('initializes active step from hash when hash sync is enabled', async () => {
    setHash('#step-2');

    render(
      <Wizard
        state={{}}
        urlSync="hash"
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" />
      </Wizard>,
    );

    await waitFor(() => {
      expect(screen.getByText('Контент 2')).toBeInTheDocument();
    });
  });

  it('updates hash when active step changes', async () => {
    const user = userEvent.setup();

    render(
      <Wizard
        state={{ canContinue: true }}
        urlSync="hash"
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" canEnter={({ state }) => state.canContinue} />
      </Wizard>,
    );

    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await waitFor(() => {
      expect(window.location.hash).toBe('#step-2');
    });
  });

  it('handles step change by hashchange event', async () => {
    render(
      <Wizard
        state={{ canContinue: true }}
        urlSync="hash"
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" canEnter={({ state }) => state.canContinue} />
      </Wizard>,
    );

    expect(screen.getByText('Контент 1')).toBeInTheDocument();

    act(() => {
      setHash('#step-2');
      window.dispatchEvent(new Event('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getByText('Контент 2')).toBeInTheDocument();
    });
  });

  it('reverts hash when transition by hashchange is blocked', async () => {
    render(
      <Wizard
        state={{ canContinue: false }}
        urlSync="hash"
      >
        <Wizard.Step id="step-1" title="Шаг 1" content="Контент 1" />
        <Wizard.Step id="step-2" title="Шаг 2" content="Контент 2" canEnter={({ state }) => state.canContinue} />
      </Wizard>,
    );

    act(() => {
      setHash('#step-2');
      window.dispatchEvent(new Event('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getByText('Контент 1')).toBeInTheDocument();
      expect(window.location.hash).toBe('#step-1');
    });
  });

  it('renders summary grouped by step', () => {
    render(
      <Wizard.Summary
        title="Ошибки"
        data={{
          Профиль: ['Введите email', 'Email должен содержать @'],
          Тариф: ['Выберите тариф'],
        }}
      />,
    );

    expect(screen.getByText('Ошибки')).toBeInTheDocument();
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Введите email')).toBeInTheDocument();
    expect(screen.getByText('Email должен содержать @')).toBeInTheDocument();
    expect(screen.getByText('Тариф')).toBeInTheDocument();
    expect(screen.getByText('Выберите тариф')).toBeInTheDocument();
  });

  it('does not render summary when there are no errors', () => {
    const { container } = render(
      <Wizard.Summary
        data={{
          Профиль: [],
          Тариф: [],
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
