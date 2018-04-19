<?php

$project_name = 'Site name';
$fromEmail = 'noreply@domain.com';
$emails = ['example@domain.com'];
$subject = 'Mail subject';

$domain = 'https://domain.com';
$logoUrl = 'https://domain.com/img/logo.png';
$logoWidth = '100'; // px

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    if (empty($_POST['spam'])) {

        $body = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
        $body .= '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>';
        $body .= '<body>';
        $body .= '<table width="100%" bgcolor="#FFFFFF"><tbody><tr><td>';
        $body .= '<br><br>';
        $body .= '<table width="600" align="center" cellspacing="1" cellpadding="20" bgcolor="#E0E0E0"><tbody><tr>';
        $body .= '<td bgcolor="#E0E0E0" height="75" align="center">';
        $body .= '<a href="' . $domain . '" target="_blank">';
        $body .= '<img src="' . $logoUrl . '" width="' . $logoWidth . '" alt="logo" border="0">';
        $body .= '</a>';
        $body .= '</td>';
        $body .= '</tr>';
        $body .= '<tr>';
        $body .= '<td bgcolor="#FFFFFF">';
        $body .= '<p></p>';
        if ( ! empty($_POST['name'])) {
            $body .= '<p><strong>Имя: </strong>' . $_POST['name'] . '</p>';
        }
        if ( ! empty($_POST['phone'])) {
            $body .= '<p><strong>Телефон: </strong>' . $_POST['phone'] . '</p>';
        }
        $body .= '<p></p>';
        $body .= '</td>';
        $body .= '</tr></tbody></table>';
        $body .= '</td></tr></tbody></table></body></html>';

        function adopt($text)
        {
            return '=?UTF-8?B?' . Base64_encode($text) . '?=';
        }

        foreach ($emails as $email) {
            $headers = "MIME-Version: 1.0" . PHP_EOL .
                "Content-Type: text/html; charset=utf-8" . PHP_EOL .
                'From: ' . adopt($project_name) . ' <' . $fromEmail . '>' . PHP_EOL .
                'Reply-To: ' . $email . '' . PHP_EOL;
            mail($email, adopt($subject), $body, $headers);
        }

        die(json_encode(['status' => 'success']));
    } else {
        die(json_encode(['status' => 'error']));
    }
}
