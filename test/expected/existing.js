;(function() {
  alert('just for test');

  requirejs.config({
    paths: {"common":"http://static.company-cdn.com/javascript/common.d8cbdeb1970daacdc70c01c3306e31c7","optional":"http://static.company-cdn.com/javascript/optional.f242c6ec7db101d485e624c441061180","maps":"http://static.company-cdn.com/javascript/maps.b371bd03bd498257ded2aae300de5d13","user":"http://static.company-cdn.com/javascript/user.2a25559b93ae406914f97d940e98aa3d"},
    bundles: {"common":["requirejs","rendr/shared","rendr/client","async","backbone","underscore","hammer","jquery","jqueryHammer","main","app/helper","app/lib/tracking/custom"],"optional":["omniture","app/lib/tracking/pixel","app/lib/tracking/omniture"],"maps":["app/models/maps/maps","app/views/maps/maps"],"user":["app/models/user/user","app/views/user/user"]}
  });

  test();

  // subroutines

  function test() {
    return test();
  }
})();
