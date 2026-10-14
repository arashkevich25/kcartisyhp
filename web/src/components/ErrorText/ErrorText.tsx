interface ErrorTextProps {
  message: string;
}

export function ErrorText({ message }: ErrorTextProps) {
  return <p className="error">{message}</p>;
}
