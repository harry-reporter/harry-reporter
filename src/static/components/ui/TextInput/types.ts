export interface TextInputProps {
  placeholder?: string;
  className?: string;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
