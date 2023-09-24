export interface TextInputProps {
    value: string;
    hasRequired?: boolean
    type?: "text" | "number" | "email"
    onChange: (value: string, name: string) => void;
    placeholder: string;
    labelText: string;
    onBlur: (name: string) => void
    name: string
}

export interface TextareaInputProps {
    value: string;
    hasRequired?: boolean
    onChange: (value: string, name: string) => void;
    placeholder: string;
    labelText: string;
    onBlur: (name: string) => void
    name: string
}

export interface AuthFormikValue {
    email: string
}

export interface ImageProps {
    className: string;
    src: string;
    alt: string
}

export interface AddGoalFormikFormValues {
    name: string,
    startDate: Date
    endDate: Date
    isAddToFavorite: boolean
    priority: string
    archiveSteps: string
}

export interface DateInputProps {
    value: Date;
    hasRequired?: boolean
    min?: Date
    onChange: (value: Date, name: string) => void;
    placeholder: string;
    labelText: string;
    onBlur: (name: string) => void
    name: string
}

export interface SelectInputProps {
    value: string;
    onChange: (value: string, name: string) => void;
    placeholder: string;
    labelText: string;
    hasRequired?: boolean
    onBlur: (name: string) => void
    name: string
    options: { id: string, label: string }[]
}