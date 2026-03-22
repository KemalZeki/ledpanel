<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'services',
    'columns'    => ['title','description','short_desc','icon','image','features','sort_order','is_active'],
    'searchable' => ['title','description'],
    'required'   => ['title'],
    'orderBy'    => 'sort_order ASC, id DESC',
]);
