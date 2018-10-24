import React from 'react'
import styles from './Index.scss'
import { Link } from 'react-router'

class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.main}>
        <Link to='/initialization/register'>
          Create Wallet
        </Link>
        <button>
          Restore Wallet
        </button>
      </div>
    )
  }
}

export default Index
