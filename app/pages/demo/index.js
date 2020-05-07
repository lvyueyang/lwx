const TEXT = ['🤣', '👍', '😂', '👏', '😆', '💋', '🎁', '🧑', '🎉', '🎇', '🎋', '🎍', '🧧', '⚽', '🍔', '🍿', '🌰']
let num = 0

Page({
    data: {
        list: []
    },
    handlerAdd() {
        num += 1
        let key = `item${num}`
        const index = Math.ceil(Math.random() * TEXT.length) - 1
        let list = JSON.parse(JSON.stringify(this.data.list))
        list.push({text: TEXT[index], id: key})
        let max = 100
        if (list.length === max) {
            list.reverse()
            list.length = list.length - (max - 70)
            list.reverse()
        }
        this.setData({
            list
        })
    }
})
