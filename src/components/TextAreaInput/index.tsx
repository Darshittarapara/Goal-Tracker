import { TextareaInputProps } from 'Modal'
import React from 'react'

const TextareaInput: React.FC<TextareaInputProps> = ({
    labelText,
    onChange,
    onBlur,
    hasRequired = true,
    ...props
}) => {
    return (
        <div className={`form-group mt-1 mb-1 ${hasRequired && "required"}`}>
            <label className='form-label' htmlFor={props.name}>{labelText}</label>
            <textarea onBlur={(e) => onBlur(e.target.name)} id={props.name} className='form-control'  {...props} onChange={(e) => onChange(e.target.value, e.target.name)} ></textarea>
            {/* <input onBlur={(e) => onBlur(e.target.name)} id={props.name} className='form-control' type={type} {...props} onChange={(e) => onChange(e.target.value, e.target.name)} /> */}
        </div>

    )
}
export default TextareaInput 