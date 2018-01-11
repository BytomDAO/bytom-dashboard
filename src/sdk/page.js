class Page {

  constructor(data, client, memberPath) {
    this.items = []

    this.next = {}


    this.lastPage = false

    Object.assign(this, data)

    this.client = client
    this.memberPath = memberPath
  }

  nextPage(cb) {
    let queryOwner = this.client
    this.memberPath.split('.').forEach((member) => {
      queryOwner = queryOwner[member]
    })

    return queryOwner.query(this.next, cb)
  }
}

module.exports = Page
