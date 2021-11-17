import blur from '../images/blur.png'
import blur2 from '../images/blur2.png'

function Modal(props) {
    return (
        <>
        <img alt="b" className="blured-circle left-blur" style={{left:0}} src={blur2}/>
        <img alt="b" className="blured-circle" src={blur} style={{right:0}}/>
        </>
    );
}

export default Modal;
