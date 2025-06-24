<?php

include_once __DIR__ . "/config.php";
echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n<head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\r\n\r\n    <link rel=\"icon\" href=\"assets/img/logo.png\">\r\n    <meta name=\"description\" content=\"Consulta de Correo.\">\r\n \r\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"\" crossorigin=\"anonymous\">\r\n\t    <link href=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css\" rel=\"stylesheet\">\r\n    <link rel=\"icon\" type=\"image/png\" href=\"assets/img/favicon.png\">\r\n    <link rel=\"stylesheet\" href=\"assets/css/global.css\">\r\n    <link rel=\"stylesheet\" href=\"assets/css/home.css\">\r\n     <link rel=\"stylesheet\" href=\"assets/css/miestilo.css\">\r\n\r\n    <title>Consulta de Email</title>\r\n</head>  \r\n \r\n";

        $tipoPlataforma = isset($_GET["tipo"]) ? $_GET["tipo"] : "";
        echo "<body>\r\n\r\n \r\n    <!--Navbar-->\r\n    <div class=\"navbar\">\r\n        <div class=\"menu-mobile\">\r\n            <a href='index.php' title=\"Verificador de Email\">\r\n                <div class=\"log o\">\r\n                    <img src=\"assets/img/logo.png\" alt=\"Logo Verificador\"  >\r\n                     \r\n                </div>\r\n            </a>\r\n\r\n            <div class=\"hamburger\">\r\n                <i class=\"bi bi-list\"></i>\r\n            </div>\r\n        </div>\r\n";
        echo " <div class=\"links\">\r\n            <a href=\"index.php\" class=\"link active\"><i class=\"bi bi-house\"></i> Inicio</a>\r\n            <a class=\"link\" href=\"" .
        $GLOBAL_LINK_1 .
        "\"><i class=\"bi bi-bookmark\"></i> " .
        $GLOBAL_LINK_1_TEXTO .
        "</a>\r\n            <a class=\"link\" href=\"" .
        $GLOBAL_LINK_2 .
        "\"><i class=\"bi bi-broadcast-pin\"></i> " .
        $GLOBAL_LINK_2_TEXTO .
        "</a>\r\n            <a class=\"link\" target=\"_blank\" href=\"https://wa.me/" .
        $GLOBAL_NUMERO_WHATSAPP .
        "?text=" .
        $GLOBAL_TEXTO_WHATSAPP .
        "\"><i class=\"bi bi-whatsapp\"></i> WhatsApp</a>\r\n            
        <a class=\"link\" target=\"_blank\" href=\"https://t.me/interplaycodigos_bot\"><i class=\"bi bi-telegram\"></i> Telegram bot</a>\r\n        
        </div>";
        echo "        \r\n    </div>\r\n \r\n\r\n<section id=\"fondo1\">\r\n<div class=\"container\" >\r\n   <div class=\"row\"><h2 class=\"section-title\">Consulta de Email</h2>\r\n    <div class=\"col-sm-4\">\r\n\t\r\n\t<div class=\"   \">\r\n                <a href=\"index.php?tipo=netflix\" class=\"url\"   >\r\n                    <div class=\"link-plataformas animacionnetflix\">\r\n                        <h5 class=\"tituloplataformas\">Netflix</h5>\r\n                        <div class=\"link-description\">\r\n                            <p class=\"description\">Recupera tu codigo de acceso temporal.</p>\r\n                            <div class=\"icono-netflix\">\r\n\t\t\t\t\t\t\t<i class=\"bi bi-badge-hd\"></i>\r\n \r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </a>\r\n\r\n                <a href=\"index.php?tipo=disney\" class=\"url\">\r\n                    <div class=\"link-plataformas animaciondisney\">\r\n                        <h5 class=\"tituloplataformas\">Disney Español</h5>\r\n                        <div class=\"link-description\">\r\n                            <p class=\"description\">Recupera Acceso único para Disney+ Español</p>\r\n                            <div class=\"icono-disney\">\r\n                                <i class=\"bi bi-tv-fill\"></i>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </a>\r\n\t\t\t\t 
          <a href=\"index.php?tipo=disney2\" class=\"url\">\r\n                    <div class=\"link-plataformas animaciondisney\">\r\n                        <h5 class=\"tituloplataformas\">Disney Inglés</h5>\r\n                        <div class=\"link-description\">\r\n                            <p class=\"description\">Recupera Acceso único para Disney+ en Inglés</p>\r\n                            <div class=\"icono-disney\">\r\n                                <i class=\"bi bi-tv-fill\"></i>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </a>\r\n\t\t\t\t 
        
        
        <a href=\"index.php?tipo=prime\" class=\"url\">\r\n                    <div class=\"link-plataformas animacionstar\">\r\n                        <h5 class=\"tituloplataformas\">Prime Video</h5>\r\n                        <div class=\"link-description\">\r\n                            <p class=\"description\">Intento de inicio de sesión en Amazon Prime Video</p>\r\n                            <div class=\"icono-primevideo\">\r\n                                <i class=\"bi bi-cast\"></i>\r\n                            </div>\r\n                        </div>
        
        
        </div>\r\n                </a>\r\n\t\t\t\t \r\n  </div>\r\n  \r\n\t\r\n\t</div>\r\n\t<div class=\"col-sm-8\"> ";
        
{
            $subject_contains_alternative = false; // or some condition you want to check
            $body_contains_alternative = false;    // or some condition you want to check
            $plataforma = isset($_GET["p"]) ? $_GET["p"] : "";
            $consulted_email = isset($_GET["email"])
                ? strtolower(trim($_GET["email"]))
                : null;
            if ($plataforma && $consulted_email) {
                switch ($plataforma) {
                    case "netflix":
                        $inbox = imap_open(
                            IMAP_HOST,
                            IMAP_USERNAME,
                            IMAP_PASSWORD
                        );
                        if (!$inbox) {
                            $error = imap_last_error();
                            echo "No se pudo conectar al servidor IMAP. Error: " .
                                $error;
                            exit();
                        }
                        $time_limit = time() - 1800;
                        $search_criteria =
                            "SINCE \"" .
                            date("d-M-Y H:i:s", $time_limit) .
                            "\"";
                        $emails = imap_search($inbox, $search_criteria);
                        if (!$emails) {
                            echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'>No se encontraron mensajes en la bandeja de entrada recibidos en los últimos 30 minutos.</div></div>";
                            exit();
                        }
                        $emails_by_sender = [];
                        $emails_by_recipient = [];
                        foreach ($emails as $email) {
                            $overview = imap_fetch_overview($inbox, $email, 0);
                            $from_email =
                                strtolower(
                                    trim(
                                        imap_rfc822_parse_adrlist(
                                            $overview[0]->from,
                                            ""
                                        )[0]->mailbox
                                    )
                                ) .
                                "@" .
                                imap_rfc822_parse_adrlist(
                                    $overview[0]->from,
                                    ""
                                )[0]->host;
                            $to_email =
                                strtolower(
                                    trim(
                                        imap_rfc822_parse_adrlist(
                                            $overview[0]->to,
                                            ""
                                        )[0]->mailbox
                                    )
                                ) .
                                "@" .
                                imap_rfc822_parse_adrlist(
                                    $overview[0]->to,
                                    ""
                                )[0]->host;
                            if (!isset($emails_by_sender[$from_email])) {
                                $emails_by_sender[$from_email] = $email;
                            } else {
                                $existing_email_date = strtotime(
                                    $overview[0]->date
                                );
                                $latest_email_date = strtotime(
                                    imap_fetch_overview(
                                        $inbox,
                                        $emails_by_sender[$from_email],
                                        0
                                    )[0]->date
                                );
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_sender[$from_email] = $email;
                                }
                            }
                            if (!isset($emails_by_recipient[$to_email])) {
                                $emails_by_recipient[$to_email] = $email;
                            } else {
                                $existing_email_date = strtotime(
                                    $overview[0]->date
                                );
                                $latest_email_date = strtotime(
                                    imap_fetch_overview(
                                        $inbox,
                                        $emails_by_recipient[$to_email],
                                        0
                                    )[0]->date
                                );
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_recipient[$to_email] = $email;
                                }
                            }
                        }
                        $last_sender_email_number = isset(
                            $emails_by_sender[$consulted_email]
                        )
                            ? $emails_by_sender[$consulted_email]
                            : null;
                        $last_recipient_email_number = isset(
                            $emails_by_recipient[$consulted_email]
                        )
                            ? $emails_by_recipient[$consulted_email]
                            : null;
                        if (
                            $last_sender_email_number ||
                            $last_recipient_email_number
                        ) {
                            $last_email_number = $last_sender_email_number
                                ? $last_sender_email_number
                                : $last_recipient_email_number;
                            $overview = imap_fetch_overview(
                                $inbox,
                                $last_email_number,
                                0
                            );
                            $structure = imap_fetchstructure(
                                $inbox,
                                $last_email_number
                            );
                            $message_body = "";
                            if (!empty($structure->parts)) {
                                foreach (
                                    $structure->parts
                                    as $part_number => $part
                                ) {
                                    if (
                                        $part->type == TYPETEXT &&
                                        $part->subtype == "HTML"
                                    ) {
                                        $message_part = imap_fetchbody(
                                            $inbox,
                                            $last_email_number,
                                            $part_number + 1
                                        );
                                        switch ($part->encoding) {
                                            case 0:
                                            case 1:
                                                $message_body .= $message_part;
                                                break;
                                            case 3:
                                                $message_body .= base64_decode(
                                                    $message_part
                                                );
                                                break;
                                            case 4:
                                                $message_body .= quoted_printable_decode(
                                                    $message_part
                                                );
                                                break;
                                            default:
                                                $message_body .= $message_part;
                                        }
                                    }
                                }
                            } else {
                                $message_body = quoted_printable_decode(
                                    imap_body($inbox, $last_email_number)
                                );
                            }
                            $subject_contains_keyword =
                                stripos(
                                    $overview[0]->subject,
                                    "Tu código de acceso temporal"
                                ) !== false;
                            $body_contains_keyword =
                                stripos(
                                    $message_body,
                                    "Tu código de acceso temporal"
                                ) !== false;
                                
                            $subject_contains_login_keyword = 
                                stripos($overview[0]->subject, 
                                "Tu código de inicio de sesión"
                                ) !== false;
                            $body_contains_login_keyword = 
                                stripos($message_body, 
                                "Ingresa este código para iniciar sesión"
                                ) !== false;

                            $subject_contains_Home = 
                                stripos($overview[0]->subject, 
                                "Importante: Cómo actualizar tu Hogar con Netflix"
                                ) !== false;
                            $body_contains_Home = 
                                stripos($message_body, 
                                "¿Solicitaste actualizar tu Hogar con Netflix?"
                                ) !== false;
                            
                            if (
                                $subject_contains_keyword ||
                                $body_contains_keyword ||
                                $subject_contains_alternative ||
                                $body_contains_alternative ||
                                $subject_contains_login_keyword ||
                                $body_contains_login_keyword ||
                                $subject_contains_Home ||
                                $body_contains_Home
                            ) {
                                $message_body_with_bg =
                                    "<div class=\"email-body\" style=\"background-image: url('fondo.jpg'); background-size: cover;\">";
                                $message_body_with_bg .= $message_body;
                                $message_body_with_bg .= "</div>";
                                $message_body_with_bg = str_replace(
                                    "background-color: #e5e5e5;",
                                    "background-color: rgba(229, 229, 229, 0.5);",
                                    $message_body_with_bg
                                );
                                echo $message_body_with_bg;
                                $impresion = true;
                            } else {
                                echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'> No se encontró contenido relevante en el correo electrónico.</div></div>";
                            }
                        } else {
                            echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'> No se encontró ningún correo del remitente consultado en los últimos 30 minutos.</div></div>";
                        }
                        imap_close($inbox);
                        break;
                    case "disney":
                        $inbox = imap_open(
                            IMAP_HOST,
                            IMAP_USERNAME,
                            IMAP_PASSWORD
                        );
                        if (!$inbox) {
                            $error = imap_last_error();
                            echo "No se pudo conectar al servidor IMAP. Error: " .
                                $error;
                            exit();
                        }
                        $time_limit = time() - 1800;
                        $search_criteria =
                            "SINCE \"" . date("d-M-Y", $time_limit) . "\"";
                        $emails = imap_search($inbox, $search_criteria);
                        $emails_by_sender = [];
                        $emails_by_recipient = [];
                        foreach ($emails as $email) {
                            $overview = imap_fetch_overview($inbox, $email, 0);
                            $from_email =
                                strtolower(
                                    trim(
                                        imap_rfc822_parse_adrlist(
                                            $overview[0]->from,
                                            ""
                                        )[0]->mailbox
                                    )
                                ) .
                                "@" .
                                imap_rfc822_parse_adrlist(
                                    $overview[0]->from,
                                    ""
                                )[0]->host;
                            $to_email =
                                strtolower(
                                    trim(
                                        imap_rfc822_parse_adrlist(
                                            $overview[0]->to,
                                            ""
                                        )[0]->mailbox
                                    )
                                ) .
                                "@" .
                                imap_rfc822_parse_adrlist(
                                    $overview[0]->to,
                                    ""
                                )[0]->host;
                            if (!isset($emails_by_sender[$from_email])) {
                                $emails_by_sender[$from_email] = $email;
                            } else {
                                $existing_email_date = strtotime(
                                    $overview[0]->date
                                );
                                $latest_email_date = strtotime(
                                    imap_fetch_overview(
                                        $inbox,
                                        $emails_by_sender[$from_email],
                                        0
                                    )[0]->date
                                );
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_sender[$from_email] = $email;
                                }
                            }
                            if (!isset($emails_by_recipient[$to_email])) {
                                $emails_by_recipient[$to_email] = $email;
                            } else {
                                $existing_email_date = strtotime(
                                    $overview[0]->date
                                );
                                $latest_email_date = strtotime(
                                    imap_fetch_overview(
                                        $inbox,
                                        $emails_by_recipient[$to_email],
                                        0
                                    )[0]->date
                                );
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_recipient[$to_email] = $email;
                                }
                            }
                        }
                        $last_sender_email_number = isset(
                            $emails_by_sender[$consulted_email]
                        )
                            ? $emails_by_sender[$consulted_email]
                            : null;
                        $last_recipient_email_number = isset(
                            $emails_by_recipient[$consulted_email]
                        )
                            ? $emails_by_recipient[$consulted_email]
                            : null;
                        if (
                            $last_sender_email_number ||
                            $last_recipient_email_number
                        ) {
                            $last_email_number = $last_sender_email_number
                                ? $last_sender_email_number
                                : $last_recipient_email_number;
                            $overview = imap_fetch_overview(
                                $inbox,
                                $last_email_number,
                                0
                            );
                            $structure = imap_fetchstructure(
                                $inbox,
                                $last_email_number
                            );
                            $message_body = "";
                            if (!empty($structure->parts)) {
                                foreach (
                                    $structure->parts
                                    as $part_number => $part
                                ) {
                                    if (
                                        $part->type == TYPETEXT &&
                                        $part->subtype == "HTML"
                                    ) {
                                        $message_part = imap_fetchbody(
                                            $inbox,
                                            $last_email_number,
                                            $part_number + 1
                                        );
                                        switch ($part->encoding) {
                                            case 0:
                                            case 1:
                                                $message_body .= $message_part;
                                                break;
                                            case 3:
                                                $message_body .= base64_decode(
                                                    $message_part
                                                );
                                                break;
                                            case 4:
                                                $message_body .= quoted_printable_decode(
                                                    $message_part
                                                );
                                                break;
                                            default:
                                                $message_body .= $message_part;
                                        }
                                    }
                                }
                            } else {
                                $message_body = quoted_printable_decode(
                                    imap_body($inbox, $last_email_number)
                                );
                            }
                            $subject_contains_keyword =
                                stripos(
                                    $overview[0]->subject,
                                    "Tu código de acceso único para Disney+"
                                ) !== false;
                            $body_contains_keyword =
                                stripos(
                                    $message_body,
                                    "Tu código de acceso único para Disney+"
                                ) !== false;
                            if (
                                $subject_contains_keyword ||
                                $body_contains_keyword
                            ) {
                                $image_position = strpos(
                                    $message_body,
                                    "https://image.mail.disneyplus.com/lib/fe2e117170640474761076/m/1/3863b6d6-0fe7-4329-abbf-1949c3224992.png"
                                );
                                if ($image_position !== false) {
                                    $message_body = substr(
                                        $message_body,
                                        0,
                                        $image_position +
                                            strlen(
                                                "https://image.mail.disneyplus.com/lib/fe2e117170640474761076/m/1/3863b6d6-0fe7-4329-abbf-1949c3224992.png"
                                            )
                                    );
                                }
                                echo $message_body;
                                $impresion = true;
                            } else {
                                echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'>No se encontró contenido relevante en el correo electrónico. </div></div> ";
                            }
                        } else {
                            echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'>No se encontró ningún correo del remitente consultado en los últimos 30 minutos. </div></div> ";
                        }
                        imap_close($inbox);
                        break;
                    case "disney2":
                        $inbox = imap_open(
                            IMAP_HOST,
                            IMAP_USERNAME,
                            IMAP_PASSWORD
                        );
                        if (!$inbox) {
                            $error = imap_last_error();
                            echo "No se pudo conectar al servidor IMAP. Error: " .
                                $error;
                            exit();
                        }
                        $time_limit = time() - 1800;
                        $search_criteria =
                            "SINCE \"" . date("d-M-Y", $time_limit) . "\"";
                        $emails = imap_search($inbox, $search_criteria);
                        $emails_by_sender = [];
                        $emails_by_recipient = [];
                        foreach ($emails as $email) {
                            $overview = imap_fetch_overview($inbox, $email, 0);
                            $from_email =
                                strtolower(
                                    trim(
                                        imap_rfc822_parse_adrlist(
                                            $overview[0]->from,
                                            ""
                                        )[0]->mailbox
                                    )
                                ) .
                                "@" .
                                imap_rfc822_parse_adrlist(
                                    $overview[0]->from,
                                    ""
                                )[0]->host;
                            $to_email =
                                strtolower(
                                    trim(
                                        imap_rfc822_parse_adrlist(
                                            $overview[0]->to,
                                            ""
                                        )[0]->mailbox
                                    )
                                ) .
                                "@" .
                                imap_rfc822_parse_adrlist(
                                    $overview[0]->to,
                                    ""
                                )[0]->host;
                            if (!isset($emails_by_sender[$from_email])) {
                                $emails_by_sender[$from_email] = $email;
                            } else {
                                $existing_email_date = strtotime(
                                    $overview[0]->date
                                );
                                $latest_email_date = strtotime(
                                    imap_fetch_overview(
                                        $inbox,
                                        $emails_by_sender[$from_email],
                                        0
                                    )[0]->date
                                );
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_sender[$from_email] = $email;
                                }
                            }
                            if (!isset($emails_by_recipient[$to_email])) {
                                $emails_by_recipient[$to_email] = $email;
                            } else {
                                $existing_email_date = strtotime(
                                    $overview[0]->date
                                );
                                $latest_email_date = strtotime(
                                    imap_fetch_overview(
                                        $inbox,
                                        $emails_by_recipient[$to_email],
                                        0
                                    )[0]->date
                                );
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_recipient[$to_email] = $email;
                                }
                            }
                        }
                        $last_sender_email_number = isset(
                            $emails_by_sender[$consulted_email]
                        )
                            ? $emails_by_sender[$consulted_email]
                            : null;
                        $last_recipient_email_number = isset(
                            $emails_by_recipient[$consulted_email]
                        )
                            ? $emails_by_recipient[$consulted_email]
                            : null;
                        if (
                            $last_sender_email_number ||
                            $last_recipient_email_number
                        ) {
                            $last_email_number = $last_sender_email_number
                                ? $last_sender_email_number
                                : $last_recipient_email_number;
                            $overview = imap_fetch_overview(
                                $inbox,
                                $last_email_number,
                                0
                            );
                            $structure = imap_fetchstructure(
                                $inbox,
                                $last_email_number
                            );
                            $message_body = "";
                            if (!empty($structure->parts)) {
                                foreach (
                                    $structure->parts
                                    as $part_number => $part
                                ) {
                                    if (
                                        $part->type == TYPETEXT &&
                                        $part->subtype == "HTML"
                                    ) {
                                        $message_part = imap_fetchbody(
                                            $inbox,
                                            $last_email_number,
                                            $part_number + 1
                                        );
                                        switch ($part->encoding) {
                                            case 0:
                                            case 1:
                                                $message_body .= $message_part;
                                                break;
                                            case 3:
                                                $message_body .= base64_decode(
                                                    $message_part
                                                );
                                                break;
                                            case 4:
                                                $message_body .= quoted_printable_decode(
                                                    $message_part
                                                );
                                                break;
                                            default:
                                                $message_body .= $message_part;
                                        }
                                    }
                                }
                            } else {
                                $message_body = quoted_printable_decode(
                                    imap_body($inbox, $last_email_number)
                                );
                            }
                            $subject_contains_keyword =
                                stripos(
                                    $overview[0]->subject,
                                    "Your one-time passcode for Disney+"
                                ) !== false;
                            $body_contains_keyword =
                                stripos(
                                    $message_body,
                                    "Here’s your one-time passcode for Disney+"
                                ) !== false;
                            if (
                                $subject_contains_keyword ||
                                $body_contains_keyword
                            ) {
                                $image_position = strpos(
                                    $message_body,
                                    "https://image.mail.disneyplus.com/lib/fe2e117170640474761076/m/1/3863b6d6-0fe7-4329-abbf-1949c3224992.png"
                                );
                                if ($image_position !== false) {
                                    $message_body = substr(
                                        $message_body,
                                        0,
                                        $image_position +
                                            strlen(
                                                "https://image.mail.disneyplus.com/lib/fe2e117170640474761076/m/1/3863b6d6-0fe7-4329-abbf-1949c3224992.png"
                                            )
                                    );
                                }
                                echo $message_body;
                                $impresion = true;
                            } else {
                                echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'>No se encontró contenido relevante en el correo electrónico. </div></div> ";
                            }
                        } else {
                            echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'>No se encontró ningún correo del remitente consultado en los últimos 30 minutos. </div></div> ";
                        }
                        imap_close($inbox);
                        break;
                        
                        /////
                    case "prime":
                     $inbox = imap_open(
                         IMAP_HOST,
                         IMAP_USERNAME,
                         IMAP_PASSWORD
                        );
                        if (!$inbox) {
                            $error = imap_last_error();
                            echo "No se pudo conectar al servidor IMAP. Error: " . $error;
                            exit();
                        }

                        $time_limit = time() - 1800;
                        $search_criteria = "SINCE \"" . date("d-M-Y H:i:s", $time_limit) . "\"";
                        $emails = imap_search($inbox, $search_criteria);
                        if (!$emails) {
                            echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'>No se encontraron mensajes en la bandeja de entrada recibidos en los últimos 30 minutos.</div></div>";
                            exit();
                        }

                        $emails_by_sender = [];
                        $emails_by_recipient = [];
                        foreach ($emails as $email) {
                            $overview = imap_fetch_overview($inbox, $email, 0);
                            $from_email =
                                strtolower(trim(imap_rfc822_parse_adrlist($overview[0]->from, "")[0]->mailbox)) .
                                "@" .
                                imap_rfc822_parse_adrlist($overview[0]->from, "")[0]->host;
                            $to_email =
                                strtolower(trim(imap_rfc822_parse_adrlist($overview[0]->to, "")[0]->mailbox)) .
                                "@" .
                                imap_rfc822_parse_adrlist($overview[0]->to, "")[0]->host;

                            if (!isset($emails_by_sender[$from_email])) {
                            $emails_by_sender[$from_email] = $email;
                            } else {
                                $existing_email_date = strtotime($overview[0]->date);
                                $latest_email_date = strtotime(imap_fetch_overview($inbox, $emails_by_sender[$from_email], 0)[0]->date);
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_sender[$from_email] = $email;
                                }
                            }
                            if (!isset($emails_by_recipient[$to_email])) {
                            $emails_by_recipient[$to_email] = $email;
                            } else {
                                $existing_email_date = strtotime($overview[0]->date);
                                $latest_email_date = strtotime(imap_fetch_overview($inbox, $emails_by_recipient[$to_email], 0)[0]->date);
                                if ($latest_email_date < $existing_email_date) {
                                    $emails_by_recipient[$to_email] = $email;
                                }
                            }
                        }

                            $last_sender_email_number = isset($emails_by_sender[$consulted_email])
                            ? $emails_by_sender[$consulted_email]
                            : null;
                        $last_recipient_email_number = isset($emails_by_recipient[$consulted_email])
                        ? $emails_by_recipient[$consulted_email]
                            : null;

                        if ($last_sender_email_number || $last_recipient_email_number) {
                            $last_email_number = $last_sender_email_number
                                ? $last_sender_email_number
                                : $last_recipient_email_number;
                            $overview = imap_fetch_overview($inbox, $last_email_number, 0);
                            $subject_encoded = $overview[0]->subject;
                            $subject_decoded = "";
                            $subject_parts = imap_mime_header_decode($subject_encoded);
                            foreach ($subject_parts as $part) {
                                $subject_decoded .= $part->text;
                        }
                            $structure = imap_fetchstructure($inbox, $last_email_number);
                            $message_body = "";
                                if (!empty($structure->parts)) {
                                foreach ($structure->parts as $part_number => $part) {
                                    if ($part->type == TYPETEXT && $part->subtype == "HTML") {
                                        $message_part = imap_fetchbody($inbox, $last_email_number, $part_number + 1);
                                        switch ($part->encoding) {
                                            case 0:
                                            case 1:
                                                $message_body .= $message_part;
                                                break;
                                            case 3:
                                                $message_body .= base64_decode($message_part);
                                                break;
                                            case 4:
                                                $message_body .= quoted_printable_decode($message_part);
                                                break;
                                            default:
                                            $message_body .= $message_part;
                                        }
                                    }
                                    }
                            } else {
                                $message_body = quoted_printable_decode(imap_body($inbox, $last_email_number));
                            }

                            // Añadimos las condiciones nuevas junto con las existentes
                            $subject_contains_keyword = stripos($subject_decoded, "amazon.com: Intento de inicio de sesión") !== false;
                            $body_contains_keyword = stripos($message_body, "Alguien que conoce tu contrase") !== false;

                            // Nueva condición
                            $subject_contains_alternative = stripos($subject_decoded, "amazon.com: Sign-in attempt") !== false;

                            if (
                                $subject_contains_keyword ||
                                $body_contains_keyword ||
                                $subject_contains_alternative
                            ) {
                                $message_body_with_bg = "<div class=\"email-body\" style=\"background-color: rgba(255, 255, 255, 1);\">";
                                $message_body_with_bg .= $message_body;
                                $message_body_with_bg .= "</div>";
                                $message_body_with_bg = str_replace(
                                    "background-color: #ffffff;",
                                    "background-color: rgba(255, 255, 255, 1);",
                                    $message_body_with_bg
                                );
                                echo $message_body_with_bg;
                                $impresion = true;
                                } else {
                                    echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'> No se encontró contenido relevante en el correo electrónico.</div></div>";
                        }
                        } else {
                            echo "<div align='center' class='alertanocorreoborde'><div align='center' class='alertanocorreo'> No se encontró ningún correo del remitente consultado en los últimos 30 minutos.</div></div>";
                        }
                        imap_close($inbox);
                        break;
                        
                        /////
                        
                        
                        
                    default:
                        echo "La opción no es válida";
                }
            }
        }
        if ($tipoPlataforma) {
            echo "   \r\n           \r\n            \r\n            <br>\r\n<div id=\"emailForm\"  >\r\n        <h2 class=\"section-title\"> " .
                strtoupper(str_replace("-", " ", $_GET["tipo"])) .
                " - Consulta de Correo Electrónico</h2>\r\n            <form id=\"emailFormInner\" action=\"\" method=\"GET\"><br>\r\n              <div align=\"center\">  <label for=\"email\" style=\"color:#ffffff;\">Correo Electrónico:</label></div><br>\r\n                 <input type=\"hidden\"  name=\"p\" value =\"" .
                $tipoPlataforma .
                "\">\r\n                <input type=\"email\" id=\"buscar-email\" name=\"email\" class=\"form-control\" required placeholder=\"correo@tudominio.com\"><br> \r\n                <div align=\"center\"><button class=\"btn btn-success\" type=\"submit\"><i class=\"bi bi-search\"></i>  Consultar</button> <a class=\"btn btn-primary\" href=\"index.php\" role=\"button\"> <i class=\"bi bi-arrow-return-left\"></i> Volver</a>\r\n                  \r\n                  \r\n                    </div>\r\n            </form>\r\n</div>\r\n        ";
        } else {
{
                echo "\r\n            \r\n            \r\n            \t\r\n\t  <div align=\"center\">\r\n\t      <img src=\"assets/img/logosplatformas.png\" alt=\"Verificador de Correos\" class=\"logo-img-animacion\">\r\n\t      </div>\r\n\t  <h2 class=\"section-title\">Full <span class=\"text-cambios\"><span id=\"dynamic-word\" class=\"dynamic-text\">Peliculas</span></span>  para toda tu Familia</h2><hr>\r\n\t\r\n\t\r\n\t\r\n\t\r\n\t<div class=\"row\"> \r\n    <div class=\"col texto-contenido\">\r\n      Prepárate para maratones de emociones 🤩, risas 😂 y aventuras 🦸 sin límites. No te pierdas esta oportunidad de acceder a un mundo de entretenimiento ilimitado. 

¡Activa tu membresía preferida y haz que tus momentos sean inolvidables! 🎬.\r\n    </div>\r\n    <div class=\"col\">\r\n    <img src=\"assets/img/yorobot.png\" class=\"img-fluid imgyorobot\"  alt=\"Pelicuas en HD\">\r\n    </div>\r\n            \r\n";
            }
        }
        echo "\t\r\n\t \r\n \r\n\r\n \r\n</div>\r\n \r\n\t\r\n\t\r\n\t\r\n\t\r\n\t</div>\r\n  </div>\r\n</div>\r\n\r\n\r\n</section>\r\n\r\n\r\n      ";
        
        echo "\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n   \r\n\r\n    <!--Footer-->\r\n    <footer id=\"footer\"  style=\"background:#212529\">\r\n        <p class=\"copyright\">&copy; 2025 <span class=\"server-name-footer\"> <a href=\"https://sistema.streamdigi.co/login\">Interplay</a></span>.</p>\r\n        <div class=\"social-links\">\r\n            <a href=\"#\" class=\"link tiktok-link\"><i class=\"fa-brands fa-tiktok\"></i></a>\r\n            <a href=\"#\" class=\"link instagram-link\"><i class=\"fa-brands fa-square-instagram\"></i></a>\r\n            <a href=\"#\" class=\"link discord-link-footer\"><i class=\"fa-brands fa-discord\"></i></a>\r\n        </div>\r\n    </footer>\r\n</body>\r\n \r\n<script src=\"assets/js/scripts.js\"></script>\r\n<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js\"></script>\r\n<script src=\"assets/js/firefly.js\"></script>\r\n<script src=\"assets/js/main.js\" type=\"text/javascript\"></script>\r\n    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"   crossorigin=\"anonymous\"></script>\r\n \r\n \r\n\r\n</html>";


        exit("Consulta Satisfactoria");


?>
