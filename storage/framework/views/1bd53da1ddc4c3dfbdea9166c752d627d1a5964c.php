<!DOCTYPE html>
    <html lang="<?php echo e(app()->getLocale()); ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- CSRF Token -->
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
        <title>Fligno Sample Web App</title>
        <!-- Styles -->
        <link href="<?php echo e(asset('css/app.css')); ?>" rel="stylesheet">
        <link href="<?php echo e(asset('css/custom.css')); ?>" rel="stylesheet">
        <link href="<?php echo e(asset('css/materialize.min.css')); ?>" rel="stylesheet">
        <script src="<?php echo e(asset('js/materialize.min.js')); ?>"></script>
    </head>
    <body>
        <div id="app"></div>
        <script src="<?php echo e(asset('js/app.js')); ?>"></script>
    </body>
    </html><?php /**PATH /home/ifreitz/Documents/Laravel/fligno_sample_app/resources/views/app.blade.php ENDPATH**/ ?>