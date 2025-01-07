interface InputProps
{
  reference?:any;//for now any
  placeholder:string;
}
export function Input({reference,placeholder}:InputProps)
{
  
  return <div>
    <input ref={reference} type="text" placeholder={placeholder} className="px-4 py-2 border rounded m-1" />
  </div>
}