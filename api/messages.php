<?php
require_once 'config.php';
handleCRUD([
    'table'      => 'contact_messages',
    'columns'    => ['name','email','phone','company','subject','event_type','message','is_read','is_starred','admin_notes'],
    'searchable' => ['name','email','company','message','phone'],
    'required'   => ['name','email','message'],
    'orderBy'    => 'id DESC',
]);
