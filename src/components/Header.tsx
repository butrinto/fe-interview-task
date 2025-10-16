import type { ReactNode } from "react";

type HeaderProps = {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
};

export default function Header({ title, left, right }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="h-left">{left}</div>
      <div className="h-title">{title}</div>
      <div className="h-right">{right}</div>
    </header>
  );
}
