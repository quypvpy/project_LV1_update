$(document).ready(function () {
  logout();
  checkLogin();
  getData();
});

const api = "https://students.trungthanhweb.com/api/";
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
function getData() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("id")) {
    window.location.replace("index.html");
  }
  var id = params.get("id");
  var page = 1;
  if (params.has("page")) {
    page = params.get("page");
  }
  $.ajax({
    type: "GET",
    url: api + "getCateProducts",
    data: {
      apitoken: localStorage.getItem("token"),
      id: id,
      page: page,
    },
    dataTpye: "JSON",
    success: function (res) {
      if (res.check == true) {
        // console.log("test ré", res);
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

        if (products.length > 0) {
          var str = ``;
          products.forEach((el) => {
            str +=
              `
                <div class="col-md-4">
                        <div class="card w-100 pt-3">
                        <img style="width:300px;height:auto;margin:0px auto " src="` +
              image +
              el.image +
              `" class="card-img-top" alt="...">
                        <div class="card-body ps-3">
                          <h5 class="card-title">` +
              el.name +
              `</h5>
                          <p class="card-text">Giá : ` +
              Intl.NumberFormat("en-US").format(el.price) +
              `</p>
                          <a href="detail.html?id=` +
              el.id +
              `" class="btn btn-primary">Xem Thêm</a>
                          <a href="#" class="btn btn-success addToCartBtn"  data-id='` +
              el.id +
              `'>Mua Ngaaay</a>
                        </div>
                      </div>
                </div>
                        `;
          });
          $("#resultProduct").html(str);
          addToCart();

          var pages = res.products.last_page;
          var str = ``;
          var i = 1;
          while (i <= pages) {
            if (i == res.products.current_page) {
              str +=
                `<li class="page-item active"><a class="page-link" href="categories.html?id=` +
                id +
                `&page=` +
                i +
                `">` +
                i +
                `</a></li>`;
            } else {
              str +=
                `<li class="page-item "><a class="page-link" href="categories.html?id=` +
                id +
                `&page=` +
                i +
                `">` +
                i +
                `</a></li>`;
            }
            i++;
          }

          $("#pagination").html(str);
          $("#searchPricebtn").click(function (e) {
            e.preventDefault();
            searchPrice(id);
            $("#pagination").hide();
          });
        }
      }
    },
  });
}
function addToCart() {
  if (!localStorage.getItem("cart") || localStorage.getItem("cart") == null) {
    var arr = [];
  } else {
    var cart = localStorage.getItem("cart");
    var arr = JSON.parse(cart);
  }

  $(".addToCartBtn").click(function (e) {
    e.preventDefault();
    var id = Number($(this).attr("data-id"));
    var qty = 1;
    var item = [id, qty];
    var check = 0;
    arr.forEach((el) => {
      if (el[0] == id) {
        el[1]++;
        check = 1;
      }
    });
    if (check == 0) {
      arr.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(arr));
    alert("Đã thêm thành công!!!");
    // Toast.fire({
    //   icon: "success",
    //   title: "Đã thêm thành công",
    // });
  });
}
function checkLogin() {
  if (!localStorage.getItem("token") || localStorage.getItem("token") == null) {
    window.location.replace("index.html");
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
function searchPrice(id) {
  var lowprice = $("#giathap").val();
  var maxprice = $("#giacao").val();
  var option = "";
  if (lowprice == "" && maxprice != "") {
    option = "maxprice";
  } else if (lowprice != "" && maxprice == "") {
    option = "minprice";
  } else if (lowprice != "" && maxprice != "") {
    option = "pricebetween";
  }
  switch (option) {
    case "maxprice":
      $.ajax({
        type: "GET",
        url: api + "searchCatePrice",
        data: {
          apitoken: localStorage.getItem("token"),
          price2: maxprice,
          id: id,
        },
        dataTpye: "JSON",
        success: function (res) {
          if (res.check == true && res.products.length > 0) {
            var str = ``;
            res.products.forEach((el) => {
              str +=
                `
                  <div class="col-md-4">
                          <div class="card w-100 pt-3">
                          <img style="width:300px;height:auto;margin:0px auto " src="` +
                image +
                el.image +
                `" class="card-img-top" alt="...">
                          <div class="card-body ps-3">
                            <h5 class="card-title">` +
                el.name +
                `</h5>
                            <p class="card-text">Giá : ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</p>
                            <a href="#" class="btn btn-primary">Xem Thêm</a>
                            <a href="#" class="btn btn-success">Mua Ngay</a>
                          </div>
                        </div>
                  </div>
                          `;
            });
            $("#resultProduct").html(str);
          }
        },
      });
      break;
    case "minprice":
      $.ajax({
        type: "GET",
        url: api + "searchCatePrice",
        data: {
          apitoken: localStorage.getItem("token"),
          price1: lowprice,
          id: id,
        },
        dataTpye: "JSON",
        success: function (res) {
          if (res.check == true && res.products.length > 0) {
            var str = ``;
            res.products.forEach((el) => {
              str +=
                `
                  <div class="col-md-4">
                          <div class="card w-100 pt-3">
                          <img style="width:300px;height:auto;margin:0px auto " src="` +
                image +
                el.image +
                `" class="card-img-top" alt="...">
                          <div class="card-body ps-3">
                            <h5 class="card-title">` +
                el.name +
                `</h5>
                            <p class="card-text">Giá : ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</p>
                            <a href="#" class="btn btn-primary">Xem Thêm</a>
                            <a href="#" class="btn btn-success">Mua Ngay</a>
                          </div>
                        </div>
                  </div>
                          `;
            });
            $("#resultProduct").html(str);
          }
        },
      });
      break;
    case "pricebetween":
      $.ajax({
        type: "GET",
        url: api + "searchCatePrice",
        data: {
          apitoken: localStorage.getItem("token"),
          price1: lowprice,
          price2: maxprice,
          id: id,
        },
        dataTpye: "JSON",
        success: function (res) {
          if (res.check == true) {
            var str = ``;
            res.products.forEach((el) => {
              str +=
                `
                  <div class="col-md-4">
                          <div class="card w-100 pt-3">
                          <img style="width:300px;height:auto;margin:0px auto " src="` +
                image +
                el.image +
                `" class="card-img-top" alt="...">
                          <div class="card-body ps-3">
                            <h5 class="card-title">` +
                el.name +
                `</h5>
                            <p class="card-text">Giá : ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</p>
                            <a href="#" class="btn btn-primary">Xem Thêm</a>
                            <a href="#" class="btn btn-success">Mua Ngay</a>
                          </div>
                        </div>
                  </div>
                          `;
            });
            $("#resultProduct").html(str);
          }
        },
      });
      break;

    default:
      break;
  }
}
