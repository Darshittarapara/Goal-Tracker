import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
export interface ModalProps {
    open: boolean;
    handlerClose: () => void;
    title: string;
    buttonText: string;
    descriptions: string[]
}
const Modal: React.FC<ModalProps> = ({
    open,
    handlerClose,
    buttonText,
    title,
    descriptions
}) => {

    return (
        <Dialog
            open={open}
            onClose={handlerClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                {descriptions.map((text, index) => {
                    return (
                        <DialogContentText key={`${index}`} id="alert-dialog-description">
                            {text}
                        </DialogContentText>
                    )
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={handlerClose} autoFocus>
                    {buttonText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Modal