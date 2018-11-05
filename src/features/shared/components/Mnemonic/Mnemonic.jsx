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
       <h2>Mnemonic</h2>
       <p>Write down the following seed and save it in a secure location.</p>
       <div>
         {
           mnemonicArray.map((seedWord) =>
             <div className={styles.seed}>{seedWord}</div>)
         }
         <button
           className={`btn btn-primary ${styles.copy}`}
           onClick={() => copyToClipboard(this.props.mnemonic)}
         >
           Copy to clipboard
         </button>
       </div>

     </div>
    )
  }
}

export default Mnemonic
