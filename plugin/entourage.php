<?php
/*
Plugin Name:  Entourage
Plugin URI:   https://github.com/ReseauEntourage/entourage-site-wp/tree/master/theme
Version:      1
*/

namespace Entourage\Plugins;

class Utils {
  public static function get_current_url() {
    $current_url = esc_url_raw(add_query_arg([]));
    $home_path = parse_url(home_url(), PHP_URL_PATH);
    if ($home_path && strpos($current_url, $home_path) === 0) {
      $current_url = substr($current_url, strlen($home_path));
    }

    return parse_url($current_url, PHP_URL_PATH);
  }
}

class ActionPreviewRouter {
  private $is_action_preview = false;

  public function __construct() {
    add_filter('do_parse_request',   [$this, 'do_parse_request'], 10, 2);
    add_filter('redirect_canonical', [$this, 'redirect_canonical'], 10, 2);
  }

  public function do_parse_request($do_parse, $wp) {
    $current_url = Utils::get_current_url();

    if (preg_match('/^\/entourages\/([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}|e[a-zA-Z0-9_-]{11})$/', $current_url)) {
       $this->is_action_preview = true;
       $wp->query_vars = [];
       return false;
    }

    return $do_parse;
  }

  public function redirect_canonical($redirect_url, $requested_url) {
    if ($this->is_action_preview) {
      return false;
    }

    return $redirect_url;
  }
}

class DonationRouter {
  private $presets = [
    'S1' => [
      'once'      => [15, 35, 50, 100],
      'regular'   => [ 2,  5,  8, 15],
      'selected'  =>  15,
    ],
    'S2' => [
      'once'      => [25, 35, 50, 150],
      'regular'   => [ 5, 10, 15, 25],
      'selected'  =>  35,
    ],
    'S3' => [
      'once'      => [15, 25, 35, 50],
      'regular'   => [ 2,  5,  8, 15],
      'selected'  =>  15,
    ],
    'S4' => [
      'once'      => [10, 25, 50, 100, 150],
      'regular'   => [10, 15, 25, 30],
      'selected'  =>  50,
    ],
  ];

  public function __construct() {
    add_filter('do_parse_request',   [$this, 'do_parse_request'], 10, 2);
  }

  public function do_parse_request($do_parse, $wp) {
    $current_url = Utils::get_current_url();
    $url_parameters = $_GET;

    if (preg_match('/^\/don\/(.*)$/', $current_url, $path_segments)) {
      if ($path_segments[1] === 's') {
        $url_parameters = array_merge([
          'utm_source'   => '1',
          'utm_medium'   => 'SMS',
          'utm_campaign' => 'DEC2017'
        ], $url_parameters);
      }

      if (preg_match('/.+-(S[1-4])$/', $_GET['utm_source'], $utm_source)) {
        $preset = $this->presets[$utm_source[1]];
        $url_parameters = array_merge($url_parameters, [
          'once_grid'    => array_map([$this, 'to_cents'], $preset['once']),
          'regular_grid' => array_map([$this, 'to_cents'], $preset['regular']),
          'amount'       => $this->to_cents($preset['selected'])
        ]);
      }

      $url = link_with_url_parameters(
        get_option('donate_link'),
        http_build_query($url_parameters)
      );

      wp_redirect($url , 301);
      exit;
    }

    return $do_parse;
  }

  private function to_cents($amount) {
    return $amount * 100;
  }
}

new ActionPreviewRouter;
new DonationRouter;
?>
