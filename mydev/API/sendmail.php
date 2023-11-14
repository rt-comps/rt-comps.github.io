<?php
// ----------------------------------------------------------------------------------------------------
// - Display Errors
// ---------------------------------------------------------------------------------------------------
// ini_set('display_errors', 'On');
// ini_set('html_errors', 0);

// ------------------------------------------------------------------------------------------------
// - Error Reporting
// ------------------------------------------------------------------------------------------------
// error_reporting(-1);

// ------------------------------------------------------------------------------------------------
// - Use PHPMailer
// ------------------------------------------------------------------------------------------------
require_once '../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;


// ------------------------------------------------------------------------------------------------
// Send an email based on information sent in JSON format via a POST request
//
// JSON is expected to be an encoded opject of form
//  {
//      tag: <name of tag>,
//      data: <array of objects - one per order line>,
//      details: <object containing user details>
//  }
// 
// tag  - The name of the tag that is associated with the product ID
// data - An array of objects that have 'prodID' & 'count' properties
// ------------------------------------------------------------------------------------------------
$ok = true;

// ++++++ Pre-Flight Checks ++++++
// Only respond to POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $ok = false;
}

// Check request body is JSON and, if so, assign contents to an object
if ($ok && $_SERVER['CONTENT_TYPE'] === 'application/json') {
    // Convert JSON to an object
    $postBody = json_decode(file_get_contents('php://input'), 0);
    // Define expected object form
    $JSONtemplate = array('tag' => 'string', 'order' => 'array', 'details' => 'object');
} else {
    $ok = false;
}

// check that all required parameters are present and correct type in object
if ($ok) {
    foreach ($JSONtemplate as $key => $type) {
        // Set NOK and stop checks on first fail
        if (!isset($postBody->$key) || gettype($postBody->$key) !== $type) {
            $ok = false;
            //print_r('Failed on: ' . $key . '<br/>');
            break;
        }
    }
}

// Get the information necessary to parse sent data - stored on origin server
if ($ok) {
    // Fix for server running locally in Docker
    $fixedURI = str_replace(':5100', '', $_SERVER['HTTP_REFERER']);
    // Pull file adjacent to source file
    $filename = substr($fixedURI, 0, strrpos($fixedURI, '/')) . '/menu.html';
    // Load file and surpress warnings for custom tags
    $doc = new DOMDocument;
    libxml_use_internal_errors(true);
    $ok = $doc->loadHTMLFile($filename);
    libxml_clear_errors();
}

// Check that the file contains the tag we are interested in
if ($ok)
    $ok = ($doc->getElementsByTagName($postBody->tag)->length > 0);
// ++++++ End Of Pre-Flight Checks ++++++


// If pre-checks pass then create email body and send email else return failure
if ($ok) {
    // Convert prices in cents to Euro
    function toEuro($value)
    {
        $fmt = new NumberFormatter('nl_NL', NumberFormatter::CURRENCY);
        return $fmt->formatCurrency($value / 100, "EUR");
    }

    // Create searchable DOM tree
    $xpath = new DOMXPath($doc);
    // Initiate some variables
    $message = '';
    $orderTotal = 0;

    /// Build email body
    // Reconstruct order details from information in 'data' array
    foreach ($postBody->order as $object) {
        // Get the basic product information
        $query = '//' . $postBody->tag . "[@prodid='" . $object->prodID . "']";
        // Product IDs should be unique so only one match expected
        $node = $xpath->query($query)->item(0);
        // Gather associated data
        $variety = $node->parentNode;
        $query = 'item-title';
        $product = $xpath->query($query, $variety->parentNode)->item(0);
        // Calculate value of this line - Strings auto-magically converted to numbers
        $linetotal = $node->getAttribute('prijs') * $object->count;
        // Update running total
        $orderTotal += $linetotal;
        // Output Data
        $message .= 'Item: ' . ucwords($product->nodeValue . ' - ' . $variety->getAttribute('value') . ' - ' . $node->nodeValue) . "\n";
        $message .= 'Quantity: ' . $object->count . "\n";
        $message .= 'Line Total: ' . toEuro($linetotal) . "\n\n";
    }
    $message .= 'Order Total: ' . toEuro($orderTotal) . "\n\n\n";

    $details = $postBody->details;
    // Add pickup details to order
    $message .= 'Oppakken van: ' . $details->{'pickup-location'} . "\n";
    $message .= 'Datum: ' . $details->{'picked-date'} . "\n";
    $message .= 'Tijd: ' . $details->{'pickup-time'} . "\n\n\n";


    // Add company details
    $message .= $details->bedrijfsnaam ? 'Bedrijfsnaam: ' . $details->bedrijfsnaam . "\nKostenplaats: " . $details->kostplaat . "\n\n\n" : '';

    // Add personal details
    $message .= 'Naam: ' . ($details->voornaam ?? '') . ' ' . ($details->achtnaam ?? '') . "\n";
    $message .= 'E-mail: ' . $details->email . "\n";
    $message .= 'Telefoonnummer: ' . $details->phone . "\n";
    $message .= 'Adres: ' . $details->adres . "\n";
    $message .= 'Postcode: ' . $details->postcode . "\n";
    $message .= 'Woonplaats: ' . $details->woon . "\n\n";
    $message .= $details->opmerk ? "Opmerk:\n" . $details->opmerk : '';
    $message .= "\n\n";

    /// Send the mail
    // Configure message settings
    $mail = new PHPMailer();
    //$mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->CharSet = "UTF-8";
    $mail->isSMTP();
    $mail->Host = 'roads-technology.com';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->Username = "postduif_applepie@roads-technology.com";
    $mail->Password = "P@STduif3.14";
    $mail->setFrom('no-reply@roads-technology.com');
    $mail->addAddress('si@simonvickers.net');
    $mail->addAddress('Danny.Engelman@roads.nl');
    // Write message
    $mail->Subject = 'NIEWE BESTELLING';
    //$mail->Body = wordwrap($message, 70, "\n");
    $mail->Body = $message;

    // Send mail
    if ($mail->send()) {
        print_r('OK');
    } else {
        // Return error message on failure
        print_r($mail->ErrorInfo . "\nNOK");
    }

} else
    print_r('NOK');


?>