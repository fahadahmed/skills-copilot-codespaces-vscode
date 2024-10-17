function skillsMmember() {
  return {
    restrict: 'E',
    scope: {
      member: '='
    },
    templateUrl: 'member.html'
  };
}