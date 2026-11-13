<?php

/**
 * Contact Form Handler
 *
 * Validates the quote request and emails it through SMTP using PHPMailer
 *
 * @since 8.2
 * @author Kevin Pirnie <me@kpirnie.com>
 * @package JaniMark
 */

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

/**
 * respond
 *
 * Sends a JSON response and stops
 *
 * @since 8.2
 * @param int $status HTTP status code
 * @param bool $success Whether the request succeeded
 * @param string $message Message for the visitor
 * @param array $extra Additional values to include in the response
 * @return never
 */
function respond(int $status, bool $success, string $message, array $extra = []): never
{
    // send it back as json, never cached
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');

    echo json_encode(
        array_merge(['success' => $success, 'message' => $message], $extra),
        JSON_THROW_ON_ERROR
    );

    exit;
}

/**
 * sign_token
 *
 * Creates a signed timestamp token
 *
 * @since 8.2
 * @param int $time Unix timestamp
 * @param string $secret Signing secret
 * @return string
 */
function sign_token(int $time, string $secret): string
{
    return sprintf('%d.%s', $time, hash_hmac('sha256', (string) $time, $secret));
}

/**
 * token_is_valid
 *
 * Checks the signature and that the token is neither too new nor too old
 *
 * @since 8.2
 * @param string $token Token submitted with the form
 * @param array $form Form protection settings from the config
 * @return bool
 */
function token_is_valid(string $token, array $form): bool
{
    // it has to be a timestamp and a signature
    $parts = explode('.', $token, 2);

    if (count($parts) !== 2 || ! ctype_digit($parts[0])) {
        return false;
    }

    // too fast is a bot, too slow is stale
    $age = time() - (int) $parts[0];

    if ($age < $form['min_seconds'] || $age > $form['max_seconds']) {
        return false;
    }

    return hash_equals(sign_token((int) $parts[0], $form['token_secret']), $token);
}

/**
 * clean
 *
 * Trims a value and flattens it to a single line
 *
 * @since 8.2
 * @param mixed $value Raw value
 * @return string
 */
function clean(mixed $value): string
{
    return trim((string) preg_replace('/\s+/', ' ', (string) $value));
}

// only posts are allowed
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false, 'Method not allowed.');
}

// we cannot do anything without the config
$configFile = __DIR__ . '/config.php';

if (! is_file($configFile)) {
    error_log('sendit.php: config.php is missing');
    respond(500, false, 'Online quote requests are not available right now. Please contact us by phone or email.');
}

$config = require $configFile;

// hand out a signed time token when the page asks for one
if (($_POST['action'] ?? '') === 'token') {
    respond(200, true, 'ok', ['token' => sign_token(time(), $config['form']['token_secret'])]);
}

// the honeypot is hidden from people, so anything in it is a bot
if (clean($_POST['website'] ?? '') !== '') {
    respond(200, true, 'Thank you! Your quote request has been sent. We will be in touch shortly.');
}

// the time token must be valid
if (! token_is_valid((string) ($_POST['form_token'] ?? ''), $config['form'])) {
    respond(400, false, 'Your session expired. Please refresh the page and try again.');
}

// the services we offer, matching the form
$services = [
    'office-cleaning' => 'Office & Corporate Cleaning',
    'commercial-cleaning' => 'Commercial Facility Cleaning',
    'restroom-sanitization' => 'Restroom Sanitization',
    'disinfection' => 'Common Area & High-Touch Disinfection',
    'custom-plan' => 'Custom Cleaning Plan',
    'other' => 'Other',
];

// collect the submitted values
$firstName = clean($_POST['first_name'] ?? '');
$lastName = clean($_POST['last_name'] ?? '');
$email = clean($_POST['email'] ?? '');
$phone = clean($_POST['phone'] ?? '');
$service = clean($_POST['service'] ?? '');
$message = trim(preg_replace('/[^\P{C}\n]+/u', '', (string) ($_POST['message'] ?? '')) ?? '');

// validate them
if (
    $firstName === '' || mb_strlen($firstName) > 100
    || $lastName === '' || mb_strlen($lastName) > 100
) {
    respond(422, false, 'Please enter your first and last name.');
}

if (! filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    respond(422, false, 'Please enter a valid email address.');
}

if (! preg_match('/^[0-9+().\-\s]{7,20}$/', $phone)) {
    respond(422, false, 'Please enter a valid phone number.');
}

if (! isset($services[$service])) {
    respond(422, false, 'Please select a service.');
}

if (mb_strlen($message) > 5000) {
    respond(422, false, 'Your message is too long.');
}

// build and send the email
$mail = new PHPMailer(true);

try {
    // smtp connection
    $mail->isSMTP();
    $mail->Host = $config['smtp']['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp']['username'];
    $mail->Password = $config['smtp']['password'];
    $mail->SMTPSecure = $config['smtp']['encryption'] === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int) $config['smtp']['port'];
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Timeout = 15;
//    $mail->SMTPDebug = 2;
//    $mail->Debugoutput = 'error_log';

    // the addresses, replies go to the visitor
    $mail->setFrom($config['mail']['from_email'], $config['mail']['from_name']);
    $mail->addAddress($config['mail']['to_email'], $config['mail']['to_name']);
    $mail->addReplyTo($email, sprintf('%s %s', $firstName, $lastName));

    // the message itself
    $mail->isHTML(false);
    $mail->Subject = sprintf('Quote Request: %s', $services[$service]);
    $mail->Body = sprintf(
        "Name: %s %s\nEmail: %s\nPhone: %s\nService: %s\n\nMessage:\n%s\n",
        $firstName,
        $lastName,
        $email,
        $phone,
        $services[$service],
        $message === '' ? '(none)' : $message
    );

    $mail->send();
} catch (Exception $e) {
    // log the real reason, the visitor does not need it
    error_log(sprintf('sendit.php: mail failed: %s', $mail->ErrorInfo));
    respond(500, false, 'We could not send your request. Please contact us by phone or email.');
}

respond(200, true, 'Thank you! Your quote request has been sent. We will be in touch shortly.');
