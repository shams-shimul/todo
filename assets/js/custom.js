/**
 * Contents
 * ========================
 * 1. Adding Items on Pressing ENTER
 * 2. Removing Added Items
 * 3. Removing Completed Items
 * 4. Marking as DONE or NOT DONE
 * 5. Editing Added Items
 * 6. Filtering Items
 * 7. Styling
 * 8. OBJECTS
 */

jQuery(document).ready(function () {

  var count = 0;
  var totalCount = 0;

  // Adding Items on Pressing ENTER
  jQuery(".todolist__task").on("keypress", function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == 13) {
      var item = jQuery(this).val();
      if (item !== '') {
        count++;
        totalCount++;

        jQuery.ajax({
          type: 'post',
          url: jQuery("meta[name='url']").attr("content") + 'api/create.php',
          data: {
            'title': item
          },
          success: function(response) {
            jQuery("table#todolist tbody").append(`
              <tr>
                <td>
                  <label for="item-jQuery{response}">
                    <i class="far fa-circle"></i>
                    <input type="checkbox" name="" id="item-jQuery{response}" value="jQuery{response}">
                    <span>jQuery{item}</span>
                  </label>
                  <i class="fas fa-times-circle tooltip"><span class="tooltiptext">Delete this item?<span></i>
                </td>
              </tr>
            `);
          }
        });
        jQuery(this).val("");
        if (jQuery("table#todolist tfoot").html() == undefined) {
          jQuery("table#todolist").append(`
            <tfoot>
              <tr>
                <td>
                  <div>jQuery{count} items left</div>
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
          jQuery("table#todolist tfoot tr td > div:first-child").html(`jQuery{count} items left`);
        }

        if (jQuery("table#todolist tfoot div.status-filter div:nth-child(1)").hasClass("active")) {
          filter.noFilter();
        }
        else if ((jQuery("table#todolist tfoot div.status-filter div:nth-child(2)").hasClass("active"))) {
          filter.filterPending();
        }
        else {
          filter.filterDone();
        }
      }
      else {
        alert("Can't add empty items!")
      }
    }
  });

  // Removing Added Items
  jQuery("body").on("click", "i.fa-times-circle", function () {
    if (confirm("Are you sure?")) {
      let id = jQuery(this).siblings("label").children("input").val();
      jQuery(this).parents("tr").remove();
      jQuery.ajax({
        type: "post",
        url: jQuery("meta[name='url']").attr("content") + 'api/delete.php',
        data: {
          'id' : id
        },
        success: function (response) {
          if (response) {
            alert("Deleted successfully");
          }
          else {
            alert("Aw snap! Something went wrong, try again.");
          }
        }
      });


      totalCount--;
      jQuery("table#todolist tfoot tr td > div:first-child").html(`jQuery{--count} items left`);
    }
    if (jQuery("table#todolist tbody tr").html() == undefined) {
      count = 0;
      totalCount = 0;
      jQuery("table#todolist tfoot").remove();
    }
  })

  // Removing Completed Items
  jQuery("body").on("click", "table tfoot td > div:last-child", function () {
    let deleteIds = [];
    jQuery("table tbody tr.completed input[type='checkbox']").each(function() {
      deleteIds.push(jQuery(this).val());
    });
    console.log(deleteIds);
    if (confirm("Are you really sure about this? This action cannot be undone!")) {
      jQuery.ajax({
        type: "post",
        url: jQuery("meta[name='url']").attr("content") + "api/delete-all.php",
        data: {
          'ids': deleteIds
        },
        success: function (response) {
          response ? alert("All Completed tasks DELETED!") : "Something went wrong! Try again.";
        }
      });


      jQuery("table tbody tr.completed").remove();
      if (jQuery("table#todolist tbody tr").html() == undefined) {
        count = 0;
        totalCount = 0;
        jQuery("table#todolist tfoot").remove();
      }
      else {
        jQuery(this).html("");
      }
    }
  })

  // Marking as DONE or NOT DONE
  jQuery("body").on("click", "table#todolist tbody label i", function () {
    let elem = jQuery(this);
    let id = jQuery(this).siblings("input").val();
    if (jQuery(this).hasClass("far fa-circle")) {
      jQuery.ajax({
        type: "post",
        url: jQuery("meta[name=url]").attr("content") + 'api/update-status.php',
        data: {
          'id' : id,
          'status' : 1
        },
        success: function (response) {
          if (response) {
            jQuery(elem).removeClass("far fa-circle ").addClass("fas fa-check-circle");
            jQuery("table#todolist tfoot tr td > div:first-child").html(`${--count} items left`);
          }
        }
      });
    }
    else if (jQuery(this).hasClass("fas fa-check-circle")) {
      jQuery.ajax({
        type: "post",
        url: jQuery("meta[name=url]").attr("content") + 'api/update-status.php',
        data: {
          'id' : id,
          'status' : 0
        },
        success: function (response) {
          if (response) {
            jQuery(elem).removeClass("fas fa-check-circle").addClass("far fa-circle");
            jQuery("table#todolist tfoot tr td > div:first-child").html(`jQuery{++count} items left`);
          }
        }
      });
    }

    jQuery(this).nextAll("span").toggleClass("done");

    jQuery(this).parents("tr").toggleClass("completed");

    
    if ((jQuery("table#todolist tfoot div.status-filter div:first-child").hasClass("active"))) {}
    else {
      let status = jQuery(this).parents("tr").attr("class");
      if (status == "completed") {
        filter.filterPending();
      }
      else {
        filter.filterDone();
      }
    }
  })
  jQuery("body").on("click", "table#todolist tbody label span", function () {
    jQuery(this).toggleClass("done");
    if (jQuery(this).siblings("i").hasClass("far fa-circle")) {
      jQuery(this).siblings("i").removeClass("far fa-circle ").addClass("fas fa-check-circle");
      jQuery("table#todolist tfoot tr td > div:first-child").html(`${--count} items left`);
    }
    else if (jQuery(this).siblings("i").hasClass("fas fa-check-circle")) {
      jQuery(this).siblings("i").removeClass("fas fa-check-circle ").addClass("far fa-circle");
      jQuery("table#todolist tfoot tr td > div:first-child").html(`jQuery{++count} items left`);
    }

    jQuery(this).parents("tr").toggleClass("completed");
    
    if ((jQuery("table#todolist tfoot div.status-filter div:first-child").hasClass("active"))) {}
    else {
      let status = jQuery(this).parents("tr").attr("class");
      if (status == "completed") {
        filter.filterPending();
      }
      else {
        filter.filterDone();
      }
    }
  })

  // Editing Added Items
  jQuery("body").on("dblclick", "table#todolist tbody label span", function () {
    var value = jQuery(this).html();
    jQuery(this).parent("label").append(`
      <input type='text' name='' class='edit-item' value='jQuery{value}' />
    `);
    jQuery(this).remove();
  });
  jQuery("body").on("keypress", "table#todolist tbody label input.edit-item", function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == 13) {
      value = jQuery(this).val();
      if (value != '') {
        var id = jQuery(this).siblings("input").val();
        if (jQuery(this).siblings("i").hasClass("fas fa-check-circle")) {
          jQuery(this).parent("label").append(`
            <span class="done">jQuery{value}</span>
          `);
        }
        else {
          jQuery(this).parent("label").append(`
            <span>jQuery{value}</span>
          `);
        }
        jQuery(this).remove();

        jQuery.ajax({
          type: 'post',
          url: jQuery("meta[name='url']").attr("content") + 'api/update.php',
          data: {
            'id': id,
            'title': value
          },
          success: function(response) {
            if (response) {
              alert("Successfully updated.");
            }
            else {
              alert("Couldn't update, something went wrong. Try again.")
            }
          }
        });
      }
      else {
        alert("Sorry! Can't save empty value.");
      }
    }
  });

  // Filtering Items
  jQuery("body").on("click", "tfoot div.status-filter div", function () {
    let status = jQuery(this).attr("id");
    if (jQuery(this).siblings().hasClass("active")) {
      jQuery(this).siblings().removeClass("active");
    }
    jQuery(this).toggleClass("active");

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
  jQuery("body").on("keypress click",  function() {
    if(totalCount) {
      jQuery("#todolist .todolist__main-input-row .fas").css(
        "transform", "rotate(90deg)"
      )
    }
    else {
      jQuery("#todolist .todolist__main-input-row .fas").css(
        "transform", "rotate(0deg)"
      );
    }
  })

  jQuery("body").on("click", function () {
    if(jQuery("table tbody tr").hasClass("completed")) {
      jQuery("table tfoot td > div:last-child").html("<span><i class='far fa-trash-alt'></i> Clear completed</span>")
    }
    else {
      jQuery("table tfoot td > div:last-child").html("")
    }
  })
  

  // OBJECTS
  var filter = {
    filterDone : function () {
      jQuery("table#todolist tbody tr").not(".completed").hide();
      jQuery("table#todolist tbody tr").filter(".completed").show();
      if (jQuery("table#todolist tbody").children("tr.nothing")) {
        jQuery("table#todolist tbody").children("tr.nothing").remove();
      }
      if (jQuery("table#todolist tbody tr").not(".completed").length == totalCount) {
        jQuery("table#todolist tbody").append(`
          <tr class="nothing">
            <td>Go go go! Lots of work to do!</td>
          </tr>
        `)
      }
    },

    filterPending : function () {
      jQuery("table#todolist tbody tr").filter(".completed").hide();
      jQuery("table#todolist tbody tr").not(".completed").show();
      if (jQuery("table#todolist tbody").children("tr.nothing")) {
        jQuery("table#todolist tbody").children("tr.nothing").remove();
      }
      if (jQuery("table#todolist tbody tr").filter(".completed").length == totalCount) {
        jQuery("table#todolist tbody").append(`
          <tr class="nothing">
            <td>Hurray! Nothing at hand now.</td>
          </tr>
        `)
      }
    },

    noFilter : function() {
      jQuery("table#todolist tbody tr").not(".nothing").show();
      if (jQuery("table#todolist tbody").children("tr.nothing")) {
        jQuery("table#todolist tbody").children("tr.nothing").remove();
      }
    }
  }
  
})
