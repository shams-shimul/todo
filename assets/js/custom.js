$(document).ready(function () {

  var count = 0;
  var totalCount = 0;

  // Adding Items on Pressing ENTER
  $(".todolist__task").on("keypress", function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == 13) {
      var item = $(this).val();
      if (item !== '') {
        count++;
        totalCount++;
        $("table#todolist tbody").append(`
          <tr>
            <td>
              <label for="item-${count}">
                <i class="far fa-circle"></i>
                <input type="checkbox" name="" id="item-${count}">
                <span>${item}</span>
              </label>
              <i class="fas fa-times-circle"></i>
            </td>
          </tr>
        `);
        $(this).val("");
        if ($("table#todolist tfoot").html() == undefined) {
          $("table#todolist").append(`
            <tfoot>
              <tr>
                <td>
                  <div>${count} items left</div>
                  <div class='status-filter'>
                    <div class="active" id="none">All</div>
                    <div id="pending">Active</div>
                    <div id="completed">Completed</div>
                  </div>
                  <div></div>
                </td>
              </tr>
            </tfoot>
          `);
        }
        else {
          $("table#todolist tfoot tr td > div:first-child").html(`${count} items left`);
        }
      }
      else {
        alert("Can't add empty items!")
      }
    }
  });
  $("body").on("click", function () {
    if($("table tbody tr").hasClass("completed")) {
      $("table tfoot td > div:last-child").html("<span>Clear completed</span>")
    }
    else {
      $("table tfoot td > div:last-child").html("")
    }
  })

  // Removing Added Items
  $("body").on("click", "i.fa-times-circle", function () {
    if (confirm("Are you sure?")) {
      $(this).parents("tr").remove();
      totalCount--;
      $("table#todolist tfoot tr td > div:first-child").html(`${--count} items left`);
    }
    if ($("table#todolist tbody tr").html() == undefined) {
      count = 0;
      totalCount = 0;
      $("table#todolist tfoot").remove();
    }
  })

  // Removing Completed Items
  $("body").on("click", "table tfoot td > div:last-child", function () {
    if (confirm("Are you really sure about this? This action cannot be undone!")) {
      $("table tbody tr.completed").remove();
      if ($("table#todolist tbody tr").html() == undefined) {
        count = 0;
        totalCount = 0;
        $("table#todolist tfoot").remove();
      }
      else {
        $(this).html("");
      }
    }
  })

  // Marking as DONE or NOT DONE
  $("body").on("click", "table#todolist tbody label i", function () {
    if ($(this).hasClass("far fa-circle")) {
      $(this).removeClass("far fa-circle ").addClass("fas fa-check-circle");
      $("table#todolist tfoot tr td > div:first-child").html(`${--count} items left`);
    }
    else if ($(this).hasClass("fas fa-check-circle")) {
      $(this).removeClass("fas fa-check-circle").addClass("far fa-circle");
      $("table#todolist tfoot tr td > div:first-child").html(`${++count} items left`);
    }

    $(this).nextAll("span").toggleClass("done");

    $(this).parents("tr").toggleClass("completed");

    
    if (($("table#todolist tfoot div.status-filter div:first-child").hasClass("active"))) {}
    else {
      let status = $(this).parents("tr").attr("class");
      if (status == "completed") {
        filter.filterPending();
      }
      else {
        filter.filterDone();
      }
    }
  })
  $("body").on("click", "table#todolist tbody label span", function () {
    $(this).toggleClass("done");
    if ($(this).siblings("i").hasClass("far fa-circle")) {
      $(this).siblings("i").removeClass("far fa-circle ").addClass("fas fa-check-circle");
      $("table#todolist tfoot tr td > div:first-child").html(`${--count} items left`);
    }
    else if ($(this).siblings("i").hasClass("fas fa-check-circle")) {
      $(this).siblings("i").removeClass("fas fa-check-circle ").addClass("far fa-circle");
      $("table#todolist tfoot tr td > div:first-child").html(`${++count} items left`);
    }

    $(this).parents("tr").toggleClass("completed");
    
    if (($("table#todolist tfoot div.status-filter div:first-child").hasClass("active"))) {}
    else {
      let status = $(this).parents("tr").attr("class");
      if (status == "completed") {
        filter.filterPending();
      }
      else {
        filter.filterDone();
      }
    }
  })

  // Editing Added Items
  $("body").on("dblclick", "table#todolist tbody label span", function () {
    var value = $(this).html();
    $(this).parent("label").append(`
      <input type='text' name='' class='edit-item' value='${value}' />
    `);
    $(this).remove();
    $("body").on("keypress", "table#todolist tbody label input.edit-item", function (event) {
      value = $(this).val();
      var keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == 13) {
        if ($(this).siblings("i").hasClass("fas fa-check-circle")) {
          $(this).parent("label").append(`
            <span class="done">${value}</span>
          `);
        }
        else {
          $(this).parent("label").append(`
            <span>${value}</span>
          `);
        }
        $(this).remove();
      }
    })
  })

  // Filtering Items
  $("body").on("click", "tfoot div.status-filter div", function () {
    let status = $(this).attr("id");
    if ($(this).siblings().hasClass("active")) {
      $(this).siblings().removeClass("active");
    }
    $(this).toggleClass("active");

    if (status == "completed") {
      filter.filterDone();
    }
    else if (status == "pending") {
      filter.filterPending();
    }
    else {
      filter.noFilter();
    }
  })

  // Styling
  $("body").on("keypress click",  function() {
    if(totalCount) {
      $("#todolist .todolist__main-input-row .fas").css(
        "transform", "rotate(90deg)"
      )
      $("table").addClass("changed");
    }
    else {
      $("#todolist .todolist__main-input-row .fas").css(
        "transform", "rotate(0deg)"
      );
      $("table").removeClass("changed");
    }
  })
  

  // OBJECTS
  var filter = {
    filterDone : function () {
      $("table#todolist tbody tr").not(".completed").hide();
      $("table#todolist tbody tr").filter(".completed").show();
      if ($("table#todolist tbody").children("tr.nothing")) {
        $("table#todolist tbody").children("tr.nothing").remove();
      }
      if ($("table#todolist tbody tr").not(".completed").length == totalCount) {
        $("table#todolist tbody").append(`
          <tr class="nothing">
            <td>Go go go! Lots of work to do!</td>
          </tr>
        `)
      }
    },
    filterPending : function () {
      $("table#todolist tbody tr").filter(".completed").hide();
      $("table#todolist tbody tr").not(".completed").show();
      if ($("table#todolist tbody").children("tr.nothing")) {
        $("table#todolist tbody").children("tr.nothing").remove();
      }
      if ($("table#todolist tbody tr").filter(".completed").length == totalCount) {
        $("table#todolist tbody").append(`
          <tr class="nothing">
            <td>Hurray! Nothing at hand now.</td>
          </tr>
        `)
      }
    },
    noFilter : function() {
      $("table#todolist tbody tr").not(".nothing").show();
      if ($("table#todolist tbody").children("tr.nothing")) {
        $("table#todolist tbody").children("tr.nothing").remove();
      }
    }
  }
  
})
