import FormField from './FormField/FormField';
import InputField from './Field';
import Textarea from './Textarea/Textarea';
import Select from './Select/Select';
import FloatLabel from './FloatLabel/FloatLabel';
import { InputGroup, InputAddon } from './InputGroup';
import MaskedInput from './MaskedInput';
import NumberInput from './NumberInput';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import DateRangePicker from './DateRangePicker';
import Radio from './Radio/Radio';
import Switch from './Switch/Switch';
import Checkbox from './Checkbox/Checkbox';
import ErrorTooltip from './ErrorTooltip/ErrorTooltip';
import Hint from './Hint/Hint';

const Input = Object.assign(FormField, {
  Label: FormField.Label,
  Control: FormField.Control,
  ErrorBag: FormField.ErrorBag,
  Field: InputField,
  TextArea: Textarea,
  Select,
  FloatLabel,
  Group: InputGroup,
  Addon: InputAddon,
  MaskedInput,
  Number: NumberInput,
  DatePicker,
  TimePicker,
  DateRange: DateRangePicker,
  Radio,
  Switch,
  Checkbox,
  ErrorTooltip,
  Hint,
  FormField,
});

export default Input;
