import React from 'react'
import styles from './ListItem.scss'

class ListItem extends React.Component {
  render(){
    let content = this.props.content
    let message = content.commandOutput

    if(content.success){
      if(message) {
        if(content.command === 'help'){
          let line = []
          message.forEach( (descriptionLine) => {
            line.push(<div>{descriptionLine}</div>)
          })
          message = line
        }else{
          const keys = Object.keys(message)
          if (keys.length === 1) {
            message = message[keys[0]].toString()
          }
          else{
            message = JSON.stringify(message, null, 2)
          }
        }
      }
    }else{
      message = message.replace(/"/g,'')
    }

    return (
      <div className={styles.main}>
        <div className={styles.title}>{content.command}</div>
        {message && <div className={`${styles.messageBox} ${content.success? null: 'text-danger'}`}>{message}</div>}
      </div>
    )
  }
}

export default ListItem
