import { searchUser } from "./search.js"

export class GitFav {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem(`@github-favorites:`)) || []
    console.log(this.entries)
  }
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  async add(value) {
    try {
      const userExists = this.entries.find(entry => entry.login === value.toUpperCase() || entry.login === value.toLowerCase())
      if (userExists) {
        throw new Error("Usuário já cadastrado")
      }

      const user = await searchUser.search(value)

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado")
      }

      this.entries = [user, ...this.entries]

      this.save()
      this.updateTable()


    } catch (error) {
      alert(error.message)
    }

  }
  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.updateTable()
    this.save()
  }
}
export class GitFavApi extends GitFav {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.updateTable()
    this.addFavorite()
  }
  updateTable() {
    this.deleteAllRows()
    this.tableScreenUpdate()
    this.entries.forEach(user => {
      const Row = this.createRows()
      Row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      Row.querySelector('.user img').alt = `Imagem de ${user.name}`
      Row.querySelector('.user a').href = `https://github.com/${user.login}`
      Row.querySelector('.user p').textContent = user.name
      Row.querySelector('.user span').textContent = user.login
      Row.querySelector('.repositories').textContent = user.public_repos
      Row.querySelector('.followers').textContent = user.followers
      Row.querySelector('.button-remove').onclick = () => {
        const deleteRow = confirm(`tem certeza que deseja deletar esse usuario de seus favoritos ?`)
        if (deleteRow) {
          this.delete(user)
        }
      }
      this.tbody.append(Row)
    })
  }
  deleteAllRows() {
    this.tbody.querySelectorAll(`tr`).forEach((tr) => {
      tr.remove()
    })
  }
  createRows() {
    const tr = document.createElement(`tr`)
    tr.innerHTML = `
          <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
            <a href="https://github.com/maykbrito" target="_blank">
              <p>Mayk Brito</p>
              <span>maykbrito</span>
            </a>
          </td>
          <td class="repositories">
            76
          </td>
          <td class="followers">
            9589
          </td>
          <td>
            <button class="button-remove">&times;</button>
          </td>
        `
    return tr
  }
  addFavorite() {
    const addButton = this.root.querySelector('.button-fav')
    const input = this.root.querySelector('.search input')
    addButton.addEventListener("click", () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    })
    input.addEventListener(`keypress`, (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        addButton.click()
      }
    })
  }
  tableScreenUpdate() {
    if (this.entries.length >= 1) {
      this.hideClearTableScreen()
    }
    else {
      this.showClearTableScreen()
    }
  }
  hideClearTableScreen() {
    const clearTableScreen = this.root.querySelector(`.clearTableScreen`)
    clearTableScreen.classList.add(`hide`)
  }
  showClearTableScreen() {
    const clearTableScreen = this.root.querySelector(`.clearTableScreen`)
    clearTableScreen.classList.remove(`hide`)
  }
}