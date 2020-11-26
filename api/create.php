<?php

require_once "../vendor/autoload.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new AppTodo\Todo();
  $create = $item->insert('items', ['title' => $_POST['title']]);
  echo $item->ID;
}