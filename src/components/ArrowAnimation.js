import TransactionSubmittedArrowPointer from '../images/TransactionSubmittedArowPointer.svg'



function ArrowAnimation() {
  return (
    <div className="transaction-submitted-animation-wrapper mt-4">
        <img  className = 'arrow-animation' src={TransactionSubmittedArrowPointer} alt="transaction submited animation" />
    </div>

  );
}

export default ArrowAnimation;