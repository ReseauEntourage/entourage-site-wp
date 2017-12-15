<?php
/*
Plugin Name:  Entourage
Plugin URI:   https://github.com/ReseauEntourage/entourage-site-wp/tree/master/theme
Version:      1
*/

namespace Entourage\Plugins;

class ActionPreviewRouter {
  private $is_action_preview = false;

  public function __construct() {
    add_filter('do_parse_request',   [$this, 'do_parse_request'], 10, 2);
    add_filter('redirect_canonical', [$this, 'redirect_canonical'], 10, 2);
  }

  public function do_parse_request($do_parse, $wp) {
    $current_url = $this->get_current_url();

    if (preg_match('/^\/entourages\/([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}|e[a-zA-Z0-9_-]{11})$/', $current_url)) {

       $this->$is_action_preview = true;
       $wp->query_vars = [];
       return false;
    }

    return $do_parse;
  }

  public function redirect_canonical($redirect_url, $requested_url) {
    if ($this->$is_action_preview) {
      return false;
    }

    return $redirect_url;
  }

  private function get_current_url() {
    $current_url = esc_url_raw(add_query_arg([]));
    $home_path = parse_url(home_url(), PHP_URL_PATH);
    if ($home_path && strpos($current_url, $home_path) === 0) {
      $current_url = substr($current_url, strlen($home_path));
    }

    return $current_url;
  }
}

new ActionPreviewRouter;
?>
