<?php

require "../models/main.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new todo();
  $del = $item->delete('items', 'id', $_POST['ids']);
  if ($del) {
    echo 1;
  }
  else {
    echo 0;
  }
}