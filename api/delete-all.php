<?php

require_once "../vendor/autoload.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new AppTodo\Todo();
  $del = $item->delete('items', 'id', $_POST['ids']);
  if ($del) {
    echo 1;
  }
  else {
    echo 0;
  }
}