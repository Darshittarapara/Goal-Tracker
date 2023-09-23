import { InputLabel, Select, OutlinedInput, MenuItem, FormControl } from '@mui/material'
import React from 'react'

export interface OptionsKeys {
    value: string;
    label: string
}
export interface MaterialUISelectInputProps {
    updateFieldKey: string;
    label: string
    className?: string
    options: OptionsKeys[]
    value: string;
    onChange: (value: string, key: string) => void
}
const MaterialUISelectInput: React.FC<MaterialUISelectInputProps> = ({
    updateFieldKey,
    label,
    onChange,
    className,
    value,
    options
}) => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <FormControl sx={{ ml: 1, maxWidth: 300, minWidth: 200, }} className={className}>
            <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
            <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={value}
                onChange={(e) => onChange(e.target.value, updateFieldKey)}
                input={<OutlinedInput label={label} />}
                MenuProps={MenuProps}
            >
                {options.map(({ value, label }) => (
                    <MenuItem
                        key={value}
                        value={value}

                    >
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default MaterialUISelectInput