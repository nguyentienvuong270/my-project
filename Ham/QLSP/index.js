let productNames = [];
let currentEditIndex = null;

function add() {
  let newData = document.getElementById("newProduct").value;
  productNames.push(newData);
  getAll();
  document.getElementById("newProduct").value = "";
}

function remove(index) {
  let isConfirm = confirm("Are you ok");
  if (isConfirm) {
    productNames.splice(index, 1);
    getAll();
  }
}

function edit(index) {
  document.getElementById("editProduct").value = productNames[index];
  currentEditIndex = index;
}

function saveEdit() {
  if (currentEditIndex !== null) {
    let updatedName = document.getElementById("editProduct").value.trim();
    if (updatedName) {
      productNames[currentEditIndex] = updatedName;
      getAll();
      document.getElementById("editProduct").value = "";
      currentEditIndex = null;
    }
  }
}

// function edit(index){
//     let newData = prompt("Enter new name:" + productNames[index]);
//     let newData = document.getElementById("editProduct").value;
//     if(newData){
//         productNames[index] = newData;
//         getAll();
//         document.getElementById("editProduct").value = " ";
//     }
// }

function getAll() {
  let html = "";
  for (let i = 0; i < productNames.length; i++) {
    html += `   
        <tr>
          <td>${productNames[i]}</td>
          <td><button onclick = edit(${i})>Edit</button></td>
          <td><button onclick = remove(${i})>Delete</button></td>
        </tr>`;
  }
  document.getElementById("data").innerHTML = html;
}
getAll();

function search() {
  let keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  let html = "";

  for (let i = 0; i < productNames.length; i++) {
    if (productNames[i].toLowerCase().includes(keyword)) {
      html += `
        <tr>
          <td>${productNames[i]}</td>
          <td><button onclick="edit(${i})">Edit</button></td>
          <td><button onclick="remove(${i})">Delete</button></td>
        </tr>
      `;
    }
  }

  document.getElementById("data").innerHTML = html;
}


// Tạo 1 ô inout cho phép người dùng tìm kiếm theo tên.(Nên tạo 1 mảng mới chứa dữ liệu tìm kiếm)
// Tìm gần đúng.
// Nhập đến đâu đọc dữ liệu đến đó.

// edit không dùng prompt.
