import React from 'react'
import styles from './TutorialForm.scss'

class TutorialForm extends React.Component {
  render() {
    const content_normal = this.props.lang ==='zh' ? this.props.content_zh: this.props.content
    const content_adv = this.props.lang ==='zh' ? this.props.content_ad_zh: this.props.content_ad

    let content = this.props.advTx? content_adv: content_normal
    return (
      <div className={styles.container}>
        <div className={`${styles.tutorialContainer} ${styles.fixedTutorial}`}>
          <div className={styles.header}>
            {content['header']}
          </div>
          <div className={styles.list}>
            <table className={styles.listItemContainer}>
              {content['steps'].map(function (contentLine, i){
                let title = contentLine['title']
                let rows = [
                  <tr key={`item-title-${i}`}>
                    <td className={styles.listBullet}>{i+1}</td>
                    <td>{title}</td>
                  </tr>
                ]
                if (contentLine['description']) {
                  let descriptionResult = []
                  contentLine['description'].forEach( (descriptionLine, j) => {
                    let description = descriptionLine
                    if (description['line']) { description = description['line'] }

                    descriptionResult.push(description)
                  })
                  rows.push(<tr key={`item-description-${i}`} className={styles.listItemDescription}>
                    <td></td>
                    <td>{descriptionResult}</td>
                  </tr>)
                }

                return <tbody key={`item-${i}`} className={styles.listItemGroup}>{rows}</tbody>
              })}
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default TutorialForm
