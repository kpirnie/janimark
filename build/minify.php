<?php

/**
 * Asset Minifier
 *
 * Minifies the site CSS and JS into their .min counterparts
 *
 * @since 8.2
 * @author Kevin Pirnie <me@kpirnie.com>
 * @package JaniMark
 */

declare(strict_types=1);

use MatthiasMullie\Minify\CSS;
use MatthiasMullie\Minify\JS;

// only ever run this from the command line
if (PHP_SAPI !== 'cli') {
    exit(1);
}

// the project root
$root = dirname(__DIR__);

require $root . '/vendor/autoload.php';

// the minifier, source, and destination for each asset
$assets = [
    [CSS::class, 'assets/css/style.css', 'assets/css/style.min.css'],
    [JS::class, 'assets/js/main.js', 'assets/js/main.min.js'],
];

foreach ($assets as [$class, $source, $dest]) {
    // minify it and write it out
    $minifier = new $class($root . '/' . $source);
    $minified = $minifier->minify($root . '/' . $dest);

    echo sprintf("%s: %d bytes\n", $dest, strlen($minified));
}
