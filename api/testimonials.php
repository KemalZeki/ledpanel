<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'testimonials',
    'columns'    => ['name','role','company','text','rating','project','avatar','is_active','sort_order'],
    'searchable' => ['name','company','text','project'],
    'required'   => ['name','text'],
    'orderBy'    => 'sort_order ASC, id DESC',
]);
