import { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ComboInput({
  value,
  options,
  onSelect,
  onChange,
  placeholder,
  className,
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setIsTyping(true);
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleSelect = (selectedValue) => {
    if (isTyping) return;
    const selected = options.find(opt => opt.id === selectedValue);
    if (selected) {
      setInputValue(selected.nome);
      onSelect?.(selected);
    }
  };

  return (
    <Select value={value || "placeholder"} onValueChange={handleSelect}>
      <SelectTrigger className={className}>
        <SelectValue>{inputValue || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="mb-2 pb-2 border-b">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => setIsTyping(false)}
            placeholder="Digite para adicionar novo"
            className="bg-white"
          />
        </div>
        {options.map((option) => (
          <SelectItem 
            key={option.id} 
            value={option.id}
            disabled={isTyping}
          >
            {option.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}