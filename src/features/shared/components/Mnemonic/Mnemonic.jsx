import React from 'react'
import { copyToClipboard } from 'utility/clipboard'
import styles from './Mnemonic.scss'
import {withNamespaces} from 'react-i18next'

class Mnemonic extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      mnemonicArray : this.props.mnemonic.split(' ')
    }
  }

  render() {
    const t = this.props.t
    const {mnemonicArray} = this.state
    return (
     <div className={styles.container}>
       <div className={styles.flexContainer}>
         <h4>{t('init.mnemonic')}</h4>
         <button
           className='btn btn-link'
           onClick={() => copyToClipboard(this.props.mnemonic)}
         >
           <img className={styles.copy} src={require('images/copy.svg')}/>
         </button>
       </div>
       <p>{t('mnemonic.backupMessage')}</p>
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

export default withNamespaces('translations') (Mnemonic)
