 const danhSachSTK = [];

    function validateSTK(maSo, loaiTietKiem, hoTen, cmnd, ngayMoSo, soTienGui) {
      if (maSo.length > 5) return "Mã sổ tối đa 5 ký tự";
      if (loaiTietKiem.length > 10) return "Loại tiết kiệm tối đa 10 ký tự";
      if (hoTen.length > 30) return "Họ tên tối đa 30 ký tự";
      if (isNaN(cmnd)) return "CMND phải là số";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ngayMoSo)) return "Ngày mở sổ phải đúng định dạng YYYY-MM-DD";
      if (isNaN(soTienGui) || soTienGui <= 0) return "Số tiền gửi phải là số dương";
      return null;
    }

function themSoTietKiem() {
      const maSo = document.getElementById("maSo").value.trim();
      const loaiTietKiem = document.getElementById("loaiTietKiem").value.trim();
      const hoTen = document.getElementById("hoTen").value.trim();
      const cmnd = document.getElementById("cmnd").value.trim();
      const ngayMoSo = document.getElementById("ngayMoSo").value.trim();
      const soTienGui = parseFloat(document.getElementById("soTienGui").value);

      if (danhSachSTK.find(stk => stk.maSo === maSo)) {
        alert("Mã sổ đã tồn tại!");
        return;
      }

      const error = validateSTK(maSo, loaiTietKiem, hoTen, cmnd, ngayMoSo, soTienGui);
      if (error) {
        alert("Lỗi: " + error);
        return;
      }

      const stk = new SoTietKiem(maSo, loaiTietKiem, hoTen, cmnd, ngayMoSo, soTienGui);
      danhSachSTK.push(stk);
      alert("Thêm thành công!");
      hienThiDanhSach();
      xoaForm();
    }

    function xoaSoTietKiem() {
      const maSo = prompt("Nhập mã sổ muốn xóa:");
      const index = danhSachSTK.findIndex(stk => stk.maSo === maSo);
      if (index === -1) {
        alert("Không tìm thấy mã sổ!");
        return;
      }

      const xacNhan = confirm("Bạn có chắc muốn xóa sổ này?");
      if (xacNhan) {
        danhSachSTK.splice(index, 1);
        alert("Đã xóa!");
        hienThiDanhSach();
      }
    }

    function hienThiDanhSach() {
      const tbody = document.querySelector("#bangSTK tbody");
      tbody.innerHTML = "";

      danhSachSTK.forEach(stk => {
        const row = `<tr>
          <td>${stk.maSo}</td>
          <td>${stk.loaiTietKiem}</td>
          <td>${stk.hoTen}</td>
          <td>${stk.cmnd}</td>
          <td>${stk.ngayMoSo}</td>
          <td>${stk.soTienGui}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    function xoaForm() {
      document.getElementById("maSo").value = "";
      document.getElementById("loaiTietKiem").value = "";
      document.getElementById("hoTen").value = "";
      document.getElementById("cmnd").value = "";
      document.getElementById("ngayMoSo").value = "";
      document.getElementById("soTienGui").value = "";
    }