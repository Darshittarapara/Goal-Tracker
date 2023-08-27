import { TextInputProps } from 'Modal'
import React from 'react'

const TextInput: React.FC<TextInputProps> = ({
    labelText,
    onChange,
    type = "text",
    onBlur,
    ...props
}) => {
    return (
        <div className="form-group">
            <label className='form-label' htmlFor={props.name}>{labelText}</label>
            <input onBlur={(e) => onBlur(e.target.name)} id={props.name} className='form-control' type={type} {...props} onChange={(e) => onChange(e.target.value, e.target.name)} />
        </div>

    )
}
export default TextInput 