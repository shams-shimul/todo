<?php

require_once "../vendor/autoload.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new AppTodo\Todo();
  $create = $item->update('items', ['title' => $_POST['title']], ['id' => $_POST['id']]);
  if ($create) {
    echo 1;
  }
  else {
    echo 0;
  }
}