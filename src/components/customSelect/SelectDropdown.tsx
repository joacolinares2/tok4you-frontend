/* import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Option {
  value: number;
  label: string;
}

interface SelectDropdownProps {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className="border rounded p-1 text-sm">
        <SelectValue placeholder="Select tokens" />
      </SelectTrigger>
      <SelectContent className="max-h-40 overflow-y-auto">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectDropdown;
 */
