import React from 'react'
import styles from './Index.scss'
import { Link } from 'react-router'
import {withNamespaces} from 'react-i18next'
import {connect} from 'react-redux'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null
    }
  }


  setValue(event) {
    this.setState({
      value:event.target.value
    })
  }

  render() {
    const coreData = this.props.coreData
    const t = this.props.t
    if(!coreData){
      return <ul></ul>
    }

    const networkID = coreData.networkId
    const createButton = <Link className={`btn btn-primary btn-large ${styles.submit}`} to='/initialization/register'>{t('init.create')}</Link>
    const restoreKeystore = <Link className={`btn btn-primary btn-large ${styles.submit}`}to='/initialization/restoreKeystore'>{t('init.restoreWallet')}</Link>
    const restoreMnemonic = <Link className={`btn btn-primary btn-large ${styles.submit}`} to='/initialization/restoreMnemonic'>{t('init.restoreWallet')}</Link>

    return (
      <div onChange={e => this.setValue(e)}>
        <h2 className={styles.title}>{t('init.welcome',{network:networkID})}</h2>

        <div className={styles.choices}>
          <div className={styles.choice_wrapper}>
            <label>
              <input className={styles.choice_radio_button}
                     type='radio'
                     name='type'
                     value='backup'/>
              <div className={`${styles.choice} ${styles.backup} `}>
                    <img className={styles.choice_img} src={require('images/backup/create.png')} />
                <span className={styles.choice_title}>{t('init.create')}</span>
                <p>
                  {t('init.createDescription')}
                </p>
              </div>
            </label>
          </div>

          <div className={styles.choice_wrapper}>
            <label>
              <input className={styles.choice_radio_button}
                     type='radio'
                     name='type'
                     value='restoreKeystore' />
              <div className={`${styles.choice} ${styles.restoreKeystore}`}>
                    <img className={styles.choice_img} src={require('images/backup/restore-keystore.png')} />
                <span className={styles.choice_title}>{t('backup.restoreKeystore')}</span>
                <p>
                  {t('backup.restoreKeystoreDescription')}
                </p>
              </div>
            </label>
          </div>

          <div className={styles.choice_wrapper}>
            <label>
              <input className={styles.choice_radio_button}
                     type='radio'
                     name='type'
                     value='restoreMnemonic' />
              <div className={`${styles.choice} ${styles.restoreMnemonic}`}>
                    <img className={styles.choice_img} src={require('images/backup/restore-mnemonic.png')} />
                <span className={styles.choice_title}>{t('backup.restoreMnemonic')}</span>
                <p>
                  {t('backup.restoreMnemonicDescription')}
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.choices}>
          <div>
            {
              this.state.value === 'backup'
              &&<span className={styles.submitWrapper}>{createButton}</span>
            }
          </div>

          <div>
            {
              this.state.value === 'restoreKeystore'
              &&
              <span className={styles.submitWrapper}>{restoreKeystore}</span>
            }
          </div>

          <div>
            {
              this.state.value === 'restoreMnemonic'
              &&  <span className={styles.submitWrapper}>{restoreMnemonic}</span>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withNamespaces('translations') (connect(
  (state) => ({
    coreData:state.core.coreData
  }),
)(Index))
