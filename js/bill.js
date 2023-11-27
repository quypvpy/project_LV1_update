$(document).ready(function () {
  login();
  logout();
  loadData();
});
const url = "https://students.trungthanhweb.com/api/";
const image = "https://students.trungthanhweb.com/images/";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1700,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
var link = url + "home"; //string
function loadData() {
  $("#logoutbtn").hide();
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    $("#loginBtn").hide();
    $("#logoutbtn").show();

    $.ajax({
      type: "GET",
      url: link,
      data: {
        apitoken: localStorage.getItem("token"),
      },
      dataType: "JSON",
      success: function (res) {
        const brands = res.brands;
        const categrories = res.categrories;
        const products = res.products.data;
        if (brands.length > 0) {
          var str = ``;
          brands.forEach((el) => {
            str +=
              `
                                <li><a class="dropdown-item" href="brands.html?id=` +
              el.id +
              `">` +
              el.name +
              `</a></li>
                                `;
          });
          $("#brandUl").html(str);
        }

        if (categrories.length > 0) {
          var str = ``;
          categrories.forEach((el) => {
            str +=
              `
                                <li><a class="dropdown-item" href="categories.html?id=` +
              el.id +
              `">` +
              el.name +
              `</a></li>
                                `;
          });
          $("#cateUl").html(str);
        }
      },
    });

    $.ajax({
      type: "GET",
      url: url + "bills",
      data: {
        apitoken: localStorage.getItem("token"),
      },
      dataType: "JSON",
      success: function (res) {
        if (res.check == true && res.bills.length > 0) {
          var str = ``;
          const bills = res.bills;
          bills.forEach((el) => {
            str +=
              `
                <li class="list-group-item billdetailselect pointer" data-id=` +
              el.id +
              `>` +
              el.tenKH +
              ` <br> ` +
              el.created_at +
              `</li>
                `;
          });
          $("#resultbill").html(str);
          $("#resultbill").removeClass("hideclass");
          billdetail();
        }
      },
    });

    function billdetail() {
      $(".billdetailselect").click(function (e) {
        e.preventDefault();
        $(".list-group-item").removeClass("active");
        $(this).addClass("active");
        var id = $(this).attr("data-id");

        $.ajax({
          type: "get",
          url: url + "singlebill",
          data: {
            // Name : Giá trị
            apitoken: localStorage.getItem("token"),
            id: id,
          },
          dataType: "JSON",
          success: function (res) {
            const bill = res.result;
            if (bill.length > 0) {
              var str = ``;
              var sum = 0;
              bill.forEach((el, index) => {
                str +=
                  `
                <tr class="">
                  <td scope="'row">` +
                  ++index +
                  `</td>
                  <td class='text-center'><img style='height:140px;width:auto' src="` +
                  image +
                  el.image +
                  `" alt=""></td>
                  <td>` +
                  el.productname +
                  `</td>
                  <td>` +
                  Intl.NumberFormat("en-US").format(el.price) +
                  `</td>
                  <td>` +
                  el.qty +
                  `</td>
                  <td>` +
                  Intl.NumberFormat("en-US").format(
                    Number(el.price) * Number(el.qty)
                  ) +
                  `</td>
                  
                 
                </tr>
                `;
                sum += Number(el.price) * Number(el.qty);
              });
              str +=
                `
                <tr class='table-dark'>
                <td colspan='5' scope='row'>Tổng Tiền</td> 
                <td scope='row'>` +
                Intl.NumberFormat("en-US").format(sum) +
                `</td> 
                </tr>
                `;
              $("#resultbilldetail").html(str);
              $("#billdetailtable").removeClass("hideclass");
            }
          },
        });
      });
    }
  }
}
function logout() {
  $("#logoutbtn").click(function (e) {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      Toast.fire({
        icon: "success",
        title: "Bye bye !",
      }).then(() => {
        window.location.reload();
      });
    }
  });
}
//   ===============================
function login() {
  $("#loginBtn").click(function (e) {
    e.preventDefault();
    $("#LoginModal").modal("show");
    $("#submitloginBtn").click(function (e) {
      e.preventDefault();
      var email = $("#email").val().trim();
      if (email == "") {
        Toast.fire({
          icon: "error",
          title: "Thiếu  email",
        });
      } else {
        $.ajax({
          type: "post",
          url: "https://students.trungthanhweb.com/api/checkLoginhtml",
          data: {
            // Name : Giá trị
            email: email,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              console.log(res.apitoken);
              localStorage.setItem("token", res.apitoken);
              Toast.fire({
                icon: "success",
                title: "Đăng nhập thành công",
              }).then(() => {
                window.location.reload();
              });
            } else {
              if (res.msg.email) {
                Toast.fire({
                  icon: "error",
                  title: res.msg.email,
                });
              }
            }
          },
        });
      }
    });
  });
}
