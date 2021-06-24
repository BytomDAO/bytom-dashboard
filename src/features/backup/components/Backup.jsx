import React from 'react';
import { connect } from 'react-redux';
import { RestoreKeystore, RestoreMnemonic, PageContent, PageTitle, ErrorBanner, ShowMnemonic } from 'features/shared/components';
import styles from './Backup.scss';
import actions from 'actions';
import { withNamespaces } from 'react-i18next';
import { chainClient } from 'utility/environment'

class Backup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      error: null,
      accountList: []
    };

    this.mnemonicPopup = this.mnemonicPopup.bind(this);
    this.keystorePopup = this.keystorePopup.bind(this);
    this.submitWithValidation = this.submitWithValidation.bind(this);
    this.showMnemonicPopup = this.showMnemonicPopup.bind(this);

    this.fetchAccountList()
  }

  fetchAccountList () {
    chainClient().accounts.query().then(res => {
      if (res.status === 'fail') return
      this.setState({
        accountList: res.data
      })
    })
  }

  setValue(event) {
    this.setState({
      value: event.target.value,
    });
  }

  mnemonicPopup(e) {
    e.preventDefault();
    this.props.showModal(<RestoreMnemonic success={this.props.success} />);
  }

  keystorePopup(e) {
    e.preventDefault();
    this.props.showModal(<RestoreKeystore success={this.props.success} />);
  }

  showMnemonicPopup(e) {
    e.preventDefault();
    this.props.showModal(<ShowMnemonic success={this.props.success} />);
  }

  submitWithValidation() {
    this.props
      .backup()
      .then(() => {
        this.setState({
          error: null,
        });
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
  }

  render() {
    const { t } = this.props;
    const { error } = this.state;

    let cryproMnemonic
    const account = this.state.accountList.find(item => item.alias === this.props.currentAccount)
    if (account && account.xpubs && account.xpubs.length) {
      cryproMnemonic = localStorage.getItem(`mnemonic:${account.xpubs[0]}`)
    }

    const newButton = (
      <button className={`btn btn-primary btn-large ${styles.submit}`} onClick={() => this.submitWithValidation()}>
        {t('backup.download')}
      </button>
    );
    const mnemonicButton = (
      <button className={`btn btn-primary btn-large ${styles.submit}`}  onClick={this.showMnemonicPopup}>
        {t('backup.showMnemonic')}
      </button>
    );
    const restoreKeystoreButton = (
      <button className={`btn btn-primary btn-large ${styles.submit}`} onClick={this.keystorePopup}>
        {t('backup.selectFile')}
      </button>
    );

    const restoreMnemonicButton = (
      <button className={`btn btn-primary btn-large ${styles.submit}`} onClick={this.mnemonicPopup}>
        {t('backup.restore')}
      </button>
    );

    return (
      <div className="flex-container">
        <PageTitle title={t('backup.title')} />
        <PageContent>
          <div onChange={(e) => this.setValue(e)}>
            <div className={styles.choices}>
              <div className={styles.choice_wrapper}>
                <label>
                  <input className={styles.choice_radio_button} type="radio" name="type" value="backup" />
                  <div className={`${styles.choice} ${styles.backup} `}>
                    <img className={styles.choice_img} src={require('images/backup/backup.png')} />
                    <span className={styles.choice_title}>{t('backup.backup')}</span>
                    <p>{t('backup.backupDescription')}</p>
                  </div>
                </label>
              </div>

              <div className={styles.choice_wrapper}>
                <label>
                  <input className={styles.choice_radio_button} type="radio" name="type" value="restoreKeystore" />
                  <div className={`${styles.choice} ${styles.restoreKeystore}`}>
                    <img className={styles.choice_img} src={require('images/backup/restore-keystore.png')} />
                    <span className={styles.choice_title}>{t('backup.restoreKeystore')}</span>
                    <p>{t('backup.restoreKeystoreDescription')}</p>
                  </div>
                </label>
              </div>

              <div className={styles.choice_wrapper}>
                <label>
                  <input className={styles.choice_radio_button} type="radio" name="type" value="restoreMnemonic" />
                  <div className={`${styles.choice} ${styles.restoreMnemonic}`}>
                    <img className={styles.choice_img} src={require('images/backup/restore-mnemonic.png')} />
                    <span className={styles.choice_title}>{t('backup.restoreMnemonic')}</span>
                    <p>{t('backup.restoreMnemonicDescription')}</p>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.choices}>
              <div>
                {this.state.value === 'backup' && [
                  <div className={styles.submitWrapper}>{error && <ErrorBanner error={error} />}</div>,
                  <span className={styles.submitWrapper}>{newButton}</span>
                ]}
                {this.state.value === 'backup' && cryproMnemonic && <span className={styles.submitWrapper}>{mnemonicButton}</span>}
              </div>

              <div>
                {this.state.value === 'restoreKeystore' && (
                  <span className={styles.submitWrapper}>{restoreKeystoreButton}</span>
                )}
              </div>

              <div>
                {this.state.value === 'restoreMnemonic' && (
                  <span className={styles.submitWrapper}>{restoreMnemonicButton}</span>
                )}
              </div>
            </div>
          </div>
        </PageContent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentAccount: state.account.currentAccount
});

const mapDispatchToProps = (dispatch) => ({
  backup: () => dispatch(actions.backUp.backup()),
  success: () => dispatch(actions.backUp.success()),
  showModal: (body) =>
    dispatch(
      actions.app.showModal(body, actions.app.hideModal, null, {
        noCloseBtn: true,
      }),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translations')(Backup));
