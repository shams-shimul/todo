<?php

require_once "../vendor/autoload.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new AppTodo\Todo();
  $statusUpdate = $item->update('items', ['status' => $_POST['status']], ['id' => $_POST['id']]);
  if ($statusUpdate) {
    echo 1;
  }
  else {
    echo 0;
  }
}