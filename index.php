<?php
  require "./models/main.php";
  $obj = new todo();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="url" content="<?php echo 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']; ?>">
  <!-- FontAwesome stylesheet -->
  <link rel="stylesheet" type="text/css" href="assets/css/fa-all.min.css">
  <!-- Main Stylesheet of the app -->
  <link rel="stylesheet" href="assets/css/style.css">
  <!-- App Title -->
  <title>ToDo - weDevs</title>
  
</head>

<body>
  <h1>todos</h1>
    <div class="container">
      <table id="todolist">
        <thead>
          <tr colspan="4" class="todolist__main-input-row">
            <th>
            <i class="fas fa-chevron-right"></i>
              <input type="text" name="task-input" id="" class="todolist__task" placeholder="What needs to be done?">
            </th>
          </tr>
        </thead>
        <tbody>
          <?php
          $anyTodo = $obj->view('*', 'items');
          if ($anyTodo->num_rows > 0) {
            while ($row = $anyTodo->fetch_object()) {
              echo "
                <tr>
                  <td>
                    <label for='item-{$row->id}'>
                      <i class='far fa-circle'></i>
                      <input type='checkbox' name='' id='item-{$row->id}' value='{$row->id}'>
                      <span>{$row->title}</span>
                    </label>
                    <i class='fas fa-times-circle tooltip'><span class='tooltiptext'>Delete this item?<span></i>
                  </td>
                </tr>
              ";
            }
            echo "
            <tfoot class='changed'>
              <tr>
                <td>
                  <div>{$anyTodo->num_rows} items left</div>
                  <div class='status-filter'>
                    <div class='active' id='none'>All</div>
                    <div id='pending'>Active</div>
                    <div id='completed'>Completed</div>
                  </div>
                  <div></div>
                </td>
              </tr>
            </tfoot>
            ";
          }
          ?>
        </tbody>
      </table>
  </div>

  <!-- Scripts -->
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="assets/js/custom.js"></script>
</body>

</html>