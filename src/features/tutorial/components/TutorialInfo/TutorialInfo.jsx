import React from 'react'
import styles from './TutorialInfo.scss'
import { Link } from 'react-router'

class TutorialInfo extends React.Component {

  render() {
    let objectImage
    try {
      objectImage = require(`images/empty/${this.props.image}.svg`)
    } catch (err) { /* do nothing */ }

    return (
      <div>
        <div className={styles.container}>
          {this.props.image && <img className={styles.image} src={objectImage} />}
          <div className={styles.text}>
            {this.props.content.map(function (contentLine, i){
              let str = contentLine
              if (contentLine['line']) { str = contentLine['line'] }
              if(contentLine['list']){
                let list = []
                contentLine['list'].forEach(function(listItem, j){
                  list.push(<tr key={j} className={styles.listItemGroup}>
                    <td className={styles.listBullet}>{j+1}</td>
                    <td>{listItem}</td>
                  </tr>)
                })
                return <table key={i} className={styles.listItemContainer}>
                  <tbody>{list}</tbody>
                </table>
              }
              return <p key={i}>{str}</p>
            })}
          </div>
        </div>
    </div>
    )
  }
}

export default TutorialInfo
