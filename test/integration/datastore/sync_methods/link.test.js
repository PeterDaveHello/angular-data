describe('DS.link(resourceName, id[, relations])', function () {
  function errorPrefix(resourceName) {
    return 'DS.link(' + resourceName + ', id[, relations]): ';
  }

  beforeEach(startInjector);

  it('should throw an error when method pre-conditions are not met', function () {
    assert.throws(function () {
      DS.link('does not exist', {});
    }, DS.errors.NonexistentResourceError, errorPrefix('does not exist') + 'does not exist is not a registered resource!');

    angular.forEach(TYPES_EXCEPT_STRING_OR_NUMBER, function (key) {
      assert.throws(function () {
        DS.link('post', key);
      }, DS.errors.IllegalArgumentError, errorPrefix('post') + 'id: Must be a string or a number!');
    });
  });
  it('should find links', function () {
    var org66 = DS.inject('organization', {
      id: 66
    });
    var user88 = DS.inject('user', {
      id: 88,
      organizationId: 66
    });
    DS.inject('user', {
      id: 99,
      organizationId: 66
    });
    var profile77 = DS.inject('profile', {
      id: 77,
      userId: 88
    });

    DS.link('user', 88, ['organization']);
    DS.link('user', 88, ['profile']);
    DS.link('organization', 66, ['user']);

    assert.isTrue(user88.organization === org66);
    assert.isTrue(user88.profile === profile77);
    assert.equal(2, org66.users.length);
  });
  it('should find all links', function () {
    var org66 = DS.inject('organization', {
      id: 66
    });
    var user88 = DS.inject('user', {
      id: 88,
      organizationId: 66
    });
    var user99 = DS.inject('user', {
      id: 99,
      organizationId: 66
    });
    var profile77 = DS.inject('profile', {
      id: 77,
      userId: 88
    });

    DS.link('user', 88, []);
    DS.link('user', 88, []);
    DS.link('organization', 66, []);

    assert.isTrue(user88.organization === org66);
    assert.isTrue(user88.profile === profile77);
    assert.isUndefined(user99.profile);
    assert.equal(2, org66.users.length);
  });
});
