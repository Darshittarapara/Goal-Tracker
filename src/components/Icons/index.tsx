import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
interface IconProps {
    icon: IconProp;
    className?: string;
}
const Icon: React.FC<IconProps> = ({
    icon,
    className
}) => {
    return (
        <FontAwesomeIcon icon={icon} className={className || ""} />
    )
}

export default Icon