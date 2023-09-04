import { DateInputProps, TextInputProps } from 'Modal'
import React from 'react'
import DatePicker from "react-datepicker";
import './index.scss';

const DateInput: React.FC<DateInputProps> = ({
	labelText,
	onChange,
	onBlur,
	min,
	hasRequired = true,
	...props
}) => {

	return (
		<div className={`form-group mt-1 mb-1 ${hasRequired && "required"} date-picker-container`}>
			<label className='form-label text-bold' htmlFor={props.name}>{labelText}</label>
			<DatePicker
				showIcon
				className='form-control'
				minDate={min}
				selected={props.value}
				dateFormat={"dd-MM-yyyy"}
				onBlur={() => onBlur(props.name)}
				onChange={(date) => {
					if (date) {
						onChange(date, props.name)
					}
				}}
			/>
			{/* <input
				onBlur={(e) => onBlur(e.target.name)}
				id={props.name}
				
				type={"date"} {...props}
				onChange={(e) => onChange(e.target.value, e.target.name)}
			/> */}
		</div>

	)
}
export default DateInput 