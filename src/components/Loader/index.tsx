import React from 'react'
import { Spinner } from 'react-bootstrap';

const Loader = () => {
    return (
        <div className='d-flex justify-content-center'>
            <Spinner />
        </div>
    )
}
export default Loader;