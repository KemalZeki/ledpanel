<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'gallery',
    'columns'    => ['title','category','image','size','sort_order','is_active'],
    'searchable' => ['title','category'],
    'required'   => ['title','image'],
    'orderBy'    => 'sort_order ASC, id DESC',
]);
