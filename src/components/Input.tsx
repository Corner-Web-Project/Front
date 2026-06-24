

type InputProps = Omit<React.ComponentPropsWithRef<"input">, 'type'> & {
  type?: HTMLInputType
}

export default function Input({ children, ...props }: InputProps) {
  return (
    <>
      <input{...props} />
    </>
  )
}