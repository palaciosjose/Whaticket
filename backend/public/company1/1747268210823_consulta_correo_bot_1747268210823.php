<?php
// Incluir el archivo de configuración del correo
include 'config.php';
// Variables para guardar el estado del usuario
session_start(); // Asegúrate de que las sesiones estén habilitadas
$user_states = [];

date_default_timezone_set('America/Bogota'); // Configura la zona horaria
$telegram_token = TELEGRAM_BOT_TOKEN;

// Leer la actualización que envía Telegram (Webhook)
$update = file_get_contents("php://input");
$update = json_decode($update, true);

if (isset($update['message'])) {
    $message = $update['message']['text'];
    $chat_id = $update['message']['chat']['id'];
    $user_first_name = $update['message']['from']['first_name'];
       // Ajustar el patrón para capturar solo la plataforma y el correo, respetando guiones bajos en la plataforma
    /*if (preg_match('/\/([a-zA-Z_]+)\s+([\w\.\-\+]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,})/', $message, $matches)) {
        $plataforma = strtolower($matches[1]);
        $consulted_email = strtolower(trim($matches[2]));
        sendTelegramMessage($chat_id, "⌛ Procesando tu solicitud, por favor espera...");
        // Retraso de 1 segundo
        sleep(1);*/
        
        // Funciones reutilizables
        function searchEmails($inbox) {
            $time_limit = time() - 1800; // 30 minutos de búsqueda
            $search_criteria = 'SINCE "' . date("d-M-Y H:i:s", $time_limit) . '" ALL';
            return imap_search($inbox, $search_criteria);
        }

        function getPart($inbox, $email_number, $mimetype) {
            $structure = imap_fetchstructure($inbox, $email_number);
            if (!$structure->parts) {  // simple
                return imap_body($inbox, $email_number);
            }
            foreach ($structure->parts as $part_number => $part) {
                if ($part->subtype == strtoupper($mimetype)) {
                    $text = imap_fetchbody($inbox, $email_number, $part_number + 1);
                    if ($part->encoding == 3) {
                        return base64_decode($text);
                    } else if ($part->encoding == 4) {
                        return quoted_printable_decode($text);
                    } else {
                        return $text;
                    }
                }
            }
            return '';
        }

        function decodeMimeStr($string, $charset = 'UTF-8') {
            $new_string = '';
            $elements = imap_mime_header_decode($string);
            for ($i = 0; $i < count($elements); $i++) {
                if ($elements[$i]->charset == 'default') {
                    $elements[$i]->charset = 'ISO-8859-1';
                }
                $new_string .= mb_convert_encoding($elements[$i]->text, $charset, $elements[$i]->charset);
            }
            return $new_string;
        }

        function obtenerEmailReciente($emails, $inbox, $consulted_email, $type = 'from') {
            $emails_by_user = [];
            foreach ($emails as $email) {
                $overview = imap_fetch_overview($inbox, $email, 0);
                $address_list = imap_rfc822_parse_adrlist($overview[0]->{$type}, "");
                $email_address = strtolower(trim($address_list[0]->mailbox)) . "@" . $address_list[0]->host;
                if (!isset($emails_by_user[$email_address])) {
                    $emails_by_user[$email_address] = $email;
                } else {
                    $existing_email_date = strtotime($overview[0]->date);
                    $latest_email_date = strtotime(imap_fetch_overview($inbox, $emails_by_user[$email_address], 0)[0]->date);
                    if ($latest_email_date < $existing_email_date) {
                        $emails_by_user[$email_address] = $email;
                    }
                }
            }
            return isset($emails_by_user[$consulted_email]) ? $emails_by_user[$consulted_email] : null;
        }
        function saveData($chat_id, $data) {
    $file = 'data.json';
    $current_data = json_decode(file_get_contents($file), true);
    $current_data[$chat_id] = $data;
    file_put_contents($file, json_encode($current_data));
}

function getData($chat_id) {
    $file = 'data.json';
    $current_data = json_decode(file_get_contents($file), true);
    return isset($current_data[$chat_id]) ? $current_data[$chat_id] : null;
}

        
// Manejo del comando /start
    if ($message == '/start') {
        $welcomeMessage = "👋 ¡Hola, $user_first_name! Estoy aquí para guiarte en el proceso de obtención de tu código de acceso a plataformas de streaming. 🎉\n\n";
        $welcomeMessage .= "Por favor, selecciona la plataforma de la que necesitas el código haciendo clic en uno de los botones a continuación:";
        
        // Botones para las plataformas
        $replyMarkup = json_encode([
            'keyboard' => [
                [['text' => 'Netflix'], ['text' => 'Disney']],
                [['text' => 'Prime']]
        [['text' => '➕ Agregar Cliente']],
            ],
            'resize_keyboard' => true,
            'one_time_keyboard' => true,
        ]);

        sendTelegramMessage($chat_id, $welcomeMessage, $replyMarkup);
        return; // Salir para evitar procesar más comandos después del /start
    }

    // Manejo de la selección de plataformas
    $plataformas = ['netflix', 'disney', 'prime'];
    if (in_array(strtolower($message), $plataformas)) {
        // Guardar la plataforma seleccionada en el archivo JSON
        saveData($chat_id, strtolower($message));
        sendTelegramMessage($chat_id, "🔍 Has seleccionado ".ucfirst($message).". Para continuar, por favor ingresa tu correo electrónico en el siguiente formato:\n\n`correo@ejemplo.com`\n\nPor favor, asegúrate de que sea correcto.");
        return; // Esperar la respuesta con el correo electrónico
    }

    // Ajustar el patrón para capturar el correo
    if (preg_match('/([\w\.\-\+]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,})/', $message, $matches)) {
        $consulted_email = strtolower(trim($matches[0]));

        // Recuperar la plataforma seleccionada del archivo JSON
        $plataforma_seleccionada = getData($chat_id);
        if (!$plataforma_seleccionada) {
            sendTelegramMessage($chat_id, "⚠️ Ocurrió un error. La plataforma seleccionada no fue definida. Por favor, selecciona una plataforma nuevamente.");
            return;
        }

        // Confirmar el correo electrónico ingresado
        sendTelegramMessage($chat_id, "✅ Has ingresado el correo: `$consulted_email`. Procederé a buscar tu código de acceso...");
        sleep(1);

        // Aquí puedes continuar con el manejo según la plataforma seleccionada
        switch ($plataforma_seleccionada) {
    
        case "disney":
                $inbox = imap_open(IMAP_HOST, IMAP_USERNAME, IMAP_PASSWORD);
                if (!$inbox) {
                    sendTelegramMessage($chat_id, "❌ No se pudo conectar al servidor de correo.");
                    exit();
                }

                sendTelegramMessage($chat_id, "✅ Conexión al servidor de correo exitosa. 📧 Buscando correos recientes...");

                $emails = searchEmails($inbox);
                if (!$emails) {
                    sendTelegramMessage($chat_id, "⚠️ No se encontraron mensajes recientes.\n\n Sugerencia:\n Verifica que el correo ingresado sea correcto o intenta nuevamente en unos minutos.");
                    exit();
                }

                sendTelegramMessage($chat_id, "✉️ Correos encontrados: " . count($emails) . ". Procesando...");

                rsort($emails);
                $codigo_encontrado = false; // Variable de control

                foreach ($emails as $email) {
                    $overview = imap_fetch_overview($inbox, $email, 0)[0];
                    $to_address = imap_rfc822_parse_adrlist($overview->to, "");
                    $to_email = $to_address[0]->mailbox . '@' . $to_address[0]->host;
                    $from_address = imap_rfc822_parse_adrlist($overview->from, "");
                    $from_email = $from_address[0]->mailbox . '@' . $from_address[0]->host;

                    if (strtolower($to_email) == strtolower($consulted_email) || strtolower($from_email) == strtolower($consulted_email)) {
                        $subject = decodeMimeStr($overview->subject); // Decodificar el asunto

                        // Patrones de búsqueda en diferentes idiomas
                        $subject_patterns = [
                            'es' => '/Tu código de acceso único para Disney\+/is',
                            'en' => '/Your one-time passcode for Disney\+/is',
                            'tr' => '/Disney\+ için tek seferlik kodunuz/is'
                        ];

                        $language = '';
                        foreach ($subject_patterns as $lang => $pattern) {
                            if (preg_match($pattern, $subject)) {
                                $language = $lang;
                                break;
                            }
                        }

                        if ($language) {
                            $message_body = getPart($inbox, $email, 'HTML');
                            if (empty($message_body)) {
                                $message_body = getPart($inbox, $email, 'PLAIN');
                            }

                            $message_body = quoted_printable_decode($message_body); // Para manejar caracteres codificados
                            $message_body = html_entity_decode(strip_tags($message_body), ENT_QUOTES, 'UTF-8');

                            // Patrón de búsqueda del código en el cuerpo del mensaje
                            $body_pattern = '';
                            switch ($language) {
                                case 'es':
                                    $body_pattern = '/Tu código de acceso único para Disney\+.*?(\d{6})/is';
                                    break;
                                case 'en':
                                    $body_pattern = '/Your one-time passcode for Disney\+.*?(\d{6})/is';
                                    break;
                                case 'tr':
                                    $body_pattern = '/Disney\+ için tek seferlik kodunuz.*?(\d{6})/is';
                                    break;
                            }

                            if (preg_match($body_pattern, $message_body, $matches)) {
                                $verification_code = $matches[1];

                                // Detalles del correo
                                $from = $overview->from;
                                $date = $overview->date;

                                // Enviar un mensaje con emoji de éxito
                                sendTelegramMessage($chat_id, "🎉 ¡Consulta exitosa!\n\nProcesando los detalles...");

                                // Retraso de 3 segundos
                                sleep(3);

                                // Enviar el código encontrado al usuario con el formato deseado
                                $response = "Resultado de la búsqueda:\n";
                                $response .= "Asunto: $subject\n";
                                $response .= "De: $from\n";
                                $response .= "A: $to_email\n";
                                $response .= "Fecha: $date\n\n";
                                $response .= "✉️ Es necesario que verifiques la dirección de correo electrónico asociada a tu cuenta de MyDisney con este código de acceso que vencerá en 15 minutos.";
                                $response .= "\n\nCódigo: `$verification_code`";
                                $response .= "\n\nBy interplay ";
                                sendTelegramMessage($chat_id, $response);

                                $codigo_encontrado = true; // Marcar que se encontró un código
                                break; // Salir del bucle si ya se encontró un código
                            }
                        }
                    }
                }

                if (!$codigo_encontrado) {
                    sendTelegramMessage($chat_id, "⚠️ No se encontró ningún correo relevante.");
                }

                imap_close($inbox);
                break;
                case "netflix":
    $inbox = imap_open(IMAP_HOST, IMAP_USERNAME, IMAP_PASSWORD);
    if (!$inbox) {
        sendTelegramMessage($chat_id, "❌ No se pudo conectar al servidor de correo.");
        exit();
    }

    sendTelegramMessage($chat_id, "✅ Conexión al servidor de correo exitosa. 📧 Buscando correos recientes...");

    // Buscar correos de los últimos 30 minutos (sin filtrar por leídos)
    $time_limit = time() - 5400;
    $search_criteria = 'SINCE "' . date("d-M-Y H:i:s", $time_limit) . '"';
    $emails = imap_search($inbox, $search_criteria);

    if (!$emails) {
        sendTelegramMessage($chat_id, "⚠️ No se encontraron mensajes recientes.\n\n🔍 Sugerencia:\n Verifica que el correo ingresado sea correcto o intenta nuevamente en unos minutos.");
        imap_close($inbox);
        break;
    }

    sendTelegramMessage($chat_id, "✉️ Correos encontrados: " . count($emails) . ". Procesando...");

    $emails_by_sender = [];
    $emails_by_recipient = [];

    foreach ($emails as $email) {
        $overview = imap_fetch_overview($inbox, $email, 0);
        $from_email = strtolower(trim(imap_rfc822_parse_adrlist($overview[0]->from, "")[0]->mailbox)) . '@' . imap_rfc822_parse_adrlist($overview[0]->from, "")[0]->host;
        $to_email = strtolower(trim(imap_rfc822_parse_adrlist($overview[0]->to, "")[0]->mailbox)) . '@' . imap_rfc822_parse_adrlist($overview[0]->to, "")[0]->host;

        // Agrupar correos por remitente
        if (!isset($emails_by_sender[$from_email])) {
            $emails_by_sender[$from_email] = $email;
        } else {
            $existing_email_date = strtotime($overview[0]->date);
            $latest_email_date = strtotime(imap_fetch_overview($inbox, $emails_by_sender[$from_email], 0)[0]->date);
            if ($latest_email_date < $existing_email_date) {
                $emails_by_sender[$from_email] = $email;
            }
        }

        // Agrupar correos por destinatario
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

    $last_sender_email_number = $emails_by_sender[$consulted_email] ?? null;
    $last_recipient_email_number = $emails_by_recipient[$consulted_email] ?? null;

    if ($last_sender_email_number || $last_recipient_email_number) {
        $last_email_number = $last_sender_email_number ? $last_sender_email_number : $last_recipient_email_number;
        $overview = imap_fetch_overview($inbox, $last_email_number, 0);
        $structure = imap_fetchstructure($inbox, $last_email_number);
        $message_body = "";

        // Procesar solo la parte "text/plain"
        if (!empty($structure->parts)) {
            foreach ($structure->parts as $part_number => $part) {
                if ($part->type == TYPETEXT && $part->subtype == "PLAIN") {
                    $message_part = imap_fetchbody($inbox, $last_email_number, $part_number + 1);
                    $message_body .= quoted_printable_decode($message_part);
                    break;
                }
            }
        } else {
            $message_body = quoted_printable_decode(imap_body($inbox, $last_email_number));
        }

        // Eliminar etiquetas HTML y limitar longitud
        $message_body = strip_tags($message_body);
        if (strlen($message_body) > 1000) {
            $message_body = substr($message_body, 0, 1000) . '...';
        }
        
        // Obtener los encabezados completos del correo
            $headers = imap_fetchheader($inbox, $last_email_number);

            // Buscar el campo X-localeCountry
            if (preg_match('/X-localeCountry:\s.*?::([A-Z]{2})/', $headers, $matches)) {
             $country_code = $matches[1];
             $country_names = [
            "US" => "ESTADOS UNIDOS",
            "CA" => "CANADA",
            "DE" => "ALEMANIA",
            "GB" => "REINO UNIDO",
            "JP" => "JAPON",
            "KR" => "SUR KOREA",
            "CO" => "COLOMBIA",
            "MX" => "MEXICO",
            "EC" => "ECUADOR",
            "PE" => "PERU",
            "CL" => "CHILE",
            "CH" => "SUIZA",
            "SE" => "SUECIA",
            "ES" => "ESPAÑA",
            "IT" => "ITALIA",
            "FR" => "FRANCIA",
            "PT" => "PORTUGAL",
            "BR" => "BRASIL",
            "AT" => "AUSTRIA",
            "PL" => "POLONIA",
            "IN" => "INDIA",
            "AR" => "ARGENTINA",
            "UY" => "URUGUAY",
            "VE" => "VENEZUELA",
            "SG" => "SINGAPUR",
            "HK" => "HONG KONG",
            "AU" => "AUSTRALIA",
            "IE" => "IRLANDA",
            "GR" => "GRECIA",
            "BE" => "BELGICA",
            "TW" => "TAIWAN",
            "TH" => "THAILANDIA",
            "ZA" => "SUDAFRICA",
            "BG" => "BULGARIA",
            "CR" => "COSTA RICA",
            "DK" => "DINAMARCA",
            "EG" => "EGIPTO",
            "FI" => "FINLANDIA",
            "HU" => "HUNGRIA",
            "NG" => "NIGERIA",
            "PY" => "PARAGUAY",
            "NO" => "NORUEGA",
            "NL" => "PAISES BAJOS",
            "SA" => "ARABIA SAUDI",
            ];
            $country_name = $country_names[$country_code] ?? "País desconocido";
    
            // Agregar el país al mensaje
            $country_info = " $country_code - $country_name";
        } else {
            $country_info = "⚠️ No se encontró información del país en el mensaje.";
        }

        // Filtrado por asunto y cuerpo
        $subject_contains_access_keyword = stripos($overview[0]->subject, "Tu código de acceso temporal") !== false;
        $body_contains_access_keyword = stripos($message_body, "Tu código de acceso temporal") !== false;
        $subject_contains_login_keyword = stripos($overview[0]->subject, "Tu código de inicio de sesión") !== false;
        $body_contains_login_keyword = stripos($message_body, "Ingresa este código para iniciar sesión") !== false;

        

        if ($subject_contains_access_keyword || $body_contains_access_keyword) {
            // Caso para el correo de acceso temporal
            $subject = imap_mime_header_decode($overview[0]->subject)[0]->text;
            $from = $overview[0]->from;
            $date = $overview[0]->date;
            
            // Enviar un mensaje con emoji de éxito
            sendTelegramMessage($chat_id, "🎉 ¡Consulta exitosa!\n\nProcesando los detalles...");

            // Retraso de 3 segundos
            sleep(3);

            $response = "📬 Resultado de la búsqueda:\n";
            $response .= "📝 Asunto: $subject\n";
            $response .= "📧 De: $from\n";
            $response .= "📧 A: $message\n";
            $response .= "📅 Fecha: $date\n";
            $response .= "🌍 País: $country_info \n\n";
            $response .= "✉️ " . $message_body;

            if (strpos($message_body, "Obtener código") !== false) {
                preg_match('/https:\/\/www\.netflix\.com\/account\/travel\/verify\?[^\s]+/', $message_body, $matches);
                $link_to_send = $matches[0] ?? '';
                if (!empty($link_to_send)) {
                    $response = strstr($response, "Obtener código", true); // Eliminar después del enlace
                    $response .= "\n\n* El enlace vence en 15 minutos.";
                    $response .= "\n\nBy interplay 😎";
                    $response .= "\n\nPresiona el botón para generar el código:👇";
                    sendTelegramButtonMessage($chat_id, $response, $link_to_send, "🔗 Obtener Código");
                }
            } else {
                sendTelegramMessage($chat_id, $response);
            }
        } elseif ($subject_contains_login_keyword || $body_contains_login_keyword) {
            // Caso para el correo de inicio de sesión
            $subject = imap_mime_header_decode($overview[0]->subject)[0]->text;
            $from = $overview[0]->from;
            $date = $overview[0]->date;

            // Buscar el código en el cuerpo del mensaje
            if (preg_match('/Ingresa este código para iniciar sesión\s*(\d{4})/is', $message_body, $matches)) {
                $verification_code = $matches[1];

                // Enviar un mensaje con emoji de éxito
                sendTelegramMessage($chat_id, "🎉 ¡Consulta exitosa!\n\nProcesando los detalles...");

                // Retraso de 3 segundos
                sleep(3);

                // Enviar el código encontrado al usuario con el formato deseado
                $response = "📬 Resultado de la búsqueda:\n";
                $response .= "📝 Asunto: $subject\n";
                $response .= "📧 De: $from\n";
                $response .= "📧 A: $message\n";
                $response .= "📅 Fecha: $date\n";
                $response .= "🌍 País: $country_info . \n\n";
                $response .= "✉️ Ingresa este código en tu dispositivo para iniciar sesión en Netflix. El código vence en 15 minutos.\n\n";
                $response .= "Código: `$verification_code`\n\n";
                $response .= "By interplay 😎";
                sendTelegramMessage($chat_id, $response);
            } else {
                // Enviar el contenido del correo si no se encuentra el código
                $response = "📬 Resultado de la búsqueda:\n";
                $response .= "📝 Asunto: $subject\n";
                $response .= "📧 De: $from\n";
                $response .= "📧 A: $message\n";
                $response .= "📅 Fecha: $date\n";
                $response .= "🌍 País: $country_info . \n\n";
                $response .= "✉️ " . $message_body;
                sendTelegramMessage($chat_id, $response);
            }
        } else {
            sendTelegramMessage($chat_id, "🔍 No se encontró contenido relevante en el correo electrónico.");
        }

        imap_close($inbox);
    } else {
        sendTelegramMessage($chat_id, "⚠️ No se encontró ningún correo del remitente consultado en los últimos 30 minutos.");
    }
break;

case "prime":
    $inbox = imap_open(IMAP_HOST, IMAP_USERNAME, IMAP_PASSWORD);
    if (!$inbox) {
        sendTelegramMessage($chat_id, "❌ No se pudo conectar al servidor de correo.");
        exit();
    }

    sendTelegramMessage($chat_id, "✅ Conexión al servidor de correo exitosa. 📧 Buscando correos recientes...");

    $emails = searchEmails($inbox);
    if (!$emails) {
        sendTelegramMessage($chat_id, "⚠️ No se encontraron mensajes recientes.\n\n🔍 Sugerencia:\n Verifica que el correo ingresado sea correcto o intenta nuevamente en unos minutos.");
        imap_close($inbox);
        exit();
    }

    sendTelegramMessage($chat_id, "✉️ Correos encontrados: " . count($emails) . ". Procesando...");

    rsort($emails);
    $codigo_encontrado = false;

    foreach ($emails as $email) {
        $overview = imap_fetch_overview($inbox, $email, 0)[0];
        $to_address = imap_rfc822_parse_adrlist($overview->to, "");
        $to_email = $to_address[0]->mailbox . '@' . $to_address[0]->host;
        $from_address = imap_rfc822_parse_adrlist($overview->from, "");
        $from_email = $from_address[0]->mailbox . '@' . $from_address[0]->host;

        if (strtolower($to_email) == strtolower($consulted_email) || strtolower($from_email) == strtolower($consulted_email)) {
            $subject = decodeMimeStr($overview->subject);

            // Palabras clave en el asunto para Amazon Prime en tres idiomas
            $subject_patterns = [
                'es' => '/amazon.com: Intento de inicio de sesión/i',
                'en' => '/amazon.com: Sign-in attempt/i',
                'ar' => '/amazon.eg: محاولة تسجيل الدخول/i'
            ];

            $language = '';
            foreach ($subject_patterns as $lang => $pattern) {
                if (preg_match($pattern, $subject)) {
                    $language = $lang;
                    break;
                }
            }

            if ($language) {
                $message_body = getPart($inbox, $email, 'HTML');
                if (empty($message_body)) {
                    $message_body = getPart($inbox, $email, 'PLAIN');
                }

                $message_body = quoted_printable_decode($message_body);
                $message_body = html_entity_decode(strip_tags($message_body), ENT_QUOTES, 'UTF-8');

                // Patrón de búsqueda del código en el cuerpo del mensaje
                $body_pattern = '';
                switch ($language) {
                    case 'es':
                        $body_pattern = '/si este fue tu intento.*?(\d{6})/is';
                        break;
                    case 'en':
                        $body_pattern = '/if this was you.*?(\d{6})/is';
                        break;
                    case 'ar':
                        $body_pattern = '/إذا كنت أنت.*?(\d{6})/is';
                        break;
                }

                if (preg_match($body_pattern, $message_body, $matches)) {
                    $verification_code = $matches[1];

                    // Detalles del correo
                    $from = $overview->from;
                    $date = $overview->date;

                    sendTelegramMessage($chat_id, "🎉 ¡Consulta exitosa!\n\nProcesando los detalles...");
                    sleep(3);

                    $response = "📬 Resultado de la búsqueda:\n";
                    $response .= "📝 Asunto: $subject\n";
                    $response .= "📧 De: $from\n";
                    $response .= "📬 A: $to_email\n";
                    $response .= "📅 Fecha: $date\n";
                    $response .= "\n\n🔑 Tu código de verificación es: `$verification_code`\n";
                    $response .= "\n\nBy interplay 😎";
                    sendTelegramMessage($chat_id, $response);
                    $codigo_encontrado = true;
                    break;
                }
            }
        }
    }

    if (!$codigo_encontrado) {
        sendTelegramMessage($chat_id, "🔍 No se encontró contenido relevante en el correo electrónico.");
    }

    imap_close($inbox);
    break;
        }// fin del swithc

    }//fin if antes del switch
    
}
// Verificación de callback_query para el manejo de botones desde el inicio del código
if (isset($update['callback_query'])) {
    $callbackQuery = $update['callback_query'];
    $callbackData = $callbackQuery['data'];
    $chat_id = $callbackQuery['message']['chat']['id']; // Aseguramos que $chat_id esté definido
    $callbackMessageId = $callbackQuery['message']['message_id'];

    // Confirmación para que desaparezca el "cargando" en Telegram
    $callbackId = $callbackQuery['id'];
    sendTelegramCallbackResponse($callbackId, "Procesando tu respuesta...");

    if ($callbackData === 'yes') {
        // Mensaje para reiniciar con el menú inicial
        $welcomeMessage = "👋 ¡Hola de nuevo! Selecciona una plataforma para consultar otro código:";
        $replyMarkup = json_encode([
            'keyboard' => [
                [['text' => 'Netflix'], ['text' => 'Disney']],
                [['text' => 'Prime']],
            ],
            'resize_keyboard' => true,
            'one_time_keyboard' => true,
        ]);
        sendTelegramMessage($chat_id, $welcomeMessage, $replyMarkup);
        exit(); // Salir después de manejar el botón "Sí"
        
    } elseif ($callbackData === 'no') {
        // Mensaje de despedida
        sendTelegramMessage($chat_id, "😊 Fue un gusto ayudarte. ¡Que tengas un gran día! 👋");
        exit(); // Salir después de manejar el botón "No"
    }
}
// Después de la consulta, mensaje de pregunta con botones "Sí" y "No"
sendTelegramMessage($chat_id, "¿Hay otro correo que te gustaría consultar?", json_encode([
    'inline_keyboard' => [
        [['text' => 'Sí', 'callback_data' => 'yes'], ['text' => 'No', 'callback_data' => 'no']]
    ]
]));
// Función para responder al callback y confirmar que se recibió el evento
function sendTelegramCallbackResponse($callback_id, $text) {
    global $telegram_token;
    $url = "https://api.telegram.org/bot$telegram_token/answerCallbackQuery";
    $data = [
        'callback_query_id' => $callback_id,
        'text' => $text,
        'show_alert' => false,
    ];
    file_get_contents($url . '?' . http_build_query($data));
}

   // Función para enviar un mensaje con botón
        function sendTelegramButtonMessage($chat_id, $message, $url, $button_text) {
    global $telegram_token;
    $telegram_url = "https://api.telegram.org/bot$telegram_token/sendMessage";

    $data = [
        'chat_id' => $chat_id,
        'text' => $message,
        'reply_markup' => json_encode([
            'inline_keyboard' => [[['text' => $button_text, 'url' => $url]]]
        ])
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ]
    ];

    $context = stream_context_create($options);
    file_get_contents($telegram_url, false, $context);
}

// Función para enviar un mensaje sin botón
function sendTelegramMessage($chat_id, $message, $reply_markup = null) {
    global $telegram_token;
    $url = "https://api.telegram.org/bot$telegram_token/sendMessage";

    // Escapar caracteres especiales para MarkdownV2
 $message = preg_replace('/([*_\\[\\]()~>#+=|{}.!-])/', '\\\\$1', $message);


    // Dividir el mensaje en partes más pequeñas
    $parts = str_split($message, 1000); // Dividir en partes de 1000 caracteres

    foreach ($parts as $part) {
        $data = [
            'chat_id' => $chat_id,
            'text' => $part,
            'parse_mode' => 'MarkdownV2',  // Usar MarkdownV2 para mejor compatibilidad
        ];

        // Agregar reply_markup si se proporciona
        if ($reply_markup) {
            $data['reply_markup'] = $reply_markup; // Asegúrate de que no esté codificado en JSON aquí
        }

        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data),
            ],
        ];

        $context  = stream_context_create($options);

        // Captura la respuesta de la API de Telegram
        $response = file_get_contents($url, false, $context);

        // Si falla, maneja el error adecuadamente
        if ($response === FALSE) {
            error_log("Error al enviar mensaje a Telegram con contenido: " . $part);
            return false; // Para la ejecución si hay un error
        }
    }
    return true;
}


?>