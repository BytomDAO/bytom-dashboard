import React from 'react'
import styles  from './ConsoleSection.scss'
import Console from 'react-console-component'
import command from './command.json'

class ConsoleSection extends React.Component {
  constructor(props) {
    super(props)
    this.echo = this.echo.bind(this)
  }

  echo (text) {
    if(text.startsWith('help')){
      this.terminal.log(command['help'])
    }else{
      this.props.cmd(text)
        .then(data=>
        {
          this.terminal.log(JSON.stringify(data, null, 2))
        }).catch(() =>
        {
          this.terminal.log('command not found')
        })
    }
    this.terminal.return()
  }

  render() {
    return(
      <div className='form-group'>
        <div
          className={styles.reactConsoleContainer}
        >
          <p>
            Welcome to the Bytom Core API console.<br/>
            Type <code>help</code> for an overview of available commands.
          </p>
          <p className='text-danger'>
            <strong>WARNING:</strong> Scammers have been active, telling users to type commands here, stealing their wallet contents. Do not use this console without fully understanding the ramification of a command.
          </p>

          <Console
            ref={ref => this.terminal = ref}
            handler={this.echo}
            autofocus={true}
          />
        </div>
      </div>
    )
  }
}

export default ConsoleSection