import { reduxForm } from 'redux-form'
import { ErrorBanner, SubmitIndicator } from 'features/shared/components'
import pick from 'lodash/pick'
import actions from 'actions'
import React from 'react'
import styles from './ElectronIndex.scss'
import {connect} from 'react-redux'
import {withNamespaces} from 'react-i18next'

class Index extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithValidation = this.submitWithValidation.bind(this)
  }

  submitWithValidation(data) {
    return new Promise((resolve, reject) => {
      this.props.submitForm(data)
        .catch((err) => reject({type: err}))
    })
  }

  render() {
    const {
      fields: {
        type
      },
      handleSubmit,
      submitting
    } = this.props

    const t = this.props.t

    const typeChange = (event) => {
      type.onChange(event).value
    }

    const typeProps = {
      ...pick(type, ['name', 'value', 'checked', 'onBlur', 'onFocus']),
      onChange: typeChange
    }

    let configSubmit = [
      (type.error && <ErrorBanner
        key='configError'
        title='There was a problem configuring your core'
        error={type.error}
      />),
      <button
        key='configSubmit'
        type='submit'
        className={`btn btn-primary btn-large ${styles.submit}`}
        disabled={ !type.value || submitting}>
          &nbsp;{t('welcome.join')}
      </button>
    ]

    if (submitting) {
      configSubmit.push(<SubmitIndicator
        text={t('welcome.joining')}
      />)
    }

    return (
      <form  onSubmit={handleSubmit(this.submitWithValidation)} >
        <h2 className={styles.title}>{t('welcome.title')}</h2>

        <div className={styles.choices}>

          <div className={styles.choice_wrapper}>
            <label>
              <input className={styles.choice_radio_button}
                    type='radio'
                    {...typeProps}
                    value='mainnet' />
              <div className={`${styles.choice} ${styles.join}`}>
                    <img className={styles.choice_img} src={require('images/config/join.png')} />
                <span className={styles.choice_title}>{t('welcome.mainnetTitle')}</span>

                <p>
                  {t('welcome.mainnetMsg')}
                </p>
              </div>
            </label>
          </div>

          <div className={styles.choice_wrapper}>
            <label>
              <input className={styles.choice_radio_button}
                    type='radio'
                    {...typeProps}
                    value='testnet' />
              <div className={`${styles.choice} ${styles.testnet}`}>
                    <img className={styles.choice_img} src={require('images/config/testnet.png')} />
                  <span className={styles.choice_title}>{t('welcome.testnetTitle') }</span>

                  <p>
                    {t('welcome.testnetMsg')}
                  </p>
              </div>
            </label>
          </div>

          <div className={styles.choice_wrapper}>
            <label>
              <input className={styles.choice_radio_button}
                     type='radio'
                     {...typeProps}
                     value='solonet' />
              <div className={`${styles.choice} ${styles.new}`}>
                    <img className={styles.choice_img} src={require('images/config/new.png')} />
                <span className={styles.choice_title}>{t('welcome.solonetTitle') }</span>

                <p>
                  {t('welcome.solonetMsg')}
                </p>
              </div>
            </label>
          </div>
        </div>

        {type.value &&<div className={`${styles.choices} ${styles.flexCenter}`}>
          <div> {configSubmit} </div>
        </div>}
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitForm: (data) => dispatch(actions.configuration.submitConfiguration(data))
})

const mapStateToProps = (state) => ({
  lang: state.core.lang
})

const config = {
  form: 'coreConfigurationForm',
  fields: [
    'type'
  ]
}

export default  withNamespaces('translations') (connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm(config)(Index)))