# Wizard

`Wizard` — поэтапная форма с условиями переходов.

```tsx
type FormState = {
  email: string;
  agreed: boolean;
};

const [state, setState] = useState<FormState>({ email: '', agreed: false });

<Wizard<FormState>
  state={state}
  showFutureSteps={false}
  showPrevOnFirstStep
  showProgress
>
  <Wizard.Step
    id="account"
    title="Аккаунт"
    canExit={({ state: current }) => current.email.trim().length > 0}
  >
    <Input>
      <Input.Label>Email</Input.Label>
      <Input.Field
        value={state.email}
        onChange={(event) => setState((prev) => ({ ...prev, email: event.target.value }))}
      />
    </Input>
  </Wizard.Step>
  <Wizard.Step
    id="confirm"
    title="Подтверждение"
    component={({ state: current }) => (
      <Input.Checkbox
        label="Согласен с условиями"
        checked={current.agreed}
        onChange={(event) => setState((prev) => ({ ...prev, agreed: event.target.checked }))}
      />
    )}
    canEnter={({ state: current }) => current.email.trim().length > 0}
  />
</Wizard>;
```

## Что можно настроить

- шаг как `content` (ReactNode), `component` или `renderContent`
- составной API через `Wizard.Step` (либо `steps` проп для массивов)
- guards переходов: `canEnter`, `canExit`
- видимость шагов: `showCurrentStep`, `showFutureSteps`, `step.hidden`
- режим длинного списка шагов: `stepsViewMode="all" | "active" | "window"` + `stepsWindowSize`
- адаптивное окно шагов: `stepsWindowSizeByBreakpoint={{ sm, md, lg, xl, default }}`
- кастомный рендер шага: `stepTemplate` у `Wizard` или `template` у `Wizard.Step`
- кнопка `Назад` на первом шаге: `showPrevOnFirstStep`
- встроенный `Progress`: `showProgress` + `progressProps`
- кастомный layout (в т.ч. вертикальный wizard): `template`, где можно разместить `stepsNode`, `progressNode`, `contentNode`, `actionsNode` в любом порядке
