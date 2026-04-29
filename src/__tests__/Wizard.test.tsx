import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Wizard from '../components/Wizard/Wizard';
import type { WizardStepContentProps } from '../components/Wizard/Wizard';

describe('Wizard', () => {
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
});
