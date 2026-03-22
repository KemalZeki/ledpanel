<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'products',
    'columns'    => ['name','category','pixel_pitch','brightness','resolution','panel_size','weight','refresh_rate','best_for','description','image','is_popular','is_active','sort_order'],
    'searchable' => ['name','best_for','description'],
    'required'   => ['name','category'],
    'orderBy'    => 'sort_order ASC, id DESC',
]);
