import { SelectInputProps } from 'Modal'
import React from 'react'

export const SelectInput: React.FC<SelectInputProps> = ({
    options,
    value,
    name,
    onBlur,
    onChange,
    labelText,
    hasRequired = true,
    placeholder
}) => {
    return (
        <div className={`form-group mt-1 mb-1 ${hasRequired && "required"}`}>
            <label className='form-label' htmlFor={name}>{labelText}</label>
            <select className='form-control' placeholder={placeholder} name={name} value={value} onChange={(e) => onChange(e.target.value, e.target.name)}>
                {options?.map((option, index) => {
                    return <option onBlur={(e) => onBlur(name)} key={`${index}`} value={option.id}>{option.label}</option>
                })}
            </select>
        </div>
    )
}
