import React from 'react'
import { copyToClipboard } from 'utility/clipboard'
import styles from './Mnemonic.scss'

class Mnemonic extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      mnemonicArray : this.props.mnemonic.split(' ')
    }
  }

  render() {
    const {mnemonicArray} = this.state
    return (
     <div>
       <div className={styles.flexContainer}>
         <h4>Mnemonic</h4>
         <button
           className='btn btn-link'
           onClick={() => copyToClipboard(this.props.mnemonic)}
         >
           <img className={styles.copy} src={require('images/copy.svg')}/>
         </button>
       </div>
       <p>Write down the following seed and save it in a secure location.</p>
       <div className={`${styles.flexContainer} ${styles.seedArea}`}>

         {
           mnemonicArray.map((seedWord) =>
             <div className={styles.seed}>{seedWord}</div>)
         }
       </div>

     </div>
    )
  }
}

export default Mnemonic
