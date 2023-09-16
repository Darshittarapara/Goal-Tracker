import React from 'react'
import "./AnalysisItem.scss";

interface AnalysisItemProps {
    label: string;
    value: any
}
const AnalysisItem: React.FC<AnalysisItemProps> = ({
    label,
    value
}) => {
    return (
        <div className='analysis-container'>
            <label className='text-muted'>
                {label}
            </label>
            <span className='text-bold'>
                {value}
            </span>
        </div>
    )
}

export default AnalysisItem