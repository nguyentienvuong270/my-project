let myLibrary = new Library();
myLibrary.getDataInStorage();

// Khởi tạo users mặc định nếu chưa có
function setupInitialUsers() {
  const users = [
    { username: "ntv", password: "123", role: "admin" },
    { username: "mem", password: "123", role: "member" },
  ];
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
  }
}
setupInitialUsers();

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

// Quản lý danh sách mượn sách
function getBorrowList() {
  let borrowList = localStorage.getItem("borrowList");
  return borrowList ? JSON.parse(borrowList) : [];
}

function saveBorrowList(list) {
  localStorage.setItem("borrowList", JSON.stringify(list));
}

function renderTopButtons() {
  const user = getCurrentUser();
  let html = "";
  if (user) {
    let avatarUrl = "";

    if (user.role === "admin") {
      avatarUrl = "https://img.freepik.com/premium-vector/character-avatar-isolated_729149-194801.jpg?semt=ais_hybrid&w=740";
    } else {
      avatarUrl = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg";
    }

    html += `<img src="${avatarUrl}" width="80" height="80" style="border-radius:50%;"><br>`;
    html += `<strong style="font-size: 30px;">${user.username}</strong> <br><br>`;
    html += `<button onclick="logout()">Đăng xuất</button> `;
    html += `<button onclick="navigateToHome()">Trang chủ</button>`;
    if (isAdmin()) {
      html += ` <button onclick="navigateToAdd()">Thêm mới</button>`;
      html += ` <button onclick="renderBorrowedList()">Sách đang mượn</button>`;
    }
  } else {
    html = ""; // Không cần nút gì khi chưa đăng nhập
  }
  document.getElementById("top-buttons").innerHTML = html;
}

function logout() {
  localStorage.removeItem("currentUser");
  renderTopButtons(); // Cập nhật lại khu vực top-buttons sau khi logout
  renderLoginScreen(); // Cập nhật lại UI chính
}

// Màn hình đăng nhập
function renderLoginScreen() {
  document.getElementById("ui").innerHTML = `
    <h2>Đăng nhập</h2>
    <input type="text" id="username" placeholder="Tên đăng nhập"><br>
    <input type="password" id="password" placeholder="Mật khẩu"><br>
    <button onclick="login()">Đăng nhập</button>
    <button onclick="renderRegisterScreen()">Đăng ký</button>
  `;
}

// Màn hình đăng ký tài khoản member
function renderRegisterScreen() {
  document.getElementById("ui").innerHTML = `
    <h2>Đăng ký tài khoản</h2>
    <input type="text" id="reg_username" placeholder="Tên đăng nhập"><br><br>
    <input type="password" id="reg_password" placeholder="Mật khẩu"><br><br>
    <input type="password" id="reg_password_confirm" placeholder="Nhập lại mật khẩu"><br><br>
    <button onclick="register()">Đăng ký</button>
    <button onclick="renderLoginScreen()">Quay lại</button>
  `;
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    navigateToHome();
  } else {
    alert("Sai tài khoản hoặc mật khẩu.");
  }
}

function register() {
  const username = document.getElementById("reg_username").value.trim();
  const password = document.getElementById("reg_password").value.trim();
  const passwordConfirm = document
    .getElementById("reg_password_confirm")
    .value.trim();
  if (!username || !password) {
    alert("Vui lòng điền đủ thông tin.");
    return;
  }
  if (password !== passwordConfirm) {
    alert("Mật khẩu nhập lại không đúng.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.username === username)) {
    alert("Tên đăng nhập đã tồn tại.");
    return;
  }

  const newUser = { username: username, password: password, role: "member" };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Tự động đăng nhập sau khi đăng ký
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  alert("Đăng ký thành công!");
  navigateToHome();
}

function generateId() {
  let list = myLibrary.getListBook();
  if (list.length === 0) return 1;
  let ids = list.map((book) => book.id);
  return Math.max(...ids) + 1;
}

function getAll(list) {
  let html = "";
  const currentUser = getCurrentUser();
  const borrowList = getBorrowList();

  for (let book of list) {
    const isBorrowedByUser = borrowList.some(
      (b) => b.bookId === book.id && b.username === currentUser?.username
    );

    html += `<tr>
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.category}</td>
          <td>${book.quantity}</td>
          <td><img src="${
            book.imageUrl
          }" width="80" height="100" onerror="this.src='https://via.placeholder.com/80x100?text=No+Image'"/></td>
          <td>${isBorrowedByUser ? "Đang mượn" : "Có sẵn"}</td>
          <td><button onclick="toggleBorrow(${book.id})"
        style="background-color: ${isBorrowedByUser ? '#f44336' : '#2196F3'}; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
        ${isBorrowedByUser ? "Trả" : "Mượn"
    }</button></td>
          ${
            isAdmin()
              ? `
            <td><button onclick="navigateToUpdate(${book.id})" style="background-color: #FFC107; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">Sửa</button></td>
            <td><button onclick="deleteBook(${book.id})" style="background-color: #9E9E9E; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">Xóa</button></td>
          `
              : ""
          }
        </tr>`;
  }
  document.getElementById("list_books").innerHTML = html;
}

function addBook() {
  let id = generateId();
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let category = document.getElementById("category").value;
  let quantity = parseInt(document.getElementById("quantity").value);
  let imageUrl = document.getElementById("imageUrl").value;
  if (title && author && category && quantity > 0) {
    let p = new Book(id, title, author, category, quantity, imageUrl);
    myLibrary.add(p);
    navigateToHome();
  } else {
    alert("Vui lòng điền đầy đủ và hợp lệ.");
  }
}

function deleteBook(id) {
  if (confirm("Bạn chắc chắn muốn xóa?")) {
    myLibrary.remove(id);
    navigateToHome();
  }
}

function updateBook(id) {
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let category = document.getElementById("category").value;
  let quantity = parseInt(document.getElementById("quantity").value);
  let imageUrl = document.getElementById("imageUrl").value;
  let p = new Book(id, title, author, category, quantity, imageUrl);
  myLibrary.update(id, p);
  navigateToHome();
}

function toggleBorrow(id) {
  let currentUser = getCurrentUser();
  if (!currentUser) {
    alert("Bạn cần đăng nhập để mượn/trả sách.");
    return;
  }

  let book = myLibrary.getBookById(id);
  let borrowList = getBorrowList();
  let isBorrowedByUser = borrowList.some(
    (b) => b.bookId === id && b.username === currentUser.username
  );

  if (isBorrowedByUser) {
    // Trả sách
    borrowList = borrowList.filter(
      (b) => !(b.bookId === id && b.username === currentUser.username)
    );
    book.quantity += 1;
  } else {
    if (book.quantity < 1) {
      alert("Sách đã hết số lượng.");
      return;
    }
    book.quantity -= 1;
    borrowList.push({ username: currentUser.username, bookId: id });
  }

  saveBorrowList(borrowList);
  myLibrary.update(id, book);
  navigateToHome();
}

function searchBookByTitle() {
  let titleSearch = document.getElementById("search").value;
  let list = myLibrary.getListByTitleOrAuthor(titleSearch);
  getAll(list);
}

function filterByCategory(category) {
  let list = myLibrary
    .getListBook()
    .filter((b) => b.category.toLowerCase() === category.toLowerCase());
  getAll(list);
}

function navigateToHome() {
  renderTopButtons();
  document.getElementById("ui").innerHTML = `
        <h2>Danh sách sách</h2>
        <input type="text" placeholder="Tìm kiếm" id="search" oninput="searchBookByTitle()"> <br><br>
        <button onclick="filterByCategory('Sách Giáo Khoa')">Sách Giáo Khoa</button>
        <button onclick="filterByCategory('Sách Tham Khảo')">Sách Tham Khảo</button>
        <button onclick="filterByCategory('Khoa Học')">Khoa Học</button>
        <button onclick="filterByCategory('Công nghệ')">Công nghệ</button>
        <button onclick="navigateToHome()">Tất cả</button><br><br>
        <table border="1">
          <tr>
            <th>Id</th><th>Tên</th><th>Tác Giả</th><th>Thể Loại</th><th>Số lượng</th>
            <th>Ảnh</th><th>Trạng thái</th><th>Mượn/Trả</th>${
              isAdmin() ? "<th>Sửa</th><th>Xóa</th>" : ""
            }
          </tr>
          <tbody id="list_books"></tbody>
        </table>`;
  getAll(myLibrary.getListBook());
}

function navigateToAdd() {
  document.getElementById("ui").innerHTML = `
        <h2>Thêm sách</h2>
        <input type="text" placeholder="Tên" id="title"><br><br>
        <input type="text" placeholder="Tác giả" id="author"><br><br>
        <input type="number" placeholder="Số lượng" id="quantity" min="1"><br><br>
        <input type="text" placeholder="Link ảnh" id="imageUrl"><br><br>
        <select id="category">
          <option value="Sách Giáo Khoa">Sách Giáo Khoa</option>
          <option value="Sách Tham Khảo">Sách Tham Khảo</option>
          <option value="Khoa Học">Khoa Học</option>
          <option value="Công nghệ">Công nghệ</option>
        </select><br><br>
        <button onclick="addBook()">Thêm</button>
        <button onclick="navigateToHome()">Hủy</button>
      `;
}

function navigateToUpdate(id) {
  let book = myLibrary.getBookById(id);
  document.getElementById("ui").innerHTML = `
        <h2>Sửa sách</h2>
        <input type="text" id="title" value="${book.title}"><br><br>
        <input type="text" id="author" value="${book.author}"><br><br>
        <input type="number" id="quantity" value="${book.quantity}" min="1"><br><br>
        <input type="text" id="imageUrl" value="${book.imageUrl}"><br><br>
        <select id="category">
          <option value="Sách Giáo Khoa" ${book.category === "Sách Giáo Khoa" ? "selected" : ""}>Sách Giáo Khoa</option>
          <option value="Sách Tham Khảo" ${book.category === "Sách Tham Khảo" ? "selected" : ""}>Sách Tham Khảo</option>
          <option value="Khoa Học" ${book.category === "Khoa Học" ? "selected" : ""}>Khoa Học</option>
          <option value="Công nghệ" ${book.category === "Công nghệ" ? "selected" : ""}>Công nghệ</option>
        </select><br><br>
        <button onclick="updateBook(${book.id})">Lưu</button>
        <button onclick="navigateToHome()">Hủy</button>
      `;
}

// Hiển thị danh sách mượn sách cho admin
function renderBorrowedList() {
  const borrowList = getBorrowList();
  if (borrowList.length === 0) {
    document.getElementById("ui").innerHTML =
      "<h2>Chưa có ai mượn sách</h2><button onclick='navigateToHome()'>Quay lại</button>";
    return;
  }

  let html = `<h2>Danh sách sách đang được mượn</h2>
        <table border="1">
          <tr><th>Tài khoản</th><th>Tên sách</th><th>Tác giả</th><th>Thể loại</th></tr>`;

  for (let borrow of borrowList) {
    let book = myLibrary.getBookById(borrow.bookId);
    if (book) {
      html += `<tr>
            <td>${borrow.username}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
          </tr>`;
    }
  }
  html += `</table><br><button onclick='navigateToHome()'>Quay lại</button>`;

  document.getElementById("ui").innerHTML = html;
}

if (localStorage.getItem("currentUser")) {
  navigateToHome();
} else {
  renderTopButtons();
  renderLoginScreen(); // Hiển thị luôn form login
}