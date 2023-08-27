import { ImageProps } from 'Modal'
import React from 'react'


const Img: React.FC<ImageProps> = ({
    ...props
}) => {
    return (
        <img src={props.src} className={props.className} alt={props.alt} />
    )
}

export default Img