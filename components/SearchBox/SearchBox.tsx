import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      value={value}
      onChange={onChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
