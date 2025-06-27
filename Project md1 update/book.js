class Book {
  constructor(id, title, author, category, quantity = 1, imageUrl = "") {
    this.id = id;
    this.title = title;
    this.author = author;
    this.category = category;
    this.quantity = quantity;
    this.imageUrl = imageUrl;
  }
}