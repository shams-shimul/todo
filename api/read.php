<?php

require "../models/main.php";
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $item = new todo();
  $allStatus = [];

  $read = $item->view('*', 'items');
  array_push($allStatus, $read->num_rows);

  $read1 = $item->view('*', 'items', ['status' => 0]);
  array_push($allStatus, $read1->num_rows);

  echo json_encode($allStatus);
}