import { useId } from "react";


type InputProps = Omit<React.ComponentPropsWithRef<"input">, 'type'> & {
  type?: HTMLInputType
}

export default function Input({ children, ...props }: InputProps) {
  const uuid = useId();
  
  return (
    <>
      <label htmlFor={uuid}>{children}</label>
      <input id={uuid} {...props} />
    </>
  )
}