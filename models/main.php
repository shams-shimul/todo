<?php

class todo {

  /**
   * Property variables
   */
  private $db;
  public $ID;


  /**
   * Constructor
   */
  public function __construct() {
    $this->db = new mysqli('localhost', 'root', '', 'todo');
  }


  /**
   * Method - Read of CRUD
   *
   * @param string $tablename
   * @param string $select
   * @param array $where
   * @param array $order
   * @return object
   */
  public function view($select, $tablename, $where="", $order="") {
    $sql = "SELECT {$select} FROM {$tablename}";
    $sortOrder = "";
    if ($order) {
      $sortOrder = " ORDER BY {$order[0]} {$order[1]}";
    }
    $whereSql = "";
    if ($where) {
      foreach ($where as $key => $value) {
        if ($whereSql == "") {
          $whereSql .= " WHERE ";
        }
        else {
          $whereSql .= " AND ";
        }
        $whereSql .= $key . " = '" . $value . "'";
      }
    }
    $sql .= $whereSql . $sortOrder;
    // die($sql);
    $output = $this->db->query($sql);
    return $output;
  }


  /**
   * Method - Create of CRUD
   *
   * @param string $tablename
   * @param array $values
   * @return object
   */
  public function insert($tablename, $values) {
    $colSql = "";
    $valSql = "";
    foreach ($values as $key => $value) {
      if ($colSql == "" && $valSql == "") {
        $colSql .= $key;
        $valSql .= "'" . $value . "'";
      }
      else {
        $colSql .= ", " . $key;
        $valSql .= ", '" . $value . "'";
      }
    }
    $sql = "INSERT INTO {$tablename} (" . $colSql . ") VALUES (" . $valSql . ")";
    // die($sql);
    if ($this->db->query($sql)) {
      $this->ID = $this->db->insert_id;
      return true;
    }
    else {
      // echo $this->db->error;
      return false;
    }
  }


  /**
   * Method - Update of CRUD
   *
   * @param string $tablename
   * @param array $data
   * @param array $where
   * @return object
   */
  public function update($tablename, $data, $where) {
    $dataSql = "";
    foreach ($data as $column => $val) {
      if ($dataSql != "") {
        $dataSql .= ", ";
      }
      $dataSql .= $column . " = '". $val ."'";
    }
    $whereSql = "";
    foreach ($where as $column => $val) {
      if ($whereSql == "") {
        $whereSql .= " WHERE ";
      }
      else {
        $whereSql .= " AND ";
      }
      $whereSql .= $column . " = '" . $val . "'";
    }
    $sql = "UPDATE {$tablename} SET {$dataSql} {$whereSql}";
    // die($sql);
    $this->db->query($sql);
    if ($this->db->affected_rows > 0) {
      return true;
    }
    else {
      // echo $this->db->error;
      return false;
    }
  }


  /**
   * Method - Delete of CRUD
   *
   * @param string $tablename
   * @param array $where
   * @return object
   */
  public function delete ($tablename, $where) {
    $whereSql = "";
    foreach($where as $col => $val) {
      if ($whereSql == "") {
        $whereSql .= " WHERE ";
      }
      else {
        $whereSql .= " AND ";
      }
      $whereSql .= $col . " = '" . $val . "'";
    }
    $sql = "DELETE FROM {$tablename} {$whereSql}";
    // die($sql);
    $this->db->query($sql);
    if ($this->db->affected_rows > 0) {
      return true;
    }
    else {
      // $this->db->error;
      return false;
    }
  }
}