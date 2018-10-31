import React from 'react'
import { Link } from 'react-router'

class Resotre extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <Link to='/initialization/restoreKeystore'>
          Restore by keystore
        </Link>
        <Link to='/initialization/restoreMnemonic'>
          Restore by Mnemonic
        </Link>

        <Link to='/initialization'>
          cancel
        </Link>
      </div>
    )
  }
}


export default Resotre
