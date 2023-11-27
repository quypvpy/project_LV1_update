$(document).ready(function () {
  login();
  logout();
  getData();
});
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
const api = "https://students.trungthanhweb.com/api/";
const imageURL = "https://students.trungthanhweb.com/images/";
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
  $("#logoutbtn").hide();
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    $("#loginBtn").hide();
    $("#logoutbtn").show();

    const params = new URLSearchParams(window.location.search);
    if (!params.has("id")) {
      window.location.replace("index.html");
    }
    var id = params.get("id");
    $.ajax({
      type: "get",
      url: api + "single",
      data: {
        // Name : Giá trị
        apitoken: localStorage.getItem("token"),
        id: id,
      },
      dataType: "JSON",
      success: function (res) {
        const brands = res.brands;
        const categrories = res.categrories;
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

        const gallery = res.gallery;
        var str = ``;
        gallery.forEach((el) => {
          str +=
            `<div class="item"><img class='pointer sliderimage' src="` +
            el +
            `" alt=""></div>`;
          $("#carousel").append(str);
          str = ``;
        });

        const products = res.products[0];
        var image = imageURL + products.images;
        $("#productImage").attr("src", image);
        // str = ``;
        const name = products.name;
        // giá = giá * (100-dícout) %
        const price = Intl.NumberFormat("en-US").format(
          (products.price * (100 - products.discount)) / 100
        );
        const discount = products.discount + "%";
        const brand = products.brandname;
        const cate = products.catename;

        $("#productname").text(name);
        $("#discount").text(discount);
        $("#price").text(price);
        $("#catename").text(cate);
        $("#brandname").text(brand);
        sliderImageChange();

        const content = products.content;
        $("#content").html(content);

        // lấy sp cùng loại
        const cateProducts = res.cateproducts;
        const brandproducts = res.brandproducts;

        var str = ``;
        cateProducts.forEach((el) => {
          str =
            `
          <div class="item">
          <div class="card" style="width: 100%">
            <img
              class="w-100"
              src="` +
            (imageURL + el.image) +
            `"
              alt=""
            />
            <div class="card-body">
              <h5 class="card-title">` +
            el.name +
            `e</h5>
              <p class="card-text">
                ` +
            Intl.NumberFormat("en-US").format(el.price) +
            `
              </p>
              <div class='btncustom'>
              <a href="detail.html?id=` +
            el.id +
            `" class="btn btn-primary">Chi Tiết</a>
              <a href="" class="btn btn-primary mt-3 addToCartBtn" data-id=` +
            el.id +
            `>Add to cart</a>
              </div>
              
            </div>
          </div>
        </div>
          `;

          $("#sameCateProduct").append(str);
        });

        brandproducts.forEach((el) => {
          str =
            `
          <div class="item">
          <div class="card" style="width: 100%">
            <img
              class="w-100"
              src="` +
            (imageURL + el.image) +
            `"
              alt=""
            />
            <div class="card-body">
              <h5 class="card-title">` +
            el.name +
            `e</h5>
              <p class="card-text">
                ` +
            Intl.NumberFormat("en-US").format(el.price) +
            `
              </p>
              <a href="detail.html?id=` +
            el.id +
            `" class="btn btn-primary">Chi Tiết</a>
            <a href="" class="btn btn-primary mt-3 addToCartBtn" data-id=` +
            el.id +
            `>Add to cart</a>
            </div>
            </div>
          </div>
        </div>
          `;

          $("#sameBrandProduct").append(str);
        });

        Owl();
        addToCart();
      },
    });
  }
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
    Toast.fire({
      icon: "success",
      title: "Đã thêm thành công",
    });
  });
}
function Owl() {
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    // nav: false,
    responsiveClass: true,
  });
}
function sliderImageChange() {
  $(".sliderimage").click(function (e) {
    e.preventDefault();
    var src = $(this).attr("src");
    $("#productImage").attr("src", src);
  });
}
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
