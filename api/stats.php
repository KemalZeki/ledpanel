<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'stats',
    'columns'    => ['label','value','icon','sort_order','is_active'],
    'searchable' => ['label'],
    'required'   => ['label','value'],
    'orderBy'    => 'sort_order ASC',
]);
