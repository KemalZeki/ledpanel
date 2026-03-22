<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'clients',
    'columns'    => ['name','category','logo','website','sort_order','is_active'],
    'searchable' => ['name','category'],
    'required'   => ['name'],
    'orderBy'    => 'sort_order ASC, id DESC',
]);
