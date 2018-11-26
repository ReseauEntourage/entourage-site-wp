<?php
  try {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL,            "https://api.stripe.com/v1");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT,        3);

    curl_exec($ch);

    $errNo = curl_errno($ch);
    $error = curl_error($ch);
    $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($responseCode === 401 && $errNo === 0 && $error === '') {
      $status = 'success';
    } else {
      $status = 'error';
    }
  } catch (\Throwable $e) {
    $status = 'error';
    $errNo = null;
    $error = $e->getMessage();
    $responseCode = null;
  }

  $json = json_encode(
    [
      [
        'timestamp'    => time(),
        'status'       => $status,
        'errNo'        => $errNo,
        'error'        => $error,
        'responseCode' => $responseCode
      ]
    ],
    JSON_PRETTY_PRINT
  );

  echo $json."\n";
?>
