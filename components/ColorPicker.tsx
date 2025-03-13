import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const getValidHexColor = (color: string): string => {
  if (/^#([0-9A-Fa-f]{6})$/i.test(color)) {
    return color;
  }

  if (/^#([0-9A-Fa-f]{3})$/i.test(color)) {
    const hex = color.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  if (/^([0-9A-Fa-f]{6})$/i.test(color)) {
    return `#${color}`;
  }

  if (/^([0-9A-Fa-f]{3})$/i.test(color)) {
    return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`;
  }

  return "#0EA5E9";
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const safeValue = getValidHexColor(value);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (
      newValue === "" ||
      newValue === "#" ||
      /^#?([0-9A-Fa-f]{0,6})$/i.test(newValue)
    ) {
      onChange(newValue);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value && !/^#([0-9A-Fa-f]{6})$/i.test(value)) {
      onChange(getValidHexColor(value));
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safeValue}
          onChange={handleColorChange}
          className="w-8 h-8 rounded-md border cursor-pointer"
          aria-label="Choose color"
        />
        <Input
          type="text"
          value={value}
          onChange={handleTextChange}
          onBlur={handleInputBlur}
          className="font-mono"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
