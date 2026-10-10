

type InputProps = Omit<React.ComponentPropsWithRef<"input">, 'type'> & {
  type?: HTMLInputType
}

export default function Input(props: InputProps) {
  return (
    <>
      <input{...props} />
    </>
  )
}
