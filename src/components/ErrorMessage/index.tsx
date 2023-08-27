import React from 'react'

interface ErrorMessageProps {
    error: string
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({
    error

}) => {
    return (
        <div className='mt-1 text-danger'>{error}</div>
    )
}

export default ErrorMessage