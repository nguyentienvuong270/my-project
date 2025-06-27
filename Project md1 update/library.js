class Library {
  constructor() {
    this.listbook = [];
  }

  getListByTitleOrAuthor(searchText) {
  let result = [];
  for (let i = 0; i < this.listbook.length; i++) {
    let book = this.listbook[i];
    let titleLower = book.title.toLowerCase();
    let authorLower = book.author.toLowerCase();
    let searchLower = searchText.toLowerCase();

    if (titleLower.includes(searchLower) || authorLower.includes(searchLower)) {
      result.push(book);
    }
  }
  return result;
}

  getListBook() {
    return this.listbook;
  }

  add(newbook) {
    this.listbook.push(newbook);
    this.saveDataInStorage();
  }

  remove(id) {
    let index = -1;
    for (let i = 0; i < this.listbook.length; i++) {
      let p = this.listbook[i];
      if (p.id == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      alert("Không có sản phẩm nào");
    } else {
      this.listbook.splice(index, 1);
    }
    this.saveDataInStorage();
  }

  getBookById(id) {
    for (let i = 0; i < this.listbook.length; i++) {
      let p = this.listbook[i];
      if (id == p.id) {
        return p;
      }
    }
  }

  update(id, newbook) {
    let index = -1;
    for (let i = 0; i < this.listbook.length; i++) {
      let p = this.listbook[i];
      if (p.id == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      alert("Không có sản phẩm nào");
    } else {
      this.listbook[index] = newbook;
    }
    this.saveDataInStorage();
  }

  saveDataInStorage() {
    localStorage.setItem("ListBook", JSON.stringify(this.listbook));
  }

  getDataInStorage() {
    let data = localStorage.getItem("ListBook");
    if (data) {
      this.listbook = JSON.parse(data);
    } else {
      this.listbook = [];
      this.saveDataInStorage();
    }
  }
}
