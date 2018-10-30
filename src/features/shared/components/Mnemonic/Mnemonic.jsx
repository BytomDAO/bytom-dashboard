import React from 'react'
import { copyToClipboard } from 'utility/clipboard'


class Mnemonic extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
     <div>
       {this.props.mnemonic}

       <button
         className='btn btn-primary'
         onClick={() => copyToClipboard(this.props.mnemonic)}
       >
         Copy to clipboard
       </button>
     </div>
    )
  }
}

export default Mnemonic
