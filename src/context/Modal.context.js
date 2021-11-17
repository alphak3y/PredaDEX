
import React, {useState, createContext} from 'react'


export const ModalContext = createContext()


export const ModalProvider = (props) => {
    const [whichModalToOpen, setWhichModalToOpen] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isFirstToken, setIsFirstToken] = useState(true)
    const [closing, setClosing] = useState(false)

    return(
        <ModalContext.Provider value={{isOpen, setIsOpen, whichModalToOpen, setWhichModalToOpen, isFirstToken, setIsFirstToken, closing, setClosing}}>
            {props.children}
        </ModalContext.Provider>
    )
}