;(function() {
  alert('just for test');

  requirejs.config({
    paths: {/* requirejs multibundle mapping */},
    bundles: {/* requirejs multibundle bundles */}
  });

  test();

  // subroutines

  function test() {
    return test();
  }
})();
