Feature: Profiles API testing

  Background:
    * def baseUrl = karate.properties['baseUrl']
    * def username = karate.properties['username']
    * header Authorization = 'Bearer ' + karate.properties['authToken']

  Scenario: Get user data
    Given url baseUrl + '/api/v1/profiles'
    When method get
    Then status 200
    And match response.list == '#[1]'
    And match response.list[0].name == username

  Scenario: Add profile data
    Given url baseUrl + '/api/v1/profiles'
    And request { 'name': 'Karate Test 2' }
    When method post
    Then status 201
    And match response.name == 'Karate Test 2'

  Scenario: Update profile data
    * def profileCode = karate.properties['profileCode']

    Given url baseUrl + '/api/v1/profiles/' + profileCode
    And request { 'name': 'Karate Test' }
    When method put
    Then status 200
    And match response.code == profileCode
    And match response.name == 'Karate Test'
