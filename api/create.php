<?php

require "../models/main.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new todo();
  $create = $item->insert('items', ['title' => $_POST['title']]);
  echo $item->ID;
}