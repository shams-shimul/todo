<?php

require "../models/main.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new todo();
  $create = $item->update('items', ['title' => $_POST['title']], ['id' => $_POST['id']]);
  if ($create) {
    echo 1;
  }
  else {
    echo 0;
  }
}