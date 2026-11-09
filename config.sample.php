<?php

/**
 * Site Configuration (sample)
 *
 * Copy to config.php and fill in the real values. config.php is git-ignored.
 *
 * @since 8.2
 * @author Kevin Pirnie <me@kpirnie.com>
 * @package JaniMark
 */

declare(strict_types=1);

return [

    // smtp connection, encryption is either 'tls' (STARTTLS) or 'ssl' (SMTPS)
    'smtp' => [
        'host' => 'smtp.example.com',
        'port' => 587,
        'encryption' => 'tls',
        'username' => 'user@example.com',
        'password' => 'change-me',
    ],

    // who the message is sent from and who receives it
    'mail' => [
        'from_email' => 'info@janimarklls.com',
        'from_name' => 'JaniMark, LLC Website',
        'to_email' => 'info@janimarkllc.com',
        'to_name' => 'JaniMark, LLC',
    ],

    // form protection, the secret signs the time token (use a long random string)
    'form' => [
        'token_secret' => 'change-me-to-a-long-random-string',
        'min_seconds' => 3,
        'max_seconds' => 3600,
    ],

];