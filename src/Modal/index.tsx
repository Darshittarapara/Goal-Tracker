export interface TextInputProps {
    value: string;
    type?: "text" | "number" | "email"
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