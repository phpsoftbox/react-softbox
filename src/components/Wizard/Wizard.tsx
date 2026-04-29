import React from 'react';
import styles from './Wizard.module.css';
import Button from '../Button/Button';
import Progress from '../Progress/Progress';

export type WizardDirection = 'next' | 'prev' | 'jump';
export type WizardStepStatus = 'completed' | 'active' | 'upcoming';

export type WizardStepVisibilityContext<TState> = {
  state: TState;
  activeStepId: string | undefined;
  activeIndex: number;
  step: WizardStep<TState>;
  stepIndex: number;
};

export type WizardTransitionContext<TState> = {
  state: TState;
  fromStep: WizardStep<TState>;
  toStep: WizardStep<TState>;
  fromIndex: number;
  toIndex: number;
  direction: WizardDirection;
};

export type WizardProgressState = {
  total: number;
  current: number;
  completed: number;
  percent: number;
};

export type WizardWindowSizeMap = {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  default?: number;
};

type WizardGuard<TState> = boolean | ((context: WizardTransitionContext<TState>) => boolean);

export type WizardStepContentProps<TState> = {
  state: TState;
  step: WizardStep<TState>;
  index: number;
  isActive: boolean;
  goNext: () => boolean;
  goPrev: () => boolean;
  goTo: (stepId: string) => boolean;
};

export type WizardStepRenderProps<TState> = {
  step: WizardStep<TState>;
  index: number;
  visibleIndex: number;
  status: WizardStepStatus;
  isActive: boolean;
  isCompleted: boolean;
  isUpcoming: boolean;
  isVisible: boolean;
  isClickable: boolean;
  goTo: () => void;
};

export type WizardTemplateProps<TState> = {
  state: TState;
  activeStep: WizardStep<TState>;
  activeIndex: number;
  progress: WizardProgressState;
  canGoPrev: boolean;
  canGoNext: boolean;
  goPrev: () => boolean;
  goNext: () => boolean;
  goTo: (stepId: string) => boolean;
  stepsNode: React.ReactNode;
  progressNode: React.ReactNode;
  contentNode: React.ReactNode;
  actionsNode: React.ReactNode;
};

type WizardStepBase<TState> = {
  title: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  component?: React.ComponentType<WizardStepContentProps<TState>>;
  renderContent?: (props: WizardStepContentProps<TState>) => React.ReactNode;
  canEnter?: WizardGuard<TState>;
  canExit?: WizardGuard<TState>;
  hidden?: boolean | ((context: WizardStepVisibilityContext<TState>) => boolean);
  renderStep?: (props: WizardStepRenderProps<TState>) => React.ReactNode;
  template?: (props: WizardStepRenderProps<TState>) => React.ReactNode;
  className?: string;
};

export type WizardStep<TState> = WizardStepBase<TState> & {
  id: string;
};

export type WizardStepProps<TState> = WizardStepBase<TState> & {
  id?: string;
  children?: React.ReactNode;
};

export type WizardBlockedTransition<TState> = WizardTransitionContext<TState> & {
  reason: 'canExit' | 'canEnter';
};

type WizardProgressProps<TState> = {
  label?: React.ReactNode | ((progress: WizardProgressState, state: TState) => React.ReactNode);
  showValue?: boolean;
  variant?: React.ComponentProps<typeof Progress>['variant'];
  size?: React.ComponentProps<typeof Progress>['size'];
  className?: string;
};

type Props<TState> = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  state: TState;
  steps?: WizardStep<TState>[];
  children?: React.ReactNode;
  activeStepId?: string;
  defaultStepId?: string;
  onStepChange?: (nextStepId: string, context: {
    previousStepId: string;
    previousIndex: number;
    nextIndex: number;
    direction: WizardDirection;
    progress: WizardProgressState;
  }) => void;
  onStepStateChange?: (context: {
    activeStepId: string;
    activeIndex: number;
    step: WizardStep<TState>;
    progress: WizardProgressState;
  }) => void;
  onBlockedTransition?: (context: WizardBlockedTransition<TState>) => void;
  onComplete?: (context: { step: WizardStep<TState>; index: number }) => void;
  renderStep?: (props: WizardStepRenderProps<TState>) => React.ReactNode;
  stepTemplate?: (props: WizardStepRenderProps<TState>) => React.ReactNode;
  template?: (props: WizardTemplateProps<TState>) => React.ReactNode;
  showCurrentStep?: boolean;
  showFutureSteps?: boolean;
  stepsViewMode?: 'all' | 'active' | 'window';
  stepsWindowSize?: number;
  stepsWindowSizeByBreakpoint?: WizardWindowSizeMap;
  allowStepSelect?: boolean;
  showActions?: boolean;
  showPrevOnFirstStep?: boolean;
  showProgress?: boolean;
  progressProps?: WizardProgressProps<TState>;
  stepsOrientation?: 'horizontal' | 'vertical';
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  finishLabel?: React.ReactNode;
  stepsClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
  emptyState?: React.ReactNode;
};

const WIZARD_STEP_MARK = '__reactSoftBoxWizardStep__';

const resolveGuard = <TState,>(guard: WizardGuard<TState> | undefined, context: WizardTransitionContext<TState>) => {
  if (guard === undefined) {
    return true;
  }
  if (typeof guard === 'boolean') {
    return guard;
  }
  return guard(context);
};

const resolveStepHidden = <TState,>(
  step: WizardStep<TState>,
  context: WizardStepVisibilityContext<TState>,
) => {
  if (step.hidden === undefined) {
    return false;
  }
  if (typeof step.hidden === 'boolean') {
    return step.hidden;
  }
  return step.hidden(context);
};

const getStatusByIndex = (activeIndex: number, index: number): WizardStepStatus => {
  if (index < activeIndex) {
    return 'completed';
  }
  if (index === activeIndex) {
    return 'active';
  }
  return 'upcoming';
};

function WizardStepNode<TState>(_props: WizardStepProps<TState>) {
  return null;
}

(WizardStepNode as unknown as { [WIZARD_STEP_MARK]: boolean })[WIZARD_STEP_MARK] = true;

const resolveStepChildren = <TState,>(children: React.ReactNode): WizardStep<TState>[] => {
  const result: WizardStep<TState>[] = [];
  let stepIndex = 0;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    const childType = child.type as { [WIZARD_STEP_MARK]?: boolean };
    if (!childType[WIZARD_STEP_MARK]) {
      return;
    }

    stepIndex += 1;
    const props = child.props as WizardStepProps<TState>;
    const keyId = child.key !== null ? String(child.key) : undefined;
    const id = props.id ?? keyId ?? `step-${stepIndex}`;
    const content = props.content ?? props.children ?? null;

    result.push({
      id,
      title: props.title,
      description: props.description,
      content,
      component: props.component,
      renderContent: props.renderContent,
      canEnter: props.canEnter,
      canExit: props.canExit,
      hidden: props.hidden,
      renderStep: props.renderStep,
      template: props.template,
      className: props.className,
    });
  });

  return result;
};

function WizardBase<TState>({
  steps,
  children,
  state,
  activeStepId,
  defaultStepId,
  onStepChange,
  onStepStateChange,
  onBlockedTransition,
  onComplete,
  renderStep,
  stepTemplate,
  template,
  showCurrentStep = true,
  showFutureSteps = true,
  stepsViewMode = 'all',
  stepsWindowSize = 5,
  stepsWindowSizeByBreakpoint,
  allowStepSelect = true,
  showActions = true,
  showPrevOnFirstStep = false,
  showProgress = false,
  progressProps,
  stepsOrientation = 'horizontal',
  previousLabel = 'Назад',
  nextLabel = 'Далее',
  finishLabel = 'Завершить',
  className,
  stepsClassName,
  contentClassName,
  actionsClassName,
  emptyState = null,
  ...props
}: Props<TState>) {
  const resolvedSteps = React.useMemo(
    () => (steps && steps.length > 0 ? steps : resolveStepChildren<TState>(children)),
    [children, steps],
  );

  const isControlled = activeStepId !== undefined;
  const [viewportWidth, setViewportWidth] = React.useState<number>(() => (
    typeof window !== 'undefined' ? window.innerWidth : 1440
  ));

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const computeNavigableIndexes = React.useCallback((anchorIndex: number, anchorStepId?: string) => (
    resolvedSteps
      .map((step, index) => {
        const hidden = resolveStepHidden(step, {
          state,
          activeStepId: anchorStepId,
          activeIndex: anchorIndex,
          step,
          stepIndex: index,
        });
        return hidden ? null : index;
      })
      .filter((index): index is number => index !== null)
  ), [resolvedSteps, state]);

  const fallbackIndex = React.useMemo(() => {
    const indexes = computeNavigableIndexes(-1, undefined);
    return indexes[0] ?? -1;
  }, [computeNavigableIndexes]);
  const fallbackId = fallbackIndex >= 0 ? resolvedSteps[fallbackIndex]?.id : undefined;

  const [internalStepId, setInternalStepId] = React.useState<string | undefined>(defaultStepId ?? fallbackId);

  React.useEffect(() => {
    if (isControlled) {
      return;
    }

    const currentIndex = resolvedSteps.findIndex((step) => step.id === internalStepId);
    const currentStep = currentIndex >= 0 ? resolvedSteps[currentIndex] : null;
    const currentIsHidden = currentStep
      ? resolveStepHidden(currentStep, {
        state,
        activeStepId: internalStepId,
        activeIndex: currentIndex,
        step: currentStep,
        stepIndex: currentIndex,
      })
      : true;

    if (currentIndex < 0 || currentIsHidden) {
      setInternalStepId(fallbackId);
    }
  }, [fallbackId, internalStepId, isControlled, resolvedSteps, state]);

  const resolvedStepId = isControlled ? activeStepId : internalStepId;
  const activeIndex = React.useMemo(() => {
    const index = resolvedSteps.findIndex((step) => step.id === resolvedStepId);
    if (index >= 0) {
      const step = resolvedSteps[index];
      const hidden = resolveStepHidden(step, {
        state,
        activeStepId: resolvedStepId,
        activeIndex: index,
        step,
        stepIndex: index,
      });
      if (!hidden) {
        return index;
      }
    }
    return fallbackIndex;
  }, [fallbackIndex, resolvedStepId, resolvedSteps, state]);

  const activeStep = activeIndex >= 0 ? resolvedSteps[activeIndex] : null;

  const computeProgressForIndex = React.useCallback((index: number, stepId?: string): WizardProgressState => {
    const indexes = computeNavigableIndexes(index, stepId);
    const total = indexes.length;
    const currentPosition = indexes.indexOf(index);
    const current = currentPosition >= 0 ? currentPosition + 1 : 0;
    const completed = current > 0 ? current - 1 : 0;
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;

    return {
      total,
      current,
      completed,
      percent,
    };
  }, [computeNavigableIndexes]);

  const progressState = React.useMemo(() => {
    if (!activeStep || activeIndex < 0) {
      return { total: 0, current: 0, completed: 0, percent: 0 };
    }
    return computeProgressForIndex(activeIndex, activeStep.id);
  }, [activeIndex, activeStep, computeProgressForIndex]);

  const onStepStateChangeRef = React.useRef(onStepStateChange);
  React.useEffect(() => {
    onStepStateChangeRef.current = onStepStateChange;
  }, [onStepStateChange]);
  const lastStepStateKeyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!activeStep || activeIndex < 0) {
      return;
    }
    const key = `${activeStep.id}:${activeIndex}:${progressState.total}:${progressState.current}:${progressState.completed}:${progressState.percent}`;
    if (lastStepStateKeyRef.current === key) {
      return;
    }
    lastStepStateKeyRef.current = key;

    onStepStateChangeRef.current?.({
      activeStepId: activeStep.id,
      activeIndex,
      step: activeStep,
      progress: progressState,
    });
  }, [activeIndex, activeStep, progressState.completed, progressState.current, progressState.percent, progressState.total]);

  const visibleSteps = React.useMemo(
    () => resolvedSteps.map((step, index) => {
      const status = getStatusByIndex(activeIndex, index);
      const hiddenByStep = resolveStepHidden(step, {
        state,
        activeStepId: activeStep?.id,
        activeIndex,
        step,
        stepIndex: index,
      });
      const hiddenByConfig = (status === 'active' && !showCurrentStep) || (status === 'upcoming' && !showFutureSteps);
      return {
        step,
        index,
        status,
        isVisible: !hiddenByStep && !hiddenByConfig,
      };
    }),
    [activeIndex, activeStep?.id, resolvedSteps, showCurrentStep, showFutureSteps, state],
  );

  const renderedSteps = React.useMemo(() => {
    const onlyVisible = visibleSteps.filter((item) => item.isVisible);
    if (stepsViewMode === 'active') {
      return onlyVisible.filter((item) => item.index === activeIndex);
    }

    if (stepsViewMode === 'window') {
      const resolveWindowSize = () => {
        if (!stepsWindowSizeByBreakpoint) {
          return stepsWindowSize;
        }

        if (viewportWidth <= 720 && stepsWindowSizeByBreakpoint.sm !== undefined) {
          return stepsWindowSizeByBreakpoint.sm;
        }
        if (viewportWidth <= 1024 && stepsWindowSizeByBreakpoint.md !== undefined) {
          return stepsWindowSizeByBreakpoint.md;
        }
        if (viewportWidth <= 1280 && stepsWindowSizeByBreakpoint.lg !== undefined) {
          return stepsWindowSizeByBreakpoint.lg;
        }
        if (stepsWindowSizeByBreakpoint.xl !== undefined) {
          return stepsWindowSizeByBreakpoint.xl;
        }
        if (stepsWindowSizeByBreakpoint.default !== undefined) {
          return stepsWindowSizeByBreakpoint.default;
        }
        return stepsWindowSize;
      };

      const normalizedWindow = Math.max(1, Math.floor(resolveWindowSize()));
      if (onlyVisible.length <= normalizedWindow) {
        return onlyVisible;
      }

      const activePos = onlyVisible.findIndex((item) => item.index === activeIndex);
      if (activePos < 0) {
        return onlyVisible.slice(0, normalizedWindow);
      }

      const left = Math.floor((normalizedWindow - 1) / 2);
      const right = normalizedWindow - left - 1;
      let start = activePos - left;
      let end = activePos + right;

      if (start < 0) {
        end += -start;
        start = 0;
      }
      if (end >= onlyVisible.length) {
        const overflow = end - onlyVisible.length + 1;
        start = Math.max(0, start - overflow);
        end = onlyVisible.length - 1;
      }

      return onlyVisible.slice(start, end + 1);
    }

    return onlyVisible;
  }, [activeIndex, stepsViewMode, stepsWindowSize, stepsWindowSizeByBreakpoint, viewportWidth, visibleSteps]);

  const visiblePositionMap = React.useMemo(() => {
    const map = new Map<number, number>();
    visibleSteps
      .filter((item) => item.isVisible)
      .forEach((item, position) => {
        map.set(item.index, position);
      });
    return map;
  }, [visibleSteps]);

  const totalVisibleSteps = visibleSteps.filter((item) => item.isVisible);
  const hiddenAfterCount = React.useMemo(() => {
    if (renderedSteps.length === 0) {
      return 0;
    }
    const lastRenderedIndex = renderedSteps[renderedSteps.length - 1].index;
    const lastRenderedPosition = totalVisibleSteps.findIndex((item) => item.index === lastRenderedIndex);
    if (lastRenderedPosition < 0) {
      return 0;
    }
    return Math.max(0, totalVisibleSteps.length - lastRenderedPosition - 1);
  }, [renderedSteps, totalVisibleSteps]);

  const findNeighborIndex = React.useCallback((fromIndex: number, delta: 1 | -1) => {
    const indexes = computeNavigableIndexes(fromIndex, resolvedSteps[fromIndex]?.id);
    const position = indexes.indexOf(fromIndex);
    if (position < 0) {
      return -1;
    }
    const next = indexes[position + delta];
    return next ?? -1;
  }, [computeNavigableIndexes, resolvedSteps]);

  const canTransition = React.useCallback((toIndex: number, direction: WizardDirection) => {
    if (!activeStep || activeIndex < 0 || toIndex < 0 || toIndex >= resolvedSteps.length) {
      return false;
    }

    const toStep = resolvedSteps[toIndex];
    const hidden = resolveStepHidden(toStep, {
      state,
      activeStepId: activeStep.id,
      activeIndex,
      step: toStep,
      stepIndex: toIndex,
    });
    if (hidden) {
      return false;
    }

    const context: WizardTransitionContext<TState> = {
      state,
      fromStep: activeStep,
      toStep,
      fromIndex: activeIndex,
      toIndex,
      direction,
    };

    const isForward = toIndex > activeIndex;
    if (isForward && !resolveGuard(activeStep.canExit, context)) {
      return false;
    }

    if (isForward && !resolveGuard(toStep.canEnter, context)) {
      return false;
    }

    return true;
  }, [activeIndex, activeStep, resolvedSteps, state]);

  const attemptTransition = React.useCallback((toIndex: number, direction: WizardDirection) => {
    if (!activeStep || activeIndex < 0 || toIndex < 0 || toIndex >= resolvedSteps.length) {
      return false;
    }

    const toStep = resolvedSteps[toIndex];
    const hidden = resolveStepHidden(toStep, {
      state,
      activeStepId: activeStep.id,
      activeIndex,
      step: toStep,
      stepIndex: toIndex,
    });
    if (hidden) {
      return false;
    }

    const context: WizardTransitionContext<TState> = {
      state,
      fromStep: activeStep,
      toStep,
      fromIndex: activeIndex,
      toIndex,
      direction,
    };

    const isForward = toIndex > activeIndex;
    if (isForward && !resolveGuard(activeStep.canExit, context)) {
      onBlockedTransition?.({ ...context, reason: 'canExit' });
      return false;
    }

    if (isForward && !resolveGuard(toStep.canEnter, context)) {
      onBlockedTransition?.({ ...context, reason: 'canEnter' });
      return false;
    }

    if (!isControlled) {
      setInternalStepId(toStep.id);
    }

    onStepChange?.(toStep.id, {
      previousStepId: activeStep.id,
      previousIndex: activeIndex,
      nextIndex: toIndex,
      direction,
      progress: computeProgressForIndex(toIndex, toStep.id),
    });

    return true;
  }, [activeIndex, activeStep, computeProgressForIndex, isControlled, onBlockedTransition, onStepChange, resolvedSteps, state]);

  const goPrev = React.useCallback(() => {
    if (!activeStep || activeIndex < 0) {
      return false;
    }
    const targetIndex = findNeighborIndex(activeIndex, -1);
    if (targetIndex < 0) {
      return false;
    }
    return attemptTransition(targetIndex, 'prev');
  }, [activeIndex, activeStep, attemptTransition, findNeighborIndex]);

  const goNext = React.useCallback(() => {
    if (!activeStep || activeIndex < 0) {
      return false;
    }
    const targetIndex = findNeighborIndex(activeIndex, 1);
    if (targetIndex < 0) {
      onComplete?.({ step: activeStep, index: activeIndex });
      return false;
    }
    return attemptTransition(targetIndex, 'next');
  }, [activeIndex, activeStep, attemptTransition, findNeighborIndex, onComplete]);

  const goTo = React.useCallback((stepId: string) => {
    const targetIndex = resolvedSteps.findIndex((step) => step.id === stepId);
    if (targetIndex < 0) {
      return false;
    }
    if (targetIndex === activeIndex) {
      return true;
    }
    const direction: WizardDirection = targetIndex > activeIndex ? 'next' : 'prev';
    return attemptTransition(targetIndex, direction);
  }, [activeIndex, attemptTransition, resolvedSteps]);

  if (!activeStep || activeIndex < 0) {
    return (
      <div className={[styles.wizard, className].filter(Boolean).join(' ')} {...props}>
        {emptyState}
      </div>
    );
  }

  const contentProps: WizardStepContentProps<TState> = {
    state,
    step: activeStep,
    index: activeIndex,
    isActive: true,
    goNext,
    goPrev,
    goTo,
  };

  const renderStepContent = () => {
    if (activeStep.renderContent) {
      return activeStep.renderContent(contentProps);
    }
    if (activeStep.component) {
      const Component = activeStep.component;
      return <Component {...contentProps} />;
    }
    return activeStep.content ?? null;
  };

  const previousStepIndex = findNeighborIndex(activeIndex, -1);
  const nextStepIndex = findNeighborIndex(activeIndex, 1);
  const canGoPrev = previousStepIndex >= 0;
  const canGoNext = nextStepIndex >= 0;

  const stepsNode = (
    <div
      className={[
        styles.steps,
        stepsOrientation === 'vertical' ? styles.stepsVertical : styles.stepsHorizontal,
        stepsClassName,
      ].filter(Boolean).join(' ')}
      role="tablist"
      aria-label="Wizard steps"
    >
      {renderedSteps
        .map((item, visibleIndexInWindow) => {
          const isActive = item.index === activeIndex;
          const direction: WizardDirection = item.index > activeIndex ? 'next' : 'prev';
          const canNavigate = isActive ? false : canTransition(item.index, direction);
          const isClickable = allowStepSelect && !isActive && canNavigate;
          const isDisabled = !isActive && (!allowStepSelect || !canNavigate);
          const visibleIndex = visiblePositionMap.get(item.index) ?? visibleIndexInWindow;
          const stepProps: WizardStepRenderProps<TState> = {
            step: item.step,
            index: item.index,
            visibleIndex,
            status: item.status,
            isActive,
            isCompleted: item.status === 'completed',
            isUpcoming: item.status === 'upcoming',
            isVisible: item.isVisible,
            isClickable,
            goTo: () => {
              if (isClickable) {
                goTo(item.step.id);
              }
            },
          };

          const resolvedTemplate = item.step.template ?? item.step.renderStep ?? stepTemplate ?? renderStep;
          if (resolvedTemplate) {
            return (
              <div key={item.step.id} className={styles.stepSlot}>
                {resolvedTemplate(stepProps)}
              </div>
            );
          }

          const stepClasses = [
            styles.step,
            item.step.className,
            item.status === 'completed' ? styles.stepCompleted : null,
            item.status === 'active' ? styles.stepActive : styles.stepUpcoming,
            isDisabled ? styles.stepDisabled : null,
            isClickable ? styles.stepClickable : null,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={item.step.id} className={styles.stepSlot}>
              <button
                type="button"
                className={stepClasses}
                role="tab"
                aria-selected={isActive}
                aria-disabled={isDisabled ? 'true' : undefined}
                onClick={stepProps.goTo}
                disabled={isDisabled}
              >
                <span className={styles.stepIndex}>{visibleIndex + 1}</span>
                <span className={styles.stepMain}>
                  <span className={styles.stepTitle}>{item.step.title}</span>
                  {item.step.description ? (
                    <span className={styles.stepDescription}>{item.step.description}</span>
                  ) : null}
                </span>
              </button>
            </div>
          );
        })}
      {hiddenAfterCount > 0 ? (
        <div className={styles.stepOverflowIndicator} aria-hidden="true">
          +{hiddenAfterCount} ещё
        </div>
      ) : null}
    </div>
  );

  const resolvedProgressLabel = typeof progressProps?.label === 'function'
    ? progressProps.label(progressState, state)
    : progressProps?.label;

  const progressNode = showProgress ? (
    <Progress
      value={progressState.percent}
      max={100}
      label={resolvedProgressLabel}
      showValue={progressProps?.showValue ?? true}
      variant={progressProps?.variant ?? 'info'}
      size={progressProps?.size ?? 'sm'}
      className={progressProps?.className}
    />
  ) : null;

  const contentNode = (
    <div className={[styles.content, contentClassName].filter(Boolean).join(' ')}>
      {renderStepContent()}
    </div>
  );

  const actionsNode = showActions ? (
    <div className={[styles.actions, actionsClassName].filter(Boolean).join(' ')}>
      <div className={styles.actionsGroup}>
        {showPrevOnFirstStep || canGoPrev ? (
          <Button appearance="outline" onClick={goPrev} disabled={!canGoPrev}>
            {previousLabel}
          </Button>
        ) : null}
      </div>
      <div className={styles.actionsGroup}>
        <Button onClick={goNext}>
          {canGoNext ? nextLabel : finishLabel}
        </Button>
      </div>
    </div>
  ) : null;

  const templateProps: WizardTemplateProps<TState> = {
    state,
    activeStep,
    activeIndex,
    progress: progressState,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    goTo,
    stepsNode,
    progressNode,
    contentNode,
    actionsNode,
  };

  const content = template ? template(templateProps) : (
    <>
      {progressNode}
      {stepsNode}
      {contentNode}
      {actionsNode}
    </>
  );

  return (
    <div className={[styles.wizard, className].filter(Boolean).join(' ')} {...props}>
      {content}
    </div>
  );
}

type WizardCompoundComponent = (<TState>(props: Props<TState>) => React.ReactElement) & {
  Step: <TState>(props: WizardStepProps<TState>) => React.ReactElement | null;
};

const Wizard = Object.assign(WizardBase, {
  Step: WizardStepNode,
}) as WizardCompoundComponent;

export default Wizard;
